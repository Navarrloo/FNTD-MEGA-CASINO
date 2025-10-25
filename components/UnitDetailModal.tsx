import React, { useState, useEffect } from 'react';
import { Unit, Rarity } from '../types';
import { BALANCE_ICON, UNIT_DETAILS, UnitDetails, UnitStatLevel } from '../constants';

interface UnitDetailModalProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
}

const getRarityStyles = (rarity: Rarity): { text: string; border: string; bg: string } => {
  switch (rarity) {
    case Rarity.Common:
      return { text: 'text-gray-300', border: 'border-gray-400', bg: 'bg-gray-700/50' };
    case Rarity.Uncommon:
      return { text: 'text-green-300', border: 'border-green-400', bg: 'bg-green-800/50' };
    case Rarity.Rare:
      return { text: 'text-blue-300', border: 'border-blue-400', bg: 'bg-blue-800/50' };
    case Rarity.Epic:
      return { text: 'text-purple-300', border: 'border-purple-400', bg: 'bg-purple-800/50' };
    case Rarity.Mythic:
      return { text: 'text-yellow-300', border: 'border-yellow-400', bg: 'bg-yellow-700/50' };
    case Rarity.Secret:
        return { text: 'text-red-300', border: 'border-red-400', bg: 'bg-red-800/50' };
    case Rarity.Nightmare:
        return { text: 'text-indigo-300', border: 'border-indigo-400', bg: 'bg-indigo-900/50' };
    case Rarity.Hero:
        return { text: 'text-yellow-200', border: 'border-yellow-200', bg: 'bg-yellow-500/50' };
    case Rarity.Legendary:
      return { text: 'text-orange-300', border: 'border-orange-400', bg: 'bg-orange-800/50' };
    default:
      return { text: 'text-gray-300', border: 'border-gray-400', bg: 'bg-gray-700/50' };
  }
};

const UnitDetailModal: React.FC<UnitDetailModalProps> = ({ unit, isOpen, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'regular' | 'shiny'>('regular');

  useEffect(() => {
    if (isOpen) {
      setShowDetails(false);
      setActiveTab('regular');
    }
  }, [isOpen, unit]);

  if (!isOpen || !unit) {
    return null;
  }

  const unitDetails: UnitDetails | undefined = UNIT_DETAILS[unit.id];
  const rarityStyles = getRarityStyles(unit.rarity);

  const handleClose = () => {
    setShowDetails(false);
    onClose();
  };
  
  const renderStatsTable = (stats: UnitStatLevel[]) => (
     <div className="overflow-x-auto">
        <table className="stats-table">
            <thead>
                <tr>
                    <th>Lvl</th>
                    <th>Stats</th>
                    <th>Cost</th>
                </tr>
            </thead>
            <tbody>
                {stats.map((lvl) => (
                    <tr key={lvl.level}>
                        <td className="text-accent-yellow font-bold text-center">{lvl.level}</td>
                        <td>
                            <p>Dmg: {lvl.damage}</p>
                            <p>Rng: {lvl.range}</p>
                            <p>CD: {lvl.cooldown}</p>
                            {lvl.attackType && <p className="text-xs text-text-dark">{lvl.attackType}</p>}
                        </td>
                        <td className="text-accent-green">${lvl.cost.toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4"
      onClick={handleClose}
    >
      <div 
        className={`relative bg-background-med p-4 border-2 border-white w-full font-pixel transition-all duration-300 ${showDetails ? 'max-w-md' : 'max-w-xs'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClose} 
          className="absolute w-8 h-8 bg-red-600 text-white text-lg flex items-center justify-center border-2 border-white"
          style={{ top: '-2px', right: '-2px'}}
          aria-label="Close modal"
        >
          X
        </button>

        <div className="flex items-center gap-4">
            <div className="w-16 h-16 p-1 bg-black border-2 border-white flex-shrink-0">
                <img src={unit.image} alt={unit.name} className="w-full h-full object-contain" />
            </div>
            <div className="text-left flex-grow">
                <h2 className="text-xl text-white uppercase">{unit.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`px-2 py-0.5 border-2 ${rarityStyles.border}`}>
                    <p className={`text-xs uppercase ${rarityStyles.text}`}>{unit.rarity}</p>
                  </div>
                  <div className="flex items-center border-2 border-white px-2 py-0.5">
                        <img src={BALANCE_ICON} alt="Cost" className="w-4 h-4 mr-1.5"/>
                        <p className="text-base text-white">{unit.cost.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="border-t-2 border-white my-4"></div>
        
        <p className="text-white text-base leading-tight uppercase">{unit.description}</p>
        
        {unitDetails && (
          <>
            <div className="border-t-2 border-white my-4"></div>
            {showDetails ? (
              <div className="animate-fadeIn">
                <div className="modal-details-container">
                  {unitDetails.passives && unitDetails.passives.length > 0 && (
                      <div className="mb-4">
                          <h3 className="font-pixel text-lg text-accent-purple mb-2">Passives</h3>
                          {unitDetails.passives.map(passive => (
                              <div key={passive.name} className="bg-black/30 p-2 border-l-2 border-accent-purple">
                                  <p className="font-bold text-text-light">{passive.name}</p>
                                  <p className="text-sm text-text-dark">{passive.description}</p>
                              </div>
                          ))}
                      </div>
                  )}

                  <div className="flex gap-2 mb-2">
                      <button onClick={() => setActiveTab('regular')} className={`stats-tab ${activeTab === 'regular' ? 'active' : ''}`}>Regular</button>
                      <button onClick={() => setActiveTab('shiny')} className={`stats-tab ${activeTab === 'shiny' ? 'active' : ''}`}>Shiny</button>
                  </div>
                  
                  {renderStatsTable(unitDetails.stats[activeTab])}

                  {unitDetails.history && unitDetails.history.length > 0 && (
                      <div className="mt-4">
                          <h3 className="font-pixel text-lg text-accent-purple mb-2">History</h3>
                          <div className="bg-black/30 p-2 border-l-2 border-accent-purple text-sm">
                              {unitDetails.history.map(entry => (
                                  <p key={entry.date} className="text-text-dark">
                                      <span className="text-text-light">{entry.date}:</span> {entry.change}
                                  </p>
                              ))}
                          </div>
                      </div>
                  )}
                </div>
                <button onClick={() => setShowDetails(false)} className="pixel-button-yellow w-full mt-4">Скрыть характеристики</button>
              </div>
            ) : (
              <button onClick={() => setShowDetails(true)} className="pixel-button-green w-full">Показать характеристики</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UnitDetailModal;
