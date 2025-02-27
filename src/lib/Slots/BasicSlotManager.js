// ArmSlotManager.js
import { SlotManager } from "./SlotManager";

export class BasicSlotManager extends SlotManager {
  constructor(spineManager, name, slotPath) {
    super(spineManager, name);
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
