import { Skin } from "@esotericsoftware/spine-pixi-v8";
import { ArmSlotManager } from "./Slots/ArmSlotManager";
import { LegSlotManager } from "./Slots/LegSlotManager";
import { HeadSlotManager } from "./Slots/HeadSlotManager";
import { NoseSlotManager } from "./Slots/NoseSlotManager";
import { BasicSlotManager } from "./Slots/BasicSlotManager";
import { NeckSlotManager } from "./Slots/NeckSlotManager";
import { EyeShadowSlotManager } from "./Slots/EyeShadowSlotManager";
import { HairSlotManager } from "./Slots/HairSlotManager";
import { EyebrowSlotManager } from "./Slots/EyebrowSlotManager";

export class CharacterManager {
  constructor(spineManager, animationManager) {
    this.spineManager = spineManager;
    this.animationManager = animationManager;

    // Create all slot managers
    this.slotManagers = {
      // skin tone managers (cannot be empty)
      armL: new ArmSlotManager(spineManager, "L"),
      armR: new ArmSlotManager(spineManager, "R"),
      legL: new LegSlotManager(spineManager, "L"),
      legR: new LegSlotManager(spineManager, "R"),
      head: new HeadSlotManager(spineManager, "head"),
      nose: new NoseSlotManager(spineManager, "nose"),
      neck: new NeckSlotManager(spineManager, "neck"),
      pupils: new BasicSlotManager(
        spineManager,
        "pupils",
        "character/head/eyes-pupils"
      ),
      mouth: new BasicSlotManager(
        spineManager,
        "mouth",
        "character/head/mouth"
      ),
      // its own thing
      eyes: new BasicSlotManager(
        spineManager,
        "eyes",
        "character/head/eyes-base/"
      ),
      // this need to modify on BOTH eye shape AND skin tone
      eyeShadow: new EyeShadowSlotManager(spineManager, "eyeShadow"),
      // these require hair color
      eyebrows: new EyebrowSlotManager(spineManager, "eyebrows", "eyebrows"),
      hair: new HairSlotManager(spineManager, "hair", "character/head/hair/"),
      // other accessories (can be empty)
      back: new BasicSlotManager(
        spineManager,
        "back",
        ["cape", "back-accessories"],
        true
      ),
      bottoms: new BasicSlotManager(
        spineManager,
        "bottoms",
        ["skirt", "short"],
        false
      ),
      face: new BasicSlotManager(spineManager, "face", "glasses", true),
      hat: new BasicSlotManager(
        spineManager,
        "hat",
        "character/clothing/hats",
        true
      ),
      shirt: new BasicSlotManager(
        spineManager,
        "shirt",
        "character/clothing/shirts",
        false
      ),
      shoes: new BasicSlotManager(
        spineManager,
        "shoes",
        "character/clothing/shoes",
        true
      ),
    };

    // Global attributes
    this.skinTone = "01";
    this.hairColor = "01";
    this.eyeColor = "01";
    
    // Accessibility state
    this.prosthetics = {
      armL: false,
      armR: false,
      legL: false,
      legR: false
    };
  }

  initialize(partsList) {
    partsList = this.spineManager.spine.skeleton.data.skins.map(
      (skin) => skin.name
    );
    console.log('All available parts:', partsList);
    // Initialize each slot manager with the parts list
    Object.values(this.slotManagers).forEach((manager) => {
      manager.initialize(partsList);
      console.log(`Parts for ${manager.slotName}:`, manager.getAvailableParts());
    });

    this.selectPart("character/body/arm-L/arm-L-skintone-01");
    this.selectPart("character/body/arm-R/arm-R-skintone-01");
    this.selectPart("character/body/leg-L/leg-L-skintone-01");
    this.selectPart("character/body/leg-R/leg-R-skintone-01");
    this.selectPart(
      "character/head/head-base/head-base-01/head-base-01-skintone-01"
    );
    this.selectPart("character/head/nose/nose-01/nose-01-skintone-01");
    this.selectPart("character/clothing/hats/hat-01A");
    this.selectPart("character/clothing/shoes/shoes-01A");
    this.selectPart("character/head/eyes-pupils/eyes-pupils-color-01");
    this.selectPart("character/body/neck/neck-02/neck-02-skintone-01");
    this.selectPart("character/head/mouth/mouth-01-base-01");
    this.selectPart("character/clothing/shirts/shirt-torso-01A");
    this.selectPart("character/head/eyes-base/eyes-base-01");
    this.selectPart("character/clothing/glasses/glasses-01A");
    this.selectPart("character/clothing/capes/cape-01B");
    this.selectPart("character/clothing/shorts/shorts-01A");

    this.selectPart("character/head/hair/hairstyle-02/hairstyle-02-color-01");
    this.selectPart(
      "character/head/eyebrows/eyebrows-01/eyebrows-01-skintone-01"
    );
    this.selectPart(
      "character/head/eyes-shadow/eyes-shadow-01/eyes-shadow-01-skintone-01"
    );

    //this.startRandomize();
    // setInterval(() => {
    //   this.startRandomize();
    // }, 1);
  }

  startRandomize() {
    // Randomize all slots
    Object.values(this.slotManagers).forEach((manager) => {
      manager.setRamdomPart();
    });

    // After randomizing, update hair based on hat status
    const hasHat = !!this.slotManagers.hat.getCurrentPart();
    this.slotManagers.hair.setHatStatus(hasHat);

    this.setSkinTone(
      Math.ceil(Math.random() * 8)
        .toString()
        .padStart(2, "0")
    );
    this.setHairColor(
      Math.ceil(Math.random() * 16)
        .toString()
        .padStart(2, "0")
    );
    this.setEyeShape(
      Math.ceil(Math.random() * 9)
        .toString()
        .padStart(2, "0")
    );

    // Apply changes
    this.applyChanges();
  }

