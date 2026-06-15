import React from "react";
import Link from "next/link";
import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 py-12 px-4 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand to-brand-glow text-white shadow-lg shadow-brand/20">
                <Film className="h-4 w-4" />
              </div>
              <span className="bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                Cine<span className="font-extrabold text-brand">Index</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              Explore reviews, cast details, official trailers, and personalized recommendations for your favorite movies.
            </p>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-4">CineIndex</h3>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
              <li><span className="cursor-not-allowed hover:text-brand/50 transition-colors">Trending</span></li>
              <li><span className="cursor-not-allowed hover:text-brand/50 transition-colors">Popular</span></li>
              <li><span className="cursor-not-allowed hover:text-brand/50 transition-colors">Top Rated</span></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li><span className="cursor-not-allowed hover:text-brand/50 transition-colors">Discussions</span></li>
              <li><span className="cursor-not-allowed hover:text-brand/50 transition-colors">Leaderboard</span></li>
              <li><span className="cursor-not-allowed hover:text-brand/50 transition-colors">Support</span></li>
            </ul>
          </div>

          {/* TMDB Attribution Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 uppercase tracking-wider">TMDB API</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-brand/10 text-brand px-3 py-1 rounded text-xs font-semibold">
                Powered by TMDB
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-900 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} CineIndex. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-not-allowed hover:text-brand transition-colors">Privacy Policy</span>
            <span className="cursor-not-allowed hover:text-brand transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
