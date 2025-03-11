// SlotManager.js
export class SlotManager {
  constructor(spineManager, name, canBeEmpty = false) {
    this.spineManager = spineManager;
    this.slotName = name;
    this.currentPart = null;
    this.availableParts = [];
    this.canBeEmpty = canBeEmpty;
  }

  initialize(partsList) {
    // Filter parts that belong to this slot
    this.availableParts = partsList.filter((part) => this.belongsToSlot(part));
    // console.log("Available parts for slot", this.slotName, this.availableParts);
  }

  // eslint-disable-next-line no-unused-vars
  belongsToSlot(partPath) {
    // Override in subclasses to determine which parts belong to this slot
    return false;
  }

  selectPart(partPath) {
    if (!this.availableParts.includes(partPath)) {
      console.warn(
        `Part ${partPath} is not available for slot ${this.slotName}`
      );
      return false;
    }

    this.currentPart = partPath;
    return true;
  }

  setRamdomPart() {
    // If slot can be empty, 30% chance to clear it
    if (this.canBeEmpty && Math.random() < 0.3) {
      this.clear();
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.availableParts.length);
    this.currentPart = this.availableParts[randomIndex];
  }

  getCurrentPart() {
    return this.currentPart;
  }

  getAvailableParts() {
    return [...this.availableParts];
  }

  getCanBeEmpty() {
    return this.canBeEmpty;
  }

  clear() {
    if (this.canBeEmpty) {
      this.currentPart = null;
    } else {
      console.warn(`Slot ${this.slotName} cannot be empty`);
    }
  }
}
