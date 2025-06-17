import { NAV_LINK_FRAGMENT } from "./fragments";

export const GET_FOOTER_QUERY = `
  ${NAV_LINK_FRAGMENT}
  query GetFooter {
    footerCollection(limit: 1) {
      items {
        sys {
          id
        }
        title
        copyrightText
        footerLinksCollection {
          items {
            ...NavLinkFragment
          }
        }
      }
    }
  }
`;
