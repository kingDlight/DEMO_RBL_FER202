import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../context/player';
import { useUser } from '../context/UserContext';
import PageTransition from '../components/PageTransition';
import { useToast } from '../context/ToastContext';
import { localMusicTracks, toPlayerTrack } from '../data/localMusic';
import { CreatePlaylistModal } from '../components/CreatePlaylistModal';

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

const filledIconStyle = { fontVariationSettings: "'FILL' 1" };

const defaultCover = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEhuFvhYlynrgzClgkHIftyfCbyG6Z7IMk7d0iI9nBUO1Ix18PTl5mUAtpLX60wkbUGAwd0htTfsfh0aSmGhHGqrBeFrkkGEkK10dJb9h8i8XwMMT7XlbDcuf2Uj79CfTSpH-YWooLcifDInw7OsKfxs8ZWeFSc32cWsu7u8pGqHYfuqU3z6MbiLYjeZPsotwhrp5Xu3Vf5bideZWUPrfZIy8PZW89mwKZ6QwUD5xkZn2f4hI5hpBm3b0DtPVAZ4bOgJa5N5auXjLP';
const curatorAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8Z58dJL_eD4t8H61hOPBHQmMHqEXfokFQf13qECxvRgX_stSXqOgvLGR7I4XBRyVpJcAysCLUIRWfn9HIAE7EphHoWrCTsnzQx16_WPqU7pY2Q_RRq-KBdFJzJph_RNU0MG2H7o_gfMvsn1y62oRwlW7u0kh7HnlFu2fJHnVAm3u9PvC8JIRhBoOb-F32DdFuRjC-7xY8K7mhKKoYXn-9kDCeM-CKOvyEVvygoLKnHeYOX17W3smXZ97RefKdUZ-hz2dObUPq2__v';

