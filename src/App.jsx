import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Gamepad2, ShieldCheck, Zap, Settings, BarChart3, Database, Users, Monitor, CreditCard, Activity, LogOut, ChevronRight } from 'lucide-react';

function App() {
    const [view, setView] = useState('login');
    const [holdProgress, setHoldProgress] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const holdTimer = useRef(null);

    useEffect(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    }, []);

    const startHold = () => {
        let progress = 0;
        holdTimer.current = setInterval(() => {
            progress += 1;
            setHoldProgress(progress);
            if (progress >= 30) {
                clearInterval(holdTimer.current);
                setHoldProgress(0);
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
                setView('admin');
            }
        }, 100);
    };

    const stopHold = () => {
        clearInterval(holdTimer.current);
        setHoldProgress(0);
    };

    const handleLogin = (e) => {
        e?.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        // Simulation of login
        setTimeout(() => {
            if (username.toLowerCase() === 'admin' && password === 'admin777') {
                setView('admin');
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                }
            } else if (username && password) {
                setView('player');
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                }
            } else {
                setErrorMessage('Iltimos, ma\'lumotlarni to\'ldiring');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className='min-h-screen relative bg-[#050210] text-white font-outfit overflow-hidden selection:bg-pls-cyan/30'>
            <div className='fixed inset-0 z-0 overflow-hidden'>
                <img src='/club-v2.png' className='w-full h-full object-cover scale-[1.05]' alt='BG' />
                <div className='absolute inset-0 z-0 bg-gradient-to-b from-[#050210]/40 via-[#050210]/75 to-[#050210]'></div>
                <div className='mesh-gradient'></div>
            </div>

            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div
                        key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className='relative z-10 w-full h-screen flex flex-col justify-between p-8 pb-14 max-w-lg mx-auto'
                    >
                        <div className='flex justify-between items-center opacity-90'>
                            <div className='flex items-center gap-3'>
                                <div className='w-11 h-11 glass-card flex items-center justify-center border-white/20'>
                                    <Gamepad2 size={22} className='text-pls-cyan' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='unbounded text-[15px] leading-none font-black tracking-[5px] text-white uppercase'>PLS</span>
                                    <span className='text-[10px] text-pls-cyan font-black uppercase tracking-[3px] leading-none mt-1'>Kokand</span>
                                </div>
                            </div>

                            <motion.div
                                onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}
                                className='relative overflow-hidden cursor-pointer flex items-center gap-2 px-4 py-2.5 glass-card border-white/5 active:scale-95 transition-transform'
                            >
                                {holdProgress > 0 && (
                                    <div
                                        className='absolute left-0 bottom-0 h-1 bg-pls-cyan transition-all duration-100'
                                        style={{ width: `${(holdProgress / 30) * 100}%` }}
                                    ></div>
                                )}
                                <ShieldCheck size={14} className={holdProgress > 0 ? 'text-pls-cyan animate-pulse' : 'text-emerald-400'} />
                                <span className='text-[10px] font-black uppercase tracking-widest text-emerald-400/90'>Secured</span>
                            </motion.div>
                        </div>

                        <div className='mb-4'>
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='flex flex-col gap-3 mb-12 text-center'>
                                <h2 className='text-7xl font-black italic unbounded tracking-[-3px] leading-none uppercase'>
                                    <span className='block text-transparent bg-clip-text bg-gradient-to-r from-[#ff3c41] via-[#9d3cff] to-[#00f2ff] drop-shadow-2xl'>ARENA</span>
                                </h2>
                                <p className='text-slate-400 text-[11px] tracking-widest uppercase font-black opacity-50 flex items-center justify-center gap-2'>
                                    <Zap size={10} className='text-pls-cyan' /> Player Session Authorization
                                </p>
                            </motion.div>

                            <form onSubmit={handleLogin} className='glass-card p-10 flex flex-col gap-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]'>
                                <div className='space-y-4'>
                                    <div className='relative group'>
                                        <div className='absolute left-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-pls-cyan transition-all duration-300'>
                                            <User size={19} />
                                        </div>
                                        <input
                                            type='text' placeholder='Username'
                                            value={username} onChange={(e) => setUsername(e.target.value)}
                                            className='w-full bg-white/[0.04] border border-white/5 rounded-[26px] py-5 px-6 pl-14 text-[13px] font-bold focus:outline-none focus:border-pls-cyan/40 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700'
                                        />
                                    </div>

                                    <div className='relative group'>
                                        <div className='absolute left-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-pls-cyan transition-all duration-300'>
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type='password' placeholder='Password'
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            className='w-full bg-white/[0.04] border border-white/5 rounded-[26px] py-5 px-6 pl-14 text-[13px] font-bold focus:outline-none focus:border-pls-cyan/40 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700'
                                        />
                                    </div>
                                    {errorMessage && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-[10px] text-red-500 font-bold uppercase tracking-widest text-center'>{errorMessage}</motion.p>
                                    )}
                                </div>

                                <motion.button
                                    type="submit"
                                    whileTap={{ scale: 0.94 }}
                                    disabled={isLoading}
                                    className='group relative w-full py-6 bg-gradient-to-r from-[#00f2ff] to-[#9d3cff] text-black font-extrabold rounded-[30px] text-[15px] uppercase tracking-[5px] shadow-[0_20px_70px_-10px_rgba(0,242,255,0.45)] overflow-hidden transition-all hover:brightness-110'
                                >
                                    <span className='relative z-10 flex items-center justify-center gap-3'>
                                        {isLoading ? 'Connecting...' : 'Join Arena'} <ArrowRight size={22} className='group-hover:translate-x-2 transition-transform' />
                                    </span>
                                    <div className='absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out'></div>
                                </motion.button>
                                
                                <div className='flex justify-center'>
                                    <button 
                                        type="button"
                                        onClick={() => { setUsername('admin'); setPassword(''); }}
                                        className='text-[9px] font-black uppercase tracking-[4px] text-pls-cyan/40 hover:text-pls-cyan transition-colors'
                                    >
                                        Bypass Mode
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className='flex justify-center flex-col items-center gap-4 opacity-40 mt-4'>
                            <div className='w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent'></div>
                            <span className='text-[10px] font-black uppercase tracking-[5px] text-slate-500'>2024 © PLS GAME NETWORK</span>
                        </div>
                    </motion.div>
                ) : view === 'admin' ? (
                    <motion.div
                        key='admin' initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className='relative z-10 w-full h-screen p-6 pb-20 flex flex-col gap-6 max-w-lg mx-auto overflow-y-auto'
                    >
                        <div className='flex justify-between items-center bg-[#050210]/50 backdrop-blur-xl sticky top-0 z-50 py-4 border-b border-white/5'>
                            <div className='flex items-center gap-3'>
                                <div className='w-8 h-8 rounded-full bg-pls-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.5)]'>
                                    <Settings size={16} className='text-black' />
                                </div>
                                <h1 className='unbounded text-sm font-black italic tracking-tighter text-white uppercase'>ADMIN DASHBOARD</h1>
                            </div>
                            <button onClick={() => setView('login')} className='px-4 py-2 glass-card text-[9px] uppercase font-black tracking-widest text-[#ff3c41] border-[#ff3c41]/30'>
                                <LogOut size={12} className='inline mr-1' /> Exit
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='glass-card p-4 border-white/10'>
                                <Users size={18} className='text-pls-cyan mb-2' />
                                <h4 className='text-[18px] font-black'>14 / 20</h4>
                                <p className='text-[9px] uppercase font-bold text-slate-500 tracking-wider'>Active Players</p>
                            </div>
                            <div className='glass-card p-4 border-white/10'>
                                <Monitor size={18} className='text-pls-purple mb-2' />
                                <h4 className='text-[18px] font-black'>82%</h4>
                                <p className='text-[9px] uppercase font-bold text-slate-500 tracking-wider'>Load Level</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className='flex flex-col gap-3'>
                            <h3 className='text-[10px] font-black uppercase tracking-[3px] text-pls-cyan pl-1'>System Control</h3>
                            <div className='glass-card p-0 overflow-hidden border-white/5'>
                                <button className='w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors border-b border-white/5'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center'>
                                            <CreditCard size={18} className='text-emerald-400' />
                                        </div>
                                        <div className='text-left'>
                                            <p className='text-[12px] font-bold'>Balans To'ldirish</p>
                                            <p className='text-[9px] text-slate-500 uppercase'>Manage user balances</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className='text-slate-600' />
                                </button>
                                <button className='w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors border-b border-white/5'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center'>
                                            <Activity size={18} className='text-pls-cyan' />
                                        </div>
                                        <div className='text-left'>
                                            <p className='text-[12px] font-bold'>Xonalar Nazorati</p>
                                            <p className='text-[9px] text-slate-500 uppercase'>Real-time PC Monitoring</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className='text-slate-600' />
                                </button>
                                <button className='w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors'>
                                    <div className='flex items-center gap-4'>
                                        <div className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center'>
                                            <Database size={18} className='text-pls-purple' />
                                        </div>
                                        <div className='text-left'>
                                            <p className='text-[12px] font-bold'>Hisobotlar</p>
                                            <p className='text-[9px] text-slate-500 uppercase'>Generate income reports</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className='text-slate-600' />
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className='flex flex-col gap-3'>
                            <h3 className='text-[10px] font-black uppercase tracking-[3px] text-pls-purple pl-1'>Live Activity</h3>
                            <div className='glass-card p-5 space-y-4 border-white/5'>
                                {[
                                    { user: 'shox_pro', action: 'Session started - PC #04', time: '2m ago', color: 'text-pls-cyan' },
                                    { user: 'admin_bek', action: 'Balance topup - $15.00', time: '12m ago', color: 'text-emerald-400' },
                                    { user: 'dark_rider', action: 'Session ended - PC #12', time: '24m ago', color: 'text-[#ff3c41]' }
                                ].map((item, i) => (
                                    <div key={i} className='flex justify-between items-start border-b border-white/[0.03] pb-3 last:border-0 last:pb-0'>
                                        <div>
                                            <p className='text-[11px] font-bold'>{item.user}</p>
                                            <p className={`text-[9px] ${item.color} uppercase font-medium mt-0.5`}>{item.action}</p>
                                        </div>
                                        <span className='text-[9px] text-slate-500 font-bold'>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='player' initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className='relative z-10 w-full h-screen p-8 flex flex-col items-center justify-center gap-8 max-w-lg mx-auto'
                    >
                        <div className='w-24 h-24 rounded-full border-4 border-pls-cyan flex items-center justify-center relative shadow-[0_0_50px_rgba(0,242,255,0.3)]'>
                            <motion.div 
                                animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className='absolute inset-0 border-t-4 border-transparent border-t-white rounded-full'
                            />
                            <ShieldCheck size={40} className='text-pls-cyan' />
                        </div>
                        <div className='text-center space-y-2'>
                            <h2 className='unbounded text-2xl font-black italic'>XUSH KELIBSIZ!</h2>
                            <p className='text-slate-400 text-xs font-bold uppercase tracking-widest'>Sessiya muvaffaqiyatli faollashtirildi</p>
                        </div>
                        <div className='glass-card p-6 w-full text-center space-y-4'>
                            <p className='text-[10px] text-slate-500 uppercase tracking-[2px] font-black'>Sizning identifikatoringiz:</p>
                            <p className='unbounded text-pls-cyan text-lg font-black'>#{username.toUpperCase()}</p>
                        </div>
                        <button onClick={() => setView('login')} className='text-xs font-black uppercase tracking-[5px] text-slate-500 hover:text-white transition-colors'>Ortga qaytish</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;

