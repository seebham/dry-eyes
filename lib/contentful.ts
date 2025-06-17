const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_PREVIEW_ACCESS_TOKEN =
  process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
const CONTENTFUL_ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";

type ContentfulResponse<T = unknown> = {
  data: T;
  errors?: Array<{ message: string }>;
};

export const fetchContentfulGraphQL = async <T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  preview = false,
  revalidate?: number | false
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
      body: JSON.stringify({ query, variables }),
      next: { revalidate: preview ? 0 : revalidate ?? 3600 }, // preview - no cache, custom revalidate or 1 hour default
    });

    if (!response.ok) {
      let errorDetails;
      try {
        errorDetails = await response.text();
      } catch {
        errorDetails = "Unable to read error response";
      }
      throw new Error(
        `HTTP error! status: ${response.status}, details: ${errorDetails}`
      );
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
    console.error("Query:", query);
    console.error("Variables:", variables);
    throw error;
  }
};
