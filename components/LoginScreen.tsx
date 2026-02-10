
import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, ShieldCheck, Cpu, Terminal, CheckCircle2, Shield, Smartphone, Zap, Activity, Lock, BellRing, Check } from 'lucide-react';

interface LoginScreenProps {
  onAuthenticated: () => void;
}

type AuthStage = 'idle' | 'biometric' | 'mfa' | 'zkp' | 'decrypting' | 'ready';

const LoginScreen: React.FC<LoginScreenProps> = ({ onAuthenticated }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isMfaApproving, setIsMfaApproving] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const mfaResolveRef = useRef<(() => void) | null>(null);

  // Digital Rain Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "01SECUREFINANCETWINENCRYPTED89ABCDEF!@#$%^&*";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = "rgba(6, 78, 59, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10b981";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const hexPrefix = `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')}`;
    setLogs(prev => [...prev.slice(-12), `[${timestamp}] [${hexPrefix}] ${msg}`]);
  };

  const handleMfaApproval = () => {
    if (mfaResolveRef.current) {
      setIsMfaApproving(true);
      setTimeout(() => {
        mfaResolveRef.current?.();
        mfaResolveRef.current = null;
        setIsMfaApproving(false);
      }, 800);
    }
  };

  const startLoginSequence = async () => {
    setIsAuthenticating(true);
    setLogs([]);
    
    // Stage 1: Biometric
    setAuthStage('biometric');
    setProgress(15);
    addLog("INITIATING_KERNEL_SECURE_BOOT...");
    addLog("MOUNTING_ENCRYPTED_VOLUME_RSA_4096...");
    await new Promise(r => setTimeout(r, 800));
    addLog("BIOMETRIC_SENSOR_ACTIVE: SCANNING...");
    await new Promise(r => setTimeout(r, 1200));
    addLog("VECTOR_PATTERN_HASH: MATCH_CONFIRMED");

    // Stage 2: MFA Neural Link (Interactive)
    setAuthStage('mfa');
    setProgress(35);
    addLog("SECURE_HANDSHAKE: INITIATING_MFA_AUTH");
    addLog("SENDING_PUSH_CHALLENGE_TO_DEVICE_NODE...");
    
    // Wait for user interaction
    await new Promise<void>((resolve) => {
      mfaResolveRef.current = resolve;
    });

    addLog("MFA_STATUS: APPROVED_BY_USER_DEVICE");

    // Stage 3: ZKP Verification
    setAuthStage('zkp');
    setProgress(60);
    addLog("ZERO_KNOWLEDGE_PROTOCOL_START...");
    addLog("GENERATING_RANDOM_WITNESS_POINT...");
    await new Promise(r => setTimeout(r, 800));
    addLog("ZKP_ITERATION_1: CHALLENGE_RECEIVED");
    await new Promise(r => setTimeout(r, 400));
    addLog("ZKP_ITERATION_2: PROOF_SUBMITTED");
    await new Promise(r => setTimeout(r, 400));
    addLog("ZKP_ITERATION_3: VERIFIED_SUCCESSFULLY");

    // Stage 4: Decrypting
    setAuthStage('decrypting');
    setProgress(85);
    addLog("ACCESS_TOKEN_GENERATED: ECDSA_SHA256");
    addLog("DECRYPTING_USER_PROFILE_AES_256_GCM...");
    addLog("HYDRATING_FINANCIAL_DATA_STRUCTURES...");
    await new Promise(r => setTimeout(r, 1500));

    // Stage 5: Ready
    setAuthStage('ready');
    setProgress(100);
    addLog("AUTHENTICATION_SUCCESSFUL");
    addLog("WELCOMING_RAHUL_SHARMA_TO_FINTWIN_NODE_01");
    
    setTimeout(() => {
      onAuthenticated();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center p-6 overflow-hidden relative">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500 rounded-full blur-[120px] opacity-20"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full mb-8 backdrop-blur-2xl group shadow-2xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.3em]">Encrypted Identity</span>
          </div>
          <h1 className="text-7xl font-black text-white tracking-tighter mb-2 drop-shadow-2xl">FinTwin</h1>
          <p className="text-emerald-400/50 font-bold text-[10px] tracking-[0.6em] uppercase">Private Financial Intelligence</p>
        </div>

        <div className="glass-card rounded-[4rem] p-1 border border-white/10 shadow-[0_50px_120px_-20px_rgba(6,78,59,0.7)] overflow-hidden">
          <div className="bg-emerald-950/70 rounded-[3.8rem] p-12 backdrop-blur-3xl border border-white/5 relative overflow-hidden min-h-[520px] flex flex-col justify-center transition-all duration-500">
            
            {isAuthenticating ? (
              <div className="py-2 flex flex-col items-center text-center animate-in fade-in duration-500">
                <div className="relative mb-14 h-40 flex items-center justify-center w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border border-emerald-500/10 rounded-full animate-spin-slow"></div>
                    <div className="absolute w-56 h-56 border border-teal-500/5 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
                  </div>

                  {authStage === 'biometric' && (
                    <div className="relative flex flex-col items-center animate-in zoom-in duration-500">
                      <Fingerprint className="w-20 h-20 text-emerald-400 animate-pulse" />
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_25px_#34d399] animate-[scan_2s_ease-in-out_infinite]"></div>
                      <p className="mt-4 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Biometric Scan Active</p>
                    </div>
                  )}

                  {authStage === 'mfa' && (
                    <div className="relative flex flex-col items-center animate-in zoom-in duration-500">
                      <div className="relative">
                        <Smartphone className="w-20 h-20 text-teal-400 animate-bounce" />
                        <div className="absolute -top-4 -right-4">
                          <BellRing className="w-8 h-8 text-amber-400 animate-pulse fill-amber-400/20" />
                        </div>
                      </div>
                      
                      {/* MFA Push Notification Mockup */}
                      {!isMfaApproving ? (
                        <div className="mt-6 animate-in slide-in-from-bottom-2 duration-300 w-full max-w-[240px]">
                          <button 
                            onClick={handleMfaApproval}
                            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 p-4 rounded-3xl flex items-center gap-4 transition-all group active:scale-95"
                          >
                            <div className="bg-emerald-500 p-2 rounded-xl">
                              <Check className="w-4 h-4 text-emerald-950" />
                            </div>
                            <div className="text-left">
                              <p className="text-[10px] font-black text-white uppercase tracking-wider">Approve Login?</p>
                              <p className="text-[8px] font-bold text-emerald-400/70">Confirm on your phone</p>
                            </div>
                          </button>
                        </div>
                      ) : (
                        <p className="mt-8 text-[10px] font-black text-teal-500 uppercase tracking-widest animate-pulse">Confirming Node...</p>
                      )}
                    </div>
                  )}

                  {authStage === 'zkp' && (
                    <div className="relative flex flex-col items-center animate-in zoom-in duration-500 w-full">
                      <div className="flex gap-4 items-center">
                         <div className="w-12 h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex items-center justify-center animate-pulse">
                            <Shield className="w-6 h-6 text-emerald-400" />
                         </div>
                         <div className="flex gap-1 animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 delay-200"></div>
                         </div>
                         <div className="w-12 h-12 bg-teal-500/10 rounded-xl border border-teal-500/30 flex items-center justify-center animate-pulse delay-500">
                            <Activity className="w-6 h-6 text-teal-400" />
                         </div>
                      </div>
                      <p className="mt-6 text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">ZKP Validation</p>
                    </div>
                  )}

                  {authStage === 'decrypting' && (
                    <div className="relative flex flex-col items-center animate-in zoom-in duration-500">
                      <Cpu className="w-20 h-20 text-amber-500 animate-spin-slow" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <p className="mt-4 text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Decrypting Vault</p>
                    </div>
                  )}

                  {authStage === 'ready' && (
                    <div className="relative flex flex-col items-center animate-in zoom-in duration-500">
                      <CheckCircle2 className="w-20 h-20 text-emerald-400 animate-bounce" />
                      <p className="mt-4 text-[10px] font-black text-emerald-400 uppercase tracking-widest">Access Granted</p>
                    </div>
                  )}
                </div>

                <div className="space-y-6 w-full px-4">
                  <div className="flex justify-between items-end mb-2">
                    <h3 className="text-[11px] font-black text-emerald-100/40 uppercase tracking-widest">Secure Handshake</h3>
                    <span className="text-[10px] font-black text-emerald-500">{Math.floor(progress)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden w-full mx-auto shadow-inner p-[1px]">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-400 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(52,211,153,0.5)] rounded-full" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div 
                    ref={logRef}
                    className="mt-8 text-left font-mono text-[9px] text-emerald-500/60 space-y-2 w-full p-6 bg-black/50 rounded-[2.5rem] border border-white/5 h-40 overflow-y-auto scrollbar-hide shadow-inner"
                  >
                    {logs.map((log, idx) => (
                      <p key={idx} className="animate-in fade-in slide-in-from-left-1 duration-300 border-l border-emerald-500/20 pl-2">{log}</p>
                    ))}
                    {authStage !== 'ready' && authStage !== 'mfa' && <p className="animate-pulse pl-2 opacity-50">_ WAITING</p>}
                    {authStage === 'mfa' && !isMfaApproving && <p className="animate-pulse pl-2 text-amber-400">_ AWAITING_PUSH_CONFIRMATION...</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12 animate-in slide-in-from-bottom-5 duration-700 py-6">
                <div className="flex flex-col items-center gap-10">
                  <div className="relative group cursor-pointer" onClick={startLoginSequence}>
                    <div className="absolute inset-[-20px] bg-emerald-500/20 rounded-[4rem] blur-3xl opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
                    <div className="relative w-40 h-40 bg-emerald-500/5 rounded-[3.5rem] border border-emerald-500/20 flex items-center justify-center transition-all group-hover:scale-105 shadow-2xl overflow-hidden">
                       <div className="absolute inset-4 border border-dashed border-emerald-500/30 rounded-[2.5rem] animate-[spin_15s_linear_infinite]"></div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <Fingerprint className="w-16 h-16 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                       </div>
                    </div>
                  </div>
                  
                  <div className="w-full">
                    <button 
                      onClick={startLoginSequence}
                      className="w-full py-7 bg-emerald-500 text-emerald-950 font-black rounded-[2.5rem] flex items-center justify-center gap-4 hover:bg-emerald-400 hover:shadow-[0_0_60px_rgba(52,211,153,0.5)] transition-all active:scale-[0.98] group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                      <span className="text-xl uppercase tracking-widest">Biometric Login</span>
                    </button>
                    <p className="text-center mt-6 text-[9px] font-black text-emerald-500/40 uppercase tracking-[0.4em]">Multi-Stage Authentication Required</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-10">
           <div className="flex items-center gap-2 text-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">Hardware Encrypted</span>
           </div>
           <div className="flex items-center gap-2 text-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-700"></div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">Node Synchronized</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
