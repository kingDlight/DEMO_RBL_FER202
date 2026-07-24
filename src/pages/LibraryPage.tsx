import React, { useEffect, useMemo, useState } from 'react';
import { usePlayer } from '../context/player';
import { useUser } from '../context/UserContext';
import { localMusicArtists, localMusicTracks, toPlayerTrack } from '../data/localMusic';
import type { Track } from '../components/TrackCard';
import { CreatePlaylistModal } from '../components/CreatePlaylistModal';

type LibraryCategory = 'Playlists' | 'Artists' | 'Albums' | 'Podcasts';

type LibraryItem = {
  title: string;
  type: LibraryCategory;
  image: string;
  round?: boolean;
  tracks: Track[];
};



const libraryTabs = ['All', 'Playlists', 'Artists', 'Albums', 'Podcasts'] as const;

// Dynamically generate default library items based on actual tracks
const generateDefaultLibraryItems = (): LibraryItem[] => {
  if (!localMusicTracks || localMusicTracks.length === 0) return [];

  const artistCounts = localMusicTracks.reduce((acc, track) => {
    acc[track.artist] = (acc[track.artist] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedArtists = Object.keys(artistCounts).sort((a, b) => artistCounts[b] - artistCounts[a]);
  const topArtist1 = sortedArtists[0] || 'Unknown Artist';
  const topArtist2 = sortedArtists[1] || topArtist1;
  const topArtist3 = sortedArtists[2] || topArtist1;
  const topArtist4 = sortedArtists[3] || topArtist1;

  const items: LibraryItem[] = [];

  if (topArtist1) {
    items.push({
      title: `${topArtist1} Collection`,
      type: 'Playlists',
      image: localMusicTracks.find((t) => t.artist === topArtist1)?.image || '',
      tracks: localMusicTracks.filter((t) => t.artist === topArtist1),
    });
  }
  
  if (topArtist2 && topArtist2 !== topArtist1) {
    items.push({
      title: 'Chill Focus',
      type: 'Playlists',
      image: localMusicTracks.find((t) => t.artist === topArtist2)?.image || '',
      tracks: localMusicTracks.filter((t) => t.artist === topArtist2 || ['Jazz', 'Classical', 'Country'].includes(t.category || '')),
    });
  }

  if (topArtist3 && topArtist3 !== topArtist1) {
    items.push({
      title: `${topArtist3} Sessions`,
      type: 'Albums',
      image: localMusicTracks.find((t) => t.artist === topArtist3)?.image || '',
      tracks: localMusicTracks.filter((t) => t.artist === topArtist3),
    });
  }

  if (localMusicArtists.length > 0) {
    items.push({
      title: localMusicArtists[0].name,
      type: 'Artists',
      round: true,
      image: localMusicArtists[0].image,
      tracks: localMusicTracks.filter((t) => t.artist === localMusicArtists[0].name),
    });
  }

  return items;
};

const defaultLibraryItems: LibraryItem[] = generateDefaultLibraryItems();


const filledIconStyle = { fontVariationSettings: "'FILL' 1" } as React.CSSProperties;

const LibraryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<(typeof libraryTabs)[number]>('All');
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortByRecent, setSortByRecent] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { playTrack, playQueue } = usePlayer();
  const { favorites, recentlyPlayed, playlists, createPlaylist } = useUser();

  const allLibraryItems = useMemo(() => {
    const userPlaylists: LibraryItem[] = playlists.map(p => ({
      title: p.title,
      type: 'Playlists',
      image: p.cover,
      tracks: [] // Placeholder until we add track-to-playlist logic
    }));
    return [...userPlaylists, ...defaultLibraryItems];
  }, [playlists]);

  // Use real metadata for "album" and add "added" date for UI consistency
  const savedSongs = useMemo(() => favorites.map(track => ({
    ...track,
    album: track.album || track.category || 'Single',
    added: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  })), [favorites]);

  useEffect(() => {
    document.title = 'Auralis - Library';
    return () => {
      document.title = 'Auralis Music';
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const visibleItems = useMemo(
    () =>
      allLibraryItems.filter((item) => {
        const matchesTab = activeTab === 'All' || item.type === activeTab;
        const matchesQuery =
          !normalizedQuery ||
          item.title.toLowerCase().includes(normalizedQuery) ||
          item.type.toLowerCase().includes(normalizedQuery);

        return matchesTab && matchesQuery;
      }),
    [activeTab, normalizedQuery],
  );

  const visibleSongs = useMemo(() => {
    const filtered = savedSongs.filter((song) => {
      if (!normalizedQuery) return true;

      return [song.title, song.artist, song.category || ''].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      );
    });

    return sortByRecent
      ? filtered
      : [...filtered].sort((first, second) => first.title.localeCompare(second.title));
  }, [normalizedQuery, sortByRecent, savedSongs]);

  return (
    <div className="min-h-screen bg-background pb-32 pt-20 text-on-surface">
      <CreatePlaylistModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={(title, description, cover) => createPlaylist(title, description, cover)} 
      />
      <main className="mx-auto w-full max-w-screen-2xl">
        <header className="relative overflow-hidden px-container-margin-mobile py-xl md:px-container-margin-desktop md:py-3xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-container/20 to-transparent" />
          <div className="relative z-10 flex flex-col gap-lg md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-[44px] font-black leading-[1.05] text-on-surface md:text-[64px]">
                Your Library
              </h1>
              <p className="mt-sm font-body-lg text-body-lg text-on-surface-variant">
                Playlists, artists, and albums you follow.
              </p>
            </div>

            <div className="hidden items-center gap-md md:flex">
              <button
                type="button"
                onClick={() => setIsSearchOpen((current) => !current)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-variant text-on-surface transition-colors hover:bg-surface-bright"
                aria-label="Search library"
              >
                <span className="material-symbols-outlined text-[30px]">search</span>
              </button>
              <button
                type="button"
                onClick={() => setSortByRecent((current) => !current)}
                className="flex h-14 items-center gap-sm rounded-full bg-surface-variant px-lg font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-bright"
              >
                <span className="material-symbols-outlined">filter_list</span>
                Filters
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-lg flex gap-md overflow-x-auto pb-sm no-scrollbar">
            {libraryTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-full px-md py-sm font-label-md text-label-md transition-all ${
                  activeTab === tab
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-variant/50 text-on-surface hover:bg-surface-variant'
                }`}
              >
                {tab}
              </button>
            ))}
            
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-xs rounded-full border border-primary/50 bg-primary/10 px-md py-sm font-label-md text-label-md text-primary transition-colors hover:bg-primary/20 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Playlist
            </button>
          </div>

          {isSearchOpen && (
            <label className="relative z-10 mt-md block max-w-[480px]">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-full border border-outline-variant/30 bg-surface-variant/60 py-3 pl-12 pr-4 font-body-md text-body-md text-on-surface transition-all placeholder:text-on-surface-variant focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
                placeholder="Search your library..."
                type="search"
              />
            </label>
          )}
        </header>

        <div className="flex flex-col gap-3xl px-container-margin-mobile pb-3xl md:px-container-margin-desktop">
          <section>
            <div className="grid grid-cols-1 gap-md lg:grid-cols-4">
              <button
                type="button"
                onClick={() => playQueue(localMusicTracks.slice(0, 12).map(toPlayerTrack), 0)}
                className="group relative flex h-56 cursor-pointer flex-col justify-end overflow-hidden rounded-xl border border-on-surface/10 bg-surface-container-low p-md text-left transition-colors md:h-64 lg:col-span-2 lg:row-span-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-surface-container-low opacity-60 transition-opacity group-hover:opacity-80" />
                <div className="absolute bottom-md right-md z-20 flex h-12 w-12 translate-y-4 items-center justify-center rounded-full bg-secondary text-on-secondary opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <span
                    className="material-symbols-outlined"
                    style={filledIconStyle}
                  >
                    play_arrow
                  </span>
                </div>
                <div className="relative z-10">
                  <span
                    className="material-symbols-outlined mb-sm text-5xl text-white"
                    style={filledIconStyle}
                  >
                    favorite
                  </span>
                  <h2 className="font-headline-md text-headline-md font-bold text-white">
                    Liked Songs
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface/80">{favorites.length} tracks</p>
                </div>
              </button>

              {visibleItems.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() =>
                    playQueue(item.tracks.length > 0 ? item.tracks.map(toPlayerTrack) : [toPlayerTrack(localMusicTracks[0])], 0)
                  }
                  className="group flex h-[120px] cursor-pointer items-center gap-md rounded-xl border border-on-surface/10 bg-surface-container-low p-sm text-left transition-colors hover:bg-on-surface/5"
                >
                  <img
                    className={`h-16 w-16 object-cover shadow-md ${
                      item.round ? 'rounded-full' : 'rounded-md'
                    }`}
                    src={item.image}
                    alt={`${item.title} ${item.type.toLowerCase()} cover`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-label-md text-label-md text-on-surface transition-colors group-hover:text-primary">
                      {item.title}
                    </span>
                    <span className="block font-label-sm text-label-sm text-on-surface-variant">
                      {item.type.slice(0, -1) || item.type}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {recentlyPlayed.length > 0 && (
            <section>
              <h2 className="mb-lg font-headline-lg text-headline-lg text-on-surface">
                Recently Played
              </h2>
              <div className="flex gap-md overflow-x-auto pb-md no-scrollbar">
                {recentlyPlayed.map((song) => (
                  <button
                    key={song.id + '-' + Math.random()}
                    type="button"
                    onClick={() =>
                      playTrack({
                        title: song.title,
                        artist: song.artist,
                        duration: song.duration,
                        image: song.image,
                        audioUrl: song.audioUrl,
                        lyrics: song.lyrics,
                      } as any)
                    }
                    className="group flex min-w-[140px] max-w-[140px] flex-col gap-sm rounded-xl border border-on-surface/5 bg-surface-container-low p-sm text-left transition-colors hover:bg-on-surface/5"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={song.image}
                        alt={`${song.title} cover`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-4xl text-white" style={filledIconStyle}>
                          play_arrow
                        </span>
                      </div>
                    </div>
                    <span className="min-w-0">
                      <span className="block truncate font-label-md text-label-md text-on-surface transition-colors group-hover:text-primary">
                        {song.title}
                      </span>
                      <span className="block truncate font-label-sm text-label-sm text-on-surface-variant">
                        {song.artist}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="mb-lg flex items-end justify-between gap-md">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Saved Songs
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('All')}
                className="font-label-md text-label-md text-primary transition-colors hover:text-primary-fixed"
              >
                View All
              </button>
            </div>

            <div className="flex flex-col gap-xs">
              <div className="hidden grid-cols-[auto_1fr_1fr_auto] gap-md border-b border-surface-variant px-md py-sm text-label-sm text-on-surface-variant md:grid">
                <div className="w-8 text-center">#</div>
                <div>Title</div>
                <div>Album</div>
                <div className="flex items-center gap-md">
                  <span>Date Added</span>
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                </div>
              </div>

              {visibleSongs.map((song, index) => (
                <button
                  key={song.title}
                  type="button"
                  onClick={() =>
                    playTrack(
                      {
                        title: song.title,
                        artist: song.artist,
                        duration: song.duration,
                        image: song.image,
                        audioUrl: song.audioUrl,
                        lyrics: song.lyrics,
                      },
                      { elapsed: '1:24', progress: 33 },
                    )
                  }
                  className="group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-md rounded-lg px-md py-sm text-left transition-colors hover:bg-on-surface/5 md:grid-cols-[auto_1fr_1fr_auto]"
                >
                  <span className="w-8 text-center font-label-md text-on-surface-variant group-hover:hidden">
                    {index + 1}
                  </span>
                  <span className="hidden w-8 items-center justify-center text-on-surface group-hover:flex">
                    <span
                      className="material-symbols-outlined"
                      style={filledIconStyle}
                    >
                      play_arrow
                    </span>
                  </span>

                  <span className="flex min-w-0 items-center gap-md">
                    <img
                      className="h-10 w-10 rounded object-cover shadow-sm"
                      src={song.image}
                      alt={`${song.title} cover`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate font-body-md text-body-md font-medium text-on-surface transition-colors group-hover:text-primary">
                        {song.title}
                      </span>
                      <span className="block truncate font-label-sm text-label-sm text-on-surface-variant">
                        {song.artist}
                      </span>
                    </span>
                  </span>

                  <span className="hidden truncate text-body-md text-on-surface-variant md:block">
                    {song.album}
                  </span>
                  <span className="flex items-center gap-xl text-body-md text-on-surface-variant">
                    <span className="hidden md:block">{song.added}</span>
                    <span
                      className="material-symbols-outlined hidden text-secondary md:block"
                      style={filledIconStyle}
                    >
                      favorite
                    </span>
                    <span className="material-symbols-outlined opacity-0 transition-opacity hover:text-on-surface group-hover:opacity-100">
                      more_horiz
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
