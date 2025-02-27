// ArmSlotManager.js
import { SlotManager } from "./SlotManager";

export class EyeShadowSlotManager extends SlotManager {
  constructor(spineManager, name) {
    super(spineManager, name);

    this.skinTone = "01";
    this.eyeShape = "01";
  }

  belongsToSlot(partPath) {
    return partPath.includes("eyes-shadow");
  }

  setSkinTone(tone) {
    this.skinTone = tone;

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

  // Override to handle prosthetic arms which don't need skin tone
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
          part.includes(`skintone-${this.skinTone}`)
      );

      if (matchingPart) {
        this.currentPart = matchingPart;
        return true;
      }
    }

    return false;
  }
}
