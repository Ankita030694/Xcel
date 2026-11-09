import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";
import { BLOG_ARTICLES, BlogArticle, BlogSection, BlogBullet, BlogTable, getArticleBySlug, getActiveBlogCategories } from "@/data/blogs";

export type { BlogArticle, BlogSection, BlogBullet, BlogTable };
export { getActiveBlogCategories };

export interface AdminBlogArticle extends BlogArticle {
  status?: "published" | "draft";
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Retrieve all permanently deleted blog slugs and IDs from Firestore.
 */
export async function getDeletedBlogSlugs(): Promise<Set<string>> {
  try {
    const deletedColl = collection(db, "deleted_blogs");
    const snap = await getDocs(deletedColl);
    const set = new Set<string>();
    if (!snap.empty) {
      snap.forEach((docSnap: any) => {
        const data = docSnap.data();
        if (data.slug) set.add(data.slug.toLowerCase().trim());
        if (data.id) set.add(data.id.toLowerCase().trim());
        set.add(docSnap.id.toLowerCase().trim());
      });
    }
    return set;
  } catch (err) {
    console.warn("Could not query deleted_blogs:", err);
    return new Set<string>();
  }
}

/**
 * Merge Firestore blogs with default system blogs, strictly excluding
 * any blogs that were permanently deleted by the user.
 * Preserves the canonical sequence of core system blogs so updated articles
 * update in-place without swapping or interchanging positions with adjacent cards.
 */
export function mergeWithDefaultBlogs(
  firestoreBlogs: AdminBlogArticle[],
  deletedSlugs: Set<string> = new Set()
): AdminBlogArticle[] {
  // Map all default slugs and ids to their canonical index
  const defaultSlugMap = new Map<string, number>();
  BLOG_ARTICLES.forEach((b, idx) => {
    defaultSlugMap.set(b.slug.toLowerCase().trim(), idx);
    const defId = `default-${b.id}`.toLowerCase();
    defaultSlugMap.set(defId, idx);
    defaultSlugMap.set(String(b.id).toLowerCase().trim(), idx);
    if (b.aliases) {
      b.aliases.forEach((al) => defaultSlugMap.set(al.toLowerCase().trim(), idx));
    }
  });

  const customBlogs: AdminBlogArticle[] = [];
  const defaultOverrides = new Map<number, AdminBlogArticle>();

  for (const fb of firestoreBlogs) {
    const slug = (fb.slug || "").toLowerCase().trim();
    const id = (fb.id || "").toLowerCase().trim();

    if (deletedSlugs.has(slug) || deletedSlugs.has(id)) {
      continue;
    }

    const defaultIdx = defaultSlugMap.has(slug)
      ? defaultSlugMap.get(slug)!
      : defaultSlugMap.has(id)
      ? defaultSlugMap.get(id)!
      : -1;

    if (defaultIdx !== -1) {
      // It is an update/override to a canonical default blog
      defaultOverrides.set(defaultIdx, fb);
    } else {
      // It is a newly authored custom blog
      customBlogs.push(fb);
    }
  }

  // Sort newly authored custom blogs by creation time (newest first)
  customBlogs.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
    return timeB - timeA;
  });

  // Reconstruct default blogs in their exact, stable canonical sequence (Blog 1, Blog 2, ...)
  const resolvedDefaults: AdminBlogArticle[] = [];
  BLOG_ARTICLES.forEach((defaultArt, idx) => {
    const slug = defaultArt.slug.toLowerCase().trim();
    const defaultId = `default-${defaultArt.id}`.toLowerCase();

    if (deletedSlugs.has(slug) || deletedSlugs.has(defaultId) || deletedSlugs.has(String(defaultArt.id).toLowerCase())) {
      return;
    }

    if (defaultOverrides.has(idx)) {
      resolvedDefaults.push(defaultOverrides.get(idx)!);
    } else {
      resolvedDefaults.push({
        ...defaultArt,
        id: `default-${defaultArt.id}`,
        status: "published",
      });
    }
  });

  // Custom blogs come first (newest), followed by the stable canonical core sequence
  return [...customBlogs, ...resolvedDefaults];
}

/**
 * Fetch all blogs from Firestore merged with default blogs (respecting permanent deletions).
 */
export async function getBlogs(): Promise<AdminBlogArticle[]> {
  try {
    const [querySnapshot, deletedSlugs] = await Promise.all([
      getDocs(collection(db, "blogs")),
      getDeletedBlogSlugs(),
    ]);

    const firestoreBlogs: AdminBlogArticle[] = [];
    if (!querySnapshot.empty) {
      querySnapshot.forEach((docSnap: any) => {
        const data = docSnap.data();
        firestoreBlogs.push({
          id: docSnap.id,
          ...data,
        } as AdminBlogArticle);
      });

      firestoreBlogs.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
    }

    return mergeWithDefaultBlogs(firestoreBlogs, deletedSlugs);
  } catch (error) {
    console.error("Error fetching blogs from Firestore, using static defaults:", error);
    return BLOG_ARTICLES.map((art) => ({
      ...art,
      id: `default-${art.id}`,
      status: "published" as const,
    }));
  }
}

