
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { CustomerDataInput, AnalysisResult } from '../types';

// Ensure API_KEY is handled by the build/environment, not hardcoded.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set. Please set the environment variable.");
  // In a real app, you might throw an error or handle this more gracefully
  // For this exercise, we'll proceed but calls will fail if key isn't truly available.
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Non-null assertion for simplicity here

function sanitizeCustomerDataForPrompt(customer: CustomerDataInput): Record<string, any> {
  const sanitized: Record<string, any> = { customerId: customer.customerId };
  if (customer.age !== undefined && customer.age !== '') sanitized.age = Number(customer.age);
  if (customer.gender !== undefined && customer.gender !== '') sanitized.gender = customer.gender;
  if (customer.lastPurchaseDate !== undefined && customer.lastPurchaseDate !== '') sanitized.lastPurchaseDate = customer.lastPurchaseDate;
  if (customer.totalPurchaseAmount !== undefined && customer.totalPurchaseAmount !== '') sanitized.totalPurchaseAmount = Number(customer.totalPurchaseAmount);
  if (customer.visitFrequency !== undefined && customer.visitFrequency !== '') sanitized.visitFrequency = Number(customer.visitFrequency);
  if (customer.lastActiveDate !== undefined && customer.lastActiveDate !== '') sanitized.lastActiveDate = customer.lastActiveDate;
  if (customer.pagesVisited !== undefined && customer.pagesVisited !== '') sanitized.pagesVisited = Number(customer.pagesVisited);
  if (customer.emailOpens !== undefined && customer.emailOpens !== '') sanitized.emailOpens = Number(customer.emailOpens);
  if (customer.productPreferences !== undefined && customer.productPreferences !== '') sanitized.productPreferences = customer.productPreferences;
  return sanitized;
}


export const analyzeBehavior = async (customers: CustomerDataInput[]): Promise<AnalysisResult[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured.");
  }

  const model = 'gemini-2.5-flash-preview-04-17';

  const sanitizedCustomers = customers.map(sanitizeCustomerDataForPrompt);

  const prompt = `
    You are an AI assistant performing predictive customer behavior analysis.
    Based on the provided customer data, simulate the predictions of a sophisticated model (like Logistic Regression or XGBoost).
    For each customer, predict:
    1.  Purchase Score: Likelihood to make a purchase (0-100%).
    2.  Churn Risk: Probability of the customer leaving (0-100%).
    3.  Customer Segment: Categorize the customer (e.g., Loyal Buyer, At-Risk, New Shopper, Potential Spender, Window Shopper, High Value).
    4.  Next Best Action: Suggest a proactive action to take for this customer (e.g., Recommend new arrivals, Send discount code, Welcome campaign + tips, Offer personalized recommendations, Re-engagement email, Exclusive offer).

    Analyze factors like purchase frequency, recency, monetary value, engagement signals (visits, email opens), and product preferences.
    If some optional data like age or gender is missing, make your predictions based on the available information.

    Input Customer Data:
    ${JSON.stringify(sanitizedCustomers, null, 2)}

    Provide the output STRICTLY as a valid JSON array. Each object in the array must correspond to a customer and include the following keys with string values: "customerId", "purchaseScore", "churnRisk", "segment", and "nextBestAction".
    - ALL keys and ALL string values MUST be enclosed in double quotes (").
    - Any special characters within string values (such as double quotes ", backslashes \\, newlines \n, etc.) MUST be properly escaped (e.g., a quote should be \\", a backslash \\\\, a newline \\n).
    - Example of a single customer object:
      {
        "customerId": "CUST123",
        "purchaseScore": "75%",
        "churnRisk": "20%",
        "segment": "Potential Spender",
        "nextBestAction": "Send a personalized discount code for \\"New Arrivals\\""
      }
    - "purchaseScore" and "churnRisk" values must be strings representing percentages (e.g., "85%", "15%").
    - The "customerId" in your response MUST exactly match the "customerId" from the input data for each respective customer.
    The entire response body MUST be ONLY the JSON array, starting with '[' and ending with ']'. Do not include any text, explanations, or markdown formatting (like \`\`\`json) before or after the JSON array. The response must be directly parsable by standard JSON.parse() methods.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, 
      },
    });

    let jsonStr = response.text.trim();
    // Attempt to remove markdown fences if they are still present despite responseMimeType
    const fenceRegex = /^\s*```(?:json)?\s*\n?(.*?)\n?\s*```\s*$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    const results = JSON.parse(jsonStr) as AnalysisResult[];
    
    if (!Array.isArray(results)) {
        console.error("Parsed response is not an array:", results);
        throw new Error("AI response was not in the expected array format.");
    }

    if (results.length > 0) {
        const firstItem = results[0];
        if (!('customerId' in firstItem && 'purchaseScore' in firstItem && 'churnRisk' in firstItem && 'segment' in firstItem && 'nextBestAction' in firstItem)) {
            console.error("Parsed response items lack required fields:", firstItem);
            throw new Error("AI response items are missing required fields.");
        }
    }

    return results;

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error instanceof Error ? error.message : String(error));
    // Log the problematic string for debugging if possible (be mindful of PII in logs)
    // console.debug("Problematic JSON string:", response?.text); // response might not be in scope here
    if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("Unknown error during AI analysis.");
  }
};
