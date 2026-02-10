import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell, BarChart, Bar, Legend, Sector
} from 'recharts';
import { TrendingUp, Wallet, Target, CreditCard, ChevronRight, Check, ArrowUpRight, Sparkles, PieChart as PieIcon, BarChart3, Edit3 } from 'lucide-react';
import { UserProfile } from '../types.ts';

interface DashboardProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOptimize: () => void;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 14}
        fill={fill}
      />
    </g>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ profile, onUpdateProfile, onOptimize }) => {
  const [editingField, setEditingField] = useState<'assets' | 'spending' | 'goal' | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [activePieIndex, setActivePieIndex] = useState<number>(-1);

  const expenseData = useMemo(() => [
    { name: 'Food', value: profile.expenses.food, limit: profile.budgetLimits.food, color: '#10b981' },
    { name: 'Travel', value: profile.expenses.travel, limit: profile.budgetLimits.travel, color: '#0d9488' },
    { name: 'Subs', value: profile.expenses.subscriptions, limit: profile.budgetLimits.subscriptions, color: '#f59e0b' },
    { name: 'Other', value: profile.expenses.other || 0, limit: profile.budgetLimits.other, color: '#f43f5e' },
  ], [profile.expenses, profile.budgetLimits]);

  const totalMonthlySpending = useMemo(() => 
    expenseData.reduce((acc, curr) => acc + curr.value, 0), 
  [expenseData]);

  const projectionData = useMemo(() => {
    const months = profile.goal.deadlineMonths || 8;
    return Array.from({ length: months + 1 }, (_, i) => ({
      month: i === 0 ? 'Now' : `M${i}`,
      savings: profile.currentSavings + (profile.savingsPerMonth * i),
      target: profile.goal.targetAmount,
    }));
  }, [profile.currentSavings, profile.savingsPerMonth, profile.goal]);

  const cashFlowData = useMemo(() => [
    { month: 'Jan', income: 14500, expenses: 11200 },
    { month: 'Feb', income: 15000, expenses: 12100 },
    { month: 'Mar', income: 15000, expenses: 11800 },
    { month: 'Apr', income: 15200, expenses: 13000 },
    { month: 'May', income: 15000, expenses: 11500 },
    { month: 'Jun', income: profile.monthlyIncome, expenses: totalMonthlySpending },
  ], [profile.monthlyIncome, totalMonthlySpending]);

  const shortfall = profile.goal.targetAmount - (profile.currentSavings + (profile.savingsPerMonth * (profile.goal.deadlineMonths || 0)));

  const startEditing = (type: 'assets' | 'spending' | 'goal', initialVal: number) => {
    setEditingField(type);
    setTempValue(initialVal.toString());
  };

  const saveEdit = () => {
    const val = parseInt(tempValue) || 0;
    if (editingField === 'assets') {
      onUpdateProfile({ currentSavings: val });
    } else if (editingField === 'goal') {
      onUpdateProfile({ goal: { ...profile.goal, targetAmount: val } });
    }
    setEditingField(null);
  };

  // Type cast for Pie to avoid prop definition conflicts
  const PieComponent = Pie as any;

  return (
    <div className="space-y-12 pb-12">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Wallet className="w-5 h-5 text-emerald-600" />} 
          bg="bg-emerald-50"
          title="Current Savings" 
          value={`₹${profile.currentSavings.toLocaleString()}`} 
          trend={`+₹${profile.savingsPerMonth}/mo`}
          onEdit={() => startEditing('assets', profile.currentSavings)}
          isEditing={editingField === 'assets'}
          editComponent={
            <div className="flex items-center gap-2 mt-2">
              <input 
                autoFocus
                type="number" 
                className="w-full bg-white border-2 border-emerald-200 rounded-xl px-3 py-2 text-sm font-black outline-none focus:border-emerald-500"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              />
              <button onClick={saveEdit} className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                <Check className="w-4 h-4" />
              </button>
            </div>
          }
        />
        <StatCard 
          icon={<CreditCard className="w-5 h-5 text-teal-600" />} 
          bg="bg-teal-50" 
          title="Monthly Burn" 
          value={`₹${totalMonthlySpending.toLocaleString()}`} 
          trend="Calculated" 
        />
        <StatCard 
          icon={<Target className="w-5 h-5 text-amber-600" />} 
          bg="bg-amber-50" 
          title={`${profile.goal.name} Target`} 
          value={`₹${profile.goal.targetAmount.toLocaleString()}`} 
          trend={shortfall <= 0 ? "Goal Secured" : `Shortfall: ₹${Math.max(0, shortfall).toLocaleString()}`} 
          onEdit={() => startEditing('goal', profile.goal.targetAmount)}
          isEditing={editingField === 'goal'}
          editComponent={
            <div className="flex items-center gap-2 mt-2">
              <input 
                autoFocus
                type="number" 
                className="w-full bg-white border-2 border-amber-200 rounded-xl px-3 py-2 text-sm font-black outline-none focus:border-amber-500"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
              />
              <button onClick={saveEdit} className="p-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors">
                <Check className="w-4 h-4" />
              </button>
            </div>
          }
        />
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-emerald-900" />} 
          bg="bg-emerald-100/50" 
          title="Risk Strategy" 
          value={profile.riskAppetite} 
          trend="Conservative" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card p-8 sm:p-10 rounded-[3rem] custom-shadow flex flex-col group/chart overflow-visible">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-black text-emerald-950 tracking-tight">Savings Projection</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Interactive Forecast</p>
            </div>
            <div className="flex items-center gap-4 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] font-black text-emerald-900 uppercase">Savings</span>
              </div>
              <div className="flex items-center gap-2 border-l border-emerald-200 pl-4">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-[10px] font-black text-emerald-900 uppercase">Target</span>
              </div>
            </div>
          </div>
          
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} 
                  tickFormatter={(v) => `₹${v/1000}k`}
                />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
                    padding: '16px',
                    zIndex: 1000
                  }}
                  itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorSavings)" 
                  animationDuration={1500}
                  activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 3, fill: '#10b981' }}
                />
                <ReferenceLine 
                  y={profile.goal.targetAmount} 
                  stroke="#f59e0b" 
                  strokeDasharray="8 8" 
                  strokeWidth={2}
                  label={{ position: 'top', value: 'Goal', fill: '#f59e0b', fontSize: 10, fontWeight: 900 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card p-8 sm:p-10 rounded-[3rem] custom-shadow flex flex-col">
          <h3 className="text-xl font-black text-emerald-950 mb-8 flex items-center justify-between">
            Budget Health
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          </h3>
          <div className="space-y-8 flex-1">
            {expenseData.map((item) => {
              const percentage = Math.min((item.value / item.limit) * 100, 100);
              const isOver = item.value > item.limit;
              return (
                <div key={item.name} className="group cursor-default">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5 group-hover:text-emerald-600 transition-colors">{item.name}</span>
                      <span className={`text-sm font-black transition-all ${isOver ? 'text-rose-600' : 'text-emerald-950 group-hover:scale-105 inline-block'}`}>₹{item.value.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400">Target: ₹{item.limit.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-[2px]">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm group-hover:brightness-110" 
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}44`
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-10 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center hover:bg-emerald-100 transition-colors cursor-default">
            <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-1">Efficiency Score</p>
            <p className="text-3xl font-black text-emerald-950">84%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 sm:p-10 rounded-[3rem] custom-shadow flex flex-col overflow-visible">
           <div className="flex items-center gap-3 mb-8">
             <div className="p-2.5 bg-emerald-50 rounded-xl">
               <PieIcon className="w-5 h-5 text-emerald-600" />
             </div>
             <div>
               <h3 className="text-xl font-black text-emerald-950">Spending Mix</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interactive Analysis</p>
             </div>
           </div>
           
           <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="w-full sm:w-1/2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <PieComponent
                      activeIndex={activePieIndex}
                      activeShape={renderActiveShape}
                      data={expenseData}
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1500}
                      onMouseEnter={(_: any, index: number) => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(-1)}
                    >
                      {expenseData.map((entry: any, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke="none"
                          style={{ cursor: 'pointer', outline: 'none' }}
                        />
                      ))}
                    </PieComponent>
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1)', zIndex: 1000 }}
                      itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full sm:w-1/2 space-y-4">
                {expenseData.map((item, index) => (
                  <div 
                    key={item.name} 
                    onMouseEnter={() => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(-1)}
                    className={`flex items-center justify-between p-3 rounded-2xl bg-white border transition-all cursor-pointer ${activePieIndex === index ? 'border-emerald-400 shadow-md translate-x-1' : 'border-emerald-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full transition-transform ${activePieIndex === index ? 'scale-150' : ''}`} style={{ backgroundColor: item.color }}></div>
                      <span className={`text-xs font-black transition-colors ${activePieIndex === index ? 'text-emerald-600' : 'text-emerald-950'}`}>{item.name}</span>
                    </div>
                    <span className="text-xs font-black text-emerald-600">{Math.round((item.value / totalMonthlySpending) * 100)}%</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="glass-card p-8 sm:p-10 rounded-[3rem] custom-shadow flex flex-col">
           <div className="flex items-center gap-3 mb-8">
             <div className="p-2.5 bg-teal-50 rounded-xl">
               <BarChart3 className="w-5 h-5 text-teal-600" />
             </div>
             <div>
               <h3 className="text-xl font-black text-emerald-950">Cash Flow History</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comparative Burn Rate</p>
             </div>
           </div>

           <div className="w-full h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }} 
                    tickFormatter={(v) => `₹${v/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 15px 35px -5px rgba(0,0,0,0.1)', zIndex: 1000 }}
                    cursor={{ fill: '#f0fdf4', opacity: 0.5 }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '20px' }}
                  />
                  <Bar dataKey="income" fill="#064e3b" radius={[6, 6, 0, 0]} barSize={20} animationDuration={1000} />
                  <Bar dataKey="expenses" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} animationDuration={1000} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-emerald-950 p-10 sm:p-14 rounded-[3.5rem] text-white shadow-2xl group">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500 rounded-full blur-[100px] opacity-20 transition-all group-hover:opacity-30"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-white/10">
              <Sparkles className="w-3 h-3 text-amber-400" /> Goal Optimization
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">Secure your {profile.goal.name}</h2>
            <p className="text-emerald-400/80 font-bold text-lg max-w-lg">
              We've calculated a path to hit your ₹{profile.goal.targetAmount.toLocaleString()} target with 98% confidence.
            </p>
          </div>
          <button 
            onClick={onOptimize} 
            className="w-full md:w-auto px-12 py-5 bg-white text-emerald-950 font-black rounded-3xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95 group"
          >
            Optimize Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, bg: string, title: string, value: string, trend: string, onEdit?: () => void, isEditing?: boolean, editComponent?: React.ReactNode }> = ({ icon, bg, title, value, trend, onEdit, isEditing, editComponent }) => (
  <div className="glass-card p-8 rounded-[2.5rem] custom-shadow border border-white/50 group hover:-translate-y-1 transition-all duration-300">
    <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>{icon}</div>
    <div className="flex justify-between items-start">
      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{title}</p>
      {onEdit && !isEditing && (
        <button 
          onClick={onEdit} 
          className="text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1 group/btn"
        >
          <Edit3 className="w-3 h-3" /> Update
        </button>
      )}
    </div>
    {isEditing ? editComponent : (
      <>
        <p className="text-3xl font-black text-emerald-950 tracking-tight transition-transform group-hover:scale-[1.02] inline-block">{value}</p>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{trend}</span>
        </div>
      </>
    )}
  </div>
);

export default Dashboard;