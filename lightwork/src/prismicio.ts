import * as prismic from "@prismicio/client";
import * as prismicNext from "@prismicio/next";
import sm from "../slicemachine.config.json";

/**
 * The project's Prismic repository name.
 * Repo: LightWorkClothing — https://lightworkclothing.prismic.io/
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's Prismic Route Resolvers.
 * This list determines which Prismic link fields resolve to which URLs.
 */
const routes: prismic.ClientConfig["routes"] = [
  { type: "homepage", path: "/" },
  { type: "product", uid: "custom", path: "/shop/:uid" },
  { type: "product", path: "/shop" },
  { type: "story", path: "/our-story" },
  { type: "gallery", path: "/gallery" },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * Fetches are tagged "prismic" in production so the /api/revalidate webhook
 * can clear cache on publish (revalidateTag("prismic")).
 */
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  // Auto-previews are enabled per-request by @prismicio/next when `req` is
  // passed in (e.g. createClient({ req }) in a Server Component route).
  prismicNext.enableAutoPreviews({
    client,
    ...config,
  });

  return client;
};
