// AnimationManager.js

export class AnimationManager {
  constructor(spineManager) {
    this.spineManager = spineManager;
    this.animationQueue = [];
    this.isPlaying = false;
    this.useWheelchair = false;
    this.allIdleAnimations = [];
    this.defaultIdleAnimations = [];
    this.altIdleAnimations = [];
    this.currentAnimation = null;
    this.onComplete = null;
    this.isPlayingIdle = false;
    this.altIdleProbability = 0.2; // 20% chance to play an alt idle by default
  }

  setAltIdleProbability(probability) {
    // Ensure probability is between 0 and 1
    this.altIdleProbability = Math.max(0, Math.min(1, probability));
  }

  initialize() {
    // Get all available animations
    const allAnimations = this.spineManager.getAnimations();
    console.log(allAnimations);

    // Store all idle animations
    this.allIdleAnimations = allAnimations.filter((anim) =>
      anim.startsWith("idles/")
    );

    // Initialize the filtered idle animations
    this._filterIdleAnimations();
  }

  _filterIdleAnimations() {
    const wheelchairFilter = this.useWheelchair
      ? (anim) => anim.includes("wheelchair")
      : (anim) => !anim.includes("wheelchair");

    // Filter animations based on wheelchair mode first
    const wheelchairFiltered = this.allIdleAnimations.filter(wheelchairFilter);

    // Then separate into default and alt idles, excluding static
    this.defaultIdleAnimations = wheelchairFiltered.filter(
      (anim) =>
        anim.includes("idle") &&
        !anim.includes("alt") &&
        !anim.includes("static")
    );

    this.altIdleAnimations = wheelchairFiltered.filter(
      (anim) =>
        anim.includes("idle") &&
        anim.includes("alt") &&
        !anim.includes("static")
    );
  }

  setWheelchairMode(enabled) {
    this.useWheelchair = enabled;
    // Update the filtered idle animations
    this._filterIdleAnimations();
    // If currently playing an idle, switch to appropriate variant
    if (this.isPlayingIdle) {
      this.playRandomIdle();
    } else if (this.currentAnimation) {
      // For non-idle animations, try to switch to wheelchair variant
      this._playAnimation(this.currentAnimation, true);
    }
  }

  // Add animation to the end of the queue
  queueAnimation(animationName, loop = false) {
    this.animationQueue.push({ name: animationName, loop });
    if (!this.isPlaying) {
      this._playNextInQueue();
    }
  }

  // Add animation to the front of the queue
  queueAnimationFront(animationName, loop = false) {
    this.animationQueue.unshift({ name: animationName, loop });
    if (!this.isPlaying) {
      this._playNextInQueue();
    }
    console.log(this.animationQueue);
  }

  // Clear the animation queue
  clearQueue() {
    this.animationQueue = [];
  }

  // Play a random idle animation
  playRandomIdle() {
    // Determine if we should play an alt idle
    const useAltIdle =
      Math.random() < this.altIdleProbability &&
      this.altIdleAnimations.length > 0;
    const availableAnimations = useAltIdle
      ? this.altIdleAnimations
      : this.defaultIdleAnimations;

    if (availableAnimations.length === 0) {
      // If no animations in the chosen set, try the other set
      const fallbackAnimations = useAltIdle
        ? this.defaultIdleAnimations
        : this.altIdleAnimations;
      if (fallbackAnimations.length === 0) return;

      // Get random animation from fallback set
      const randomIndex = Math.floor(Math.random() * fallbackAnimations.length);
      const idleAnimation = fallbackAnimations[randomIndex];
      this.isPlayingIdle = true;
      this._playAnimation(idleAnimation, false);
      return;
    }

    // Get a random animation from the chosen set
    let randomIndex = Math.floor(Math.random() * availableAnimations.length);
    let idleAnimation = availableAnimations[randomIndex];

    // If we have more than one animation in the set, make sure we don't play the same one twice
    if (
      availableAnimations.length > 1 &&
      idleAnimation === this.currentAnimation
    ) {
      randomIndex = (randomIndex + 1) % availableAnimations.length;
      idleAnimation = availableAnimations[randomIndex];
    }

    this.isPlayingIdle = true;
    this._playAnimation(idleAnimation, false);
  }

  // Internal method to play the next animation in queue
  _playNextInQueue() {
    if (this.animationQueue.length === 0) {
      this.isPlaying = false;
      this.currentAnimation = null;
      // When queue is empty, play random idle
      this.playRandomIdle();
      return;
    }

    const { name, loop } = this.animationQueue.shift();
    this.isPlaying = true;
    this.isPlayingIdle = false;
    this._playAnimation(name, loop);
  }

  // Internal method to play an animation with wheelchair variant handling
  _playAnimation(animationName, loop) {
    this.currentAnimation = animationName;

    // Check if wheelchair variant exists and should be used
    if (this.useWheelchair) {
      const wheelchairVariant = animationName + "_wheelchair";
      const animations = this.spineManager.getAnimations();
      if (animations.includes(wheelchairVariant)) {
        animationName = wheelchairVariant;
      }
    }

    // Set up completion callback
    const spine = this.spineManager.getSpine();
    if (spine) {
      // Remove any existing listeners to prevent duplicates
      spine.state.clearListeners();

      spine.state.addListener({
        complete: (entry) => {
          if (entry.animation.name === animationName) {
            if (!loop) {
              if (this.isPlayingIdle) {
                // If we just finished an idle animation, play another random one
                this.playRandomIdle();
              } else {
                this._playNextInQueue();
              }
            }
          }
        },
      });
    }

    // Play the animation
    this.spineManager.setAnimation(animationName, loop);
  }

  playCheckoutNewClothes(probability) {
    if (Math.random() < probability) {
      console.log("hit probability");
      const baseAnimation = "emotes/checkout-new-clothes";
      const animationName = this.useWheelchair
        ? `${baseAnimation}-wheelchair`
        : baseAnimation;

      // Queue the appropriate version of the animation to the front
      this.queueAnimationFront(animationName, false);
    }
  }
}
