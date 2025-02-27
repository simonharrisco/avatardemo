import * as PIXI from "pixi.js";
import {
  Spine,
  SpineDebugRenderer,
  Skin,
} from "@esotericsoftware/spine-pixi-v8";
import { OutlineFilter } from "pixi-filters";

class PixiManager {
  static instance = null;
  constructor() {
    if (PixiManager.instance) {
      return PixiManager.instance;
    }
    PixiManager.instance = this;
    this.app = null;
    this.initialized = false;
    this.spine = null;

    this.skinTypes = new Set();
    this.currentlyAttached = new Set();
  }

  async init() {
    if (this.initialized) return;

    let container = document.getElementById("canvas-container");

    this.app = new PIXI.Application();
    await this.app.init({
      width: window.innerWidth - 320,
      height: window.innerHeight,
      // Add this to help with debugging
      hello: true,
      backgroundColor: 0xffffff,

      resizeTo: container,
      autoDensity: true,
      resolution: window.devicePixelRatio || 1,
    });

    this.app.renderer.on("resize", () => {
      console.log("resize");
      this.resize();
    });

    const canvas = document
      .getElementById("canvas-container")
      .querySelector("canvas");
    if (canvas) {
      console.log("removing old canvas");
      canvas.remove();
    }

    container.appendChild(this.app.canvas);
    this.initialized = true;
  }

  async loadData() {
    try {
      // Load assets
      PIXI.Assets.add({
        alias: "skeleton-data",
        src: "/SKAvatars/SK-character.json",
      });
      PIXI.Assets.add({
        alias: "skeleton-atlas",
        src: "/SKAvatars/SK-character.atlas",
      });
      await PIXI.Assets.load(["skeleton-data", "skeleton-atlas"]);

      // create spine object from assets
      this.spine = Spine.from({
        skeleton: "skeleton-data",
        atlas: "skeleton-atlas",
      });

      // check this hasnt fucked everything
      if (!this.spine) {
        console.error("Failed to create spine instance");
        return;
      }

      // center spine object in space
      this.spine.state.data.defaultMix = 0.2;
      this.spine.x = window.innerWidth / 2 - 160;
      this.spine.y = window.innerHeight * 0.8;

      // Apply filters
      const outlineFilter = new OutlineFilter(4, 0x000000);
      // more filter

      this.spine.filters = [outlineFilter];

      // Add spine to stage
      this.app.stage.addChild(this.spine);

      // Get all skins and set skin types
      let skins = this.getFullSkins();
      let skinTypeSet = new Set();
      skins.forEach((skin) => {
        let splitSkins = skin.split("/");
        skinTypeSet.add(splitSkins[0]);
      });
      this.skinTypes = skinTypeSet;
      this.hackyDefaultSkinSetup();

      // Get animations and set a default
      let anims = this.getAnimations();
      if (anims.length) {
        // set idle if exists
        if (anims.includes("idles/idle")) {
          this.setAnimation("idles/idle", true);
        } else {
          this.setAnimation(anims[0], true);
        }
      }

      // run first resize for consistency
      this.resize();
    } catch (error) {
      console.error("Error loading spine:", error);
    }
  }

  getAnimations() {
    return this.spine.state.data.skeletonData.animations.map(
      (anim) => anim.name
    );
  }

  setAnimation(name, loop) {
    this.spine.state.setAnimation(0, name, loop);
  }

  getSkinOfType(type) {
    let skins = this.getFullSkins();
    let filteredSkins = skins.filter((skin) => skin.startsWith(type));
    return filteredSkins;
  }

  getFullSkins() {
    let skins = this.spine.skeleton.data.skins.map((skin) => skin.name);
    return skins.filter((skin) => !skin.startsWith("full-skins"));
  }

  addSkin(name) {
    this.currentlyAttached.add(name);
    this.recreateCurrentSkinFromAttached();
  }
  removeSkin(name) {
    this.currentlyAttached.delete(name);
    this.recreateCurrentSkinFromAttached();
  }

  toggleSkin(name) {
    if (this.isSkinAttached(name)) {
      this.removeSkin(name);
    } else {
      // remove any skin in the same category that is already attached
      let splitSkins = name.split("/");
      let type = splitSkins[0];

      let matches = Array.from(this.currentlyAttached).filter((skin) =>
        skin.startsWith(type)
      );
      matches.forEach((skin) => {
        this.removeSkin(skin);
      });

      this.addSkin(name);
    }
  }

  recreateCurrentSkinFromAttached() {
    let skins = this.getFullSkins();
    let newSkin = new Skin("new-skin");
    this.currentlyAttached.forEach((name) => {
      let skin = skins.find((skin) => skin === name);
      if (skin) {
        let skinData = this.spine.skeleton.data.findSkin(skin);
        if (skinData) {
          newSkin.addSkin(skinData);
        }
      }
    });

    this.spine.skeleton.setSkin(newSkin);
    this.spine.skeleton.setSlotsToSetupPose();
  }

  isSkinAttached(name) {
    return this.currentlyAttached.has(name);
  }

  setSlotsToSetupPose() {
    this.spine.skeleton.setSlotsToSetupPose();
  }

  hackyDefaultSkinSetup() {
    this.getFullSkins().forEach((skin) => {
      this.toggleSkin(skin);
    });
  }

  resize() {
    if (!this.app || !this.spine) return;

    const newWidth = window.innerWidth - 320;
    const newHeight = window.innerHeight;

    // reset the scale so the calculationss are correct
    this.spine.scale.set(1);
    // Get the spine bounds
    const bounds = this.spine.getBounds();
    const spineWidth = bounds.width;
    const spineHeight = bounds.height;

    // Calculate the desired height (e.g., 80% of viewport height)
    const targetHeight = newHeight * 0.5;

    // Calculate scale to fit height while maintaining aspect ratio
    const scale = targetHeight / spineHeight;
    this.spine.scale.set(scale);

    // Center horizontally and position at 80% of viewport height
    this.spine.x = newWidth / 2;
    this.spine.y = newHeight * 0.8;

    // Since spine models typically have their origin at the bottom center,
    // we need to offset by half the width to truly center it
    this.spine.x -= (spineWidth * scale) / 2;
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.app = null;
      this.initialized = false;
      this.spine = null;
    }
  }
}

export const pixiManager = new PixiManager();
