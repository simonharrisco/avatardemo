// SlotManager.js
export class SlotManager {
  constructor(spineManager, name) {
    this.spineManager = spineManager;
    this.slotName = name;
    this.currentPart = null;
    this.availableParts = [];
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
    const randomIndex = Math.floor(Math.random() * this.availableParts.length);
    this.currentPart = this.availableParts[randomIndex];
  }

  getCurrentPart() {
    return this.currentPart;
  }

  getAvailableParts() {
    return [...this.availableParts];
  }

  clear() {
    this.currentPart = null;
  }
}
