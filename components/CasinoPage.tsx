
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Unit } from '../types';
import { UNITS, CASINO_COST } from '../constants';
import UnitCard from './UnitCard';
import { GameContext } from '../App';

const CasinoPage: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedUnit, setDisplayedUnit] = useState<Unit | null>(null);
  const [wonUnit, setWonUnit] = useState<Unit | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const game = useContext(GameContext);

  const handleSpin = useCallback(() => {
    if (isSpinning || !game || game.balance < CASINO_COST) return;

    game.updateBalance(game.balance - CASINO_COST);

    setIsSpinning(true);
    setWonUnit(null);
    setShowWinModal(false);
    let spinCount = 0;
    const maxSpins = 30;

    const spinInterval = setInterval(() => {
      spinCount++;
      const randomIndex = Math.floor(Math.random() * UNITS.length);
      setDisplayedUnit(UNITS[randomIndex]);

      if (spinCount >= maxSpins) {
        clearInterval(spinInterval);

        const weightedUnits: Unit[] = [];
        UNITS.forEach(unit => {
          let weight = 1;
          if (unit.rarity === 'Legendary') weight = 1;
          if (unit.rarity === 'Epic') weight = 5;
          if (unit.rarity === 'Rare') weight = 20;
          if (unit.rarity === 'Common') weight = 40;
          for (let i = 0; i < weight; i++) {
            weightedUnits.push(unit);
          }
        });

        const finalUnit = weightedUnits[Math.floor(Math.random() * weightedUnits.length)];
        setWonUnit(finalUnit);
        game.addToInventory(finalUnit);
        setIsSpinning(false);
        setDisplayedUnit(finalUnit);
        setTimeout(() => setShowWinModal(true), 300);
      }
    }, 100);
  }, [isSpinning, game]);

  const closeModal = () => {
    setShowWinModal(false);
    setWonUnit(null);
    setDisplayedUnit(null);
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh] animate-fadeIn">
      <h1 className="font-pixel text-4xl text-center mb-2 text-accent-purple">Casino</h1>
      <p className="text-center text-text-dark mb-8 font-pixel text-lg">Cost: {CASINO_COST} душа</p>

      <div className="relative w-48 h-64 mb-8 flex items-center justify-center">
        {displayedUnit ? (
          <div className={`transition-all duration-300 transform ${wonUnit ? 'scale-110' : ''}`}>
            <UnitCard unit={displayedUnit} />
          </div>
        ) : (
          <div className="w-48 h-64 bg-black/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border-dark">
            <span className="font-pixel text-text-dark text-xl">?</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || !game || game.balance < CASINO_COST}
        className="pixel-button-green font-pixel text-2xl px-8 py-4 disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-600 disabled:shadow-none"
      >
        {isSpinning ? 'Spinning...' : 'Spin!'}
      </button>
      {game && game.balance < CASINO_COST && !isSpinning && (
         <p className="text-accent-red mt-4 font-pixel text-lg">Not enough souls</p>
      )}

      {/* Win Modal */}
      {showWinModal && wonUnit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="win-modal-container scanlines-bg">
             <div className="mx-auto w-40 h-56 mb-4">
                <UnitCard unit={wonUnit} />
             </div>
             <p className="font-pixel text-xl mt-4 mb-6">{wonUnit.name}</p>
             <button
                onClick={closeModal}
                className="pixel-button-glow w-full"
             >
                Awesome!
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasinoPage;