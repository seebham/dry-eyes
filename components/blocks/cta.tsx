import { Button } from "@/components/ui/button";
import type { Cta } from "@/lib/types";
import Link from "next/link";

type CtaProps = {
  block: Cta;
};

export const CTA = ({ block }: CtaProps) => {
  return (
    <section className="relative container mx-auto px-4">
      <div className="max-w-2xl my-16 relative mx-auto bg-white border-2 border-black p-8 text-center">
        {block.title && (
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {block.title}
          </h2>
        )}
        {block.description && (
          <p className="text-lg text-gray-600 mb-8">{block.description}</p>
        )}
        <Link href={block.ctaUrl || ""}>
          <Button variant="default">{block.ctaTitle}</Button>
        </Link>
        {/* note: that this section is weird on purpose */}
        <div className="absolute bottom-0 text-[12px] right-1 text-sm text-gray-500">
          weird card to catch your eyes
        </div>
      </div>
    </section>
  );
};
