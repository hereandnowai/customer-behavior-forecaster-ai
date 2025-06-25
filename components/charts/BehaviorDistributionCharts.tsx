import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js/auto';
import type { CustomerDataInput } from '../../types';

Chart.register(...registerables);

interface BehaviorDistributionChartsProps {
  customersInput: CustomerDataInput[];
}

const createDistributionData = (data: (number | undefined)[], numBins: number = 5) => {
  const validData = data.filter(d => d !== undefined && !isNaN(Number(d))).map(Number);
  if (validData.length === 0) return { labels: [], counts: [] };

  const min = Math.min(...validData);
  const max = Math.max(...validData);

  if (min === max) { 
    return { labels: [min.toString()], counts: [validData.length] };
  }
  
  // Ensure binSize is at least 1 and numBins is reasonable if max-min is small
  let actualNumBins = numBins;
  if (max - min + 1 < numBins) {
    actualNumBins = Math.max(1, max - min + 1);
  }
  const binSize = Math.max(1, Math.ceil((max - min + 1) / actualNumBins)); 
  
  const bins = Array(actualNumBins).fill(0).map((_, i) => min + i * binSize);
  
  const counts = Array(actualNumBins).fill(0);
  const labels = bins.map((binStart, i) => {
    const binEnd = binStart + binSize -1;
    return `${binStart}-${Math.min(binEnd, max)}`; // Cap binEnd at max
  });

  validData.forEach(value => {
    let binIndex = Math.floor((value - min) / binSize);
    binIndex = Math.max(0, Math.min(binIndex, actualNumBins - 1)); 
    counts[binIndex]++;
  });
  
  let firstNonEmpty = -1, lastNonEmpty = -1;
  for(let i=0; i< counts.length; i++) {
    if(counts[i] > 0) {
      if(firstNonEmpty === -1) firstNonEmpty = i;
      lastNonEmpty = i;
    }
  }

  if(firstNonEmpty === -1) return { labels: [], counts: [] };

  return { 
    labels: labels.slice(firstNonEmpty, lastNonEmpty + 1), 
    counts: counts.slice(firstNonEmpty, lastNonEmpty + 1)
  };
};

const DistributionChart: React.FC<{ data: (number | undefined)[]; title: string; chartId: string; color: string }> = ({ data, title, chartId, color }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  
  const { labels, counts } = createDistributionData(data);

  useEffect(() => {
    if (!chartRef.current || labels.length === 0) {
        if(chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
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
          data: counts,
          backgroundColor: color,
          borderColor: 'var(--hnai-interface-bg)',
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: title, color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif' } },
            ticks: { color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif', size: 10 } },
            grid: { display: false }
          },
          y: {
            title: { display: true, text: 'Number of Customers', color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif' } },
            ticks: { color: 'var(--hnai-light-text-on-secondary)', font: { family: 'Inter, sans-serif' }, stepSize: Math.max(1, Math.ceil(Math.max(...counts) / 5)) }, // Adjust stepSize
            grid: { color: 'var(--hnai-interface-bg)' }
          }
        },
        plugins: {
          legend: { display: false },
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labels.join(','), counts.join(','), title, color]);

  if (labels.length === 0) {
    return <p className="text-[var(--hnai-light-text-on-secondary)]/70 text-center py-4">{`No data for ${title} distribution.`}</p>;
  }

  return (
    <div className="chart-container h-[250px] md:h-[300px]">
      <canvas ref={chartRef} id={chartId} aria-label={`${title} Distribution Chart`} role="img"></canvas>
    </div>
  );
};

// Brand colors for distribution charts
const distChartColors = {
    purchase: 'var(--hnai-primary)', // #FFDF00
    visits: '#00A0A0', // Lighter Teal
    pages: '#007373',  // Medium Teal
};

export const BehaviorDistributionCharts: React.FC<BehaviorDistributionChartsProps> = ({ customersInput }) => {
  const purchaseAmounts = customersInput.map(c => c.totalPurchaseAmount ? Number(c.totalPurchaseAmount) : undefined);
  const visitFrequencies = customersInput.map(c => c.visitFrequency ? Number(c.visitFrequency) : undefined);
  const pagesVisited = customersInput.map(c => c.pagesVisited ? Number(c.pagesVisited) : undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DistributionChart data={purchaseAmounts} title="Total Purchase Amount ($)" chartId="purchaseAmountDist" color={distChartColors.purchase} />
      <DistributionChart data={visitFrequencies} title="Visit Frequency (per month)" chartId="visitFrequencyDist" color={distChartColors.visits} />
      <DistributionChart data={pagesVisited} title="Pages Visited" chartId="pagesVisitedDist" color={distChartColors.pages} />
    </div>
  );
};