import { NAV_LINK_FRAGMENT } from "./fragments";

export const GET_NAVIGATION_QUERY = `
  ${NAV_LINK_FRAGMENT}
  query GetNavigation {
    navigationCollection(limit: 1) {
      items {
        sys {
          id
        }
        title
        navLinksCollection {
          items {
            ...NavLinkFragment
          }
        }
      }
    }
  }
`;
