import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const BOT_URL = 'https://pls-taupe.vercel.app/?v=v51';
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const App = () => {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState(getInitialState('view', 'login'));
    const [username, setUsername] = useState(getInitialState('username', ''));
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('asosiy');
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [superAdmins, setSuperAdmins] = useState(getInitialState('superAdmins', []));
    const [loginError, setLoginError] = useState(false);
    const [hiddenMode, setHiddenMode] = useState(false);

    // Boshlang'ich tizim adminlari
    const systemSettings = {
        glavniy: { login: '4567', password: '4567', role: 'glavniy' }
    };

    const clubAdmins = [
        { login: 'admin1', password: '11', club: 'KOKAND_1', role: 'admin' },
        { login: 'admin2', password: '22', club: 'KOKAND_2', role: 'admin' }
    ];

    // Modals
    const [showAddSuper, setShowAddSuper] = useState(false);
    const [newSuper, setNewSuper] = useState({ name: '', phone: '', login: '', password: '' });

    // --- LONG PRESS LOGIC ---
    const longPressTimer = useRef(null);
    const handleLongPressStart = () => {
        longPressTimer.current = setTimeout(() => {
            setHiddenMode(true);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
            }
        }, 2000);
    };
    const handleLongPressEnd = () => clearTimeout(longPressTimer.current);

    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('rooms', JSON.stringify(rooms));
        localStorage.setItem('debts', JSON.stringify(debts));
        localStorage.setItem('superAdmins', JSON.stringify(superAdmins));
        localStorage.setItem('username', JSON.stringify(username));
        localStorage.setItem('view', JSON.stringify(view));
    }, [inventory, rooms, debts, superAdmins, username, view]);

    // --- LOGIN LOGIC ---
    const handleLogin = () => {
        // 1. Check Glavniy (4567)
        if (hiddenMode && username === systemSettings.glavniy.login && password === systemSettings.glavniy.password) {
            setView('glavniyDashboard');
            setLoginError(false);
            return;
        }

        // 2. Check Dynamic Super Admins (Created by Glavniy)
        const dynamicSuper = superAdmins.find(s => s.login === username && s.password === password);
        if (dynamicSuper) {
            setView('superDashboard');
            setLoginError(false);
            return;
        }

        // 3. Check Club Admins
        const admin = clubAdmins.find(a => a.login === username && a.password === password);
        if (admin) {
            setView('clubDashboard');
            setLoginError(false);
            return;
        }

        setLoginError(true);
    };

    const currentRole = view.replace('Dashboard', '');

    // --- RENDER GLAVNIY ADMIN (The Creator) ---
    const renderGlavniyAdmin = () => (
        <div className='p-4 space-y-6'>
            <div className='gold-glass p-6 flex items-center justify-between border-white/10'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20'><Briefcase className='text-white' size={24} /></div>
                    <div><h2 className='text-lg font-black gold-text italic tracking-tighter uppercase'>GLAVNIY_PANEL</h2><p className='text-[8px] opacity-40 uppercase font-bold tracking-widest'>Boshqaruv va Kadrlar</p></div>
                </div>
            </div>

            <button onClick={() => setShowAddSuper(true)} className='btn-gold-minimal py-8 rounded-[2rem]'>
                <UserPlus size={20} />
                <span>SUPER ADMIN QO'SHISH</span>
            </button>

            <div className='space-y-4'>
                <p className='text-[10px] font-black opacity-30 tracking-[4px] uppercase ml-2'>FAOL_SUPER_ADMINLAR</p>
                {superAdmins.length === 0 ? (
                    <div className='gold-glass p-8 text-center opacity-20 italic text-xs'>Hali super adminlar qo'shilmagan</div>
                ) : (
                    superAdmins.map(admin => (
                        <div key={admin.login} className='gold-glass p-4 flex justify-between items-center border-white/5'>
                            <div>
                                <p className='text-xs font-black uppercase text-white'>{admin.name}</p>
                                <p className='text-[9px] opacity-40 font-bold'>{admin.phone}</p>
                            </div>
                            <div className='text-right'>
                                <p className='text-[9px] gold-text font-black uppercase'>LOGIN: {admin.login}</p>
                                <button onClick={() => setSuperAdmins(prev => prev.filter(s => s.login !== admin.login))} className='text-red-500/40 hover:text-red-500 mt-2'><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    // --- RENDER SUPER ADMIN (The Manager) ---
    const renderSuperAdmin = () => (
        <div className='p-4 space-y-4'>
            <div className='gold-glass p-6 border-white/10 flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-[#ffcf4b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ffcf4b]/20'><ShieldCheck className='text-black' size={24} /></div>
                    <div><h2 className='text-lg font-black italic tracking-tighter uppercase'>SUPER_PANEL</h2><p className='text-[8px] opacity-40 uppercase font-bold tracking-widest'>Global Nazorat va Ombor</p></div>
                </div>
            </div>

            {activeTab === 'asosiy' && (
                <div className='grid grid-cols-1 gap-4'>
                    <div className='gold-glass p-8'><p className='text-[10px] opacity-40 mb-2 font-black uppercase'>GLOBAL_DAROMAD</p><p className='text-5xl gold-text font-black tracking-tighter'>{rooms.reduce((acc, r) => acc + (r.dailyRevenue || 0), 0).toLocaleString()} <span className='text-xs opacity-30'>UZS</span></p></div>
                </div>
            )}

            {activeTab === 'ombor' && (
                <div className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                        {inventory.map(item => (
                            <div key={item.id} className='gold-glass p-4 border-white/5'><p className='text-[9px] font-black uppercase mb-1'>{item.name}</p><p className='text-xs gold-text font-bold'>{item.price.toLocaleString()} UZS</p><p className='text-[8px] opacity-30 mt-4 uppercase'>STOCK: {item.stock} ta</p></div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // --- RENDER CLUB ADMIN (The Operator) ---
    const renderClubAdmin = () => (
        <div className='p-4 space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
                <div className='gold-glass p-6 text-center'><p className='text-[9px] opacity-40 mb-1 font-bold uppercase'>TUSHUM</p><p className='text-2xl gold-text font-black'>{(rooms.find(r => r.club === clubAdmins.find(a => a.login === username)?.club)?.dailyRevenue || 0).toLocaleString()}</p></div>
                <div className='gold-glass p-6 text-center'><p className='text-[9px] opacity-40 mb-1 font-bold uppercase'>KONSOL</p><p className='text-2xl gold-text font-black'>{rooms.filter(r => r.club === clubAdmins.find(a => a.login === username)?.club && r.isBusy).length}</p></div>
            </div>

            <div className='space-y-4 pt-4'>
                <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'><Plus size={18} /><span>Xona Qo'shish</span></button>
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div onPointerDown={handleLongPressStart} onPointerUp={handleLongPressEnd} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl transition-all duration-700 ${hiddenMode ? 'bg-red-500 shadow-red-500/50 scale-110' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20'}`}>
                            {hiddenMode ? <Unlock size={32} /> : <Lock size={32} className='text-black' />}
                        </div>
                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>{hiddenMode ? 'RESTRICTED' : 'PLS_ADMIN'}</h1>
                        <p className='text-[10px] font-bold opacity-30 tracking-[4px] mb-12 uppercase'>{hiddenMode ? 'System Root Access' : 'Premium Management System'}</p>
                        {loginError && <p className='text-red-500 text-[10px] font-black mb-4 uppercase'>XATO LOGIN YOKI PAROL!</p>}
                        <div className='w-full max-w-sm space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={handleLogin} className='btn-gold-minimal mt-4'>KIRISH <ArrowRight size={18} /></button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key='dash' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='pb-32'>
                        {/* Header */}
                        <div className='p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${currentRole === 'glavniy' ? 'bg-red-500 shadow-red-500/20' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20'}`}><Activity size={24} className={currentRole === 'glavniy' ? 'text-white' : 'text-black'} /></div>
                                <div><h2 className='text-lg font-black italic tracking-tighter uppercase'>PLS {currentRole.toUpperCase()}</h2><p className='text-[8px] font-bold opacity-40 uppercase tracking-widest'>{currentRole === 'glavniy' ? 'OWNER' : 'MANAGEMENT'}</p></div>
                            </div>
                            <button onClick={() => { setView('login'); setHiddenMode(false); }} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center'><X size={20} /></button>
                        </div>

                        {/* Content */}
                        <main>
                            {currentRole === 'glavniy' ? renderGlavniyAdmin() : currentRole === 'super' ? renderSuperAdmin() : renderClubAdmin()}
                        </main>

                        {/* Bottom Navigation */}
                        <div className='fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 flex justify-around z-50'>
                            {currentRole === 'super' ? (
                                <>
                                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Zap size={20} /><span className='text-[8px] font-black uppercase'>STAT</span></button>
                                    <button onClick={() => setActiveTab('ombor')} className={`flex flex-col items-center gap-1 ${activeTab === 'ombor' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Database size={20} /><span className='text-[8px] font-black uppercase'>OMBOR</span></button>
                                </>
                            ) : currentRole === 'glavniy' ? (
                                <>
                                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-red-500' : 'text-white/20'}`}><Users size={20} /><span className='text-[8px] font-black uppercase'>ADMINLAR</span></button>
                                    <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-red-500' : 'text-white/20'}`}><BarChart3 size={20} /><span className='text-[8px] font-black uppercase'>HISOBOT</span></button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Activity size={20} /><span className='text-[8px] font-black uppercase'>STAT</span></button>
                                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1 ${activeTab === 'xarita' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[8px] font-black uppercase'>XARITA</span></button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
                {showAddSuper && (
                    <div className='modal-overlay'>
                        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                            <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>Super Admin Yaratish</h2>
                            <div className='space-y-4'>
                                <input type="text" placeholder="FISH (Ismi)" className='input-luxury-small' value={newSuper.name} onChange={(e) => setNewSuper({ ...newSuper, name: e.target.value })} />
                                <input type="text" placeholder="TEL RAQAM" className='input-luxury-small' value={newSuper.phone} onChange={(e) => setNewSuper({ ...newSuper, phone: e.target.value })} />
                                <div className='grid grid-cols-2 gap-4'>
                                    <input type="text" placeholder="LOGIN" className='input-luxury-small' value={newSuper.login} onChange={(e) => setNewSuper({ ...newSuper, login: e.target.value })} />
                                    <input type="text" placeholder="PAROL" className='input-luxury-small' value={newSuper.password} onChange={(e) => setNewSuper({ ...newSuper, password: e.target.value })} />
                                </div>
                                <button onClick={() => {
                                    setSuperAdmins(prev => [...prev, newSuper]);
                                    setShowAddSuper(false);
                                    setNewSuper({ name: '', phone: '', login: '', password: '' });
                                }} className='btn-gold-minimal !bg-red-500 !text-white'>TASDIQLASH</button>
                                <button onClick={() => setShowAddSuper(false)} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
