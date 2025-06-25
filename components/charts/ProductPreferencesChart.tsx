import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js/auto';
import type { CustomerDataInput } from '../../types';

Chart.register(...registerables);

interface ProductPreferencesChartProps {
  customersInput: CustomerDataInput[];
}

const hnaiChartColors = [
  '#FFDF00', '#007373', '#FFB300', '#00A0A0', '#FFE973', 
  '#005050', '#FFC700', '#26A69A', '#FFCC80', '#4DB6AC' 
];

export const ProductPreferencesChart: React.FC<ProductPreferencesChartProps> = ({ customersInput }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !customersInput.length) {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
      return;
    }

    const preferenceCounts = customersInput.reduce((acc, customer) => {
      if (customer.productPreferences) {
        const preferences = customer.productPreferences.split(',').map(p => p.trim().toLowerCase());
        preferences.forEach(pref => {
          if (pref) { 
            acc[pref] = (acc[pref] || 0) + 1;
          }
        });
      }
      return acc;
    }, {} as Record<string, number>);

    const sortedPreferences = Object.entries(preferenceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10); 

    const labels = sortedPreferences.map(([pref]) => pref.charAt(0).toUpperCase() + pref.slice(1));
    const data = sortedPreferences.map(([, count]) => count);

    if (labels.length === 0) { // If after processing, there are no preferences to show
        chartInstanceRef.current?.destroy();
        chartInstanceRef.current = null;
        return;
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Customer Count',
          data: data,
          backgroundColor: labels.map((_, i) => hnaiChartColors[i % hnaiChartColors.length]),
          borderColor: 'var(--hnai-interface-bg)',
          borderWidth: 1,
        }],
      },
      options: {
        indexAxis: 'y', 
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'Number of Customers', color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif' } },
            ticks: { color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif' } },
            grid: { color: 'var(--hnai-interface-bg)' }
          },
          y: {
            ticks: { color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif' } }, 
            grid: { display: false }
          }
        },
        plugins: {
          legend: {
            display: false, 
          },
          tooltip: {
             backgroundColor: 'var(--hnai-secondary)',
             titleColor: 'var(--hnai-primary)',
             bodyColor: 'var(--hnai-light-text-on-secondary)',
             bodyFont: { family: 'Inter, sans-serif' },
             titleFont: { family: 'Inter, sans-serif' }
          }
        }
      }
    });

    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [customersInput]);

  const hasPreferenceData = customersInput.some(c => c.productPreferences && c.productPreferences.split(',').some(p => p.trim() !== ''));
  if (!hasPreferenceData) {
    return <p className="text-[var(--hnai-light-text-on-secondary)]/70 text-center py-4">No product preference data available.</p>;
  }

  return (
    <div className="chart-container h-[350px] md:h-[400px]">
      <canvas ref={chartRef} aria-label="Top Product Preferences Bar Chart" role="img"></canvas>
    </div>
  );
};