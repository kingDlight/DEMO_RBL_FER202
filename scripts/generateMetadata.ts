import * as fs from 'fs';
import * as path from 'path';
import * as mm from 'music-metadata';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, '../public/music');
const outputFile = path.join(__dirname, '../src/data/localMusic.ts');

const categories = ['Pop', 'Rock', 'Hip-Hop', 'EDM', 'Jazz', 'Classical', 'K-Pop', 'Country'];
const palettes = [
  ['#100d16', '#7c3aed', '#22c55e'],
  ['#0f172a', '#0891b2', '#d2bbff'],
  ['#15121b', '#ec4899', '#f97316'],
  ['#111827', '#38bdf8', '#a78bfa'],
  ['#160f24', '#14b8a6', '#fb7185'],
  ['#0b1120', '#f59e0b', '#4ae176'],
];

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&apos;';
    }
  });

const createCover = (title: string, artist: string, index: number) => {
  const [background, primary, accent] = palettes[index % palettes.length];
  const shortTitle = title.length > 22 ? `${title.slice(0, 22)}...` : title;
  const shortArtist = artist.length > 20 ? `${artist.slice(0, 20)}...` : artist;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
      <defs>
        <radialGradient id="glow" cx="65%" cy="25%" r="70%">
          <stop offset="0" stop-color="${accent}" stop-opacity="0.95"/>
          <stop offset="0.45" stop-color="${primary}" stop-opacity="0.55"/>
          <stop offset="1" stop-color="${background}" stop-opacity="1"/>
        </radialGradient>
        <linearGradient id="wave" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${primary}"/>
          <stop offset="1" stop-color="${accent}"/>
        </linearGradient>
      </defs>
      <rect width="600" height="600" fill="url(#glow)"/>
      <path d="M55 365 C140 290 205 455 295 365 S465 292 545 365" fill="none" stroke="url(#wave)" stroke-width="13" stroke-linecap="round" opacity="0.9"/>
      <path d="M65 410 C160 330 225 500 315 410 S475 335 535 410" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.28"/>
      <circle cx="468" cy="118" r="70" fill="${accent}" opacity="0.2"/>
      <circle cx="126" cy="125" r="38" fill="${primary}" opacity="0.28"/>
      <text x="54" y="500" fill="#f4efff" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="800">${escapeXml(shortTitle)}</text>
      <text x="56" y="540" fill="#d8cfeb" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="600">${escapeXml(shortArtist)}</text>
    </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

async function run() {
  const files = fs.readdirSync(musicDir).filter(f => /\.(mp3|flac|opus|m4a|wav|ogg)$/i.test(f));
  const tracks: any[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(musicDir, file);
    
    try {
      const metadata = await mm.parseFile(filePath);
      
      let title = metadata.common.title;
      let artist = metadata.common.artist;
      
      if (!title || !artist) {
        const baseName = file.replace(/\.(mp3|flac|opus|m4a|wav|ogg)$/i, '');
        const sep = baseName.lastIndexOf(' - ');
        if (sep !== -1) {
          title = title || baseName.slice(0, sep);
          artist = artist || baseName.slice(sep + 3);
        } else {
          title = title || baseName;
          artist = artist || 'Unknown Artist';
        }
      }

      let image: string | null = null;
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const pic = metadata.common.picture[0];
        const fmt = pic.format || 'image/jpeg';
        const imgMime = fmt.startsWith('image/') ? fmt : `image/${fmt}`;
        const base64 = pic.data.toString('base64');
        image = `data:${imgMime};base64,${base64}`;
      } else {
        image = createCover(title, artist, i);
      }
      
      let durationStr = '3:00';
      if (metadata.format.duration) {
         const dm = Math.floor(metadata.format.duration / 60);
         const ds = Math.floor(metadata.format.duration % 60).toString().padStart(2, '0');
         durationStr = `${dm}:${ds}`;
      }

      const price = Number((0.99 + (i % 4) * 0.5).toFixed(2));
      tracks.push({
        id: i + 1,
        title,
        artist,
        album: metadata.common.album || 'Single',
        image,
        price,
        originalPrice: i % 5 === 0 ? Number((price + 1).toFixed(2)) : price,
        stock: 100 - (i % 8) * 7,
        category: categories[i % categories.length],
        duration: durationStr,
        audioUrl: `/music/${encodeURIComponent(file)}`
      });
      console.log(`Parsed ${file} (${title} - ${artist})`);
    } catch (e) {
      console.error(`Failed to parse ${file}`, e);
    }
  }

  const outputStr = `
import type { Track } from '../components/TrackCard';

export const localMusicTracks: Track[] = ${JSON.stringify(tracks, null, 2)};

export const localMusicArtists = Array.from(
  new Map(
    localMusicTracks.map((track) => [
      track.artist,
      {
        name: track.artist,
        genre: track.category || 'Music',
        listeners: \`\${(2 + (track.id % 7) * 0.4).toFixed(1)}M Listeners\`,
        image: track.image,
        verified: track.id % 2 === 0,
      },
    ]),
  ).values(),
);

export const toPlayerTrack = (track: Track) => ({
  id: track.id,
  title: track.title,
  artist: track.artist,
  duration: track.duration || '3:00',
  image: track.image,
  audioUrl: track.audioUrl,
  lyrics: track.lyrics,
});

export const withAddedMeta = (track: Track, index: number) => ({
  ...track,
  album: \`\${track.artist} Collection\`,
  added: index < 2 ? '2 days ago' : index < 6 ? '1 week ago' : 'Recently',
});
`;

  fs.writeFileSync(outputFile, outputStr.trim());
  console.log('Successfully generated localMusic.ts!');
}

run();
