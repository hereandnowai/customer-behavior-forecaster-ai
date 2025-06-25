import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputTabs } from './components/InputTabs';
import { ActionButtons } from './components/ActionButtons';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { analyzeBehavior } from './services/geminiService';
import type { CustomerDataInput, AnalysisResult } from './types';
import { ViewSwitcher, type View } from './components/ViewSwitcher';
import { DashboardView } from './components/DashboardView';

const App: React.FC = () => {
  const [customersToAnalyze, setCustomersToAnalyze] = useState<CustomerDataInput[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('input');

  const handleDataLoaded = useCallback((data: CustomerDataInput[]) => {
    setCustomersToAnalyze(prevData => [...prevData, ...data]);
    setError(null); 
  }, []);

  const handleAddCustomer = useCallback((customer: CustomerDataInput) => {
    setCustomersToAnalyze(prev => [...prev, customer]);
    setError(null);
  }, []);

  const handleClearData = useCallback(() => {
    setCustomersToAnalyze([]);
    setAnalysisResults([]);
    setError(null);
    setActiveView('input'); // Switch back to input view when data is cleared
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (customersToAnalyze.length === 0) {
      setError("No customer data to analyze. Please upload a CSV or add data manually.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResults([]); 
    try {
      const results = await analyzeBehavior(customersToAnalyze);
      setAnalysisResults(results);
      setActiveView('dashboard'); // Switch to dashboard after successful analysis
    } catch (err) {
      console.error("Analysis error:", err);
      if (err instanceof Error) {
        setError(`Failed to analyze data: ${err.message}. Ensure your API key is correctly configured.`);
      } else {
        setError("An unknown error occurred during analysis.");
      }
      setActiveView('input'); // Stay on input view or switch back if error
    } finally {
      setIsLoading(false);
    }
  }, [customersToAnalyze]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[var(--hnai-secondary)] via-[#003030] to-[var(--hnai-secondary)] text-[var(--hnai-light-text-on-secondary)]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <ViewSwitcher activeView={activeView} setActiveView={setActiveView} />

        {activeView === 'input' && (
          <>
            <InputTabs 
              onDataLoaded={handleDataLoaded} 
              onAddCustomer={handleAddCustomer} 
              currentCustomersCount={customersToAnalyze.length}
            />
            
            {customersToAnalyze.length > 0 && (
              <div className="bg-[var(--hnai-interface-bg)]/70 backdrop-blur-md shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 text-[var(--hnai-primary)]">Customers Ready for Analysis ({customersToAnalyze.length})</h3>
                <ul className="max-h-60 overflow-y-auto space-y-2 text-sm">
                  {customersToAnalyze.map((cust, index) => (
                    <li key={cust.customerId + '-' + index} className="p-2 bg-[var(--hnai-secondary)] rounded-md shadow flex justify-between items-center">
                      <div>
                        <span className="font-medium text-[var(--hnai-primary-text-on-secondary)]">ID: {cust.customerId}</span>
                        {cust.productPreferences && <span className="text-gray-400 text-xs"> - Prefs: {cust.productPreferences}</span>}
                      </div>
                       {cust.totalPurchaseAmount && <span className="text-xs text-green-400">${cust.totalPurchaseAmount}</span>} {/* Consider a brand color for amount */}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {activeView === 'dashboard' && (
          <DashboardView 
            analysisResults={analysisResults} 
            customersInput={customersToAnalyze} 
          />
        )}
        
        <ActionButtons 
            onAnalyze={handleAnalyze} 
            onClearData={handleClearData} 
            isDisabled={isLoading || (activeView === 'input' && customersToAnalyze.length === 0)} 
        />
        
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}
        
        {activeView === 'input' && analysisResults.length > 0 && !isLoading && (
            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-center text-[var(--hnai-primary)] mb-4">Previous Analysis Results</h2>
                <ResultsDisplay results={analysisResults} />
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;