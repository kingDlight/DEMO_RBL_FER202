import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { TRACKS } from '../data/tracks';
import { toPlayerTrack } from '../data/localMusic';
import { usePlayer } from '../context/player';

const TrackDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playTrack } = usePlayer();

  const track = TRACKS.find((item) => item.id === Number.parseInt(id || '0', 10));

  if (!track) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="mb-sm font-headline-lg text-headline-lg text-on-surface">
          Track not found
        </h1>
        <p className="mb-lg max-w-[576px] text-on-surface-variant">
          The track you are looking for does not exist or has been removed.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-outline px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary"
        >
          Go back
        </button>
      </section>
    );
  }

  const handlePlay = () => {
    playTrack(toPlayerTrack(track), { elapsed: '0:00', progress: 0 });
  };

  return (
    <section className="mx-auto max-w-[960px]">
      <nav className="mb-lg flex flex-wrap items-center gap-sm text-sm text-on-surface-variant">
        <Link to="/" className="text-on-surface-variant no-underline hover:text-primary">
          Home
        </Link>
        <span aria-hidden="true">&gt;</span>
        <Link to="/tracks" className="text-on-surface-variant no-underline hover:text-primary">
          Music
        </Link>
        <span aria-hidden="true">&gt;</span>
        <span className="text-on-surface">{track.title}</span>
      </nav>

      <article className="grid overflow-hidden rounded-xl bg-surface-container-low shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:grid-cols-[0.9fr_1.1fr]">
        <img
          src={track.image}
          alt={track.title}
          className="h-full min-h-[320px] w-full object-cover"
        />

        <div className="flex min-h-[420px] flex-col justify-center p-xl">
          {track.category && (
            <span className="mb-md self-start rounded-md bg-on-surface/10 px-sm py-xs text-xs font-semibold text-on-surface-variant">
              {track.category}
            </span>
          )}

          <h1 className="mb-sm font-headline-lg text-headline-lg text-on-surface">
            {track.title}
          </h1>
          <p className="mb-xl text-xl text-on-surface-variant">{track.artist}</p>

          <div className="mb-xl grid gap-sm text-on-surface-variant sm:grid-cols-2">
            <div className="rounded-lg bg-on-surface/5 px-md py-sm">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                Duration
              </span>
              <span className="font-label-md text-label-md text-on-surface">
                {track.duration || '3:00'}
              </span>
            </div>
            <div className="rounded-lg bg-on-surface/5 px-md py-sm">
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-outline">
                Source
              </span>
              <span className="font-label-md text-label-md text-on-surface">G:\Music</span>
            </div>
          </div>

          <p className="mb-xl text-on-surface-variant">
            Click play to start this local track in the shared player.
          </p>

          <div className="mt-auto flex flex-wrap gap-md">
            <button
              type="button"
              onClick={handlePlay}
              className="rounded-xl bg-primary-container px-lg py-sm font-label-md text-label-md text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary"
            >
              Play Now
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-outline px-lg py-sm font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary"
            >
              Go back
            </button>
          </div>
        </div>
      </article>
    </section>
  );
};

export default TrackDetailPage;
