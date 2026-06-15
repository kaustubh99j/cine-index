export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  runtime?: number; // in minutes
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

const TMDB_API_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// Get TMDB API configurations from environment (supporting both server-only and next-public variants)
const getApiKey = () => process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
const getAccessToken = () => process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN || "";

// Custom fetcher helper
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T | null> {
  const apiKey = getApiKey();
  const token = getAccessToken();

  if (!apiKey && !token) {
    return null; // Force mock usage if no credentials provided
  }

  const queryParams = new URLSearchParams(params);
  if (apiKey) {
    queryParams.set("api_key", apiKey);
  }

  const url = `${TMDB_API_BASE}${endpoint}?${queryParams.toString()}`;
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.warn(`TMDB API call to ${endpoint} failed with status ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(`TMDB API fetch error on ${endpoint}:`, error);
    return null;
  }
}

// Image helpers
export const getPosterUrl = (path: string | null, size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500") => {
  if (!path) return "/images/placeholder-poster.jpg";
  if (path.startsWith("http")) return path; // Allow direct URLs in mocks
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: "w300" | "w780" | "w1280" | "original" = "original") => {
  if (!path) return "/images/placeholder-backdrop.jpg";
  if (path.startsWith("http")) return path; // Allow direct URLs in mocks
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getProfileUrl = (path: string | null, size: "w45" | "w185" | "h632" | "original" = "w185") => {
  if (!path) return "/images/placeholder-profile.jpg";
  if (path.startsWith("http")) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

// Rich Mock Data
const MOCK_MOVIES: Movie[] = [
  {
    id: 1011985,
    title: "Dune: Part Two",
    original_title: "Dune: Part Two",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    poster_path: "/8cdga42qKDEFe4R22wKXM6BF5C5.jpg",
    backdrop_path: "/xOM1Z3xm6OIwKG27tCHBp4zUj6x.jpg",
    vote_average: 8.3,
    vote_count: 4200,
    release_date: "2024-02-27",
    genre_ids: [878, 12],
    genres: [
      { id: 878, name: "Science Fiction" },
      { id: 12, name: "Adventure" },
    ],
    runtime: 166,
    budget: 190000000,
    revenue: 712000000,
    status: "Released",
    tagline: "Long live the fighters.",
  },
  {
    id: 872585,
    title: "Oppenheimer",
    original_title: "Oppenheimer",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    poster_path: "/8Gxv8gSjdh1jZtXtZoneQa4qZ5y.jpg",
    backdrop_path: "/fm6q083qkg0gSU2lw3oxtBOFS5C.jpg",
    vote_average: 8.1,
    vote_count: 8400,
    release_date: "2023-07-19",
    genre_ids: [18, 36],
    genres: [
      { id: 18, name: "Drama" },
      { id: 36, name: "History" },
    ],
    runtime: 180,
    budget: 100000000,
    revenue: 957000000,
    status: "Released",
    tagline: "The world forever changes.",
  },
  {
    id: 157336,
    title: "Interstellar",
    original_title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    poster_path: "/gEU2Qv61XZ7uLUgfhvveuaju3ms.jpg",
    backdrop_path: "/xJHokZbljvjC1OHso6Zdq7Zn0Cc.jpg",
    vote_average: 8.4,
    vote_count: 34000,
    release_date: "2014-11-05",
    genre_ids: [12, 18, 878],
    genres: [
      { id: 12, name: "Adventure" },
      { id: 18, name: "Drama" },
      { id: 878, name: "Science Fiction" },
    ],
    runtime: 169,
    budget: 165000000,
    revenue: 731000000,
    status: "Released",
    tagline: "Mankind was born on Earth. It was never meant to die here.",
  },
  {
    id: 155,
    title: "The Dark Knight",
    original_title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    poster_path: "/qJ2tWGBbeZ12Qhu3VZTMN5m686e.jpg",
    backdrop_path: "/nMKHM656vscNuel546T706Vk3V7.jpg",
    vote_average: 8.5,
    vote_count: 32000,
    release_date: "2008-07-16",
    genre_ids: [18, 28, 80, 12],
    genres: [
      { id: 28, name: "Action" },
      { id: 80, name: "Crime" },
      { id: 18, name: "Drama" },
    ],
    runtime: 152,
    budget: 185000000,
    revenue: 1006000000,
    status: "Released",
    tagline: "Why So Serious?",
  },
  {
    id: 324857,
    title: "Spider-Man: Into the Spider-Verse",
    original_title: "Spider-Man: Into the Spider-Verse",
    overview: "Struggling to find his place in the world while juggling school and friends, Brooklyn teenager Miles Morales is unexpectedly bitten by a radioactive spider and develops superpowers. When the infamous Kingpin unleashes a super-collider, it pulls alternate versions of Spider-Man from other dimensions into Miles' world.",
    poster_path: "/iiIK622vi4Yj73md462ns8j5Cc1.jpg",
    backdrop_path: "/7823f66p89c2c01990a427ce7a1f.jpg",
    vote_average: 8.4,
    vote_count: 15000,
    release_date: "2018-12-06",
    genre_ids: [16, 28, 12, 878],
    genres: [
      { id: 16, name: "Animation" },
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 878, name: "Science Fiction" },
    ],
    runtime: 117,
    budget: 90000000,
    revenue: 384000000,
    status: "Released",
    tagline: "More than one wears the mask.",
  },
  {
    id: 76600,
    title: "Avatar: The Way of Water",
    original_title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
    poster_path: "/t6zl8stnS2c92l82c3c137t752.jpg",
    backdrop_path: "/8s459BPjnnTJ3rrnJ5wN62t48kf.jpg",
    vote_average: 7.6,
    vote_count: 11000,
    release_date: "2022-12-14",
    genre_ids: [878, 28, 12],
    genres: [
      { id: 878, name: "Science Fiction" },
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
    ],
    runtime: 192,
    budget: 350000000,
    revenue: 2320000000,
    status: "Released",
    tagline: "Return to Pandora.",
  },
  {
    id: 27205,
    title: "Inception",
    original_title: "Inception",
    overview: "Cobb, a skilled thief who is absolute best in the dangerous art of extraction, steals valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive.",
    poster_path: "/o0lIWm9gH6uTszvFzXygRUiR34V.jpg",
    backdrop_path: "/s301mZd7tyZ7fTAgSR4e4916vOr.jpg",
    vote_average: 8.4,
    vote_count: 36000,
    release_date: "2010-07-15",
    genre_ids: [28, 878, 12],
    genres: [
      { id: 28, name: "Action" },
      { id: 878, name: "Science Fiction" },
      { id: 12, name: "Adventure" },
    ],
    runtime: 148,
    budget: 160000000,
    revenue: 829000000,
    status: "Released",
    tagline: "Your mind is the scene of the crime.",
  },
  {
    id: 313369,
    title: "La La Land",
    original_title: "La La Land",
    overview: "Mia, an aspiring actress, serves lattes to movie stars in between auditions and Sebastian, a jazz musician, scrapes by playing cocktail party gigs in dingy bars, but as success mounts they are faced with decisions that begin to fray the fragile fabric of their love affair, and the dreams they worked so hard to maintain in each other threaten to rip them apart.",
    poster_path: "/uC6TTa7XI2HsguvUA3P51U2Z3P9.jpg",
    backdrop_path: "/lA5fOB8C1Zh0gBbl576U621472C.jpg",
    vote_average: 7.9,
    vote_count: 16000,
    release_date: "2016-11-29",
    genre_ids: [35, 18, 10749],
    genres: [
      { id: 18, name: "Drama" },
      { id: 35, name: "Comedy" },
      { id: 10749, name: "Romance" },
    ],
    runtime: 128,
    budget: 30000000,
    revenue: 447000000,
    status: "Released",
    tagline: "Here's to the fools who dream.",
  }
];

const MOCK_CAST: Record<number, CastMember[]> = {
  1011985: [
    { id: 1, name: "Timothée Chalamet", character: "Paul Atreides", profile_path: "/BE751S8K3D0d29D03848Lks839.jpg", order: 0 },
    { id: 2, name: "Zendaya", character: "Chani", profile_path: "/y2353LjsS8K3D0d29D03848Lks8.jpg", order: 1 },
    { id: 3, name: "Rebecca Ferguson", character: "Lady Jessica Atreides", profile_path: "/lJ648S8K3D0d29D03848Lks83.jpg", order: 2 },
    { id: 4, name: "Josh Brolin", character: "Gurney Halleck", profile_path: "/krt48S8K3D0d29D03848Lks839.jpg", order: 3 },
    { id: 5, name: "Austin Butler", character: "Feyd-Rautha Harkonnen", profile_path: "/jks48S8K3D0d29D03848Lks839.jpg", order: 4 },
    { id: 6, name: "Florence Pugh", character: "Princess Irulan Corrino", profile_path: "/hks48S8K3D0d29D03848Lks839.jpg", order: 5 },
  ],
  872585: [
    { id: 11, name: "Cillian Murphy", character: "J. Robert Oppenheimer", profile_path: "/n58S8K3D0d29D03848Lks839.jpg", order: 0 },
    { id: 12, name: "Emily Blunt", character: "Katherine 'Kitty' Oppenheimer", profile_path: "/m58S8K3D0d29D03848Lks839.jpg", order: 1 },
    { id: 13, name: "Matt Damon", character: "Gen. Leslie Groves", profile_path: "/p58S8K3D0d29D03848Lks839.jpg", order: 2 },
    { id: 14, name: "Robert Downey Jr.", character: "Lewis Strauss", profile_path: "/q58S8K3D0d29D03848Lks839.jpg", order: 3 },
    { id: 15, name: "Florence Pugh", character: "Jean Tatlock", profile_path: "/hks48S8K3D0d29D03848Lks839.jpg", order: 4 },
  ],
  157336: [
    { id: 21, name: "Matthew McConaughey", character: "Cooper", profile_path: "/mMcConaughey.jpg", order: 0 },
    { id: 22, name: "Anne Hathaway", character: "Brand", profile_path: "/aHathaway.jpg", order: 1 },
    { id: 23, name: "Jessica Chastain", character: "Murph", profile_path: "/jChastain.jpg", order: 2 },
    { id: 24, name: "Michael Caine", character: "Professor Brand", profile_path: "/mCaine.jpg", order: 3 },
  ],
  155: [
    { id: 31, name: "Christian Bale", character: "Bruce Wayne / Batman", profile_path: "/cBale.jpg", order: 0 },
    { id: 32, name: "Heath Ledger", character: "Joker", profile_path: "/hLedger.jpg", order: 1 },
    { id: 33, name: "Gary Oldman", character: "Jim Gordon", profile_path: "/gOldman.jpg", order: 2 },
    { id: 34, name: "Aaron Eckhart", character: "Harvey Dent", profile_path: "/aEckhart.jpg", order: 3 },
    { id: 35, name: "Maggie Gyllenhaal", character: "Rachel Dawes", profile_path: "/mGyllenhaal.jpg", order: 4 },
  ]
};

const MOCK_VIDEOS: Record<number, Video[]> = {
  1011985: [
    { id: "v1", key: "U2Qp5pL38e4", name: "Official Trailer 3", site: "YouTube", type: "Trailer", official: true },
    { id: "v2", key: "Way9Dexny3w", name: "Official Trailer", site: "YouTube", type: "Trailer", official: true },
  ],
  872585: [
    { id: "o1", key: "uYPbbWRjXTg", name: "Official Trailer", site: "YouTube", type: "Trailer", official: true },
  ],
  157336: [
    { id: "i1", key: "zSWdZAIBEs4", name: "Official Trailer", site: "YouTube", type: "Trailer", official: true },
  ],
  155: [
    { id: "d1", key: "EXeTwQWrcwY", name: "Official Main Trailer", site: "YouTube", type: "Trailer", official: true },
  ]
};

// Generic mock cast generator for IDs not explicitly mocked
function generateMockCast(movieId: number): CastMember[] {
  return [
    { id: movieId + 1, name: "Actor One", character: "Hero / Lead", profile_path: null, order: 0 },
    { id: movieId + 2, name: "Actor Two", character: "Heroine / Partner", profile_path: null, order: 1 },
    { id: movieId + 3, name: "Actor Three", character: "Antagonist", profile_path: null, order: 2 },
    { id: movieId + 4, name: "Actor Four", character: "Sidekick / Friend", profile_path: null, order: 3 },
    { id: movieId + 5, name: "Actor Five", character: "Supporting", profile_path: null, order: 4 },
  ];
}

// Generic mock video generator
function generateMockVideos(movieId: number): Video[] {
  // Use a fallback classic cinema-themed YouTube video or standard movie trailer id
  return [
    { id: `vid-${movieId}`, key: "dQw4w9WgXcQ", name: "Official Trailer", site: "YouTube", type: "Trailer", official: true },
  ];
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/trending/movie/day");
  return data?.results || MOCK_MOVIES;
}

export async function getPopularMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/popular");
  return data?.results || MOCK_MOVIES;
}

export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/top_rated");
  return data?.results || [...MOCK_MOVIES].reverse();
}

export async function getUpcomingMovies(): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/movie/upcoming");
  return data?.results || MOCK_MOVIES.slice(2, 6);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];
  const data = await tmdbFetch<{ results: Movie[] }>("/search/movie", { query });
  if (data?.results) return data.results;

  // Mock search logic
  return MOCK_MOVIES.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.overview.toLowerCase().includes(query.toLowerCase())
  );
}

export async function searchTVShows(query: string): Promise<TVShow[]> {
  if (!query) return [];
  const data = await tmdbFetch<{ results: TVShow[] }>("/search/tv", { query });
  if (data?.results) return data.results;

  // Mock search logic
  return MOCK_TV_SHOWS.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.overview.toLowerCase().includes(query.toLowerCase())
  );
}

export async function getMovieDetails(id: number): Promise<Movie | null> {
  const data = await tmdbFetch<Movie>(`/movie/${id}`);
  if (data) return data;

  const localMock = MOCK_MOVIES.find(m => m.id === id);
  if (localMock) return localMock;

  // Fallback dynamic mock for any random ID
  return {
    id,
    title: `Cinema Classic (${id})`,
    original_title: `Cinema Classic (${id})`,
    overview: "This is a premium cinematic adventure movie details placeholder since no internet or TMDB key is available. It features an engaging plot, breathtaking visuals, and outstanding performances from an all-star cast.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 7.8,
    vote_count: 125,
    release_date: "2024-01-01",
    genre_ids: [28, 12, 18],
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 18, name: "Drama" },
    ],
    runtime: 132,
    budget: 85000000,
    revenue: 230000000,
    status: "Released",
    tagline: "Uncover the magic of the screen.",
  };
}

export async function getMovieCredits(id: number): Promise<CastMember[]> {
  const data = await tmdbFetch<{ cast: CastMember[] }>(`/movie/${id}/credits`);
  if (data?.cast) return data.cast.sort((a, b) => a.order - b.order);

  return MOCK_CAST[id] || generateMockCast(id);
}

export async function getMovieVideos(id: number): Promise<Video[]> {
  const data = await tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`);
  if (data?.results) {
    return data.results.filter(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
  }

  return MOCK_VIDEOS[id] || generateMockVideos(id);
}

export async function getMovieRecommendations(id: number): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>(`/movie/${id}/recommendations`);
  if (data?.results) return data.results;

  // Return all mock movies except current one
  return MOCK_MOVIES.filter(m => m.id !== id);
}

