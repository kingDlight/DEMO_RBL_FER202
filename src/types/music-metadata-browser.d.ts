declare module 'music-metadata-browser' {
  export function fetchFromUrl(url: string, options?: any): Promise<any>;
  export function parseBuffer(buffer: Uint8Array, mimeType?: string, options?: any): Promise<any>;
  export function parseBlob(blob: Blob, options?: any): Promise<any>;
}
