import React, { useState, useMemo, createContext, useEffect, useCallback } from 'react';
import { useTelegram } from './hooks/useTelegram';
import { ADMIN_USERNAMES, STARTING_BALANCE, UNITS } from './constants';
import NavBar from './components/NavBar';
import MainPage from './components/MainPage';
import CasinoPage from './components/CasinoPage';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import WikiPage from './components/WikiPage';
import { Unit } from './types';
import { supabase } from './lib/supabase';

type Page = 'main' | 'wiki' | 'casino' | 'profile' | 'admin';

interface GameContextType {
  balance: number;
  updateBalance: (newBalance: number) => Promise<void>;
  inventory: Unit[];
  addToInventory: (unit: Unit) => Promise<void>;
  isLoading: boolean;
}

export const GameContext = createContext<GameContextType | null>(null);

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('main');
  const { user } = useTelegram();
  const [balance, setBalance] = useState<number>(0);
  const [inventory, setInventory] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
        // Handle case where user is not logged in or data is not available yet
        if (window.Telegram?.WebApp?.initData === "") setIsLoading(false); // If no user data, stop loading
        return;
    };

    const loadUserProfile = async () => {
        setIsLoading(true);
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
            console.error('Error fetching profile', error);
            setIsLoading(false);
            return;
        }

        if (profile) {
            setBalance(profile.balance);
            // Inventory from Supabase should already contain full unit objects.
            // Just ensure it's an array.
            const userInventory = Array.isArray(profile.inventory) ? profile.inventory : [];
            setInventory(userInventory);
        } else {
            const { data: newProfile, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    username: user.username,
                    first_name: user.first_name,
                    balance: STARTING_BALANCE,
                    inventory: [],
                })
                .select()
                .single();
            
            if (insertError) {
                console.error('Error creating profile', insertError);
            } else if (newProfile) {
                setBalance(newProfile.balance);
                setInventory(newProfile.inventory || []);
            }
        }
        setIsLoading(false);
    };

    loadUserProfile();
  }, [user]);

  const addToInventory = useCallback(async (unit: Unit) => {
    if (!user) return;
    
    // Optimistic UI update using functional form
    setInventory(current => [...current, unit]);

    // To prevent race conditions, fetch the latest inventory from DB, append, and then update.
    const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('inventory')
        .eq('id', user.id)
        .single();
    
    if (fetchError) {
        console.error('Error fetching inventory before update:', fetchError);
        // Revert by removing the last added unit. This is brittle but simple.
        setInventory(current => current.slice(0, -1));
        return;
    }

    const dbInventory = Array.isArray(data.inventory) ? data.inventory : [];
    const newInventory = [...dbInventory, unit];
    
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ inventory: newInventory })
        .eq('id', user.id);
    
    if (updateError) {
        console.error("Failed to update inventory in DB:", updateError);
        // Revert by refetching the true state from DB. This is the safest revert.
        const { data: revertData, error: revertError } = await supabase
            .from('profiles')
            .select('inventory')
            .eq('id', user.id)
            .single();
        if (!revertError && revertData) {
            setInventory(Array.isArray(revertData.inventory) ? revertData.inventory : []);
        }
    }
  }, [user]);

  const updateBalance = useCallback(async (newBalance: number) => {
    if (!user) return;
    const oldBalance = balance;
    setBalance(newBalance); // Optimistic update

    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    if (error) {
      console.error("Failed to update balance", error);
      setBalance(oldBalance); // Revert
    }
  }, [balance, user]);

  const isAdmin = useMemo(() => {
    if (!user?.username) return false;
    return ADMIN_USERNAMES.includes(user.username.toUpperCase());
  }, [user]);

  const renderPage = () => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="font-pixel text-xl animate-pulse">Loading Profile...</p>
            </div>
        );
    }
    switch (activePage) {
      case 'main':
        return <MainPage />;
      case 'wiki':
        return <WikiPage />;
      case 'casino':
        return <CasinoPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <MainPage />;
      default:
        return <MainPage />;
    }
  };

  return (
    <GameContext.Provider value={{ balance, updateBalance, inventory, addToInventory, isLoading }}>
      <div className="bg-transparent min-h-full text-text-light font-pixel selection:bg-accent-green selection:text-background-dark flex flex-col">
        <main className="flex-grow pt-4 px-2 overflow-y-auto pb-24">
          {renderPage()}
        </main>
        <NavBar activePage={activePage} setActivePage={setActivePage} isAdmin={isAdmin} />
      </div>
    </GameContext.Provider>
  );
};

export default App;