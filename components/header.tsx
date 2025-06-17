import { Button } from "@/components/ui/button";
import { fetchContentfulGraphQL } from "@/lib/contentful";
import { GET_NAVIGATION_QUERY } from "@/lib/queries";
import type { Navigation, NavLink } from "@/lib/types";
import { Eye } from "lucide-react";
import Link from "next/link";

type NavigationResponse = {
  navigationCollection: {
    items: Navigation[];
  };
};

const getNavigation = async (preview = false) => {
  const response = await fetchContentfulGraphQL<NavigationResponse>(
    GET_NAVIGATION_QUERY,
    undefined,
    preview
  );
  return response.navigationCollection?.items?.[0] || null;
};

export const SiteHeader = async () => {
  const navigation = await getNavigation();

  return (
    <header className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-foreground" />
            <span className="text-xl font-bold text-foreground">Dry Eyes</span>
          </Link>

          {/* Navigation */}
          <nav className="flex space-x-8">
            {navigation?.navLinksCollection?.items?.map((link: NavLink) => (
              <Button
                key={link?.sys?.id}
                variant="link"
                href={link?.url || "/"}
                className="text-foreground hover:text-muted-foreground transition-colors"
              >
                {link?.text}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};
