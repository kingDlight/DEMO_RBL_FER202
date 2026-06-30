import type { Track } from '../components/TrackCard';

export const CATEGORIES = ["All", "Electronic", "Synthwave", "Lo-Fi", "Ambient", "Pop", "Rock", "Jazz"];

export const TRACKS: Track[] = [
  { id: 1, title: "Late Night Vibes", artist: "Curated by Auralis", image: "/assets/album_cover.png", price: 0, originalPrice: 1.99, stock: 100, category: "Lo-Fi" },
  { id: 2, title: "Resonance", artist: "HOME", image: "/assets/album_cover.png", price: 1.49, originalPrice: 1.99, stock: 50, category: "Synthwave" },
  { id: 3, title: "Nightcall", artist: "Kavinsky", image: "/assets/album_cover.png", price: 0.99, originalPrice: 0.99, stock: 0, category: "Electronic" },
  { id: 4, title: "Pacific Coast Highway", artist: "Kavinsky", image: "/assets/album_cover.png", price: 2.99, originalPrice: 3.99, stock: 20, category: "Synthwave" }
];
