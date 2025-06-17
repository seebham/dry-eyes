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

async function getOrCreateContentType(
  env: Environment,
  id: string,
  data: {
    name: string;
    description: string;
    fields: any[];
    displayField?: string;
  }
): Promise<ContentType> {
  try {
    let contentType = await env.getContentType(id);
    console.log(`Content type "${id}" already exists. Checking status...`);

    if (contentType.isPublished()) {
      console.log(`Content type "${id}" is published. Unpublishing...`);
      contentType = await contentType.unpublish();
      console.log(`Content type "${id}" unpublished.`);
    }

    console.log(`Updating content type "${id}"...`);
    contentType.name = data.name;
    contentType.description = data.description;
    contentType.fields = data.fields;
    contentType.displayField = data.displayField || data.fields[0]?.id;

    const updatedContentType = await contentType.update();
    console.log(`Content type "${id}" updated.`);
    return updatedContentType;
  } catch (error) {
    console.log(`Content type "${id}" does not exist. Creating...`);
    const newContentType = await env.createContentTypeWithId(id, {
      ...data,
      displayField: data.displayField || data.fields[0]?.id,
    });
    console.log(`Content type "${id}" created.`);
    return newContentType;
  }
}

async function publishContentType(contentType: ContentType) {
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
  const navLink = await getOrCreateContentType(env, "navLink", {
    name: "Nav Link",
    description: "A link with text and a URL, used in navigation and footers.",
    fields: [
      { id: "text", name: "Text", type: "Symbol", required: true },
      { id: "url", name: "URL", type: "Symbol", required: true },
    ],
  });
  await publishContentType(navLink);

  // 2. Navigation
  const navigation = await getOrCreateContentType(env, "navigation", {
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
  const heroSection = await getOrCreateContentType(env, "heroSection", {
    name: "Hero Section",
    description: "A full-width section with a headline, subtext, and CTA.",
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
      { id: "ctaText", name: "CTA Text", type: "Symbol", required: true },
      { id: "ctaUrl", name: "CTA URL", type: "Symbol", required: true },
    ],
  });
  await publishContentType(heroSection);

  // 4. Image & Text Section
  const imageTextSection = await getOrCreateContentType(
    env,
    "imageTextSection",
    {
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
    }
  );
  await publishContentType(imageTextSection);

  // 5. Page
  const page = await getOrCreateContentType(env, "page", {
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
              linkContentType: ["heroSection", "imageTextSection", "carousel"],
            },
          ],
        },
      },
    ],
  });
  await publishContentType(page);

  // 6. Carousel Image
  const carouselImage = await getOrCreateContentType(env, "carouselImage", {
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

  // 7. Carousel
  const carousel = await getOrCreateContentType(env, "carousel", {
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

  // 8. Footer
  const footer = await getOrCreateContentType(env, "footer", {
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
