import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  (window as any).Buffer = (window as any).Buffer || Buffer;
}

export type ParsedAudioMetadata = {
  common: {
    title?: string;
    artist?: string;
    album?: string;
    picture?: Array<{ data: Uint8Array; format?: string }>;
  };
  format?: {
    duration?: number;
    container?: string;
    codec?: string;
    sampleRate?: number;
    bitrate?: number;
    numberOfChannels?: number;
    lossless?: boolean;
    [key: string]: any;
  };
};

export async function fetchMetadataFromUrl(url: string): Promise<{
  metadata: ParsedAudioMetadata | null;
  imageUrl: string | null;
}> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch audio for metadata: ${res.statusText}`);
    const blob = await res.blob();
    return await extractMetadataFromBlob(blob);
  } catch (err) {
    console.error('Error fetching metadata from URL:', err);
    return { metadata: null, imageUrl: null };
  }
}

export async function extractMetadataFromBlob(blob: Blob): Promise<{
  metadata: ParsedAudioMetadata | null;
  imageUrl: string | null;
}> {
  try {
    const mm = await import('music-metadata-browser');
    const metadata = (await mm.parseBlob(blob)) as ParsedAudioMetadata;
    let imageUrl: string | null = null;

    if (metadata.common?.picture && metadata.common.picture.length > 0) {
      const pic = metadata.common.picture[0];
      const fmt = pic.format || 'image/jpeg';
      const imgMime = fmt.startsWith('image/') ? fmt : `image/${fmt}`;
      const pictureData = new Uint8Array(pic.data);
      imageUrl = URL.createObjectURL(new Blob([pictureData], { type: imgMime }));
    }

    return { metadata, imageUrl };
  } catch (err) {
    console.error('Error parsing metadata from Blob:', err);
    return { metadata: null, imageUrl: null };
  }
}
