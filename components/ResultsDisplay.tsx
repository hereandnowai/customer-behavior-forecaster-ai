import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  results: AnalysisResult[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--hnai-interface-bg)]/70 backdrop-blur-md shadow-xl rounded-lg p-6 mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-[var(--hnai-primary)]">
        <span role="img" aria-label="brain" className="mr-2 filter hue-rotate(20deg) saturate(5)">🧠</span> {/* Adjusted emoji color slightly if possible */}
        Analysis Results
      </h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-[var(--hnai-secondary)] bg-[var(--hnai-interface-bg)]">
          <thead className="bg-[var(--hnai-secondary)]/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[var(--hnai-primary-text-on-secondary)] uppercase tracking-wider">Customer ID</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[var(--hnai-primary-text-on-secondary)] uppercase tracking-wider">Purchase Score</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[var(--hnai-primary-text-on-secondary)] uppercase tracking-wider">Churn Risk</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[var(--hnai-primary-text-on-secondary)] uppercase tracking-wider">Segment</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[var(--hnai-primary-text-on-secondary)] uppercase tracking-wider">Next Best Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--hnai-secondary)]">
            {results.map((result, index) => (
              <tr key={result.customerId + index} className="hover:bg-[var(--hnai-secondary)]/60 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--hnai-light-text-on-secondary)]">{result.customerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.purchaseScore}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.churnRisk}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{result.segment}</td>
                <td className="px-6 py-4 text-sm text-gray-300 min-w-[250px]">{result.nextBestAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {results.length === 0 && (
          <p className="text-center text-gray-400 py-8">No analysis results to display yet.</p>
        )}
    </div>
  );
};