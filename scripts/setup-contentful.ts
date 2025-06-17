import type { ContentType, Environment } from "contentful-management";
import { createClient } from "contentful-management";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN,
  CONTENTFUL_ENVIRONMENT = "master",
} = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  throw new Error(
    "CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be provided in your .env.local file"
  );
}

const client = createClient({
  accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
});

async function createNewContentType(
  env: Environment,
  id: string,
  data: {
    name: string;
    description: string;
    fields: any[];
    displayField?: string;
  }
): Promise<ContentType | null> {
  try {
    // Check if content type already exists
    await env.getContentType(id);
    console.log(`Content type "${id}" already exists. Skipping creation.`);
    return null;
  } catch (error) {
    // Content type doesn't exist, create it
    console.log(`Creating new content type "${id}"...`);
    const newContentType = await env.createContentTypeWithId(id, {
      ...data,
      displayField: data.displayField || data.fields[0]?.id,
    });
    console.log(`Content type "${id}" created successfully.`);
    return newContentType;
  }
}

async function publishContentType(contentType: ContentType | null) {
  if (!contentType) return;

  try {
    await contentType.publish();
    console.log(`Content type "${contentType.sys.id}" published.`);
  } catch (error) {
    console.error(
      `Failed to publish content type "${contentType.sys.id}":`,
      error
    );
  }
}

async function run() {
  console.log("Starting Contentful setup script...");
  const space = await client.getSpace(CONTENTFUL_SPACE_ID!);
  const env = await space.getEnvironment(CONTENTFUL_ENVIRONMENT);

  // 1. NavLink
  const navLink = await createNewContentType(env, "navLink", {
    name: "Nav Link",
    description: "A link with text and a URL, used in navigation and footers.",
    fields: [
      { id: "text", name: "Text", type: "Symbol", required: true },
      { id: "url", name: "URL", type: "Symbol", required: true },
    ],
  });
  await publishContentType(navLink);

  // 2. Navigation
  const navigation = await createNewContentType(env, "navigation", {
    name: "Navigation",
    description: "Defines a navigation menu.",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: true },
      {
        id: "navLinks",
        name: "Nav Links",
        type: "Array",
        required: true,
        items: {
          type: "Link",
          linkType: "Entry",
          validations: [{ linkContentType: ["navLink"] }],
        },
      },
    ],
  });
  await publishContentType(navigation);

  // 3. Hero Section
  const heroSection = await createNewContentType(env, "heroSection", {
    name: "Hero Section",
    description:
      "A full-width section with a headline, subtext, and background image.",
    fields: [
      { id: "headline", name: "Headline", type: "Symbol", required: true },
      { id: "subtext", name: "Subtext", type: "Text", required: false },
      {
        id: "backgroundImage",
        name: "Background Image",
        type: "Link",
        linkType: "Asset",
        required: true,
      },
      {
        id: "backgroundImageAlt",
        name: "Background Image Alt Text",
        type: "Symbol",
        required: true,
      },
    ],
  });
  await publishContentType(heroSection);

  // 4. CTA
  const cta = await createNewContentType(env, "cta", {
    name: "CTA",
    description:
      "A call-to-action block with optional title, description, and required CTA button.",
    displayField: "ctaTitle",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: false },
      { id: "description", name: "Description", type: "Text", required: false },
      { id: "ctaTitle", name: "CTA Title", type: "Symbol", required: true },
      { id: "ctaUrl", name: "CTA URL", type: "Symbol", required: true },
    ],
  });
  await publishContentType(cta);

  // 5. Image & Text Section
  const imageTextSection = await createNewContentType(env, "imageTextSection", {
    name: "Image & Text Section",
    description: "A section with an image and rich text content.",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: true },
      { id: "content", name: "Content", type: "RichText", required: true },
      {
        id: "image",
        name: "Image",
        type: "Link",
        linkType: "Asset",
        required: true,
      },
      {
        id: "imageAlt",
        name: "Image Alt Text",
        type: "Symbol",
        required: true,
      },
      {
        id: "imagePosition",
        name: "Image Position",
        type: "Symbol",
        required: true,
        validations: [{ in: ["Left", "Right"] }],
      },
    ],
  });
  await publishContentType(imageTextSection);

  // 6. Page
  const page = await createNewContentType(env, "page", {
    name: "Page",
    description: "A page composed of multiple content blocks.",
    displayField: "title",
    fields: [
      {
        id: "title",
        name: "Title",
        type: "Symbol",
        required: true,
        localized: false,
      },
      {
        id: "slug",
        name: "Slug",
        type: "Symbol",
        required: true,
        validations: [
          {
            unique: true,
          },
        ],
      },
      {
        id: "contentBlocks",
        name: "Content Blocks",
        type: "Array",
        items: {
          type: "Link",
          linkType: "Entry",
          validations: [
            {
              linkContentType: [
                "heroSection",
                "imageTextSection",
                "carousel",
                "cta",
              ],
            },
          ],
        },
      },
    ],
  });
  await publishContentType(page);

  // 7. Carousel Image
  const carouselImage = await createNewContentType(env, "carouselImage", {
    name: "Carousel Image",
    description:
      "An image with alt text and an optional caption for a carousel.",
    displayField: "altText",
    fields: [
      {
        id: "image",
        name: "Image",
        type: "Link",
        linkType: "Asset",
        required: true,
      },
      { id: "altText", name: "Alt Text", type: "Symbol", required: true },
      { id: "caption", name: "Caption", type: "Symbol", required: false },
    ],
  });
  await publishContentType(carouselImage);

  // 8. Carousel
  const carousel = await createNewContentType(env, "carousel", {
    name: "Carousel",
    description: "A rotating carousel of images.",
    displayField: "title",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: false },
      { id: "description", name: "Description", type: "Text", required: false },
      {
        id: "images",
        name: "Images",
        type: "Array",
        required: true,
        items: {
          type: "Link",
          linkType: "Entry",
          validations: [{ linkContentType: ["carouselImage"] }],
        },
      },
    ],
  });
  await publishContentType(carousel);

  // 9. Footer
  const footer = await createNewContentType(env, "footer", {
    name: "Footer",
    description: "The website footer.",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: true },
      {
        id: "copyrightText",
        name: "Copyright Text",
        type: "Symbol",
        required: true,
      },
      {
        id: "footerLinks",
        name: "Footer Links",
        type: "Array",
        required: false,
        items: {
          type: "Link",
          linkType: "Entry",
          validations: [{ linkContentType: ["navLink"] }],
        },
      },
    ],
  });
  await publishContentType(footer);

  console.log("Contentful setup script finished successfully!");
}

run().catch(console.error);
