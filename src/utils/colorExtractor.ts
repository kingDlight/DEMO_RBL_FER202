export const getAverageColor = (imgUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('#7c3aed'); // default primary color
        return;
      }
      
      canvas.width = 1;
      canvas.height = 1;
      ctx.drawImage(img, 0, 0, 1, 1);
      
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      
      // Ensure the color is not too dark or too light for UI
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      let finalR = r;
      let finalG = g;
      let finalB = b;
      
      if (luminance < 0.2) {
        finalR = Math.min(255, r + 50);
        finalG = Math.min(255, g + 50);
        finalB = Math.min(255, b + 50);
      } else if (luminance > 0.8) {
        finalR = Math.max(0, r - 50);
        finalG = Math.max(0, g - 50);
        finalB = Math.max(0, b - 50);
      }
      
      resolve(`rgb(${finalR}, ${finalG}, ${finalB})`);
    };
    
    img.onerror = () => {
      resolve('#7c3aed'); // default primary color
    };
    
    img.src = imgUrl;
  });
};
