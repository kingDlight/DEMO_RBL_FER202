import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/player';
import PageTransition from '../components/PageTransition';
import { localMusicArtists, localMusicTracks, toPlayerTrack } from '../data/localMusic';

const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playQueue } = usePlayer();

  const artist = useMemo(() => {
    return localMusicArtists.find((a) => a.name.toLowerCase().replace(/\s+/g, '-') === id);
  }, [id]);

  const artistTracks = useMemo(() => {
    if (!artist) return [];
    return localMusicTracks.filter((track) => track.artist === artist.name);
  }, [artist]);

  if (!artist) {
    return (
      <PageTransition>
        <div className="flex h-screen flex-col items-center justify-center gap-md">
          <h1 className="text-display text-on-surface">Artist not found</h1>
          <button onClick={() => navigate('/artists')} className="text-primary hover:underline">
            Back to Artists
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-background pb-32 text-on-background">
        <section className="relative flex h-[400px] w-full items-end px-container-margin-mobile pb-lg md:h-[500px] md:px-container-margin-desktop">
          <div className="absolute inset-0">
            <img
              alt={artist.name}
              className="h-full w-full object-cover"
              src={artist.image}
            />
            <div className="absolute inset-0 bg-background/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>

          <div className="relative z-10 flex w-full max-w-[1440px] flex-col gap-sm">
            <h1 className="font-display text-5xl font-black text-on-surface md:text-7xl">
              {artist.name}
            </h1>
            <p className="font-body-lg text-on-surface-variant">{artist.genre}</p>
            <div className="mt-md flex gap-md">
              <button
                onClick={() => playQueue(artistTracks.map(toPlayerTrack), 0)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-xl max-w-[1440px] px-container-margin-mobile md:px-container-margin-desktop">
          <h2 className="mb-md font-headline-md text-on-surface">Popular Tracks</h2>
          <div className="flex flex-col gap-2">
            {artistTracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => playQueue(artistTracks.map(toPlayerTrack), index)}
                className="group flex cursor-pointer items-center gap-md rounded-lg p-sm transition-colors hover:bg-surface-container-low"
              >
                <span className="w-6 text-center font-label-md text-on-surface-variant group-hover:hidden">
                  {index + 1}
                </span>
                <span className="material-symbols-outlined hidden w-6 text-center text-primary group-hover:block" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
                <img src={track.image} alt={track.title} className="h-12 w-12 rounded object-cover" />
                <div className="flex flex-col">
                  <span className="font-label-md text-on-surface">{track.title}</span>
                  <span className="font-label-sm text-on-surface-variant">{track.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PageTransition>
  );
};

export default ArtistDetailPage;
