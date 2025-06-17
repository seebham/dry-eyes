import { ContentBlockRenderer } from "@/components/content-block-renderer";
import { getPageBySlug } from "@/lib/api";

export default async function HomePage() {
  const page = await getPageBySlug("/", false, false); // SSG - static generation

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-muted-foreground">
            The homepage content could not be loaded from Contentful.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ContentBlockRenderer blocks={page.contentBlocksCollection?.items || []} />
  );
}

export async function generateMetadata() {
  const page = await getPageBySlug("/", false, false);

  if (!page) {
    return {
      title: "Dry Eyes",
    };
  }

  return {
    title: "Dry Eyes",
    description: "A modern solution for dry eye relief and care",
  };
}
