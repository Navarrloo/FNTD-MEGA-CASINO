import React, { useState } from 'react';
import { UNITS } from '../constants';
import UnitCard from './UnitCard';
import UnitDetailModal from './UnitDetailModal';
import { Unit } from '../types';

const WikiPage: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const openModal = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const closeModal = () => {
    setSelectedUnit(null);
  };

  return (
    <>
      <div className="animate-fadeIn encyclopedia-container">
        <div className="scanlines-bg p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-pixel text-lg text-text-light tracking-widest">
              UNIT ENCYCLOPEDIA ({UNITS.length})
            </h1>
          </div>
          
          <div className="h-[75vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-3 gap-3">
                {UNITS.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    onClick={() => openModal(unit)}
                  />
                ))}
              </div>
            </div>
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

export default WikiPage;
