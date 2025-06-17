import { Document } from "@contentful/rich-text-types";

export type Sys = {
  id: string;
  spaceId: string;
  environmentId: string;
  contentType?: {
    sys: {
      id: string;
      linkType: "ContentType";
      type: "Link";
    };
  };
  revision?: number;
  createdAt?: string;
  updatedAt?: string;
  locale?: string;
  type: string;
};

export type ContentfulMetadata = {
  tags: Array<{
    sys: {
      type: "Link";
      linkType: "Tag";
      id: string;
    };
  }>;
};

export type Asset = {
  sys: Sys;
  contentfulMetadata?: ContentfulMetadata;
  title?: string;
  description?: string;
  url?: string;
  file?: {
    url: string;
    details?: {
      size?: number;
      image?: {
        width?: number;
        height?: number;
      };
    };
    fileName?: string;
    contentType?: string;
  };
};

export type RichText = {
  json: Document;
  links?: {
    entries?: {
      block?: Array<Entry>;
      inline?: Array<Entry>;
      hyperlink?: Array<Entry>;
    };
    assets?: {
      block?: Array<Asset>;
      hyperlink?: Array<Asset>;
    };
  };
};

export type Entry = {
  sys: Sys;
  contentfulMetadata: ContentfulMetadata;
};

export type HeroSection = Entry & {
  _id?: string;
  headline?: string;
  subtext?: string;
  backgroundImage?: Asset;
  backgroundImageAlt?: string;
};

export type Page = Entry & {
  _id?: string;
  title?: string;
  slug?: string;
  contentBlocksCollection?: {
    items: Array<HeroSection | ImageTextSection | Carousel | Cta>;
  };
};

export type Carousel = Entry & {
  _id?: string;
  title?: string;
  description?: string;
  imagesCollection?: {
    items: Array<CarouselImage>;
  };
};

export type CarouselImage = Entry & {
  _id?: string;
  image?: Asset;
  altText?: string;
  caption?: string;
};

export type Cta = Entry & {
  _id?: string;
  title?: string;
  description?: string;
  ctaTitle?: string;
  ctaUrl?: string;
};

export type ImageTextSection = Entry & {
  _id?: string;
  title?: string;
  content?: RichText;
  image?: Asset;
  imageAlt?: string;
  imagePosition?: string;
};

export type ImageTextSectionContentResourcesBlock = Entry & {};

export type ImageTextSectionContentResourcesInline = Entry & {};

export type ImageTextSectionContentResourcesHyperlink = Entry & {};

export type Footer = Entry & {
  _id?: string;
  title?: string;
  copyrightText?: string;
  footerLinksCollection?: {
    items: Array<NavLink>;
  };
};

export type NavLink = Entry & {
  _id?: string;
  text?: string;
  url?: string;
};

export type Navigation = Entry & {
  _id?: string;
  title?: string;
  navLinksCollection?: {
    items: Array<NavLink>;
  };
};

// Collection types
export type HeroSectionCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<HeroSection>;
};

export type PageCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<Page>;
};

export type CarouselCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<Carousel>;
};

export type CarouselImageCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<CarouselImage>;
};

export type CtaCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<Cta>;
};

export type ImageTextSectionCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<ImageTextSection>;
};

export type ImageTextSectionContentResourcesBlockCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<ImageTextSectionContentResourcesBlock>;
};

export type ImageTextSectionContentResourcesInlineCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<ImageTextSectionContentResourcesInline>;
};

export type ImageTextSectionContentResourcesHyperlinkCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<ImageTextSectionContentResourcesHyperlink>;
};

export type FooterCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<Footer>;
};

export type NavLinkCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<NavLink>;
};

export type NavigationCollection = {
  total: number;
  skip: number;
  limit: number;
  items: Array<Navigation>;
};