const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { playQueue } = usePlayer();
  const { addToast } = useToast();
  const { playlists, createPlaylist, deletePlaylist } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Determine which playlist to show
  const customPlaylist = playlists.find(p => p.id === id);

  const displayPlaylist = useMemo(() => {
    if (customPlaylist) {
      return {
        title: customPlaylist.title,
        description: customPlaylist.description || 'Custom User Playlist',
        cover: customPlaylist.cover,
        tracks: customPlaylist.tracks || [],
        isCustom: true
      };
    }

    // Fallback to local mix
    const defaultTracks = localMusicTracks.slice(0, 4).map((track, index) => ({
      ...track,
      album: `${track.artist} Selection`,
      added: index < 2 ? '2 days ago' : index < 5 ? '1 week ago' : 'Recently',
      active: index === 0,
      cover: track.image,
    }));

    return {
      title: 'Music Mix',
      description: 'Hot tracks curated for you',
      cover: defaultCover,
      tracks: defaultTracks,
      isCustom: false
    };
  }, [customPlaylist]);

  const handlePlayPlaylist = (startIndex = 0) => {
    if (displayPlaylist.tracks.length === 0) {
      addToast('This playlist is empty!', 'error');
      return;
    }
    playQueue(
      displayPlaylist.tracks.map(toPlayerTrack),
      startIndex
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Playlist link copied to clipboard!', 'success');
  };

  if (!id) {
    return (
      <PageTransition className="w-full h-full">
        <div className="flex min-h-screen flex-col bg-background pb-32 pt-20 text-on-background">
          <CreatePlaylistModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreate={async (title, desc, cover) => {
              await createPlaylist(title, desc, cover);
              setIsModalOpen(false);
            }}
          />
          <main className="mx-auto flex w-full max-w-[1280px] flex-grow flex-col gap-xl px-container-margin-mobile py-xl md:px-container-margin-desktop">
            <div className="flex items-center justify-between mb-lg">
              <h1 className="font-display text-[44px] font-black leading-[1.05] text-on-surface md:text-[64px]">
                Your Playlists
              </h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-xs rounded-full bg-primary px-md py-sm font-label-md text-label-md text-on-primary transition-colors hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Create Playlist
              </button>
            </div>

            {playlists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-3xl text-on-surface-variant">
                <span className="material-symbols-outlined text-[64px] mb-md opacity-50">queue_music</span>
                <p className="font-body-lg text-body-lg">You don't have any playlists yet.</p>
                <p className="font-body-md text-body-md opacity-80 mt-xs">Create one to start saving your favorite tracks!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                    className="group relative flex cursor-pointer flex-col gap-sm rounded-xl border border-on-surface/5 bg-surface-container-low p-sm text-left transition-colors hover:bg-on-surface/10"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-md">
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={playlist.cover}
                        alt={`${playlist.title} cover`}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlaylistToDelete(playlist.id);
                        }}
                        className="absolute right-sm top-sm flex h-8 w-8 items-center justify-center rounded-full bg-error/90 text-on-error opacity-0 shadow-lg transition-all hover:scale-110 group-hover:opacity-100"
                        title="Delete Playlist"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-label-lg text-label-lg text-on-surface group-hover:text-primary">
                        {playlist.title}
                      </h3>
                      <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                        {playlist.tracks?.length || 0} tracks
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        <AnimatePresence>
          {playlistToDelete && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPlaylistToDelete(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-surface shadow-2xl"
              >
                <div className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                    <span className="material-symbols-outlined text-[24px]">delete</span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-on-surface">Delete Playlist?</h3>
                  <p className="text-on-surface-variant">
                    Are you sure you want to delete this playlist? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end gap-3 bg-surface-variant/30 p-4">
                  <button
                    onClick={() => setPlaylistToDelete(null)}
                    className="rounded-full px-6 py-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deletePlaylist(playlistToDelete);
                      setPlaylistToDelete(null);
                    }}
                    className="rounded-full bg-error px-6 py-2 text-sm font-medium text-on-error shadow-sm transition-all hover:bg-error/90 hover:shadow-md active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="w-full h-full">
      <div className="flex min-h-screen flex-col bg-background pb-32 pt-20 text-on-background">
        <CreatePlaylistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (title, desc, cover) => {
            await createPlaylist(title, desc, cover);
            setIsModalOpen(false);
          }}
        />

        <main className="mx-auto flex w-full max-w-[1280px] flex-grow flex-col gap-3xl px-container-margin-mobile py-xl md:px-container-margin-desktop">
          <section className="relative flex flex-col items-end gap-xl md:flex-row">
            <div className="group relative h-auto aspect-square w-full shrink-0 overflow-hidden rounded-xl shadow-[0px_20px_40px_rgba(0,0,0,0.4)] md:h-[256px] md:w-[256px]">
              <img
                className="h-full w-full object-cover"
                src={displayPlaylist.cover}
                alt={`${displayPlaylist.title} cover`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent" />
            </div>

            <div className="z-10 flex flex-grow flex-col gap-base">
              <span className="font-label-md text-label-md uppercase text-on-surface-variant">
                {displayPlaylist.isCustom ? 'Custom Playlist' : 'Public Playlist'}
              </span>
              <h1 className="max-w-[720px] font-display text-[48px] font-black leading-[1.1] text-on-surface">
                {displayPlaylist.title}
              </h1>
              <p className="mt-sm max-w-[672px] font-body-lg text-body-lg text-on-surface-variant">
                {displayPlaylist.description}
              </p>

              <div className="mt-md flex flex-wrap items-center gap-md font-label-md text-label-md text-on-surface-variant">
                <div className="flex items-center gap-sm">
                  <img
                    className="h-[24px] w-[24px] rounded-full"
                    src={curatorAvatar}
                    alt="Auralis Curated avatar"
                  />
                  <span className="font-bold text-on-surface">{displayPlaylist.isCustom ? 'You' : 'Auralis Curated'}</span>
                </div>
              </div>

              <div className="mt-sm flex flex-wrap items-center gap-md font-label-sm text-label-sm text-on-surface-variant/80">
                <span>{displayPlaylist.tracks.length} Songs</span>
                <span>&bull;</span>
                <span>Updated recently</span>
              </div>

              <div className="mt-xl flex items-center gap-lg">
                <button
                  className={`flex h-[56px] w-[56px] items-center justify-center rounded-full bg-secondary text-on-secondary shadow-[0px_10px_20px_rgba(34,197,94,0.3)] transition-transform hover:scale-105 ${displayPlaylist.tracks.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  type="button"
                  onClick={() => handlePlayPlaylist(0)}
                  aria-label="Play playlist"
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={filledIconStyle}
                  >
                    play_arrow
                  </span>
                </button>
                <button
                  onClick={handleShare}
                  className="text-on-surface-variant transition-colors hover:text-on-surface"
                  type="button"
                  aria-label="Share playlist"
                >
                  <span className="material-symbols-outlined text-3xl">share</span>
                </button>
                <button
                  className="ml-auto text-on-surface-variant transition-colors hover:text-on-surface md:ml-0"
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  title="Create New Playlist"
                >
                  <span className="material-symbols-outlined text-3xl">add_circle</span>
                </button>
              </div>
            </div>

            <div className="pointer-events-none absolute left-[-64px] top-[-64px] -z-10 h-full max-h-[800px] w-full max-w-[800px] rounded-full bg-primary/10 blur-[120px]" />
          </section>

          <section className="w-full">
            <div className="grid grid-cols-[auto_1fr_auto] gap-md border-b border-outline-variant/20 px-md py-sm font-label-sm text-label-sm text-on-surface-variant md:grid-cols-[auto_1fr_1fr_auto_auto]">
              <span className="w-[32px] text-center">#</span>
              <span>Title</span>
              <span className="hidden md:block">Artist</span>
              <span className="hidden text-right sm:block">Date Added</span>
              <span className="material-symbols-outlined w-[48px] text-right">schedule</span>
            </div>

            {displayPlaylist.tracks.length === 0 ? (
              <div className="py-xl text-center text-on-surface-variant">
                This playlist is empty. Add tracks from the Home page!
              </div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-1">
                {displayPlaylist.tracks.map((track, index) => (
                  <motion.button
                    key={`${track.id}-${index}`}
                    variants={itemVariants}
                    type="button"
                    onClick={() => handlePlayPlaylist(index)}
                    className="group grid cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-md rounded-lg px-md py-sm text-left transition-colors hover:bg-on-surface/5 md:grid-cols-[auto_1fr_1fr_auto_auto]"
                  >
                    <span className="flex w-[32px] justify-center font-label-md text-on-surface-variant">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <span className="material-symbols-outlined hidden text-secondary group-hover:block">
                        play_arrow
                      </span>
                    </span>

                    <span className="flex min-w-0 items-center gap-md">
                      <img
                        className="h-[40px] w-[40px] rounded object-cover shadow-md"
                        src={track.image || (track as any).cover}
                        alt={`${track.title} cover`}
                      />
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate font-label-md text-label-md text-on-surface">
                          {track.title}
                        </span>
                        <span className="truncate font-label-sm text-label-sm text-on-surface-variant">
                          {track.artist}
                        </span>
                      </span>
                    </span>

                    <span className="hidden truncate font-body-md text-body-md text-on-surface-variant md:block">
                      {track.artist}
                    </span>
                    <span className="hidden pr-lg text-right font-label-sm text-label-sm text-on-surface-variant sm:block">
                      Recently
                    </span>
                    <span className="flex w-[48px] items-center justify-end gap-md">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {track.duration || '3:00'}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </section>
        </main>
      </div>
    </PageTransition>
  );
};

export default PlaylistPage;
