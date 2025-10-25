import React from 'react';
import FazRatingPage from './FazRatingPage';
import UnitEncyclopediaPage from './UnitEncyclopediaPage';

// FIX: Define a specific type for the view state to ensure type safety.
type WikiView = 'main' | 'units' | 'coming_soon' | 'faz_rating';

interface WikiButtonProps {
  label: string;
  imageUrl: string;
  onClick: () => void;
}

const WikiButton: React.FC<WikiButtonProps> = ({ label, imageUrl, onClick }) => (
  <button onClick={onClick} className="wiki-button">
    <img src={imageUrl} alt={label} />
    <span>{label}</span>
  </button>
);

// FIX: Use 'as const' to infer the narrowest possible types for 'view' properties,
// ensuring they are compatible with the WikiView type.
const wikiNav = {
  gameContent: [
    { label: 'Faz-Rating', view: 'faz_rating', imageUrl: 'https://static.wikitide.net/fivenightstowerdefense2wiki/3/34/Button_Faz-Rating.png' },
    { label: 'Units', view: 'units', imageUrl: 'https://static.wikitide.net/fivenightstowerdefense2wiki/e/ef/Button_Units.png' },
    { label: 'Items', view: 'coming_soon', imageUrl: 'https://static.wikitide.net/fivenightstowerdefense2wiki/a/af/Button_Items.png' },
    { label: 'Quests', view: 'coming_soon', imageUrl: 'https://static.wikitide.net/fivenightstowerdefense2wiki/5/53/Button_Quests.png' },
  ],
  wikiContent: [
     { label: 'Guidelines', view: 'coming_soon', imageUrl: 'https://static.wikitide.net/fivenightstowerdefense2wiki/d/de/Button_Guidelines.png' },
     { label: 'Staff', view: 'coming_soon', imageUrl: 'https://static.wikitide.net/fivenightstowerdefense2wiki/0/02/Button_Staff.png' },
  ]
} as const;

const ComingSoonView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="scanlines-bg p-4 h-full flex flex-col items-center justify-center">
    <h1 className="font-pixel text-3xl text-accent-yellow mb-4">COMING SOON</h1>
    <p className="text-text-dark text-center mb-8">This section is under construction.</p>
    <button onClick={onBack} className="pixel-button-yellow">Back to Wiki</button>
  </div>
);

// FIX: Update the 'setView' prop to use the specific WikiView type instead of a generic string.
const WikiMenuView: React.FC<{ setView: (view: WikiView) => void }> = ({ setView }) => (
  <div className="scanlines-bg p-4">
      <h1 className="font-pixel text-xl text-text-light tracking-widest text-center mb-6">FNTD 2 WIKI</h1>
      
      <h2 className="font-pixel text-lg text-accent-green mb-3">Game Content</h2>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {wikiNav.gameContent.map(item => (
           <WikiButton key={item.label} {...item} onClick={() => setView(item.view)} />
        ))}
      </div>

      <h2 className="font-pixel text-lg text-accent-purple mb-3">Wiki Content</h2>
      <div className="grid grid-cols-4 gap-3">
        {wikiNav.wikiContent.map(item => (
           <WikiButton key={item.label} {...item} onClick={() => setView(item.view)} />
        ))}
      </div>
  </div>
);


const WikiPage: React.FC = () => {
  const [view, setView] = React.useState<WikiView>('main');

  const renderContent = () => {
    switch(view) {
      case 'units':
        return <UnitEncyclopediaPage setView={setView} title="Unit Encyclopedia" />;
      case 'coming_soon':
        return <ComingSoonView onBack={() => setView('main')} />;
      case 'faz_rating':
        return <FazRatingPage setView={setView} title="FAZ-RATING PROGRESSION" />;
      case 'main':
      default:
        return <WikiMenuView setView={setView} />;
    }
  }

  return (
    <div className="animate-fadeIn encyclopedia-container">
       {renderContent()}
    </div>
  );
};

export default WikiPage;