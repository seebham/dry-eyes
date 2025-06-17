import { ContentBlockRenderer } from "@/components/content-block-renderer";
import { getAllPageSlugs, getPageBySlug } from "@/lib/api";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    pages: string[];
  }>;
};

export default async function DynamicPage({ params }: PageProps) {
  try {
    const { pages } = await params;
    const slug = "/" + pages.join("/"); // ["a", "b"] to "/a/b"

    console.log("Fetching page with slug:", slug);
    const page = await getPageBySlug(slug, false, 604800); // ISR - 1 week revalidation

    if (!page) {
      console.log("Page not found for slug:", slug);
      notFound();
    }

    return (
      <ContentBlockRenderer
        blocks={page.contentBlocksCollection?.items || []}
      />
    );
  } catch (error) {
    console.error("Error in DynamicPage:", error);
    notFound();
  }
}

// Generate static params for all pages at build time
export async function generateStaticParams() {
  try {
    const slugs = await getAllPageSlugs();

    // Filter out the homepage (already at app/page.tsx) and convert to params format
    return slugs
      .filter((slug) => slug !== "/")
      .map((slug) => ({
        pages: slug.substring(1).split("/"), // Remove leading "/" and split
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { pages } = await params;
    const slug = "/" + pages.join("/");

    const page = await getPageBySlug(slug, false, 604800); // ISR - 1 week revalidation

    if (!page) {
      return {
        title: "Page Not Found",
      };
    }

    return {
      title: page.title,
      description: `${page.title} - Dry Eyes`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Dry Eyes",
    };
  }
}
