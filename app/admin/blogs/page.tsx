"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  AdminBlogArticle,
  BlogArticle,
  deleteBlog,
  mergeWithDefaultBlogs,
  restoreDefaultBlogs,
  getDeletedBlogSlugs,
} from "@/lib/blogs";
import { BLOG_ARTICLES } from "@/data/blogs";
import TipTapEditor from "../components/blogs/TipTapEditor";
import {
  generateSlug,
  calculateReadTime,
  calibrateMetaTitle,
  calibrateMetaDescription,
  extractShortVersion,
  uploadBlogImage,
  stripHtml,
} from "@/lib/seo-utils";
import {
  Trash2,
  Plus,
  Edit,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  RotateCw,
  Loader2,
  Save,
  ArrowLeft,
  Sparkles,
  ImageIcon,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Buyer's Guide",
  "Healthcare Operations",
  "Business Setup",
  "Hospitality & Hotels",
  "Energy Efficiency",
  "Finishing & Ironing",
  "Maintenance & Safety",
  "Garment Manufacturing",
];

const AUTHOR_PROFILES = [
  {
    name: "Xcel Stiro Technical Team",
    role: "Industrial Laundry Engineering Since 1994",
  },
  {
    name: "Xcel Stiro Healthcare Advisory",
    role: "Infection Control & Equipment Engineering",
  },
  {
    name: "Xcel Commercial Operations",
    role: "Turnkey Plant Design & ROI Advisory",
  },
  {
    name: "Editorial Contributor",
    role: "Commercial Laundry Operations",
  },
];

const DEFAULT_ACTION_STEPS = [
  "Review your facility daily bed count or total linen volume in kg.",
  "Schedule an on-site technical inspection with Xcel Stiro application engineers.",
  "Request a complimentary utility audit and CAD floorplan layout.",
];

const DEFAULT_DISCLAIMER =
  "Operational guidelines based on technical engineering data from 7000+ machine installations across India. — Xcel Stiro since 1994 | Industrial Laundry. Done Right. —";

const DEFAULT_CTA_TAGLINE = "EXPERT FACILITY SIZING & CONSULTATION";
const DEFAULT_CTA_HEADING = "Want a Free Project Assessment for Your Facility?";
const DEFAULT_CTA_DESCRIPTION =
  "Xcel Stiro offers no-obligation project assessments across India — we calculate your exact load volume, recommend the right machine, and show you the ROI calculation before you spend a rupee.";

/**
 * Converts legacy structured sections to HTML for TipTap editor
 */
function convertSectionsToHtml(article: BlogArticle): string {
  if (article.description) return article.description;
  if (!article.sections || article.sections.length === 0) return "";

  let html = "";
  for (const s of article.sections) {
    if (s.heading) html += `<h2>${s.heading}</h2>`;
    if (s.paragraphs) {
      for (const p of s.paragraphs) {
        html += `<p>${p}</p>`;
      }
    }
    if (s.bullets && s.bullets.length > 0) {
      html += `<ul>`;
      for (const b of s.bullets) {
        html += `<li><strong>${b.title}:</strong> ${b.description}</li>`;
      }
      html += `</ul>`;
    }
    if (s.table && s.table.headers) {
      html += `<table><thead><tr>`;
      for (const h of s.table.headers) {
        html += `<th>${h}</th>`;
      }
      html += `</tr></thead><tbody>`;
      for (const row of s.table.rows || []) {
        html += `<tr>`;
        for (const cell of row) {
          html += `<td>${cell}</td>`;
        }
        html += `</tr>`;
      }
      html += `</tbody></table>`;
      if (s.table.note) {
        html += `<p><em>${s.table.note}</em></p>`;
      }
    }
    if (s.calloutQuote) {
      html += `<blockquote>&ldquo;${s.calloutQuote}&rdquo;</blockquote>`;
    }
  }
  return html;
}

