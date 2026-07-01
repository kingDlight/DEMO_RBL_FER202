import axios from 'axios';
import type { Track } from '../components/TrackCard';

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
  const response = await api.get<Track[]>('/tracks');
  return response.data;
};

export const getTrackById = async (id: number | string): Promise<Track> => {
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
