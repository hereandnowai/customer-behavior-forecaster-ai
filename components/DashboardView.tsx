import React from 'react';
import type { AnalysisResult, CustomerDataInput } from '../types';
import { KPIReport } from './KPIReport';
import { CustomerSegmentationChart } from './charts/CustomerSegmentationChart';
import { ChurnPurchaseScatterPlot } from './charts/ChurnPurchaseScatterPlot';
import { ProductPreferencesChart } from './charts/ProductPreferencesChart';
import { BehaviorDistributionCharts } from './charts/BehaviorDistributionCharts';

interface DashboardViewProps {
  analysisResults: AnalysisResult[];
  customersInput: CustomerDataInput[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ analysisResults, customersInput }) => {
  if (analysisResults.length === 0) {
    return (
      <div className="bg-[var(--hnai-interface-bg)]/70 backdrop-blur-md shadow-xl rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-[var(--hnai-primary)] mb-4">Dashboard</h2>
        <p className="text-[var(--hnai-light-text-on-secondary)]/80">
          No analysis data available. Please go to the "Data Input" tab, add customer data, and click "Analyze Customer Data" to populate the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <KPIReport analysisResults={analysisResults} customersInput={customersInput} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--hnai-interface-bg)]/70 backdrop-blur-md shadow-xl rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-[var(--hnai-primary)]">Customer Segmentation</h3>
          <CustomerSegmentationChart analysisResults={analysisResults} />
        </div>
        <div className="bg-[var(--hnai-interface-bg)]/70 backdrop-blur-md shadow-xl rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-[var(--hnai-primary)]">Churn Risk vs. Purchase Score</h3>
          <ChurnPurchaseScatterPlot analysisResults={analysisResults} />
        </div>
      </div>

      <div className="bg-[var(--hnai-interface-bg)]/70 backdrop-blur-md shadow-xl rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-[var(--hnai-primary)]">Top Product Preferences</h3>
        <ProductPreferencesChart customersInput={customersInput} />
      </div>
      
      <div className="bg-[var(--hnai-interface-bg)]/70 backdrop-blur-md shadow-xl rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-[var(--hnai-primary)]">Behavior Distributions</h3>
        <BehaviorDistributionCharts customersInput={customersInput} />
      </div>
    </div>
  );
};