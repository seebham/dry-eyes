import * as dotenv from "dotenv";
import { writeFileSync } from "fs";
import { gql, request } from "graphql-request";

// Load environment variables
dotenv.config({ path: ".env.local" });

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  console.error("Missing required environment variables:");
  console.error("- CONTENTFUL_SPACE_ID");
  console.error("- CONTENTFUL_ACCESS_TOKEN");
  process.exit(1);
}

const endpoint = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

// GraphQL introspection query to get schema information
const introspectionQuery = gql`
  query IntrospectionQuery {
    __schema {
      types {
        name
        kind
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    }
  }
`;

// Base types that we'll extend
const baseTypes = `
import { Document } from '@contentful/rich-text-types';

export type Sys = {
  id: string;
  spaceId: string;
  environmentId: string;
  contentType?: {
    sys: {
      id: string;
      linkType: 'ContentType';
      type: 'Link';
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
      type: 'Link';
      linkType: 'Tag';
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

`;

function mapGraphQLTypeToTypeScript(type: any, fieldName?: string): string {
  if (!type) return "any";

  if (type.kind === "NON_NULL") {
    return mapGraphQLTypeToTypeScript(type.ofType, fieldName);
  }

  if (type.kind === "LIST") {
    return `Array<${mapGraphQLTypeToTypeScript(type.ofType, fieldName)}>`;
  }

  switch (type.name) {
    case "String":
      return "string";
    case "Int":
      return "number";
    case "Float":
      return "number";
    case "Boolean":
      return "boolean";
    case "DateTime":
      return "string";
    case "JSON":
      return "any";
    case "ID":
      return "string";
    case "RichText":
      return "RichText";
    case "Asset":
      return "Asset";
    default:
      // Handle specific known collection patterns - these should be collection objects, not direct arrays
      if (fieldName === "contentBlocksCollection") {
        return "{ items: Array<HeroSection | ImageTextSection | Carousel | Cta> }";
      }
      if (fieldName === "imagesCollection") {
        return "{ items: Array<CarouselImage> }";
      }
      if (
        fieldName === "footerLinksCollection" ||
        fieldName === "navLinksCollection"
      ) {
        return "{ items: Array<NavLink> }";
      }
      if (fieldName === "content" && type.name?.includes("Content")) {
        return "RichText";
      }

      // Handle other collection types - these are objects with items property
      if (type.name && type.name.includes("Collection")) {
        // Extract the base type name from the collection name
        const baseTypeName = type.name.replace("Collection", "");
        return `{ items: Array<${baseTypeName}> }`;
      }
      return type.name || "any";
  }
}

async function generateTypes() {
  try {
    console.log("🔍 Fetching Contentful schema...");

    const result = (await request(
      endpoint,
      introspectionQuery,
      {},
      {
        Authorization: `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
      }
    )) as { __schema: any };

    console.log("✅ Schema fetched successfully");
    console.log("🏗️  Generating TypeScript types...");

    const schema = result.__schema;
    const contentTypes = schema.types.filter(
      (type: any) =>
        type.kind === "OBJECT" &&
        type.name &&
        !type.name.startsWith("__") &&
        ![
          "Query",
          "Sys",
          "ContentfulMetadata",
          "Asset",
          "AssetCollection",
          "EntryCollection",
        ].includes(type.name) &&
        !type.name.endsWith("Collection") &&
        !type.name.endsWith("Filter") &&
        !type.name.endsWith("Order") &&
        !type.name.includes("LinkingCollections") &&
        type.fields?.some((field: any) => field.name === "sys")
    );

    let generatedTypes = baseTypes;

    contentTypes.forEach((contentType: any) => {
      const typeName = contentType.name;
      console.log(`📝 Generating type for: ${typeName}`);

      generatedTypes += `\nexport type ${typeName} = Entry & {\n`;

      const fields = contentType.fields.filter(
        (field: any) =>
          !["sys", "contentfulMetadata", "linkedFrom"].includes(field.name)
      );

      fields.forEach((field: any) => {
        const fieldName = field.name;
        const fieldType = mapGraphQLTypeToTypeScript(field.type, fieldName);
        generatedTypes += `  ${fieldName}?: ${fieldType};\n`;
      });

      generatedTypes += `};\n`;
    });

    // Add collection types
    generatedTypes += `\n// Collection types\n`;
    contentTypes.forEach((contentType: any) => {
      const typeName = contentType.name;
      generatedTypes += `export type ${typeName}Collection = {\n`;
      generatedTypes += `  total: number;\n`;
      generatedTypes += `  skip: number;\n`;
      generatedTypes += `  limit: number;\n`;
      generatedTypes += `  items: Array<${typeName}>;\n`;
      generatedTypes += `};\n\n`;
    });

    // Write the generated types to file
    writeFileSync("lib/types.ts", generatedTypes);

    console.log("✅ TypeScript types generated successfully!");
    console.log("📁 Types saved to lib/types.ts");
    console.log(`🎉 Generated ${contentTypes.length} content type(s)`);
  } catch (error) {
    console.error("❌ Error generating types:", error);
    process.exit(1);
  }
}

generateTypes();
