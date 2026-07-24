import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Track } from './TrackCard';
import { createTrack, deleteTrack, getTracks, updateTrack } from '../services/trackService';

const categories = ['Pop', 'Rock', 'Hip-Hop', 'EDM', 'Jazz', 'Classical', 'K-Pop', 'Country'];

const emptyTrack: Track = {
  id: 0,
  title: '',
  artist: '',
  image: '/assets/album_cover.png',
  price: 0,
  originalPrice: 0,
  stock: 0,
  category: 'Pop',
};

type AdminRow = {
  idLabel: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  status: 'Active' | 'Draft';
  added: string;
  image?: string;
  sourceTrack?: Track;
};

const demoRows: AdminRow[] = [
  {
    idLabel: 'TRK-001',
    title: 'Neon Horizon',
    artist: 'Synthwave Syndicate',
    album: 'Midnight Drives',
    genre: 'EDM',
    status: 'Active',
    added: 'Oct 24, 2023',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9Nt39kbgTDgWTmnVFxWljy4HW303piwFaJde1eXKPVkXGSb46aKJA8dIGZVGo90L61WWGht6IydLo4Gl1JffzZWT8ubtvomFud-qLM6LnGkDTn4hkCZXhNNEg9P3Bxt90RCB-dUTCNZ26TWRoFvXEYBaEke9sfATKg94VIjGrt8Dfl_gX7-D9XKZjYkHkX8WUBsc6I_BIFbi5fXTLX95C_MqYr42OrGPS7kczFirxD5GfcDvcb0ry',
  },
  {
    idLabel: 'TRK-002',
    title: 'Echoes of Silence',
    artist: 'The Minimalists',
    album: 'Void Elements',
    genre: 'Jazz',
    status: 'Active',
    added: 'Oct 23, 2023',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBzYrTAyRfSk6cybd012CUaYYINEpy13qOcmIj8WpJLOIOvjSpNl2HBiUOqxFzWRHWbj8_25guiQ8T_W1D9g7ax66teTfhtHX6SOMxRXmu5Y6i0GP-nH5-EqBJbYh-d1ARzhRBe-y_91e1z0i08VnxRylOgwiIyPOjgRfvhnYvJ_mfvqJfq4vG1a_ifBpWtTpCCtZo6uT0jD5fi9lTsmOEEqUZe3r1VEACGddHWr8h8qwg0Gnkrp1Vc',
  },
  {
    idLabel: 'TRK-003',
    title: 'Untitled Demo v2',
    artist: 'Unknown Artist',
    album: 'Unreleased',
    genre: 'Hip-Hop',
    status: 'Draft',
    added: 'Oct 22, 2023',
  },
  {
    idLabel: 'TRK-004',
    title: 'Iron Grip',
    artist: 'Steel Machine',
    album: 'Heavy Industry',
    genre: 'Rock',
    status: 'Active',
    added: 'Oct 21, 2023',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAaxpas5os9ANPyJNsSZaYID5Lku_Viw9KgHTIv9lHYh4FrylFYrHB30BSrzICBw9m1m6atI1GmiYHnqzwGgrdhIx2ULeNst4_Qnx9AXKcTjCWR9zWarFmJOEgEGyP-16muwZ4Df5aBCS2Oe6wLnfO18uQSrazzBXtlTSkLjsP9AI2uetTZSD-MV6ygssUM8h503cU1On-ijhGfZvcsdGT4gLV07bRVtmHO-TOY7rfmvL18HhOQMXH2',
  },
];

const overviewCards = [
  {
    icon: 'audiotrack',
    label: 'Total Tracks',
    value: '24,502',
    trend: '2.4%',
    iconTone: 'bg-primary-container/25 text-primary',
  },
  {
    icon: 'groups',
    label: 'Total Artists',
    value: '1,204',
    trend: '1.1%',
    iconTone: 'bg-primary-container/25 text-primary',
  },
  {
    icon: 'album',
    label: 'Total Albums',
    value: '3,450',
    trend: '3.8%',
    iconTone: 'bg-primary-container/25 text-primary',
  },
];

