import { spineNameMap } from "../constants/spine-mapping.js";
import { pixiManager } from "../lib/PixiManager.js";

export function CategoryItem({ category, isActive, currentParts, currentHairColor, onClick }) {
  const renderContent = () => {
    // For skin tone category, show current head
    if (category === "skinTone") {
      const currentHead = currentParts?.head || pixiManager.characterManager.getCurrentParts().head;
      if (currentHead) {
        return (
          <div style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}>
          <div
            style={{
              backgroundImage: `url(pipeline/assets/${spineNameMap[currentHead]})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "70%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <div
            style={{
              backgroundImage: `url(brush.png)`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
          </div>
        );
      }
      return <div>Skin</div>;
    }

    // For hair color category, show current hair
    if (category === "hairColor") {
      const currentHair = currentParts?.hair || pixiManager.characterManager.getCurrentParts().hair;
      if (currentHair) {
        return (
          <div style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}>
          <div
            style={{
              backgroundImage: `url(pipeline/assets/${spineNameMap[currentHair]})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top",
              width: "70%",
              height: "100%",
            }}
          ></div>
          <div
            style={{
              backgroundImage: `url(brush.png)`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />
          </div>
        );
      }
      return <div>Hair Color</div>;
    }

    if (currentParts[category]) {
      return (
        <div
          style={{
            backgroundImage: `url(pipeline/assets/${
              spineNameMap[
                category === "eyebrows"
                  ? currentParts[category].replace(
                      /skintone-\d+/,
                      `skintone-${currentHairColor}`
                    )
                  : currentParts[category]
              ]
            })`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
          }}
        ></div>
      );
    }

    return (
      <div>
        {category === "skinTone"
          ? "Skin"
          : category === "hairColor"
          ? "Hair Color"
          : category}
      </div>
    );
  };

  return (
    <div
      className={`category-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {renderContent()}
    </div>
  );
} 