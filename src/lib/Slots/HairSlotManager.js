// ArmSlotManager.js
import { SlotManager } from "./SlotManager";

export class HairSlotManager extends SlotManager {
  constructor(spineManager, name, slotPath) {
    super(spineManager, name);

    this.slotPath = slotPath;
    this.hairColor = "01";
    this.hasHat = false;
  }

  belongsToSlot(partPath) {
    return partPath.includes(this.slotPath);
  }

  setHairColor(tone) {
    console.log("setting hair color");
    this.hairColor = tone;

    // If we have a current part, update it to match the new skin tone
    if (this.currentPart) {
      this.updateHairPart(this.currentPart);
    }
  }

  setHatStatus(hasHat) {
    this.hasHat = hasHat;
    if (this.currentPart) {
      this.updateHairPart(this.currentPart);
    }
  }

  // Helper to get the base hair style from a part path
  getBaseHairStyle(partPath) {
    // Extract the hairstyle number (e.g., "hairstyle-02" from the path)
    const match = partPath.match(/hairstyle-(\d+)/);
    return match ? match[0] : null;
  }

  // Find matching hair part considering hat status and color
  findMatchingHairPart(baseStyle) {
    const hatSuffix = this.hasHat ? "-hat" : "";
    return this.availableParts.find(
      (part) =>
        part.includes(baseStyle) &&
        part.includes(`color-${this.hairColor}`) &&
        part.includes(hatSuffix)
    );
  }

  updateHairPart(partPath) {
    const baseStyle = this.getBaseHairStyle(partPath);
    if (!baseStyle) return false;

    const matchingPart = this.findMatchingHairPart(baseStyle);
    if (matchingPart) {
      this.currentPart = matchingPart;
      return true;
    }
    return false;
  }

  // Override to handle prosthetic arms which don't need skin tone
  selectPart(partPath) {
    if (!this.availableParts.includes(partPath)) {
      console.warn(
        `Part ${partPath} is not available for slot ${this.slotName}`
      );
      return false;
    }

    return this.updateHairPart(partPath);
  }
}
