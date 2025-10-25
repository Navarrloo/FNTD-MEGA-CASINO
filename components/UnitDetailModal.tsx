
import React from 'react';
import { Unit, Rarity } from '../types';
import { BALANCE_ICON } from '../constants';

interface UnitDetailModalProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
}

const getRarityStyles = (rarity: Rarity): { text: string; border: string; bg: string } => {
  switch (rarity) {
    // FIX: Add case for Common rarity
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
  if (!isOpen || !unit) {
    return null;
  }

  const rarityStyles = getRarityStyles(unit.rarity);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="win-modal-container scanlines-bg !w-11/12 max-w-sm"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute -top-2 -right-2 w-8 h-8 pixel-button pixel-button-red !p-0 flex items-center justify-center z-10"
        >
          X
        </button>

        {/* Unit Image */}
        <div className="mx-auto w-40 h-56 mb-4 p-2 bg-black/30 border-2 border-border-dark">
            <img src={unit.image} alt={unit.name} className="w-full h-full object-contain" />
        </div>
        
        {/* Name */}
        <h2 className="font-pixel text-2xl text-center text-accent-yellow">{unit.name}</h2>
        
        {/* Rarity and Cost */}
        <div className="flex justify-center items-center gap-4 my-3">
          <div className={`px-3 py-1 border-2 ${rarityStyles.border} ${rarityStyles.bg}`}>
            <p className={`font-pixel text-sm ${rarityStyles.text}`}>{unit.rarity}</p>
          </div>
          <div className="flex items-center justify-center bg-black/30 p-2 border-2 border-border-dark">
                <img src={BALANCE_ICON} alt="Souls" className="w-5 h-5 mr-2"/>
                <p className="font-pixel text-lg text-accent-yellow">{unit.cost.toLocaleString()}</p>
            </div>
        </div>

        {/* Separator */}
        <div className="border-t-2 border-border-dark my-4 mx-8"></div>

        {/* Description */}
        <p className="text-center text-text-dark text-base px-2">{unit.description}</p>

      </div>
    </div>
  );
};

export default UnitDetailModal;
