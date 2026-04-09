import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const BOT_URL = 'https://pls-taupe.vercel.app/?v=v52';
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

    // Forms
    const [newSuper, setNewSuper] = useState({ name: '', phone: '', login: '', password: '' });
    const [newClubAdmin, setNewClubAdmin] = useState({ name: '', club: 'KOKAND_1', login: '', password: '' });
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

    // --- LOGIN LOGIC ---
    const handleLogin = () => {
        if (hiddenMode) {
            // YASHIRIN KIRISH (Glavniy va Superlar uchun)
            if (username === ROOT_LOGIN && password === ROOT_PASS) {
                setView('glavniyDashboard');
                setLoginError(false);
                return;
            }
            const sAdmin = superAdmins.find(s => s.login === username && s.password === password);
            if (sAdmin) {
                setView('superDashboard');
                setLoginError(false);
                return;
            }
        } else {
            // ODDIY KIRISH (Klub adminlari uchun)
            const cAdmin = clubAdmins.find(a => a.login === username && a.password === password);
            if (cAdmin) {
                setView('clubDashboard');
                setLoginError(false);
                return;
            }
        }
        setLoginError(true);
    };

    const currentRole = view.replace('Dashboard', '');
    const currentAdminData = clubAdmins.find(a => a.login === username) || superAdmins.find(s => s.login === username) || { name: 'ROOT' };

    // --- RENDER GLAVNIY (Level 1) ---
    const renderGlavniy = () => (
        <div className='p-4 space-y-6'>
            <div className='gold-glass p-6 border-red-500/20'><p className='text-[8px] font-black uppercase opacity-40 text-red-500'>ROOT_ACCESS</p><h2 className='text-3xl font-black italic gold-text'>GLAVNIY</h2></div>
            <button onClick={() => setShowAddSuper(true)} className='btn-gold-minimal py-8 rounded-[2rem]'><UserPlus size={20} /><span>SUPER ADMIN YARATISH</span></button>
            <div className='space-y-4'>
                <p className='text-[10px] font-black opacity-30 tracking-[4px] uppercase ml-2'>SUPER_ADMINLAR</p>
                {superAdmins.map(s => (
                    <div key={s.login} className='gold-glass p-4 flex justify-between items-center border-white/5'>
                        <div><p className='text-xs font-black uppercase'>{s.name}</p><p className='text-[8px] opacity-40 uppercase'>Login: {s.login}</p></div>
                        <button onClick={() => setSuperAdmins(prev => prev.filter(a => a.login !== s.login))} className='text-red-500/30'><Trash2 size={14} /></button>
                    </div>
                ))}
            </div>
        </div>
    );

    // --- RENDER SUPER (Level 2) ---
    const renderSuper = () => (
        <div className='p-4 space-y-6'>
            <div className='gold-glass p-6 border-white/10'><p className='text-[8px] font-black uppercase opacity-40'>MANAGEMENT</p><h2 className='text-3xl font-black italic gold-text'>SUPER ADMIN</h2></div>

            {activeTab === 'asosiy' && (
                <div className='space-y-6'>
                    <button onClick={() => setShowAddClubAdmin(true)} className='btn-gold-minimal'><Plus size={18} /><span>KLUB ADMIN QO'SHISH</span></button>
                    <div className='space-y-4 font-black uppercase text-[10px]'>
                        <p className='opacity-30 tracking-[4px] ml-2'>KLUB_ADMINLARI</p>
                        {clubAdmins.map(c => (
                            <div key={c.login} className='gold-glass p-4 flex justify-between items-center border-white/5'>
                                <div><p className='text-white'>{c.name}</p><p className='opacity-40'>{c.club}</p></div>
                                <button onClick={() => setClubAdmins(prev => prev.filter(a => a.login !== c.login))} className='text-red-500/30 font-bold'>OCHIRISH</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'ombor' && (
                <div className='grid grid-cols-2 gap-4'>
                    {inventory.map(item => (
                        <div key={item.id} className='gold-glass p-4 border-white/5'><p className='text-[9px] font-black uppercase mb-2'>{item.name}</p><p className='text-xs gold-text font-bold'>{item.price.toLocaleString()} UZS</p></div>
                    ))}
                </div>
            )}
        </div>
    );

    // --- RENDER CLUB ADMIN (Level 3) ---
    const renderClub = () => (
        <div className='p-4 space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
                <div className='gold-glass p-6 text-center'><p className='text-[8px] opacity-40 mb-1 font-bold'>TUSHUM</p><p className='text-xl gold-text font-black'>{(rooms.find(r => r.club === currentAdminData.club)?.dailyRevenue || 0).toLocaleString()}</p></div>
                <div className='gold-glass p-6 text-center'><p className='text-[8px] opacity-40 mb-1 font-bold'>ONLINE</p><p className='text-2xl gold-text font-black'>{rooms.filter(r => r.club === currentAdminData.club && r.isBusy).length}</p></div>
            </div>
            <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'><Plus size={18} /><span>Xona Qo'shish</span></button>
            <div className='space-y-4'>
                {rooms.filter(r => r.club === currentAdminData.club).map(room => (
                    <div key={room.id} className='room-card-premium'>
                        <div className='flex justify-between items-center'><h3 className='text-2xl font-black italic uppercase'>{room.name}</h3><div className='flex gap-2'><button className='p-2 bg-white/5 rounded-xl'><Settings size={14} /></button><button className='p-2 bg-[#ffcf4b] text-black rounded-xl'><ChevronRight size={14} /></button></div></div>
                    </div>
                ))}
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
                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>{hiddenMode ? 'ROOT_ACCESS' : 'PLS_ADMIN'}</h1>
                        <p className='text-[10px] font-bold opacity-30 tracking-[4px] mb-12 uppercase'>{hiddenMode ? 'Glavniy & Super Access Only' : 'Game Club Admin Access'}</p>
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
                            {currentRole === 'super' ? (
                                <>
                                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Users size={20} /><span className='text-[8px] font-black uppercase'>ADMINLAR</span></button>
                                    <button onClick={() => setActiveTab('ombor')} className={`flex flex-col items-center gap-1 ${activeTab === 'ombor' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Database size={20} /><span className='text-[8px] font-black uppercase'>OMBOR</span></button>
                                </>
                            ) : currentRole === 'glavniy' ? (
                                <button onClick={() => setActiveTab('asosiy')} className='text-red-500 flex flex-col items-center gap-1'><UserPlus size={20} /><span className='text-[8px] font-black uppercase'>SUPERLAR</span></button>
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
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>YANGI SUPER ADMIN</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="FISH" className='input-luxury-small' value={newSuper.name} onChange={(e) => setNewSuper({ ...newSuper, name: e.target.value })} />
                            <div className='grid grid-cols-2 gap-4'><input type="text" placeholder="LOGIN" className='input-luxury-small' value={newSuper.login} onChange={(e) => setNewSuper({ ...newSuper, login: e.target.value })} /><input type="text" placeholder="PAROL" className='input-luxury-small' value={newSuper.password} onChange={(e) => setNewSuper({ ...newSuper, password: e.target.value })} /></div>
                            <button onClick={() => { setSuperAdmins(prev => [...prev, newSuper]); setShowAddSuper(false); }} className='btn-gold-minimal !bg-red-500 !text-white'>QO'SHISH</button>
                            <button onClick={() => setShowAddSuper(false)} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {showAddClubAdmin && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>Klub Admin Qo'shish</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="FISH" className='input-luxury-small' value={newClubAdmin.name} onChange={(e) => setNewClubAdmin({ ...newClubAdmin, name: e.target.value })} />
                            <select className='input-luxury-small' value={newClubAdmin.club} onChange={(e) => setNewClubAdmin({ ...newClubAdmin, club: e.target.value })}><option value="KOKAND_1">KOKAND_1</option><option value="KOKAND_2">KOKAND_2</option></select>
                            <div className='grid grid-cols-2 gap-4'><input type="text" placeholder="LOGIN" className='input-luxury-small' value={newClubAdmin.login} onChange={(e) => setNewClubAdmin({ ...newClubAdmin, login: e.target.value })} /><input type="text" placeholder="PAROL" className='input-luxury-small' value={newClubAdmin.password} onChange={(e) => setNewClubAdmin({ ...newClubAdmin, password: e.target.value })} /></div>
                            <button onClick={() => { setClubAdmins(prev => [...prev, newClubAdmin]); setShowAddClubAdmin(false); }} className='btn-gold-minimal'>TASDIQLASH</button>
                            <button onClick={() => setShowAddClubAdmin(false)} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {showAddRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>YANGI KONSOL/XONA</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="NOMI" className='input-luxury-small' value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
                            <input type="number" placeholder="NARXI" className='input-luxury-small' value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} />
                            <button onClick={() => { setRooms(prev => [...prev, { ...newRoom, id: Date.now(), isBusy: false, dailyRevenue: 0, club: currentAdminData.club }]); setShowAddRoom(false); }} className='btn-gold-minimal'>SAQLASH</button>
                            <button onClick={() => setShowAddRoom(false)} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
