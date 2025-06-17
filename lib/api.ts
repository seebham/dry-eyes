import { fetchContentfulGraphQL } from "./contentful";
import { GET_ALL_PAGES_QUERY, GET_PAGE_BY_SLUG_QUERY } from "./queries";
import type {
  Carousel as CarouselType,
  HeroSection as HeroSectionType,
  ImageTextSection as ImageTextSectionType,
  Page,
} from "./types";

export type ContentBlock = (
  | HeroSectionType
  | ImageTextSectionType
  | CarouselType
) & {
  __typename?: string;
};

export type PageResponse = {
  pageCollection: {
    items: Page[];
  };
};

type AllPagesResponse = {
  pageCollection: {
    items: { slug: string }[];
  };
};

export const getPageBySlug = async (
  slug: string,
  preview = false,
  revalidate?: number | false
) => {
  const response = await fetchContentfulGraphQL<PageResponse>(
    GET_PAGE_BY_SLUG_QUERY,
    { slug },
    preview,
    revalidate
  );
  return response.pageCollection?.items?.[0] || null;
};

export const getAllPageSlugs = async () => {
  const response = await fetchContentfulGraphQL<AllPagesResponse>(
    GET_ALL_PAGES_QUERY
  );
  return response.pageCollection?.items?.map((page) => page.slug) || [];
};