// ==================== TV SHOW INTERFACES & APIS ====================

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  seasons?: Season[];
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
  episodes?: Episode[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  vote_average: number;
  air_date: string;
}

const MOCK_TV_SHOWS: TVShow[] = [
  {
    id: 66732,
    name: "Stranger Things",
    original_name: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    poster_path: "/x2LSRK2Ls1IcZchbPc18UGi5wzu.jpg",
    backdrop_path: "/56v2KjUeFGz61wDVZ01e7u65w4v.jpg",
    vote_average: 8.6,
    vote_count: 16000,
    first_air_date: "2016-07-15",
    genre_ids: [18, 878, 9648],
    genres: [
      { id: 18, name: "Drama" },
      { id: 878, name: "Sci-Fi & Fantasy" },
      { id: 9648, name: "Mystery" },
    ],
    episode_run_time: [50],
    number_of_seasons: 4,
    number_of_episodes: 34,
    status: "Returning Series",
    tagline: "One summer can change everything.",
    seasons: [
      { id: 1, name: "Season 1", overview: "The first season of Stranger Things.", poster_path: "/x2LSRK2Ls1IcZchbPc18UGi5wzu.jpg", season_number: 1, episode_count: 8, air_date: "2016-07-15" },
      { id: 2, name: "Season 2", overview: "The second season of Stranger Things.", poster_path: "/x2LSRK2Ls1IcZchbPc18UGi5wzu.jpg", season_number: 2, episode_count: 9, air_date: "2017-10-27" },
      { id: 3, name: "Season 3", overview: "The third season of Stranger Things.", poster_path: "/x2LSRK2Ls1IcZchbPc18UGi5wzu.jpg", season_number: 3, episode_count: 8, air_date: "2019-07-04" },
      { id: 4, name: "Season 4", overview: "The fourth season of Stranger Things.", poster_path: "/x2LSRK2Ls1IcZchbPc18UGi5wzu.jpg", season_number: 4, episode_count: 9, air_date: "2022-05-27" },
    ]
  },
  {
    id: 1396,
    name: "Breaking Bad",
    original_name: "Breaking Bad",
    overview: "Walter White, a New Mexico chemistry teacher, diagnosed with Stage III cancer, turns to a life of crime, producing and selling methamphetamine with Jesse Pinkman.",
    poster_path: "/ztkUQIL6m1rtm6afEH41ZJj5Rwt.jpg",
    backdrop_path: "/tsRy63MuTJClv36CYrP1jL5LI8z.jpg",
    vote_average: 8.9,
    vote_count: 14000,
    first_air_date: "2008-01-20",
    genre_ids: [18, 80],
    genres: [
      { id: 18, name: "Drama" },
      { id: 80, name: "Crime" },
    ],
    episode_run_time: [49],
    number_of_seasons: 5,
    number_of_episodes: 62,
    status: "Ended",
    tagline: "Remember my name.",
    seasons: [
      { id: 10, name: "Season 1", overview: "The first season of Breaking Bad.", poster_path: "/ztkUQIL6m1rtm6afEH41ZJj5Rwt.jpg", season_number: 1, episode_count: 7, air_date: "2008-01-20" },
      { id: 11, name: "Season 2", overview: "The second season of Breaking Bad.", poster_path: "/ztkUQIL6m1rtm6afEH41ZJj5Rwt.jpg", season_number: 2, episode_count: 13, air_date: "2009-03-08" },
    ]
  }
];

