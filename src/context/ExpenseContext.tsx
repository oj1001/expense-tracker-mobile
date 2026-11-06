import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createExpense as createRemoteExpense, getExpenses } from '../api/client';
import { demoExpenses } from '../data/demoExpenses';
import type { Expense, ExpenseCategory } from '../domain/expense';

type NewExpense = {
  description: string;
  amount: number;
  category: ExpenseCategory;
  spentAt: string;
};

type ExpenseContextValue = {
  expenses: Expense[];
  notice: string | null;
  addExpense: (expense: NewExpense) => Promise<void>;
};

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState(demoExpenses);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getExpenses()
      .then((remoteExpenses) => {
        if (!active) return;
        setExpenses(remoteExpenses);
        setNotice(null);
      })
      .catch((error: unknown) => {
        if (!active) return;
        const detail =
          error instanceof Error ? error.message : 'Unknown connection error';
        setNotice(`Demo data is shown. API connection failed: ${detail}`);
      });

    return () => {
      active = false;
    };
  }, []);

  const addExpense = useCallback(async (expense: NewExpense) => {
    try {
      const created = await createRemoteExpense(expense);
      setExpenses((current) =>
        [created, ...current].sort(
          (a, b) =>
            new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime(),
        ),
      );
      setNotice(null);
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : 'Unknown connection error';
      const localExpense: Expense = {
        ...expense,
        id: `local-${Date.now()}`,
      };
      setExpenses((current) => [localExpense, ...current]);
      setNotice(`Saved for this session only. API sync failed: ${detail}`);
    }
  }, []);

  const value = useMemo(
    () => ({ expenses, notice, addExpense }),
    [expenses, notice, addExpense],
  );

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
}

export function useExpenses(): ExpenseContextValue {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used inside ExpenseProvider');
  }
  return context;
}
