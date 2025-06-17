import type { ContentBlock } from "@/lib/api";
import { CTA } from "./blocks/cta";
import { HeroSection } from "./blocks/hero-section";
import { ImageCarousel } from "./blocks/image-carousel";
import { ImageTextSection } from "./blocks/image-text-section";

// Component mapping for content blocks
const componentMap = {
  HeroSection: HeroSection,
  ImageTextSection: ImageTextSection,
  Carousel: ImageCarousel,
  Cta: CTA,
} as const;

type ContentBlockRendererProps = {
  blocks: ContentBlock[];
};

export const ContentBlockRenderer = ({ blocks }: ContentBlockRendererProps) => {
  return (
    <>
      {blocks.map((block: ContentBlock) => {
        if (!block || !block.__typename) {
          return null;
        }

        const Component =
          componentMap[block.__typename as keyof typeof componentMap];

        if (!Component) {
          console.warn(
            `No component found for content type: ${block.__typename}`
          );
          return null;
        }

        return <Component key={block.sys.id} block={block} />;
      })}
    </>
  );
};
