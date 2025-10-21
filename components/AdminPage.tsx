import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TelegramUser, Unit } from '../types';
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
    if (!searchTerm) return;
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
    if (!foundUser || soulsToAdd <= 0) return;
    
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
    if (!foundUser || !selectedUnit) return;
    
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
    if (!foundUser) return;
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
      {/* Fix: Cast style object to React.CSSProperties to allow custom CSS properties. */}
      <div className="pixel-border" style={{'--background-med': '#1e1e1e'} as React.CSSProperties}>
        {/* Search Bar */}
        <div className="relative z-10 flex items-center gap-2 p-1 bg-black/50 border-2 border-[#111]">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Robzigame2sos"
                className="flex-grow bg-transparent focus:outline-none px-2 py-1 text-lg text-white"
            />
            <button onClick={handleSearch} className="px-4 py-1 text-lg bg-gradient-to-b from-[#6b8afd] to-[#4661b3] border-2 border-t-[#8aa7ff] border-l-[#8aa7ff] border-r-[#33468b] border-b-[#33468b] text-white">
                {isLoading ? '...' : 'НАЙТИ ИГРОКА'}
            </button>
        </div>

        {message && <p className="text-center my-2 text-yellow-300">{message}</p>}

        {/* Player Info & Actions */}
        {foundUser && (
            <div className="mt-4 p-2 bg-black/50 border-2 border-[#111]">
                {/* User Info */}
                <div className="flex items-start border-b-2 border-gray-700 pb-2">
                    <img src={UNITS[0].image} alt="avatar" className="w-16 h-16 mr-4 border-2 border-gray-600"/>
                    <div>
                        <h2 className="text-xl text-white">{foundUser.first_name}</h2>
                        <p className="text-sm text-gray-400">@{foundUser.username} [{foundUser.id}]</p>
                        <p className="text-sm text-green-400">STATUS: CLEAR</p>
                    </div>
                    <p className="ml-auto text-lg text-gray-400">ONLINE</p>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                    {/* Left Side */}
                    <div>
                        <div className="flex items-center gap-2">
                           <input type="number" value={soulsToAdd} onChange={e => setSoulsToAdd(parseInt(e.target.value, 10) || 0)} className="bg-gray-800 border border-gray-600 w-24 px-2 py-1 text-white"/>
                           <button onClick={handleAddSouls} className="flex-grow px-2 py-1 text-lg bg-yellow-600 text-white border-2 border-yellow-400">Дать души</button>
                        </div>
                         <button onClick={handleClearInventory} className="w-full mt-2 px-4 py-1 text-lg bg-gradient-to-b from-[#6b8afd] to-[#4661b3] border-2 border-t-[#8aa7ff] border-l-[#8aa7ff] border-r-[#33468b] border-b-[#33468b] text-white">
                            ПОЧИСТИТЬ ИНВЕНТАРЬ
                         </button>
                    </div>

                    {/* Right Side - Give Unit */}
                    <div className="bg-black/40 p-1 border border-gray-700">
                        <h3 className="text-center text-gray-400 border-b border-gray-700 mb-1">GIVE</h3>
                        <div className="h-24 overflow-y-auto">
                            {UNITS.map(unit => (
                                <p key={unit.id} onClick={() => setSelectedUnit(unit)} className={`cursor-pointer px-1 ${selectedUnit?.id === unit.id ? 'bg-green-700 text-white' : 'hover:bg-gray-700'}`}>
                                    {unit.name}
                                </p>
                            ))}
                        </div>
                         <button onClick={handleGiveUnit} disabled={!selectedUnit} className="w-full mt-1 px-4 py-1 text-lg bg-gradient-to-b from-[#71e582] to-[#489b58] border-2 border-t-[#96f4a5] border-l-[#96f4a5] border-r-[#377943] border-b-[#377943] text-black disabled:from-gray-600 disabled:to-gray-800 disabled:cursor-not-allowed">
                            ВЫДАТЬ
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