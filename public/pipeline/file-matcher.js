import { names } from "./spine-names.js";
import fs from "fs/promises";
import path from "path";

async function createSpineNameMapping() {
  try {
    // Create an empty map to store our mappings
    const spineNameMap = {};

    const assetsPath = "./public/pipeline/assets";

    // Get all files in the assets directory
    const files = await fs.readdir(assetsPath);

    // Process each spine name
    for (const spineName of names) {
      // Replace all forward slashes with hyphens
      const normalizedName = spineName.replace(/\//g, "-");

      // Find matching file in assets directory
      const matchingFile = files.find((file) =>
        file.toLowerCase().includes(normalizedName.toLowerCase())
      );

      if (matchingFile) {
        spineNameMap[spineName] = matchingFile;
      } else {
        console.warn(`No matching file found for spine name: ${spineName}`);
      }
    }

    // Create the JavaScript content with the exported object
    const jsContent = `// Generated spine name mapping
export const spineNameMap = ${JSON.stringify(spineNameMap, null, 2)};
`;

    // Write the mapping to a JavaScript file
    await fs.writeFile("./src/constants/spine-mapping.js", jsContent, "utf8");

    console.log("Mapping complete! Check spine-mapping.js");
    return spineNameMap;
  } catch (error) {
    console.error("Error processing spine names:", error);
    throw error;
  }
}

// Execute the function
createSpineNameMapping();
