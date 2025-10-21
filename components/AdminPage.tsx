import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Unit } from '../types';
import { UNITS } from '../constants';

interface Profile {
  id: number;
  username: string;
  first_name: string;
  balance: number;
  inventory: Unit[];
}

const AdminPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState<Profile | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [soulsToAdd, setSoulsToAdd] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const handleSearch = async () => {
    if (!searchTerm || !supabase) return;
    setIsLoading(true);
    setMessage('');
    setFoundUser(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', searchTerm)
      .single();

    if (error || !data) {
      setMessage(`User "${searchTerm}" not found.`);
      console.error(error);
    } else {
      setFoundUser(data);
    }
    setIsLoading(false);
  };

  const handleAddSouls = async () => {
    if (!foundUser || soulsToAdd <= 0 || !supabase) return;
    
    const newBalance = foundUser.balance + soulsToAdd;
    const { data, error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', foundUser.id)
        .select()
        .single();
    
    if (error) {
        setMessage('Error updating balance.');
    } else {
        setMessage(`${soulsToAdd} souls added to ${foundUser.username}.`);
        setFoundUser(data);
        setSoulsToAdd(0);
    }
  };

  const handleGiveUnit = async () => {
    if (!foundUser || !selectedUnit || !supabase) return;
    
    const currentInventory = Array.isArray(foundUser.inventory) ? foundUser.inventory : [];
    const newInventory = [...currentInventory, selectedUnit];
    
    const { data, error } = await supabase
        .from('profiles')
        .update({ inventory: newInventory })
        .eq('id', foundUser.id)
        .select()
        .single();

    if (error) {
        setMessage('Error giving unit.');
    } else {
        setMessage(`${selectedUnit.name} given to ${foundUser.username}.`);
        setFoundUser(data);
        setSelectedUnit(null);
    }
  };
  
  const handleClearInventory = async () => {
    if (!foundUser || !supabase) return;
    if (!window.confirm(`Are you sure you want to clear inventory for ${foundUser.username}?`)) return;

     const { data, error } = await supabase
        .from('profiles')
        .update({ inventory: [] })
        .eq('id', foundUser.id)
        .select()
        .single();
    
    if (error) {
        setMessage('Error clearing inventory.');
    } else {
        setMessage(`Inventory cleared for ${foundUser.username}.`);
        setFoundUser(data);
    }
  }

  return (
    <div className="p-2 animate-fadeIn">
      <div className="admin-panel-container">
        {/* Header/Search */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl uppercase">{foundUser ? foundUser.username : "Admin Panel"}</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Username"
              className="admin-input w-40"
            />
            <button onClick={handleSearch} disabled={isLoading} className="admin-button admin-button-purple">
              {isLoading ? '...' : 'Найти игрока'}
            </button>
          </div>
        </div>

        {message && <p className="text-center my-2 text-accent-yellow">{message}</p>}

        {foundUser && (
          <div className="scanlines-bg p-2 border border-[#333]">
            {/* User Info */}
            <div className="flex justify-between items-start border-b-2 border-[#333] pb-2 mb-4">
              <div className="flex items-center">
                <img src={UNITS[0].image} alt="avatar" className="w-16 h-16 mr-4 border-2 border-[#333]"/>
                <div>
                  <h2 className="text-xl text-white">{foundUser.first_name}</h2>
                  <p className="text-sm text-gray-400">@{foundUser.username} [{foundUser.id}]</p>
                  <p className="text-sm text-green-400">STATUS: CLEAR</p>
                </div>
              </div>
              <p className="text-lg text-gray-400">ONLINE</p>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="flex flex-col gap-2">
                <div className="flex items-stretch gap-2">
                  <input 
                    type="number" 
                    value={soulsToAdd} 
                    onChange={e => setSoulsToAdd(parseInt(e.target.value, 10) || 0)} 
                    className="admin-input w-24 text-center"
                    placeholder="0"
                  />
                  <button onClick={handleAddSouls} className="admin-button admin-button-yellow flex-grow">Дать души</button>
                </div>
                <button onClick={handleClearInventory} className="admin-button admin-button-red">
                  Почистить инвентарь
                </button>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-1">
                <h3 className="text-center text-gray-400 text-sm border-b border-[#333] pb-1">GIVE</h3>
                <div className="admin-list">
                  {UNITS.map(unit => (
                    <p 
                      key={unit.id} 
                      onClick={() => setSelectedUnit(unit)} 
                      className={`admin-list-item ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
                    >
                      {unit.name}
                    </p>
                  ))}
                </div>
                <button onClick={handleGiveUnit} disabled={!selectedUnit} className="admin-button admin-button-gray mt-1">
                  Выдать
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;