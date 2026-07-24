import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/player';

const AudioVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, analyserNode } = usePlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // 64 frequency bands
    const numBands = 64;
    const dataArray = new Uint8Array(numBands);
    const bands = new Array(numBands).fill(0);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying && analyserNode) {
        analyserNode.getByteFrequencyData(dataArray);
        for (let i = 0; i < numBands; i++) {
          // dataArray contains values 0-255
          const normalized = dataArray[i] / 255;
          bands[i] += (normalized - bands[i]) * 0.2; // smooth interpolation
        }
      } else {
        // Smoothly decay to flat line
        for (let i = 0; i < numBands; i++) {
          bands[i] *= 0.92;
        }
      }

      const centerY = canvas.height / 2;
      const barWidth = (canvas.width / numBands) * 0.7;
      const spacing = (canvas.width / numBands) * 0.3;

      ctx.save();
      
      // Glowing neon effect
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#22c55e'; // Auralis primary green
      ctx.fillStyle = '#22c55e';
      ctx.globalAlpha = 0.6;

      for (let i = 0; i < numBands; i++) {
        // Scale height relative to screen height
        const height = Math.max(2, bands[i] * (canvas.height * 0.4));
        const x = i * (barWidth + spacing) + spacing / 2;

        // Draw top bar with rounded caps
        ctx.beginPath();
        ctx.roundRect(x, centerY - height, barWidth, height, 4);
        ctx.fill();
        
        // Draw bottom bar (mirrored)
        ctx.beginPath();
        ctx.roundRect(x, centerY, barWidth, height, 4);
        ctx.fill();
      }
      
      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, analyserNode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 h-full w-full pointer-events-none mix-blend-screen"
    />
  );
};

export default AudioVisualizer;
