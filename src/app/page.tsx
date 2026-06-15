import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Star, Play, Calendar, Film, ArrowRight } from "lucide-react";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getBackdropUrl,
} from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";

export const revalidate = 3600; // Revalidate home page every hour

export const metadata: Metadata = {
  title: "CineIndex - Discover Movies & TV Shows",
  description: "Browse, search, and discover trending, popular, and top-rated movies and TV shows. Watch trailers, view cast details, episodes, and recommendations.",
  alternates: {
    canonical: "https://cineindex.com",
  },
  openGraph: {
    title: "CineIndex - Discover Movies & TV Shows",
    description: "Browse, search, and discover trending, popular, and top-rated movies and TV shows. Watch trailers, view cast details, episodes, and recommendations.",
    url: "https://cineindex.com",
    siteName: "CineIndex",
    type: "website",
  },
};

export default async function Home() {
  // Fetch data in parallel on the server
  const [trending, popular, topRated, upcoming] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
  ]);

  // Featured Movie is the first trending movie
  const featuredMovie = trending[0] || popular[0];

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CineIndex",
    "url": "https://cineindex.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cineindex.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col gap-10 sm:gap-16 w-full animate-fade-in pb-12">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      {/* 1. Hero Feature Banner */}
      {featuredMovie && (
        <section className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/20 dark:border-zinc-800/40 min-h-[450px] sm:min-h-[550px] flex items-end">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={getBackdropUrl(featuredMovie.backdrop_path, "original")}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-center filter brightness-[0.45] dark:brightness-[0.35]"
            />
            {/* Ambient vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/20 to-transparent dark:from-zinc-950 dark:via-zinc-950/20 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-50 via-transparent to-transparent dark:from-zinc-950 dark:via-transparent dark:to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-12 md:p-16 max-w-3xl flex flex-col gap-4 text-zinc-900 dark:text-zinc-50">
            {/* Rating and Icon */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-xs text-brand dark:text-brand-glow font-bold backdrop-blur-md">
                <Film className="h-3.5 w-3.5" />
                Featured Today
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900/60 dark:bg-zinc-950/60 border border-zinc-500/20 text-xs text-zinc-100 font-bold backdrop-blur-md">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {featuredMovie.vote_average.toFixed(1)} Rating
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] bg-gradient-to-r from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              {featuredMovie.title}
            </h1>

            {/* Overview */}
            <p className="text-sm sm:text-base md:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal line-clamp-3 max-w-2xl mt-2">
              {featuredMovie.overview}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link
                href={`/movie/${featuredMovie.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand hover:bg-brand/90 text-white font-semibold shadow-lg shadow-brand/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Play className="h-4.5 w-4.5 fill-white" />
                View Details
              </Link>
              <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-zinc-200/50 hover:bg-zinc-200 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 border border-zinc-300/30 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-semibold transition-colors">
                <Calendar className="h-4 w-4" />
                Released {new Date(featuredMovie.release_date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Movie Category Carousels */}
      
      {/* Trending Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded bg-brand" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Trending Today</h2>
          </div>
          <span className="text-xs font-semibold text-brand hover:underline cursor-not-allowed flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x">
          {trending.map((movie) => (
            <div key={movie.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded bg-brand" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Popular Choices</h2>
          </div>
          <span className="text-xs font-semibold text-brand hover:underline cursor-not-allowed flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x">
          {popular.map((movie) => (
            <div key={movie.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded bg-brand" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">All-Time Classics</h2>
          </div>
          <span className="text-xs font-semibold text-brand hover:underline cursor-not-allowed flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x">
          {topRated.map((movie) => (
            <div key={movie.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-1 rounded bg-brand" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Upcoming Releases</h2>
          </div>
          <span className="text-xs font-semibold text-brand hover:underline cursor-not-allowed flex items-center gap-1">
            See all <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x">
          {upcoming.map((movie) => (
            <div key={movie.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
