import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Gamepad2, ShieldCheck, Zap, Settings, BarChart3, Database, Users, Monitor, CreditCard, Activity, LogOut, ChevronRight, Trash2 } from 'lucide-react';

function App() {
    const [view, setView] = useState('login');
    const [holdProgress, setHoldProgress] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [adminTab, setAdminTab] = useState('asosiy');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Persistent State for Main Admin
    const [superAdmins, setSuperAdmins] = useState(() => {
        const saved = localStorage.getItem('pls_super_admins');
        return saved ? JSON.parse(saved) : [
            { name: 'Shoxrux Mirzo', phone: '+998 90 123 45 67', login: 'shox_pro', pass: '1111', club: 'PLS Kokand-1' },
            { name: 'Jasur Bek', phone: '+998 94 987 65 43', login: 'jasur_99', pass: '2222', club: 'PLS Fergana-2' }
        ];
    });

    const [clubAdmins, setClubAdmins] = useState(() => {
        const saved = localStorage.getItem('pls_club_admins');
        return saved ? JSON.parse(saved) : [
            { name: 'Otabek Admin', login: 'ota_admin', pass: '7777', club: 'PLS Kokand-1' }
        ];
    });

    const [clubs, setClubs] = useState(() => {
        const saved = localStorage.getItem('pls_clubs');
        return saved ? JSON.parse(saved) : [
            { name: 'PLS Kokand-1', rooms: 24, dailyRevenue: '850,000' },
            { name: 'PLS Fergana-2', rooms: 12, dailyRevenue: '420,000' },
            { name: 'PLS Tashkent-3', rooms: 32, dailyRevenue: '1,200,000' }
        ];
    });

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('pls_super_admins', JSON.stringify(superAdmins));
    }, [superAdmins]);

    useEffect(() => {
        localStorage.setItem('pls_club_admins', JSON.stringify(clubAdmins));
    }, [clubAdmins]);

    useEffect(() => {
        localStorage.setItem('pls_clubs', JSON.stringify(clubs));
    }, [clubs]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [newAdmin, setNewAdmin] = useState({ name: '', phone: '', login: '', pass: '', club: '' });
    const [superAdminTab, setSuperAdminTab] = useState('asosiy');

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
            const superAdmin = superAdmins.find(sa => sa.login === username && sa.pass === password);
            const clubAdmin = clubAdmins.find(ca => ca.login === username && ca.pass === password);

            if (username === '4567' && password === '4567') {
                setView('admin');
            } else if (superAdmin) {
                setView('super-admin');
            } else if (clubAdmin) {
                setView('club-admin-view');
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
            const superAdmin = superAdmins.find(sa => sa.login === adminUser && sa.pass === adminPass);

            if (isMaster || isAdmin) {
                setView('admin');
                setUsername(adminUser);
            } else if (superAdmin) {
                setView('super-admin');
                setUsername(adminUser);
            } else {
                setErrorMessage('Xavfsizlik kaliti noto\'g\'ri');
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
                }
            }
            setIsLoading(false);
        }, 1800);
    };

    const handleSaveSuperAdmin = () => {
        if (!newAdmin.name || !newAdmin.login || !newAdmin.pass) return;

        if (editIndex !== null) {
            const updated = [...superAdmins];
            updated[editIndex] = newAdmin;
            setSuperAdmins(updated);
        } else {
            setSuperAdmins([...superAdmins, newAdmin]);
        }

        // Reset
        setNewAdmin({ name: '', phone: '', login: '', pass: '', club: '' });
        setIsAddModalOpen(false);
        setEditIndex(null);
    };

    const handleDeleteSuperAdmin = (index) => {
        if (window.confirm('Haqiqatdan ham ushbu super adminni o\'chirmoqchimisiz?')) {
            setSuperAdmins(superAdmins.filter((_, i) => i !== index));
        }
    };

    const handleStartEdit = (admin, index) => {
        setNewAdmin(admin);
        setEditIndex(index);
        setIsAddModalOpen(true);
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
                                    <span className='text-[10px] text-white/40 font-medium uppercase tracking-[2px]'>Premium Tajriba</span>
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
                                <p className='text-white/30 text-[10px] font-semibold tracking-[4px] uppercase'>Premium o'yinlar olamiga xush kelibsiz</p>
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
                            <span className='text-[9px] font-bold tracking-[3px] uppercase'>Tuzilgan: 2024</span>
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
                                <h3 className='syncopate text-sm font-bold tracking-[4px] uppercase'>ADMINISTRATOR</h3>
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
                                    {isLoading ? 'Tasdiqlanmoqda...' : 'Kirish'}
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
                                {['asosiy', 'admins', 'jurnallar'].map(tab => (
                                    <button
                                        key={tab} onClick={() => setAdminTab(tab)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[2px] transition-all ${adminTab === tab ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'bg-white/5 text-white/40'}`}
                                    >
                                        {tab === 'asosiy' ? 'BOSHQUVAR' : tab === 'admins' ? 'SUPER ADMINLAR' : 'JURNALLAR'}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setView('login')} className='w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20'>
                                <LogOut size={18} />
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-6 space-y-8 pb-32'>
                            <AnimatePresence mode='wait'>
                                {adminTab === 'asosiy' ? (
                                    <motion.div key='dash' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className='space-y-8'>
                                        {/* 💎 PREMIUM STATS GRID */}
                                        <div className='grid grid-cols-2 gap-4'>
                                            <div className='premium-glass p-8 bg-gradient-to-br from-[#39ff14]/5 to-transparent border-[#39ff14]/20 relative overflow-hidden h-44 flex flex-col justify-between'>
                                                <div className='flex justify-between items-start'>
                                                    <span className='text-[9px] text-[#39ff14] font-bold tracking-[3px] uppercase'>JAMI_KLUBLAR</span>
                                                    <div className='w-2 h-2 rounded-full bg-[#39ff14] shadow-[0_0_10px_#39ff14] animate-pulse'></div>
                                                </div>
                                                <h1 className='text-6xl font-black italic tracking-tighter'>{clubs.length}</h1>
                                                <div className='text-[8px] text-white/20 font-bold tracking-[2px] uppercase'>AKTIV FILIALLAR 🟢</div>
                                            </div>
                                            <div className='grid gap-4'>
                                                <div className='premium-glass p-5 flex flex-col justify-center text-center'>
                                                    <p className='text-[8px] text-white/40 font-bold uppercase tracking-[2px] mb-1'>UMUMIY XONALAR 🔥</p>
                                                    <h3 className='text-2xl font-bold text-[#39ff14]'>{clubs.reduce((acc, c) => acc + c.rooms, 0)}</h3>
                                                </div>
                                                <div className='premium-glass p-5 flex flex-col justify-center text-center'>
                                                    <p className='text-[8px] text-white/40 font-bold uppercase tracking-[2px] mb-1'>KUNLIK DAROMAD 💰</p>
                                                    <h3 className='text-2xl font-bold italic tracking-tight'>2.4M</h3>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🚀 CLUB NODES LIST */}
                                        <div className='space-y-4'>
                                            <h3 className='text-[10px] font-bold uppercase tracking-[4px] text-white/30 px-2'>ULANGAN XONALAR HOLATI</h3>
                                            <div className='space-y-3'>
                                                {clubs.map((club, i) => (
                                                    <div key={i} className='premium-glass p-6 flex justify-between items-center border-white/5'>
                                                        <div className='flex items-center gap-4'>
                                                            <div className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10'>
                                                                <Monitor size={22} className='text-[#39ff14]' />
                                                            </div>
                                                            <div>
                                                                <p className='font-bold text-sm tracking-wide'>{club.name}</p>
                                                                <p className='text-[10px] text-white/30 uppercase tracking-[1px]'>{club.rooms} TA STANTSIYA</p>
                                                            </div>
                                                        </div>
                                                        <div className='text-right'>
                                                            <p className='text-[12px] font-bold text-[#39ff14]'>{club.dailyRevenue} SO'M</p>
                                                            <p className='text-[8px] text-white/20 uppercase tracking-[1px]'>BUGUN</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 🚀 BROADCAST PANEL */}
                                        <div className='premium-glass p-6 border-[#39ff14]/10 bg-[#39ff14]/[0.02]'>
                                            <div className='flex items-center gap-3 mb-4'>
                                                <div className='w-2 h-2 rounded-full bg-[#39ff14]'></div>
                                                <span className='text-[11px] font-bold tracking-[2px] uppercase'>SUPER ADMINLARGA XABAR YUBORISH 🔉</span>
                                            </div>
                                            <textarea
                                                className='w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-white placeholder:text-white/20 min-h-[100px] outline-none focus:border-[#39ff14]/30 transition-all'
                                                placeholder='Barcha super adminlarga xabar yuborish... ✍️'
                                            />
                                            <button className='w-full mt-4 bg-[#39ff14] text-black font-black py-5 rounded-2xl text-[12px] tracking-[2px] hover:brightness-110 active:scale-[0.98] transition-all'>
                                                HAMMAGA TARQATISH 🔥
                                            </button>
                                        </div>

                                        {/* 🛠️ SERVER HEALTH STATUS */}
                                        <div className='flex justify-between items-center p-6 bg-white/[0.02] rounded-3xl border border-white/5'>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>TIZIM: <span className='text-[#39ff14]'>BARQAROR 🟢</span></div>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>YUKLAMA: <span className='text-[#39ff14]'>PAST 🟢</span></div>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>SINXRON: <span className='text-[#39ff14]'>JONLI ⚡</span></div>
                                        </div>
                                    </motion.div>
                                ) : adminTab === 'admins' ? (
                                    <motion.div key='admins' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className='space-y-6'>
                                        <button
                                            onClick={() => {
                                                setEditIndex(null);
                                                setNewAdmin({ name: '', phone: '', login: '', pass: '', club: '' });
                                                setIsAddModalOpen(!isAddModalOpen);
                                            }}
                                            className='w-full bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] py-5 rounded-2xl font-black text-[11px] tracking-[3px] uppercase hover:bg-[#39ff14]/20 transition-all'
                                        >
                                            {isAddModalOpen ? 'YOPISH' : "+ YANGI SUPER ADMIN QO'SHISH"}
                                        </button>

                                        {isAddModalOpen && (
                                            <div className='premium-glass p-6 space-y-4 border-[#39ff14]/20'>
                                                <input placeholder='Ism' className='input-luxury' value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
                                                <input placeholder='Telefon' className='input-luxury' value={newAdmin.phone} onChange={e => setNewAdmin({ ...newAdmin, phone: e.target.value })} />
                                                <input placeholder='Login' className='input-luxury' value={newAdmin.login} onChange={e => setNewAdmin({ ...newAdmin, login: e.target.value })} />
                                                <input placeholder='Parol' className='input-luxury' value={newAdmin.pass} onChange={e => setNewAdmin({ ...newAdmin, pass: e.target.value })} />
                                                <input placeholder='Klub nomi' className='input-luxury' value={newAdmin.club} onChange={e => setNewAdmin({ ...newAdmin, club: e.target.value })} />
                                                <button onClick={handleSaveSuperAdmin} className='w-full bg-[#39ff14] text-black font-bold py-3 rounded-xl uppercase tracking-[1px]'>
                                                    {editIndex !== null ? 'Yangilash' : 'Saqlash'}
                                                </button>
                                            </div>
                                        )}

                                        <div className='space-y-3'>
                                            {superAdmins.map((admin, i) => (
                                                <div key={i} className='premium-glass p-6 flex flex-col gap-4 border-white/5'>
                                                    <div className='flex justify-between items-start'>
                                                        <div className='flex items-center gap-4'>
                                                            <div className='w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center'>
                                                                <User size={28} className='text-white/40' />
                                                            </div>
                                                            <div>
                                                                <p className='font-bold text-lg tracking-tight'>{admin.name}</p>
                                                                <p className='text-[10px] text-[#39ff14] font-bold tracking-[1px]'>{admin.club}</p>
                                                            </div>
                                                        </div>
                                                        <div className='flex gap-3'>
                                                            <button onClick={() => handleStartEdit(admin, i)} className='w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors'><Settings size={16} className='text-white/40' /></button>
                                                            <button onClick={() => handleDeleteSuperAdmin(i)} className='w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 transition-colors'><Trash2 size={16} className='text-red-400' /></button>
                                                        </div>
                                                    </div>

                                                    <div className='grid grid-cols-2 gap-3 pt-2 border-t border-white/5'>
                                                        <div>
                                                            <p className='text-[8px] text-white/20 uppercase tracking-[2px] mb-1'>Tel raqami</p>
                                                            <p className='text-[11px] font-medium'>{admin.phone || 'Nomalum'}</p>
                                                        </div>
                                                        <div>
                                                            <p className='text-[8px] text-white/20 uppercase tracking-[2px] mb-1'>Login / Parol</p>
                                                            <p className='text-[11px] font-bold text-[#39ff14] tracking-widest'>{admin.login} / {admin.pass}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key='logs' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className='space-y-6'>
                                        <div className='premium-glass bg-black/60 p-6 space-y-6 border-white/5'>
                                            <h4 className='text-[10px] font-bold opacity-30 uppercase tracking-[4px]'>TIZIM FAOLLIYATI (JONLI) ⚡</h4>
                                            <div className='space-y-6'>
                                                {[
                                                    { name: 'KOKAND_01', action: 'Xabarnoma yuborildi', time: 'hozir', status: 'active' },
                                                    { name: 'FERGANA_02', action: 'Yangi PC qo\'shildi', time: '5 daq', status: 'active' },
                                                    { name: 'SYSTEM_SRV', action: 'Arxivlash yakunlandi', time: '12 daq', status: 'active' }
                                                ].map((h, i) => (
                                                    <div key={i} className={`flex justify-between items-center p-5 bg-white/[0.02] rounded-2xl border-l-[3px] ${h.status === 'active' ? 'border-[#39ff14]' : 'border-red-500'}`}>
                                                        <div>
                                                            <div className='text-[13px] font-bold uppercase tracking-[1px]'>{h.name}</div>
                                                            <div className='text-[9px] opacity-40 uppercase tracking-[1px] mt-1'>{h.action}</div>
                                                        </div>
                                                        <div className='text-[10px] font-bold opacity-30 uppercase tracking-[1px]'>{h.time}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : view === 'super-admin' ? (
                    <motion.div
                        key='super-admin' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='relative z-10 w-full h-screen flex flex-col bg-[#030308] max-w-lg mx-auto overflow-hidden'
                    >
                        {/* Tab HUD for Super Admin */}
                        <div className='flex justify-between items-center p-6 bg-black/40 backdrop-blur-2xl border-b border-white/5'>
                            <div className='flex gap-3'>
                                {['asosiy', 'admins', 'logs'].map(tab => (
                                    <button
                                        key={tab} onClick={() => setSuperAdminTab(tab)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[2px] transition-all ${superAdminTab === tab ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'bg-white/5 text-white/40'}`}
                                    >
                                        {tab === 'asosiy' ? 'BOSHQUVAR' : tab === 'admins' ? 'ADMINLAR' : 'JURNALLAR'}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setView('login')} className='w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20'>
                                <LogOut size={18} />
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-6 space-y-8 pb-32'>
                            <AnimatePresence mode='wait'>
                                {superAdminTab === 'asosiy' ? (
                                    <motion.div key='sa-dash' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className='space-y-8'>
                                        {/* My Club Info */}
                                        <div className='premium-glass p-8 bg-gradient-to-br from-[#39ff14]/10 to-transparent border-[#39ff14]/30 relative overflow-hidden'>
                                            <div className='flex justify-between items-start mb-6'>
                                                <div className='space-y-1'>
                                                    <p className='text-[8px] text-[#39ff14] font-black tracking-[4px] uppercase'>FILIAL_HOLATI</p>
                                                    <h2 className='text-2xl font-black italic tracking-tighter uppercase syncopate'>{superAdmins.find(sa => sa.login === username)?.club || 'PLS FILIAL'}</h2>
                                                </div>
                                                <div className='w-3 h-3 rounded-full bg-[#39ff14] shadow-[0_0_12px_#39ff14] animate-pulse'></div>
                                            </div>
                                            <div className='grid grid-cols-2 gap-8'>
                                                <div>
                                                    <p className='text-[8px] text-white/30 font-bold uppercase tracking-[2px] mb-1'>AKTIV PC 🎮</p>
                                                    <p className='text-3xl font-black italic tracking-tighter'>18 / 24</p>
                                                </div>
                                                <div>
                                                    <p className='text-[8px] text-white/30 font-bold uppercase tracking-[2px] mb-1'>BUGUNGI KASSA 💰</p>
                                                    <p className='text-3xl font-black italic tracking-tighter'>1.2M</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions for Super Admin */}
                                        <div className='grid grid-cols-2 gap-4'>
                                            <button className='premium-glass p-6 text-center hover:bg-[#39ff14]/10 transition-all group'>
                                                <Monitor size={32} className='mx-auto mb-3 text-white/40 group-hover:text-[#39ff14]' />
                                                <p className='text-[10px] font-black tracking-[2px]'>MONITORING</p>
                                            </button>
                                            <button className='premium-glass p-6 text-center hover:bg-[#39ff14]/10 transition-all group'>
                                                <CreditCard size={32} className='mx-auto mb-3 text-white/40 group-hover:text-[#39ff14]' />
                                                <p className='text-[10px] font-black tracking-[2px]'>HISOBOTLAR</p>
                                            </button>
                                        </div>

                                        {/* Health bar */}
                                        <div className='flex justify-between items-center p-6 bg-white/[0.02] rounded-3xl border border-white/5'>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>STANTSIYALAR: <span className='text-[#39ff14]'>ONLAYN 🌐</span></div>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>KASSA: <span className='text-[#39ff14]'>YOPILGAN 🔒</span></div>
                                        </div>
                                    </motion.div>
                                ) : superAdminTab === 'admins' ? (
                                    <motion.div key='sa-admins' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className='space-y-6'>
                                        <button className='w-full bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] py-5 rounded-2xl font-black text-[11px] tracking-[3px] uppercase hover:bg-[#39ff14]/20 transition-all'>
                                            + CLUB ADMIN QO'SHISH
                                        </button>

                                        <div className='space-y-3'>
                                            {clubAdmins.filter(ca => ca.club === superAdmins.find(sa => sa.login === username)?.club).map((admin, i) => (
                                                <div key={i} className='premium-glass p-6 flex justify-between items-center border-white/5'>
                                                    <div className='flex items-center gap-4'>
                                                        <div className='w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center'>
                                                            <User size={22} className='text-white/40' />
                                                        </div>
                                                        <div>
                                                            <p className='font-bold text-sm tracking-wide'>{admin.name}</p>
                                                            <p className='text-[10px] text-[#39ff14] font-bold tracking-[1px]'>{admin.login} / {admin.pass}</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex gap-2'>
                                                        <button className='w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10'><Settings size={14} className='text-white/20' /></button>
                                                        <button className='w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10'><Trash2 size={14} className='text-red-400/40' /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key='sa-logs' initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='space-y-6'>
                                        <div className='premium-glass p-6 space-y-6 border-white/5'>
                                            <h4 className='text-[10px] font-bold opacity-30 uppercase tracking-[4px]'>FILIAL FAOLLIYATI ⚡</h4>
                                            <div className='space-y-4'>
                                                {[
                                                    { msg: 'PC-14 sessiyasi tugadi', time: 'hozir' },
                                                    { msg: 'Kassa ochildi', time: '12 daq' },
                                                    { msg: 'Yangi xaridor: shox_pro', time: '24 daq' }
                                                ].map((log, i) => (
                                                    <div key={i} className='flex justify-between items-center py-3 border-b border-white/[0.03] last:border-0'>
                                                        <span className='text-[12px] font-medium text-white/60'>{log.msg}</span>
                                                        <span className='text-[9px] font-bold text-white/20 uppercase tracking-[1px]'>{log.time}</span>
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
