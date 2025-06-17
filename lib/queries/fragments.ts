export const NAV_LINK_FRAGMENT = `
  fragment NavLinkFragment on NavLink {
    sys {
      id
    }
    text
    url
  }
`;

export const HERO_SECTION_FRAGMENT = `
  fragment HeroSectionFragment on HeroSection {
    sys {
      id
    }
    headline
    subtext
    backgroundImage {
      sys {
        id
      }
      url
      title
      description
    }
    backgroundImageAlt
  }
`;

export const IMAGE_TEXT_SECTION_FRAGMENT = `
  fragment ImageTextSectionFragment on ImageTextSection {
    sys {
      id
    }
    title
    content {
      json
    }
    image {
      sys {
        id
      }
      url
      title
      description
    }
    imagePosition
  }
`;

export const CAROUSEL_FRAGMENT = `
  fragment CarouselFragment on Carousel {
    sys {
      id
    }
    title
    description
    imagesCollection(limit: 10) {
      items {
        sys {
          id
        }
        image {
          sys {
            id
          }
          url
          title
          description
        }
        altText
        caption
      }
    }
  }
`;

export const CTA_FRAGMENT = `
  fragment CtaFragment on Cta {
    sys {
      id
    }
    title
    description
    ctaTitle
    ctaUrl
  }
`;