const MOCK_TV_CAST: Record<number, CastMember[]> = {
  66732: [
    { id: 101, name: "Millie Bobby Brown", character: "Eleven", profile_path: null, order: 0 },
    { id: 102, name: "Finn Wolfhard", character: "Mike Wheeler", profile_path: null, order: 1 },
    { id: 103, name: "Winona Ryder", character: "Joyce Byers", profile_path: null, order: 2 },
    { id: 104, name: "David Harbour", character: "Jim Hopper", profile_path: null, order: 3 },
  ]
};

function generateMockEpisodes(seasonNumber: number, episodeCount: number): Episode[] {
  const episodes: Episode[] = [];
  for (let i = 1; i <= episodeCount; i++) {
    episodes.push({
      id: seasonNumber * 1000 + i,
      name: `Episode ${i}`,
      overview: `This is a placeholder description for Episode ${i} of Season ${seasonNumber}. In this episode, the adventure unfolds with exciting plot developments.`,
      still_path: null,
      episode_number: i,
      season_number: seasonNumber,
      vote_average: 8.2,
      air_date: `2024-01-0${i}`,
    });
  }
  return episodes;
}

export async function getTVDetails(id: number): Promise<TVShow | null> {
  const data = await tmdbFetch<TVShow>(`/tv/${id}`);
  if (data) return data;

  const localMock = MOCK_TV_SHOWS.find(show => show.id === id);
  if (localMock) return localMock;

  return {
    id,
    name: `TV Show Classic (${id})`,
    original_name: `TV Show Classic (${id})`,
    overview: "An outstanding TV series details placeholder when offline or without an API key. Shows incredible depth, character development, and critically acclaimed scriptwriting.",
    poster_path: null,
    backdrop_path: null,
    vote_average: 8.1,
    vote_count: 450,
    first_air_date: "2024-01-01",
    genre_ids: [18, 9648],
    genres: [
      { id: 18, name: "Drama" },
      { id: 9648, name: "Mystery" },
    ],
    episode_run_time: [45],
    number_of_seasons: 2,
    number_of_episodes: 20,
    status: "Returning Series",
    tagline: "Every story has a beginning.",
    seasons: [
      { id: 1, name: "Season 1", overview: "The beginning of the legacy.", poster_path: null, season_number: 1, episode_count: 10, air_date: "2024-01-01" },
      { id: 2, name: "Season 2", overview: "The saga continues.", poster_path: null, season_number: 2, episode_count: 10, air_date: "2024-06-01" }
    ]
  };
}

