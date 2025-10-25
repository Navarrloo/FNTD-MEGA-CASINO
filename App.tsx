


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
type DbStatus = 'connecting' | 'ok' | 'error';

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
  const [dbStatus, setDbStatus] = useState<DbStatus>('connecting');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (!supabase) {
        console.error("Supabase client is not initialized. Check lib/supabase.ts");
        setDbStatus('error');
        setConnectionError("Supabase client failed to initialize. Check the browser console for details.");
        return;
      }
      
      const { error } = await supabase.from('profiles').select('id').limit(1);

      if (error) {
        setConnectionError(error.message);
        const isFatalError = 
            error.message.includes('Failed to fetch') || 
            error.message.includes('JWT') ||
            error.message.includes('Invalid API key');
        
        if (isFatalError) {
           console.error("Supabase connection error:", error.message);
           setDbStatus('error');
        } else {
           console.warn("Supabase query warning (e.g., RLS or missing table):", error.message);
           setDbStatus('ok'); 
        }
      } else {
         setDbStatus('ok');
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (dbStatus !== 'ok' || !supabase) return;

    if (!user) {
        if (window.Telegram?.WebApp?.initData === "") setIsLoading(false);
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
  }, [user, dbStatus]);

  const addToInventory = useCallback(async (unit: Unit) => {
    if (!user || !supabase) return;
    
    setInventory(current => [...current, unit]);

    const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('inventory')
        .eq('id', user.id)
        .single();
    
    if (fetchError) {
        console.error('Error fetching inventory before update:', fetchError);
        setInventory(current => current.slice(0, -1));
        return;
    }

    const dbInventory = data && Array.isArray(data.inventory) ? data.inventory : [];
    const newInventory = [...dbInventory, unit];
    
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ inventory: newInventory })
        .eq('id', user.id);
    
    if (updateError) {
        console.error("Failed to update inventory in DB:", updateError);
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
    if (!user || !supabase) return;
    const oldBalance = balance;
    setBalance(newBalance); 

    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', user.id);

    if (error) {
      console.error("Failed to update balance", error);
      setBalance(oldBalance);
    }
  }, [balance, user]);

  const isAdmin = useMemo(() => {
    if (!user?.username) return false;
    return ADMIN_USERNAMES.includes(user.username.toUpperCase());
  }, [user]);

  const renderPage = () => {
    if (dbStatus === 'connecting') {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="font-pixel text-xl animate-pulse">Connecting to Database...</p>
            </div>
        );
    }

    if (dbStatus === 'error') {
        const isCorsError = connectionError?.includes('Failed to fetch');
        return (
             <div className="p-4 flex items-center justify-center h-full">
               <div className="pixel-border bg-red-900/50 max-w-md text-center border-red-500">
                <h1 className="font-pixel text-2xl text-accent-red mb-4">DATABASE CONNECTION ERROR</h1>
                {isCorsError ? (
                  <>
                    <p className="text-text-light text-lg">
                      This is likely a <span className="text-accent-yellow">CORS issue</span>. Your Supabase project is not configured to allow requests from this domain.
                    </p>
                    <p className="mt-4 text-text-dark text-base">
                      To fix this, go to your <span className="text-white">Supabase Dashboard</span>:
                    </p>
                    <ol className="text-left text-sm text-text-light list-decimal list-inside mt-2 space-y-1">
                        <li>Navigate to <span className="text-white">Project Settings</span> &gt; <span className="text-white">API</span>.</li>
                        <li>Find the <span className="text-white">CORS settings</span> section.</li>
                        <li>Add your app's URL to the list of allowed origins. For testing, you can use <code className="bg-black/50 p-1 rounded-sm">*</code> to allow all domains.</li>
                    </ol>
                  </>
                ) : (
                  <>
                    <p className="text-text-light text-lg">
                      Could not connect to the Supabase database.
                    </p>
                    <p className="mt-2 text-text-dark text-base">
                      Please check your credentials in <code className="bg-black/50 p-1 rounded-sm">lib/supabase.ts</code> and ensure your Supabase project is running.
                    </p>
                    <p className="text-xs text-text-dark/70 mt-4">Error: {connectionError}</p>
                  </>
                )}
              </div>
            </div>
        )
    }

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