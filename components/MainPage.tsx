import React from 'react';

const MainPage: React.FC = () => {
  return (
    <div className="p-2 animate-fadeIn flex items-center justify-center h-full">
       <div className="pixel-border bg-background-med/80 backdrop-blur-sm max-w-md text-center">
        <h1 className="font-pixel text-2xl text-accent-green mb-4">Welcome to the FNTD 2 Wiki & Casino!</h1>
        <p className="text-text-dark text-base">
          This Wiki has 9 Pages, 5 Active Users and 710 Total Contributions!
        </p>
        <div className="border-t-2 border-border-dark my-4 mx-8"></div>
        <p className="mt-2 text-text-light text-base">
          Use the nav bar below to explore the Unit Wiki, try your luck at the Casino, or view your Profile inventory.
        </p>
         <p className="mt-4 text-sm text-text-dark/50">
          Good luck!
        </p>
        <div className="border-t-2 border-border-dark my-4 mx-8"></div>
        <p className="text-sm text-accent-purple">
            BOT SPONSOR: @NAVARRLORBX
        </p>
      </div>
    </div>
  );
};

export default MainPage;