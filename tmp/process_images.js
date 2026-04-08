const fs = require('fs');
const path = require('path');

const srcDir = 'f:\\Coding\\AeroDrone\\public\\AeroDrone image sequence';
const destDir = 'f:\\Coding\\AeroDrone\\public\\assets\\drone-sequence';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Get all files and sort them numerically
const files = fs.readdirSync(srcDir)
  .filter(file => file.endsWith('.png'))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  });

console.log(`Found ${files.length} files in source.`);

// Take every 2nd frame to get 120 from 240
const selectedFiles = files.filter((_, index) => index % 2 === 0).slice(0, 120);

console.log(`Selected ${selectedFiles.length} files for processing.`);

selectedFiles.forEach((file, index) => {
  const frameNumber = (index + 1).toString().padStart(3, '0');
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, `drone-frame-${frameNumber}.png`);
  
  fs.copyFileSync(srcPath, destPath);
  if (index % 20 === 0) console.log(`Processed ${index + 1}/120...`);
});

console.log('Finished processing image sequence.');
