const fs = require('fs');
const path = require('path');

const source = "C:\\Users\\mcnas\\.gemini\\antigravity\\brain\\8f67adee-f392-4e0e-8adf-5f2c7df76eb0\\hero_bg_1766321048683.png";
const destination = "d:\\My Web Projects\\XclusvxmotionPictures\\frontend\\src\\assets\\hero_bg.jpg";

try {
    fs.copyFileSync(source, destination);
    console.log('Successfully copied file');
} catch (err) {
    console.error('Error copying file:', err);
    process.exit(1);
}
