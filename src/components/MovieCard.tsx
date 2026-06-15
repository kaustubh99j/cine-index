import React from "react";
import Link from "next/link";
import { Star, Play } from "lucide-react";
import { Movie, getPosterUrl } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-brand/5 hover:-translate-y-1.5 transition-all duration-300 w-full"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {movie.poster_path ? (
          <img
            src={getPosterUrl(movie.poster_path, "w500")}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400 font-medium text-sm">
            No Poster Available
          </div>
        )}

        {/* Hover overlay with a Play Icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-xs text-white font-semibold shadow-md">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>

      {/* Info details */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 group-hover:text-brand dark:group-hover:text-brand-glow transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {releaseYear}
          </p>
        </div>
      </div>
    </Link>
  );
}
