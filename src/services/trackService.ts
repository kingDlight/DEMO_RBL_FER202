import axios from 'axios';
import type { Track } from '../components/TrackCard';
import { localMusicTracks } from '../data/localMusic';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
});

// Interceptor to log errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const getTracks = async (): Promise<Track[]> => {
  let currentLocalTracks = localMusicTracks;

  try {
    const response = await api.get<Track[]>('/tracks');
    const customTracks = response.data.filter(
      (track) => !currentLocalTracks.some((localTrack) => localTrack.id === track.id),
    );
    return [...currentLocalTracks, ...customTracks];
  } catch {
    return currentLocalTracks;
  }
};

export const getTrackById = async (id: number | string): Promise<Track> => {
  const localTrack = localMusicTracks.find((track) => String(track.id) === String(id));
  if (localTrack) {
    return localTrack;
  }

  const response = await api.get<Track>(`/tracks/${id}`);
  return response.data;
};

export const createTrack = async (data: Omit<Track, 'id'>): Promise<Track> => {
  const response = await api.post<Track>('/tracks', data);
  return response.data;
};

export const updateTrack = async (id: number | string, data: Partial<Track>): Promise<Track> => {
  const response = await api.put<Track>(`/tracks/${id}`, data);
  return response.data;
};

export const deleteTrack = async (id: number | string): Promise<void> => {
  await api.delete(`/tracks/${id}`);
};

export const getFavorites = async (): Promise<Track[]> => {
  try {
    const response = await api.get<Track[]>('/favorites');
    if (response.data.length > 0) {
      return response.data;
    }
  } catch {
    // Fall through to the local music library.
  }

  const tracks = await getTracks();
  return tracks.slice(0, 8);
};

export const addFavorite = async (track: Track): Promise<void> => {
  await api.post('/favorites', track);
};

export const removeFavorite = async (id: number | string): Promise<void> => {
  await api.delete(`/favorites/${id}`);
};

export interface Playlist {
  id: string;
  title: string;
  description: string;
  cover: string;
  songCount: number;
  tracks?: Track[];
}

export const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await api.get<Playlist[]>('/playlists');
  return response.data;
};

export const createPlaylist = async (data: Omit<Playlist, 'id' | 'songCount'>): Promise<Playlist> => {
  const payload = { ...data, songCount: 0, id: Math.random().toString(36).substring(2, 9) };
  const response = await api.post<Playlist>('/playlists', payload);
  return response.data;
};
