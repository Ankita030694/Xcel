import { BLOG_ARTICLES, BlogArticle } from "@/data/blogs";

export const SITE_URL = "https://www.xcelstiro.com";
const FIRESTORE_PROJECT_ID = "xcell-ae678";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents`;

export interface ServerProduct {
  id: string;
  name: string;
  subheading?: string;
  categoryId: string;
  order?: number;
  slug?: string;
  customUrl?: string;
  cardDescription?: string;
  detailDescription?: string;
  shortDescription?: string;
  highlights?: string[];
  imageUrl: string;
  additionalImages?: string[];
  imageBgColor?: string;
  imageBgColors?: string[];
  features?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  whyChooseUs?: { title: string; description: string }[] | string;
  industriesServed?: { title: string; description: string }[] | string;
  brochureUrl?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const DEFAULT_CATEGORY_ORDER = [
  "washing",
  "drying",
  "apparel-processing",
  "dry-cleaning",
  "flat-work",
  "steam-finishing",
  "water-heater",
  "fabric-checking",
  "other-equipment",
];

function parseFirestoreValue(val: any): any {
  if (!val || typeof val !== "object") return undefined;
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("booleanValue" in val) return Boolean(val.booleanValue);
  if ("nullValue" in val) return null;
  if ("timestampValue" in val) return val.timestampValue;
  if ("arrayValue" in val) {
    const values = val.arrayValue?.values;
    return Array.isArray(values) ? values.map(parseFirestoreValue) : [];
  }
  if ("mapValue" in val) {
    const fields = val.mapValue?.fields || {};
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = parseFirestoreValue(v);
    }
    return out;
  }
  return undefined;
}

function parseFirestoreDoc(doc: any): Record<string, any> {
  const id = typeof doc?.name === "string" ? doc.name.split("/").pop() || "" : "";
  const fields = doc?.fields || {};
  const parsed: Record<string, any> = { id };
  for (const [key, value] of Object.entries(fields)) {
    parsed[key] = parseFirestoreValue(value);
  }
  return parsed;
}

function normalizeSlugSegment(raw?: string): string {
  if (!raw) return "";
  return raw
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^product\//i, "")
    .toLowerCase();
}

function toTimestampMs(val: any): number {
  if (!val) return 0;
  if (typeof val === "string") {
    const t = Date.parse(val);
    return Number.isNaN(t) ? 0 : t;
  }
  if (typeof val?.seconds === "number") return val.seconds * 1000;
  return 0;
}

async function fetchCollectionDocs(
  collectionName: string,
  revalidateSeconds = 300
): Promise<Record<string, any>[]> {
  const url = `${FIRESTORE_BASE_URL}/${collectionName}?pageSize=250`;
  const res = await fetch(url, { next: { revalidate: revalidateSeconds } });
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  if (!Array.isArray(data?.documents)) return [];
  return data.documents.map(parseFirestoreDoc);
}

/**
 * Fetch all active products sorted in canonical display sequence.
 */
export async function getServerProducts(
  revalidateSeconds = 300
): Promise<ServerProduct[]> {
  try {
    const docs = (await fetchCollectionDocs("products", revalidateSeconds)) as ServerProduct[];
    docs.sort((a, b) => {
      const orderA = typeof a.order === "number" ? a.order : 9999;
      const orderB = typeof b.order === "number" ? b.order : 9999;
      if (orderA !== orderB) return orderA - orderB;
      return toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt);
    });
    return docs;
  } catch (err) {
    console.error("Error fetching server products:", err);
    return [];
  }
}

/**
 * Fetch saved Complete Range category sequence from Firestore settings.
 */
export async function getServerCategoryOrder(): Promise<string[]> {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/settings/categoryOrder`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return DEFAULT_CATEGORY_ORDER;
    const doc = parseFirestoreDoc(await res.json());
    if (Array.isArray(doc.order) && doc.order.length > 0) {
      const saved = doc.order.filter((id: string) => id !== "complete-range");
      const missing = DEFAULT_CATEGORY_ORDER.filter((id) => !saved.includes(id));
      return [...saved, ...missing];
    }
    return DEFAULT_CATEGORY_ORDER;
  } catch {
    return DEFAULT_CATEGORY_ORDER;
  }
}

