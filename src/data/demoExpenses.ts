import type { Expense } from '../domain/expense';

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(12, 0, 0, 0);
  return date.toISOString();
}

export const demoExpenses: Expense[] = [
  {
    id: 'demo-1',
    description: 'Sunday brunch',
    amount: 680,
    category: 'Food',
    spentAt: daysAgo(0),
  },
  {
    id: 'demo-2',
    description: 'Metro top-up',
    amount: 500,
    category: 'Transport',
    spentAt: daysAgo(1),
  },
  {
    id: 'demo-3',
    description: 'Weekly groceries',
    amount: 1840,
    category: 'Food',
    spentAt: daysAgo(2),
  },
  {
    id: 'demo-4',
    description: 'Music subscription',
    amount: 149,
    category: 'Bills',
    spentAt: daysAgo(3),
  },
  {
    id: 'demo-5',
    description: 'Pharmacy',
    amount: 420,
    category: 'Health',
    spentAt: daysAgo(4),
  },
  {
    id: 'demo-6',
    description: 'Everyday essentials',
    amount: 1275,
    category: 'Shopping',
    spentAt: daysAgo(6),
  },
];
