import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { localMusicTracks } from '../data/localMusic';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const following = [
  {
    name: 'Sarah Jenkins',
    detail: `Listening to: ${localMusicTracks[0].title}`,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCKYWF2285SB3hxL-Y68GEKwTkbEpZ-CEVY-dGKOxYS7c2ZC_VxjI3mMtonHFQzwQJsBRE3_PHRkSBteVbeydWaHQm_YU-fpdgbwhqPfHWcqT8pazFDXzl3cziXiyNXRqo_KEkSJZFl5LFo-OOOmxDoGbWz4kNKtT4a5EWlTb91nt0vFF5b7ndHsw-HGOAlkELfZNEm_dRf9y9VmHXJihygEJuvnbat4KCTyKiHtjWGWkXSqgHr4hi2',
  },
  {
    name: 'Marcus Cole',
    detail: '24 mutual playlists',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3rQ5ZMsfy2KtHCcl4-z3iMPd4H0Z2zgTaW5Kz7AzRAVHgRo6Vw7ildWWquKJhxuix-9ZT5M2E0UvjtUOhJRYF05lyZadQU303bFyVYZVayjuV2pkw2UBib1GKBGhVvqNnqmohm1ZBLZFw_9N2MIokLZkEdszb0S8jG5Sm8r4T8daCl3BJb69BRJ8IJ4Gt_JwPW2FvtYoX2jKAKMY4bTiBKYfQvx3MwtwclNcupoTdmSwvaPRNJHWp',
  },
  {
    name: 'Elena R.',
    detail: `Listening to: ${localMusicTracks[3]?.title || 'Unknown'}`,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAX_B4IPZ-W4QP9GyFWEHx1-kXalO3d39BWeZg3avYSm3Acbl5KOwgmzLk4lEMsVp7NRn0jpSERFGxZCY1_fSQCyIvyx-3j_7fRNIobrNYWQW8T0i2SUxfuaoG09j9DaKdOMuHD59q0pnrDuHS9QEIWxKBI29F8UiTQs18sDmGGIRhWE2wes0FcpWJc53rdzZUFvo2RNFPDtS7hXJYwck1n1-Y79AJAl0NQIIICbkUI3OOZoZVbyU8c',
  },
];

