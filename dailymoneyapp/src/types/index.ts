// User types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  monthlyIncome?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Jar types
export interface JarData {
  code: string;
  allocated: number;
  balance: number;
  spent: number;
  updatedAt: Date;
}

export interface AllJarsData {
  [key: string]: JarData;
}

// Transaction types
export interface Transaction {
  id?: string;
  amount: number;
  jarCode: string;
  category: string;
  description: string;
  recognizedText?: string;
  type: 'expense' | 'income' | 'transfer';
  createdAt: Date;
}

// Income types
export interface Income {
  id?: string;
  amount: number;
  source: string;
  note?: string;
  createdAt: Date;
  allocated: {
    [jarCode: string]: number;
  };
}

// AI Classification types
export interface TransactionClassification {
  type: 'income' | 'expense';
  amount: number;
  jar?: string; // Only for expenses
  category: string;
  confidence: number;
  description: string;
  source?: string; // Only for income
}

// Budget types
export interface Budget {
  id?: string;
  jarCode: string;
  category?: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  alertThreshold?: number; // Percentage to alert (e.g., 80)
  createdAt: Date;
  updatedAt: Date;
}

// Financial Goal types
export interface FinancialGoal {
  id?: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  jarCode?: string;
  status: 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

// Recurring Transaction types
export interface RecurringTransaction {
  id?: string;
  amount: number;
  jarCode: string;
  category: string;
  description: string;
  type: 'expense' | 'income';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  lastProcessed?: Date;
  nextDue: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Alert types
export interface Alert {
  id?: string;
  type: 'budget_exceeded' | 'goal_achieved' | 'low_balance' | 'recurring_due';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  actionUrl?: string;
  metadata?: any;
  createdAt: Date;
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TrendData {
  date: string;
  income: number;
  expenses: number;
  savings: number;
}
