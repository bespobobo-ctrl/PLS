import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Gamepad2, ShieldCheck, Zap, Settings, BarChart3, Database, Users, Monitor, CreditCard, Activity, LogOut, ChevronRight } from 'lucide-react';

function App() {
    const [view, setView] = useState('login');
    const [holdProgress, setHoldProgress] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
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
                setView('admin-login');
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
        setTimeout(() => {
            if (username && password) {
                setView('player');
            } else {
                setErrorMessage('MA\'LUMOTLARNI KIRITING');
            }
            setIsLoading(false);
        }, 1200);
    };

    const handleAdminVerify = (e) => {
        e?.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setTimeout(() => {
            if (adminUser.toLowerCase() === 'admin' && adminPass === 'admin777') {
                setView('admin');
            } else {
                setErrorMessage('IDENTIFIKATSIYA XATOSI');
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
                }
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className='min-h-screen relative bg-[#05040a] text-white font-outfit overflow-hidden selection:bg-pls-cyan/30'>
            {/* Background Layers */}
            <div className='fixed inset-0 z-0 overflow-hidden pointer-events-none'>
                <img src='/club-v2.png' className='w-full h-full object-cover opacity-30 grayscale blur-[2px] scale-110' alt='BG' />
                <div className='absolute inset-0 bg-gradient-to-b from-[#05040a]/80 via-[#05040a]/40 to-[#05040a]'></div>
            </div>

            <div className='grid-overlay'></div>
            <div className='scanline'></div>

            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div
                        key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                        className='relative z-10 w-full h-screen flex flex-col justify-between p-8 pb-14 max-w-lg mx-auto'
                    >
                        {/* Header */}
                        <div className='flex justify-between items-start pt-4'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 flex items-center justify-center relative'>
                                    <div className='absolute inset-0 border border-pls-cyan/30 rotate-45 animate-spin-slow'></div>
                                    <Gamepad2 size={24} className='text-pls-cyan' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='syncopate text-xl font-black tracking-[4px] text-white leading-none'>PLS</span>
                                    <span className='text-[9px] text-pls-cyan font-black uppercase tracking-[3px] mt-1 opacity-70'>KOKAND ARENA</span>
                                </div>
                            </div>

                            <motion.div
                                onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}
                                className='industrial-card px-4 py-3 flex items-center gap-3 cursor-pointer active:scale-95 transition-all overflow-hidden'
                            >
                                {holdProgress > 0 && (
                                    <div
                                        className='absolute left-0 bottom-0 h-0.5 bg-pls-cyan transition-all duration-100 shadow-[0_0_10px_#00f2ff]'
                                        style={{ width: `${(holdProgress / 30) * 100}%` }}
                                    ></div>
                                )}
                                <ShieldCheck size={14} className={holdProgress > 0 ? 'text-pls-cyan animate-pulse' : 'text-emerald-400'} />
                                <span className='text-[9px] font-black uppercase tracking-[2px] text-white/80'>Secured</span>
                            </motion.div>
                        </div>

                        {/* Center Logo */}
                        <div className='mb-2'>
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='flex flex-col gap-2 mb-12 text-center'>
                                <h2 className='text-8xl font-black italic syncopate tracking-[-6px] leading-none uppercase relative'>
                                    <span className='relative z-10 block text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40'>ARENA</span>
                                    <div className='absolute -inset-2 bg-pls-cyan/5 blur-3xl rounded-full'></div>
                                </h2>
                                <p className='text-pls-cyan text-[9px] tracking-[4px] uppercase font-black opacity-40 mt-2'>
                                    SYSTEM AUTH REQUEST [2026]
                                </p>
                            </motion.div>

                            {/* Login Form */}
                            <form onSubmit={handleLogin} className='industrial-card p-12 flex flex-col gap-10'>
                                <div className='space-y-6'>
                                    <div className='relative'>
                                        <div className='absolute left-0 top-0 w-2 h-2 border-t border-l border-pls-cyan/40'></div>
                                        <input
                                            type='text' placeholder='OPERATOR IDENT'
                                            value={username} onChange={(e) => setUsername(e.target.value)}
                                            className='input-tech pl-4'
                                        />
                                    </div>

                                    <div className='relative'>
                                        <div className='absolute left-0 top-0 w-2 h-2 border-t border-l border-pls-purple/40'></div>
                                        <input
                                            type='password' placeholder='ACCESS CODE'
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            className='input-tech pl-4'
                                        />
                                    </div>
                                    {errorMessage && (
                                        <p className='text-[10px] text-red-500 font-bold uppercase tracking-[3px] text-center'>{errorMessage}</p>
                                    )}
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className='btn-premium w-full py-6 text-[14px]'
                                >
                                    {isLoading ? 'INITIALIZING...' : 'AUTHORIZE SESSION'}
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className='flex justify-between items-center opacity-30 mt-6 pt-6 border-t border-white/5'>
                            <span className='text-[8px] font-black uppercase tracking-[3px]'>NEURAL ENGINE v4.2</span>
                            <span className='text-[8px] font-black uppercase tracking-[3px]'>2024 © PLS NETWORK</span>
                        </div>
                    </motion.div>
                ) : view === 'admin-login' ? (
                    <motion.div
                        key='admin-login' initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: 'blur(20px)' }}
                        className='relative z-20 w-full h-screen flex flex-col items-center justify-center p-8 max-w-lg mx-auto bg-black'
                    >
                        <div className='industrial-card p-12 w-full flex flex-col items-center gap-12 border-t-2 border-t-pls-cyan animate-pulse-slow'>
                            <div className='flex flex-col items-center gap-4'>
                                <div className='w-20 h-20 rounded-none border border-pls-cyan/20 flex items-center justify-center relative overflow-hidden'>
                                    <div className='absolute inset-0 bg-pls-cyan/5 animate-pulse'></div>
                                    <ShieldCheck size={40} className='text-pls-cyan drop-shadow-[0_0_10px_rgba(0,242,255,1)]' />
                                </div>
                                <h3 className='syncopate text-[12px] font-black tracking-[6px] text-pls-cyan mt-4'>RESTRICTED ACCESS</h3>
                            </div>

                            <form onSubmit={handleAdminVerify} className='w-full space-y-10'>
                                <div className='space-y-6'>
                                    <div className='relative'>
                                        <p className='text-[8px] font-black text-pls-cyan/40 uppercase mb-2 tracking-[2px] ml-2'>Identity.Node</p>
                                        <input
                                            type='text' placeholder='ID_HEX'
                                            value={adminUser} onChange={(e) => setAdminUser(e.target.value)}
                                            className='input-tech text-center tracking-[4px] uppercase text-lg h-16 border-white/5'
                                        />
                                    </div>
                                    <div className='relative'>
                                        <p className='text-[8px] font-black text-pls-purple/40 uppercase mb-2 tracking-[2px] ml-2'>Cipher.Stream</p>
                                        <input
                                            type='password' placeholder='********'
                                            value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                                            className='input-tech text-center tracking-[8px] text-lg h-16 border-white/5'
                                        />
                                    </div>
                                    {errorMessage && <p className='text-[10px] text-center text-red-500 font-bold uppercase tracking-[2px]'>{errorMessage}</p>}
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className='btn-premium w-full py-7 text-[15px]'
                                >
                                    {isLoading ? 'DECRYPTING...' : 'CONFIRM IDENTITY'}
                                </button>

                                <button type="button" onClick={() => setView('login')} className='w-full text-[9px] font-black uppercase tracking-[4px] text-white/20 hover:text-white transition-colors mt-4'>Abort Connection</button>
                            </form>
                        </div>
                    </motion.div>
                ) : view === 'admin' ? (
                    <motion.div
                        key='admin' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='relative z-10 w-full h-screen p-6 pb-20 flex flex-col gap-6 max-w-lg mx-auto overflow-y-auto'
                    >
                        <div className='flex justify-between items-center bg-[#05040a]/80 backdrop-blur-3xl sticky top-0 z-50 py-6 border-b border-white/5'>
                            <div className='flex items-center gap-4'>
                                <div className='w-10 h-10 border border-pls-cyan/20 flex items-center justify-center'>
                                    <BarChart3 size={18} className='text-pls-cyan' />
                                </div>
                                <h1 className='syncopate text-sm font-black tracking-tighter text-white uppercase'>ADMIN DASHBOARD</h1>
                            </div>
                            <button onClick={() => setView('login')} className='px-5 py-2.5 industrial-card text-[10px] uppercase font-black tracking-[2px] text-[#ff3c41] border-[#ff3c41]/20'>
                                EXIT.SYS
                            </button>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='industrial-card p-6 border-white/5'>
                                <Users size={20} className='text-pls-cyan mb-3' />
                                <h4 className='syncopate text-[22px] font-black'>14 / 20</h4>
                                <p className='text-[9px] uppercase font-bold text-slate-500 tracking-[2px]'>ACTIVE_NODES</p>
                            </div>
                            <div className='industrial-card p-6 border-white/5'>
                                <Monitor size={20} className='text-pls-purple mb-3' />
                                <h4 className='syncopate text-[22px] font-black'>82%</h4>
                                <p className='text-[9px] uppercase font-bold text-slate-500 tracking-[2px]'>SYSTEM_LOAD</p>
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <h3 className='text-[10px] font-black uppercase tracking-[4px] text-pls-cyan opacity-40 pl-1'>CONTROL INTERFACE</h3>
                            <div className='flex flex-col gap-3'>
                                {[
                                    { name: 'BALANS NAZORATI', icon: CreditCard, color: 'text-emerald-400', desc: 'Manage user wallets' },
                                    { name: 'ARENA MONITOR', icon: Activity, color: 'text-pls-cyan', desc: 'Real-time PC status' },
                                    { name: 'DATA REPORTS', icon: Database, color: 'text-pls-purple', desc: 'Profit analytics' }
                                ].map((item, i) => (
                                    <button key={i} className='industrial-card w-full flex items-center justify-between p-6 hover:bg-white/[0.03] transition-colors'>
                                        <div className='flex items-center gap-5'>
                                            <div className='w-12 h-12 border border-white/5 flex items-center justify-center bg-white/[0.02]'>
                                                <item.icon size={20} className={item.color} />
                                            </div>
                                            <div className='text-left'>
                                                <p className='syncopate text-[12px] font-black'>{item.name}</p>
                                                <p className='text-[9px] text-slate-600 uppercase font-bold tracking-[1px]'>{item.desc}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className='text-slate-700' />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col gap-4'>
                            <h3 className='text-[10px] font-black uppercase tracking-[4px] text-pls-purple opacity-40 pl-1'>LOG_STREAM</h3>
                            <div className='industrial-card p-6 space-y-6'>
                                {[
                                    { user: 'SHOX_PRO', action: 'START_SESSION - NODE_04', time: '2M', color: 'text-pls-cyan' },
                                    { user: 'ADMIN_BEK', action: 'WALLET_TOPUP - $15.00', time: '12M', color: 'text-emerald-400' },
                                    { user: 'DARK_RIDER', action: 'TERMINATE_SYS - NODE_12', time: '24M', color: 'text-red-500' }
                                ].map((item, i) => (
                                    <div key={i} className='flex justify-between items-start border-b border-white/[0.05] pb-4 last:border-0 last:pb-0'>
                                        <div>
                                            <p className='text-[11px] font-bold tracking-[1px]'>{item.user}</p>
                                            <p className={`text-[9px] ${item.color} font-black mt-1`}>{item.action}</p>
                                        </div>
                                        <span className='text-[9px] text-slate-600 font-bold'>{item.time}_AGO</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='player' initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className='relative z-10 w-full h-screen p-8 flex flex-col items-center justify-center gap-12 max-w-lg mx-auto'
                    >
                        <div className='w-32 h-32 border-2 border-pls-cyan/30 flex items-center justify-center relative scale-110'>
                            <div className='absolute -inset-4 border border-pls-cyan/10 animate-spin-slow'></div>
                            <ShieldCheck size={48} className='text-pls-cyan drop-shadow-[0_0_15px_rgba(0,242,255,1)]' />
                        </div>
                        <div className='text-center space-y-4'>
                            <h2 className='syncopate text-3xl font-black tracking-[-1px]'>SESSION_LIVE</h2>
                            <p className='text-slate-500 text-[10px] font-bold uppercase tracking-[4px]'>Authorization Successful</p>
                        </div>
                        <div className='industrial-card p-8 w-full text-center space-y-4'>
                            <p className='text-[9px] text-slate-600 uppercase tracking-[3px] font-black'>OPERATOR_ID</p>
                            <p className='syncopate text-pls-cyan text-xl font-black animate-pulse'>{username.toUpperCase()}</p>
                        </div>
                        <button onClick={() => setView('login')} className='text-[10px] font-black uppercase tracking-[6px] text-slate-600 hover:text-white transition-colors'>LEAVE ARENA</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
