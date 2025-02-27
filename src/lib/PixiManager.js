// PixiManager.js
import * as PIXI from "pixi.js";
import { AssetLoader } from "./AssetLoader";
import { SpineManager } from "./SpineManager";
import { CharacterManager } from "./CharacterManager";

class PixiManager {
  static instance = null;

  constructor() {
    if (PixiManager.instance) {
      return PixiManager.instance;
    }
    PixiManager.instance = this;

    this.app = null;
    this.initialized = false;

    this.assetLoader = new AssetLoader();
    this.spineManager = null;
    this.skinManager = null;
  }

  async init() {
    if (this.initialized) return;

    let container = document.getElementById("canvas-container");

    this.app = new PIXI.Application();
    await this.app.init({
      width: window.innerWidth - 320,
      height: window.innerHeight,
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

    // Create managers after initialization
    this.spineManager = new SpineManager(this.app);
    this.characterManager = new CharacterManager(this.spineManager);
  }

  async loadData() {
    // Load assets
    await this.assetLoader.loadSpineAssets();

    // Create spine
    const success = await this.spineManager.createSpine();
    if (!success) return;

    // Initialize skin manager
    this.characterManager.initialize();

    // Get animations and set a default
    let anims = this.spineManager.getAnimations();
    if (anims.length) {
      // set idle if exists
      if (anims.includes("idles/idle")) {
        this.spineManager.setAnimation("idles/idle", true);
      } else {
        this.spineManager.setAnimation(anims[0], true);
      }
    }

    // run first resize for consistency
    this.resize();
  }

  resize() {
    if (!this.app || !this.spineManager) return;

    const newWidth = window.innerWidth - 320;
    const newHeight = window.innerHeight;

    this.spineManager.resize(newWidth, newHeight);
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.app = null;
      this.initialized = false;
      this.spineManager = null;
      this.characterManager = null;
    }
  }

  // Public API methods that delegate to the appropriate manager

  getAnimations() {
    return this.spineManager?.getAnimations() || [];
  }

  setAnimation(name, loop) {
    this.spineManager?.setAnimation(name, loop);
  }

  toggleSkin(name) {
    this.skinManager?.toggleSkin(name);
  }
}

export const pixiManager = new PixiManager();
