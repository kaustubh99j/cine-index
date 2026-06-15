import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, Star, Tv, Users, Award, Globe } from "lucide-react";
import {
  getTVDetails,
  getTVCredits,
  getTVVideos,
  getTVRecommendations,
  getTVSeasonDetails,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
} from "@/lib/tmdb";
import TVCard from "@/components/TVCard";
import TrailerSection from "@/components/TrailerSection";
import SeasonSelector from "@/components/SeasonSelector";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tvId = parseInt(id, 10);
  const tv = await getTVDetails(tvId);

  if (!tv) {
    return {
      title: "TV Show Not Found - CineIndex",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cineindex.com";
  const canonicalUrl = `${siteUrl}/tv/${tv.id}`;
  const ogImage = tv.backdrop_path ? getBackdropUrl(tv.backdrop_path, "w1280") : `${siteUrl}/default-og.jpg`;

  return {
    title: `${tv.name} (${tv.first_air_date ? tv.first_air_date.split("-")[0] : "N/A"}) - CineIndex`,
    description: tv.overview ? tv.overview.substring(0, 160) : `Detailed episodes, seasons, ratings, and trailers for ${tv.name}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tv.name,
      description: tv.overview,
      url: canonicalUrl,
      siteName: "CineIndex",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: tv.name,
        },
      ],
      type: "video.tv_show",
    },
    twitter: {
      card: "summary_large_image",
      title: tv.name,
      description: tv.overview,
      images: [ogImage],
    },
  };
}

export default async function TVShowDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id, 10);

  // Fetch TV details, credits, videos, and recommendations
  const [tv, cast, videos, recommendations] = await Promise.all([
    getTVDetails(tvId),
    getTVCredits(tvId),
    getTVVideos(tvId),
    getTVRecommendations(tvId),
  ]);

  if (!tv) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 gap-4">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">TV Show Not Found</h2>
        <p className="text-zinc-500 max-w-sm">The series you are looking for might have been removed or is temporarily unavailable.</p>
        <Link href="/" className="px-6 py-2 bg-brand text-white rounded-full font-semibold hover:bg-brand/90 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  // Pre-load all season episodes on the server to prevent additional API trips
  const seasonsWithEpisodes = await Promise.all(
    (tv.seasons || []).map(async (season) => {
      const details = await getTVSeasonDetails(tv.id, season.season_number);
      return details || season;
    })
  );

  const releaseYear = tv.first_air_date ? tv.first_air_date.split("-")[0] : "N/A";

  // JSON-LD Schema
  const tvSchema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": tv.name,
    "description": tv.overview,
    "image": tv.poster_path ? getPosterUrl(tv.poster_path, "w500") : undefined,
    "numberOfSeasons": tv.number_of_seasons,
    "numberOfEpisodes": tv.number_of_episodes,
    "dateCreated": tv.first_air_date,
    "aggregateRating": tv.vote_average ? {
      "@type": "AggregateRating",
      "ratingValue": tv.vote_average.toFixed(1),
      "ratingCount": tv.vote_count || 1,
      "bestRating": "10",
      "worstRating": "1"
    } : undefined,
  };

  return (
    <div className="flex flex-col gap-12 sm:gap-16 w-full animate-fade-in pb-16">
      
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tvSchema) }}
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

      {/* Hero TV Show Details Banner */}
      <section className="relative w-full rounded-3xl overflow-hidden border border-zinc-200/20 dark:border-zinc-800/40 bg-white dark:bg-zinc-900 shadow-xl p-6 sm:p-10 md:p-12">
        {/* Backdrop Ambient Light */}
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-[0.06]">
          <img
            src={getBackdropUrl(tv.backdrop_path, "original")}
            alt=""
            className="w-full h-full object-cover filter blur-md"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* TV Poster */}
          <div className="w-full md:w-64 lg:w-80 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl bg-zinc-800 border border-zinc-200/10 self-center md:self-start">
            {tv.poster_path ? (
              <img
                src={getPosterUrl(tv.poster_path, "w500")}
                alt={tv.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 font-medium">
                No Poster Available
              </div>
            )}
          </div>

          {/* TV Details Info */}
          <div className="flex-1 flex flex-col gap-6 text-zinc-900 dark:text-zinc-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-zinc-500 dark:text-zinc-400">
                <span>{releaseYear}</span>
                <span>•</span>
                <span>{tv.number_of_seasons} {tv.number_of_seasons === 1 ? 'Season' : 'Seasons'}</span>
                <span>•</span>
                <span>{tv.number_of_episodes} Episodes</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  {tv.vote_average.toFixed(1)} ({tv.vote_count} votes)
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mt-2 bg-gradient-to-r from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                {tv.name}
              </h1>

              {tv.tagline && (
                <p className="text-sm sm:text-base italic text-brand dark:text-brand-glow font-medium mt-2">
                  &ldquo;{tv.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Overview */}
            <div className="flex flex-col gap-2">
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Overview</h3>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
                {tv.overview || "No overview available for this series."}
              </p>
            </div>

            {/* Genres */}
            {tv.genres && tv.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tv.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* TV Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-200/60 dark:border-zinc-800/80 pt-6 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Status</span>
                <span className="text-sm font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">{tv.status || "N/A"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">First Air Date</span>
                <span className="text-sm font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">
                  {tv.first_air_date ? new Date(tv.first_air_date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Runtime (Avg)</span>
                <span className="text-sm font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">
                  {tv.episode_run_time && tv.episode_run_time.length > 0 ? `${tv.episode_run_time[0]}m` : "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">Episodes</span>
                <span className="text-sm font-bold mt-0.5 text-zinc-800 dark:text-zinc-200">{tv.number_of_episodes || "N/A"}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cast Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-brand" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Cast & Crew</h2>
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

      {/* Seasons & Episodes Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Tv className="h-5 w-5 text-brand" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Seasons & Episodes</h2>
        </div>
        <SeasonSelector seasons={seasonsWithEpisodes} />
      </section>

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
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Similar Series Recommended</h2>
          </div>
          
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth snap-x">
            {recommendations.slice(0, 8).map((recShow) => (
              <div key={recShow.id} className="w-[160px] sm:w-[220px] shrink-0 snap-start">
                <TVCard show={recShow} />
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
