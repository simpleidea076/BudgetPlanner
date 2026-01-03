import { useState } from 'react';
import { SetupView } from './components/SetupView';
import { RunningView } from './components/RunningView';
import { SummaryView } from './components/SummaryView';

type Subcategory = {
  name: string;
  spent: { amount: number; day: number }[];
};

type Category = {
  name: string;
  budget: number;
  remaining: number;
  spent: number[];
  subcategories: Subcategory[];
};

type Phase = 'SETUP' | 'RUNNING' | 'SUMMARY';

type AppState = {
  phase: Phase;
  totalDays: number;
  categories: Category[];
};

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    phase: 'SETUP',
    totalDays: 0,
    categories: []
  });

  const addCategory = (name: string, budget: number, subcategories: string[]) => {
    if (!name || !budget) return;

    setAppState(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          name,
          budget,
          remaining: budget,
          spent: [],
          subcategories: subcategories.map(sub => ({
            name: sub,
            spent: []
          }))
        }
      ]
    }));
  };

  const startMonth = (days: number) => {
    if (!days || appState.categories.length === 0) return;
    
    setAppState(prev => ({
      ...prev,
      totalDays: days,
      phase: 'RUNNING'
    }));
  };

  const logSpend = (categoryIndex: number, amount: number, subcategoryIndex: number) => {
    if (amount < 0) return;

    setAppState(prev => {
      const newCategories = [...prev.categories];
      const category = newCategories[categoryIndex];
      
      if (category.spent.length >= prev.totalDays) return prev;

      // Log to category
      category.spent.push(amount);
      category.remaining -= amount;

      // Log to subcategory
      const currentDay = category.spent.length;
      category.subcategories[subcategoryIndex].spent.push({
        amount,
        day: currentDay
      });

      const allComplete = newCategories.every(c => c.spent.length >= prev.totalDays);

      return {
        ...prev,
        categories: newCategories,
        phase: allComplete ? 'SUMMARY' : 'RUNNING'
      };
    });
  };

  const resetApp = () => {
    setAppState({
      phase: 'SETUP',
      totalDays: 0,
      categories: []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        {appState.phase === 'SETUP' && (
          <SetupView
            categories={appState.categories}
            onAddCategory={addCategory}
            onStartMonth={startMonth}
          />
        )}

        {appState.phase === 'RUNNING' && (
          <RunningView
            categories={appState.categories}
            totalDays={appState.totalDays}
            onLogSpend={logSpend}
            onReset={resetApp}
          />
        )}

        {appState.phase === 'SUMMARY' && (
          <SummaryView
            categories={appState.categories}
            totalDays={appState.totalDays}
            onReset={resetApp}
          />
        )}
      </div>
    </div>
  );
}