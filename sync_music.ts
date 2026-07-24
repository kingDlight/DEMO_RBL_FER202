import * as fs from 'fs';
import * as path from 'path';
import * as mm from 'music-metadata';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MUSIC_DIR = path.join(__dirname, 'public', 'music');
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'localMusic.ts');

const DEFAULT_CATEGORIES = ['Pop', 'Jazz', 'Classical', 'Country', 'Hip-Hop', 'Electronic', 'Rock'];

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return '3:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function run() {
  console.log(`Scanning directory: ${MUSIC_DIR}`);
  if (!fs.existsSync(MUSIC_DIR)) {
    console.error('public/music directory does not exist.');
    return;
  }

  const files = fs.readdirSync(MUSIC_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.mp3', '.flac', '.wav', '.m4a', '.ogg'].includes(ext);
  });

  const tracks = [];
  let idCounter = 1;

  for (const file of files) {
    const filePath = path.join(MUSIC_DIR, file);
    try {
      const metadata = await mm.parseFile(filePath);
      
      let imageBase64 = '';
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const pic = metadata.common.picture[0];
        imageBase64 = `data:${pic.format};base64,${pic.data.toString('base64')}`;
      } else {
        // Fallback default SVG (a simple dark square with some gradient)
        imageBase64 = 'data:image/svg+xml,%0A%20%20%20%20%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22600%22%20viewBox%3D%220%200%20600%20600%22%3E%0A%20%20%20%20%20%20%3Crect%20width%3D%22600%22%20height%3D%22600%22%20fill%3D%22%23160f24%22%2F%3E%0A%20%20%20%20%3C%2Fsvg%3E';
      }

      const track = {
        id: idCounter++,
        title: metadata.common.title || path.parse(file).name,
        artist: metadata.common.artist || 'Unknown Artist',
        album: metadata.common.album || 'Unknown Album',
        image: imageBase64,
        price: 1.99,
        originalPrice: 1.99,
        stock: Math.floor(Math.random() * 100) + 1, // Generate a random stock just like before
        category: metadata.common.genre ? metadata.common.genre[0] : DEFAULT_CATEGORIES[Math.floor(Math.random() * DEFAULT_CATEGORIES.length)],
        duration: formatDuration(metadata.format.duration),
        audioUrl: `/music/${encodeURIComponent(file)}`
      };

      tracks.push(track);
      console.log(`Processed: ${track.title}`);
    } catch (error) {
      console.error(`Error parsing ${file}:`, error.message);
    }
  }

  // Generate output file content while preserving the other exports in localMusic.ts
  const fileContent = `import type { Track } from '../components/TrackCard';

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

  fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf-8');
  console.log(`\\nSuccessfully updated ${OUTPUT_FILE} with ${tracks.length} tracks.`);
}

run();
