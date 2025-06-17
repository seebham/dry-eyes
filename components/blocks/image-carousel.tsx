import type { Carousel as CarouselType } from "@/lib/types";
import Image from "next/image";

type ImageCarouselProps = {
  block: CarouselType;
};

export const ImageCarousel = ({ block }: ImageCarouselProps) => {
  if (!block?.imagesCollection?.items?.length) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {block.title && (
          <h2 className="text-3xl font-bold text-center mb-4">{block.title}</h2>
        )}
        {block.description && (
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            {block.description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.imagesCollection.items.map((carouselImage) => {
            if (!carouselImage?.image?.url) {
              return null;
            }

            return (
              <div key={carouselImage.sys.id} className="relative group">
                <div className="aspect-square overflow-hidden bg-muted">
                  <Image
                    src={carouselImage.image.url}
                    alt={
                      carouselImage.altText ||
                      carouselImage.image.description ||
                      ""
                    }
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                {carouselImage.caption && (
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    {carouselImage.caption}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