export default function AdminBlogsPage() {
  const router = useRouter();

  // Navigation & Authentication
  const [authChecking, setAuthChecking] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
  const [blogs, setBlogs] = useState<AdminBlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic unique category list (merging defaults with any custom categories in Firestore blogs)
  const allCategories = useMemo(() => {
    const list = [...DEFAULT_CATEGORIES];
    blogs.forEach((b) => {
      const cat = b.category?.trim();
      if (cat && !list.includes(cat)) {
        list.push(cat);
      }
    });
    return list;
  }, [blogs]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Deletion modal
  const [blogToDelete, setBlogToDelete] = useState<AdminBlogArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Leave confirmation modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Restore defaults
  const [isSeeding, setIsSeeding] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // =========================================================================
  // FORM / EDITOR STATE (Single-Screen Cavue Flow)
  // =========================================================================
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(AUTHOR_PROFILES[0].name);
  const [authorRole, setAuthorRole] = useState(AUTHOR_PROFILES[0].role);
  const [publishDate, setPublishDate] = useState("");
  const [lead, setLead] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [description, setDescription] = useState("");
  const [shortVersionPoints, setShortVersionPoints] = useState<string[]>([]);
  const [actionSteps, setActionSteps] = useState<string[]>(DEFAULT_ACTION_STEPS);
  const [disclaimer, setDisclaimer] = useState(DEFAULT_DISCLAIMER);
  const [ctaTagline, setCtaTagline] = useState(DEFAULT_CTA_TAGLINE);
  const [ctaHeading, setCtaHeading] = useState(DEFAULT_CTA_HEADING);
  const [ctaDescription, setCtaDescription] = useState(DEFAULT_CTA_DESCRIPTION);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");

  // UI helpers
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [showCoverUrlInput, setShowCoverUrlInput] = useState(false);
  const [showBannerUrlInput, setShowBannerUrlInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [showSeoAccordion, setShowSeoAccordion] = useState(false);

  const coverFileRef = useRef<HTMLInputElement>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const draftStorageKey = editingBlogId ? `xcel_blog_draft_${editingBlogId}` : "xcel_blog_draft_new";

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // 1. Auth Verification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setAuthChecking(false);
        fetchBlogs();
      } else {
        router.push("/adminloginn");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/adminloginn");
  };

  // 2. Fetch blogs from Firestore merged with defaults (respecting permanent deletions)
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const blogsColl = collection(db, "blogs");
      const [snap, deletedSlugs] = await Promise.all([
        getDocs(blogsColl),
        getDeletedBlogSlugs(),
      ]);

      const list: AdminBlogArticle[] = [];
      if (!snap.empty) {
        snap.forEach((docSnap: any) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as AdminBlogArticle);
        });
      }

      const merged = mergeWithDefaultBlogs(list, deletedSlugs);
      setBlogs(merged);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setBlogs(BLOG_ARTICLES.map((a) => ({ ...a, id: `default-${a.id}`, status: "published" })));
    } finally {
      setLoading(false);
    }
  }, []);

  // Move blog position up/down
  const handleMoveBlog = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blogs.length) return;

    const copy = [...blogs];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setBlogs(copy);
    showToast("Sequence updated locally.", "info");
  };

  // 3. Title Change Handler (Auto-generates slug)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(generateSlug(val));
    }
  };

  // 4. Author Change Handler
  const handleAuthorChange = (name: string) => {
    setSelectedAuthor(name);
    const profile = AUTHOR_PROFILES.find((p) => p.name === name);
    if (profile) {
      setAuthorRole(profile.role);
    }
  };

  // 5. Open Create Screen
  const handleOpenCreate = () => {
    setEditingBlogId(null);
    setTitle("");
    setSlug("");
    setIsSlugManual(false);
    setCategory(DEFAULT_CATEGORIES[0]);
    setIsCustomCategory(false);
    setCustomCategory("");
    setSelectedAuthor(AUTHOR_PROFILES[0].name);
    setAuthorRole(AUTHOR_PROFILES[0].role);
    setPublishDate(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
    setLead("");
    setCoverImage("");
    setBannerImage("");
    setShowCoverUrlInput(false);
    setShowBannerUrlInput(false);
    setDescription("");
    setShortVersionPoints([
      "Industrial equipment sizing requires analyzing daily linen throughput in kg and shift turnaround times.",
      "High G-force spin extraction drastically cuts subsequent drying power by up to 40%.",
      "Factory-direct service support and certified spare parts protect capital ROI over a 15-20 year operational lifespan.",
    ]);
    setActionSteps(DEFAULT_ACTION_STEPS);
    setDisclaimer(DEFAULT_DISCLAIMER);
    setCtaTagline(DEFAULT_CTA_TAGLINE);
    setCtaHeading(DEFAULT_CTA_HEADING);
    setCtaDescription(DEFAULT_CTA_DESCRIPTION);
    setMetaTitle("");
    setMetaDescription("");
    setStatus("published");
    setFormError("");
    setViewMode("create");
  };

  // 6. Open Edit Screen
  const handleStartEdit = (blog: AdminBlogArticle) => {
    setEditingBlogId(blog.id);
    setTitle(blog.title || "");
    setSlug(blog.slug || "");
    setIsSlugManual(true);
    const blogCat = blog.category?.trim() || DEFAULT_CATEGORIES[0];
    if (allCategories.includes(blogCat) || DEFAULT_CATEGORIES.includes(blogCat)) {
      setCategory(blogCat);
      setIsCustomCategory(false);
      setCustomCategory("");
    } else {
      setCategory(blogCat);
      setIsCustomCategory(true);
      setCustomCategory(blogCat);
    }
    setSelectedAuthor(blog.author || AUTHOR_PROFILES[0].name);
    setAuthorRole(blog.authorRole || AUTHOR_PROFILES[0].role);
    setPublishDate(blog.date || "");
    setLead(blog.lead || "");
    setCoverImage(blog.imageSrc || "");
    setBannerImage(blog.bannerSrc || "");
    setShowCoverUrlInput(false);
    setShowBannerUrlInput(false);
    setDescription(convertSectionsToHtml(blog));
    setShortVersionPoints(blog.shortVersion && blog.shortVersion.length > 0 ? blog.shortVersion : []);
    setActionSteps(blog.actionSteps && blog.actionSteps.length > 0 ? blog.actionSteps : DEFAULT_ACTION_STEPS);
    setDisclaimer(blog.disclaimer || DEFAULT_DISCLAIMER);
    setCtaTagline(blog.ctaTagline || DEFAULT_CTA_TAGLINE);
    setCtaHeading(blog.ctaHeading || DEFAULT_CTA_HEADING);
    setCtaDescription(blog.ctaDescription || DEFAULT_CTA_DESCRIPTION);
    setMetaTitle(blog.metaTitle || "");
    setMetaDescription(blog.metaDescription || "");
    setStatus(blog.status || "published");
    setFormError("");
    setViewMode("edit");
  };

  // 7. Check for autosaved local draft
  useEffect(() => {
    if (viewMode === "list" || typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(draftStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title || parsed.description) {
          setHasDraft(true);
        }
      }
    } catch (e) {
      console.warn("Draft check warning:", e);
    }
  }, [viewMode, draftStorageKey]);

  // 8. 1-second debounced autosave to localStorage
  useEffect(() => {
    if (viewMode === "list") return;
    const timer = setTimeout(() => {
      if (title.trim() || description.trim()) {
        const draftData = {
          title,
          slug,
          category,
          isCustomCategory,
          customCategory,
          selectedAuthor,
          authorRole,
          publishDate,
          lead,
          coverImage,
          bannerImage,
          description,
          shortVersionPoints,
          actionSteps,
          ctaTagline,
          ctaHeading,
          ctaDescription,
          metaTitle,
          metaDescription,
          status,
          savedAt: new Date().toLocaleTimeString(),
        };
        try {
          localStorage.setItem(draftStorageKey, JSON.stringify(draftData));
          setDraftSavedAt(draftData.savedAt);
        } catch (e) {
          console.warn("Autosave storage full:", e);
        }
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    title,
    slug,
    category,
    isCustomCategory,
    customCategory,
    selectedAuthor,
    authorRole,
    publishDate,
    lead,
    coverImage,
    bannerImage,
    description,
    shortVersionPoints,
    actionSteps,
    ctaTagline,
    ctaHeading,
    ctaDescription,
    metaTitle,
    metaDescription,
    status,
    viewMode,
    draftStorageKey,
  ]);

  const handleRestoreDraft = () => {
    try {
      const saved = localStorage.getItem(draftStorageKey);
      if (saved) {
        const p = JSON.parse(saved);
        if (p.title !== undefined) setTitle(p.title);
        if (p.slug !== undefined) setSlug(p.slug);
        if (p.category !== undefined) {
          setCategory(p.category);
          if (p.isCustomCategory || (!DEFAULT_CATEGORIES.includes(p.category) && !allCategories.includes(p.category))) {
            setIsCustomCategory(true);
            setCustomCategory(p.customCategory || p.category);
          } else {
            setIsCustomCategory(false);
            setCustomCategory("");
          }
        }
        if (p.selectedAuthor !== undefined) setSelectedAuthor(p.selectedAuthor);
        if (p.authorRole !== undefined) setAuthorRole(p.authorRole);
        if (p.publishDate !== undefined) setPublishDate(p.publishDate);
        if (p.lead !== undefined) setLead(p.lead);
        if (p.coverImage !== undefined) setCoverImage(p.coverImage);
        if (p.bannerImage !== undefined) setBannerImage(p.bannerImage);
        if (p.description !== undefined) setDescription(p.description);
        if (p.shortVersionPoints !== undefined) setShortVersionPoints(p.shortVersionPoints);
        if (p.actionSteps !== undefined) setActionSteps(p.actionSteps);
        if (p.ctaTagline !== undefined) setCtaTagline(p.ctaTagline);
        if (p.ctaHeading !== undefined) setCtaHeading(p.ctaHeading);
        if (p.ctaDescription !== undefined) setCtaDescription(p.ctaDescription);
        if (p.metaTitle !== undefined) setMetaTitle(p.metaTitle);
        if (p.metaDescription !== undefined) setMetaDescription(p.metaDescription);
        if (p.status !== undefined) setStatus(p.status);
        setHasDraft(false);
        showToast("Restored unsaved draft from local storage.", "info");
      }
    } catch (e) {
      console.error("Failed to restore draft:", e);
    }
  };

  // 9. Cover Image Upload (with Canvas auto-compression)
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const url = await uploadBlogImage(file, "blog-covers");
      setCoverImage(url);
      if (!bannerImage) {
        setBannerImage(url);
      }
      showToast("Cover image compressed and uploaded.", "success");
    } catch (err) {
      console.error("Error uploading cover image:", err);
      showToast("Failed to upload image. Please check your connection.", "error");
    } finally {
      setIsUploadingCover(false);
      if (coverFileRef.current) coverFileRef.current.value = "";
    }
  };

  // 10. Inside Blog Hero Banner Upload (with Canvas auto-compression)
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingBanner(true);
      const url = await uploadBlogImage(file, "blog-banners");
      setBannerImage(url);
      showToast("Inside hero banner compressed and uploaded.", "success");
    } catch (err) {
      console.error("Error uploading hero banner:", err);
      showToast("Failed to upload hero banner. Please check your connection.", "error");
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileRef.current) bannerFileRef.current.value = "";
    }
  };

  // 11. Auto-extract Short Version points from TipTap HTML
  const handleAutoExtractShortVersion = () => {
    if (!description.trim()) {
      showToast("Add article content first to extract summary points.", "error");
      return;
    }
    const extracted = extractShortVersion(description, 4);
    if (extracted.length > 0) {
      setShortVersionPoints(extracted);
      showToast(`Auto-extracted ${extracted.length} key takeaway points.`, "success");
    } else {
      showToast("Could not find suitable bullet points or paragraphs in article.", "info");
    }
  };

  // 11. Auto-extract Lead from TipTap HTML
  const handleAutoExtractLead = () => {
    if (!description.trim()) {
      showToast("Add article content first.", "error");
      return;
    }
    const clean = stripHtml(description);
    const firstSentence = clean.split(/(?<=[.?!])\s+/)[0] || clean.substring(0, 180);
    setLead(firstSentence.trim());
    showToast("Lead excerpt extracted from opening content.", "success");
  };

  // 12. Submit / Save Article to Firestore
  const handleSubmitArticle = async (saveStatus: "published" | "draft") => {
    setFormError("");

    if (!title.trim()) {
      setFormError("Please enter an article title.");
      return;
    }

    const cleanSlug = (slug.trim() || generateSlug(title)).toLowerCase();
    if (!cleanSlug) {
      setFormError("Please provide a URL slug.");
      return;
    }

    if (!description.trim() || description === "<p></p>") {
      setFormError("Please add editorial content to the article.");
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category.trim();
    if (isCustomCategory && !finalCategory) {
      setFormError("Please enter a name for your custom category.");
      return;
    }

    try {
      setIsSaving(true);

      const calculatedRead = calculateReadTime(description);
      const finalLead = lead.trim() || calibrateMetaDescription(description, title);
      const finalMetaTitle = metaTitle.trim() || calibrateMetaTitle(title);
      const finalMetaDesc = metaDescription.trim() || calibrateMetaDescription(description, title);
      const finalImage = coverImage || "/blog1/Blog 1- 1080 x 1080.svg";
      const finalBanner = bannerImage || finalImage;

      const payload: Partial<BlogArticle> = {
        title: title.trim(),
        slug: cleanSlug,
        category: finalCategory || DEFAULT_CATEGORIES[0],
        author: selectedAuthor,
        authorRole,
        date: publishDate || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        readTime: calculatedRead,
        lead: finalLead,
        imageSrc: finalImage,
        bannerSrc: finalBanner,
        description,
        shortVersion: shortVersionPoints.filter((p) => p.trim()),
        actionSteps: actionSteps.filter((s) => s.trim()),
        disclaimer: disclaimer.trim() || DEFAULT_DISCLAIMER,
        ctaTagline: ctaTagline.trim() || DEFAULT_CTA_TAGLINE,
        ctaHeading: ctaHeading.trim() || DEFAULT_CTA_HEADING,
        ctaDescription: ctaDescription.trim() || DEFAULT_CTA_DESCRIPTION,
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDesc,
        status: saveStatus,
        updatedAt: serverTimestamp(),
      };

      if (viewMode === "edit" && editingBlogId) {
        if (editingBlogId.startsWith("default-")) {
          const docRef = doc(db, "blogs", editingBlogId);
          await updateDoc(docRef, payload as any).catch(async () => {
            await addDoc(collection(db, "blogs"), {
              ...payload,
              createdAt: serverTimestamp(),
            });
          });
        } else {
          const docRef = doc(db, "blogs", editingBlogId);
          await updateDoc(docRef, payload as any);
        }
        showToast("Article updated successfully!", "success");
      } else {
        await addDoc(collection(db, "blogs"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        showToast("Article published successfully!", "success");
      }

      localStorage.removeItem(draftStorageKey);
      setHasDraft(false);

      await fetchBlogs();
      setViewMode("list");
    } catch (err) {
      console.error("Error saving article:", err);
      setFormError("Failed to save article. Please verify Firestore connection.");
    } finally {
      setIsSaving(false);
    }
  };

  // 13. Confirm Delete Blog
  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      setIsDeleting(true);
      await deleteBlog(blogToDelete);
      showToast("Article deleted.", "info");
      setBlogToDelete(null);
      await fetchBlogs();
    } catch (err) {
      console.error("Failed to delete article:", err);
      showToast("Failed to delete article. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // 14. Restore Default 4 Blogs
  const handleRestoreDefaults = async () => {
    if (!confirm("Restore the 4 original XCEL technical insight blogs into Firestore?")) return;
    try {
      setIsSeeding(true);
      const res = await restoreDefaultBlogs();
      showToast(`Restored ${res.restored} core articles.`, "success");
      await fetchBlogs();
    } catch (err) {
      console.error("Error restoring defaults:", err);
      alert("Failed to restore default blogs.");
    } finally {
      setIsSeeding(false);
    }
  };

  // Filtered Blogs for List View
  const filteredBlogs = useMemo(() => {
    let result = [...blogs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.slug?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q)
      );
    }

    if (selectedCategoryFilter !== "all") {
      result = result.filter(
        (b) => b.category?.toLowerCase() === selectedCategoryFilter.toLowerCase()
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => (b.status || "published") === statusFilter);
    }

    return result;
  }, [blogs, searchQuery, selectedCategoryFilter, statusFilter]);

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-sans">
        Authenticating...
      </div>
    );
  }

  // =========================================================================
  // VIEW: CREATE / EDIT STUDIO (TipTap WYSIWYG)
  // =========================================================================
  if (viewMode === "create" || viewMode === "edit") {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans pb-24">
        {/* Leave Without Saving Confirmation Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle size={22} />
                <h3 className="font-bold text-lg text-gray-900">Leave Without Saving?</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Are you sure you want to return to the dashboard? Your changes are automatically stored in draft and can be restored when you return.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  Stay and Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLeaveModal(false);
                    setViewMode("list");
                  }}
                  className="bg-[#0a2766] hover:bg-[#123985] text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors cursor-pointer"
                >
                  Leave Page
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <button
                type="button"
                onClick={() => {
                  if (title.trim() || description.trim()) {
                    setShowLeaveModal(true);
                  } else {
                    setViewMode("list");
                  }
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#32589c] hover:text-[#0a2766] transition-colors mb-2 cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back to Blogs Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold text-[#0a2766]">
                {viewMode === "edit" ? "Edit Blog Article" : "Create New Blog"}
              </h1>
              <p className="text-[#363636] mt-1 text-sm">
                Write rich technical insights with live formatting, automatic metadata, and zero manual tabs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {hasDraft && (
                <button
                  type="button"
                  onClick={handleRestoreDraft}
                  className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  Restore Draft
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSubmitArticle("draft")}
                disabled={isSaving}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
              >
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => handleSubmitArticle("published")}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#32589c] text-white px-5 py-2 rounded shadow-md hover:bg-[#1f3a6a] transition-colors font-medium cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Publish Article</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {formError && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertTriangle size={18} className="shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Grid Layout: Left Editorial Body / Right Metadata Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Editorial Pane */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title & Excerpt Box */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0a2766] mb-1.5">
                    Blog Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Industrial Washing Machine Price in India 2026 — What You Should Expect to Pay"
                    className="w-full text-lg sm:text-xl font-bold text-[#0a2766] placeholder:text-gray-300 border border-gray-300 rounded px-3.5 py-2.5 focus:outline-none focus:border-[#32589c]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Opening Lead / Card Subheading
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoExtractLead}
                      className="text-xs text-[#32589c] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={13} />
                      <span>Auto-fill from body</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    placeholder="Brief 1-2 sentence executive summary displayed at the top of the article and on catalog preview cards..."
                    className="w-full text-sm text-gray-700 rounded border border-gray-300 p-2.5 focus:outline-none focus:border-[#32589c] resize-none"
                  />
                </div>
              </div>

              {/* TipTap Rich Editor */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#0a2766] uppercase tracking-wide">
                      Article Editorial Body
                    </h3>
                    <p className="text-xs text-gray-500">
                      Format headings (H2/H3), bullet lists, pull quotes, and equipment comparison tables directly in the editor.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#32589c] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    {calculateReadTime(description)}
                  </span>
                </div>

                <TipTapEditor content={description} onChange={setDescription} />
              </div>

              {/* In-Article Consultation CTA Banner Settings */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#0a2766] uppercase tracking-wide">
                      In-Article Call to Action (CTA) Banner
                    </h3>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                      Editable Section
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Edit the text content of the high-conversion consultation banner that appears in this article. The button automatically routes visitors to the Contact page.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      CTA Tagline / Subtitle (Eyebrow)
                    </label>
                    <input
                      type="text"
                      value={ctaTagline}
                      onChange={(e) => setCtaTagline(e.target.value)}
                      placeholder="e.g. EXPERT FACILITY SIZING & CONSULTATION"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 uppercase tracking-wider focus:outline-none focus:border-[#32589c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      CTA Heading
                    </label>
                    <input
                      type="text"
                      value={ctaHeading}
                      onChange={(e) => setCtaHeading(e.target.value)}
                      placeholder="e.g. Want a Free Project Assessment for Your Facility?"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:border-[#32589c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      CTA Description
                    </label>
                    <textarea
                      rows={3}
                      value={ctaDescription}
                      onChange={(e) => setCtaDescription(e.target.value)}
                      placeholder="e.g. Xcel Stiro offers no-obligation project assessments across India..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-[#32589c] resize-y"
                    />
                  </div>

                  {/* Live Card Preview */}
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Live CTA Banner Preview
                    </span>
                    <div className="bg-gradient-to-r from-[#0a2766] to-[#1a3d82] text-white rounded-xl p-6 sm:p-7 shadow-sm">
                      <span className="text-blue-200 text-xs font-bold tracking-widest uppercase block mb-2">
                        {ctaTagline || DEFAULT_CTA_TAGLINE}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
                        {ctaHeading || DEFAULT_CTA_HEADING}
                      </h4>
                      <p className="text-blue-100 text-sm leading-relaxed mb-5 max-w-2xl">
                        {ctaDescription || DEFAULT_CTA_DESCRIPTION}
                      </p>
                      <div className="inline-flex items-center gap-2 bg-white text-[#0a2766] font-bold text-sm px-5 py-3 rounded-xl shadow-sm cursor-default">
                        <span>Contact Us for Free Assessment</span>
                        <ChevronRight className="w-4 h-4 text-[#3b5b95]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Settings Sidebar (Sticky alongside the editorial body) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto custom-scrollbar pr-1 pb-4">
              {/* Section 1: Blog Card Image (1:1 Ratio) */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2766]">
                      1. Blog Card Image
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      1:1 Square &bull; Rec: 1080 &times; 1080 px
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Listing Cards
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Featured on the blog catalog listing cards, mobile article header, and related post widgets.
                </p>

                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />

                {coverImage ? (
                  <div className="space-y-2.5">
                      <div className="relative w-full aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shadow-inner">
                        <img
                          src={coverImage}
                          alt="Card Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            type="button"
                            onClick={() => coverFileRef.current?.click()}
                            className="text-[#32589c] hover:underline font-semibold cursor-pointer"
                          >
                            Change Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCoverUrlInput(!showCoverUrlInput)}
                            className="text-gray-500 hover:text-gray-700 hover:underline cursor-pointer"
                          >
                            {showCoverUrlInput ? "Hide Path" : "Direct Path / URL"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoverImage("")}
                            className="text-red-500 hover:underline font-semibold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      ) : (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => coverFileRef.current?.click()}
                          disabled={isUploadingCover}
                          className="w-full aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#32589c] bg-gray-50 hover:bg-white flex flex-col items-center justify-center text-gray-500 hover:text-[#0a2766] transition-all p-4 cursor-pointer"
                        >
                          {isUploadingCover ? (
                            <div className="flex flex-col items-center gap-2">
                              <Loader2 size={24} className="animate-spin text-[#32589c]" />
                              <span className="text-xs font-medium">Compressing Image...</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-center">
                              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#32589c]">
                                <ImageIcon size={24} />
                              </div>
                              <span className="text-xs font-bold text-[#0a2766]">Upload Card Image (1:1)</span>
                              <span className="text-[11px] text-gray-400">
                                Square 1080 &times; 1080 px (WebP Compressed)
                              </span>
                            </div>
                          )}
                        </button>
                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => setShowCoverUrlInput(!showCoverUrlInput)}
                            className="text-[11px] text-[#32589c] hover:underline font-medium cursor-pointer"
                          >
                            {showCoverUrlInput ? "Hide path/URL input" : "Or enter custom path / URL"}
                          </button>
                        </div>
                      </div>
                )}

                      {showCoverUrlInput && (
                        <div className="pt-2 border-t border-gray-100 space-y-1">
                          <label className="block text-[11px] font-semibold text-gray-600">
                            Card Image URL or /public path
                          </label>
                          <input
                            type="text"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            placeholder="e.g. /blog1/Blog 1- 1080 x 1080.svg or https://..."
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#32589c]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Section 2: Inside Blog Hero Banner (8:3 Ratio) */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2766]">
                            2. Inside Blog Hero Banner
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            8:3 Wide Banner &bull; Rec: 1600 &times; 600 px
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Desktop Hero
                        </span>
                      </div>

                      <p className="text-xs text-gray-500">
                        Featured across the full width of the article page header on desktop screens.
                      </p>

                      <input
                        ref={bannerFileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />

                      {bannerImage ? (
                        <div className="space-y-2.5">
                          <div className="relative w-full aspect-[16/6] rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shadow-inner">
                            <img
                              src={bannerImage}
                              alt="Hero Banner Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between text-xs pt-1">
                            <button
                              type="button"
                              onClick={() => bannerFileRef.current?.click()}
                              className="text-[#32589c] hover:underline font-semibold cursor-pointer"
                            >
                              Change Banner
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowBannerUrlInput(!showBannerUrlInput)}
                              className="text-gray-500 hover:text-gray-700 hover:underline cursor-pointer"
                            >
                              {showBannerUrlInput ? "Hide Path" : "Direct Path / URL"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setBannerImage("")}
                              className="text-red-500 hover:underline font-semibold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => bannerFileRef.current?.click()}
                            disabled={isUploadingBanner}
                            className="w-full aspect-[16/6] rounded-lg border-2 border-dashed border-gray-300 hover:border-[#32589c] bg-gray-50 hover:bg-white flex flex-col items-center justify-center text-gray-500 hover:text-[#0a2766] transition-all p-3 cursor-pointer"
                          >
                            {isUploadingBanner ? (
                              <div className="flex flex-col items-center gap-1.5">
                                <Loader2 size={22} className="animate-spin text-[#32589c]" />
                                <span className="text-xs font-medium">Compressing Banner...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-1 text-center">
                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                                  <ImageIcon size={20} />
                                </div>
                                <span className="text-xs font-bold text-[#0a2766]">Upload Hero Banner (1600&times;600)</span>
                                <span className="text-[11px] text-gray-400">
                                  Desktop In-Article Top Banner
                                </span>
                              </div>
                            )}
                          </button>
                          <p className="text-[11px] text-gray-400 text-center italic">
                            Optional &bull; Automatically falls back to Card Image if empty
                          </p>
                          <div className="text-center pt-0.5">
                            <button
                              type="button"
                              onClick={() => setShowBannerUrlInput(!showBannerUrlInput)}
                              className="text-[11px] text-[#32589c] hover:underline font-medium cursor-pointer"
                            >
                              {showBannerUrlInput ? "Hide path/URL input" : "Or enter custom path / URL"}
                            </button>
                          </div>
                        </div>
                      )}

                      {showBannerUrlInput && (
                        <div className="pt-2 border-t border-gray-100 space-y-1">
                          <label className="block text-[11px] font-semibold text-gray-600">
                            Banner Image URL or /public path
                          </label>
                          <input
                            type="text"
                            value={bannerImage}
                            onChange={(e) => setBannerImage(e.target.value)}
                            placeholder="e.g. /blog1/Blog 1- 1600 x 600.svg or https://..."
                            className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#32589c]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2766]">
                        Article Metadata
                      </h4>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-gray-700">Category</label>
                          {!isCustomCategory ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomCategory(true);
                                setCustomCategory("");
                              }}
                              className="text-[11px] font-bold text-[#32589c] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Custom Category</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomCategory(false);
                                setCustomCategory("");
                                setCategory(allCategories[0] || DEFAULT_CATEGORIES[0]);
                              }}
                              className="text-[11px] font-bold text-gray-500 hover:text-gray-700 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Choose from list</span>
                            </button>
                          )}
                        </div>

                        {!isCustomCategory ? (
                          <select
                            value={category}
                            onChange={(e) => {
                              if (e.target.value === "__add_custom__") {
                                setIsCustomCategory(true);
                                setCustomCategory("");
                              } else {
                                setCategory(e.target.value);
                              }
                            }}
                            className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-800 font-medium focus:outline-none focus:border-[#32589c]"
                          >
                            {allCategories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                            <option value="__add_custom__" className="font-bold text-[#0a2766]">
                              + Add Custom Category...
                            </option>
                          </select>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="Type custom category name..."
                                className="w-full border-2 border-[#32589c] bg-blue-50/20 rounded px-3 py-1.5 text-sm text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#32589c]"
                                autoFocus
                              />
                              {customCategory && (
                                <button
                                  type="button"
                                  onClick={() => setCustomCategory("")}
                                  className="absolute right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                  title="Clear"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500">
                              This category will be saved with the article and added to the category filter pills.
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Author Profile</label>
                        <select
                          value={selectedAuthor}
                          onChange={(e) => handleAuthorChange(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-800 font-medium focus:outline-none focus:border-[#32589c]"
                        >
                          {AUTHOR_PROFILES.map((a) => (
                            <option key={a.name} value={a.name}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                        <input
                          type="text"
                          value={publishDate}
                          onChange={(e) => setPublishDate(e.target.value)}
                          placeholder="e.g. 10th May 2026"
                          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-[#32589c]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-gray-700">URL Slug</label>
                          <button
                            type="button"
                            onClick={() => setIsSlugManual(!isSlugManual)}
                            className="text-[11px] text-[#32589c] hover:underline"
                          >
                            {isSlugManual ? "Auto-generate" : "Custom"}
                          </button>
                        </div>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => {
                            setIsSlugManual(true);
                            setSlug(e.target.value);
                          }}
                          placeholder="url-slug-of-article"
                          className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs font-mono text-gray-800 focus:outline-none focus:border-[#32589c]"
                        />
                      </div>
                    </div>

                    {/* The Short Version Box */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a2766]">
                          The Short Version
                        </h4>
                        <button
                          type="button"
                          onClick={handleAutoExtractShortVersion}
                          className="text-xs text-[#32589c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={12} />
                          <span>Auto-Extract</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        3–4 takeaway points displayed in Xcel&apos;s sticky left sidebar.
                      </p>

                      <div className="space-y-2">
                        {shortVersionPoints.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={point}
                              onChange={(e) => {
                                const copy = [...shortVersionPoints];
                                copy[idx] = e.target.value;
                                setShortVersionPoints(copy);
                              }}
                              className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#32589c]"
                            />
                            <button
                              type="button"
                              onClick={() => setShortVersionPoints(shortVersionPoints.filter((_, i) => i !== idx))}
                              className="p-1 text-gray-400 hover:text-red-500 rounded"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => setShortVersionPoints([...shortVersionPoints, ""])}
                          className="text-xs font-semibold text-[#32589c] hover:underline flex items-center gap-1 pt-1"
                        >
                          <Plus size={12} /> Add point
                        </button>
                      </div>
                    </div>

                    {/* SEO Collapsible */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setShowSeoAccordion(!showSeoAccordion)}
                        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0a2766]">
                          SEO & Meta Tags
                        </span>
                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${showSeoAccordion ? "rotate-180" : ""}`} />
                      </button>

                      {showSeoAccordion && (
                        <div className="p-5 pt-0 space-y-3 border-t border-gray-100">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Title</label>
                            <input
                              type="text"
                              value={metaTitle}
                              onChange={(e) => setMetaTitle(e.target.value)}
                              placeholder={calibrateMetaTitle(title) || "SEO Meta Title | XCEL STIRO"}
                              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#32589c]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Description</label>
                            <textarea
                              rows={2}
                              value={metaDescription}
                              onChange={(e) => setMetaDescription(e.target.value)}
                              placeholder={calibrateMetaDescription(description, title) || "Summary for search engines..."}
                              className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#32589c] resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
          </div>
            </div>
          </div>
          );
  }

          // =========================================================================
          // VIEW: DASHBOARD LIST (Matching the exact Products Dashboard style!)
          // =========================================================================
          return (
          <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded bg-[#0a2766] text-white shadow-lg text-sm font-semibold">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>{toastMessage.text}</span>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {blogToDelete && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200 space-y-4">
                  <div className="flex items-center gap-3 text-red-600">
                    <Trash2 size={22} />
                    <h3 className="font-bold text-lg text-gray-900">Delete Blog Article</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete <strong className="text-gray-900">&ldquo;{blogToDelete.title}&rdquo;</strong>? This action cannot be undone.
                  </p>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setBlogToDelete(null)}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-colors cursor-pointer"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-7xl mx-auto">
              {/* Top Header Row matching Screenshot 1 */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#0a2766]">Blogs Dashboard</h1>
                  <p className="text-[#363636] mt-1">Manage your technical journal & blog articles</p>
                </div>
                <div className="flex items-center gap-6">
                  <Link href="/admin/leads" className="text-[#32589c] hover:text-[#0a2766] font-semibold transition-colors">
                    &larr; Back to Leads
                  </Link>
                  <Link href="/admin/products" className="text-[#32589c] hover:text-[#0a2766] font-semibold transition-colors">
                    Manage Products &rarr;
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Action & Filter Bar matching Screenshot 1 */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  {/* Filter Category */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Filter Category:</span>
                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-800 font-medium focus:outline-none focus:border-[#32589c]"
                    >
                      <option value="all">All Categories ({blogs.length})</option>
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} ({blogs.filter((b) => b.category?.toLowerCase() === cat.toLowerCase()).length})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-800 font-medium focus:outline-none focus:border-[#32589c]"
                    >
                      <option value="all">All ({blogs.length})</option>
                      <option value="published">Published ({blogs.filter((b) => (b.status || "published") === "published").length})</option>
                      <option value="draft">Drafts ({blogs.filter((b) => b.status === "draft").length})</option>
                    </select>
                  </div>

                  {/* Quick Search */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, slug..."
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#32589c] w-44 sm:w-56"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-[#32589c] text-white px-4 py-2 rounded shadow-md hover:bg-[#1f3a6a] transition-colors font-medium self-end sm:self-auto cursor-pointer"
                  >
                    <Plus size={18} /> Add New Blog
                  </button>
                </div>
              </div>

              {/* Table matching Screenshot 1 */}
              {loading ? (
                <div className="text-center py-20 text-[#363636]">Loading blogs...</div>
              ) : filteredBlogs.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-10 text-center text-[#363636] border border-gray-200">
                  No articles found. Click &quot;Add New Blog&quot; to create one.
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f3f5f8] text-[#0a2766] border-b border-gray-200 text-sm">
                          <th className="py-4 px-4 font-semibold text-center w-28">Sequence</th>
                          <th className="py-4 px-4 font-semibold">Image</th>
                          <th className="py-4 px-6 font-semibold">Name</th>
                          <th className="py-4 px-6 font-semibold">Category</th>
                          <th className="py-4 px-6 font-semibold">Descriptions</th>
                          <th className="py-4 px-6 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {filteredBlogs.map((blog, idx) => {
                          const isFirst = idx === 0;
                          const isLast = idx === filteredBlogs.length - 1;

                          return (
                            <tr key={blog.id || blog.slug} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              {/* Sequence */}
                              <td className="py-4 px-4 text-center whitespace-nowrap">
                                <div className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                                  <span className={`font-bold px-2 py-0.5 rounded text-xs ${idx === 0
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : idx < 3
                                        ? 'bg-blue-50 text-[#0a2766] border border-blue-200'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    #{idx + 1}
                                  </span>
                                  <div className="flex flex-col gap-0.5">
                                    <button
                                      type="button"
                                      disabled={isFirst}
                                      onClick={() => handleMoveBlog(idx, "up")}
                                      className={`p-0.5 rounded transition-colors ${isFirst
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-gray-600 hover:text-[#0a2766] hover:bg-blue-100 cursor-pointer'
                                        }`}
                                      title="Move Up"
                                    >
                                      <ArrowUp size={13} strokeWidth={2.5} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isLast}
                                      onClick={() => handleMoveBlog(idx, "down")}
                                      className={`p-0.5 rounded transition-colors ${isLast
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-gray-600 hover:text-[#0a2766] hover:bg-blue-100 cursor-pointer'
                                        }`}
                                      title="Move Down"
                                    >
                                      <ArrowDown size={13} strokeWidth={2.5} />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Image */}
                              <td className="py-4 px-4">
                                <img
                                  src={blog.imageSrc || "/blog1/Blog 1- 1080 x 1080.svg"}
                                  alt={blog.title}
                                  className="w-16 h-16 object-cover bg-white border border-gray-200 rounded"
                                />
                              </td>

                              {/* Name / Title */}
                              <td className="py-4 px-6 font-medium text-gray-900">
                                <div className="font-semibold text-gray-900 uppercase leading-snug">
                                  {blog.title}
                                </div>
                                <div className="mt-1">
                                  <a
                                    href={`/blogs/${blog.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-[#0a2766] hover:text-[#32589c] hover:underline font-mono bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200 transition-colors"
                                    title="Preview blog article"
                                  >
                                    <ExternalLink size={11} className="text-[#32589c]" />
                                    /blogs/{blog.slug}
                                  </a>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="py-4 px-6 text-gray-700 whitespace-nowrap">
                                {blog.category}
                              </td>

                              {/* Descriptions */}
                              <td className="py-4 px-6 text-gray-700 max-w-sm space-y-1">
                                {blog.lead && (
                                  <div>
                                    <span className="inline-block text-[10px] font-bold text-[#0a2766] bg-blue-50 px-1.5 py-0.5 rounded mr-1">
                                      Subheading
                                    </span>
                                    <span className="text-xs text-gray-800 line-clamp-1">{blog.lead}</span>
                                  </div>
                                )}
                                <div>
                                  <span className="inline-block text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded mr-1">
                                    Detail
                                  </span>
                                  <span className="text-xs text-gray-600 line-clamp-1">
                                    {blog.author} • {blog.date} ({blog.readTime})
                                  </span>
                                </div>
                                {(blog.status === "draft") && (
                                  <div>
                                    <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                      Draft
                                    </span>
                                  </div>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleStartEdit(blog)}
                                  className="text-[#32589c] hover:text-[#1f3a6a] p-2 rounded-full hover:bg-blue-50 transition-colors mr-2 cursor-pointer"
                                  title="Edit Blog"
                                >
                                  <Edit size={18} />
                                </button>
                                <button
                                  onClick={() => setBlogToDelete(blog)}
                                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Blog"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          );
}
