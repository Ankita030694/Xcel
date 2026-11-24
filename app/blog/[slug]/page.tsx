import { permanentRedirect } from "next/navigation";
import { getServerBlogBySlug } from "@/lib/firestore-server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogSlugRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = await getServerBlogBySlug(slug);
  permanentRedirect(`/blogs/${resolved?.canonicalSlug || slug}`);
}