/**
 * Fetch a single blog by slug from Firestore.
 * Falls back to static BLOG_ARTICLES if not found or on error.
 */
export async function getBlogBySlugFromDb(slug: string): Promise<AdminBlogArticle | null> {
  const normalized = slug.toLowerCase().trim();

  try {
    // Check if permanently deleted
    const delDoc = await getDoc(doc(db, "deleted_blogs", normalized));
    if (delDoc.exists()) {
      return null;
    }

    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("slug", "==", normalized));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as AdminBlogArticle;
    }

    // Also check aliases in Firestore
    const aliasQuery = query(blogsRef, where("aliases", "array-contains", normalized));
    const aliasSnapshot = await getDocs(aliasQuery);
    if (!aliasSnapshot.empty) {
      const docSnap = aliasSnapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as AdminBlogArticle;
    }
  } catch (error) {
    console.error(`Error querying Firestore for slug "${slug}", checking static fallback:`, error);
  }

  // Fallback to static articles
  const staticArticle = getArticleBySlug(normalized);
  if (staticArticle) {
    return {
      ...staticArticle,
      id: `default-${staticArticle.id}`,
      status: "published",
    };
  }

  return null;
}

/**
 * Get related articles excluding the active slug
 */
export async function getRelatedArticles(currentSlug: string, count = 3): Promise<AdminBlogArticle[]> {
  const allBlogs = await getBlogs();
  const published = allBlogs.filter((b) => b.status !== "draft" && b.slug !== currentSlug);
  return published.slice(0, count);
}

/**
 * Delete a blog article and clean up any associated Firebase Storage images
 */
export async function deleteBlog(blog: AdminBlogArticle): Promise<void> {
  if (!blog.id && !blog.slug) return;

  const docId = blog.id;
  const slug = (blog.slug || "").toLowerCase().trim();

  // 1. Delete document from "blogs" collection if it exists
  if (docId) {
    try {
      await deleteDoc(doc(db, "blogs", docId));
    } catch (err) {
      console.warn("Could not delete document from blogs collection:", err);
    }
  }

  // 2. Permanently record deletion in Firestore "deleted_blogs" collection
  // This guarantees that neither default blogs nor re-synced blogs ever reappear
  const recordKey = slug || docId;
  if (recordKey) {
    try {
      await setDoc(doc(db, "deleted_blogs", recordKey), {
        id: docId || "",
        slug: slug,
        title: blog.title || "",
        category: blog.category || "",
        deletedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Could not write to deleted_blogs in Firestore:", err);
    }
  }

  // 3. Clean up storage files if stored in Firebase Storage
  const rawUrls = [blog.imageSrc, blog.bannerSrc].filter((u): u is string => Boolean(u));
  const urlsToDelete = rawUrls.filter(
    (url) => url.includes("firebasestorage.googleapis.com") || url.includes("xcell-ae678")
  );

  for (const fileUrl of urlsToDelete) {
    try {
      const pathStart = fileUrl.indexOf("/o/") + 3;
      const pathEnd = fileUrl.indexOf("?");
      if (pathStart > 2 && pathEnd > pathStart) {
        const filePath = decodeURIComponent(fileUrl.substring(pathStart, pathEnd));
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
      }
    } catch (storageErr) {
      console.warn("Could not delete blog file from storage:", storageErr);
    }
  }
}

/**
 * Restores all default blogs into Firestore with fixed deterministic IDs,
 * and removes any deletion tombstones from deleted_blogs.
 */
export async function restoreDefaultBlogs(): Promise<{ restored: number }> {
  let restored = 0;

  for (const article of BLOG_ARTICLES) {
    try {
      const docRef = doc(db, "blogs", `default-${article.id}`);
      await setDoc(docRef, {
        ...article,
        id: `default-${article.id}`,
        status: "published",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Clear tombstone from deleted_blogs so restored article is visible
      const slugKey = article.slug.toLowerCase().trim();
      await deleteDoc(doc(db, "deleted_blogs", slugKey)).catch(() => {});
      await deleteDoc(doc(db, "deleted_blogs", `default-${article.id}`)).catch(() => {});

      restored++;
    } catch (err) {
      console.error(`Failed to restore default article "${article.slug}":`, err);
    }
  }

  return { restored };
}

/**
 * Seed initial hardcoded blogs from data/blogs.ts into Firestore.
 */
export async function seedInitialBlogs(): Promise<{ added: number; skipped: number }> {
  return restoreDefaultBlogs().then(({ restored }) => ({ added: restored, skipped: 0 }));
}
