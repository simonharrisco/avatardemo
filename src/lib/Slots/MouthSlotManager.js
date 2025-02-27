// ArmSlotManager.js
import { SlotManager } from "./SlotManager";

export class HatSlotManager extends SlotManager {
  constructor(spineManager, name) {
    super(spineManager, name);
  }

  belongsToSlot(partPath) {
    return partPath.includes(`character/clothing/hats/`);
  }
}
