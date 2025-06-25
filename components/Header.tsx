import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-[var(--hnai-secondary)]/80 backdrop-blur-md shadow-lg p-6 text-center">
      <div className="container mx-auto">
        <img 
          src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png" 
          alt="HERE AND NOW AI - Artificial Intelligence Research Institute" 
          className="h-20 md:h-24 mx-auto mb-4"
        />
        <p className="text-[var(--hnai-primary-text-on-secondary)] mt-2 text-lg italic">
          designed with passion for innovation
        </p>
      </div>
    </header>
  );
};