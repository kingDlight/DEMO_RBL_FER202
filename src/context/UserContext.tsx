import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Track } from '../components/TrackCard';
import type { Playlist } from '../services/trackService';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface UserContextValue {
  favorites: Track[];
  recentlyPlayed: Track[];
  playlists: Playlist[];
  toggleFavorite: (track: Track) => Promise<void>;
  isFavorite: (trackId: string | number) => boolean;
  addRecentlyPlayed: (track: Track) => void;
  createPlaylist: (title: string, description: string, cover?: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, track: Track) => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      setFavorites(user.favorites || []);
      setRecentlyPlayed(user.recentlyPlayed || []);
      setPlaylists(user.playlists || []);
    } else {
      setFavorites([]);
      setRecentlyPlayed([]);
      setPlaylists([]);
    }
  }, [user]);

  const syncWithServer = async (updates: any) => {
    if (!user) return;
    try {
      const res = await axios.patch(`http://localhost:3001/users/${user.id}`, updates);
      updateUser(res.data);
    } catch (err) {
      console.error('Failed to sync user data with server', err);
    }
  };

  const isFavorite = useCallback((trackId: string | number) => {
    return favorites.some(f => String(f.id) === String(trackId));
  }, [favorites]);

  const toggleFavorite = useCallback(async (track: Track) => {
    if (!user) {
      addToast('Please login to favorite tracks', 'error');
      return;
    }
    const isFav = isFavorite(track.id);
    const newFavs = isFav 
      ? favorites.filter(f => String(f.id) !== String(track.id))
      : [...favorites, track];
    
    setFavorites(newFavs);
    addToast(isFav ? 'Removed from favorites' : 'Added to favorites', isFav ? 'info' : 'success');
    await syncWithServer({ favorites: newFavs });
  }, [favorites, isFavorite, user, addToast]);

  const addRecentlyPlayed = useCallback(async (track: Track) => {
    if (!user) return;
    if (recentlyPlayed.length > 0 && recentlyPlayed[0].id === track.id) return;
    
    const newRecent = [track, ...recentlyPlayed.filter(t => t.id !== track.id)].slice(0, 20);
    setRecentlyPlayed(newRecent);
    await syncWithServer({ recentlyPlayed: newRecent });
  }, [recentlyPlayed, user]);

  const createPlaylist = useCallback(async (title: string, description: string, cover?: string) => {
    if (!user) {
      addToast('Please login to create playlists', 'error');
      return;
    }
    const newPlaylist: Playlist = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      cover: cover || ('https://placehold.co/300x300/4f46e5/white?text=' + encodeURIComponent(title)),
      songCount: 0,
      tracks: []
    };
    const newPlaylists = [...playlists, newPlaylist];
    setPlaylists(newPlaylists);
    addToast('Playlist created', 'success');
    await syncWithServer({ playlists: newPlaylists });
  }, [playlists, user, addToast, syncWithServer]);

  const deletePlaylist = useCallback(async (id: string) => {
    if (!user) {
      addToast('Please login to delete playlists', 'error');
      return;
    }
    const newPlaylists = playlists.filter(p => p.id !== id);
    setPlaylists(newPlaylists);
    addToast('Playlist deleted', 'info');
    await syncWithServer({ playlists: newPlaylists });
  }, [playlists, user, addToast, syncWithServer]);

  const addTrackToPlaylist = useCallback(async (playlistId: string, track: Track) => {
    if (!user) {
      addToast('Please login to add tracks to playlists', 'error');
      return;
    }
    
    const playlistIndex = playlists.findIndex(p => p.id === playlistId);
    if (playlistIndex === -1) {
      addToast('Playlist not found', 'error');
      return;
    }

    const playlist = playlists[playlistIndex];
    const tracks = playlist.tracks || [];
    
    // Check if already exists
    if (tracks.some(t => t.id === track.id)) {
      addToast('Track is already in this playlist', 'info');
      return;
    }

    const newPlaylists = [...playlists];
    newPlaylists[playlistIndex] = {
      ...playlist,
      tracks: [...tracks, track],
      songCount: playlist.songCount + 1
    };

    setPlaylists(newPlaylists);
    addToast('Track added to playlist', 'success');
    await syncWithServer({ playlists: newPlaylists });
  }, [playlists, user, addToast]);

  const value = useMemo(() => ({
    favorites,
    recentlyPlayed,
    playlists,
    toggleFavorite,
    isFavorite,
    addRecentlyPlayed,
    createPlaylist,
    deletePlaylist,
    addTrackToPlaylist
  }), [favorites, recentlyPlayed, playlists, toggleFavorite, isFavorite, addRecentlyPlayed, createPlaylist, deletePlaylist, addTrackToPlaylist]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
