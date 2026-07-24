import React from 'react';
import { Modal } from "@heroui/react";
import { usePlayer } from '../context/player';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FREQUENCIES = ['32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];

const PRESETS: Record<string, number[]> = {
  'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Bass Boost': [6, 5, 4, 1, 0, 0, 0, 0, 0, 0],
  'Acoustic': [4, 4, 3, 1, 2, 2, 3, 4, 3, 2],
  'Electronic': [4, 3, 1, -2, -3, 0, 1, 3, 4, 5],
  'Pop': [-1, 1, 3, 4, 3, 1, -1, -2, -1, -1],
  'Rock': [4, 3, -1, -3, -1, 1, 3, 4, 4, 4],
};

const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose }) => {
  const { eqBands, setEQBand, eqPreset, setEQPreset, isEQEnabled, setIsEQEnabled } = usePlayer();

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    setEQPreset(presetName);
    const presetVals = PRESETS[presetName];
    if (presetVals) {
      presetVals.forEach((val, i) => setEQBand(i, val));
    }
  };

  return (
    <Modal.Root isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop variant="blur" isDismissable={true}>
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog className="bg-surface-container-high/90 backdrop-blur-xl border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden mx-2 sm:mx-4">
          <Modal.Header className="flex items-center justify-between border-b border-outline-variant/20 p-6">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-3xl text-primary">graphic_eq</span>
              <Modal.Heading className="font-headline-md text-headline-md font-bold text-on-surface">10-Band Equalizer</Modal.Heading>
            </div>
            <button 
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
          </Modal.Header>
          
          <Modal.Body className="p-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-md">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isEQEnabled}
                    onChange={(e) => setIsEQEnabled(e.target.checked)}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-surface-variant after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                  <span className="ml-3 font-label-md text-label-md text-on-surface">Enable EQ</span>
                </label>
              </div>

              <div className="flex items-center gap-sm">
                <span className="font-label-md text-label-md text-on-surface-variant">Preset:</span>
                <select
                  value={eqPreset}
                  onChange={handlePresetChange}
                  className="rounded-lg border border-outline-variant/30 bg-surface px-md py-sm font-body-md text-body-md text-on-surface outline-none transition-colors focus:border-primary w-full sm:w-auto"
                  disabled={!isEQEnabled}
                >
                  {Object.keys(PRESETS).map(preset => (
                    <option key={preset} value={preset}>{preset}</option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>
              </div>
            </div>

            <div className={`flex w-full justify-between gap-1 overflow-x-auto pb-4 ${!isEQEnabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
              {eqBands.map((val, index) => (
                <div key={index} className="flex flex-col items-center gap-2 min-w-[28px]">
                  <span className="text-xs text-on-surface-variant text-center w-full">{val > 0 ? `+${val}` : val}</span>
                  <div className="relative flex h-48 sm:h-56 w-8 justify-center rounded-full bg-surface-variant/30 shrink-0">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={val}
                      disabled={!isEQEnabled}
                      onChange={(e) => {
                        setEQPreset('Custom');
                        setEQBand(index, parseInt(e.target.value, 10));
                      }}
                      className="absolute top-1/2 h-2 w-48 sm:w-56 -translate-y-1/2 -rotate-90 appearance-none rounded-full bg-transparent outline-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
                    />
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant text-center w-full">{FREQUENCIES[index]}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center text-xs text-on-surface-variant/70">
              Changes apply in real-time. Frequencies above 0 boost the volume of that band.
            </div>
          </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
};

export default EqualizerModal;
