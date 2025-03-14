import { OptionItem } from "./OptionItem";

export function OptionsGrid({
  selectedCategory,
  currentParts,
  currentSkinTone,
  currentHairColor,
  options,
  onOptionClick,
  canBeEmpty,
}) {
  return (
    <div className="option-grid">
      {canBeEmpty && (
        <OptionItem
          option={{ id: "" }}
          isActive={!currentParts[selectedCategory]}
          selectedCategory={selectedCategory}
          currentHairColor={currentHairColor}
          currentParts={currentParts}
          onClick={() => onOptionClick("", selectedCategory)}
        />
      )}
      {options.map((option) => (
        <OptionItem
          key={option.id}
          option={option}
          isActive={
            selectedCategory === "skinTone"
              ? currentSkinTone === option.id
              : selectedCategory === "hairColor"
              ? currentHairColor === option.id
              : currentParts[selectedCategory] === option.id
          }
          selectedCategory={selectedCategory}
          currentHairColor={currentHairColor}
          currentParts={currentParts}
          onClick={() => onOptionClick(option.id, selectedCategory)}
        />
      ))}
    </div>
  );
} 