import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Star, Globe, Award, Users } from "lucide-react";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieRecommendations,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
} from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import TrailerSection from "@/components/TrailerSection";
import BannerAd from "@/components/ads/BannerAd";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  const movie = await getMovieDetails(movieId);

  if (!movie) {
    return {
      title: "Movie Not Found - CineIndex",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cineindex.com";
  const canonicalUrl = `${siteUrl}/movie/${movie.id}`;
  const ogImage = movie.backdrop_path ? getBackdropUrl(movie.backdrop_path, "w1280") : `${siteUrl}/default-og.jpg`;

  return {
    title: `${movie.title} (${movie.release_date ? movie.release_date.split("-")[0] : "N/A"}) - CineIndex`,
    description: movie.overview ? movie.overview.substring(0, 160) : `Detailed information, cast, ratings, reviews, and trailer for ${movie.title}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: movie.title,
      description: movie.overview,
      url: canonicalUrl,
      siteName: "CineIndex",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
      type: "video.movie",
    },
    twitter: {
      card: "summary_large_image",
      title: movie.title,
      description: movie.overview,
      images: [ogImage],
    },
  };
}

const formatCurrency = (amount?: number) => {
  if (!amount || amount === 0) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatRuntime = (minutes?: number) => {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export default async function MovieDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  // Fetch movie data in parallel on the server
  const [movie, cast, videos, recommendations] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
    getMovieRecommendations(movieId),
  ]);

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-4">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Movie Not Found</h2>
        <p className="text-zinc-500 max-w-sm">The movie you are looking for might have been removed or is temporarily unavailable.</p>
        <Link href="/" className="px-6 py-2 bg-brand text-white rounded-full font-semibold hover:bg-brand/90 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.overview,
    "image": movie.poster_path ? getPosterUrl(movie.poster_path, "w500") : undefined,
    "dateCreated": movie.release_date,
    "duration": movie.runtime ? `PT${movie.runtime}M` : undefined,
    "aggregateRating": movie.vote_average ? {
      "@type": "AggregateRating",
      "ratingValue": movie.vote_average.toFixed(1),
      "ratingCount": movie.vote_count || 1,
      "bestRating": "10",
      "worstRating": "1"
    } : undefined,
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16 w-full animate-fade-in pb-16">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      
      {/* Back Button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-brand dark:hover:text-brand-glow transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Browse
        </Link>
      </div>

      {/* Hero Movie Details Banner */}
      <section className="relative w-full rounded-3xl overflow-hidden border border-zinc-200/20 dark:border-zinc-800/40 bg-white dark:bg-zinc-900 shadow-xl p-6 sm:p-10 md:p-12">
        {/* Backdrop Ambient Light */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-[0.06]">
          <img
            src={getBackdropUrl(movie.backdrop_path, "original")}
            alt=""
            className="w-full h-full object-cover filter blur-md"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Movie Poster */}
          <div className="w-full md:w-64 lg:w-80 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-zinc-800 border border-zinc-200/10 self-center md:self-start">
            {movie.poster_path ? (
              <img
                src={getPosterUrl(movie.poster_path, "w500")}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 font-medium">
                No Poster Available
              </div>
            )}
          </div>

          {/* Movie Details Info */}
          <div className="flex-1 flex flex-col gap-6 text-zinc-900 dark:text-zinc-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400">
                <span>{releaseYear}</span>
                <span>•</span>
                <span>{formatRuntime(movie.runtime)}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mt-2 bg-gradient-to-r from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-sm sm:text-base italic text-brand dark:text-brand-glow font-medium mt-2">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Overview / Movie Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Overview</h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                {movie.overview || "No overview available for this movie."}
              </p>
            </div>

            {/* Parents Guide */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
              <h3 className="text-base font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <span className="text-lg">🛡️</span> Parents Guide
              </h3>
              <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                <p>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">Rating:</span>{" "}
                  {movie.vote_average >= 7.5 ? "PG-13 — Parents Strongly Cautioned" : movie.vote_average >= 5 ? "PG — Parental Guidance Suggested" : "R — Restricted"}
                </p>
                <p>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">Content Advisory:</span>{" "}
                  This film may contain scenes of action violence, mild language, and thematic elements. Viewer discretion is advised for younger audiences.
                </p>
                <p>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">Recommended Age:</span>{" "}
                  {movie.vote_average >= 7.5 ? "13+" : movie.vote_average >= 5 ? "10+" : "17+"}
                </p>
              </div>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Movie Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-200/60 dark:border-zinc-800/80 pt-6 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Status</span>
                <span className="text-sm font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">{movie.status || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Release Date</span>
                <span className="text-sm font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">
                  {movie.release_date ? new Date(movie.release_date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Budget</span>
                <span className="text-sm font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">{formatCurrency(movie.budget)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Revenue</span>
                <span className="text-sm font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">{formatCurrency(movie.revenue)}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Banner Ad after Hero */}
      <BannerAd />

      {/* Cast Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-brand" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Principals & Cast</h2>
        </div>
        
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x">
          {cast.slice(0, 10).map((actor) => (
            <div
              key={actor.id}
              className="w-[120px] sm:w-[150px] shrink-0 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-2 sm:p-3 text-center shadow-sm hover:shadow-md transition-shadow snap-start"
            >
              {/* Profile Image */}
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
                {actor.profile_path ? (
                  <img
                    src={getProfileUrl(actor.profile_path, "w185")}
                    alt={actor.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400 font-semibold">
                    No Photo
                  </div>
                )}
              </div>
              {/* Name */}
              <h4 className="font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 truncate">
                {actor.name}
              </h4>
              {/* Character */}
              <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                {actor.character}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Ad after Cast */}
      <BannerAd />

      {/* Trailers Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-brand" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Videos & Trailers</h2>
        </div>
        <TrailerSection videos={videos} />
      </section>

      {/* Recommendations Section */}
      {recommendations && recommendations.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-brand" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Recommended For You</h2>
          </div>
          
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x">
            {recommendations.slice(0, 8).map((recMovie) => (
              <div key={recMovie.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
                <MovieCard movie={recMovie} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Banner Ad at bottom */}
      <BannerAd />

    </div>
  );
}
