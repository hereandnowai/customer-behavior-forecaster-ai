import React, { useState } from 'react';
import { FileUploadSection } from './FileUploadSection';
import { ManualEntrySection } from './ManualEntrySection';
import type { CustomerDataInput } from '../types';

interface InputTabsProps {
  onDataLoaded: (data: CustomerDataInput[]) => void;
  onAddCustomer: (customer: CustomerDataInput) => void;
  currentCustomersCount: number;
}

export const InputTabs: React.FC<InputTabsProps> = ({ onDataLoaded, onAddCustomer, currentCustomersCount }) => {
  const [activeTab, setActiveTab] = useState<'csv' | 'manual'>('csv');

  const commonTabStyle = "py-3 px-6 font-medium text-lg rounded-t-lg transition-all duration-300 ease-in-out focus:outline-none";
  const activeTabStyle = "bg-[var(--hnai-primary)] text-[var(--hnai-text-on-primary)] shadow-md";
  const inactiveTabStyle = "bg-[var(--hnai-interface-bg)] hover:bg-[var(--hnai-secondary)] text-[var(--hnai-light-text-on-secondary)]";

  return (
    <div className="bg-[var(--hnai-interface-bg)]/70 backdrop-blur-md shadow-xl rounded-lg p-6">
      <div className="flex border-b border-[var(--hnai-secondary)] mb-6">
        <button
          onClick={() => setActiveTab('csv')}
          className={`${commonTabStyle} ${activeTab === 'csv' ? activeTabStyle : inactiveTabStyle}`}
          aria-pressed={activeTab === 'csv'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 inline-block">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Upload CSV
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`${commonTabStyle} ${activeTab === 'manual' ? activeTabStyle : inactiveTabStyle}`}
          aria-pressed={activeTab === 'manual'}
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 inline-block">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Manual Entry
        </button>
      </div>

      {activeTab === 'csv' && <FileUploadSection onDataLoaded={onDataLoaded} />}
      {activeTab === 'manual' && <ManualEntrySection onAddCustomer={onAddCustomer} />}
    </div>
  );
};