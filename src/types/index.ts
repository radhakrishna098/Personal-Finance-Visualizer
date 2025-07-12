
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

export interface Budget {
  id: string;
  category: string;
  month: string; // Format: "2025-07"
  budgetAmount: number;
}

export const CATEGORIES = [
  "Food",
  "Utilities", 
  "Rent",
  "Shopping",
  "Entertainment",
  "Transportation",
  "Healthcare",
  "Others"
];
