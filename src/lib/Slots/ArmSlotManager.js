// ArmSlotManager.js
import { SlotManager } from "./SlotManager";

export class ArmSlotManager extends SlotManager {
  constructor(spineManager, side = "L") {
    super(spineManager, `arm${side}`);
    this.side = side;
    this.skinTone = "01";
  }

  belongsToSlot(partPath) {
    return partPath.includes(`character/body/arm-${this.side}/`);
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
    console.log(`ArmSlotManager (${this.side}) selecting part:`, partPath);
    if (!this.availableParts.includes(partPath)) {
      console.warn(
        `Part ${partPath} is not available for slot ${this.slotName}. Available parts:`,
        this.availableParts
      );
      return false;
    }

    // If selecting a prosthetic, just use it directly
    if (partPath.includes("prosthetic")) {
      console.log(`ArmSlotManager (${this.side}) setting prosthetic:`, partPath);
      this.currentPart = partPath;
      return true;
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
        console.log(`ArmSlotManager (${this.side}) setting normal arm:`, matchingPart);
        this.currentPart = matchingPart;
        return true;
      }
    }

    return false;
  }
}
