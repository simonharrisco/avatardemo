// ArmSlotManager.js
import { SlotManager } from "./SlotManager";

export class EyebrowSlotManager extends SlotManager {
  constructor(spineManager, name, slotPath) {
    super(spineManager, name);

    this.slotPath = slotPath;
    this.hairColor = "01";
  }

  belongsToSlot(partPath) {
    return partPath.includes(this.slotPath);
  }

  setHairColor(tone) {
    this.hairColor = tone;

    // If we have a current part, update it to match the new skin tone
    if (this.currentPart) {
      // Find a matching part with the new skin tone
      const basePart = this.currentPart.split("skintone-")[0];
      const newPart = this.availableParts.find(
        (part) => part.startsWith(basePart) && part.includes(`skintone-${tone}`)
      );

      if (newPart) {
        this.currentPart = newPart;
      }
    }
  }

  selectPart(partPath) {
    if (!this.availableParts.includes(partPath)) {
      console.warn(
        `Part ${partPath} is not available for slot ${this.slotName}`
      );
      return false;
    }

    // For regular arms, make sure we use the correct skin tone
    if (partPath.includes("skintone-")) {
      const basePart = partPath.split("skintone-")[0];
      const matchingPart = this.availableParts.find(
        (part) =>
          part.startsWith(basePart) &&
          part.includes(`skintone-${this.hairColor}`)
      );

      if (matchingPart) {
        this.currentPart = matchingPart;
        return true;
      }
    }
    console.log("didnt find matching eyebrow");

    return false;
  }
}
