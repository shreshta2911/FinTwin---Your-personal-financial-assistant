
import { UserProfile } from './types';

export const DEFAULT_USER: UserProfile = {
  name: "Rahul Sharma",
  age: 22,
  occupation: "Engineering Student",
  monthlyIncome: 15000,
  expenses: {
    food: 4000,
    travel: 2000,
    subscriptions: 1000,
    other: 5000,
  },
  budgetLimits: {
    food: 4500,
    travel: 2500,
    subscriptions: 1200,
    other: 5500,
  },
  savingsPerMonth: 3000,
  currentSavings: 25000,
  goal: {
    name: "Laptop",
    targetAmount: 60000,
    deadlineMonths: 8,
  },
  riskAppetite: 'Low',
};

export const COLORS = {
  primary: '#064e3b', // Forest Green
  secondary: '#10b981', // Emerald
  accent: '#f59e0b', // Amber/Gold
  background: '#fafaf9', // Pearl
  warning: '#f43f5e', // Rose
  neutral: '#475569', // Slate
};
