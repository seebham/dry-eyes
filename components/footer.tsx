import { Button } from "@/components/ui/button";
import { fetchContentfulGraphQL } from "@/lib/contentful";
import { GET_FOOTER_QUERY } from "@/lib/queries";
import type { Footer, NavLink } from "@/lib/types";

type FooterResponse = {
  footerCollection: {
    items: Footer[];
  };
};

const getFooter = async (preview = false) => {
  const response = await fetchContentfulGraphQL<FooterResponse>(
    GET_FOOTER_QUERY,
    undefined,
    preview
  );
  return response.footerCollection?.items?.[0] || null;
};

export const SiteFooter = async () => {
  const footer = await getFooter();

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {footer?.copyrightText || "© 2025 Dry Eyes. All rights reserved."}
          </p>

          {/* Footer Links */}
          <nav className="flex space-x-6">
            {footer?.footerLinksCollection?.items?.map((link: NavLink) => (
              <Button
                key={link?.sys?.id}
                variant="link"
                href={link?.url || "/"}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link?.text}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
