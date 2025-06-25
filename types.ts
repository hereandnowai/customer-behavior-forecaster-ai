
export interface CustomerDataInput {
  customerId: string;
  age?: number | string; // string for form input, convert to number later
  gender?: string;
  lastPurchaseDate?: string; // YYYY-MM-DD
  totalPurchaseAmount?: number | string; // string for form input
  visitFrequency?: number | string; // visits per month, string for form input
  lastActiveDate?: string; // YYYY-MM-DD
  pagesVisited?: number | string; // string for form input
  emailOpens?: number | string; // string for form input
  productPreferences?: string; // Comma-separated tags or categories
}

export interface AnalysisResult {
  customerId: string;
  purchaseScore: string; 
  churnRisk: string; 
  segment: string;
  nextBestAction: string;
}

// For CSV header mapping
export type CustomerDataKey = keyof CustomerDataInput;