export function getCanonicalProductSlug(product: ServerProduct): string {
  const cleanSlug = normalizeSlugSegment(product.slug);
  if (cleanSlug) return cleanSlug;
  const cleanCustom = normalizeSlugSegment(product.customUrl);
  if (cleanCustom) return cleanCustom;
  return product.id;
}

function findProductInList(
  products: ServerProduct[],
  param: string
): { product: ServerProduct; matchedById: boolean; canonicalSlug: string } | null {
  const normalized = normalizeSlugSegment(decodeURIComponent(param));
  if (!normalized) return null;

  for (const prod of products) {
    const canonicalSlug = getCanonicalProductSlug(prod);
    const cleanSlug = normalizeSlugSegment(prod.slug);
    const cleanCustom = normalizeSlugSegment(prod.customUrl);

    if (cleanSlug && cleanSlug === normalized) {
      return { product: prod, matchedById: false, canonicalSlug };
    }
    if (cleanCustom && cleanCustom === normalized) {
      return {
        product: prod,
        matchedById: normalized !== canonicalSlug,
        canonicalSlug,
      };
    }
    if (prod.id === param || prod.id.toLowerCase() === normalized) {
      return {
        product: prod,
        matchedById: canonicalSlug.toLowerCase() !== prod.id.toLowerCase(),
        canonicalSlug,
      };
    }
  }

  return null;
}

/**
 * Resolve a single product by URL param (slug, customUrl, or Firestore document ID).
 * Uses ISR cache first, then falls back to uncached lookup so newly created products resolve immediately.
 */
export async function getServerProductByParam(param: string): Promise<{
  product: ServerProduct;
  matchedById: boolean;
  canonicalSlug: string;
  allProducts: ServerProduct[];
} | null> {
  if (!param || param.toLowerCase().startsWith("fallback-")) {
    return null;
  }

  const products = await getServerProducts(60);
  const found = findProductInList(products, param);

  if (!found) return null;
  return { ...found, allProducts: products };
}

/**
 * Merge dynamic Firestore blogs with default static blogs on the server.
 */