export async function getTVCredits(id: number): Promise<CastMember[]> {
  const data = await tmdbFetch<{ cast: CastMember[] }>(`/tv/${id}/credits`);
  if (data?.cast) return data.cast.sort((a, b) => a.order - b.order);
  return MOCK_TV_CAST[id] || generateMockCast(id);
}

export async function getTVVideos(id: number): Promise<Video[]> {
  const data = await tmdbFetch<{ results: Video[] }>(`/tv/${id}/videos`);
  if (data?.results) {
    return data.results.filter(v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser"));
  }
  return generateMockVideos(id);
}

export async function getTVRecommendations(id: number): Promise<TVShow[]> {
  const data = await tmdbFetch<{ results: TVShow[] }>(`/tv/${id}/recommendations`);
  if (data?.results) return data.results;
  return MOCK_TV_SHOWS.filter(show => show.id !== id);
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<Season | null> {
  const data = await tmdbFetch<Season>(`/tv/${tvId}/season/${seasonNumber}`);
  if (data) return data;

  const show = MOCK_TV_SHOWS.find(s => s.id === tvId);
  const season = show?.seasons?.find(s => s.season_number === seasonNumber);
  
  if (season) {
    return {
      ...season,
      episodes: generateMockEpisodes(seasonNumber, season.episode_count)
    };
  }

  return {
    id: seasonNumber,
    name: `Season ${seasonNumber}`,
    overview: `Detailed episode list for Season ${seasonNumber}.`,
    poster_path: null,
    season_number: seasonNumber,
    episode_count: 10,
    air_date: "2024-01-01",
    episodes: generateMockEpisodes(seasonNumber, 10)
  };
}

// ==================== DISCOVERY APIS FOR DYNAMIC ROUTING ====================

export async function getMoviesByYear(year: string): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/discover/movie", { primary_release_year: year });
  if (data?.results) return data.results;
  return MOCK_MOVIES.filter(m => m.release_date.startsWith(year));
}

export async function getMoviesByGenre(genreId: string): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/discover/movie", { with_genres: genreId });
  if (data?.results) return data.results;
  const idNum = parseInt(genreId, 10);
  return MOCK_MOVIES.filter(m => m.genre_ids.includes(idNum));
}

export async function getMoviesByCountry(countryCode: string): Promise<Movie[]> {
  const data = await tmdbFetch<{ results: Movie[] }>("/discover/movie", { with_origin_country: countryCode });
  if (data?.results) return data.results;
  return MOCK_MOVIES;
}
