import { Transaction, Income, Budget, FinancialGoal } from '@/types';
import { formatCurrency } from '../utils';

/**
 * Convert data to CSV format
 */
function convertToCSV(data: any[], headers: string[]): string {
  const rows = [headers.join(',')];

  data.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header];
      // Escape commas and quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value !== undefined && value !== null ? value : '';
    });
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

/**
 * Download file
 */
function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const data = transactions.map((tx) => ({
    Date: tx.createdAt.toLocaleDateString('vi-VN'),
    Type: tx.type === 'expense' ? 'Chi tiêu' : tx.type === 'income' ? 'Thu nhập' : 'Chuyển khoản',
    Amount: tx.amount,
    'Amount (Formatted)': formatCurrency(tx.amount),
    Jar: tx.jarCode,
    Category: tx.category,
    Description: tx.description,
  }));

  const headers = [
    'Date',
    'Type',
    'Amount',
    'Amount (Formatted)',
    'Jar',
    'Category',
    'Description',
  ];

  const csv = convertToCSV(data, headers);
  const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export incomes to CSV
 */
export function exportIncomesToCSV(incomes: Income[]): void {
  const data = incomes.map((income) => ({
    Date: income.createdAt.toLocaleDateString('vi-VN'),
    Amount: income.amount,
    'Amount (Formatted)': formatCurrency(income.amount),
    Source: income.source,
    Note: income.note || '',
  }));

  const headers = ['Date', 'Amount', 'Amount (Formatted)', 'Source', 'Note'];

  const csv = convertToCSV(data, headers);
  const filename = `incomes_${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export budgets to CSV
 */
export function exportBudgetsToCSV(budgets: Budget[]): void {
  const data = budgets.map((budget) => ({
    Jar: budget.jarCode,
    Category: budget.category || 'All',
    Amount: budget.amount,
    'Amount (Formatted)': formatCurrency(budget.amount),
    Period: budget.period,
    'Start Date': budget.startDate.toLocaleDateString('vi-VN'),
    'End Date': budget.endDate
      ? budget.endDate.toLocaleDateString('vi-VN')
      : 'Ongoing',
    'Alert Threshold': budget.alertThreshold
      ? `${budget.alertThreshold}%`
      : 'None',
  }));

  const headers = [
    'Jar',
    'Category',
    'Amount',
    'Amount (Formatted)',
    'Period',
    'Start Date',
    'End Date',
    'Alert Threshold',
  ];

  const csv = convertToCSV(data, headers);
  const filename = `budgets_${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export goals to CSV
 */
export function exportGoalsToCSV(goals: FinancialGoal[]): void {
  const data = goals.map((goal) => ({
    Title: goal.title,
    Description: goal.description || '',
    'Target Amount': goal.targetAmount,
    'Target Amount (Formatted)': formatCurrency(goal.targetAmount),
    'Current Amount': goal.currentAmount,
    'Current Amount (Formatted)': formatCurrency(goal.currentAmount),
    'Progress (%)': ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2),
    'Target Date': goal.targetDate
      ? goal.targetDate.toLocaleDateString('vi-VN')
      : 'No date',
    Status: goal.status,
    Priority: goal.priority,
    Jar: goal.jarCode || 'All',
  }));

  const headers = [
    'Title',
    'Description',
    'Target Amount',
    'Target Amount (Formatted)',
    'Current Amount',
    'Current Amount (Formatted)',
    'Progress (%)',
    'Target Date',
    'Status',
    'Priority',
    'Jar',
  ];

  const csv = convertToCSV(data, headers);
  const filename = `goals_${new Date().toISOString().split('T')[0]}.csv`;
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export all data as JSON
 */
export function exportAllDataAsJSON(data: {
  transactions: Transaction[];
  incomes: Income[];
  budgets: Budget[];
  goals: FinancialGoal[];
}): void {
  const jsonString = JSON.stringify(data, null, 2);
  const filename = `dailymoney_backup_${
    new Date().toISOString().split('T')[0]
  }.json`;
  downloadFile(jsonString, filename, 'application/json');
}

/**
 * Generate summary report
 */
export function generateSummaryReport(
  transactions: Transaction[],
  incomes: Income[]
): string {
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const savings = totalIncome - totalExpenses;

  const report = `
DailyMoneyApp - Financial Summary Report
Generated: ${new Date().toLocaleString('vi-VN')}
========================================

INCOME
------
Total Income: ${formatCurrency(totalIncome)}
Number of Income Transactions: ${incomes.length}
Average Income: ${formatCurrency(incomes.length > 0 ? totalIncome / incomes.length : 0)}

EXPENSES
--------
Total Expenses: ${formatCurrency(totalExpenses)}
Number of Expense Transactions: ${transactions.filter((tx) => tx.type === 'expense').length}
Average Expense: ${formatCurrency(
    transactions.filter((tx) => tx.type === 'expense').length > 0
      ? totalExpenses / transactions.filter((tx) => tx.type === 'expense').length
      : 0
  )}

SAVINGS
-------
Total Savings: ${formatCurrency(savings)}
Savings Rate: ${totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(2) : 0}%

CATEGORY BREAKDOWN
------------------
${generateCategoryBreakdown(transactions)}

========================================
End of Report
  `.trim();

  return report;
}

/**
 * Generate category breakdown for report
 */
function generateCategoryBreakdown(transactions: Transaction[]): string {
  const categoryMap: { [key: string]: number } = {};

  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    });

  const sorted = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  return sorted
    .map(
      ([category, amount]) =>
        `${category.padEnd(20)}: ${formatCurrency(amount)}`
    )
    .join('\n');
}

/**
 * Export summary report
 */
export function exportSummaryReport(
  transactions: Transaction[],
  incomes: Income[]
): void {
  const report = generateSummaryReport(transactions, incomes);
  const filename = `summary_report_${
    new Date().toISOString().split('T')[0]
  }.txt`;
  downloadFile(report, filename, 'text/plain;charset=utf-8;');
}
