import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js/auto';
import type { AnalysisResult } from '../../types';

Chart.register(...registerables);

interface CustomerSegmentationChartProps {
  analysisResults: AnalysisResult[];
}

const hnaiChartColors = [
  '#FFDF00', // primary
  '#007373', // Lighter Teal
  '#FFB300', // Orange/Amber accent
  '#00A0A0', // Even Lighter Teal
  '#FFE973', // Lighter Yellow
  '#005050', // Darker Teal
  '#FFC700', // Darker Yellow
];

export const CustomerSegmentationChart: React.FC<CustomerSegmentationChartProps> = ({ analysisResults }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !analysisResults.length) {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
      return;
    }

    const segmentCounts = analysisResults.reduce((acc, result) => {
      acc[result.segment] = (acc[result.segment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(segmentCounts);
    const data = Object.values(segmentCounts);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Customer Segments',
          data: data,
          backgroundColor: labels.map((_, i) => hnaiChartColors[i % hnaiChartColors.length]),
          borderColor: 'var(--hnai-interface-bg)', 
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'var(--hnai-light-text-on-secondary)', 
              font: {
                size: 12,
                family: 'Inter, sans-serif'
              }
            }
          },
          tooltip: {
            backgroundColor: 'var(--hnai-secondary)',
            titleColor: 'var(--hnai-primary)',
            bodyColor: 'var(--hnai-light-text-on-secondary)',
            callbacks: {
              label: function(context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  const total = context.dataset.data.reduce((a, b) => a + (b as number), 0);
                  const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) + '%' : '0%';
                  label += `${context.formattedValue} (${percentage})`;
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
     return <p className="text-center text-[var(--hnai-light-text-on-secondary)]/70 py-4">No data to display segmentation chart.</p>;
  }

  return (
    <div className="chart-container h-[300px] md:h-[350px]">
      <canvas ref={chartRef} aria-label="Customer Segmentation Pie Chart" role="img"></canvas>
    </div>
  );
};