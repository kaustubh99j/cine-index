"use client";

import React, { useState } from "react";
import { Play, X, Video } from "lucide-react";
import { Video as MovieVideo } from "@/lib/tmdb";

interface TrailerSectionProps {
  videos: MovieVideo[];
}

export default function TrailerSection({ videos }: TrailerSectionProps) {
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);

  if (!videos || videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 text-zinc-500">
        <Video className="h-8 w-8 mb-2" />
        <p className="text-sm">No trailers available for this movie.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Horizontal List of Video Thumbnails */}
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveVideoKey(video.key)}
            className="group relative flex flex-col w-[260px] sm:w-[320px] shrink-0 rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all duration-300 snap-start cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-800">
              <img
                src={`https://img.youtube.com/vi/${video.key}/0.jpg`}
                alt={video.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Play Badge */}
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 group-hover:bg-brand group-hover:border-transparent group-hover:scale-110 transition-all duration-300">
                  <Play className="h-5 w-5 fill-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Video Title */}
            <div className="p-3 text-left">
              <h4 className="font-semibold text-sm text-zinc-800 dark:text-zinc-100 truncate group-hover:text-brand dark:group-hover:text-brand-glow transition-colors">
                {video.name}
              </h4>
              <span className="text-xs text-zinc-500 mt-0.5 block">{video.type} • YouTube</span>
            </div>
          </button>
        ))}
      </div>

      {/* Video Modal Overlay */}
      {activeVideoKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
          {/* Backdrop Click Close */}
          <div className="absolute inset-0" onClick={() => setActiveVideoKey(null)} />

          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950 z-10 flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoKey(null)}
              className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 hover:border-white/25 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* YouTube Embed Iframe */}
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoKey}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
