// ArmSlotManager.js
import { SlotManager } from "./SlotManager";

export class HairSlotManager extends SlotManager {
  constructor(spineManager, name, slotPath) {
    super(spineManager, name);

    this.slotPath = slotPath;
    this.hairColor = "01";
  }

  belongsToSlot(partPath) {
    return partPath.includes(this.slotPath);
  }

  setHairColor(tone) {
    console.log("setting hair color");
    this.hairColor = tone;

    // If we have a current part, update it to match the new skin tone
    if (this.currentPart) {
      // Find a matching part with the new skin tone
      const basePart = this.currentPart.split("color-")[0];
      const newPart = this.availableParts.find(
        (part) => part.startsWith(basePart) && part.includes(`color-${tone}`)
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
    if (partPath.includes("color-")) {
      const basePart = partPath.split("color-")[0];
      const matchingPart = this.availableParts.find(
        (part) =>
          part.startsWith(basePart) && part.includes(`color-${this.hairColor}`)
      );
      console.log("matchingPart", matchingPart);
      if (matchingPart) {
        this.currentPart = matchingPart;
        return true;
      }
    }

    return false;
  }
}
