import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js/auto';
import type { AnalysisResult } from '../../types';

Chart.register(...registerables);

interface ChurnPurchaseScatterPlotProps {
  analysisResults: AnalysisResult[];
}

// Adjusted segment colors for HNAI branding
const hnaiSegmentColors: Record<string, string> = {
  'Loyal Buyer': '#00A0A0', // Lighter Teal
  'At-Risk': '#FF6B6B', // A contrasting red
  'New Shopper': '#007373', // Medium Teal
  'Potential Spender': 'var(--hnai-primary)', // Golden Yellow
  'Window Shopper': '#FFB300', // Amber/Orange
  'High Value': '#FFE973', // Light Yellow
  'Default': '#B0BEC5' // Neutral Gray for unknown segments
};

const parsePercentage = (value: string): number => {
  const num = parseFloat(value.replace('%', ''));
  return isNaN(num) ? 0 : num;
};

export const ChurnPurchaseScatterPlot: React.FC<ChurnPurchaseScatterPlotProps> = ({ analysisResults }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !analysisResults.length) {
       chartInstanceRef.current?.destroy();
       chartInstanceRef.current = null;
      return;
    }

    const datasets = Object.entries(
      analysisResults.reduce((acc, result) => {
        const segment = result.segment || 'Unknown';
        if (!acc[segment]) {
          acc[segment] = [];
        }
        acc[segment].push({
          x: parsePercentage(result.purchaseScore),
          y: parsePercentage(result.churnRisk),
          customerId: result.customerId
        });
        return acc;
      }, {} as Record<string, { x: number; y: number; customerId: string }[]>)
    ).map(([segment, data]) => ({
      label: segment,
      data: data,
      backgroundColor: hnaiSegmentColors[segment] || hnaiSegmentColors['Default'],
      pointRadius: 5,
      pointHoverRadius: 7,
    }));


    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Purchase Score (%)',
              color: 'var(--hnai-light-text-on-secondary)',
              font: { size: 14, family: 'Inter, sans-serif' }
            },
            ticks: { color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif' } },
            grid: { color: 'var(--hnai-interface-bg)' } 
          },
          y: {
            title: {
              display: true,
              text: 'Churn Risk (%)',
              color: 'var(--hnai-light-text-on-secondary)',
              font: { size: 14, family: 'Inter, sans-serif' }
            },
            ticks: { color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif' } },
            grid: { color: 'var(--hnai-interface-bg)' }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: { 
                color: 'var(--hnai-light-text-on-secondary)',
                font: { family: 'Inter, sans-serif' }
            }
          },
          tooltip: {
            backgroundColor: 'var(--hnai-secondary)',
            titleColor: 'var(--hnai-primary)',
            bodyColor: 'var(--hnai-light-text-on-secondary)',
            callbacks: {
              label: function(context) {
                const rawData = context.raw as { customerId?: string };
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += `(Purchase: ${context.parsed.x}%, Churn: ${context.parsed.y}%)`;
                if (rawData && rawData.customerId) {
                    label += ` - ID: ${rawData.customerId}`;
                }
                return label;
              }
            },
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
  }, [analysisResults]);

   if (!analysisResults.length) {
     return <p className="text-center text-[var(--hnai-light-text-on-secondary)]/70 py-4">No data to display scatter plot.</p>;
  }

  return (
    <div className="chart-container h-[300px] md:h-[350px]">
      <canvas ref={chartRef} aria-label="Churn Risk vs Purchase Score Scatter Plot" role="img"></canvas>
    </div>
  );
};