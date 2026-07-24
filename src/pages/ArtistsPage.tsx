import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { localMusicArtists } from '../data/localMusic';

type Artist = {
  name: string;
  genre: string;
  listeners: string;
  image: string;
  verified?: boolean;
};

const heroImage =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAoU3AWZ9yPEfM_28gyM20L8lX9AdyRH4zcH1QNfk5XN9yimel5zek7Y6YR0UpPzwcGdiICYgvOxHS7nzsIHw5tpJGWe6rdAv8culo6aBa9kPokvjZcMD_Bpa1o56GjkxEwgbUuaw3Qx3R_U-D99dwLxCzXCZwCJE8rASgeZ5X4QfBSlZt5gscCqBXe-5ySn6-M9Lfc8A30DrIF1hySf1RglXoPKaxPkOuH8M0KVarrPY9oZ4HYgTCz7E0VzKzQ9z2A_fJ7vl6lfVj';

const featuredArtists: Artist[] = localMusicArtists.slice(0, 8);

const genres = ['All Genres', 'Pop', 'Rock', 'EDM', 'Hip-Hop'];

const filledIconStyle = { fontVariationSettings: "'FILL' 1" } as React.CSSProperties;

const ArtistsPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All Genres');

  useEffect(() => {
    document.title = 'Auralis - Artists';

    return () => {
      document.title = 'Auralis Music';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-[112px] pt-20 text-on-background">
      <main className="mx-auto w-full max-w-[1440px] px-container-margin-mobile py-xl md:px-container-margin-desktop">
        <section
          className="relative flex min-h-[560px] items-center overflow-hidden rounded-3xl bg-cover bg-center px-lg md:px-xl"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
          <div className="relative z-10 max-w-[760px]">
            <h1 className="font-display text-5xl font-black leading-none text-on-surface md:text-7xl">
              Explore Artists
            </h1>
            <p className="mt-lg font-body-lg text-body-lg text-on-surface-variant">
              Find your favorite voices and discover new sounds across every genre.
            </p>
          </div>
        </section>

        <section className="mt-[40px] flex flex-col gap-lg xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-md lg:flex-row lg:items-center">
            <label className="relative block w-full max-w-[420px]">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-on-surface-variant">
                search
              </span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-14 w-full rounded-full border border-outline-variant/70 bg-surface-container-high pl-12 pr-6 font-body-lg text-body-lg text-on-surface outline-none transition-all placeholder:text-on-surface-variant focus:border-primary-container focus:ring-1 focus:ring-primary-container"
                placeholder="Search by artist name..."
                type="text"
              />
            </label>

            <div className="no-scrollbar flex gap-sm overflow-x-auto">
              {genres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setActiveGenre(genre)}
                  className={`h-12 whitespace-nowrap rounded-full border px-6 font-label-md text-label-md transition-colors ${
                    activeGenre === genre
                      ? 'border-primary-container bg-primary-container/10 text-primary'
                      : 'border-outline-variant/70 bg-surface-container-low text-on-surface hover:border-primary'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="flex h-12 w-fit items-center gap-sm rounded-lg border border-outline-variant/70 bg-surface-container-low px-6 font-label-md text-label-md text-on-surface transition-colors hover:border-primary"
          >
            Most Popular
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </section>

        <section className="mt-[64px]">
          <h2 className="mb-xl font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
            Featured Artists
          </h2>

          <div className="grid grid-cols-1 gap-lg sm:grid-cols-2 lg:grid-cols-4">
            {featuredArtists.map((artist) => (
              <Link
                key={artist.name}
                to={`/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group flex min-h-[440px] max-w-[360px] flex-col items-center rounded-xl bg-surface-container-low p-xl text-center transition-colors hover:bg-surface-container no-underline"
              >
                <div className="relative mt-sm">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="h-[156px] w-[156px] rounded-full object-cover transition-transform duration-500 group-hover:scale-105 shadow-xl"
                  />
                  {artist.verified && (
                    <span className="absolute bottom-sm right-xs flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-on-secondary ring-4 ring-surface-container-low transition-colors group-hover:ring-surface-container">
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={filledIconStyle}
                      >
                        verified
                      </span>
                    </span>
                  )}
                </div>

                <h3 className="mt-xl font-headline-md text-headline-md font-bold text-on-surface transition-colors group-hover:text-primary">
                  {artist.name}
                </h3>
                <p className="mt-sm font-label-md text-label-md text-primary">
                  {artist.genre}
                </p>
                <p className="mt-md font-label-md text-label-md text-on-surface-variant">
                  {artist.listeners}
                </p>

                <button
                  type="button"
                  className="mt-auto h-12 w-full rounded-full bg-primary-container font-label-md text-label-md text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary"
                >
                  Follow
                </button>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ArtistsPage;
