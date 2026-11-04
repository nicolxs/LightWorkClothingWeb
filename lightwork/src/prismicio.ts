import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";

/**
 * The project's Prismic repository name.
 * TODO: user will handle Prismic integration — set the repo name via
 * `npx prismic init` / Slice Machine login when ready.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's Prismic Route Resolvers.
 * This list determines which Prismic link fields resolve to which URLs.
 */
const routes: prismic.ClientConfig["routes"] = [
  { type: "homepage", path: "/" },
  { type: "product", path: "/shop/:uid" },
  { type: "story", path: "/our-story" },
  { type: "gallery", path: "/gallery" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 */
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(sm.apiEndpoint || repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"], revalidate: 60 } } // ISR + tag for revalidate webhook
        : { next: { revalidate: 5 } },
    ...config,
  });

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};
