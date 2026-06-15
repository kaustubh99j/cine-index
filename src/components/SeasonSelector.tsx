"use client";

import React, { useState } from "react";
import { Tv, Calendar } from "lucide-react";
import { Season } from "@/lib/tmdb";

interface SeasonSelectorProps {
  seasons: Season[];
}

export default function SeasonSelector({ seasons }: SeasonSelectorProps) {
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number>(
    seasons.length > 0 ? seasons[0].season_number : 1
  );

  const activeSeason = seasons.find((s) => s.season_number === selectedSeasonNumber);

  if (!seasons || seasons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 text-zinc-500">
        <Tv className="h-8 w-8 mb-2" />
        <p className="text-sm">No season information available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Seasons Tabs Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x">
        {seasons.map((season) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeasonNumber(season.season_number)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all shrink-0 snap-start cursor-pointer ${
              selectedSeasonNumber === season.season_number
                ? "bg-brand text-white border-brand shadow-md shadow-brand/10"
                : "bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            {season.name} ({season.episode_count} Ep)
          </button>
        ))}
      </div>

      {/* Selected Season Overview */}
      {activeSeason && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {activeSeason.overview && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic border-l-2 border-brand/40 pl-3">
              {activeSeason.overview}
            </p>
          )}

          {/* Episode List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSeason.episodes && activeSeason.episodes.length > 0 ? (
              activeSeason.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-xs font-bold text-brand uppercase bg-brand/5 dark:bg-brand/10 px-2.5 py-0.5 rounded-md">
                      EP {episode.episode_number}
                    </span>
                    {episode.air_date && (
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
                        <Calendar className="h-3 w-3" />
                        {new Date(episode.air_date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-zinc-800 dark:text-zinc-100 line-clamp-1 mb-1.5">
                    {episode.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {episode.overview || "No overview available for this episode."}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-6 text-center text-xs text-zinc-500">
                No episode listings for this season.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
