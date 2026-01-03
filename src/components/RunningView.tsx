import { useState } from 'react';
import { DollarSign, Calendar, TrendingDown, RotateCcw, Receipt, Tags } from 'lucide-react';

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

type RunningViewProps = {
  categories: Category[];
  totalDays: number;
  onLogSpend: (categoryIndex: number, amount: number, subcategoryIndex: number) => void;
  onReset: () => void;
};

export function RunningView({ categories, totalDays, onLogSpend, onReset }: RunningViewProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedSubcategory, setSelectedSubcategory] = useState(0);
  const [amount, setAmount] = useState('');

  const handleLogSpend = () => {
    const amt = Number(amount);
    if (amt < 0 || !amt) return;

    onLogSpend(selectedCategory, amt, selectedSubcategory);
    setAmount('');
  };

  const handleCategoryChange = (index: number) => {
    setSelectedCategory(index);
    setSelectedSubcategory(0); // Reset subcategory when category changes
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-slate-100 mb-1">Budget Tracker</h1>
            <p className="text-slate-400">Monitor your daily spending by category</p>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-sm">Total Days</div>
            <div className="text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {totalDays}
            </div>
          </div>
        </div>

        {/* Dashboard - Categories */}
        <div className="grid gap-4 mb-6">
          {categories.map((cat, index) => {
            const remainingDays = totalDays - cat.spent.length;
            const allowance = remainingDays > 0 ? cat.remaining / remainingDays : 0;
            const usedPercentage = ((cat.budget - cat.remaining) / cat.budget) * 100;
            const isOverBudget = cat.remaining < 0;
            const daysLogged = cat.spent.length;

            return (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-5 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-slate-100 mb-1">{cat.name}</h3>
                    <div className="text-slate-400 text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Day {daysLogged} of {totalDays}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                      €{cat.remaining.toFixed(2)}
                    </div>
                    <div className="text-slate-500 text-sm">of €{cat.budget}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        usedPercentage > 100
                          ? 'bg-gradient-to-r from-red-500 to-rose-500'
                          : usedPercentage > 80
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                      }`}
                      style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-slate-900/40 rounded-lg p-3">
                    <div className="text-slate-500 text-xs mb-1">Daily Allowance</div>
                    <div className="text-slate-200">€{allowance.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-3">
                    <div className="text-slate-500 text-xs mb-1">Days Left</div>
                    <div className="text-slate-200">{remainingDays}</div>
                  </div>
                </div>

                {/* Subcategory Breakdown */}
                {cat.subcategories.some(sub => sub.spent.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="text-slate-400 text-xs mb-2 flex items-center gap-1">
                      <Tags className="w-3 h-3" />
                      Spending breakdown
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {cat.subcategories
                        .filter(sub => sub.spent.length > 0)
                        .map((sub, subIndex) => {
                          const subTotal = sub.spent.reduce((sum, s) => sum + s.amount, 0);
                          return (
                            <div key={subIndex} className="bg-slate-900/60 rounded-lg p-2">
                              <div className="text-slate-400 text-xs truncate">{sub.name}</div>
                              <div className="text-slate-200 text-sm">€{subTotal.toFixed(2)}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Log Spending */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 rounded-2xl p-5">
          <h3 className="text-slate-200 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-400" />
            Log Today's Spending
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              >
                {categories.map((cat, index) => (
                  <option key={index} value={index}>
                    {cat.name} (€{cat.remaining.toFixed(2)} left)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2 flex items-center gap-1">
                <Tags className="w-3 h-3" />
                Subcategory
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              >
                {categories[selectedCategory].subcategories.map((sub, index) => (
                  <option key={index} value={index}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-slate-400 text-sm mb-2">Amount (€)</label>
              <DollarSign className="absolute left-4 bottom-3.5 w-5 h-5 text-slate-500" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount spent today"
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleLogSpend()}
              />
            </div>

            <button
              onClick={handleLogSpend}
              disabled={!amount || Number(amount) <= 0}
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Receipt className="w-5 h-5" />
              Log Spending
            </button>
          </div>
        </div>
      </div>

      {/* Spending Logs */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-slate-100 mb-4">Spending History</h2>
        
        <div className="space-y-4">
          {categories.map((cat, catIndex) => (
            cat.spent.length > 0 && (
              <div key={catIndex} className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4">
                <h3 className="text-slate-200 mb-3">{cat.name}</h3>
                <div className="space-y-2">
                  {cat.spent.map((amt, dayIndex) => {
                    // Find which subcategory this spending was logged to
                    const subcategorySpent = cat.subcategories.find(sub => 
                      sub.spent.some(s => s.day === dayIndex + 1)
                    );
                    const subcategoryName = subcategorySpent?.name || 'Unknown';
                    
                    return (
                      <div
                        key={dayIndex}
                        className="flex items-center justify-between text-sm bg-slate-800/40 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Day {dayIndex + 1}</span>
                          <span className="text-slate-500 text-xs px-2 py-0.5 bg-slate-700/50 rounded">
                            {subcategoryName}
                          </span>
                        </div>
                        <span className="text-slate-200">€{amt.toFixed(2)}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between text-sm bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 mt-2">
                    <span className="text-emerald-400">Total Spent</span>
                    <span className="text-emerald-400">
                      €{cat.spent.reduce((sum, amt) => sum + amt, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full px-6 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-2xl transition-all flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-5 h-5" />
        Reset Month
      </button>
    </div>
  );
}