const inputClass =
  'w-full rounded-lg border border-outline-variant bg-surface-container-high px-md py-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

const formatTrackId = (id: number) => `TRK-${String(id).padStart(3, '0')}`;

const toAdminRow = (track: Track): AdminRow => ({
  idLabel: formatTrackId(track.id),
  title: track.title,
  artist: track.artist,
  album: track.category ? `${track.category} Collection` : 'Auralis Catalog',
  genre: track.category || 'Pop',
  status: track.stock > 0 ? 'Active' : 'Draft',
  added: 'Oct 24, 2023',
  image: track.image,
  sourceTrack: track,
});

const rowToTrack = (row: AdminRow): Track => ({
  id: Number.parseInt(row.idLabel.replace('TRK-', ''), 10) || 0,
  title: row.title,
  artist: row.artist,
  image: row.image || '/assets/album_cover.png',
  price: 0,
  originalPrice: 0,
  stock: row.status === 'Active' ? 1 : 0,
  category: row.genre,
});

const AdminTable: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Track>(emptyTrack);

  const rows = useMemo(
    () => (tracks.length > 0 ? tracks.map(toAdminRow) : demoRows),
    [tracks],
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTracks();
      setTracks(data);
      setError(null);
    } catch {
      setError('Preview data is being shown because the database server is unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData(emptyTrack);
  };

  const handleShowAdd = () => {
    setIsEditing(false);
    setFormData(emptyTrack);
    setShowModal(true);
  };

  const handleShowEdit = (row: AdminRow) => {
    setIsEditing(Boolean(row.sourceTrack));
    setFormData(row.sourceTrack || rowToTrack(row));
    setShowModal(true);
  };

  const handleDelete = async (row: AdminRow) => {
    if (!row.sourceTrack) {
      return;
    }

    if (!window.confirm(`Delete ${row.title}?`)) {
      return;
    }

    try {
      await deleteTrack(row.sourceTrack.id);
      setTracks((current) => current.filter((track) => track.id !== row.sourceTrack?.id));
      setError(null);
    } catch {
      setError('Failed to delete track. Please try again.');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (isEditing) {
        const updated = await updateTrack(formData.id, formData);
        setTracks((current) =>
          current.map((track) => (track.id === updated.id ? updated : track)),
        );
      } else {
        const { id: _id, ...rest } = formData;
        const created = await createTrack(rest as Omit<Track, 'id'>);
        setTracks((current) => [...current, created]);
      }
      setError(null);
      handleClose();
    } catch {
      setError('Failed to save track. Please check json-server.');
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-2xl">
      <div className="flex flex-col gap-lg md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline-lg text-[40px] font-extrabold leading-tight text-on-surface">
            Database Management
          </h1>
          <p className="mt-xs font-body-lg text-body-lg text-on-surface-variant">
            Manage and monitor the Auralis music catalog.
          </p>
        </div>

        <div className="flex flex-wrap gap-md">
          <button
            type="button"
            className="flex items-center gap-sm rounded-lg border border-outline-variant/30 bg-surface-variant px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:bg-outline-variant"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Import CSV
          </button>
          <button
            type="button"
            className="flex items-center gap-sm rounded-lg border border-outline-variant/30 bg-surface-variant px-md py-sm font-label-md text-label-md text-on-surface transition-colors hover:bg-outline-variant"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export DB
          </button>
          <button
            type="button"
            onClick={handleShowAdd}
            className="flex items-center gap-sm rounded-lg bg-primary-container px-md py-sm font-label-md text-label-md text-on-primary-container shadow-lg shadow-primary-container/20 transition-colors hover:bg-primary hover:text-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add New Track
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => (
          <article
            key={card.label}
            className="glass-panel flex min-h-[176px] flex-col justify-between rounded-xl p-lg transition-colors hover:bg-surface-variant/20"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-sm ${card.iconTone}`}>
                <span className="material-symbols-outlined text-[30px]">{card.icon}</span>
              </div>
              <span className="flex items-center font-label-md text-label-md text-secondary">
                <span className="material-symbols-outlined mr-1 text-[14px]">
                  arrow_upward
                </span>
                {card.trend}
              </span>
            </div>
            <div>
              <p className="mb-xs font-label-md text-label-md text-on-surface-variant">
                {card.label}
              </p>
              <p className="font-headline-md text-[36px] font-medium leading-none text-on-surface">
                {card.value}
              </p>
            </div>
          </article>
        ))}

        <article className="glass-panel flex min-h-[176px] flex-col justify-between rounded-xl p-lg transition-colors hover:bg-surface-variant/20">
          <div className="flex items-start justify-between">
            <div className="rounded-lg border border-outline-variant/30 bg-surface-bright p-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[30px]">storage</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant">
              82% Capacity
            </span>
          </div>
          <div>
            <p className="mb-xs font-label-md text-label-md text-on-surface-variant">
              Storage Used
            </p>
            <p className="font-headline-md text-[36px] font-medium leading-none text-on-surface">
              1.2 <span className="text-lg font-normal text-on-surface-variant">TB</span>
            </p>
            <div className="mt-md h-1.5 overflow-hidden rounded-full bg-surface-container">
              <div className="h-full w-[82%] rounded-full bg-primary" />
            </div>
          </div>
        </article>
      </div>

      {error && (
        <div className="rounded-xl border border-outline-variant/40 bg-surface-container/60 px-md py-sm font-label-sm text-label-sm text-on-surface-variant">
          {error}
        </div>
      )}

      <div className="glass-panel flex min-h-[600px] flex-col overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface/50 p-md">
          <h2 className="font-headline-md text-[22px] font-semibold text-on-surface">
            Track Database
          </h2>
          <div className="flex gap-sm">
            <button
              type="button"
              className="rounded-md p-1.5 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
              aria-label="Filter table"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </button>
            <button
              type="button"
              className="rounded-md p-1.5 text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
              aria-label="More table actions"
            >
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-sm">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-outline-variant/20 bg-brand-surface font-label-sm text-xs uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="rounded-tl-lg p-3 pl-4 font-medium">ID</th>
                <th className="p-3 font-medium">Track</th>
                <th className="p-3 font-medium">Artist</th>
                <th className="p-3 font-medium">Album</th>
                <th className="p-3 font-medium">Genre</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Added</th>
                <th className="rounded-tr-lg p-3 pr-4 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="font-body-md text-sm text-on-surface">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-md py-3xl text-center">
                    <div className="inline-flex items-center gap-md text-on-surface-variant">
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
                      Loading database...
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.idLabel}
                    className="group border-b border-outline-variant/10 transition-colors hover:bg-surface-variant/30"
                  >
                    <td className="p-3 pl-4 font-mono text-xs text-on-surface-variant">
                      {row.idLabel}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-md">
                        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded bg-surface-container transition-all group-hover:shadow-md">
                          {row.image ? (
                            <>
                              <img
                                className="h-full w-full object-cover"
                                src={row.image}
                                alt={`${row.title} cover`}
                              />
                              <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
                                <span className="material-symbols-outlined text-lg text-white">
                                  play_arrow
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="material-symbols-outlined text-on-surface-variant">
                              music_note
                            </span>
                          )}
                        </div>
                        <span
                          className={`font-medium text-on-surface ${
                            row.status === 'Draft' ? 'italic' : ''
                          }`}
                        >
                          {row.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">{row.artist}</td>
                    <td className="p-3 text-on-surface-variant">{row.album}</td>
                    <td className="p-3">
                      <span className="rounded bg-surface-variant px-sm py-xs font-label-sm text-xs text-on-surface-variant">
                        {row.genre}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`flex items-center gap-xs font-label-sm text-xs ${
                          row.status === 'Active'
                            ? 'text-secondary'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            row.status === 'Active' ? 'bg-secondary' : 'bg-on-surface-variant'
                          }`}
                        />
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-on-surface-variant">{row.added}</td>
                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-xs opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleShowEdit(row)}
                          className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          disabled={!row.sourceTrack}
                          className="rounded p-1.5 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error disabled:cursor-not-allowed disabled:opacity-40"
                          title={row.sourceTrack ? 'Delete' : 'Preview row'}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-outline-variant/20 bg-surface/30 p-3">
          <span className="font-label-sm text-xs text-on-surface-variant">
            Showing 1 to {rows.length} of 24,502 entries
          </span>
          <div className="flex items-center gap-xs">
            <button
              type="button"
              className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-variant"
              aria-label="Previous page"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button
              type="button"
              className="flex h-6 w-6 items-center justify-center rounded bg-primary-container text-xs font-medium text-on-primary-container"
            >
              1
            </button>
            {['2', '3'].map((page) => (
              <button
                key={page}
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-variant"
              >
                {page}
              </button>
            ))}
            <span className="px-xs text-on-surface-variant">...</span>
            <button
              type="button"
              className="rounded p-1 text-on-surface-variant transition-colors hover:bg-surface-variant"
              aria-label="Next page"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-[10vh] px-container-margin-mobile">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative z-10 w-full max-w-[576px] overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between border-b border-outline-variant px-lg py-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                {isEditing ? 'Edit Track' : 'Add New Track'}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/10 hover:text-on-surface"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-md px-lg py-lg">
                <label className="block">
                  <span className="mb-xs block font-label-md text-label-md text-on-surface">
                    Title
                  </span>
                  <input
                    className={inputClass}
                    type="text"
                    required
                    value={formData.title}
                    onChange={(event) =>
                      setFormData({ ...formData, title: event.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="mb-xs block font-label-md text-label-md text-on-surface">
                    Artist
                  </span>
                  <input
                    className={inputClass}
                    type="text"
                    required
                    value={formData.artist}
                    onChange={(event) =>
                      setFormData({ ...formData, artist: event.target.value })
                    }
                  />
                </label>

                <label className="block">
                  <span className="mb-xs block font-label-md text-label-md text-on-surface">
                    Category
                  </span>
                  <select
                    className={inputClass}
                    value={formData.category || 'Pop'}
                    onChange={(event) =>
                      setFormData({ ...formData, category: event.target.value })
                    }
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-xs block font-label-md text-label-md text-on-surface">
                    Image URL
                  </span>
                  <input
                    className={inputClass}
                    type="url"
                    value={formData.image}
                    onChange={(event) =>
                      setFormData({ ...formData, image: event.target.value })
                    }
                  />
                </label>

                <div className="grid gap-md sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-xs block font-label-md text-label-md text-on-surface">
                      Price ($)
                    </span>
                    <input
                      className={inputClass}
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          price: Number.parseFloat(event.target.value) || 0,
                        })
                      }
                    />
                  </label>

                  <label className="block">
                    <span className="mb-xs block font-label-md text-label-md text-on-surface">
                      Stock
                    </span>
                    <input
                      className={inputClass}
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          stock: Number.parseInt(event.target.value, 10) || 0,
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-md border-t border-outline-variant px-lg py-md">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-outline-variant px-lg py-sm font-label-md text-label-md text-on-surface transition-colors hover:border-primary hover:text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-container px-lg py-sm font-label-md text-label-md text-on-primary-container transition-colors hover:bg-primary hover:text-on-primary"
                >
                  {isEditing ? 'Save Changes' : 'Add Track'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </section>
  );
};

export default AdminTable;
