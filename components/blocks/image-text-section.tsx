import type { ImageTextSection as ImageTextSectionType } from "@/lib/types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";

type ImageTextSectionProps = {
  block: ImageTextSectionType;
};

export const ImageTextSection = ({ block }: ImageTextSectionProps) => {
  const isImageRight = block.imagePosition === "Right";

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className={`${isImageRight ? "lg:order-last" : ""}`}>
            {block.image && (
              <Image
                src={block.image.url || ""}
                alt={block.image.description || ""}
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-lg"
              />
            )}
          </div>

          {/* Content */}
          <div className={`${isImageRight ? "lg:order-first" : ""}`}>
            {block.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {block.title}
              </h2>
            )}

            {block.content && (
              <div className="prose prose-lg max-w-none">
                {documentToReactComponents(block.content.json)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
