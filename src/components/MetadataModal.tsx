import React from 'react';
import { Modal } from "@heroui/react";
import { usePlayer } from '../context/player';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MetadataModal: React.FC<MetadataModalProps> = ({ isOpen, onClose }) => {
  const { track } = usePlayer();

  return (
    <Modal.Root isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop variant="blur" isDismissable={true}>
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog className="bg-surface border border-outline-variant/30 rounded-3xl shadow-2xl overflow-hidden mx-2 sm:mx-4">
          <Modal.Header className="flex items-center justify-between border-b border-outline-variant/20 bg-surface/80 p-6 backdrop-blur-md">
            <Modal.Heading className="font-title-lg text-title-lg font-bold text-on-surface">Track Metadata</Modal.Heading>
            <button 
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </Modal.Header>

          <Modal.Body className="p-6 text-on-surface max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-6 pb-6">
              {/* Always show track header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                 <img 
                   src={track.image || 'https://placehold.co/300x300/1e1b4b/white?text=Track'} 
                   alt="Album Art" 
                   className="h-32 w-32 shrink-0 rounded-xl object-cover shadow-md"
                   onError={(e) => {
                     e.currentTarget.src = 'https://placehold.co/300x300/1e1b4b/white?text=Track';
                   }}
                 />
                 <div>
                    <h3 className="text-xl font-bold">{track.title}</h3>
                    <p className="text-on-surface-variant mt-1">{track.artist}</p>
                    {track.album && <p className="text-on-surface-variant text-sm mt-2">Album: {track.album}</p>}
                    {track.duration && <p className="text-on-surface-variant text-xs mt-1">Duration: {track.duration}</p>}
                 </div>
              </div>

              {/* Format Information (Dynamic or Fallback) */}
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold uppercase tracking-wider text-primary text-sm">Format Information</h4>
                  {!track.rawMetadata && (
                    <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-medium">
                      Estimated
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant text-xs">Container</span>
                    <span className="font-mono">
                      {track.rawMetadata?.format?.container || 
                       (track.audioUrl?.split('.').pop()?.toUpperCase() || 'Unknown')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant text-xs">Codec</span>
                    <span className="font-mono">
                      {track.rawMetadata?.format?.codec || 
                       (track.audioUrl?.split('.').pop()?.toUpperCase() || 'Unknown')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant text-xs">Sample Rate</span>
                    <span className="font-mono">
                      {track.rawMetadata?.format?.sampleRate 
                        ? `${track.rawMetadata.format.sampleRate} Hz` 
                        : '44100 Hz (Standard)'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant text-xs">Bitrate</span>
                    <span className="font-mono">
                      {track.rawMetadata?.format?.bitrate 
                        ? `${Math.round(track.rawMetadata.format.bitrate / 1000)} kbps` 
                        : (track.audioUrl?.toLowerCase().endsWith('.flac') ? 'Lossless' : '320 kbps (Est.)')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant text-xs">Channels</span>
                    <span className="font-mono">
                      {track.rawMetadata?.format?.numberOfChannels || '2 (Stereo)'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant text-xs">Lossless</span>
                    <span className="font-mono">
                      {track.rawMetadata?.format?.lossless !== undefined
                        ? (track.rawMetadata.format.lossless ? 'Yes' : 'No')
                        : (track.audioUrl?.toLowerCase().endsWith('.flac') ? 'Yes' : 'No')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Raw Tags (Only if available) */}
              {track.rawMetadata ? (
                <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
                  <h4 className="mb-4 font-bold uppercase tracking-wider text-primary text-sm">Raw Tags Data</h4>
                  <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-lg bg-[#1e1e1e] p-4 font-mono text-xs text-[#d4d4d4]">
                    {JSON.stringify(track.rawMetadata, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-on-surface-variant/60 italic border border-dashed border-outline-variant/30 rounded-xl bg-surface-container-lowest">
                  Extended media tags not loaded yet. Playing directly from source stream.
                </div>
              )}
            </div>
          </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
};

export default MetadataModal;
