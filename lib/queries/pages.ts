import {
  CAROUSEL_FRAGMENT,
  CTA_FRAGMENT,
  HERO_SECTION_FRAGMENT,
  IMAGE_TEXT_SECTION_FRAGMENT,
} from "./fragments";

export const GET_ALL_PAGES_QUERY = `
  query GetAllPages {
    pageCollection {
      items {
        slug
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG_QUERY = `
  ${HERO_SECTION_FRAGMENT}
  ${IMAGE_TEXT_SECTION_FRAGMENT}
  ${CAROUSEL_FRAGMENT}
  ${CTA_FRAGMENT}
  query GetPageBySlug($slug: String!) {
    pageCollection(where: { slug: $slug }, limit: 1) {
      items {
        sys {
          id
        }
        title
        slug
        contentBlocksCollection(limit: 20) {
          items {
            __typename
            ... on HeroSection {
              ...HeroSectionFragment
            }
            ... on ImageTextSection {
              ...ImageTextSectionFragment
            }
            ... on Carousel {
              ...CarouselFragment
            }
            ... on Cta {
              ...CtaFragment
            }
          }
        }
      }
    }
  }
`;