const cardClass =
  'rounded-xl border border-on-surface/10 bg-brand-surface p-md shadow-[0_16px_48px_rgba(0,0,0,0.18)]';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { playlists, recentlyPlayed } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    password: '',
    avatar: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Auralis - Profile';
    return () => {
      document.title = 'Auralis Music';
    };
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        username: user.username || '',
        password: (user as any).password || '', // Password might not be typed in User interface but exists in DB
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const res = await axios.patch(`http://localhost:3001/users/${user.id}`, editForm);
      updateUser(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Username might be taken.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg pb-[128px] pt-20 text-on-surface">
      <section className="border-b border-outline-variant/20 bg-gradient-to-b from-primary-container/25 via-surface-container-low to-brand-bg">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-xl px-container-margin-mobile py-3xl md:flex-row md:items-center md:px-container-margin-desktop">
          <div className="relative h-[210px] w-[210px] shrink-0 overflow-hidden rounded-full border-4 border-surface-variant bg-surface-container-low shadow-[0_18px_70px_rgba(0,0,0,0.38)] md:h-[250px] md:w-[250px]">
            <img
              src={user.avatar}
              alt={`${user.name} profile`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-md">
            <div className="flex flex-wrap items-center gap-sm">
              <span className="inline-flex items-center gap-xs rounded-full bg-primary-container px-md py-xs font-label-md text-label-md text-on-primary-container">
                <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                Premium
              </span>
              <span className="inline-flex items-center gap-xs rounded-full bg-on-surface/10 px-md py-xs font-label-md text-label-md text-on-surface">
                <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
                Curator
              </span>
            </div>

            <div>
              <h1 className="font-display text-[52px] font-black leading-none text-primary md:text-[72px]">
                {user.name}
              </h1>
              <div className="mt-md flex flex-wrap items-center gap-lg text-on-surface">
                <div>
                  <p className="font-display text-[28px] font-bold leading-none">1,204</p>
                  <p className="mt-xs font-label-md text-label-md text-on-surface-variant">
                    Followers
                  </p>
                </div>
                <div className="h-9 w-px bg-outline-variant/60" />
                <div>
                  <p className="font-display text-[28px] font-bold leading-none">482</p>
                  <p className="mt-xs font-label-md text-label-md text-on-surface-variant">
                    Following
                  </p>
                </div>
                <div className="h-9 w-px bg-outline-variant/60" />
                <div>
                  <p className="font-display text-[28px] font-bold leading-none">{playlists.length}</p>
                  <p className="mt-xs font-label-md text-label-md text-on-surface-variant">
                    Public Playlists
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-sm flex items-center gap-md">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-primary-container px-xl py-sm font-label-md text-label-md text-on-primary-container shadow-[0_10px_28px_rgba(124,58,237,0.24)] transition-transform hover:scale-[1.03] hover:bg-primary hover:text-on-primary"
              >
                Edit Profile
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-on-surface/10 bg-brand-surface text-on-surface transition-colors hover:border-primary hover:text-primary"
                aria-label="Share profile"
              >
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid w-full max-w-[1440px] gap-xl px-container-margin-mobile py-3xl md:px-container-margin-desktop xl:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-lg">
          <section>
            <h2 className="mb-lg font-headline-lg text-headline-lg text-on-surface">
              Following
            </h2>
            <div className={`${cardClass} flex flex-col gap-md`}>
              {following.map((friend) => (
                <div key={friend.name} className="flex min-w-0 items-center gap-md">
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-label-md text-label-md text-on-surface">
                      {friend.name}
                    </p>
                    <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
                      {friend.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="min-w-0">
          <h2 className="mb-lg font-headline-lg text-headline-lg text-on-surface">
            Recently Played
          </h2>
          {recentlyPlayed.length === 0 ? (
            <p className="text-on-surface-variant">You haven't played anything yet.</p>
          ) : (
            <div className="grid gap-lg lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.75fr)]">
              {recentlyPlayed.slice(0, 2).map((track, index) => (
                <article
                  key={track.title}
                  className={`${cardClass} overflow-hidden p-md ${index === 1 ? 'lg:max-w-[340px]' : ''}`}
                >
                  <div className={`${index === 1 ? 'aspect-[3/5]' : 'aspect-square'} overflow-hidden rounded-lg bg-surface-container-low`}>
                    <img
                      src={track.image}
                      alt={track.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-md truncate font-label-md text-label-md text-on-surface">
                    {track.title}
                  </h3>
                  <p className="mt-xs truncate font-body-md text-body-md text-on-surface-variant">
                    {track.artist}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div className="mt-3xl flex items-center justify-between">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Your Playlists
            </h2>
            <button
              type="button"
              className="font-label-md text-label-md text-primary transition-colors hover:text-primary-fixed"
            >
              View All
            </button>
          </div>

          {playlists.length === 0 ? (
            <p className="mt-md text-on-surface-variant">You haven't created any playlists yet.</p>
          ) : (
            <div className="mt-lg grid gap-md lg:grid-cols-2">
              {playlists.map((playlist) => (
                <article
                  key={playlist.id}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                  className={`${cardClass} group cursor-pointer flex min-w-0 items-center gap-md transition-colors hover:border-primary/50`}
                >
                  <img
                    src={playlist.cover}
                    alt={playlist.title}
                    className="h-20 w-20 shrink-0 rounded-md object-cover shadow-md"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-headline-md text-headline-md text-on-surface transition-colors group-hover:text-primary">
                      {playlist.title}
                    </h3>
                    <p className="mt-xs truncate font-label-md text-label-md text-on-surface-variant">
                      {playlist.songCount} tracks
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-high/90 p-xl shadow-2xl backdrop-blur-xl"
            >
              <h2 className="mb-lg font-headline-md text-headline-md font-bold text-on-surface">Edit Profile</h2>
              
              <form onSubmit={handleSave} className="flex flex-col gap-md">
                {error && (
                  <div className="rounded-md bg-error/20 p-2 text-sm text-error">{error}</div>
                )}
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-on-surface-variant">Display Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface p-2 text-on-surface outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-on-surface-variant">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface p-2 text-on-surface outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-on-surface-variant">Password</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface p-2 text-on-surface outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-on-surface-variant">Avatar URL</label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                    className="w-full rounded-lg border border-outline-variant/30 bg-surface p-2 text-on-surface outline-none focus:border-primary"
                  />
                </div>

                <div className="mt-md flex justify-end gap-sm">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-variant"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-fixed disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
