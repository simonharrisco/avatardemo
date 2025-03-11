// ArmSlotManager.js
import { SlotManager } from "./SlotManager";

export class BasicSlotManager extends SlotManager {
  constructor(spineManager, name, slotPath, canBeEmpty = false) {
    super(spineManager, name, canBeEmpty);
    this.slotPath = slotPath;
  }

  belongsToSlot(partPath) {
    if (typeof this.slotPath === "string") {
      return partPath.includes(this.slotPath);
    }
    if (Array.isArray(this.slotPath)) {
      return this.slotPath.some((path) => partPath.includes(path));
    }
  }
}
