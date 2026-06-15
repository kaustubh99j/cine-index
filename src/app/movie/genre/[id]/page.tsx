import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Film } from "lucide-react";
import { getMoviesByGenre } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

const getGenreName = (id: string): string => {
  const genres: Record<string, string> = {
    "28": "Action",
    "12": "Adventure",
    "16": "Animation",
    "35": "Comedy",
    "80": "Crime",
    "99": "Documentary",
    "18": "Drama",
    "10751": "Family",
    "14": "Fantasy",
    "36": "History",
    "27": "Horror",
    "10402": "Music",
    "9648": "Mystery",
    "10749": "Romance",
    "878": "Science Fiction",
    "10770": "TV Movie",
    "53": "Thriller",
    "10752": "War",
    "37": "Western"
  };
  return genres[id] || "Cinematic Genre";
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const genreName = getGenreName(id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cineindex.com";
  const canonicalUrl = `${siteUrl}/movie/genre/${id}`;

  return {
    title: `Best ${genreName} Movies - CineIndex`,
    description: `Browse and search the index of the top-rated, trending, and most popular ${genreName} movies.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Best ${genreName} Movies - CineIndex`,
      description: `Browse and search the index of the top-rated, trending, and most popular ${genreName} movies.`,
      url: canonicalUrl,
      siteName: "CineIndex",
      type: "website",
    },
  };
}

export default async function MoviesByGenrePage({ params }: PageProps) {
  const { id } = await params;
  const genreName = getGenreName(id);
  const movies = await getMoviesByGenre(id);

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Best ${genreName} Movies`,
    "description": `Index of popular and top-rated ${genreName} films.`,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || "https://cineindex.com"}/movie/genre/${id}`,
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
          <Film className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            {genreName} Movies
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Browse through our extensive catalogue of {genreName.toLowerCase()} movies.
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
          <p className="text-sm">No movies found in this genre.</p>
        </div>
      )}

    </div>
  );
}
