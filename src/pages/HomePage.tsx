import React from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../context/player';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';
import { localMusicTracks, toPlayerTrack } from '../data/localMusic';

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDNIt3qVL3M4o-GQYYdH7fMGaWob8G8jEEkpouicody2V2g8O1YRxlf-oEA0P4X1RYS1zKQexeQAUKPNSfxS7v8bFv2z_LCsRkVDJ9OAebwmeXYw6ugXmRDyJ2XyV4R6AqSWWmnBnfFf2gKdEXNBwzMXnumgDyd9fEW5eJDZpuRPHJ6REQJpLHBmBtXBXOUJzRBGDyaehjGao4P5at0juT5-d0JcLCGZItLt6U6inqc22AwIyjAEUmRZ7St4_frT0iyheXpTnRjWZep';

const aboutImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAoU3AWZ9yPEfM_28gyM20L8lX9AdyRH4zcH1QNfk5XN9yimel5zek7Y6YR0UpPzwcGdiICYgvOxHS7nzsIHw5tpJGWe6rdAv8culo6aBa9kPokvjZcMD_Bpa1o56GjkxEwgbUuaw3Qx3R_U-D99dwLxCzXCZwCJE8rASgeZ5X4QfBSlZt5gscCqBXe-5ySn6-M9Lfc8A30DrIF1hySf1RglXoPKaxPkOuH8M0KVarrPY9oZ4HYgTCz7E0VzKzQ9z2A_fJ7vl6lfVj';

const songs = localMusicTracks.slice(0, 3).map((track, index) => ({
  ...track,
  plays: ['124,590,211', '89,102,443', '65,002,198'][index],
  liked: index === 1,
  cover: track.image,
}));

const albums = localMusicTracks.slice(3, 6).map((track, index) => ({
  ...track,
  year: ['2024', '2023', '2022'][index],
  cover: track.image,
}));

const tours = [
  { date: 'Oct 24', city: 'London, UK', venue: 'Printworks' },
  { date: 'Oct 28', city: 'Berlin, DE', venue: 'Berghain' },
];

const tags = ['Electronic', 'Synthwave', 'Cinematic', 'Dark Ambient'];

const filledIconStyle = { fontVariationSettings: "'FILL' 1" };

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

