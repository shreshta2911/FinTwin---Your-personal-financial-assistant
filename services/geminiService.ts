
import { GoogleGenAI } from "@google/genai";
import { UserProfile, Message } from "../types";

const getSystemInstruction = (profile: UserProfile) => {
  const totalExpenses = (profile.expenses.food || 0) + 
                        (profile.expenses.travel || 0) + 
                        (profile.expenses.subscriptions || 0) + 
                        (profile.expenses.other || 0);

  const limitsText = Object.entries(profile.budgetLimits)
    .map(([cat, val]) => `${cat}: limit ₹${val}, current ₹${profile.expenses[cat as keyof typeof profile.expenses] || 0}`)
    .join(', ');

  return `
    You are FinTwin, an elite personal financial twin for ${profile.name}, a ${profile.age}-year-old ${profile.occupation}.
    
    User Context:
    - Monthly Income: ₹${profile.monthlyIncome}
    - Monthly Spending: ₹${totalExpenses}
    - Savings Rate: ₹${profile.savingsPerMonth}/mo
    - Net Savings: ₹${profile.currentSavings}
    - Goal: ${profile.goal.name} (Target: ₹${profile.goal.targetAmount})
    - Timeline: ${profile.goal.deadlineMonths} months left.
    - Limits: ${limitsText}
    
    BEHAVIOR:
    - If asked to "Summarize Spending", provide a concise bulleted breakdown of where the money is going compared to limits.
    - Always highlight the "Shortfall" (Target - (Current + Savings*Months)) if it exists.
    - Be punchy, professional, and empathetic.
    - Use "₹" for currency.
    - Use Markdown for bolding and structure.
    
    TONE:
    - High-growth focused.
    - Simplified but analytical.
    - Actionable advice only.
  `;
};

export async function getFinAdvice(profile: UserProfile, history: Message[], prompt: string) {
  // Always use process.env.API_KEY string directly when initializing GoogleGenAI.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: getSystemInstruction(profile),
      temperature: 0.7,
    }
  });

  try {
    const result = await chat.sendMessage({ message: prompt });
    // Directly access the .text property of GenerateContentResponse.
    return result.text || "I encountered an error processing your financial data. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. I'm still securing your data node. Please retry in a moment.";
  }
}
