import { spineNameMap } from "../constants/spine-mapping.js";
import { pixiManager } from "../lib/PixiManager.js";

export function OptionItem({ option, isActive, selectedCategory, currentHairColor, onClick, currentParts }) {
  const renderHairColorPreview = () => {
    // Get hair from currentParts or fall back to pixiManager's current state
    const currentHair = currentParts?.hair || pixiManager.characterManager.getCurrentParts().hair;

    // Extract the hairstyle number and whether it has a hat
    const matches = currentHair.match(/hairstyle-(\d+)(-hat)?/);
    if (!matches) return null;

    const [_, styleNum, hasHat] = matches;
    
    // Use the hair slot manager's path
    const hairSlotManager = pixiManager.characterManager.slotManagers.hair;
    const availableHairParts = hairSlotManager.availableParts;
    
    // Find the matching hair part with the desired color
    const matchingHair = availableHairParts.find(part => 
      part.includes(`hairstyle-${styleNum}${hasHat || ''}`) && 
      part.includes(`color-${option.id}`)
    );

    if (!matchingHair) return null;

    return (
      <div
        style={{
          backgroundImage: `url(pipeline/assets/${spineNameMap[matchingHair]})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
        }}
      ></div>
    );
  };

  const renderSkinTonePreview = () => {
    // Get current head from currentParts or fall back to pixiManager's current state
    const currentHead = currentParts?.head || pixiManager.characterManager.getCurrentParts().head;
    if (!currentHead) return null;

    // Extract the head style number (everything before skintone-XX)
    const baseHead = currentHead.split("skintone-")[0];
    
    // Use the head slot manager to find the matching head with the desired skin tone
    const headSlotManager = pixiManager.characterManager.slotManagers.head;
    const availableHeads = headSlotManager.availableParts;
    
    // Find the matching head part with the desired skin tone
    const matchingHead = availableHeads.find(part => 
      part.startsWith(baseHead) && 
      part.includes(`skintone-${option.id}`)
    );

    if (!matchingHead) return null;
     
    return (
      <div
        style={{
          backgroundImage: `url(pipeline/assets/${spineNameMap[matchingHead]})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
        }}
      ></div>
    );
  };

  const renderContent = () => {
    if (option.id === "") {
      return "None";
    }

    if (selectedCategory === "hairColor") {
      return renderHairColorPreview();
    }

    if( selectedCategory === "skinTone") {
      return renderSkinTonePreview();
    }

    return (
      <div
        style={{
          backgroundImage: `url(pipeline/assets/${
            spineNameMap[
              selectedCategory === "eyebrows"
                ? option.id.replace(
                    /skintone-\d+/,
                    `skintone-${currentHairColor}`
                  )
                : option.id
            ]
          })`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          width: "100%",
          height: "100%",
        }}
      ></div>
    );
  };

  return (
    <div
      className={`option-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {renderContent()}
    </div>
  );
} 