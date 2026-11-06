export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Health',
  'Other',
] as const;

export type ExpenseCategory = (typeof CATEGORIES)[number];

export type Expense = {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  spentAt: string;
};

export const CATEGORY_META: Record<
  ExpenseCategory,
  { icon: string; color: string; tint: string }
> = {
  Food: { icon: '🥑', color: '#4C8064', tint: '#E8F1E9' },
  Transport: { icon: '🚇', color: '#5877B7', tint: '#E9EDF8' },
  Shopping: { icon: '🛍️', color: '#B36D58', tint: '#F7EAE5' },
  Bills: { icon: '🏠', color: '#8870B0', tint: '#F0EAF7' },
  Health: { icon: '✳️', color: '#4A8B83', tint: '#E5F1EF' },
  Other: { icon: '✦', color: '#A17C42', tint: '#F5EFDF' },
};

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortDate(value: string): string {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function currentMonthLabel(): string {
  return new Date().toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });
}

export function getCurrentMonthExpenses(expenses: Expense[]): Expense[] {
  const now = new Date();
  return expenses.filter((expense) => {
    const date = new Date(expense.spentAt);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
}
