import * as fs from "fs";
import Psd from "@webtoon/psd";
import sharp from "sharp";
import path from "path";

async function exportPsdLayers(psdPath, outputDir = "./output") {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Clear output directory if it contains any files
  clearDirectory(outputDir);

  // Read and parse PSD file
  const psdData = fs.readFileSync(psdPath);
  const psdFile = Psd.parse(psdData.buffer);

  console.log(`Total layers found: ${psdFile.layers.length}`);

  // Fixed output dimensions
  const OUTPUT_WIDTH = 400;
  const OUTPUT_HEIGHT = 400;
  const BUFFER = 40;

  // Process each layer
  for (let i = 0; i < psdFile.layers.length; i++) {
    const layer = psdFile.layers[i];

    console.log(`Processing layer ${i}: "${layer.name}"`);

    try {
      // Get composited layer data
      const layerPixelData = await layer.composite();

      // Skip if layer has no dimensions or data
      if (!layerPixelData || layer.width === 0 || layer.height === 0) {
        console.log(`Skipping layer ${i}: No valid data`);
        continue;
      }

      // Generate safe filename from layer name
      const safeName = layer.name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const outputPath = path.join(outputDir, `${safeName}_layer_${i}`);

      // Calculate scaling to fit within buffer zone while maintaining aspect ratio
      const maxWidth = OUTPUT_WIDTH - 2 * BUFFER;
      const maxHeight = OUTPUT_HEIGHT - 2 * BUFFER;
      const scaleWidth = maxWidth / layer.width;
      const scaleHeight = maxHeight / layer.height;
      const scale = Math.min(scaleWidth, scaleHeight);

      // Calculate new dimensions after scaling
      const scaledWidth = Math.round(layer.width * scale);
      const scaledHeight = Math.round(layer.height * scale);

      // Calculate position to center the image
      const left = Math.round((OUTPUT_WIDTH - scaledWidth) / 2);
      const top = Math.round((OUTPUT_HEIGHT - scaledHeight) / 2);

      // Use Sharp to process and save the image
      await sharp(layerPixelData, {
        raw: {
          width: layer.width,
          height: layer.height,
          channels: 4,
        },
      })
        .resize(scaledWidth, scaledHeight, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .extend({
          top: top,
          bottom: OUTPUT_HEIGHT - (top + scaledHeight),
          left: left,
          right: OUTPUT_WIDTH - (left + scaledWidth),
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(`${outputPath}.png`);

      console.log(`Successfully exported layer ${i} to ${outputPath}`);
    } catch (err) {
      console.error(`Error processing layer "${layer.name}":`, err);
    }
  }
}

function clearDirectory(outputFolder) {
  // Check if directory exists
  if (!fs.existsSync(outputFolder)) {
    console.log(`Directory ${outputFolder} does not exist`);
    return;
  }

  // Read directory contents
  const files = fs.readdirSync(outputFolder);

  // Remove each file
  for (const file of files) {
    const filePath = path.join(outputFolder, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  }
}

exportPsdLayers("./data/test_no_hidden.psd");
