import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
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
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [loginError, setLoginError] = useState(false);
    const [hiddenMode, setHiddenMode] = useState(false);
    const [now, setNow] = useState(Date.now());

    // Root Settings
    const ROOT_LOGIN = '4567';
    const ROOT_PASS = '4567';

    // Modals
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [checkoutRoom, setCheckoutRoom] = useState(null);
    const [selectedRoomForBar, setSelectedRoomForBar] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);

    // Forms
    const [newRoom, setNewRoom] = useState({ name: '', price: '', club: '' });
    const [paidAmount, setPaidAmount] = useState('');
    const [debtUser, setDebtUser] = useState({ name: '', phone: '' });

    // --- EFFECTS ---
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('rooms', JSON.stringify(rooms));
        localStorage.setItem('superAdmins', JSON.stringify(superAdmins));
        localStorage.setItem('clubAdmins', JSON.stringify(clubAdmins));
        localStorage.setItem('debts', JSON.stringify(debts));
        localStorage.setItem('username', JSON.stringify(username));
        localStorage.setItem('view', JSON.stringify(view));
    }, [inventory, rooms, superAdmins, clubAdmins, debts, username, view]);

    // --- CALCULATIONS (Super Protected) ---
    const currentAdminData = useMemo(() => {
        return clubAdmins?.find(a => a?.login === username) ||
            superAdmins?.find(s => s?.login === username) ||
            { name: 'ROOT', club: 'SYSTEM' };
    }, [clubAdmins, superAdmins, username]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const stats = useMemo(() => {
        const busy = activeRooms?.filter(r => r?.isBusy).length || 0;
        const total = activeRooms?.length || 0;
        const free = total - busy - (activeRooms?.filter(r => r?.isSuspended).length || 0);
        const roomRev = activeRooms?.reduce((acc, r) => acc + (Number(r?.dailyRevenue) || 0), 0);
        const barRev = activeRooms?.reduce((acc, r) => acc + (Number(r?.barRevenue) || 0), 0);
        const daily = roomRev + barRev;
        return { busy, free, total, roomRev, barRev, daily, weekly: daily * 7, monthly: daily * 30 };
    }, [activeRooms]);

    const calculateSession = (room) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, itemsPrice: 0 };
        const diff = Math.floor((now - room.startTime) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        const timePrice = (diff / 3600) * Number(room.price || 0);
        const itemsPrice = (room.items || []).reduce((acc, i) => acc + (Number(i?.price) * (i?.quantity || 1)), 0);
        return {
            time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice),
            itemsPrice
        };
    };

    // --- LOGIC ---
    const handleLogin = () => {
        if (hiddenMode) {
            if (username === ROOT_LOGIN && password === ROOT_PASS) { setView('glavniyDashboard'); setLoginError(false); return; }
            if (superAdmins?.find(s => s?.login === username && s?.password === password)) { setView('superDashboard'); setLoginError(false); return; }
        } else {
            if (clubAdmins?.find(a => a?.login === username && a?.password === password)) { setView('clubDashboard'); setLoginError(false); return; }
        }
        setLoginError(true);
    };

    // --- RENDER SECTIONS ---
    const renderClubAsosiy = () => (
        <div className='p-4 space-y-6'>
            <div className='grid grid-cols-3 gap-3'>
                <div className='gold-glass p-3 text-center'><p className='text-[8px] opacity-30 font-black'>JAMI</p><p className='text-lg font-black gold-text'>{stats.total}</p></div>
                <div className='gold-glass p-3 text-center bg-[#ffcf4b]/5'><p className='text-[8px] font-black text-[#ffcf4b]'>BAND</p><p className='text-lg font-black text-[#ffcf4b]'>{stats.busy}</p></div>
                <div className='gold-glass p-3 text-center'><p className='text-[8px] opacity-30 font-black'>BO'SH</p><p className='text-lg font-black opacity-40'>{stats.free}</p></div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div className='gold-glass p-5'><p className='text-[8px] opacity-40 font-black uppercase'>XONALAR</p><p className='text-md font-black'>{stats.roomRev.toLocaleString()} UZS</p></div>
                <div className='gold-glass p-5'><p className='text-[8px] opacity-40 font-black uppercase'>BAR</p><p className='text-md font-black'>{stats.barRev.toLocaleString()} UZS</p></div>
            </div>
            <div className='gold-glass p-6 bg-gradient-to-br from-[#ffcf4b]/5 to-transparent border-[#ffcf4b]/10'>
                <p className='text-[10px] opacity-40 font-black uppercase mb-1'>KUNLIK_JAMI</p>
                <p className='text-3xl font-black gold-text italic tracking-tighter'>{stats.daily.toLocaleString()} UZS</p>
                <div className='grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5'>
                    <div><p className='text-[8px] opacity-30 uppercase font-black'>Haftalik</p><p className='text-xs font-black'>{stats.weekly.toLocaleString()}</p></div>
                    <div><p className='text-[8px] opacity-30 uppercase font-black'>Oylik</p><p className='text-xs font-black'>{stats.monthly.toLocaleString()}</p></div>
                </div>
            </div>
        </div>
    );

    const renderClubXarita = () => (
        <div className='p-4 space-y-6'>
            <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'><Plus size={18} /><span>XONA QO'SHISH</span></button>
            <div className='grid grid-cols-1 gap-4'>
                {activeRooms?.map(room => {
                    const session = calculateSession(room);
                    return (
                        <div key={room.id} className={`room-card-premium ${room.isBusy ? 'ring-1 ring-[#ffcf4b]/20 shadow-xl' : room.isSuspended ? 'opacity-40' : ''}`}>
                            <div className='flex justify-between items-start mb-4'>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-3 h-3 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div>
                                    <div><h3 className='text-2xl font-black italic uppercase'>{room.name || 'XONA'}</h3><p className='text-[9px] opacity-40 font-bold'>{room.price} UZS/SOAT</p></div>
                                </div>
                                <div className='flex gap-2'>
                                    <button onClick={() => setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isSuspended: !r.isSuspended, isBusy: false } : r))} className={`p-2 rounded-xl transition-all ${room.isSuspended ? 'bg-red-500' : 'bg-white/5 text-white/20'}`}><PauseCircle size={16} /></button>
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2 bg-white/5 rounded-xl text-white/20'><Edit3 size={16} /></button>
                                    <button onClick={() => setRooms(prev => prev.filter(r => r.id !== room.id))} className='p-2 bg-white/5 rounded-xl text-red-500/20'><Trash2 size={16} /></button>
                                </div>
                            </div>
                            {room.isBusy ? (
                                <div className='mt-6 pt-6 border-t border-white/5 flex justify-between items-end'>
                                    <div><p className='text-[10px] opacity-30 font-black uppercase mb-1'>VAQT</p><p className='text-3xl font-black italic gold-text tabular-nums'>{session.time}</p></div>
                                    <div className='text-right'>
                                        <button onClick={() => setSelectedRoomForBar(room)} className='text-[8px] font-black uppercase bg-white/5 px-2 py-1 rounded mb-2'>+ BAR</button>
                                        <p className='text-[10px] opacity-30 font-black uppercase mb-1'>SUMMA</p><p className='text-xl font-black'>{session.total.toLocaleString()}</p>
                                        <button onClick={() => setCheckoutRoom(room)} className='mt-2 py-2 px-4 bg-red-500 rounded-xl text-white text-[10px] font-black uppercase shadow-lg shadow-red-500/20'>STOP</button>
                                    </div>
                                </div>
                            ) : room.isSuspended ? (
                                <div className='p-4 bg-red-500/5 text-red-500 text-[10px] font-black uppercase text-center rounded-2xl'>TO'XTATILGAN</div>
                            ) : (
                                <button onClick={() => setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-4 bg-[#ffcf4b] rounded-2xl text-black font-black uppercase italic shadow-lg shadow-[#ffcf4b]/20'>BOSHLASH</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const longPressLogic = {
        onPointerDown: () => { longPressTimer.current = setTimeout(() => { setHiddenMode(true); window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('heavy'); }, 2000); },
        onPointerUp: () => clearTimeout(longPressTimer.current),
        onPointerLeave: () => clearTimeout(longPressTimer.current)
    };

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div {...longPressLogic} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl transition-all duration-700 ${hiddenMode ? 'bg-red-500 shadow-red-500/50 scale-110' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20'}`}><Lock size={32} className={hiddenMode ? 'text-white' : 'text-black'} /></div>
                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>PLS</h1>
                        <div className='w-full max-w-sm space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={handleLogin} className='btn-gold-minimal mt-4'>KIRISH</button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key='dash' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='pb-32'>
                        <div className='p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${view.includes('glavniy') ? 'bg-red-500' : 'bg-[#ffcf4b]'}`}><Activity size={24} className={view.includes('glavniy') ? 'text-white' : 'text-black'} /></div>
                                <div><h2 className='text-lg font-black italic tracking-tighter uppercase'>{currentAdminData?.name || 'ADMIN'}</h2><p className='text-[8px] font-bold opacity-40 uppercase'>{currentAdminData?.club || 'SYSTEM'}</p></div>
                            </div>
                            <button onClick={() => { setView('login'); setHiddenMode(false); }} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center'><X size={20} /></button>
                        </div>

                        <main>
                            {view === 'clubDashboard' ? (activeTab === 'asosiy' ? renderClubAsosiy() : renderClubXarita()) : (
                                <div className='p-8 space-y-4'>
                                    <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'>SUPER/GLAVNIY ACTION</button>
                                </div>
                            )}
                        </main>

                        <div className='fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 flex justify-around z-50'>
                            <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Activity size={20} /><span className='text-[8px] font-black uppercase'>ASOSIY</span></button>
                            <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1 ${activeTab === 'xarita' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[8px] font-black uppercase'>XARITA</span></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals - Simplified for Stability */}
            <AnimatePresence>
                {showAddRoom && (
                    <div className='modal-overlay'><div className='modal-content'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>XONA MA'LUMOTLARI</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="NOMI" className='input-luxury-small' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} />
                            <input type="number" placeholder="NARXI (SOAT)" className='input-luxury-small' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: e.target.value }) : setNewRoom({ ...newRoom, price: e.target.value })} />
                            <button onClick={() => {
                                if (editingRoom) setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
                                else setRooms(prev => [...prev, { ...newRoom, id: Date.now(), isBusy: false, isSuspended: false, dailyRevenue: 0, barRevenue: 0, club: currentAdminData.club }]);
                                setShowAddRoom(false); setEditingRoom(null);
                            }} className='btn-gold-minimal'>SAQLASH</button>
                            <button onClick={() => { setShowAddRoom(false); setEditingRoom(null); }} className='w-full py-4 text-[10px] opacity-20 font-black uppercase'>YOPISH</button>
                        </div>
                    </div></div>
                )}
                {checkoutRoom && (
                    <div className='modal-overlay'><div className='modal-content'>
                        <h2 className='text-3xl font-black italic uppercase mb-8 gold-text text-center'>HISOBLASH</h2>
                        <div className='gold-glass p-8 text-center mb-6'><p className='text-[10px] opacity-40 uppercase font-black mb-1'>JAMI</p><p className='text-4xl font-black gold-text'>{calculateSession(checkoutRoom).total.toLocaleString()} UZS</p></div>
                        <div className='space-y-4'>
                            <input type="number" placeholder="TO'LANGAN" className='input-luxury-small' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            <button onClick={() => {
                                const s = calculateSession(checkoutRoom);
                                const diff = s.total - (Number(paidAmount) || 0);
                                if (diff > 0) setDebts(p => [...p, { id: Date.now(), name: 'MIJOZ', amount: diff, club: checkoutRoom.club }]);
                                setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? { ...r, isBusy: false, startTime: null, items: [], dailyRevenue: (r.dailyRevenue || 0) + (s.total - s.itemsPrice), barRevenue: (r.barRevenue || 0) + s.itemsPrice } : r));
                                setCheckoutRoom(null); setPaidAmount('');
                            }} className='btn-gold-minimal'>TASDIQLASH</button>
                            <button onClick={() => setCheckoutRoom(null)} className='w-full py-4 text-[10px] opacity-20 font-black uppercase'>YOPISH</button>
                        </div>
                    </div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
