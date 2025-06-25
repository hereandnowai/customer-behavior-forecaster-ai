import React, { useState, useCallback } from 'react';
import type { CustomerDataInput, CustomerDataKey } from '../types';

interface FileUploadSectionProps {
  onDataLoaded: (data: CustomerDataInput[]) => void;
}

// Define expected headers and their corresponding keys in CustomerDataInput
const HEADER_MAPPING: Record<string, CustomerDataKey> = {
  'customer id': 'customerId',
  'age': 'age',
  'gender': 'gender',
  'last purchase date': 'lastPurchaseDate',
  'total purchase amount': 'totalPurchaseAmount',
  'visit frequency': 'visitFrequency',
  'last active date': 'lastActiveDate',
  'pages visited': 'pagesVisited',
  'email opens': 'emailOpens',
  'product preferences': 'productPreferences',
};


export const FileUploadSection: React.FC<FileUploadSectionProps> = ({ onDataLoaded }) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const parseCSV = (csvText: string): CustomerDataInput[] => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      throw new Error("CSV file must contain a header row and at least one data row.");
    }

    const headerCells = lines[0].split(',').map(cell => cell.trim().toLowerCase());
    const dataRows = lines.slice(1);
    
    const customerDataKeys = headerCells.map(header => {
        const key = HEADER_MAPPING[header];
        if (!key) throw new Error(`Unknown CSV header: "${header}". Expected headers: ${Object.keys(HEADER_MAPPING).join(', ')}`);
        return key;
    });

    return dataRows.map((row, rowIndex) => {
      const values = row.split(','); // Basic split, doesn't handle commas in quotes well
      if (values.length !== headerCells.length) {
        throw new Error(`Row ${rowIndex + 1} has ${values.length} columns, expected ${headerCells.length}.`);
      }
      
      const customer: Partial<CustomerDataInput> = {};
      customerDataKeys.forEach((key, index) => {
        const value = values[index].trim();
        if (key === 'age' || key === 'totalPurchaseAmount' || key === 'visitFrequency' || key === 'pagesVisited' || key === 'emailOpens') {
          (customer as any)[key] = value === '' ? undefined : parseFloat(value);
        } else {
          (customer as any)[key] = value === '' ? undefined : value;
        }
      });
       if (!customer.customerId) {
        throw new Error(`Row ${rowIndex + 1} is missing Customer ID.`);
      }
      return customer as CustomerDataInput;
    });
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileError(null);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const parsedData = parseCSV(text);
          onDataLoaded(parsedData);
        } catch (err) {
          if (err instanceof Error) setFileError(err.message);
          else setFileError("An unknown error occurred during CSV parsing.");
          setFileName(null); 
        }
      };
      reader.onerror = () => {
        setFileError("Failed to read the file.");
        setFileName(null);
      };
      reader.readAsText(file);
    }
     // Reset file input value to allow re-uploading the same file name
     event.target.value = '';
  }, [onDataLoaded]);

  return (
    <div>
      <p className="text-[var(--hnai-light-text-on-secondary)]/80 mb-4">
        Upload a CSV file with customer data. Ensure the first row contains headers matching the expected format (e.g., Customer ID, Age, Gender, Last Purchase Date, Total Purchase Amount, Visit Frequency, Last Active Date, Pages Visited, Email Opens, Product Preferences). Optional fields can be left blank.
      </p>
      <label htmlFor="csv-upload" className="w-full cursor-pointer bg-[var(--hnai-primary)] hover:bg-yellow-400 text-[var(--hnai-text-on-primary)] font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-300 inline-flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>
        {fileName ? `Selected: ${fileName}` : 'Choose CSV File'}
      </label>
      <input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      {fileError && <p className="text-[var(--hnai-error-text)] mt-3 text-sm">{fileError}</p>}
       <p className="text-xs text-gray-400 mt-3">
        Note: Basic CSV parser. For complex CSVs with quoted commas, ensure clean data or simplify.
      </p>
    </div>
  );
};