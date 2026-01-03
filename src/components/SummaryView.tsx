import { BarChart3, CheckCircle2, XCircle, RotateCcw, TrendingUp, Download, AlertTriangle, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

type SummaryViewProps = {
  categories: Category[];
  totalDays: number;
  onReset: () => void;
};

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#ef4444', '#14b8a6', '#6366f1'];

export function SummaryView({ categories, totalDays, onReset }: SummaryViewProps) {
  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => 
    sum + cat.spent.reduce((s, amt) => s + amt, 0), 0
  );
  const totalRemaining = totalBudget - totalSpent;
  const successRate = categories.filter(cat => cat.remaining >= 0).length;

  // Prepare data for category pie chart
  const categoryPieData = categories.map(cat => ({
    name: cat.name,
    value: cat.spent.reduce((sum, amt) => sum + amt, 0)
  })).filter(item => item.value > 0);

  // Prepare data for subcategory analysis
  const allSubcategories: { name: string; category: string; amount: number }[] = [];
  categories.forEach(cat => {
    cat.subcategories.forEach(sub => {
      const total = sub.spent.reduce((sum, s) => sum + s.amount, 0);
      if (total > 0) {
        allSubcategories.push({
          name: sub.name,
          category: cat.name,
          amount: total
        });
      }
    });
  });

  // Sort and get top spending subcategories
  const topSubcategories = [...allSubcategories]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  // Identify red zones (overspending areas)
  const redZones: { category: string; subcategory: string; amount: number; percentage: number }[] = [];
  categories.forEach(cat => {
    const categoryTotal = cat.spent.reduce((sum, amt) => sum + amt, 0);
    cat.subcategories.forEach(sub => {
      const subTotal = sub.spent.reduce((sum, s) => sum + s.amount, 0);
      if (subTotal > 0 && categoryTotal > 0) {
        const percentage = (subTotal / categoryTotal) * 100;
        if (percentage > 30 || cat.remaining < 0) { // Flag if subcategory is >30% of category or category is over budget
          redZones.push({
            category: cat.name,
            subcategory: sub.name,
            amount: subTotal,
            percentage
          });
        }
      }
    });
  });

  // Sort red zones by amount
  redZones.sort((a, b) => b.amount - a.amount);

  // Export functionality
  const exportToCSV = () => {
    let csv = 'Category,Subcategory,Day,Amount\n';
    
    categories.forEach(cat => {
      cat.subcategories.forEach(sub => {
        sub.spent.forEach(entry => {
          csv += `${cat.name},${sub.name},${entry.day},${entry.amount}\n`;
        });
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToJSON = () => {
    const data = {
      totalDays,
      totalBudget,
      totalSpent,
      totalRemaining,
      categories: categories.map(cat => ({
        name: cat.name,
        budget: cat.budget,
        spent: cat.spent.reduce((sum, amt) => sum + amt, 0),
        remaining: cat.remaining,
        subcategories: cat.subcategories.map(sub => ({
          name: sub.name,
          spent: sub.spent.reduce((sum, s) => sum + s.amount, 0),
          entries: sub.spent
        }))
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 mb-4 shadow-lg shadow-emerald-500/30">
            <BarChart3 className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-slate-100 mb-2">Month Summary</h1>
          <p className="text-slate-400">Detailed analysis of your spending patterns</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-5 text-center">
            <div className="text-slate-400 text-sm mb-2">Total Budget</div>
            <div className="text-slate-100 text-2xl">€{totalBudget.toFixed(2)}</div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-5 text-center">
            <div className="text-slate-400 text-sm mb-2">Total Spent</div>
            <div className="text-slate-100 text-2xl">€{totalSpent.toFixed(2)}</div>
            <div className="text-slate-500 text-xs mt-1">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </div>
          </div>
          
          <div className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 border ${
            totalRemaining >= 0 ? 'border-emerald-500/50' : 'border-red-500/50'
          } rounded-2xl p-5 text-center`}>
            <div className="text-slate-400 text-sm mb-2">Remaining</div>
            <div className={`text-2xl ${totalRemaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              €{totalRemaining.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Categories on Budget</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400">
                {successRate} / {categories.length}
              </span>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button
            onClick={exportToCSV}
            className="px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={exportToJSON}
            className="px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Charts Section */}
      {categoryPieData.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-slate-100 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Spending Distribution by Category
          </h2>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: number) => `€${value.toFixed(2)}`}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Spending Subcategories */}
      {topSubcategories.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-slate-100 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Top Spending Areas
          </h2>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSubcategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150}
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: number) => `€${value.toFixed(2)}`}
                />
                <Legend />
                <Bar dataKey="amount" fill="#10b981" name="Amount Spent (€)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Red Zones Analysis */}
      {redZones.length > 0 && (
        <div className="bg-gradient-to-br from-red-900/20 to-rose-900/20 backdrop-blur-xl border border-red-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Red Zones - Money Drainers
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            These areas are consuming significant portions of your budget. Consider reducing spending here.
          </p>
          
          <div className="space-y-3">
            {redZones.map((zone, index) => (
              <div
                key={index}
                className="bg-slate-900/40 border border-red-500/30 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-slate-100">{zone.subcategory}</h3>
                    <p className="text-slate-400 text-sm">{zone.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400">€{zone.amount.toFixed(2)}</div>
                    <div className="text-slate-500 text-sm">{zone.percentage.toFixed(1)}% of category</div>
                  </div>
                </div>
                
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-rose-500"
                    style={{ width: `${Math.min(zone.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-xl">
            <p className="text-amber-400 text-sm">
              💡 <strong>Tip:</strong> Focus on reducing spending in the top 2-3 red zones to see the biggest impact on your budget.
            </p>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <h2 className="text-slate-200 mb-4">Category Breakdown</h2>
        <div className="space-y-3">
          {categories.map((cat, index) => {
            const spent = cat.spent.reduce((sum, amt) => sum + amt, 0);
            const percentage = (spent / cat.budget) * 100;
            const isSuccess = cat.remaining >= 0;

            return (
              <div
                key={index}
                className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 border ${
                  isSuccess ? 'border-slate-700/50' : 'border-red-500/30'
                } rounded-2xl p-5`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isSuccess ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <h3 className="text-slate-100">{cat.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className={isSuccess ? 'text-emerald-400' : 'text-red-400'}>
                      €{spent.toFixed(2)}
                    </div>
                    <div className="text-slate-500 text-sm">of €{cat.budget}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        percentage > 100
                          ? 'bg-gradient-to-r from-red-500 to-rose-500'
                          : percentage > 80
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                          : 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                    <div className="text-slate-500 text-xs">Used</div>
                    <div className="text-slate-200">{percentage.toFixed(0)}%</div>
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                    <div className="text-slate-500 text-xs">Days</div>
                    <div className="text-slate-200">{cat.spent.length}</div>
                  </div>
                  <div className={`rounded-lg p-2 text-center ${
                    isSuccess ? 'bg-emerald-900/20' : 'bg-red-900/20'
                  }`}>
                    <div className="text-slate-500 text-xs">Left</div>
                    <div className={isSuccess ? 'text-emerald-400' : 'text-red-400'}>
                      €{cat.remaining.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Subcategory Details */}
                {cat.subcategories.filter(sub => sub.spent.length > 0).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <div className="text-slate-400 text-xs mb-2">Subcategory breakdown:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {cat.subcategories
                        .filter(sub => sub.spent.length > 0)
                        .map((sub, subIndex) => {
                          const subTotal = sub.spent.reduce((sum, s) => sum + s.amount, 0);
                          const subPercentage = (subTotal / spent) * 100;
                          return (
                            <div key={subIndex} className="bg-slate-900/60 rounded-lg p-2">
                              <div className="text-slate-400 text-xs truncate">{sub.name}</div>
                              <div className="text-slate-200 text-sm">€{subTotal.toFixed(2)}</div>
                              <div className="text-slate-500 text-xs">{subPercentage.toFixed(0)}%</div>
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
      </div>

      {/* Performance Message */}
      <div className={`${
        totalRemaining >= 0 
          ? 'bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border-emerald-500/50' 
          : 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-500/50'
      } border rounded-3xl p-6 text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl`}>
        <p className={`${totalRemaining >= 0 ? 'text-emerald-400' : 'text-red-400'} text-lg mb-2`}>
          {totalRemaining >= 0 
            ? '🎉 Great job staying within budget!' 
            : '💡 Review your red zones and adjust spending next month'}
        </p>
        <p className="text-slate-400 text-sm">
          {totalRemaining >= 0 
            ? `You saved €${totalRemaining.toFixed(2)} this month!`
            : `You went over budget by €${Math.abs(totalRemaining).toFixed(2)}`}
        </p>
      </div>

      {/* Start New Month Button */}
      <button
        onClick={onReset}
        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900 rounded-xl transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-5 h-5" />
        Start New Month
      </button>
    </div>
  );
}
