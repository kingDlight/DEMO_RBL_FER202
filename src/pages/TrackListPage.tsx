import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { usePlayer } from '../context/player';
import { getTracks } from '../services/trackService';
import type { Track } from '../components/TrackCard';
import PageTransition from '../components/PageTransition';
import { localMusicArtists, localMusicTracks } from '../data/localMusic';

type MediaItem = Track & {
  subtitle: string;
};

type Artist = {
  name: string;
  genre: string;
  image: string;
};

type BrowseCategory = {
  title: string;
  image: string;
  matchCategories: string[];
};

const filledIconStyle = { fontVariationSettings: "'FILL' 1" } as React.CSSProperties;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const categories: BrowseCategory[] = [
  {
    title: 'Pop',
    matchCategories: ['Pop'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAHvZNSJur31OjYq3wG3C6G3v4FLLwY4kJp4yTNnd4XrXRzajaAIBM70SIBv1zFbQlbHG9jZApXG4TBb4Q3F8-LiaISf9vcvd_im9CDjFMNkvTb-t3XEBojj0EFGnhGHCJaFKE1Bn_I8neTtpJjeSBvRjqoJZUBYQw-OD5wUaepSTKT281NPEKtXWMEq6yVg3lihMD9xCMyztPCiziK_bk9lS1Gu-R2C2rMB2KGc49U0CSEccT5kdAwi2XVGFWftXLgBjaV1M78PmoM',
  },
  {
    title: 'Rock',
    matchCategories: ['Rock'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFyXOzMwmdD7u7_NOLrzX4kBq5rOtyhTz0zHcNd6t8cAR9l76wPgJA3HTM6L2qzgnweVz2qzsO_LI5FJ5y3qnyGMkZ7jTD3G2xJKCIm9aat4tx5VaeANZ81V3rpc0NFNNwQmqAzV2jpI5gSmhO5gPNNaIxV7c5UDFXZ9bpkIDaFkQ0wT134hPMOgP0JEVfYzI51AxsRONlffK6syG98XPZ-fC_BGKOlD7XH2TpSkZavK9gRD_N6qipaCbd6ir5Air3oY_qLYC1CrPk',
  },
  {
    title: 'Hip-Hop',
    matchCategories: ['Hip-Hop'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGXZsnBzxFH3zt5QWewwNqUsy-kV3Vu4blahbTpUjXgJKxeL2dFcaXuEW2Iy23dQJtcC1npwExCnj1a8CKqKq6BZqsdPNR7C9zci60BXAyqybNOExmGD1yAMk3ou55uE-l52GaN50oSVwbFMslwyzem7_TTcjkA5fM_njmkv7eoxN14hkvhbn4s4yNeBy9S8YNJ8mUGooSU69K3jXnIGwjx6lM2aXkgmY33t50LVSFw-mu_pIyRqlK90pIYl_psGr_A52J1iNaGT8l',
  },
  {
    title: 'EDM',
    matchCategories: ['EDM'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0u0FMMtiDboOzb-tFUv9SV8DFyTYbM3aAipnM4qe8VF9ox_E0K7wVpmY-BWNyxuKwg6_y80QWm-piIQGrUDa780s1R5nVRdljrQLBC6bsbwNBcg7pepmMQE6FWS-Q0l1m_V5IGvGxFCydI7Yv4wo3JaO0YLeJOib395weH858g7GkGzXryW_ZGl3OZfmrzYA6H4wcwhtWGxemKpXxzfKk1UVi5onAcFbQB1JFGdodoBXT_9kAVeJEd_cRm_UjJxeNeOutM4eqG6nV',
  },
  {
    title: 'Jazz',
    matchCategories: ['Jazz'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA544dNN-1_mAZR0fbIVVoPuMg8CwXcpOz4NGyPHFiQJUZSL0DRdZiMmIAFEYpZsqAzmkBovmtL_P0k4vdMTQLi2hul9BJajw4PF2UNvH18mPF1TsqjoTaUhVebamnY3-hSXVcQwQ7UqI0lUdklGSaN8FXRI7EXWjCAheYMhzvDBgKk5Jo2NbMdsXF-JwXWKK8AKDbZpnJ-yBq8in1FFpbZvzYhCY-_4SlfWlxqF3GJpQ8BZqexh2rnm2lkG9oAAnLp4BOcvHGOk66k',
  },
  {
    title: 'Classical',
    matchCategories: ['Classical'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCfNrEgZK3YQi1r2w61Wd0fdP-NNR_WIxmw3_H6oE2_2RtIc7Cn7-2HnnPsMAVT85WiXeJ5gbk00t2xCC3ICnPa2CRm0qC0rHfv-GiKNnMwTOPFcAbx_R1-IY57cYTqXhdy3ztFx1ov_UhHsU1O2drFhG2k5CQYJvy1xuy2ly-868Da29BgrkRsb7Hv1pcRoeAV8FIXY3iqcUnqb9ByjTWNbBAky03FR6PBWKt7NAdQ2xt7rEsb52iuOvcT7FzsVbpsX2ezKpO7etBr',
  },
  {
    title: 'K-Pop',
    matchCategories: ['K-Pop'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBeeefvsfzvenGcTwLPKmKUjPPt-1QS3t58xlCsS9JZH8WAghg37LUCIh5eUpJeWHIN-7vL0mPBLxVpP3PlBHApf5-Pq5kWdEcH9bmzQQzPoL1UE-3F4Tajk_ANi57vW8a41F42JOZfOEITd4YZI8MBRZANoZto9pzX3mT6c0mYLTY1emNUCsjxNl-z0CvLgkjM4SgHvK-9i-7Vxi4sof1zHGfWao0zCbiKULRNc-dq3Eptzg0z0zZ6NCbQGb-9u8kqN3JYNCOLgq6n',
  },
  {
    title: 'Country',
    matchCategories: ['Country'],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZN8lJeRcLhMW_JqofCk72lQL_Qxl42s1lEck29IuTAx9zxE9uSyLh-g9fmIFK2HeYMnm4Lg4mZ8keZgl751jDR5YNla_2Dp2Ke9NWn65sNyK1kiMsdhyPlYOz4trZnzfyqXar6fE3f_uPpIhpLQs-UpGTlBzzyWcLWu7Q45z8OJENhJiz7_N4owApUxjPLunob-_azLILl3z3vkeR_09YlwFbMIBxH7l3WyIqhuWYV9J7Noh0mvzoF0RJAIRb2tnoM22bgFIoQ6bK',
  },
];

const featuredPlaylists: MediaItem[] = localMusicTracks
  .slice(17, 21)
  .map((track) => ({ ...track, subtitle: track.artist }));

const artists: Artist[] = localMusicArtists.slice(0, 8).map((artist) => ({
  name: artist.name,
  genre: artist.genre,
  image: artist.image,
}));

const newReleases: MediaItem[] = localMusicTracks
  .slice(21, 26)
  .map((track) => ({ ...track, subtitle: track.artist }));

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-lg font-headline-md text-headline-md text-on-surface">
    {children}
  </h2>
);

const PlayButton = ({ label }: { label: string }) => (
  <button
    className="absolute bottom-sm right-sm flex h-[48px] w-[48px] translate-y-2 items-center justify-center rounded-full bg-primary text-on-primary opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
    type="button"
    aria-label={label}
  >
    <span className="material-symbols-outlined" style={filledIconStyle}>
      play_arrow
    </span>
  </button>
);

const toPlayerTrack = (track: Track) => ({
  id: track.id,
  title: track.title,
  artist: track.artist,
  duration: track.duration || '3:00',
  image: track.image,
  audioUrl: track.audioUrl,
  lyrics: track.lyrics,
});

const DiscoverCard = ({
  item,
  onSelect,
  className = '',
}: {
  item: MediaItem;
  onSelect?: () => void;
  className?: string;
}) => (
  <article
    className={`group cursor-pointer rounded-xl bg-surface-container-low p-md text-left transition-colors hover:bg-surface-container ${className}`}
    onClick={onSelect}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect?.();
      }
    }}
    role={onSelect ? 'button' : undefined}
    tabIndex={onSelect ? 0 : undefined}
  >
    <div className="relative mb-md aspect-square overflow-hidden rounded-lg">
      <img
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        src={item.image}
        alt={item.title}
      />
      <PlayButton label={`Play ${item.title}`} />
    </div>
    <div className="mb-xs truncate font-label-md text-label-md text-on-surface">
      {item.title}
    </div>
    <div className="truncate font-label-sm text-label-sm text-on-surface-variant">
      {item.subtitle}
    </div>
  </article>
);

const TrackListPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(searchQ);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { playTrack, playQueue } = usePlayer();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoryResultsRef = useRef<HTMLElement>(null);
  
  const [fetchedTracks, setFetchedTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Auralis - Discover';
    if (!searchQ) searchInputRef.current?.focus();

    getTracks()
      .then((data) => setFetchedTracks(data))
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => {
      document.title = 'Auralis Music';
    };
  }, [searchQ]);

  const selectedCategory = categories.find((category) => category.title === activeCategory);

  const tracksForDisplay = fetchedTracks.length > 0 ? fetchedTracks : localMusicTracks;

  const categoryTracks = useMemo(() => {
    if (!selectedCategory) return [];

    return tracksForDisplay.filter((track) =>
      selectedCategory.matchCategories.includes(track.category || ''),
    );
  }, [selectedCategory, tracksForDisplay]);

  const filteredSongs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const categoryMatchedIds = new Set(categoryTracks.map((track) => track.id));

    return tracksForDisplay.filter((track) => {
      const matchesSearch =
        !normalizedQuery ||
        track.title.toLowerCase().includes(normalizedQuery) ||
        track.artist.toLowerCase().includes(normalizedQuery) ||
        (track.category || '').toLowerCase().includes(normalizedQuery);

      const matchesCategory = !selectedCategory || categoryMatchedIds.has(track.id);

      return matchesSearch && matchesCategory;
    });
  }, [categoryTracks, query, selectedCategory, tracksForDisplay]);

  const handleCategorySelect = (categoryTitle: string) => {
    const nextCategory = activeCategory === categoryTitle ? null : categoryTitle;

    setActiveCategory(nextCategory);
    setQuery('');

    if (nextCategory) {
      window.setTimeout(() => {
        categoryResultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 80);
    }
  };

  return (
    <PageTransition className="w-full h-full">
    <div className="min-h-screen bg-background pb-32 text-on-surface">
      <main className="mx-auto w-full max-w-[1440px] px-container-margin-mobile pt-[100px] md:px-container-margin-desktop">
        <section className="flex flex-col items-center py-2xl text-center">
          <h1 className="mb-lg font-headline-lg text-headline-lg text-on-surface">
            What do you want to listen to?
          </h1>

          <div className="relative mb-lg w-full max-w-[672px]">
            <span className="material-symbols-outlined absolute left-[24px] top-1/2 -translate-y-1/2 text-3xl text-on-surface-variant">
              search
            </span>
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-full border border-outline-variant bg-surface-container-high py-md pl-[64px] pr-[24px] font-body-lg text-body-lg text-on-surface shadow-xl transition-all placeholder:text-on-surface-variant focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
              placeholder="Search songs, artists, albums..."
              type="text"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-sm">
            <span className="mr-sm self-center font-label-md text-label-md text-on-surface-variant">
              Trending Searches:
            </span>
            {['EDM', 'Hip-Hop', 'K-Pop'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="rounded-full bg-surface-container-highest px-md py-sm font-label-sm text-label-sm text-on-surface transition-colors hover:bg-on-surface/10"
              >
                {term}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-3xl">
          <SectionTitle>Browse Categories</SectionTitle>
          <div className="grid grid-cols-2 gap-md md:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.title}
                type="button"
                onClick={() => handleCategorySelect(category.title)}
                aria-pressed={activeCategory === category.title}
                className={`group relative aspect-video cursor-pointer overflow-hidden rounded-xl text-left transition-all ${
                  activeCategory === category.title
                    ? 'ring-2 ring-primary-container'
                    : 'ring-0'
                }`}
              >
                <div
                  className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-md left-md font-headline-md text-headline-md font-bold text-white">
                  {category.title}
                </span>
              </button>
            ))}
          </div>
        </section>

        {selectedCategory && (
          <motion.section
            ref={categoryResultsRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3xl rounded-2xl border border-primary-container/30 bg-surface-container-low p-md md:p-lg"
          >
            <div className="mb-lg flex flex-col justify-between gap-md md:flex-row md:items-end">
              <div>
                <p className="mb-xs font-label-sm text-label-sm uppercase tracking-[0.16em] text-primary">
                  Featured Category
                </p>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  {selectedCategory.title} Picks
                </h2>
                <p className="mt-xs text-sm text-on-surface-variant">
                  Showing {categoryTracks.length} local tracks in {selectedCategory.title}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCategory(null)}
                className="self-start rounded-full border border-outline-variant px-md py-sm font-label-sm text-label-sm text-on-surface-variant transition-colors hover:border-primary hover:text-primary md:self-auto"
              >
                Clear category
              </button>
            </div>

            <div className="grid grid-cols-2 gap-md md:grid-cols-4">
              {categoryTracks.slice(0, 8).map((item) => (
                <DiscoverCard
                  key={`${selectedCategory.title}-${item.id}`}
                  item={{ ...item, subtitle: item.artist }}
                  onSelect={() =>
                    playTrack(toPlayerTrack(item), { elapsed: '0:00', progress: 0 })
                  }
                />
              ))}
            </div>
          </motion.section>
        )}

        <section className="mb-3xl">
          <SectionTitle>Featured Playlists</SectionTitle>
          <div className="grid grid-cols-2 gap-md md:grid-cols-4">
            {featuredPlaylists.map((item) => (
              <DiscoverCard
                key={item.title}
                item={item}
                onSelect={() =>
                  playTrack(toPlayerTrack(item), { elapsed: '1:23', progress: 33 })
                }
              />
            ))}
          </div>
        </section>

        <section className="mb-3xl">
          <SectionTitle>Popular Artists</SectionTitle>
          <div className="grid grid-cols-2 gap-md sm:grid-cols-4 lg:grid-cols-8">
            {artists.map((artist) => (
              <article
                key={artist.name}
                className="group flex cursor-pointer flex-col items-center rounded-xl bg-surface-container-low p-md transition-colors hover:bg-surface-container"
              >
                <img
                  alt={artist.name}
                  className="mb-sm h-[96px] w-[96px] rounded-full object-cover transition-transform group-hover:scale-105"
                  src={artist.image}
                />
                <span className="line-clamp-1 text-center font-label-md text-label-md text-on-surface">
                  {artist.name}
                </span>
                <span className="mb-sm text-center font-label-sm text-label-sm text-on-surface-variant">
                  {artist.genre}
                </span>
                <button
                  type="button"
                  className="w-full rounded-full border border-outline-variant px-md py-xs font-label-sm text-label-sm text-on-surface transition-colors hover:bg-on-surface/10"
                >
                  Follow
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-3xl">
          <SectionTitle>New Releases</SectionTitle>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-md overflow-x-auto pb-md">
            {newReleases.map((item) => (
              <DiscoverCard
                key={item.title}
                item={item}
                className="w-[192px] flex-none snap-start"
                onSelect={() =>
                  playTrack(toPlayerTrack(item), { elapsed: '1:23', progress: 33 })
                }
              />
            ))}
          </div>
        </section>

        <section className="mb-3xl">
          <SectionTitle>
            {query
              ? 'Search Results'
              : selectedCategory
                ? `${selectedCategory.title} Tracks`
                : 'All Tracks'}
          </SectionTitle>
          <div className="flex min-h-[400px] flex-col gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-low p-md md:p-lg">
            {loading ? (
              <p className="text-on-surface-variant">Loading tracks...</p>
            ) : filteredSongs.length === 0 ? (
              <p className="text-on-surface-variant">No tracks found for "{query}".</p>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-1">
                {filteredSongs.map((song, index) => (
                  <motion.button
                    key={song.id}
                    variants={itemVariants}
                    type="button"
                    onClick={() => {
                      const queueTracks = filteredSongs.map(toPlayerTrack);
                      playQueue(queueTracks, index);
                    }}
                    className="group flex cursor-pointer items-center gap-md rounded-lg p-sm text-left transition-colors hover:bg-surface-container-low"
                  >
                    <span className="w-[24px] text-center font-label-md text-label-md text-on-surface-variant">
                      {index + 1}
                    </span>
                    <img
                      alt={`${song.title} cover`}
                      className="h-[48px] w-[48px] rounded object-cover"
                      src={song.image}
                    />
                    <span className="flex min-w-0 flex-grow flex-col gap-xs md:flex-row md:items-center md:gap-md">
                      <span className="w-full min-w-0 md:w-1/3">
                        <span className="block truncate font-label-md text-label-md text-on-surface">
                          {song.title}
                        </span>
                        <span className="block truncate font-label-sm text-label-sm text-on-surface-variant md:hidden">
                          {song.artist}
                        </span>
                      </span>
                      <span className="hidden w-1/4 truncate font-label-sm text-label-sm text-on-surface-variant md:block">
                        {song.artist}
                      </span>
                      <span className="hidden w-1/4 truncate font-label-sm text-label-sm text-on-surface-variant md:block">
                        {song.category || 'Single'}
                      </span>
                    </span>
                    <span className="ml-auto flex items-center gap-md">
                      <span className="material-symbols-outlined text-xl text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100">
                        favorite
                      </span>
                      <span className="w-[40px] text-right font-label-sm text-label-sm text-on-surface-variant">
                        {song.duration || '3:00'}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>



    </div>
    </PageTransition>
  );
};

export default TrackListPage;
