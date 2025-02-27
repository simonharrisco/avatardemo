/*  eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import { pixiManager } from "../lib/PixiManager.js";

function App() {
  let anims = pixiManager.getAnimations();

  let categoies = Object.keys(pixiManager.characterManager.slotManagers);

  return (
    <>
      <h1>Character Builder</h1>
      <button onClick={() => pixiManager.characterManager.startRandomize()}>
        {" "}
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
                  defaultValue={
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
