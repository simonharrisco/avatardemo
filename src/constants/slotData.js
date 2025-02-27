const dependencyTypes = {
  SKIN_TONE: "Skin Tone",
  HAIR_COLOR: "Hair Color",
  EYE_COLOR: "Eye Color",
};

const slots = {
  // these require need to modify on skin tone
  armL: "",
  armR: "",
  legL: "",
  legR: "",
  neck: "",
  head: "",
  nose: "",
  pupils: "",
  mouth: "",

  // its own thing
  eyes: "",

  // this need to modify on BOTH eye color AND skin tone
  eyeShadow: "",

  // these require hair color
  eyebrows: "",
  hair: "",

  // other accessories
  back: "", // cape or backpack
  legs: "", // skirt, shorts, pants
  face: "", // glasses

  hat: "",
  shirt: "",
  shoes: "",
};
// lets not count skin as a slot for now
