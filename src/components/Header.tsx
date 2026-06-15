"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Film, Search, Sun, Moon, Star, X, ArrowLeft, Tv } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { searchMovies, searchTVShows, getPosterUrl } from "@/lib/tmdb";

// Unified search result type
interface SearchItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  type: "movie" | "tv";
}

export default function Header() {
  const router = useRouter();
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Sync mounting state to avoid hydration flash/mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle clicking outside of search dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        // Don't close mobile search fully, just suggestion dropdown
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Combined Movie & TV Search Debouncer
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [movies, tvShows] = await Promise.all([
          searchMovies(searchQuery),
          searchTVShows(searchQuery),
        ]);

        const combined: SearchItem[] = [
          ...movies.map((m) => ({ ...m, type: "movie" as const })),
          ...tvShows.map((t) => ({ ...t, type: "tv" as const })),
        ];

        // Sort by popularity / vote score
        combined.sort((a, b) => b.vote_average - a.vote_average);
        
        setSearchResults(combined.slice(0, 6)); // limit to 6 items
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectResult = (item: SearchItem) => {
    setShowDropdown(false);
    setSearchQuery("");
    setIsMobileSearchOpen(false);
    router.push(item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 glass-panel border-b border-zinc-200/20 dark:border-zinc-800/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Expanded Search Bar Mode */}
        {isMobileSearchOpen ? (
          <div ref={mobileSearchRef} className="flex h-16 items-center gap-3 animate-fade-in">
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery("");
                setSearchResults([]);
              }}
              className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies & TV shows..."
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="w-full rounded-full bg-zinc-100 dark:bg-zinc-900 py-1.5 pl-9 pr-8 text-sm text-zinc-800 dark:text-zinc-100 outline-none border border-zinc-200 dark:border-zinc-800 focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Mobile Dropdown Suggestions */}
            {showDropdown && searchQuery.trim() !== "" && (
              <div className="absolute top-16 left-4 right-4 rounded-2xl bg-white dark:bg-zinc-900 p-2 shadow-2xl border border-zinc-200 dark:border-zinc-800/80 animate-fade-in z-50 max-h-[350px] overflow-y-auto">
                {isSearching ? (
                  <div className="py-4 text-center text-xs text-zinc-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {searchResults.map((item) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleSelectResult(item)}
                        className="flex items-center gap-3 w-full text-left p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="h-10 w-7 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
                          {item.poster_path ? (
                            <img
                              src={getPosterUrl(item.poster_path, "w92")}
                              alt={item.title || item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[6px] text-zinc-400">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {item.title || item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500">
                            <span className="capitalize font-bold text-brand">{item.type}</span>
                            <span>•</span>
                            <span>{(item.release_date || item.first_air_date || "").split("-")[0] || "N/A"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                              <Star className="h-2.5 w-2.5 fill-amber-500" />
                              {item.vote_average.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-zinc-500">No results found.</div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Normal Header Mode */
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl tracking-tight transition-transform hover:scale-[1.02] shrink-0">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand to-brand-glow text-white shadow-lg shadow-brand/30">
                <Film className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <span className="bg-gradient-to-r from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                Cine<span className="font-extrabold text-brand">Index</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              <Link href="/" className="transition-colors hover:text-brand">Home</Link>
              <Link href="/movie/genre/28" className="transition-colors hover:text-brand">Action Movies</Link>
              <Link href="/tv/66732" className="transition-colors hover:text-brand">Explore TV</Link>
              <Link href="/movie/year/2024" className="transition-colors hover:text-brand">2024 Releases</Link>
            </nav>

            {/* Search & Actions block */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Desktop Only Search Box */}
              <div ref={searchRef} className="relative hidden md:block w-48 lg:w-64">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search movies & TV..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(true);
                      }}
                      className="w-full rounded-full bg-zinc-100 dark:bg-zinc-900 py-1.5 pl-9 pr-8 text-sm text-zinc-800 dark:text-zinc-100 outline-none border border-zinc-200 dark:border-zinc-800/80 focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 pointer-events-none" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Suggestions Dropdown */}
                {showDropdown && searchQuery.trim() !== "" && (
                  <div className="absolute top-12 right-0 w-72 lg:w-80 rounded-2xl bg-white dark:bg-zinc-900 p-2 shadow-2xl border border-zinc-200 dark:border-zinc-800/80 animate-fade-in z-50">
                    {isSearching ? (
                      <div className="py-4 text-center text-xs text-zinc-500">Searching...</div>
                    ) : searchResults.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {searchResults.map((item) => (
                          <button
                            key={`${item.type}-${item.id}`}
                            onClick={() => handleSelectResult(item)}
                            className="flex items-center gap-3 w-full text-left p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                          >
                            <div className="h-10 w-7 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
                              {item.poster_path ? (
                                <img
                                  src={getPosterUrl(item.poster_path, "w92")}
                                  alt={item.title || item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[7px] text-zinc-400">No image</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {item.title || item.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                                <span className="capitalize font-bold text-brand">{item.type}</span>
                                <span>•</span>
                                <span>{(item.release_date || item.first_air_date || "").split("-")[0] || "N/A"}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                                  <Star className="h-3 w-3 fill-amber-500" />
                                  {item.vote_average.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-zinc-500">No items found.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Search Open Trigger Button */}
              <button
                onClick={() => setIsMobileSearchOpen(true)}
                className="flex md:hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                aria-label="Open search"
              >
                <Search className="h-4.5 w-4.5" />
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {!mounted ? (
                  <div className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                ) : theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-amber-400" />
                ) : (
                  <Moon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </header>
  );
}
