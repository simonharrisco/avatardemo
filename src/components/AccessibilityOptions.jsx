import { useState, useEffect } from 'react';
import { pixiManager } from '../lib/PixiManager.js';
import { spineNameMap } from '../constants/spine-mapping.js';

export function AccessibilityOptions() {
  const [prosthetics, setProsthetics] = useState({
    armL: false,
    armR: false,
    legL: false,
    legR: false
  });
  const [wheelchair, setWheelchair] = useState(false);

  useEffect(() => {
    // Update state from character manager
    const updateState = () => {
      setProsthetics(pixiManager.characterManager.getProstheticsState());
      setWheelchair(pixiManager.characterManager.isWheelchairEnabled());
    };

    // Initial update
    updateState();

    // Set up interval to check for updates
    const intervalId = setInterval(updateState, 100);
    return () => clearInterval(intervalId);
  }, []);

  const handleProstheticToggle = (limb) => {
    pixiManager.characterManager.toggleProsthetic(limb);
    setProsthetics(pixiManager.characterManager.getProstheticsState());
  };

  const handleWheelchairToggle = () => {
    pixiManager.characterManager.toggleWheelchair();
    setWheelchair(pixiManager.characterManager.isWheelchairEnabled());
  };

  const renderProstheticIcon = (limb) => {
    const partPath = `character/body/${limb.replace(/([A-Z])/g, '-$1').toLowerCase().replace('-l', '-L').replace('-r', '-R')}/${limb.replace(/([A-Z])/g, '-$1').toLowerCase().replace('-l', '-L').replace('-r', '-R')}-prosthetic`;
    const iconPath = spineNameMap[partPath];
    
    if (iconPath) {
      return (
        <div
          style={{
            backgroundImage: `url(pipeline/assets/${iconPath})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
          }}
        />
      );
    }
    
    return (
      <div
        style={{
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        {limb === 'armL' ? '🦾 Left' : 
         limb === 'armR' ? '🦾 Right' : 
         limb === 'legL' ? '🦿 Left' : 
         '🦿 Right'}
      </div>
    );
  };

  return (
    <div className="option-grid">
      <div 
        className={`option-item ${wheelchair ? 'active' : ''}`}
        onClick={handleWheelchairToggle}
        style={{
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ♿️
      </div>
      <div 
        className={`option-item ${prosthetics.armL ? 'active' : ''}`}
        onClick={() => handleProstheticToggle('armL')}
      >
        {renderProstheticIcon('armL')}
      </div>
      <div 
        className={`option-item ${prosthetics.armR ? 'active' : ''}`}
        onClick={() => handleProstheticToggle('armR')}
      >
        {renderProstheticIcon('armR')}
      </div>
      <div 
        className={`option-item ${prosthetics.legL ? 'active' : ''}`}
        onClick={() => handleProstheticToggle('legL')}
      >
        {renderProstheticIcon('legL')}
      </div>
      <div 
        className={`option-item ${prosthetics.legR ? 'active' : ''}`}
        onClick={() => handleProstheticToggle('legR')}
      >
        {renderProstheticIcon('legR')}
      </div>
    </div>
  );
}