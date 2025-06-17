import type { HeroSection as HeroSectionType } from "@/lib/types";
import Image from "next/image";

type HeroSectionProps = {
  block: HeroSectionType;
};

export const HeroSection = ({ block }: HeroSectionProps) => {
  return (
    <section className="relative h-[79dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {block.backgroundImage?.url && (
        <Image
          src={block.backgroundImage.url}
          alt={block.backgroundImageAlt || ""}
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        {block.headline && (
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {block.headline}
          </h1>
        )}

        {block.subtext && (
          <p className="text-xl md:text-2xl mb-8 opacity-90">{block.subtext}</p>
        )}
      </div>

      {/* Blue overlay */}
      <div className="absolute z-40 inset-0 backdrop-blur-[1px]" />
    </section>
  );
};
