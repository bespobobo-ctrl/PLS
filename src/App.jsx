import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const BOT_URL = 'https://pls-taupe.vercel.app/?v=v54';
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
    const [superAdmins, setSuperAdmins] = useState(getInitialState('superAdmins', []));
    const [clubAdmins, setClubAdmins] = useState(getInitialState('clubAdmins', []));
    const [loginError, setLoginError] = useState(false);
    const [hiddenMode, setHiddenMode] = useState(false);

    // Root Settings
    const ROOT_LOGIN = '4567';
    const ROOT_PASS = '4567';

    // Modals
    const [showAddSuper, setShowAddSuper] = useState(false);
    const [showAddClubAdmin, setShowAddClubAdmin] = useState(false);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // Used for editing super or club admins

    // Forms
    const [newSuper, setNewSuper] = useState({ name: '', phone: '', login: '', password: '' });
    const [newClubAdmin, setNewClubAdmin] = useState({ name: '', club: '', login: '', password: '' });
    const [newRoom, setNewRoom] = useState({ name: '', price: '', club: '' });

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
        localStorage.setItem('superAdmins', JSON.stringify(superAdmins));
        localStorage.setItem('clubAdmins', JSON.stringify(clubAdmins));
        localStorage.setItem('username', JSON.stringify(username));
        localStorage.setItem('view', JSON.stringify(view));
    }, [inventory, rooms, superAdmins, clubAdmins, username, view]);

    // --- COMPOSITE DATA ---
    const uniqueClubs = useMemo(() => {
        const clubs = clubAdmins.map(a => a.club);
        return [...new Set(clubs)];
    }, [clubAdmins]);

    const getClubStats = (clubName) => {
        const clubRooms = rooms.filter(r => r.club === clubName);
        const daily = clubRooms.reduce((acc, r) => acc + (r.dailyRevenue || 0), 0);
        return {
            count: clubRooms.length,
            daily,
            weekly: daily * 7,
            monthly: daily * 30,
            yearly: daily * 365
        };
    };

    // --- LOGIN LOGIC ---
    const handleLogin = () => {
        if (hiddenMode) {
            if (username === ROOT_LOGIN && password === ROOT_PASS) {
                setView('glavniyDashboard'); setLoginError(false); return;
            }
            const sAdmin = superAdmins.find(s => s.login === username && s.password === password);
            if (sAdmin) { setView('superDashboard'); setLoginError(false); return; }
        } else {
            const cAdmin = clubAdmins.find(a => a.login === username && a.password === password);
            if (cAdmin) { setView('clubDashboard'); setLoginError(false); return; }
        }
        setLoginError(true);
    };

    const currentRole = view.replace('Dashboard', '');
    const currentAdminData = clubAdmins.find(a => a.login === username) || superAdmins.find(s => s.login === username) || { name: 'ROOT' };

    // --- RENDER CLUBS STATS (For Glavniy & Super) ---
    const renderClubStatsList = () => (
        <div className='space-y-6'>
            <p className='text-[10px] font-black opacity-30 tracking-[4px] uppercase ml-2'>BARCHA_KLUBLAR_STATISTIKASI</p>
            {uniqueClubs.map(clubName => {
                const stats = getClubStats(clubName);
                return (
                    <div key={clubName} className='gold-glass p-6 border-white/5 space-y-4'>
                        <div className='flex justify-between items-start'>
                            <div><h3 className='text-xl font-black italic gold-text uppercase'>{clubName}</h3><p className='text-[9px] opacity-40 font-bold uppercase'>{stats.count} TA KONSOL ULANGAN</p></div>
                            <div className='p-2 bg-[#ffcf4b]/10 rounded-xl text-[#ffcf4b]'><Activity size={16} /></div>
                        </div>
                        <div className='grid grid-cols-2 gap-4 pt-4 border-t border-white/5'>
                            <div><p className='text-[8px] opacity-30 uppercase font-black'>KUNLIK</p><p className='text-sm font-black'>{stats.daily.toLocaleString()} UZS</p></div>
                            <div><p className='text-[8px] opacity-30 uppercase font-black'>HAFTALIK</p><p className='text-sm font-black'>{stats.weekly.toLocaleString()} UZS</p></div>
                            <div><p className='text-[8px] opacity-30 uppercase font-black'>OYLIK</p><p className='text-sm font-black'>{stats.monthly.toLocaleString()} UZS</p></div>
                            <div><p className='text-[8px] opacity-30 uppercase font-black'>YILLIK</p><p className='text-sm font-black gold-text'>{stats.yearly.toLocaleString()} UZS</p></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // --- RENDER GLAVNIY ---
    const renderGlavniy = () => (
        <div className='p-4 space-y-6'>
            {activeTab === 'asosiy' && (
                <>
                    <button onClick={() => { setEditingItem(null); setShowAddSuper(true); }} className='btn-gold-minimal py-8 rounded-[2rem]'><UserPlus size={20} /><span>YANGI SUPER ADMIN</span></button>
                    <div className='space-y-4'>
                        <p className='text-[10px] font-black opacity-30 tracking-[4px] uppercase ml-2'>BOSHQARUV_KADRLARI</p>
                        {superAdmins.map(s => (
                            <div key={s.login} className='gold-glass p-4 flex justify-between items-center border-white/5'>
                                <div><p className='text-xs font-black uppercase'>{s.name}</p><p className='text-[8px] opacity-40 uppercase'>Login: {s.login}</p></div>
                                <div className='flex gap-2'>
                                    <button onClick={() => { setEditingItem(s); setShowAddSuper(true); }} className='p-2 bg-white/5 rounded-lg text-white/40'><Edit3 size={14} /></button>
                                    <button onClick={() => setSuperAdmins(prev => prev.filter(a => a.login !== s.login))} className='p-2 bg-white/5 rounded-lg text-red-500/40'><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {activeTab === 'stats' && renderClubStatsList()}
        </div>
    );

    // --- RENDER SUPER ---
    const renderSuper = () => (
        <div className='p-4 space-y-6'>
            {activeTab === 'asosiy' && (
                <>
                    <button onClick={() => { setEditingItem(null); setShowAddClubAdmin(true); }} className='btn-gold-minimal py-8 rounded-[2rem]'><Plus size={18} /><span>YANGI KLUB ADMINI</span></button>
                    <div className='space-y-4'>
                        <p className='text-[10px] font-black opacity-30 tracking-[4px] uppercase ml-2'>KLUBLAR_BOSHQARUVI</p>
                        {clubAdmins.map(c => (
                            <div key={c.login} className='gold-glass p-4 flex justify-between items-center border-white/5'>
                                <div><p className='text-xs font-black uppercase'>{c.name}</p><p className='text-[8px] opacity-40 uppercase'>{c.club} | {c.login}</p></div>
                                <div className='flex gap-2'>
                                    <button onClick={() => { setEditingItem(c); setShowAddClubAdmin(true); }} className='p-2 bg-white/5 rounded-lg text-white/40'><Edit3 size={14} /></button>
                                    <button onClick={() => setClubAdmins(prev => prev.filter(a => a.login !== c.login))} className='p-2 bg-white/5 rounded-lg text-red-500/40'><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {activeTab === 'stats' && renderClubStatsList()}
            {activeTab === 'ombor' && (
                <div className='grid grid-cols-2 gap-4'>
                    {inventory.map(item => <div key={item.id} className='gold-glass p-4 border-white/5'><p className='text-[9px] font-black uppercase mb-1'>{item.name}</p><p className='text-xs gold-text font-bold'>{item.price.toLocaleString()} UZS</p></div>)}
                </div>
            )}
        </div>
    );

    const renderClub = () => (
        <div className='p-4 space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
                <div className='gold-glass p-6 text-center'><p className='text-[8px] opacity-40 mb-1 font-bold'>TUSHUM</p><p className='text-xl gold-text font-black'>{(rooms.find(r => r.club === currentAdminData.club)?.dailyRevenue || 0).toLocaleString()}</p></div>
                <div className='gold-glass p-6 text-center'><p className='text-[8px] opacity-40 mb-1 font-bold'>ONLINE</p><p className='text-2xl gold-text font-black'>{rooms.filter(r => r.club === currentAdminData.club && r.isBusy).length}</p></div>
            </div>
            <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'><Plus size={18} /><span>Xona Qo'shish</span></button>
            <div className='space-y-4'>{rooms.filter(r => r.club === currentAdminData.club).map(room => (
                <div key={room.id} className='room-card-premium'><div className='flex justify-between items-center'><h3 className='text-2xl font-black italic uppercase'>{room.name}</h3><div className='flex gap-2'><button className='p-2 bg-white/5 rounded-xl'><Settings size={14} /></button><button className='p-2 bg-[#ffcf4b] text-black rounded-xl'><ChevronRight size={14} /></button></div></div></div>
            ))}</div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div onPointerDown={handleLongPressStart} onPointerUp={handleLongPressEnd} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl transition-all duration-700 ${hiddenMode ? 'bg-red-500 shadow-red-500/50 scale-110' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20'}`}><Lock size={32} className={hiddenMode ? 'text-white' : 'text-black'} /></div>
                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>{hiddenMode ? 'ROOT' : 'PLS'}</h1>
                        <p className='text-[10px] font-bold opacity-30 tracking-[4px] mb-12 uppercase'>{hiddenMode ? 'HIDDEN ACCESS' : 'PREMIUM SYSTEM'}</p>
                        {loginError && <p className='text-red-500 text-[10px] font-black mb-4 uppercase'>XATO LOGIN YOKI PAROL!</p>}
                        <div className='w-full max-w-sm space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={handleLogin} className='btn-gold-minimal mt-4'>KIRISH <ArrowRight size={18} /></button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key='dash' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='pb-32'>
                        <div className='p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${currentRole === 'glavniy' ? 'bg-red-500' : 'bg-[#ffcf4b]'}`}><Activity size={24} className={currentRole === 'glavniy' ? 'text-white' : 'text-black'} /></div>
                                <div><h2 className='text-lg font-black italic tracking-tighter uppercase'>{currentAdminData.name || currentRole.toUpperCase()}</h2><p className='text-[8px] font-bold opacity-40 uppercase tracking-widest'>{currentAdminData.club || 'SYSTEM'}</p></div>
                            </div>
                            <button onClick={() => { setView('login'); setHiddenMode(false); }} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center'><X size={20} /></button>
                        </div>

                        <main>{currentRole === 'glavniy' ? renderGlavniy() : currentRole === 'super' ? renderSuper() : renderClub()}</main>

                        <div className='fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 flex justify-around z-50'>
                            {(currentRole === 'super' || currentRole === 'glavniy') ? (
                                <>
                                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Users size={20} /><span className='text-[8px] font-black uppercase'>KADRLAR</span></button>
                                    <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><BarChart3 size={20} /><span className='text-[8px] font-black uppercase'>KLUBLAR</span></button>
                                    {currentRole === 'super' && <button onClick={() => setActiveTab('ombor')} className={`flex flex-col items-center gap-1 ${activeTab === 'ombor' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Database size={20} /><span className='text-[8px] font-black uppercase'>OMBOR</span></button>}
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
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>{editingItem ? 'SUPER ADMINNI TAHRIRLASH' : 'YANGI SUPER ADMIN'}</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="FISH" className='input-luxury-small' value={editingItem ? editingItem.name : newSuper.name} onChange={(e) => editingItem ? setEditingItem({ ...editingItem, name: e.target.value }) : setNewSuper({ ...newSuper, name: e.target.value })} />
                            <div className='grid grid-cols-2 gap-4'><input type="text" placeholder="LOGIN" className='input-luxury-small' value={editingItem ? editingItem.login : newSuper.login} onChange={(e) => editingItem ? setEditingItem({ ...editingItem, login: e.target.value }) : setNewSuper({ ...newSuper, login: e.target.value })} /><input type="text" placeholder="PAROL" className='input-luxury-small' value={editingItem ? editingItem.password : newSuper.password} onChange={(e) => editingItem ? setEditingItem({ ...editingItem, password: e.target.value }) : setNewSuper({ ...newSuper, password: e.target.value })} /></div>
                            <button onClick={() => {
                                if (editingItem) setSuperAdmins(prev => prev.map(s => s.login === editingItem.login ? editingItem : s));
                                else setSuperAdmins(prev => [...prev, newSuper]);
                                setShowAddSuper(false); setEditingItem(null);
                            }} className='btn-gold-minimal !bg-red-500 !text-white'>SAQLASH</button>
                            <button onClick={() => { setShowAddSuper(false); setEditingItem(null); }} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {showAddClubAdmin && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>{editingItem ? 'ADMINNI TAHRIRLASH' : 'KLUB ADMIN QO\'SHISH'}</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="FISH" className='input-luxury-small' value={editingItem ? editingItem.name : newClubAdmin.name} onChange={(e) => editingItem ? setEditingItem({ ...editingItem, name: e.target.value }) : setNewClubAdmin({ ...newClubAdmin, name: e.target.value })} />
                            <input type="text" placeholder="KLUB NOMI" className='input-luxury-small' value={editingItem ? editingItem.club : newClubAdmin.club} onChange={(e) => editingItem ? setEditingItem({ ...editingItem, club: e.target.value }) : setNewClubAdmin({ ...newClubAdmin, club: e.target.value })} />
                            <div className='grid grid-cols-2 gap-4'><input type="text" placeholder="LOGIN" className='input-luxury-small' value={editingItem ? editingItem.login : newClubAdmin.login} onChange={(e) => editingItem ? setEditingItem({ ...editingItem, login: e.target.value }) : setNewClubAdmin({ ...newClubAdmin, login: e.target.value })} /><input type="text" placeholder="PAROL" className='input-luxury-small' value={editingItem ? editingItem.password : newClubAdmin.password} onChange={(e) => editingItem ? setEditingItem({ ...editingItem, password: e.target.value }) : setNewClubAdmin({ ...newClubAdmin, password: e.target.value })} /></div>
                            <button onClick={() => {
                                if (editingItem) setClubAdmins(prev => prev.map(c => c.login === editingItem.login ? editingItem : c));
                                else setClubAdmins(prev => [...prev, newClubAdmin]);
                                setShowAddClubAdmin(false); setEditingItem(null);
                            }} className='btn-gold-minimal'>TASDIQLASH</button>
                            <button onClick={() => { setShowAddClubAdmin(false); setEditingItem(null); }} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
