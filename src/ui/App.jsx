/*  eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import { pixiManager } from "../lib/PixiManager.js";
import { CategoryItem } from "../components/CategoryItem";
import { OptionsGrid } from "../components/OptionsGrid";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("skinTone");
  const [currentParts, setCurrentParts] = useState({});
  const [currentSkinTone, setCurrentSkinTone] = useState("01");
  const [currentHairColor, setCurrentHairColor] = useState("01");
  const [hasHat, setHasHat] = useState(false);

  // Get all available categories
  const categories = [
    "skinTone",
    "hairColor",
    ...Object.keys(pixiManager.characterManager.slotManagers).filter(
      (category) =>
        !["armL", "armR", "legL", "legR", "eyeShadow", "neck"].includes(
          category
        )
    ),
  ];

  // Special handlers for specific categories
  const handleSpecialCategories = (category, value) => {
    switch (category) {
      case "head":
        // For head parts that include skin tone
        const skinTone = value.match(/skintone-(\d+)/)?.[1];
        if (skinTone) {
          setCurrentSkinTone(skinTone);
          pixiManager.characterManager.setSkinTone(skinTone);
        }
        break;
      case "hair":
        // Extract hair color from the path
        const hairColor = value.match(/color-(\d+)/)?.[1];
        if (hairColor) {
          setCurrentHairColor(hairColor);
          pixiManager.characterManager.setHairColor(hairColor);
        }
        break;
      case "eyes":
        // set correct eye shadow
        const eyeShape = value.replace(
          "character/head/eyes-base/eyes-base-",
          ""
        );
        pixiManager.characterManager.setEyeShape(eyeShape);
        break;
      case "hat":
        // Update hat status
        setHasHat(!!value);
        break;
      default:
        break;
    }
  };

  // Filter parts based on current settings
  const filterPartsByCurrentSettings = (parts, category) => {
    return parts.filter((part) => {
      const partPath = part.id;

      // Filter head parts by current skin tone
      if (category === "head" || category === "nose") {
        return partPath.includes(`skintone-${currentSkinTone}`);
      }

      // Filter hair by current hair color and hat status
      if (category === "hair") {
        const matchesColor = partPath.includes(`color-${currentHairColor}`);
        const isHatVersion = partPath.includes("-hat-");
        return matchesColor && hasHat === isHatVersion;
      }

      // Filter eyebrows by current skin tone and hair color
      if (category === "eyebrows") {
        return (
          partPath.includes(`skintone-${currentSkinTone}`) &&
          (partPath.includes(`color-${currentHairColor}`) ||
            !partPath.includes("color-"))
        );
      }

      // For other categories, show all options
      return true;
    });
  };

  // Get options for special categories
  const getSpecialOptions = (category) => {
    switch (category) {
      case "skinTone":
        return Array.from({ length: 8 }, (_, i) => ({
          id: (i + 1).toString().padStart(2, "0"),
          name: `Skin ${i + 1}`,
        }));
      case "hairColor":
        return Array.from({ length: 16 }, (_, i) => ({
          id: (i + 1).toString().padStart(2, "0"),
          name: `Color ${i + 1}`,
        }));
      default:
        return [];
    }
  };

  // Get parts for selected category
  const getOptionsForCategory = (category) => {
    if (!category) return [];

    // Handle special categories
    if (category === "skinTone" || category === "hairColor") {
      return getSpecialOptions(category);
    }

    const parts =
      pixiManager.characterManager.getAvailablePartsForSlot(category);
    const mappedParts = parts.map((part) => ({
      id: part,
      name: part
        .split("/")
        .pop()
        .replace(/-/g, " ")
        .replace(`skintone ${currentSkinTone}`, "")
        .replace(`color ${currentHairColor}`, "")
        .replace("hat ", "")
        .trim(),
    }));

    // Filter parts based on current settings
    return filterPartsByCurrentSettings(mappedParts, category);
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  // Handle option selection
  const handleOptionClick = (partPath, category) => {
    if (!selectedCategory) return;

    // Handle special categories
    if (category === "skinTone") {
      setCurrentSkinTone(partPath);
      pixiManager.characterManager.setSkinTone(partPath);
      return;
    }
    if (category === "hairColor") {
      setCurrentHairColor(partPath);
      pixiManager.characterManager.setHairColor(partPath);
      return;
    }

    if (partPath === "") {
      pixiManager.characterManager.clearSlot(selectedCategory);
    } else {
      // Handle special categories first
      handleSpecialCategories(selectedCategory, partPath);
      // Then select the part
      pixiManager.characterManager.selectPart(partPath);
    }

    // Update current parts after selection
    const newParts = pixiManager.characterManager.getCurrentParts();
    setCurrentParts(newParts);
  };

  // Get current parts and settings on mount and after any changes
  useEffect(() => {
    const updateCurrentState = () => {
      const parts = pixiManager.characterManager.getCurrentParts();
      setCurrentParts(parts);

      // Try to extract current skin tone from head part
      const headPart = parts.head;
      if (headPart) {
        const skinTone = headPart.match(/skintone-(\d+)/)?.[1];
        if (skinTone) {
          setCurrentSkinTone(skinTone);
        }
      }

      // Try to extract current hair color from hair part
      const hairPart = parts.hair;
      if (hairPart) {
        const hairColor = hairPart.match(/color-(\d+)/)?.[1];
        if (hairColor) {
          setCurrentHairColor(hairColor);
        }
      }

      // Update hat status
      setHasHat(!!parts.hat);
    };

    // Initial update
    updateCurrentState();

    // Set up an interval to check for updates
    const intervalId = setInterval(updateCurrentState, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="sidebar">
      <div className="options-column">
        {selectedCategory && (
          <OptionsGrid
            selectedCategory={selectedCategory}
            currentParts={currentParts}
            currentSkinTone={currentSkinTone}
            currentHairColor={currentHairColor}
            options={getOptionsForCategory(selectedCategory)}
            onOptionClick={handleOptionClick}
            canBeEmpty={
              selectedCategory !== "skinTone" &&
              selectedCategory !== "hairColor" &&
              pixiManager.characterManager.slotManagers[selectedCategory]?.getCanBeEmpty()
            }
          />
        )}
      </div>
      <div className="categories-column">
        {categories.map((category) => (
          <CategoryItem
            key={category}
            category={category}
            isActive={selectedCategory === category}
            currentParts={currentParts}
            currentHairColor={currentHairColor}
            onClick={() => handleCategoryClick(category)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
