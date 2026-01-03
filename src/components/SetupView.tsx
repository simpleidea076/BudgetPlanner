import { useState } from 'react';
import { Plus, Calendar, TrendingUp, ArrowRight, X, Tags } from 'lucide-react';

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

type SetupViewProps = {
  categories: Category[];
  onAddCategory: (name: string, budget: number, subcategories: string[]) => void;
  onStartMonth: (days: number) => void;
};

const COMMON_SUBCATEGORIES = {
  Groceries: ['Food & Beverages', 'Household Items', 'Personal Care', 'Snacks'],
  Entertainment: ['Streaming Services', 'Movies & Theater', 'Games', 'Hobbies', 'Subscriptions'],
  Dining: ['Restaurants', 'Fast Food', 'Coffee Shops', 'Delivery'],
  Transportation: ['Fuel', 'Public Transit', 'Parking', 'Maintenance', 'Ride Share'],
  Shopping: ['Clothing', 'Electronics', 'Home Goods', 'Gifts', 'Online Shopping'],
  Utilities: ['Electricity', 'Water', 'Internet', 'Phone', 'Gas'],
  Health: ['Medications', 'Doctor Visits', 'Gym', 'Supplements', 'Insurance'],
  Education: ['Books', 'Courses', 'Supplies', 'Tuition']
};

export function SetupView({ categories, onAddCategory, onStartMonth }: SetupViewProps) {
  const [days, setDays] = useState('');
  const [catName, setCatName] = useState('');
  const [catBudget, setCatBudget] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState('');

  const handleAddCategory = () => {
    const budget = Number(catBudget);
    if (!catName.trim() || !budget || subcategories.length === 0) return;

    onAddCategory(catName.trim(), budget, subcategories);
    setCatName('');
    setCatBudget('');
    setSubcategories([]);
  };

  const handleStartMonth = () => {
    const numDays = Number(days);
    if (!numDays || categories.length === 0) return;
    onStartMonth(numDays);
  };

  const addSubcategory = () => {
    if (!newSubcategory.trim()) return;
    if (subcategories.includes(newSubcategory.trim())) return;
    
    setSubcategories([...subcategories, newSubcategory.trim()]);
    setNewSubcategory('');
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const useSuggestedSubcategories = (categoryName: string) => {
    const suggested = COMMON_SUBCATEGORIES[categoryName as keyof typeof COMMON_SUBCATEGORIES];
    if (suggested) {
      setSubcategories(suggested);
    }
  };

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-10 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 mb-4 shadow-lg shadow-emerald-500/30">
          <TrendingUp className="w-8 h-8 text-slate-900" />
        </div>
        <h1 className="text-slate-100 mb-2">Monthly Budget Planner</h1>
        <p className="text-slate-400">Take control of your spending habits with detailed tracking</p>
      </div>

      {/* Days Input */}
      <div className="mb-6">
        <label className="block text-slate-300 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Days in Month
        </label>
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="e.g., 30"
          className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
        />
      </div>

      {/* Add Category Section */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-5 mb-6">
        <h2 className="text-slate-200 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Budget Category
        </h2>
        
        <div className="space-y-3">
          <input
            type="text"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            placeholder="Category name (e.g., Groceries)"
            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />

          {/* Quick suggestions if category name matches */}
          {catName && Object.keys(COMMON_SUBCATEGORIES).some(key => 
            key.toLowerCase().includes(catName.toLowerCase())
          ) && subcategories.length === 0 && (
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-cyan-400 text-sm mb-2">💡 Quick suggestions available:</p>
              <div className="flex flex-wrap gap-2">
                {Object.keys(COMMON_SUBCATEGORIES)
                  .filter(key => key.toLowerCase().includes(catName.toLowerCase()))
                  .map(key => (
                    <button
                      key={key}
                      onClick={() => {
                        setCatName(key);
                        useSuggestedSubcategories(key);
                      }}
                      className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg text-cyan-300 text-sm transition-all"
                    >
                      Use {key} template
                    </button>
                  ))}
              </div>
            </div>
          )}
          
          <input
            type="number"
            value={catBudget}
            onChange={(e) => setCatBudget(e.target.value)}
            placeholder="Budget amount (€)"
            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />

          {/* Subcategories Section */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <label className="block text-slate-300 mb-3 flex items-center gap-2">
              <Tags className="w-4 h-4" />
              Subcategories (Track where money goes within this category)
            </label>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Add subcategory (e.g., Food & Beverages)"
                className="flex-1 px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addSubcategory()}
              />
              <button
                onClick={addSubcategory}
                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 rounded-lg transition-all text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {subcategories.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm"
                  >
                    {sub}
                    <button
                      onClick={() => removeSubcategory(index)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {subcategories.length === 0 && (
              <p className="text-slate-500 text-sm italic">Add at least one subcategory to track detailed spending</p>
            )}
          </div>
          
          <button
            onClick={handleAddCategory}
            disabled={!catName.trim() || !catBudget || subcategories.length === 0}
            className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-slate-300 mb-3">Your Categories</h3>
          <div className="space-y-3">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-200">{cat.name}</span>
                  <span className="text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-lg">
                    €{cat.budget.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cat.subcategories.map((sub, subIndex) => (
                    <span
                      key={subIndex}
                      className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Total Budget</span>
              <span className="text-emerald-400">€{totalBudget.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={handleStartMonth}
        disabled={!days || categories.length === 0}
        className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-slate-900 rounded-xl transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
      >
        Start Month
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
