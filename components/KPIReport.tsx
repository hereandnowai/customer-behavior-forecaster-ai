import React from 'react';
import type { AnalysisResult, CustomerDataInput } from '../types';

interface KPIReportProps {
  analysisResults: AnalysisResult[];
  customersInput: CustomerDataInput[];
}

const KPICard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; description?: string }> = ({ title, value, icon, description }) => (
  <div className="bg-[var(--hnai-interface-bg)]/50 backdrop-blur-sm shadow-lg rounded-xl p-6 flex items-center space-x-4 transform hover:scale-105 transition-transform duration-300">
    <div className="p-3 bg-[var(--hnai-primary)]/20 rounded-lg text-[var(--hnai-primary)]">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-[var(--hnai-light-text-on-secondary)]">{value}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  </div>
);

export const KPIReport: React.FC<KPIReportProps> = ({ analysisResults, customersInput }) => {
  const totalCustomers = analysisResults.length;

  const { totalPurchaseSum, validPurchaseCustomers } = customersInput.reduce(
    (acc, customer) => {
      const amount = Number(customer.totalPurchaseAmount);
      if (!isNaN(amount) && analysisResults.some(res => res.customerId === customer.customerId)) {
        acc.totalPurchaseSum += amount;
        acc.validPurchaseCustomers += 1;
      }
      return acc;
    },
    { totalPurchaseSum: 0, validPurchaseCustomers: 0 }
  );
  const avgPurchaseValue = validPurchaseCustomers > 0 ? (totalPurchaseSum / validPurchaseCustomers).toFixed(2) : 'N/A';

  const { totalVisitSum, validVisitCustomers } = customersInput.reduce(
    (acc, customer) => {
      const visits = Number(customer.visitFrequency);
      if (!isNaN(visits) && analysisResults.some(res => res.customerId === customer.customerId)) {
        acc.totalVisitSum += visits;
        acc.validVisitCustomers += 1;
      }
      return acc;
    },
    { totalVisitSum: 0, validVisitCustomers: 0 }
  );
  const avgVisitFrequency = validVisitCustomers > 0 ? (totalVisitSum / validVisitCustomers).toFixed(1) : 'N/A';

  const highChurnRiskThreshold = 60; // 60%
  const highChurnRiskCustomers = analysisResults.filter(r => {
    const risk = parseFloat(r.churnRisk.replace('%', ''));
    return !isNaN(risk) && risk > highChurnRiskThreshold;
  }).length;
  const percentHighChurnRisk = totalCustomers > 0 ? ((highChurnRiskCustomers / totalCustomers) * 100).toFixed(1) + '%' : 'N/A';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard 
        title="Total Analyzed Customers" 
        value={totalCustomers}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.243-3.72a9.094 9.094 0 0 1-.479 3.741M18 18.72v-3.72c0-.202.016-.401.046-.598m-11.966 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
      />
      <KPICard 
        title="Avg. Purchase Value" 
        value={avgPurchaseValue !== 'N/A' ? `$${avgPurchaseValue}` : 'N/A'}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm0 0V15m0 0H9" /></svg>}
        description={validPurchaseCustomers < totalCustomers ? `Based on ${validPurchaseCustomers} customers with purchase data` : undefined}
      />
      <KPICard 
        title="Avg. Visit Frequency" 
        value={avgVisitFrequency !== 'N/A' ? `${avgVisitFrequency} /mo` : 'N/A'}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" /></svg>}
         description={validVisitCustomers < totalCustomers ? `Based on ${validVisitCustomers} customers with visit data` : undefined}
      />
      <KPICard 
        title="High Churn Risk" 
        value={percentHighChurnRisk}
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>}
        description={`Customers with >${highChurnRiskThreshold}% churn risk`}
      />
    </div>
  );
};