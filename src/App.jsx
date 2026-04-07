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
    const [adminTab, setAdminTab] = useState('dashboard');
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
                        className='relative z-10 w-full h-screen flex flex-col bg-[#030308] max-w-lg mx-auto overflow-hidden'
                    >
                        {/* Tab Control HUD */}
                        <div className='flex justify-between items-center p-6 bg-black/40 backdrop-blur-2xl border-b border-white/5'>
                            <div className='flex gap-3'>
                                {['dashboard', 'users', 'logs'].map(tab => (
                                    <button
                                        key={tab} onClick={() => setAdminTab(tab)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[2px] transition-all ${adminTab === tab ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'bg-white/5 text-white/40'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setView('login')} className='w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20'>
                                <LogOut size={18} />
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-6 space-y-8 pb-32'>
                            <AnimatePresence mode='wait'>
                                {adminTab === 'dashboard' ? (
                                    <motion.div key='dash' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className='space-y-8'>
                                        {/* 💎 PREMIUM STATS GRID */}
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='premium-glass p-8 bg-gradient-to-br from-[#39ff14]/5 to-transparent border-[#39ff14]/20 relative overflow-hidden h-44 flex flex-col justify-between'>
                                                <div className='flex justify-between items-start'>
                                                    <span className='text-[9px] text-[#39ff14] font-bold tracking-[3px] uppercase'>ACTIVE_USERS</span>
                                                    <div className='w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_10px_#39ff14] animate-pulse'></div>
                                                </div>
                                                <h1 className='text-6xl font-black italic tracking-tighter'>14</h1>
                                                <div className='text-[8px] text-white/20 font-bold tracking-[2px] uppercase'>ONLINE NODE SYSTEM 🟢</div>
                                            </div>
                                            <div className='grid gap-4'>
                                                <div className='premium-glass p-5 flex flex-col justify-center'>
                                                    <p className='text-[8px] text-white/40 font-bold uppercase tracking-[2px] mb-1'>SESSIONS 🕵️‍♂️</p>
                                                    <h3 className='text-2xl font-bold text-[#39ff14]'>282</h3>
                                                </div>
                                                <div className='premium-glass p-5 flex flex-col justify-center'>
                                                    <p className='text-[8px] text-white/40 font-bold uppercase tracking-[2px] mb-1'>REVENUE 💰</p>
                                                    <h3 className='text-2xl font-bold'>1.4M</h3>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🚀 BROADCAST PANEL */}
                                        <div className='premium-glass p-6 border-[#39ff14]/10 bg-[#39ff14]/[0.02]'>
                                            <div className='flex items-center gap-3 mb-4'>
                                                <div className='w-2 h-2 rounded-full bg-[#39ff14]'></div>
                                                <span className='text-[11px] font-bold tracking-[2px] uppercase'>BROADCASTER 🔉</span>
                                            </div>
                                            <textarea
                                                className='w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-white placeholder:text-white/20 min-h-[100px] outline-none focus:border-[#39ff14]/30'
                                                placeholder='Barcha foydalanuvchilarga xabar yuborish... ✍️'
                                            />
                                            <button className='w-full mt-4 bg-[#39ff14] text-black font-black py-5 rounded-2xl text-[12px] tracking-[2px] hover:brightness-110 active:scale-[0.98] transition-all'>
                                                HAMMAGA TARQATISH 🔥
                                            </button>
                                        </div>

                                        {/* 🛠️ SERVER HEALTH STATUS */}
                                        <div className='flex justify-between items-center p-6 bg-white/[0.02] rounded-3xl border border-white/5'>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>OS: <span className='text-[#39ff14]'>STABLE 🟢</span></div>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>LOAD: <span className='text-[#39ff14]'>LOW 🟢</span></div>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>SYNC: <span className='text-[#39ff14]'>LIVE ⚡</span></div>
                                        </div>
                                    </motion.div>
                                ) : adminTab === 'users' ? (
                                    <motion.div key='users' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className='space-y-6'>
                                        <div className='flex gap-3'>
                                            <input placeholder="ID bo'yicha qidirish..." className='input-luxury flex-1 py-4 px-6' />
                                            <button className='bg-[#39ff14] text-black px-6 rounded-2xl font-bold'>+</button>
                                        </div>
                                        <div className='space-y-3'>
                                            {[
                                                { name: 'shox_pro', balance: '12,500', status: 'active', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=1' },
                                                { name: 'bek_admin', balance: '45,000', status: 'active', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=2' },
                                                { name: 'dark_rider', balance: '0', status: 'blocked', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=3' }
                                            ].map((user, i) => (
                                                <div key={i} className='premium-glass p-5 flex items-center justify-between border-white/5'>
                                                    <div className='flex items-center gap-4'>
                                                        <img src={user.avatar} className='w-12 h-12 rounded-2xl bg-white/5 border border-white/10' alt='' />
                                                        <div>
                                                            <p className={`font-bold ${user.status === 'blocked' ? 'opacity-30' : ''}`}>{user.name}</p>
                                                            <p className='text-[10px] text-[#39ff14] font-bold tracking-[1px]'>{user.balance} UZS</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex gap-4'>
                                                        <button className='text-white/20 hover:text-white'>✎</button>
                                                        <button className={`${user.status === 'blocked' ? 'text-red-500' : 'text-[#39ff14]'}`}>{user.status === 'blocked' ? '🔒' : '🔓'}</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key='logs' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className='space-y-6'>
                                        <div className='premium-glass bg-black/60 p-6 space-y-6 border-white/5'>
                                            <h4 className='text-[10px] font-bold opacity-30 uppercase tracking-[4px]'>TIZIM FAOLLIYATI (LIVE) ⚡</h4>
                                            <div className='space-y-6'>
                                                {[
                                                    { name: 'shox_pro', action: 'Sessiya boshlandi', time: '14:20', status: 'active' },
                                                    { name: 'bek_admin', action: 'Karta to\'ldirildi', time: '14:15', status: 'active' },
                                                    { name: 'nodex_04', action: 'Sessiya yakunlandi', time: '14:02', status: 'error' }
                                                ].map((h, i) => (
                                                    <div key={i} className={`flex justify-between items-center p-5 bg-white/[0.02] rounded-2xl border-l-[3px] ${h.status === 'active' ? 'border-[#39ff14]' : 'border-red-500'}`}>
                                                        <div>
                                                            <div className='text-[13px] font-bold'>{h.name}</div>
                                                            <div className='text-[9px] opacity-40 uppercase tracking-[1px] mt-1'>{h.action}</div>
                                                        </div>
                                                        <div className='text-[10px] font-bold opacity-30'>{h.time}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
