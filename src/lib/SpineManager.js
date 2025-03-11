// SpineManager.js
import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { OutlineFilter } from "pixi-filters";

export class SpineManager {
  constructor(pixiApp) {
    this.app = pixiApp;
    this.spine = null;
  }

  async createSpine() {
    try {
      // create spine object from assets
      this.spine = Spine.from({
        skeleton: "skeleton-data",
        atlas: "skeleton-atlas",
      });

      if (!this.spine) {
        console.error("Failed to create spine instance");
        return false;
      }

      // Apply filters
      const outlineFilter = new OutlineFilter(4, 0x000000);
      this.spine.filters = [outlineFilter];

      // Add spine to stage
      this.app.stage.addChild(this.spine);

      return true;
    } catch (error) {
      console.error("Error creating spine:", error);
      return false;
    }
  }

  getSpine() {
    return this.spine;
  }

  getAnimations() {
    if (!this.spine) return [];
    return this.spine.state.data.skeletonData.animations.map(
      (anim) => anim.name
    );
  }

  setAnimation(name, loop) {
    if (!this.spine) return;
    this.spine.state.setAnimation(0, name, loop);
  }

  setSlotsToSetupPose() {
    if (!this.spine) return;
    this.spine.skeleton.setSlotsToSetupPose();
  }

  resize(width, height) {
    if (!this.spine) return;

    // reset the scale so the calculations are correct
    this.spine.scale.set(1);

    const bounds = this.spine.getBounds();
    const spineWidth = bounds.width;
    const spineHeight = bounds.height;

    if (window.innerWidth > 500) {
      // Calculate the desired height (e.g., 80% of viewport height)
      const targetHeight = height * 0.7;

      // Calculate scale to fit height while maintaining aspect ratio
      const scale = targetHeight / spineHeight;
      this.spine.scale.set(scale);

      // Center horizontally and position at 80% of viewport height
      this.spine.x = width / 2 + (spineWidth / 2) * scale;
      this.spine.y = height * 0.85;

      // Since spine models typically have their origin at the bottom center,
      // we need to offset by half the width to truly center it
    } else {
      // Calculate the desired height (e.g., 80% of viewport height)
      const targetHeight = height * 0.5;

      // Calculate scale to fit height while maintaining aspect ratio
      const scale = targetHeight / spineHeight;
      this.spine.scale.set(scale);

      // Center horizontally and position at 80% of viewport height
      this.spine.x = window.innerWidth / 2;
      this.spine.y = height * 0.65;

      // Since spine models typically have their origin at the bottom center,
      // we need to offset by half the width to truly center it
    }
  }
}
