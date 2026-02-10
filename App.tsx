
import React, { useState } from 'react';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import ChatInterface from './components/ChatInterface.tsx';
import LoginScreen from './components/LoginScreen.tsx';
import { DEFAULT_USER } from './constants.ts';
import { UserProfile } from './types.ts';
import { 
  Sparkles, X, Briefcase, Calendar, Zap, TrendingDown, Edit2, 
  CheckCircle2, Lock, Link as LinkIcon, PiggyBank, Target, ArrowUpRight, Check
} from 'lucide-react';

const Badge: React.FC<{ color: string, label: string }> = ({ color, label }) => (
  <span className={`px-5 py-2 ${color} text-[10px] font-black rounded-2xl uppercase tracking-[0.15em] shadow-sm`}>
    {label}
  </span>
);

const ProfileInfoCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-white/40 p-5 rounded-3xl border border-emerald-50 shadow-sm flex items-center gap-4">
    <div className="p-3 bg-emerald-50 rounded-2xl">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-black text-emerald-950 tracking-tight">{value}</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER);
  const [optimizeTrigger, setOptimizeTrigger] = useState(0);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditingGoalInModal, setIsEditingGoalInModal] = useState(false);
  const [tempGoalValue, setTempGoalValue] = useState(profile.goal.targetAmount.toString());

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const saveGoalInModal = () => {
    const val = parseInt(tempGoalValue) || 0;
    handleUpdateProfile({ goal: { ...profile.goal, targetAmount: val } });
    setIsEditingGoalInModal(false);
  };

  const handleOptimizeRequest = () => {
    setOptimizeTrigger(prev => prev + 1);
    const chatElement = document.getElementById('advisor-section');
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] animate-in fade-in zoom-in">
      <Header onProfileClick={() => setIsProfileModalOpen(true)} />
      
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-emerald-950/40 backdrop-blur-xl animate-in fade-in">
          <div className="relative glass-card w-full max-w-2xl rounded-[3rem] p-10 custom-shadow animate-in zoom-in slide-in-up overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 bg-amber-100 rounded-full blur-3xl opacity-30"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="flex gap-6 items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-200 rounded-[2rem] blur-lg opacity-40"></div>
                    <img 
                      src="https://picsum.photos/seed/rahul/160/160" 
                      alt="Large Profile" 
                      className="relative w-24 h-24 rounded-[2rem] border-4 border-white object-cover shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 p-2 rounded-xl text-white shadow-lg">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-emerald-950 tracking-tight">{profile.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">Student Tier</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="p-3 bg-white/50 hover:bg-white rounded-2xl transition-all shadow-sm border border-emerald-50 text-slate-400 hover:text-emerald-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Basic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <ProfileInfoCard icon={<Briefcase className="w-4 h-4 text-emerald-600" />} label="Occupation" value={profile.occupation} />
                <ProfileInfoCard icon={<Calendar className="w-4 h-4 text-emerald-600" />} label="Age" value={`${profile.age} Years`} />
                <ProfileInfoCard icon={<Zap className="w-4 h-4 text-emerald-600" />} label="Income Sources" value="Stipend + Part-time" />
                <ProfileInfoCard icon={<TrendingDown className="w-4 h-4 text-emerald-600" />} label="Risk Appetite" value={profile.riskAppetite} />
              </div>

              {/* Financial Summary Section */}
              <div className="space-y-4 mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Financial Footprint</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                    <div className="flex items-center justify-between mb-2">
                       <PiggyBank className="w-4 h-4 text-emerald-600" />
                       <span className="text-[9px] font-black text-emerald-600 uppercase">Savings</span>
                    </div>
                    <p className="text-xl font-black text-emerald-950">₹{profile.currentSavings.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-emerald-600/60 mt-1">+₹{profile.savingsPerMonth} Monthly</p>
                  </div>

                  <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                    <div className="flex items-center justify-between mb-2">
                       <Target className="w-4 h-4 text-amber-600" />
                       <button 
                        onClick={() => {
                          setTempGoalValue(profile.goal.targetAmount.toString());
                          setIsEditingGoalInModal(!isEditingGoalInModal);
                        }}
                        className="text-[9px] font-black text-amber-600 uppercase flex items-center gap-1 hover:bg-amber-100 px-2 py-0.5 rounded-lg transition-colors"
                       >
                         Goal {isEditingGoalInModal ? 'Cancel' : 'Edit'}
                       </button>
                    </div>
                    {isEditingGoalInModal ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input 
                          autoFocus
                          type="number" 
                          value={tempGoalValue}
                          onChange={(e) => setTempGoalValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveGoalInModal()}
                          className="w-full bg-white border border-amber-200 rounded-xl px-2 py-1 text-sm font-black outline-none"
                        />
                        <button onClick={saveGoalInModal} className="p-1.5 bg-amber-600 text-white rounded-lg">
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xl font-black text-emerald-950">₹{profile.goal.targetAmount.toLocaleString()}</p>
                    )}
                    <p className="text-[10px] font-bold text-amber-600/60 mt-1">{profile.goal.name} Project</p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                       <ArrowUpRight className="w-4 h-4 text-slate-600" />
                       <span className="text-[9px] font-black text-slate-600 uppercase">Income</span>
                    </div>
                    <p className="text-xl font-black text-emerald-950">₹{profile.monthlyIncome.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">Total Recurring</p>
                  </div>
                </div>
              </div>

              {/* Bio/Context Footer */}
              <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50"></div>
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Financial Persona</h4>
                  <p className="text-sm font-medium leading-relaxed opacity-80 mb-6">
                    {profile.name} is managing his ₹{profile.monthlyIncome.toLocaleString()} monthly cash flow from stipend and part-time earnings. He maintains a consistent ₹{profile.savingsPerMonth} monthly saving strategy toward a high-performance {profile.goal.name}.
                  </p>
                  <div className="flex gap-3">
                    <button className="flex-1 py-4 bg-white text-emerald-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all active:scale-95">
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-1.5 bg-emerald-600 rounded-full"></div>
                  <span className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.3em]">My Money Map</span>
                </div>
                <h1 className="text-5xl font-black text-emerald-950 tracking-tight leading-none">
                  Overview
                </h1>
                <p className="text-emerald-800/40 font-bold text-base max-w-md">
                  Keep track of your monthly spending and goal progress in one place.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge color="bg-amber-50 text-amber-800 ring-1 ring-amber-100" label="1 Goal Active" />
              </div>
            </div>
            <Dashboard 
              profile={profile} 
              onUpdateProfile={handleUpdateProfile} 
              onOptimize={handleOptimizeRequest}
            />
          </div>
          
          <div id="advisor-section" className="xl:col-span-4 flex flex-col gap-10">
            <div className="sticky top-32 space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-emerald-950 tracking-tight flex items-center gap-3">
                  FinTwin <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                </h2>
                <div className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  Assistant
                </div>
              </div>
              <ChatInterface profile={profile} optimizeTrigger={optimizeTrigger} />
              <div className="glass-card p-10 rounded-[3rem] border border-emerald-100/50 custom-shadow overflow-hidden relative group/next">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <LinkIcon className="w-20 h-20 text-emerald-900" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-black text-emerald-950 text-xl tracking-tight">Integrations</h4>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Future Updates</p>
                    </div>
                    <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">
                      Coming Soon
                    </div>
                  </div>
                  <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 border-dashed">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-sm">
                        <Lock className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-emerald-900 leading-tight">Bank & UPI Linkage</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Soon you'll be able to sync your bank accounts and UPI transactions for automatic tracking.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 py-16 bg-white border-t border-emerald-50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-950 p-2.5 rounded-2xl">
              <div className="w-4 h-4 border-2 border-white rounded rotate-45"></div>
            </div>
            <div>
              <span className="text-lg font-black text-emerald-950 tracking-tight">FinTwin</span>
              <p className="text-[11px] font-black text-emerald-500/40 uppercase tracking-widest">Your Personal Financial Assistant</p>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
            &copy; 2026 FinTwin
          </p>
          <div className="flex gap-10 text-[11px] font-black text-emerald-800/40 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-700 transition-colors">Compliance</a>
            <a href="#" className="hover:text-emerald-700 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
