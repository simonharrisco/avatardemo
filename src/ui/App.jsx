/*  eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import { pixiManager } from "../lib/PixiManager.js";

function App() {
  let anims = pixiManager.getAnimations();

  let categoies = Object.keys(pixiManager.characterManager.slotManagers).filter(
    (category) =>
      !["armL", "armR", "legL", "legR", "eyes", "eyeshadow"].includes(category)
  );

  return (
    <>
      <h1>Character Builder</h1>
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
                pixiManager.characterManager.selectPart(e.target.value);
              }}
            >
              <option value="">Select Part</option>
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
