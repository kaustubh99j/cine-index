import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cineindex.com";

  // Main hub pages
  const routes = [
    "",
    "/movie/year/2024",
    "/movie/year/2023",
    "/movie/genre/28",
    "/movie/genre/18",
    "/movie/country/US",
    "/movie/country/IN",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Movie and TV show detail pages
  const movieIds = [1011985, 872585, 157336, 155];
  const tvIds = [66732, 1396];

  const movieRoutes = movieIds.map((id) => ({
    url: `${siteUrl}/movie/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const tvRoutes = tvIds.map((id) => ({
    url: `${siteUrl}/tv/${id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...movieRoutes, ...tvRoutes];
}
