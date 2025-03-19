/*  eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import { pixiManager } from "../lib/PixiManager.js";

function App() {
  let anims = pixiManager.getAnimations();

  let categoies = Object.keys(pixiManager.characterManager.slotManagers).filter(
    (category) =>
      !["armL", "armR", "legL", "legR", "eyes", "eyeShadow", "neck"].includes(
        category
      )
  );

  return (
    <>
      <div className="absolute top-0 right-[320px] p-2 bg-green">
        <label htmlFor="animations">Animations:</label>
        <select
          id="animations"
          onChange={(e) => pixiManager.setAnimation(e.target.value, true)}
        >
          <option value="">Select Animation</option>
          {anims.map((anim) => (
            <option key={anim} value={anim}>
              {anim}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => pixiManager.characterManager.startRandomize()}
        className="mb-2 border rounded p-1 bg-white"
      >
        randomise
      </button>
      <div
        className="
          grid grid-cols-2 gap-2
        "
      >
        <label htmlFor="skinTone">Skin tone:</label>
        <select
          id="skinTone"
          onChange={(e) =>
            pixiManager.characterManager.setSkinTone(e.target.value)
          }
        >
          <option value="">Select Skin Tone</option>
          {["01", "02", "03", "04", "05", "06", "07", "08"].map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>
        <label htmlFor="eyeShape">eyeShape:</label>
        <select
          id="eyeShape"
          onChange={(e) =>
            pixiManager.characterManager.setEyeShape(e.target.value)
          }
        >
          <option value="">Select Eye Shape</option>
          {["01", "02", "03", "04", "05", "06", "07", "08", "09"].map(
            (tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            )
          )}
        </select>
        <label htmlFor="hariColor">Hair color:</label>
        <select
          id="hariColor"
          onChange={(e) =>
            pixiManager.characterManager.setHairColor(e.target.value)
          }
        >
          <option value="">Select Skin Tone</option>
          {[
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
          ].map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>
      </div>
      {categoies.map((category) => {
        let parts =
          pixiManager.characterManager.getAvailablePartsForSlot(category);
        let canBeEmpty =
          pixiManager.characterManager.slotManagers[category].getCanBeEmpty();

        return (
          <div
            key={category}
            className="
             grid grid-cols-2 gap-2
            "
          >
            <label htmlFor={category}>{category}:</label>
            <select
              id={category}
              onChange={(e) => {
                if (e.target.value === "") {
                  pixiManager.characterManager.clearSlot(category);
                } else {
                  pixiManager.characterManager.selectPart(e.target.value);
                }
              }}
            >
              {canBeEmpty && <option value="">🚫</option>}
              {parts.map((part) => (
                <option
                  key={part}
                  value={part}
                  selected={
                    part ===
                    pixiManager.characterManager.getCurrentParts()[category]
                  }
                >
                  {part.substring(part.lastIndexOf("/") + 1)}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </>
  );
}

export default App;