  setSkinTone(tone) {
    this.skinTone = tone;

    // Update all skin tone dependent slots
    this.slotManagers.armL.setSkinTone(tone);
    this.slotManagers.armR.setSkinTone(tone);
    this.slotManagers.legL.setSkinTone(tone);
    this.slotManagers.legR.setSkinTone(tone);
    this.slotManagers.head.setSkinTone(tone);
    this.slotManagers.nose.setSkinTone(tone);
    this.slotManagers.neck.setSkinTone(tone);
    this.slotManagers.eyeShadow.setSkinTone(tone);

    // Apply changes
    this.applyChanges();
  }

  setHairColor(color) {
    this.hairColor = color;

    // Update all hair color dependent slots
    this.slotManagers.eyebrows.setHairColor(color);
    this.slotManagers.hair.setHairColor(color);

    // Apply changes
    this.applyChanges();
  }

  /*  eslint-disable no-unused-vars */
  setEyeShape(shape) {
    //this.eyeColor = color;
    this.slotManagers.eyes.selectPart(
      `character/head/eyes-base/eyes-base-${shape}`
    );
    this.slotManagers.eyeShadow.setEyeShape(shape);

    // Apply changes
    this.applyChanges();
  }

  selectPart(partPath) {
    // Find which slot this part belongs to
    for (const [slotName, manager] of Object.entries(this.slotManagers)) {
      if (manager.belongsToSlot(partPath)) {
        manager.selectPart(partPath);

        // If this is a hat change, update the hair
        if (slotName === "hat") {
          this.slotManagers.hair.setHatStatus(!!partPath); // Convert to boolean
        }

        this.applyChanges();

        if (
          slotName == "shirt" ||
          slotName == "bottoms" ||
          slotName == "shoes"
        ) {
          this.animationManager?.playCheckoutNewClothes(0.05);
        }

        return true;
      }
    }

    console.warn(`Could not find a slot for part: ${partPath}`);
    return false;
  }

  clearSlot(slotName) {
    if (this.slotManagers[slotName]) {
      this.slotManagers[slotName].clear();

      // If clearing a hat, update the hair
      if (slotName === "hat") {
        this.slotManagers.hair.setHatStatus(false);
      }

      this.applyChanges();
      return true;
    }

    console.warn(`Slot ${slotName} not found`);
    return false;
  }

  applyChanges() {
    const spine = this.spineManager.getSpine();
    if (!spine) return;

    // Create a new combined skin
    let newSkin = new Skin("custom-skin");

    // Add each active part to the combined skin
    Object.values(this.slotManagers).forEach((manager) => {
      const part = manager.getCurrentPart();
      if (part) {
        const skinData = spine.skeleton.data.findSkin(part);
        if (skinData) {
          newSkin.addSkin(skinData);
        }
      }
    });

    // Apply the combined skin
    spine.skeleton.setSkin(newSkin);
    spine.skeleton.setSlotsToSetupPose();
  }

  getAvailablePartsForSlot(slotName) {
    if (this.slotManagers[slotName]) {
      return this.slotManagers[slotName].getAvailableParts();
    }
    return [];
  }

  getCurrentParts() {
    const parts = {};

    Object.entries(this.slotManagers).forEach(([slotName, manager]) => {
      parts[slotName] = manager.getCurrentPart();
    });

    return parts;
  }

  getSlotNames() {
    return Object.keys(this.slotManagers);
  }

  resetToDefault() {
    // Clear all slots
    Object.values(this.slotManagers).forEach((manager) => {
      manager.clear();
    });

    // Reset attributes
    this.skinTone = "01";
    this.hairColor = "A";
    this.eyeColor = "A";

    // Apply changes
    this.applyChanges();
  }

  getAllParts() {
    const parts = {};

    Object.entries(this.slotManagers).forEach(([slotName, manager]) => {
      parts[slotName] = manager.getAllParts();
    });

    return parts;
  }

  // Add new methods for prosthetics management
  toggleProsthetic(limb) {
    if (!['armL', 'armR', 'legL', 'legR'].includes(limb)) return;
    
    this.prosthetics[limb] = !this.prosthetics[limb];
    
    if (this.prosthetics[limb]) {
      // Use the correct prosthetic part path with uppercase L/R
      const partPath = `character/body/${limb.replace(/([A-Z])/g, '-$1')}/${limb.replace(/([A-Z])/g, '-$1')}-prosthetic`;
      console.log('Setting prosthetic:', partPath);
      console.log('Available parts:', this.slotManagers[limb].getAvailableParts());
      const success = this.slotManagers[limb].selectPart(partPath);
      console.log('Select part success:', success);
    } else {
      // Revert to normal limb with current skin tone
      const partPath = `character/body/${limb.replace(/([A-Z])/g, '-$1')}/${limb.replace(/([A-Z])/g, '-$1')}-skintone-${this.skinTone}`;
      console.log('Setting normal limb:', partPath);
      console.log('Available parts:', this.slotManagers[limb].getAvailableParts());
      const success = this.slotManagers[limb].selectPart(partPath);
      console.log('Select part success:', success);
    }
    
    this.applyChanges();
  }

  getProstheticsState() {
    return { ...this.prosthetics };
  }

  toggleWheelchair() {
    this.animationManager.setWheelchairMode(!this.animationManager.useWheelchair);
  }

  isWheelchairEnabled() {
    return this.animationManager.useWheelchair;
  }
}
