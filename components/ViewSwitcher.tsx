import React from 'react';

export type View = 'input' | 'dashboard';

interface ViewSwitcherProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ activeView, setActiveView }) => {
  const commonTabStyle = "py-3 px-6 font-medium text-lg rounded-md transition-all duration-300 ease-in-out focus:outline-none flex items-center shadow-md";
  const activeTabStyle = "bg-[var(--hnai-primary)] text-[var(--hnai-text-on-primary)]";
  const inactiveTabStyle = "bg-[var(--hnai-interface-bg)] hover:bg-[var(--hnai-secondary)] text-[var(--hnai-light-text-on-secondary)]";

  return (
    <div className="flex justify-center space-x-4 mb-8">
      <button
        onClick={() => setActiveView('input')}
        className={`${commonTabStyle} ${activeView === 'input' ? activeTabStyle : inactiveTabStyle}`}
        aria-pressed={activeView === 'input'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3 3m0 0-3 3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        Data Input
      </button>
      <button
        onClick={() => setActiveView('dashboard')}
        className={`${commonTabStyle} ${activeView === 'dashboard' ? activeTabStyle : inactiveTabStyle}`}
        aria-pressed={activeView === 'dashboard'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
        Dashboard
      </button>
    </div>
  );
};