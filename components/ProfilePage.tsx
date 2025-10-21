import React, { useContext, useState } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import UnitCard from './UnitCard';
import { GameContext } from '../App';
import { BALANCE_ICON } from '../constants';
import UnitDetailModal from './UnitDetailModal';
import { Unit } from '../types';

const ProfilePage: React.FC = () => {
  const { user } = useTelegram();
  const game = useContext(GameContext);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const openModal = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const closeModal = () => {
    setSelectedUnit(null);
  };

  return (
    <>
      <div className="p-2 animate-fadeIn">
        <div className="pixel-border">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 p-2 bg-black/30 border-b-2 border-border-dark">
              <div className="flex items-center">
                  <div className="w-12 h-12 bg-black/30 mr-3 border-2 border-border-dark flex items-center justify-center">
                      <svg className="w-8 h-8 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <div>
                      <p className="font-pixel text-lg">{user?.first_name || 'Guest'}</p>
                      <p className="text-sm text-text-dark">@{user?.username || 'unknown'}</p>
                  </div>
              </div>
              <div className="flex items-center justify-center bg-black/30 p-2 border-2 border-border-dark">
                  <img src={BALANCE_ICON} alt="Souls" className="w-6 h-6 mr-3"/>
                  <p className="font-pixel text-2xl text-accent-yellow">{game?.balance.toLocaleString()}</p>
              </div>
          </div>

          {/* Inventory Section */}
          <div className="flex justify-between items-center mb-4">
              <h1 className="font-pixel text-lg text-text-light">Инвентарь ({game?.inventory.length})</h1>
          </div>

          {game && game.inventory.length > 0 ? (
            <div className="h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {game.inventory.map((unit, index) => (
                  <UnitCard
                    key={`${unit.id}-${index}`}
                    unit={unit}
                    onClick={() => openModal(unit)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-center py-10 px-4 bg-black/30 border-2 border-dashed border-border-dark">
              <div>
                <p className="text-text-dark font-pixel text-sm">Инвентарь пуст.</p>
                <p className="text-text-dark/50 mt-2 text-sm">Выигрывайте юнитов в казино!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <UnitDetailModal 
        isOpen={!!selectedUnit} 
        unit={selectedUnit} 
        onClose={closeModal} 
      />
    </>
  );
};

export default ProfilePage;
