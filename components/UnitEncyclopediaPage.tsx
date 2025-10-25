
import React, { useState } from 'react';
import { Unit, Rarity } from '../types';
import UnitDetailModal from './UnitDetailModal';


type WikiView = 'main' | 'units' | 'coming_soon' | 'faz_rating';

interface UnitEncyclopediaPageProps {
  setView: (view: WikiView) => void;
  title: string;
}

const rarities = {
  // FIX: Add styling for the Common rarity.
  [Rarity.Common]: { text: 'Common', colors: ["#d1d5db", "#9ca3af"] },
  [Rarity.Uncommon]: { text: 'Uncommon', colors: ["#5cff4d", "#40ff8e"] },
  [Rarity.Rare]: { text: 'Rare', colors: ["#58a5fe", "#1d3ca2"] },
  [Rarity.Epic]: { text: 'Epic', colors: ["#fe35fe", "#8800a0"] },
  [Rarity.Mythic]: { text: 'Mythic', colors: ["#ffff00", "#ffb81f"] },
  [Rarity.Secret]: { text: 'Secret', colors: ["#ff0e0c", "#ff8800"] },
  [Rarity.Nightmare]: { text: 'Nightmare', colors: ["#492590", "#2b1e44"] },
  [Rarity.Hero]: { text: 'Hero', colors: ["#fbca19", "#fbf783"] },
  [Rarity.Legendary]: { text: 'Legendary', colors: ["#f28500", "#e6df2f"]},
};

const RarityTag: React.FC<{ rarityKey: Rarity }> = ({ rarityKey }) => {
  const rarity = rarities[rarityKey];
  if (!rarity) return null;
  return (
    <span style={{ color: rarity.colors[0], textShadow: `0 0 5px ${rarity.colors[1]}`}} className="font-bold">
      {rarity.text}
    </span>
  );
};

const getFullImageUrl = (thumbUrl: string): string => {
    return `https:${thumbUrl.replace('/thumb', '').replace(/\/\d+px-.*$/, '')}`;
}