function mergeServerBlogs(
  firestoreBlogs: BlogArticle[],
  deletedSlugs: Set<string>
): BlogArticle[] {
  const defaultSlugMap = new Map<string, number>();
  BLOG_ARTICLES.forEach((b, idx) => {
    defaultSlugMap.set(b.slug.toLowerCase().trim(), idx);
    defaultSlugMap.set(`default-${b.id}`.toLowerCase(), idx);
    defaultSlugMap.set(String(b.id).toLowerCase().trim(), idx);
    b.aliases?.forEach((al) => defaultSlugMap.set(al.toLowerCase().trim(), idx));
  });

  const customBlogs: BlogArticle[] = [];
  const defaultOverrides = new Map<number, BlogArticle>();

  for (const fb of firestoreBlogs) {
    const slug = (fb.slug || "").toLowerCase().trim();
    const id = (fb.id || "").toLowerCase().trim();

    if (deletedSlugs.has(slug) || deletedSlugs.has(id)) continue;

    const defaultIdx = defaultSlugMap.has(slug)
      ? defaultSlugMap.get(slug)!
      : defaultSlugMap.has(id)
      ? defaultSlugMap.get(id)!
      : -1;

    if (defaultIdx !== -1) {
      defaultOverrides.set(defaultIdx, fb);
    } else {
      customBlogs.push(fb);
    }
  }

  customBlogs.sort((a, b) => toTimestampMs(b.createdAt) - toTimestampMs(a.createdAt));

  const resolvedDefaults: BlogArticle[] = [];
  BLOG_ARTICLES.forEach((defaultArt, idx) => {
    const slug = defaultArt.slug.toLowerCase().trim();
    const defaultId = `default-${defaultArt.id}`.toLowerCase();
    if (
      deletedSlugs.has(slug) ||
      deletedSlugs.has(defaultId) ||
      deletedSlugs.has(String(defaultArt.id).toLowerCase())
    ) {
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

  return [...customBlogs, ...resolvedDefaults].filter((b) => b.status !== "draft");
}

/**
 * Fetch all published blogs (Firestore + static defaults).
 */
export async function getServerBlogs(
  revalidateSeconds = 300
): Promise<BlogArticle[]> {
  try {
    const [blogDocs, deletedDocs] = await Promise.all([
      fetchCollectionDocs("blogs", revalidateSeconds),
      fetchCollectionDocs("deleted_blogs", revalidateSeconds).catch(() => []),
    ]);

    const deletedSlugs = new Set<string>();
    for (const d of deletedDocs) {
      if (d.slug) deletedSlugs.add(String(d.slug).toLowerCase().trim());
      if (d.id) deletedSlugs.add(String(d.id).toLowerCase().trim());
    }

    return mergeServerBlogs(blogDocs as BlogArticle[], deletedSlugs);
  } catch (err) {
    console.error("Error fetching server blogs:", err);
    return BLOG_ARTICLES.filter((b) => b.status !== "draft");
  }
}

function findBlogInList(
  blogs: BlogArticle[],
  rawSlug: string
): { article: BlogArticle; isAlias: boolean; canonicalSlug: string } | null {
  const normalized = decodeURIComponent(rawSlug).toLowerCase().trim();
  if (!normalized) return null;

  for (const art of blogs) {
    const primary = (art.slug || "").toLowerCase().trim();
    if (primary === normalized) {
      return { article: art, isAlias: false, canonicalSlug: art.slug };
    }
    if (art.aliases?.some((al) => al.toLowerCase().trim() === normalized)) {
      return { article: art, isAlias: true, canonicalSlug: art.slug };
    }
  }
  return null;
}

/**
 * Fetch a single published blog by primary slug or alias.
 */
export async function getServerBlogBySlug(slug: string): Promise<{
  article: BlogArticle;
  isAlias: boolean;
  canonicalSlug: string;
  relatedArticles: BlogArticle[];
} | null> {
  const blogs = await getServerBlogs(60);
  const found = findBlogInList(blogs, slug);

  if (!found) return null;

  const relatedArticles = blogs
    .filter((b) => b.slug !== found!.canonicalSlug)
    .slice(0, 3);

  return { ...found, relatedArticles };
}

/**
 * Cleanly formats ALL-CAPS product titles into readable Title Case for SEO meta titles,
 * preserving industry acronyms like PERC, SS, PLC, VFD, KG, LPG, PNG.
 */
export function formatProductSeoName(name: string): string {
  const trimmed = (name || "").trim().replace(/\s+/g, " ");
  if (!trimmed) return "Industrial Laundry Equipment";

  const acronyms = new Set(["PERC", "SS", "PLC", "VFD", "KG", "LPG", "PNG", "304", "316", "OPL"]);
  // Only re-case if the string is predominantly uppercase
  if (trimmed === trimmed.toUpperCase()) {
    return trimmed
      .split(" ")
      .map((word) => {
        const clean = word.replace(/[^A-Z0-9]/gi, "").toUpperCase();
        if (acronyms.has(clean)) return word.toUpperCase();
        if (word === "&") return "&";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }
  return trimmed;
}

/**
 * Strips HTML & markdown markers and truncates cleanly for meta descriptions.
 */
export function buildCleanMetaDescription(rawText: string, fallback: string, maxLen = 158): string {
  const stripped = (rawText || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  const text = stripped || fallback;
  if (text.length <= maxLen) return text;
  const cut = text.substring(0, maxLen - 3);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.substring(0, lastSpace) : cut).trim()}...`;
}