const HomePage: React.FC = () => {
  const { playTrack, playQueue } = usePlayer();
  const navigate = useNavigate();

  const handlePlayHero = () => {
    // Play the first popular song as the hero song
    playQueue(
      songs.map(toPlayerTrack),
      0
    );
  };

  const handlePlaySongList = (index: number) => {
    playQueue(
      songs.map(toPlayerTrack),
      index
    );
  };

  const handlePlayAlbum = (album: typeof albums[0]) => {
    playTrack(toPlayerTrack(album));
  };

  return (
    <PageTransition>
    <main className="min-h-screen bg-background pb-32 text-on-background">
      <section className="relative flex h-[614px] w-full items-end px-container-margin-mobile pb-lg md:h-[716px] md:px-container-margin-desktop">
        <div className="absolute inset-0">
          <img
            alt="Luna Wave in a moody neon-lit studio portrait"
            className="h-full w-full object-cover"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-lg md:flex-row md:items-end">
          <div className="flex flex-col gap-sm">
            <div className="flex items-center gap-sm">
              <span
                className="material-symbols-outlined text-secondary"
                style={filledIconStyle}
              >
                verified
              </span>
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
                Verified Artist
              </span>
            </div>
            <h1 className="font-display text-5xl font-black leading-none text-on-surface md:text-7xl lg:text-8xl">
              Luna Wave
            </h1>
            <p className="mt-xs font-body-lg text-body-lg text-on-surface-variant">
              4,892,104 monthly listeners
            </p>
          </div>

          <div className="flex items-center gap-md pb-xs">
            <button
              onClick={handlePlayHero}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-[0_0_20px_rgba(74,225,118,0.3)] transition-transform hover:scale-105 active:scale-95"
              type="button"
              aria-label="Play Luna Wave"
            >
              <span
                className="material-symbols-outlined text-4xl"
                style={filledIconStyle}
              >
                play_arrow
              </span>
            </button>
            <button
              className="rounded-full border border-outline px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:border-on-surface"
              type="button"
            >
              Follow
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-on-surface"
              type="button"
              aria-label="More artist actions"
            >
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-2xl flex max-w-[1440px] flex-col gap-2xl px-container-margin-mobile md:px-container-margin-desktop xl:flex-row">
        <div className="flex flex-1 flex-col gap-3xl">
          <section>
            <h2 className="mb-md font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
              Popular Songs
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              {songs.map((song, index) => (
                <motion.div
                  key={song.title}
                  variants={itemVariants}
                  onClick={() => handlePlaySongList(index)}
                  className="song-row group flex cursor-pointer items-center rounded-lg px-sm py-sm transition-colors hover:bg-surface-container"
                >
                  <div className="flex w-8 items-center justify-center font-label-md text-label-md text-on-surface-variant">
                    <span className="song-index group-hover:hidden">{index + 1}</span>
                    <span
                      className="song-play-icon material-symbols-outlined text-primary hidden group-hover:block"
                      style={filledIconStyle}
                    >
                      play_arrow
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 items-center gap-md">
                    <img
                      alt={`${song.title} album art`}
                      className="h-10 w-10 rounded object-cover shadow-md"
                      src={song.cover}
                    />
                    <span className="line-clamp-1 font-label-md text-label-md text-on-surface transition-colors group-hover:text-primary">
                      {song.title}
                    </span>
                  </div>

                  <div className="hidden flex-1 pr-md text-right md:block">
                    <span className="font-body-md text-sm text-on-surface-variant">
                      {song.plays}
                    </span>
                  </div>

                  <div className="flex w-28 items-center justify-end gap-sm">
                    <button
                      className="text-on-surface-variant opacity-0 transition-opacity hover:text-on-surface group-hover:opacity-100"
                      type="button"
                      aria-label={`Favorite ${song.title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className={`material-symbols-outlined text-sm ${
                          song.liked ? 'text-secondary' : ''
                        }`}
                        style={{
                          fontVariationSettings: song.liked
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        favorite
                      </span>
                    </button>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {song.duration}
                    </span>
                    <button
                      className="text-on-surface-variant opacity-0 transition-opacity hover:text-on-surface group-hover:opacity-100"
                      type="button"
                      aria-label={`More actions for ${song.title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="material-symbols-outlined text-sm">
                        more_horiz
                      </span>
                    </button>
                  </div>
                </motion.div>
              ))}
              <button
                className="ml-xl mt-sm self-start py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
                type="button"
              >
                Show more
              </button>
            </motion.div>
          </section>

          <section>
            <h2 className="mb-md font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
              Albums
            </h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-md md:grid-cols-3 md:gap-lg lg:grid-cols-4"
            >
              {albums.map((album) => (
                <motion.article
                  key={album.title}
                  variants={itemVariants}
                  onClick={() => handlePlayAlbum(album)}
                  className="group cursor-pointer rounded-xl border border-transparent bg-surface-container-low p-md transition-colors hover:border-outline-variant/30 hover:bg-surface-container"
                >
                  <div className="relative mb-md aspect-square w-full overflow-hidden rounded-lg shadow-lg">
                    <img
                      alt={`${album.title} album cover`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={album.cover}
                    />
                    <button
                      className="absolute bottom-xs right-xs flex h-10 w-10 translate-y-1 items-center justify-center rounded-full bg-secondary text-on-secondary opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                      type="button"
                      aria-label={`Play ${album.title}`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={filledIconStyle}
                      >
                        play_arrow
                      </span>
                    </button>
                  </div>
                  <h3 className="mb-xs line-clamp-1 font-label-md text-label-md text-on-surface transition-colors group-hover:text-primary">
                    {album.title}
                  </h3>
                  <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                    <span>{album.year}</span>
                    <span aria-hidden="true">&bull;</span>
                    <span>Album</span>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </section>
        </div>

        <aside className="flex w-full flex-col gap-md xl:w-80">
          <h2 className="mb-xs font-headline-md text-headline-md text-on-surface xl:hidden">
            About
          </h2>

          <article className="glass-panel group cursor-pointer overflow-hidden rounded-xl">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                alt="Luna Wave performing live on a violet-lit stage"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={aboutImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
            </div>
            <div className="relative z-10 bg-surface-container-low/90 p-md">
              <div className="mb-sm flex items-center gap-sm text-on-surface-variant">
                <span className="font-label-sm text-label-sm font-bold uppercase">
                  About the Artist
                </span>
              </div>
              <p className="mb-md line-clamp-3 font-body-md text-body-md text-on-surface-variant">
                Luna Wave blends ethereal vocals with hard-hitting electronic
                beats, creating a unique sonic landscape that invites listeners
                into a deeply immersive, neon-drenched reality. Based in London,
                her production style is noted for its cinematic depth.
              </p>
              <span className="font-label-sm text-label-sm text-primary group-hover:underline">
                Read more
              </span>
            </div>
          </article>

          <section className="glass-panel flex flex-col gap-md rounded-xl p-md">
            <h3 className="font-label-md text-label-md uppercase text-on-surface-variant">
              On Tour
            </h3>
            {tours.map((tour) => (
              <button
                key={`${tour.date}-${tour.city}`}
                className="group -mx-xs flex items-center justify-between rounded-md p-xs text-left transition-colors hover:bg-on-surface/5"
                type="button"
              >
                <span className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">
                    {tour.date} &bull; {tour.city}
                  </span>
                  <span className="font-body-md text-sm text-on-surface-variant">
                    {tour.venue}
                  </span>
                </span>
                <span className="material-symbols-outlined text-on-surface-variant transition-colors group-hover:text-primary">
                  chevron_right
                </span>
              </button>
            ))}
          </section>

          <section className="glass-panel rounded-xl p-md">
            <h3 className="mb-md font-label-md text-label-md uppercase text-on-surface-variant">
              Artist Tags
            </h3>
            <div className="flex flex-wrap gap-xs">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/tracks?q=${tag}`)}
                  className="rounded-full bg-on-surface/10 px-sm py-xs font-label-sm text-label-sm text-on-surface transition-colors hover:bg-on-surface/20"
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
    </PageTransition>
  );
};

export default HomePage;