const unitData: Unit[] = [
    { id: 101, name: 'Freddy', rarity: Rarity.Uncommon, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/42/Unit_Freddy.png/50px-Unit_Freddy.png'), cost: 100, description: 'The face of Fazbear Entertainment. A reliable frontman.' },
    { id: 102, name: 'Chica', rarity: Rarity.Uncommon, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/e/e8/Unit_Chica.png/50px-Unit_Chica.png'), cost: 100, description: 'Loves pizza and serves up some decent damage.' },
    { id: 103, name: 'Bonnie', rarity: Rarity.Uncommon, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/4/43/Unit_Bonnie.png/50px-Unit_Bonnie.png'), cost: 100, description: 'A rockstar rabbit with a killer guitar solo.' },
    { id: 104, name: 'Foxy', rarity: Rarity.Uncommon, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/9/9e/Unit_Foxy.png/50px-Unit_Foxy.png'), cost: 120, description: 'A swift pirate fox who rushes down his enemies.' },
    { id: 105, name: 'JJ', rarity: Rarity.Rare, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/c/c1/Unit_JJ.png/50px-Unit_JJ.png'), cost: 250, description: 'Similar to Balloon Boy, JJ hides under the desk and disables threats.' },
    { id: 106, name: 'PaperPals', rarity: Rarity.Rare, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/b6/Unit_Paper_Pals.png/50px-Unit_Paper_Pals.png'), cost: 200, description: 'A trio of paper decorations that somehow are able to fight.' },
    { id: 107, name: 'Toy Freddy', rarity: Rarity.Epic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/8a/Unit_Toy_Freddy.png/50px-Unit_Toy_Freddy.png'), cost: 400, description: 'A polished, plastic version of Freddy, but don\'t let his friendly look fool you.' },
    { id: 108, name: 'Toy Bonnie', rarity: Rarity.Epic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a6/Unit_Toy_Bonnie.png/50px-Unit_Toy_Bonnie.png'), cost: 400, description: 'This blue bunny has a shiny guitar and an even shinier glare.' },
    { id: 109, name: 'Withered Chica', rarity: Rarity.Epic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/c/cc/Unit_Withered_Chica.png/50px-Unit_Withered_Chica.png'), cost: 450, description: 'A broken down but still dangerous animatronic with a horrific jaw.' },
    { id: 110, name: 'Balloon Boy', rarity: Rarity.Epic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/b5/Unit_Balloon_Boy.png/50px-Unit_Balloon_Boy.png'), cost: 350, description: 'His laughter is your nightmare. A master of disruption.' },
    { id: 111, name: 'Cupcake', rarity: Rarity.Epic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/7/78/Unit_Cupcake.png/50px-Unit_Cupcake.png'), cost: 300, description: 'More than just a tasty treat, this cupcake packs a surprising punch.' },
    { id: 112, name: 'Toy Chica', rarity: Rarity.Mythic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/3b/Unit_Toy_Chica.png/50px-Unit_Toy_Chica.png'), cost: 800, description: 'She\'s got a sweet tooth for destruction.' },
    { id: 113, name: 'Withered Bonnie', rarity: Rarity.Mythic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/c/c3/Unit_Withered_Bonnie.png/50px-Unit_Withered_Bonnie.png'), cost: 850, description: 'Faceless and relentless, he strikes fear and heavy damage.' },
    { id: 114, name: 'Endo 01', rarity: Rarity.Mythic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/a/a1/Unit_Endo_01.png/50px-Unit_Endo_01.png'), cost: 750, description: 'The basic endoskeleton, a versatile and adaptable fighter.' },
    { id: 115, name: 'Fazcade', rarity: Rarity.Mythic, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/6/6e/Unit_Fazcade.png/50px-Unit_Fazcade.png'), cost: 900, description: 'A walking arcade machine that shoots out high-score-breaking projectiles.' },
    { id: 116, name: 'Party Glock Freddy', rarity: Rarity.Secret, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/8/85/Unit_Party_Glock_Freddy.png/50px-Unit_Party_Glock_Freddy.png'), cost: 1500, description: 'This party animal brought more than just cake.' },
    { id: 117, name: 'Withered Foxy', rarity: Rarity.Secret, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/3/32/Unit_Withered_Foxy.png/50px-Unit_Withered_Foxy.png'), cost: 1600, description: 'Even more broken, yet faster and deadlier than ever.' },
    { id: 118, name: 'Shadow Freddy', rarity: Rarity.Secret, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/0/00/Unit_Shadow_Freddy.png/50px-Unit_Shadow_Freddy.png'), cost: 2000, description: 'A mysterious purple bear that can crash the game... and your enemies.' },
    { id: 119, name: 'Withered Freddy', rarity: Rarity.Secret, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/b7/Unit_Withered_Freddy.png/50px-Unit_Withered_Freddy.png'), cost: 1400, description: 'The leader is back, and he\'s not happy.' },
    { id: 120, name: 'Endo 02', rarity: Rarity.Secret, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/b/b5/Unit_Endo_02.png/50px-Unit_Endo_02.png'), cost: 1200, description: 'An upgraded endoskeleton with superior combat abilities.' },
    { id: 121, name: 'Mangle', rarity: Rarity.Nightmare, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/0/0d/Unit_Mangle.png/50px-Unit_Mangle.png'), cost: 5000, description: 'A chaotic mess of parts that attacks from the ceiling. Yes.' },
    { id: 122, name: 'Golden Freddy', rarity: Rarity.Hero, image: getFullImageUrl('//static.wikitide.net/fivenightstowerdefense2wiki/thumb/f/fe/Unit_Golden_Freddy.png/50px-Unit_Golden_Freddy.png'), cost: 10000, description: 'It\'s me. A ghostly bear with reality-bending powers.' },
];

const UnitWikiCard: React.FC<{ unit: Unit; onClick: () => void }> = ({ unit, onClick }) => {
    const rarity = rarities[unit.rarity];
    if (!rarity) return null;
    return (
        <button onClick={onClick} className="flex flex-col items-center text-center gap-2 group focus:outline-none">
            <div className="relative aspect-square bg-black/30 p-2 border-2 w-full transition-all duration-200 group-hover:scale-105 group-hover:border-yellow-300" style={{ borderColor: rarity.colors[0], boxShadow: `0 0 8px -2px ${rarity.colors[1]}` }}>
                <img src={unit.image} alt={unit.name} className="w-full h-full object-contain" />
            </div>
            <p className="font-pixel text-xs h-8 transition-colors duration-200 group-hover:text-yellow-300" style={{ color: rarity.colors[0] }}>{unit.name}</p>
        </button>
    );
};


const UnitEncyclopediaPage: React.FC<UnitEncyclopediaPageProps> = ({ setView, title }) => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const openModal = (unit: Unit) => setSelectedUnit(unit);
  const closeModal = () => setSelectedUnit(null);

  return (
    <>
        <div className="scanlines-bg p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-pixel text-lg text-text-light tracking-widest">
                    {title}
                </h1>
                <button onClick={() => setView('main')} className="pixel-button">Back</button>
            </div>
            
            <div className="h-[75vh] overflow-y-auto pr-2 space-y-6">
                <div className="bg-black/20 p-4 border-2 border-border-dark">
                    <p className="text-text-light">
                        {/* FIX: Update rarity count and list to include Common and Legendary. */}
                        Units are the main Mechanic of the game. There are currently 9 Rarities of Units: <RarityTag rarityKey={Rarity.Common} />, <RarityTag rarityKey={Rarity.Uncommon} />, <RarityTag rarityKey={Rarity.Rare} />, <RarityTag rarityKey={Rarity.Epic} />, <RarityTag rarityKey={Rarity.Mythic} />, <RarityTag rarityKey={Rarity.Secret} />, <RarityTag rarityKey={Rarity.Nightmare} />, <RarityTag rarityKey={Rarity.Hero} />, and <RarityTag rarityKey={Rarity.Legendary} />.
                    </p>
                </div>
                
                <div>
                    <h2 className="font-pixel text-xl text-accent-green mb-3">Obtainability</h2>
                    <div className="bg-black/20 p-4 border-2 border-border-dark">
                        <p className="text-text-light">
                            Units are obtained through <a onClick={(e) => { e.preventDefault(); setView('coming_soon');}} className="text-accent-green underline cursor-pointer hover:text-accent-yellow">Summoning</a>.
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="font-pixel text-xl text-accent-green mb-3">List of Units</h2>
                    <div className="bg-black/20 p-4 border-2 border-border-dark">
                        <h3 className="font-pixel text-lg text-accent-purple mb-4 tracking-widest">Season 1</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {unitData.map((unit) => (
                                <UnitWikiCard key={unit.id} unit={unit} onClick={() => openModal(unit)} />
                            ))}
                        </div>
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

export default UnitEncyclopediaPage;
