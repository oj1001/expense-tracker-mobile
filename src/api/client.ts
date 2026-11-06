import { Platform } from 'react-native';
import type { Expense, ExpenseCategory } from '../domain/expense';

const localHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = `http://${localHost}:8080/api`;

type ApiExpense = {
  id: string;
  description: string;
  amount: number;
  category: string;
  spentAt: string;
};

const API_CATEGORIES: Record<ExpenseCategory, string> = {
  Food: 'FOOD',
  Transport: 'TRANSPORT',
  Shopping: 'SHOPPING',
  Bills: 'BILLS',
  Health: 'HEALTH',
  Other: 'OTHER',
};
const MOBILE_CATEGORIES: Record<string, ExpenseCategory> = {
  FOOD: 'Food',
  TRANSPORT: 'Transport',
  SHOPPING: 'Shopping',
  BILLS: 'Bills',
  HEALTH: 'Health',
  OTHER: 'Other',
};

function toMobileExpense(expense: ApiExpense): Expense {
  const category = MOBILE_CATEGORIES[expense.category];
  if (!category) {
    throw new Error(`API returned an unknown expense category: ${expense.category}`);
  }

  return {
    ...expense,
    amount: Number(expense.amount),
    category,
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      detail || `API request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function getExpenses(): Promise<Expense[]> {
  const expenses = await request<ApiExpense[]>('/expenses');
  return expenses.map(toMobileExpense);
}

export async function createExpense(
  expense: Omit<Expense, 'id'>,
): Promise<Expense> {
  const created = await request<ApiExpense>('/expenses', {
    method: 'POST',
    body: JSON.stringify({ ...expense, category: API_CATEGORIES[expense.category] }),
  });
  return toMobileExpense(created);
}
