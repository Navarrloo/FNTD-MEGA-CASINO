import React from 'react';

const MainPage: React.FC = () => {
  return (
    <div className="p-2 animate-fadeIn flex items-center justify-center h-full">
       <div className="pixel-border bg-background-med/80 backdrop-blur-sm max-w-md text-center">
        <h1 className="font-pixel text-2xl text-accent-green mb-4">ДОБРО ПОЖАЛОВАТЬ!</h1>
        <p className="text-text-light text-lg">
          Это мини-приложение для игры FNTD 2.
        </p>
        <p className="mt-2 text-text-dark text-base">
          Здесь вы можете испытать удачу в казино и собрать свою коллекцию юнитов, которую можно посмотреть в профиле.
        </p>
         <p className="mt-4 text-sm text-text-dark/50">
          Удачи!
        </p>
      </div>
    </div>
  );
};

export default MainPage;