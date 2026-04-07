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
            window.Telegram.WebApp.enableClosingConfirmation();
        }
    }, []);

    const startHold = () => {
        let progress = 0;
        holdTimer.current = setInterval(() => {
            progress += 1;
            setHoldProgress(progress);
            if (progress % 5 === 0 && window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
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
                setErrorMessage('AUTH_REQUIRED: INVALID_INPUT');
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
                setErrorMessage('LEVEL_10_PROTO: ACCESS_DENIED');
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
                }
            }
            setIsLoading(false);
        }, 1800);
    };

    return (
        <div className='min-h-screen relative bg-[#010105] text-white font-outfit overflow-hidden selection:bg-pls-cyan/30'>
            {/* System Background Architecture */}
            <div className='fixed inset-0 z-0 overflow-hidden pointer-events-none'>
                <img src='/club-v2.png' className='w-full h-full object-cover opacity-10 grayscale blur-sm scale-110' alt='Architecture' />
                <div className='absolute inset-0 bg-gradient-to-t from-[#010105] via-[#010105]/60 to-transparent'></div>
            </div>

            <div className='grid-overlay'></div>
            <div className='scanline'></div>

            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div
                        key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        className='relative z-10 w-full h-screen flex flex-col justify-between p-10 max-w-lg mx-auto'
                    >
                        {/* System Header */}
                        <div className='flex justify-between items-start'>
                            <div className='flex items-center gap-5'>
                                <div className='w-14 h-14 industrial-card flex items-center justify-center border-white/5'>
                                    <Gamepad2 size={28} className='text-pls-cyan drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='syncopate text-2xl font-black tracking-[6px] text-white leading-none glitch-text'>PLS</span>
                                    <span className='text-[8px] text-pls-cyan font-black uppercase tracking-[4px] mt-1.5 opacity-60'>OPERATIONS CENTER</span>
                                </div>
                            </div>

                            <motion.div
                                onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}
                                className='industrial-card px-4 py-3 flex items-center gap-3 cursor-pointer active:scale-95 transition-all'
                            >
                                <div className='flex flex-col items-end'>
                                    <div className='flex items-center gap-2'>
                                        <div className={`status-dot ${holdProgress > 0 ? 'text-pls-cyan' : 'text-emerald-500'}`}></div>
                                        <span className='text-[8px] font-black uppercase tracking-[2px] text-white/50'>CORE_LINK</span>
                                    </div>
                                    {holdProgress > 0 && (
                                        <div className='w-full h-[1px] bg-white/10 mt-1 relative overflow-hidden'>
                                            <div className='absolute inset-y-0 left-0 bg-pls-cyan' style={{ width: `${(holdProgress / 30) * 100}%` }}></div>
                                        </div>
                                    )}
                                </div>
                                <ShieldCheck size={16} className={holdProgress > 0 ? 'text-pls-cyan animate-pulse' : 'text-emerald-400'} />
                            </motion.div>
                        </div>

                        {/* Central Branding */}
                        <div className='flex flex-col items-center gap-12'>
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='text-center'>
                                <h2 className='text-[90px] font-black italic syncopate tracking-[-8px] leading-none uppercase glitch-text'>
                                    ARENA
                                </h2>
                                <div className='flex items-center justify-center gap-4 mt-2'>
                                    <div className='h-[1px] w-8 bg-pls-cyan/20'></div>
                                    <p className='text-pls-cyan/40 text-[8px] tracking-[6px] uppercase font-black'>SIGNAL_ESTABLISHED_2026</p>
                                    <div className='h-[1px] w-8 bg-pls-cyan/20'></div>
                                </div>
                            </motion.div>

                            {/* Main Input Interface */}
                            <form onSubmit={handleLogin} className='industrial-card p-10 w-full flex flex-col gap-8'>
                                <div className='space-y-6'>
                                    <div className='relative group'>
                                        <div className='absolute -left-1 -top-1 w-3 h-3 border-t-2 border-l-2 border-pls-cyan/30 opacity-0 group-focus-within:opacity-100 transition-all'></div>
                                        <input
                                            type='text' placeholder='NODE_IDENTIFIER'
                                            value={username} onChange={(e) => setUsername(e.target.value)}
                                            className='input-tech'
                                        />
                                    </div>

                                    <div className='relative group'>
                                        <div className='absolute -left-1 -top-1 w-3 h-3 border-t-2 border-l-2 border-pls-purple/30 opacity-0 group-focus-within:opacity-100 transition-all'></div>
                                        <input
                                            type='password' placeholder='CIPHER_KEY'
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            className='input-tech'
                                        />
                                    </div>
                                    {errorMessage && (
                                        <p className='text-[10px] text-red-500 font-bold uppercase tracking-[4px] text-center animate-pulse'>{errorMessage}</p>
                                    )}
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className='btn-premium w-full py-6 text-base shadow-[0_0_50px_rgba(0,242,255,0.15)]'
                                >
                                    {isLoading ? 'SYNCING...' : 'INITIATE_SESSION'}
                                </button>
                            </form>
                        </div>

                        {/* Diagnostic Footer */}
                        <div className='flex justify-between items-center opacity-40 pt-8 border-t border-white/5'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-[7px] font-black uppercase tracking-[3px]'>X-FRAME_OS: v9.42</span>
                                <span className='text-[7px] font-black uppercase tracking-[3px]'>LATENCY: 12MS</span>
                            </div>
                            <div className='flex flex-col items-end gap-1'>
                                <span className='text-[7px] font-black uppercase tracking-[3px] font-mono'>192.168.1.104</span>
                                <span className='text-[7px] font-black uppercase tracking-[3px]'>© 2024 PLS_CORP</span>
                            </div>
                        </div>
                    </motion.div>
                ) : view === 'admin-login' ? (
                    <motion.div
                        key='admin-login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                        className='relative z-20 w-full h-screen flex flex-col items-center justify-center p-10 max-w-lg mx-auto bg-black'
                    >
                        <div className='industrial-card p-12 w-full flex flex-col items-center gap-10 border-t-2 border-pls-cyan'>
                            <div className='flex flex-col items-center gap-4 text-center'>
                                <div className='w-24 h-24 industrial-card flex items-center justify-center mb-4'>
                                    <div className='absolute inset-0 bg-pls-cyan/10 animate-pulse'></div>
                                    <Fingerprint size={48} className='text-pls-cyan' />
                                </div>
                                <h3 className='syncopate text-[14px] font-black tracking-[8px] text-pls-cyan glitch-text'>RESERVED_NODE</h3>
                                <p className='text-[8px] font-black text-white/30 tracking-[4px] uppercase'>Administrator Identity Required</p>
                            </div>

                            <form onSubmit={handleAdminVerify} className='w-full space-y-8'>
                                <div className='space-y-6'>
                                    <input
                                        type='text' placeholder='UID_HASH'
                                        value={adminUser} onChange={(e) => setAdminUser(e.target.value)}
                                        className='input-tech text-center tracking-[12px] text-xl h-20 uppercase border-white/10'
                                    />
                                    <input
                                        type='password' placeholder='••••••••'
                                        value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                                        className='input-tech text-center tracking-[12px] text-xl h-20 border-white/10'
                                    />
                                    {errorMessage && <p className='text-[9px] text-center text-red-500 font-bold uppercase tracking-[2px]'>{errorMessage}</p>}
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className='btn-premium w-full py-8 text-lg'
                                >
                                    {isLoading ? 'DECRYPTING...' : 'BYPASS_SECURITY'}
                                </button>

                                <button type="button" onClick={() => setView('login')} className='w-full text-[9px] font-black uppercase tracking-[6px] text-white/20 hover:text-white transition-colors'>BACK_TO_SAFETY</button>
                            </form>
                        </div>
                    </motion.div>
                ) : view === 'admin' ? (
                    <motion.div
                        key='admin' initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }}
                        className='relative z-10 w-full h-screen p-8 pb-20 flex flex-col gap-8 max-w-lg mx-auto overflow-y-auto'
                    >
                        {/* Admin HUD Header */}
                        <div className='flex justify-between items-center bg-[#010105]/95 backdrop-blur-3xl sticky top-0 z-50 py-8 border-b border-white/10'>
                            <div className='flex items-center gap-5'>
                                <div className='w-12 h-12 border border-pls-cyan/20 flex items-center justify-center'>
                                    <Terminal size={22} className='text-pls-cyan' />
                                </div>
                                <div className='flex flex-col'>
                                    <h1 className='syncopate text-base font-black tracking-[2px] text-white'>SYS_MANAGER</h1>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <div className='status-dot text-emerald-500'></div>
                                        <span className='text-[8px] font-black text-emerald-500 tracking-[3px] uppercase'>SYSTEM_LIVE</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setView('login')} className='px-6 py-3 industrial-card text-[9px] uppercase font-black tracking-[3px] text-red-500 border-red-500/20'>
                                SHUTDOWN
                            </button>
                        </div>

                        {/* Telemetry Grid */}
                        <div className='grid grid-cols-2 gap-5'>
                            <div className='industrial-card p-6 border-white/5 group active:scale-95 cursor-pointer'>
                                <div className='flex justify-between items-start mb-4'>
                                    <Users size={22} className='text-pls-cyan opacity-80' />
                                    <span className='text-[8px] font-black text-pls-cyan'>NODE_POOL</span>
                                </div>
                                <h4 className='syncopate text-3xl font-black'>14 <span className='text-xs text-white/20 font-light italic'>/ 24</span></h4>
                                <p className='text-[9px] uppercase font-bold text-white/30 tracking-[3px] mt-2'>ACTIVE_USERS</p>
                            </div>
                            <div className='industrial-card p-6 border-white/5 active:scale-95 cursor-pointer'>
                                <div className='flex justify-between items-start mb-4'>
                                    <Activity size={22} className='text-pls-purple opacity-80' />
                                    <span className='text-[8px] font-black text-pls-purple'>LOAD_FACT</span>
                                </div>
                                <h4 className='syncopate text-3xl font-black'>78%</h4>
                                <p className='text-[9px] uppercase font-bold text-white/30 tracking-[3px] mt-2'>CPU_STRESS</p>
                            </div>
                        </div>

                        {/* Interface Controls */}
                        <div className='flex flex-col gap-5'>
                            <h3 className='text-[10px] font-black uppercase tracking-[6px] text-pls-cyan ml-2 border-l-2 border-pls-cyan pl-3'>COMMAND_DECK</h3>
                            <div className='flex flex-col gap-4'>
                                {[
                                    { name: 'CREDIT_MANAGER', icon: CreditCard, color: 'text-emerald-400', desc: 'Financial Node Control' },
                                    { name: 'NETWORK_SCANNER', icon: Zap, color: 'text-pls-cyan', desc: 'Hardware Link Status' },
                                    { name: 'LOGFILE_VIEWER', icon: FileText, color: 'text-pls-purple', desc: 'Event Record Stream' }
                                ].map((item, i) => (
                                    <button key={i} className='industrial-card w-full flex items-center justify-between p-6 hover:bg-white/[0.04] transition-all group'>
                                        <div className='flex items-center gap-6'>
                                            <div className='w-14 h-14 border border-white/5 flex items-center justify-center bg-white/[0.02] industrial-card'>
                                                <item.icon size={22} className={`${item.color} group-hover:scale-110 transition-transform`} />
                                            </div>
                                            <div className='text-left'>
                                                <p className='syncopate text-sm font-black group-hover:text-pls-cyan transition-colors'>{item.name}</p>
                                                <p className='text-[9px] text-white/30 uppercase font-black tracking-[1px] mt-1'>{item.desc}</p>
                                            </div>
                                        </div>
                                        <ArrowRight size={20} className='text-white/10 group-hover:text-pls-cyan group-hover:translate-x-1 transition-all' />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Raw Activity Stream */}
                        <div className='flex flex-col gap-5'>
                            <h3 className='text-[10px] font-black uppercase tracking-[6px] text-pls-purple ml-2 border-l-2 border-pls-purple pl-3'>LIVE_KERNEL_LOG</h3>
                            <div className='industrial-card p-8 space-y-8 font-mono'>
                                {[
                                    { user: 'ROOT_MGR', action: 'DEPLOY_PATCH_v9.2', status: 'OK', time: '14:02:11' },
                                    { user: 'USER_882', action: 'INIT_WALLET_SYNC', status: 'PEND', time: '14:01:45' },
                                    { user: 'NODEX_14', action: 'HW_OVERHEAT_WARN', status: 'CRIT', time: '13:59:02' }
                                ].map((item, i) => (
                                    <div key={i} className='flex justify-between items-center text-[10px] border-b border-white/5 pb-6 last:border-0 last:pb-0'>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex items-center gap-3'>
                                                <span className='text-pls-cyan font-black'>[{item.time}]</span>
                                                <span className='text-white/40'>USR:</span>
                                                <span className='font-bold'>{item.user}</span>
                                            </div>
                                            <p className='text-white/70 font-black tracking-tight'>{item.action}</p>
                                        </div>
                                        <div className={`px-3 py-1 text-[8px] font-black border ${item.status === 'CRIT' ? 'border-red-500/40 text-red-500 bg-red-500/5' : item.status === 'PEND' ? 'border-amber-500/40 text-amber-500' : 'border-emerald-500/40 text-emerald-500'}`}>
                                            {item.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='player' initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className='relative z-10 w-full h-screen p-12 flex flex-col items-center justify-center gap-12 max-w-lg mx-auto text-center'
                    >
                        <div className='w-40 h-40 industrial-card flex items-center justify-center scale-110 mb-8 border-pls-cyan/40'>
                            <div className='absolute inset-0 bg-pls-cyan/5 animate-pulse'></div>
                            <div className='absolute -inset-6 border border-pls-cyan/10 rotate-45 animate-spin-slow'></div>
                            <Cpu size={64} className='text-pls-cyan drop-shadow-[0_0_20px_rgba(0,242,255,0.6)]' />
                        </div>
                        <div className='space-y-4'>
                            <h2 className='syncopate text-4xl font-black tracking-[-2px] uppercase glitch-text'>ACCESS_GRANTED</h2>
                            <p className='text-emerald-500/70 text-[10px] font-black uppercase tracking-[8px]'>Session Integrity: 100%</p>
                        </div>
                        <div className='industrial-card p-10 w-full bg-white/[0.02] border-white/5'>
                            <p className='text-[8px] text-white/30 uppercase tracking-[4px] font-black mb-4'>ACTIVE_OPERATOR_TOKEN</p>
                            <p className='syncopate text-pls-cyan text-2xl font-black tracking-[2px]'>{username.toUpperCase()}</p>
                        </div>
                        <button onClick={() => setView('login')} className='text-[10px] font-black uppercase tracking-[8px] text-white/20 hover:text-white transition-all hover:tracking-[12px]'>TERMINATE_SYSCALL</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


export default App;
