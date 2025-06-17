import type { HeroSection as HeroSectionType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type HeroSectionProps = {
  block: HeroSectionType;
};

export const HeroSection = ({ block }: HeroSectionProps) => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {block.backgroundImage && (
        <Image
          src={block.backgroundImage.url || ""}
          alt={block.backgroundImageAlt || ""}
          fill
          className="object-cover"
          priority
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

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

        {block.ctaText && block.ctaUrl && (
          <Link
            href={block.ctaUrl}
            className="inline-block bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {block.ctaText}
          </Link>
        )}
      </div>
    </section>
  );
};
