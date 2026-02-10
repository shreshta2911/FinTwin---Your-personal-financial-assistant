
export interface UserProfile {
  name: string;
  age: number;
  occupation: string;
  monthlyIncome: number;
  expenses: {
    food: number;
    travel: number;
    subscriptions: number;
    other?: number;
  };
  budgetLimits: {
    food: number;
    travel: number;
    subscriptions: number;
    other: number;
  };
  savingsPerMonth: number;
  currentSavings: number;
  goal: {
    name: string;
    targetAmount: number;
    deadlineMonths: number;
  };
  riskAppetite: 'Low' | 'Medium' | 'High';
}

export interface Message {
  role: 'user' | 'assistant' | 'system_alert';
  content: string;
  timestamp: Date;
}
