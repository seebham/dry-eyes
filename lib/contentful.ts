const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_PREVIEW_ACCESS_TOKEN =
  process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

type ContentfulResponse<T = any> = {
  data: T;
  errors?: Array<{ message: string }>;
};

export const fetchContentfulGraphQL = async <T = any>(
  query: string,
  preview = false
): Promise<T> => {
  if (!CONTENTFUL_SPACE_ID) {
    throw new Error("CONTENTFUL_SPACE_ID environment variable is not set");
  }

  const accessToken = preview
    ? CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : CONTENTFUL_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      `${
        preview ? "CONTENTFUL_PREVIEW_ACCESS_TOKEN" : "CONTENTFUL_ACCESS_TOKEN"
      } environment variable is not set`
    );
  }

  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query }),
      next: { revalidate: preview ? 0 : 3600 }, // No cache for preview, 1 hour for production
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: ContentfulResponse<T> = await response.json();

    if (json.errors) {
      throw new Error(
        `GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`
      );
    }

    return json.data;
  } catch (error) {
    console.error("Contentful GraphQL request failed:", error);
    throw error;
  }
};
