
import React from 'react';
import { Unit, Rarity } from '../types';

interface UnitCardProps {
  unit: Unit;
  onClick?: () => void;
}

const getRarityColor = (rarity: Rarity): string => {
  switch (rarity) {
    case Rarity.Common:
      return 'bg-gray-500';
    case Rarity.Uncommon:
      return 'bg-green-500';
    case Rarity.Rare:
      return 'bg-blue-500';
    case Rarity.Epic:
      return 'bg-purple-500';
    case Rarity.Mythic:
        return 'bg-yellow-400';
    case Rarity.Secret:
        return 'bg-red-500';
    case Rarity.Nightmare:
        return 'bg-indigo-800';
    case Rarity.Hero:
        return 'bg-yellow-200';
    case Rarity.Legendary:
      return 'bg-orange-500';
    default:
      return 'bg-gray-600';
  }
};

const UnitCard: React.FC<UnitCardProps> = ({ unit, onClick }) => {
  const rarityColor = getRarityColor(unit.rarity);
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={`relative w-full aspect-[4/5] bg-[#10101a] border border-[#2a2d3a] p-1 group transition-transform duration-200 ${onClick ? 'hover:scale-105 hover:border-yellow-400 cursor-pointer' : ''}`}
    >
      <div className="scanlines-bg w-full h-full flex flex-col items-center justify-center p-1">
        
        <div className={`absolute top-1 right-1 w-2.5 h-2.5 border border-black ${rarityColor}`}></div>

        <div className="flex-grow flex items-center justify-center w-full h-full overflow-hidden my-2">
             <img src={unit.image} alt={unit.name} className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
        </div>

        <div className="text-center h-5 flex-shrink-0 flex items-center justify-center">
          <p className="font-pixel text-xs text-yellow-300">{unit.cost}$</p>
        </div>
      </div>
    </Tag>
  );
};

export default UnitCard;