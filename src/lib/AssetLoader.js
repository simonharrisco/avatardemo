// AssetLoader.js
import * as PIXI from "pixi.js";

export class AssetLoader {
  constructor() {
    this.loaded = false;
  }

  async loadSpineAssets() {
    if (this.loaded) return;

    PIXI.Assets.add({
      alias: "skeleton-data",
      src: "/SKAvatars/SK-character.json",
    });
    PIXI.Assets.add({
      alias: "skeleton-atlas",
      src: "/SKAvatars/SK-character.atlas",
    });

    await PIXI.Assets.load(["skeleton-data", "skeleton-atlas"]);
    this.loaded = true;
  }
}
