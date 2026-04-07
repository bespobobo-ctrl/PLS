import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Gamepad2, ShieldCheck, Zap, Settings, BarChart3, Database } from 'lucide-react';

function App() {
    const [view, setView] = useState('login');
    const [holdProgress, setHoldProgress] = useState(0);
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

                            <div className='glass-card p-10 flex flex-col gap-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]'>
                                <div className='space-y-4'>
                                    <div className='relative group'>
                                        <div className='absolute left-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-pls-cyan transition-all duration-300'>
                                            <User size={19} />
                                        </div>
                                        <input
                                            type='text' placeholder='Username'
                                            className='w-full bg-white/[0.04] border border-white/5 rounded-[26px] py-5 px-6 pl-14 text-[13px] font-bold focus:outline-none focus:border-pls-cyan/40 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700'
                                        />
                                    </div>

                                    <div className='relative group'>
                                        <div className='absolute left-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-pls-cyan transition-all duration-300'>
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type='password' placeholder='Password'
                                            className='w-full bg-white/[0.04] border border-white/5 rounded-[26px] py-5 px-6 pl-14 text-[13px] font-bold focus:outline-none focus:border-pls-cyan/40 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700'
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.94 }}
                                    className='group relative w-full py-6 bg-gradient-to-r from-[#00f2ff] to-[#9d3cff] text-black font-extrabold rounded-[30px] text-[15px] uppercase tracking-[5px] shadow-[0_20px_70px_-10px_rgba(0,242,255,0.45)] overflow-hidden transition-all hover:brightness-110'
                                >
                                    <span className='relative z-10 flex items-center justify-center gap-3'>
                                        Join Arena <ArrowRight size={22} className='group-hover:translate-x-2 transition-transform' />
                                    </span>
                                    <div className='absolute inset-0 bg-white/25 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out'></div>
                                </motion.button>
                            </div>
                        </div>

                        <div className='flex justify-center flex-col items-center gap-4 opacity-40 mt-4'>
                            <div className='w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent'></div>
                            <span className='text-[10px] font-black uppercase tracking-[5px] text-slate-500'>2024 © PLS GAME NETWORK</span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='admin' initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className='relative z-10 w-full h-screen p-8 flex flex-col gap-6 max-w-lg mx-auto'
                    >
                        <div className='flex justify-between items-center'>
                            <h1 className='unbounded text-xl font-black italic tracking-tighter text-pls-cyan uppercase'>Admin Panel</h1>
                            <button onClick={() => setView('login')} className='px-4 py-2 glass-card text-[10px] uppercase font-bold tracking-widest'>Logout</button>
                        </div>

                        <div className='grid grid-cols-2 gap-4 flex-1'>
                            <div className='glass-card p-6 flex flex-col justify-between items-start border-white/10 active:scale-95 transition-transform'>
                                <BarChart3 size={24} className='text-pls-cyan' />
                                <span className='text-[10px] font-black uppercase tracking-widest leading-none'>Dashboard</span>
                            </div>
                            <div className='glass-card p-6 flex flex-col justify-between items-start border-white/10 active:scale-95 transition-transform'>
                                <Database size={24} className='text-pls-purple' />
                                <span className='text-[10px] font-black uppercase tracking-widest leading-none'>Database</span>
                            </div>
                            <div className='glass-card p-6 flex flex-col justify-between items-start border-white/10 active:scale-95 transition-transform'>
                                <Settings size={24} className='text-pls-red' />
                                <span className='text-[10px] font-black uppercase tracking-widest leading-none'>Settings</span>
                            </div>
                            <div className='glass-card p-6 flex flex-col justify-between items-start border-white/10 bg-white/5 active:scale-95 transition-transform'>
                                <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></div>
                                <span className='text-[10px] font-black uppercase tracking-widest leading-none'>Live Monitor</span>
                            </div>
                        </div>

                        <div className='glass-card p-8 flex flex-col gap-2'>
                            <h4 className='text-xs font-black uppercase tracking-widest text-slate-400'>System Status</h4>
                            <div className='flex items-center gap-2'>
                                <div className='flex-1 h-1 bg-white/10 rounded-full overflow-hidden'>
                                    <div className='w-3/4 h-full bg-pls-cyan shadow-[0_0_10px_theme("colors.pls-cyan")]'></div>
                                </div>
                                <span className='text-[10px] font-bold'>75%</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
