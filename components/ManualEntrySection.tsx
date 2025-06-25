import React, { useState, useCallback } from 'react';
import type { CustomerDataInput } from '../types';

interface ManualEntrySectionProps {
  onAddCustomer: (customer: CustomerDataInput) => void;
}

const initialFormState: CustomerDataInput = {
  customerId: '',
  age: '',
  gender: '',
  lastPurchaseDate: '',
  totalPurchaseAmount: '',
  visitFrequency: '',
  lastActiveDate: '',
  pagesVisited: '',
  emailOpens: '',
  productPreferences: '',
};

export const ManualEntrySection: React.FC<ManualEntrySectionProps> = ({ onAddCustomer }) => {
  const [formData, setFormData] = useState<CustomerDataInput>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      setFormError("Customer ID is required.");
      return;
    }
    setFormError(null);
    
    const customerToAdd: CustomerDataInput = { ...formData };
    // Convert numeric fields from string to number, or undefined if empty
    customerToAdd.age = formData.age ? Number(formData.age) : undefined;
    customerToAdd.totalPurchaseAmount = formData.totalPurchaseAmount ? Number(formData.totalPurchaseAmount) : undefined;
    customerToAdd.visitFrequency = formData.visitFrequency ? Number(formData.visitFrequency) : undefined;
    customerToAdd.pagesVisited = formData.pagesVisited ? Number(formData.pagesVisited) : undefined;
    customerToAdd.emailOpens = formData.emailOpens ? Number(formData.emailOpens) : undefined;
    
    onAddCustomer(customerToAdd);
    setFormData(initialFormState); // Reset form
  }, [formData, onAddCustomer]);

  const inputClass = "w-full p-3 bg-[var(--hnai-secondary)] border border-[var(--hnai-interface-bg)] rounded-md focus:ring-2 focus:ring-[var(--hnai-primary)] focus:border-[var(--hnai-primary)] transition-colors text-[var(--hnai-light-text-on-secondary)] placeholder-gray-500";
  const labelClass = "block text-sm font-medium text-[var(--hnai-primary-text-on-secondary)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-[var(--hnai-light-text-on-secondary)]/80 mb-4">
        Enter customer details below and click "Add Customer" to include them in the analysis.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customerId" className={labelClass}>Customer ID (Required)</label>
          <input type="text" name="customerId" id="customerId" value={formData.customerId} onChange={handleChange} className={inputClass} placeholder="e.g., CUST1001" required />
        </div>
        <div>
          <label htmlFor="age" className={labelClass}>Age</label>
          <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="e.g., 35" />
        </div>
        <div>
          <label htmlFor="gender" className={labelClass}>Gender</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label htmlFor="lastPurchaseDate" className={labelClass}>Last Purchase Date</label>
          <input type="date" name="lastPurchaseDate" id="lastPurchaseDate" value={formData.lastPurchaseDate} onChange={handleChange} className={inputClass + ' date-input-override'} />
        </div>
        <div>
          <label htmlFor="totalPurchaseAmount" className={labelClass}>Total Purchase Amount ($)</label>
          <input type="number" step="0.01" name="totalPurchaseAmount" id="totalPurchaseAmount" value={formData.totalPurchaseAmount} onChange={handleChange} className={inputClass} placeholder="e.g., 150.75" />
        </div>
        <div>
          <label htmlFor="visitFrequency" className={labelClass}>Visit Frequency (e.g., per month)</label>
          <input type="number" name="visitFrequency" id="visitFrequency" value={formData.visitFrequency} onChange={handleChange} className={inputClass} placeholder="e.g., 5" />
        </div>
        <div>
          <label htmlFor="lastActiveDate" className={labelClass}>Last Active Date</label>
          <input type="date" name="lastActiveDate" id="lastActiveDate" value={formData.lastActiveDate} onChange={handleChange} className={inputClass + ' date-input-override'} />
        </div>
        <div>
          <label htmlFor="pagesVisited" className={labelClass}>Pages Visited (e.g., last session/month)</label>
          <input type="number" name="pagesVisited" id="pagesVisited" value={formData.pagesVisited} onChange={handleChange} className={inputClass} placeholder="e.g., 10" />
        </div>
        <div>
          <label htmlFor="emailOpens" className={labelClass}>Email Opens (e.g., last 30 days)</label>
          <input type="number" name="emailOpens" id="emailOpens" value={formData.emailOpens} onChange={handleChange} className={inputClass} placeholder="e.g., 3" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="productPreferences" className={labelClass}>Product Preferences (comma-separated)</label>
          <input type="text" name="productPreferences" id="productPreferences" value={formData.productPreferences} onChange={handleChange} className={inputClass} placeholder="e.g., electronics, books, apparel" />
        </div>
      </div>
      {formError && <p className="text-[var(--hnai-error-text)] mt-2 text-sm">{formError}</p>}
      <button type="submit" className="w-full sm:w-auto mt-4 py-3 px-8 bg-[var(--hnai-primary)] hover:bg-yellow-400 text-[var(--hnai-text-on-primary)] font-semibold rounded-lg shadow-md transition-colors duration-300 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Customer to List
      </button>
      <style>{`
        .date-input-override::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(100%) sepia(100%) saturate(10000%) hue-rotate(30deg); /* Attempt to color gold */
        }
      `}</style>
    </form>
  );
};