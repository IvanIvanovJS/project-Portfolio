const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateOgImage() {
  try {
    const inputPath = path.join(
      __dirname,
      '../public/images/optimized/Portfolio-Home.png'
    );
    const outputPath = path.join(__dirname, '../public/images/og-image.jpg');

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('❌ Input image not found:', inputPath);
      process.exit(1);
    }

    console.log('🎨 Generating OG image...');
    console.log('📁 Input:', inputPath);
    console.log('📁 Output:', outputPath);

    // Load and process the image
    await sharp(inputPath)
      .resize(1200, 630, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({
        quality: 90,
        progressive: true,
      })
      .toFile(outputPath);

    // Get file size
    const stats = fs.statSync(outputPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log('✅ OG image generated successfully!');
    console.log(`📊 Size: ${fileSizeKB} KB`);
    console.log(`📐 Dimensions: 1200x630px`);
    console.log(`📍 Location: public/images/og-image.jpg`);
  } catch (error) {
    console.error('❌ Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOgImage();
