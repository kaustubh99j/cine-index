import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Globe } from "lucide-react";
import { getMoviesByCountry } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

interface PageProps {
  params: Promise<{ code: string }>;
}

const getCountryName = (code: string): string => {
  const countries: Record<string, string> = {
    "US": "United States",
    "GB": "United Kingdom",
    "IN": "India",
    "FR": "France",
    "DE": "Germany",
    "JP": "Japan",
    "KR": "South Korea",
    "IT": "Italy",
    "ES": "Spain",
    "CN": "China",
    "CA": "Canada",
    "AU": "Australia"
  };
  return countries[code.toUpperCase()] || code.toUpperCase();
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const countryName = getCountryName(code);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cineindex.com";
  const canonicalUrl = `${siteUrl}/movie/country/${code}`;

  return {
    title: `Best Movies from ${countryName} - CineIndex`,
    description: `Explore and search the complete index of top-rated, trending, and popular movies from ${countryName}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Best Movies from ${countryName} - CineIndex`,
      description: `Explore and search the complete index of top-rated, trending, and popular movies from ${countryName}.`,
      url: canonicalUrl,
      siteName: "CineIndex",
      type: "website",
    },
  };
}

export default async function MoviesByCountryPage({ params }: PageProps) {
  const { code } = await params;
  const countryName = getCountryName(code);
  const movies = await getMoviesByCountry(code);

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Best Movies from ${countryName}`,
    "description": `Index of popular and top-rated films produced in ${countryName}.`,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://cineindex.com"}/movie/country/${code}`,
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in pb-16">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-brand dark:hover:text-brand-glow transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Browse
        </Link>
      </div>

      {/* Title Header */}
      <div className="flex items-center gap-3 border-b border-zinc-200/60 dark:border-zinc-800/80 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-sm">
          <Globe className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Movies from {countryName}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Browse through films produced in {countryName}.
          </p>
        </div>
      </div>

      {/* Movie Grid */}
      {movies && movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30">
          <p className="text-sm">No movies found from this country.</p>
        </div>
      )}

    </div>
  );
}
