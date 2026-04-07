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
            window.Telegram.WebApp.headerColor = '#030308';
        }
    }, []);

    const startHold = () => {
        let progress = 0;
        holdTimer.current = setInterval(() => {
            progress += 1;
            setHoldProgress(progress);
            if (progress % 4 === 0 && window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
            }
            if (progress >= 30) {
                clearInterval(holdTimer.current);
                setHoldProgress(0);
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
                setView('admin-login');
            }
        }, 80);
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
            if (username === '4567' && password === '4567') {
                setView('admin');
            } else if (username && password) {
                setView('player');
            } else {
                setErrorMessage('Iltimos, barcha maydonlarni to\'ldiring');
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleAdminVerify = (e) => {
        e?.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setTimeout(() => {
            const isMaster = (adminUser === '4567' && adminPass === '4567');
            const isAdmin = (adminUser.toLowerCase() === 'admin' && adminPass === 'admin777');

            if (isMaster || isAdmin) {
                setView('admin');
            } else {
                setErrorMessage('Xavfsizlik kaliti noto\'g\'ri');
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
                }
            }
            setIsLoading(false);
        }, 1800);
    };

    return (
        <div className='min-h-screen relative bg-[#030308] text-white font-outfit overflow-hidden selection:bg-white/10'>
            {/* Elegant Background Mesh */}
            <div className='mesh-bg'></div>

            {/* Floating Glow Orbs */}
            <div className='absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-pls-cyan/10 blur-[120px] rounded-full animate-pulse'></div>
            <div className='absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-pls-purple/10 blur-[100px] rounded-full animate-pulse' style={{ animationDelay: '2s' }}></div>

            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div
                        key='login' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className='relative z-10 w-full h-screen flex flex-col justify-between p-8 pt-12 pb-16 max-w-lg mx-auto'
                    >
                        {/* Elegant Header */}
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 flex items-center justify-center relative'>
                                    <div className='absolute inset-0 bg-white/5 rounded-[14px] rotate-6'></div>
                                    <div className='absolute inset-0 bg-white/10 rounded-[14px] backdrop-blur-md'></div>
                                    <Gamepad2 size={24} className='relative z-10 text-white' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='syncopate text-lg font-bold tracking-[3px] leading-tight'>PLS CLUB</span>
                                    <span className='text-[10px] text-white/40 font-medium uppercase tracking-[2px]'>Premium Experience</span>
                                </div>
                            </div>

                            <motion.div
                                onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}
                                className='w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative cursor-pointer active:scale-90 transition-transform group'
                            >
                                {holdProgress > 0 && (
                                    <svg className='absolute inset-0 w-full h-full -rotate-90'>
                                        <circle
                                            cx='24' cy='24' r='22'
                                            fill='none' stroke='white' strokeWidth='2'
                                            strokeDasharray='138.2'
                                            strokeDashoffset={138.2 - (holdProgress / 30) * 138.2}
                                            className='transition-all duration-100'
                                        />
                                    </svg>
                                )}
                                <ShieldCheck size={18} className='text-white/40 group-hover:text-white transition-colors' />
                            </motion.div>
                        </div>

                        {/* Minimal Main Title */}
                        <div className='flex flex-col items-center gap-10 w-full'>
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='text-center'>
                                <h1 className='text-6xl font-black italic syncopate luxury-gradient-text tracking-[-4px] leading-none mb-4'>
                                    ARENA
                                </h1>
                                <p className='text-white/30 text-[10px] font-semibold tracking-[4px] uppercase'>Welcome to Executive Gaming</p>
                            </motion.div>

                            {/* Clean Form Container */}
                            <form onSubmit={handleLogin} className='premium-glass p-8 w-full flex flex-col gap-6'>
                                <div className='space-y-4'>
                                    <input
                                        type='text' placeholder='Login'
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                        className='input-luxury'
                                    />
                                    <input
                                        type='password' placeholder='Parol'
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        className='input-luxury'
                                    />
                                    {errorMessage && (
                                        <p className='text-[11px] text-red-400 font-medium text-center'>{errorMessage}</p>
                                    )}
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className='btn-luxury w-full mt-2'
                                >
                                    {isLoading ? 'Yuklanmoqda...' : 'Kirish'}
                                </button>
                            </form>
                        </div>

                        {/* Minimal Footer */}
                        <div className='flex flex-col items-center gap-4 opacity-20'>
                            <div className='w-12 h-[1px] bg-white'></div>
                            <span className='text-[9px] font-bold tracking-[3px] uppercase'>Est. 2024</span>
                        </div>
                    </motion.div>
                ) : view === 'admin-login' ? (
                    <motion.div
                        key='admin-login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className='relative z-20 w-screen h-screen flex items-center justify-center p-8 bg-[#030308]'
                    >
                        <div className='max-w-sm w-full space-y-12'>
                            <div className='text-center space-y-4'>
                                <div className='w-20 h-20 bg-white/5 rounded-[28px] mx-auto flex items-center justify-center border border-white/10'>
                                    <Lock size={32} className='text-white' />
                                </div>
                                <h3 className='syncopate text-sm font-bold tracking-[4px]'>ADMINISTRATOR</h3>
                            </div>

                            <form onSubmit={handleAdminVerify} className='space-y-6'>
                                <div className='space-y-3'>
                                    <input
                                        type='text' placeholder='Login'
                                        value={adminUser} onChange={(e) => setAdminUser(e.target.value)}
                                        className='input-luxury text-center tracking-[4px]'
                                    />
                                    <input
                                        type='password' placeholder='••••'
                                        value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                                        className='input-luxury text-center tracking-[8px]'
                                    />
                                    {errorMessage && <p className='text-xs text-center text-red-400'>{errorMessage}</p>}
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className='btn-luxury w-full py-6'
                                >
                                    {isLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
                                </button>

                                <button type="button" onClick={() => setView('login')} className='w-full text-[10px] uppercase font-bold tracking-[2px] opacity-20 hover:opacity-100 transition-opacity'>Bekor qilish</button>
                            </form>
                        </div>
                    </motion.div>
                ) : view === 'admin' ? (
                    <motion.div
                        key='admin' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='relative z-10 w-full h-screen p-8 pb-32 flex flex-col gap-8 max-w-lg mx-auto overflow-y-auto'
                    >
                        {/* Header */}
                        <div className='flex justify-between items-center py-4 bg-[#030308]/80 backdrop-blur-xl sticky top-0 z-50'>
                            <div className='flex items-center gap-4'>
                                <div className='w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10'>
                                    <BarChart3 size={20} />
                                </div>
                                <h1 className='syncopate text-sm font-bold tracking-[2px]'>PANEL</h1>
                            </div>
                            <button onClick={() => setView('login')} className='w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20'>
                                <LogOut size={18} />
                            </button>
                        </div>

                        {/* Stats Large */}
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='premium-glass p-6'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]'></div>
                                    <span className='text-[10px] font-bold uppercase tracking-[1px] opacity-40'>Active</span>
                                </div>
                                <div className='flex items-baseline gap-1'>
                                    <span className='text-4xl font-bold'>14</span>
                                    <span className='text-sm opacity-20'>/24</span>
                                </div>
                                <p className='text-[11px] font-medium opacity-40 mt-1'>Mijozlar soni</p>
                            </div>
                            <div className='premium-glass p-6'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <div className='w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,1)]'></div>
                                    <span className='text-[10px] font-bold uppercase tracking-[1px] opacity-40'>Resource</span>
                                </div>
                                <div className='flex items-baseline gap-1'>
                                    <span className='text-4xl font-bold'>82</span>
                                    <span className='text-sm opacity-20'>%</span>
                                </div>
                                <p className='text-[11px] font-medium opacity-40 mt-1'>Tizim yuklamasi</p>
                            </div>
                        </div>

                        {/* Main Actions */}
                        <div className='space-y-4'>
                            <h3 className='text-[11px] font-bold uppercase tracking-[2px] opacity-30 px-2'>Boshqaruv elementlari</h3>
                            <div className='space-y-3'>
                                {[
                                    { name: 'Kassa nazorati', icon: CreditCard, color: 'text-emerald-400' },
                                    { name: 'Xonalar Monitoringi', icon: Monitor, color: 'text-cyan-400' },
                                    { name: 'Moliyaviy Hisobotlar', icon: Database, color: 'text-purple-400' }
                                ].map((item, i) => (
                                    <button key={i} className='premium-glass w-full flex items-center justify-between p-6 hover:bg-white/[0.05] transition-colors'>
                                        <div className='flex items-center gap-5'>
                                            <div className='w-12 h-12 rounded-[20px] bg-white/5 flex items-center justify-center'>
                                                <item.icon size={22} className={item.color} />
                                            </div>
                                            <span className='text-[15px] font-semibold'>{item.name}</span>
                                        </div>
                                        <ChevronRight size={20} className='opacity-20' />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modern activity list */}
                        <div className='space-y-4'>
                            <h3 className='text-[11px] font-bold uppercase tracking-[2px] opacity-30 px-2'>So'nggi harakatlar</h3>
                            <div className='premium-glass p-6 space-y-6'>
                                {[
                                    { user: 'shox_pro', action: '6000 so\'m yechildi', time: 'hozir', status: 'success' },
                                    { user: 'admin', action: 'Yangi PC qo\'shildi', time: '12 daq', status: 'neutral' },
                                    { user: 'pc_14', action: 'Xatolik yuz berdi', time: '24 daq', status: 'error' }
                                ].map((item, i) => (
                                    <div key={i} className='flex items-center justify-between group'>
                                        <div className='flex items-center gap-4'>
                                            <div className={`w-1.5 h-10 rounded-full ${item.status === 'success' ? 'bg-emerald-500' : item.status === 'error' ? 'bg-red-500' : 'bg-white/10'}`}></div>
                                            <div className='flex flex-col'>
                                                <span className='text-[13px] font-semibold'>{item.user}</span>
                                                <span className='text-[11px] opacity-40'>{item.action}</span>
                                            </div>
                                        </div>
                                        <span className='text-[10px] font-bold opacity-30'>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='player' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className='relative z-10 w-full h-screen p-12 flex flex-col items-center justify-center gap-12 max-w-sm mx-auto'
                    >
                        <div className='w-40 h-40 flex items-center justify-center relative'>
                            <div className='absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full'></div>
                            <div className='w-full h-full rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center float shadow-2xl'>
                                <ShieldCheck size={72} className='text-emerald-400' />
                            </div>
                        </div>
                        <div className='text-center space-y-3'>
                            <h2 className='text-3xl font-bold luxury-gradient-text tracking-tight'>Hush kelibsiz!</h2>
                            <p className='text-white/40 text-sm font-medium'>Sessiya muvaffaqiyatli ochildi</p>
                        </div>
                        <div className='premium-glass p-8 w-full text-center'>
                            <p className='text-[10px] text-white/30 uppercase tracking-[3px] font-bold mb-4'>Sizning ID raqamingiz</p>
                            <p className='text-3xl font-black syncopate tracking-widest text-glow'>{username.slice(0, 4).toUpperCase()}</p>
                        </div>
                        <button onClick={() => setView('login')} className='text-[10px] font-bold uppercase tracking-[4px] opacity-20 hover:opacity-100 transition-all'>Chiqish</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
export default App;
