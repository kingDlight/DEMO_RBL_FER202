import * as fs from 'fs';
import * as mm from 'music-metadata'; // music-metadata is the node version, which works similarly

async function run() {
  try {
    const filePath = 'c:/FPT/FER202/MusicApp/DEMO_RBL_FER202_TMP/public/music/Bad Guy-John Michael Howell ZVC.flac';
    
    if (!fs.existsSync(filePath)) {
      console.log('File does not exist. Please provide a valid file path.');
      return;
    }

    const metadata = await mm.parseFile(filePath);
    if (metadata.common.picture && metadata.common.picture.length > 0) {
      console.log('Picture found! Format:', metadata.common.picture[0].format);
      console.log(JSON.stringify(metadata, null, 2));
    } else {
      console.log('No picture found.');
    }
  } catch (e) {
    console.error('Error reading metadata:', e.message);
  }
}
run();
