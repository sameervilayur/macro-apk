import React, { useState, useEffect } from 'react';
import {
  Flame,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Activity,
  Utensils,
  Sliders,
  RotateCcw,
  PlusCircle,
  X
} from 'lucide-react';

const DEFAULT_FOODS = [
  { id: '1', name: 'Puttu (1 piece)', serving: '150g', calories: 285, protein: 5.2, carbs: 58, fat: 3.5, category: 'Kerala' },
  { id: '2', name: 'Kadala Curry', serving: '150g (1 bowl)', calories: 210, protein: 9.5, carbs: 26, fat: 7.5, category: 'Kerala' },
  { id: '3', name: 'Idli (2 pcs)', serving: '120g', calories: 130, protein: 4.0, carbs: 26, fat: 0.6, category: 'South Indian' },
  { id: '4', name: 'Dosa (1 plain)', serving: '80g', calories: 135, protein: 3.5, carbs: 23, fat: 3.0, category: 'South Indian' },
  { id: '5', name: 'Appam (2 pcs)', serving: '100g', calories: 190, protein: 3.2, carbs: 38, fat: 2.5, category: 'Kerala' },
  { id: '6', name: 'Kerala Fish Curry', serving: '150g', calories: 195, protein: 22.0, carbs: 5, fat: 9.5, category: 'Kerala' },
  { id: '7', name: 'Matta Rice (Cooked)', serving: '150g (1 cup)', calories: 175, protein: 4.0, carbs: 38, fat: 0.8, category: 'Kerala' },
  { id: '8', name: 'Pathiri (3 pcs)', serving: '90g', calories: 210, protein: 4.2, carbs: 45, fat: 1.2, category: 'Kerala' },
  { id: '9', name: 'Beef Roast (Kerala Style)', serving: '100g', calories: 280, protein: 24.0, carbs: 4, fat: 18.5, category: 'Kerala' },
  { id: '10', name: 'Chapati (1 medium)', serving: '40g', calories: 105, protein: 3.5, carbs: 20, fat: 1.2, category: 'Indian' },
  { id: '11', name: 'Dal Tadka', serving: '150g', calories: 180, protein: 9.0, carbs: 22, fat: 6.0, category: 'Indian' },
  { id: '12', name: 'Paneer Bhurji', serving: '150g', calories: 290, protein: 18.0, carbs: 6, fat: 21.0, category: 'Indian' },
  { id: '13', name: 'Chicken Breast (Grilled)', serving: '150g', calories: 248, protein: 46.5, carbs: 0, fat: 5.4, category: 'Global' },
  { id: '14', name: 'Boiled Eggs (2 large)', serving: '100g', calories: 155, protein: 12.6, carbs: 1.1, fat: 10.6, category: 'Global' },
  { id: '15', name: 'Rolled Oats (Dry)', serving: '50g', calories: 190, protein: 6.5, carbs: 34, fat: 3.2, category: 'Global' },
  { id: '16', name: 'Whey Protein (1 scoop)', serving: '30g', calories: 120, protein: 24.0, carbs: 3, fat: 1.5, category: 'Global' },
  { id: '17', name: 'Banana (Nendran)', serving: '120g', calories: 140, protein: 1.8, carbs: 32, fat: 0.5, category: 'Kerala' }
];

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Saved User Profile & TDEE State
  const [gender, setGender] = useState(() => localStorage.getItem('mc_gender') || 'male');
  const [age, setAge] = useState(() => Number(localStorage.getItem('mc_age')) || 31);
  const [weight, setWeight] = useState(() => Number(localStorage.getItem('mc_weight')) || 72);
  const [height, setHeight] = useState(() => Number(localStorage.getItem('mc_height')) || 172);
  const [activity, setActivity] = useState(() => Number(localStorage.getItem('mc_activity')) || 1.55);
  const [goalOffset, setGoalOffset] = useState(() => Number(localStorage.getItem('mc_goal')) || 0);

  // Macro Ratios (%)
  const [macroSplit, setMacroSplit] = useState(() => {
    const saved = localStorage.getItem('mc_split');
    return saved ? JSON.parse(saved) : { protein: 30, carbs: 45, fat: 25 };
  });

  // Food Library & Daily Logs
  const [foods, setFoods] = useState(() => {
    const saved = localStorage.getItem('mc_foods');
    return saved ? JSON.parse(saved) : DEFAULT_FOODS;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('mc_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedMeal, setSelectedMeal] = useState('Breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    serving: '1 serving',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  // Persist to LocalStorage for offline Android usage
  useEffect(() => {
    localStorage.setItem('mc_gender', gender);
    localStorage.setItem('mc_age', age);
    localStorage.setItem('mc_weight', weight);
    localStorage.setItem('mc_height', height);
    localStorage.setItem('mc_activity', activity);
    localStorage.setItem('mc_goal', goalOffset);
    localStorage.setItem('mc_split', JSON.stringify(macroSplit));
    localStorage.setItem('mc_foods', JSON.stringify(foods));
    localStorage.setItem('mc_logs', JSON.stringify(logs));
  }, [gender, age, weight, height, activity, goalOffset, macroSplit, foods, logs]);

  // Calculate BMR & TDEE (Mifflin-St Jeor)
  const bmr = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = Math.round(bmr * activity);
  const targetCalories = Math.max(1200, tdee + goalOffset);

  const targetProtein = Math.round((targetCalories * (macroSplit.protein / 100)) / 4);
  const targetCarbs = Math.round((targetCalories * (macroSplit.carbs / 100)) / 4);
  const targetFat = Math.round((targetCalories * (macroSplit.fat / 100)) / 9);

  // Calculate Consumed Totals
  const totals = logs.reduce(
    (acc, item) => ({
      calories: acc.calories + Math.round(item.calories * item.multiplier),
      protein: acc.protein + item.protein * item.multiplier,
      carbs: acc.carbs + item.carbs * item.multiplier,
      fat: acc.fat + item.fat * item.multiplier
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const addFoodToLog = (food, multiplier = 1) => {
    setLogs(prev => [
      ...prev,
      { ...food, logId: Date.now() + Math.random(), meal: selectedMeal, multiplier }
    ]);
  };

  const removeLog = (logId) => {
    setLogs(prev => prev.filter(item => item.logId !== logId));
  };

  const autoGenerateMealPlan = () => {
    const baseTotal = 285 + 210 + 175 + 195 + 155 + 210 + 248; // 1478 kcal base
    const scale = Number((targetCalories / baseTotal).toFixed(1));
    const generated = [
      { ...foods[0], logId: Date.now() + 1, meal: 'Breakfast', multiplier: scale },
      { ...foods[1], logId: Date.now() + 2, meal: 'Breakfast', multiplier: scale },
      { ...foods[6], logId: Date.now() + 3, meal: 'Lunch', multiplier: scale },
      { ...foods[5], logId: Date.now() + 4, meal: 'Lunch', multiplier: scale },
      { ...foods[13], logId: Date.now() + 5, meal: 'Snacks', multiplier: scale },
      { ...foods[9], logId: Date.now() + 6, meal: 'Dinner', multiplier: Number((scale * 2).toFixed(1)) },
      { ...foods[12], logId: Date.now() + 7, meal: 'Dinner', multiplier: scale }
    ];
    setLogs(generated);
    setActiveTab('dashboard');
  };

  const handleSaveCustomFood = (e) => {
    e.preventDefault();
    if (!customFood.name || !customFood.calories) return;
    const newEntry = {
      id: Date.now().toString(),
      name: customFood.name,
      serving: customFood.serving || '1 serving',
      calories: Number(customFood.calories) || 0,
      protein: Number(customFood.protein) || 0,
      carbs: Number(customFood.carbs) || 0,
      fat: Number(customFood.fat) || 0,
      category: 'Custom'
    };
    setFoods([newEntry, ...foods]);
    addFoodToLog(newEntry, 1);
    setCustomFood({ name: '', serving: '1 serving', calories: '', protein: '', carbs: '', fat: '' });
    setShowCustomModal(false);
  };

  const calPercentage = Math.min(100, Math.round((totals.calories / targetCalories) * 100));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">Daily Macro Tracker</h1>
            <p className="text-xs text-slate-400">
              Goal: {targetCalories} kcal • {targetProtein}P / {targetCarbs}C / {targetFat}F
            </p>
          </div>
        </div>
        <button
          onClick={autoGenerateMealPlan}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs px-3 py-2 rounded-xl transition active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Auto-Plan
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-4">
        {activeTab === 'dashboard' && (
          <>
            {/* Calorie & Macro Ring Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                {/* Visual Circle */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={totals.calories > targetCalories ? '#ef4444' : '#10b981'}
                      strokeWidth="10"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (264 * calPercentage) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-extrabold">{totals.calories}</span>
                    <span className="text-[10px] text-slate-400">/ {targetCalories} kcal</span>
                  </div>
                </div>

                {/* Macro Progress Bars */}
                <div className="flex-1 space-y-3">
                  <MacroProgress label="Protein" current={Math.round(totals.protein)} target={targetProtein} color="bg-blue-500" />
                  <MacroProgress label="Carbs" current={Math.round(totals.carbs)} target={targetCarbs} color="bg-emerald-500" />
                  <MacroProgress label="Fat" current={Math.round(totals.fat)} target={targetFat} color="bg-amber-500" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Remaining:{' '}
                  <strong className="text-slate-200">{Math.max(0, targetCalories - totals.calories)} kcal</strong>
                </span>
                {logs.length > 0 && (
                  <button
                    onClick={() => setLogs([])}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear Day
                  </button>
                )}
              </div>
            </div>

            {/* Meal Sections */}
            {MEAL_TYPES.map(meal => {
              const mealLogs = logs.filter(item => item.meal === meal);
              const mealCals = mealLogs.reduce((sum, i) => sum + Math.round(i.calories * i.multiplier), 0);

              return (
                <div key={meal} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="font-bold text-sm">{meal}</h2>
                      <p className="text-xs text-emerald-400 font-medium">{mealCals} kcal</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMeal(meal);
                        setActiveTab('foods');
                      }}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {mealLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2">No items logged for {meal.toLowerCase()} yet.</p>
                  ) : (
                    <div className="divide-y divide-slate-800/70">
                      {mealLogs.map(item => (
                        <div key={item.logId} className="py-2.5 flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-slate-200">
                              {item.name} <span className="text-xs text-emerald-400">({item.multiplier}x)</span>
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {Math.round(item.calories * item.multiplier)} kcal •{' '}
                              {Math.round(item.protein * item.multiplier)}g P •{' '}
                              {Math.round(item.carbs * item.multiplier)}g C •{' '}
                              {Math.round(item.fat * item.multiplier)}g F
                            </p>
                          </div>
                          <button
                            onClick={() => removeLog(item.logId)}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'foods' && (
          <div className="space-y-4">
            {/* Meal Target Selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {MEAL_TYPES.map(meal => (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(meal)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedMeal === meal
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  Adding to: {meal}
                </button>
              ))}
            </div>

            {/* Search & Custom Button */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search Puttu, Fish, Oats, Chicken..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={() => setShowCustomModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 shrink-0"
              >
                <PlusCircle className="w-4 h-4" /> Custom
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {['All', 'Kerala', 'South Indian', 'Indian', 'Global', 'Custom'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-slate-200 text-slate-900'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Food List */}
            <div className="space-y-2.5">
              {foods
                .filter(f => categoryFilter === 'All' || f.category === categoryFilter)
                .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(food => (
                  <div
                    key={food.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{food.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {food.serving}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        <strong className="text-emerald-400">{food.calories} kcal</strong> • {food.protein}g P •{' '}
                        {food.carbs}g C • {food.fat}g F
                      </p>
                    </div>
                    <button
                      onClick={() => addFoodToLog(food, 1)}
                      className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition active:scale-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> TDEE & Macro Target Calculator
            </h2>

            {/* Gender */}
            <div className="grid grid-cols-2 gap-2">
              {['male', 'female'].map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border ${
                    gender === g
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Age, Weight, Height */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Age (yrs)</label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Activity Level</label>
              <select
                value={activity}
                onChange={e => setActivity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200"
              >
                <option value={1.2}>Sedentary (Office job, little exercise)</option>
                <option value={1.375}>Lightly Active (1-3 days/week)</option>
                <option value={1.55}>Moderately Active (3-5 days/week)</option>
                <option value={1.725}>Very Active (6-7 days/week)</option>
                <option value={1.9}>Athlete / Physical Job</option>
              </select>
            </div>

            {/* Goal Preset */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Fitness Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Fat Loss (-400)', offset: -400 },
                  { label: 'Maintain', offset: 0 },
                  { label: 'Muscle Gain (+350)', offset: 350 }
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => setGoalOffset(item.offset)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border ${
                      goalOffset === item.offset
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Macro Split Presets */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">
                Macro Split ({macroSplit.protein}% P / {macroSplit.carbs}% C / {macroSplit.fat}% F)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Balanced', split: { protein: 30, carbs: 45, fat: 25 } },
                  { name: 'High Protein', split: { protein: 40, carbs: 35, fat: 25 } },
                  { name: 'Low Carb', split: { protein: 35, carbs: 25, fat: 40 } }
                ].map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => setMacroSplit(preset.split)}
                    className={`py-2 rounded-xl text-xs font-semibold border ${
                      macroSplit.protein === preset.split.protein
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Custom Food Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCustomFood}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Custom Food</h3>
              <button type="button" onClick={() => setShowCustomModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Food name (e.g., Chicken Biryani)"
              required
              value={customFood.name}
              onChange={e => setCustomFood({ ...customFood, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Calories (kcal)"
                required
                value={customFood.calories}
                onChange={e => setCustomFood({ ...customFood, calories: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Serving (e.g., 1 plate)"
                value={customFood.serving}
                onChange={e => setCustomFood({ ...customFood, serving: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Protein (g)"
                value={customFood.protein}
                onChange={e => setCustomFood({ ...customFood, protein: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={customFood.carbs}
                onChange={e => setCustomFood({ ...customFood, carbs: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
              />
              <input
                type="number"
                placeholder="Fat (g)"
                value={customFood.fat}
                onChange={e => setCustomFood({ ...customFood, fat: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm"
            >
              Save & Add to {selectedMeal}
            </button>
          </form>
        </div>
      )}

      {/* Bottom Mobile Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-20 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-md mx-auto grid grid-cols-3 py-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 py-1 text-xs font-medium ${
              activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Activity className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('foods')}
            className={`flex flex-col items-center gap-1 py-1 text-xs font-medium ${
              activeTab === 'foods' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Utensils className="w-5 h-5" />
            Add Food
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 py-1 text-xs font-medium ${
              activeTab === 'settings' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Sliders className="w-5 h-5" />
            TDEE Goals
          </button>
        </div>
      </nav>
    </div>
  );
}

function MacroProgress({ label, current, target, color }) {
  const pct = Math.min(100, Math.round((current / Math.max(1, target)) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="text-slate-400">
          {current}g / {target}g
        </span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
