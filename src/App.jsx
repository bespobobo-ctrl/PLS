import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const BOT_URL = 'https://pls-taupe.vercel.app/?v=v55';
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
    const [inventory, setInventory] = useState(getInitialState('inventory', [
        { id: 1, name: 'Pepsi 0.5', price: 7000, stock: 50 },
        { id: 2, name: 'Lays Chips', price: 12000, stock: 30 }
    ]));
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
    const [showAddSuper, setShowAddSuper] = useState(false);
    const [showAddClubAdmin, setShowAddClubAdmin] = useState(false);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [checkoutRoom, setCheckoutRoom] = useState(null);
    const [selectedRoomForBar, setSelectedRoomForBar] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    // Forms
    const [newSuper, setNewSuper] = useState({ name: '', phone: '', login: '', password: '' });
    const [newClubAdmin, setNewClubAdmin] = useState({ name: '', club: '', login: '', password: '' });
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

    // --- BUSINESS LOGIC ---
    const startSession = (roomId) => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r));
    };

    const calculateSession = (room) => {
        if (!room.startTime) return { time: '00:00:00', total: 0 };
        const diff = Math.floor((now - room.startTime) / 1000);
        const hours = Math.floor(diff / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        const secs = diff % 60;

        const timePrice = (diff / 3600) * Number(room.price);
        const itemsPrice = (room.items || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);

        return {
            time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice)
        };
    };

    const handleCheckout = () => {
        const stats = calculateSession(checkoutRoom);
        const total = stats.total;
        const paid = Number(paidAmount) || 0;
        const remaining = total - paid;

        if (remaining > 0) {
            setDebts(prev => [...prev, {
                id: Date.now(),
                name: debtUser.name || 'Noma\'lum',
                phone: debtUser.phone || 'Noma\'lum',
                amount: remaining,
                date: new Date().toLocaleDateString(),
                club: checkoutRoom.club
            }]);
        }

        setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? { ...r, isBusy: false, startTime: null, items: [], dailyRevenue: (r.dailyRevenue || 0) + paid } : r));
        setCheckoutRoom(null);
        setPaidAmount('');
        setDebtUser({ name: '', phone: '' });
    };

    const handleLogin = () => {
        if (hiddenMode) {
            if (username === ROOT_LOGIN && password === ROOT_PASS) { setView('glavniyDashboard'); setLoginError(false); return; }
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

    // --- RENDER CLUB OPERATIONAL ---
    const renderClub = () => (
        <div className='p-4 space-y-6'>
            {activeTab === 'asosiy' && (
                <div className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='gold-glass p-6'><p className='text-[8px] opacity-40 font-bold uppercase mb-1'>KASSA</p><p className='text-xl gold-text font-black'>{(rooms.filter(r => r.club === currentAdminData.club).reduce((acc, r) => acc + (r.dailyRevenue || 0), 0)).toLocaleString()}</p></div>
                        <div className='gold-glass p-6'><p className='text-[8px] opacity-40 font-bold uppercase mb-1'>QARZLAR</p><p className='text-xl text-red-500 font-black'>{debts.filter(d => d.club === currentAdminData.club).reduce((acc, d) => acc + d.amount, 0).toLocaleString()}</p></div>
                    </div>

                    <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'><Plus size={18} /><span>YANGI XONA</span></button>

                    <div className='space-y-4'>
                        {rooms.filter(r => r.club === currentAdminData.club).map(room => {
                            const session = calculateSession(room);
                            return (
                                <div key={room.id} className={`room-card-premium ${room.isBusy ? 'ring-1 ring-[#ffcf4b]/20 shadow-lg shadow-[#ffcf4b]/5' : ''}`}>
                                    <div className='flex justify-between items-start'>
                                        <div><h3 className='text-2xl font-black italic uppercase'>{room.name}</h3><p className='text-[8px] opacity-40 font-bold'>{room.price} UZS / SOAT</p></div>
                                        <div className='flex items-center gap-2'>
                                            {room.isBusy ? (
                                                <button onClick={() => setCheckoutRoom(room)} className='p-3 bg-red-500 rounded-2xl text-white shadow-lg shadow-red-500/20'><Square size={20} /></button>
                                            ) : (
                                                <button onClick={() => startSession(room.id)} className='p-3 bg-[#ffcf4b] rounded-2xl text-black shadow-lg shadow-[#ffcf4b]/40'><Play size={20} /></button>
                                            )}
                                        </div>
                                    </div>
                                    {room.isBusy && (
                                        <div className='mt-6 pt-6 border-t border-white/5 flex justify-between items-end'>
                                            <div><p className='text-[10px] opacity-30 font-black uppercase mb-1'>O'YIN_VAQTI</p><p className='text-3xl font-black tracking-tighter gold-text'>{session.time}</p></div>
                                            <div className='text-right'>
                                                <button onClick={() => setSelectedRoomForBar(room)} className='text-[9px] font-black uppercase opacity-40 mb-2 border border-white/10 px-3 py-1 rounded-full'>+ BAR</button>
                                                <p className='text-[10px] opacity-30 font-black uppercase mb-1'>HISOBLANDI</p><p className='text-xl font-black tabular-nums'>{session.total.toLocaleString()} UZS</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'stats' && (
                <div className='space-y-4'>
                    <p className='text-[10px] font-black opacity-30 tracking-[4px] uppercase ml-2'>QARZ_RO'YXATI</p>
                    {debts.filter(d => d.club === currentAdminData.club).map(debt => (
                        <div key={debt.id} className='gold-glass p-4 border-red-500/10 flex justify-between items-center'>
                            <div><p className='text-xs font-black uppercase'>{debt.name}</p><p className='text-[8px] opacity-40'>{debt.phone}</p></div>
                            <div className='text-right'><p className='text-sm text-red-500 font-bold'>{debt.amount.toLocaleString()} UZS</p><p className='text-[8px] opacity-20'>{debt.date}</p></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // --- OTHER RENDERS (Glavniy/Super) copied/adapted ---
    const renderGlavniy = () => (
        <div className='p-4 space-y-6'>
            <button onClick={() => setShowAddSuper(true)} className='btn-gold-minimal py-8 rounded-[2rem]'><UserPlus size={20} /><span>YANGI SUPER ADMIN</span></button>
            <div className='space-y-4'>
                {superAdmins.map(s => (
                    <div key={s.login} className='gold-glass p-4 flex justify-between items-center border-white/5'>
                        <div><p className='text-xs font-black uppercase text-white'>{s.name}</p><p className='text-[8px] opacity-40'>Login: {s.login}</p></div>
                        <button onClick={() => setSuperAdmins(prev => prev.filter(a => a.login !== s.login))} className='text-red-500/30'><Trash2 size={14} /></button>
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
                        <div onPointerDown={handleLongPressStart} onPointerUp={handleLongPressEnd} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl transition-all duration-700 ${hiddenMode ? 'bg-red-500 shadow-red-500/50 scale-110' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20'}`}><Lock size={32} className={hiddenMode ? 'text-white' : 'text-black'} /></div>
                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>{hiddenMode ? 'ROOT' : 'PLS'}</h1>
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
                                <div><h2 className='text-lg font-black italic tracking-tighter uppercase'>{currentAdminData.name || currentRole.toUpperCase()}</h2><p className='text-[8px] font-bold opacity-40 uppercase'>{currentAdminData.club || 'SYSTEM'}</p></div>
                            </div>
                            <button onClick={() => { setView('login'); setHiddenMode(false); }} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20'><X size={20} /></button>
                        </div>

                        <main>{currentRole === 'glavniy' ? renderGlavniy() : currentRole === 'super' ? renderGlavniy() : renderClub()}</main>

                        <div className='fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 flex justify-around z-50'>
                            {currentRole === 'club' ? (
                                <>
                                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[8px] font-black uppercase'>XARITA</span></button>
                                    <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><CreditCard size={20} /><span className='text-[8px] font-black uppercase'>QARZLAR</span></button>
                                </>
                            ) : (
                                <button onClick={() => setActiveTab('asosiy')} className='text-[#ffcf4b] flex flex-col items-center gap-1'><Users size={20} /><span className='text-[8px] font-black uppercase'>KADRLAR</span></button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
                {checkoutRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>HISOBLASH: {checkoutRoom.name}</h2>
                        <div className='gold-glass p-6 text-center mb-6'><p className='text-[10px] opacity-40 uppercase font-black mb-1'>UMUMIY SUMMA</p><p className='text-4xl font-black tracking-tighter'>{calculateSession(checkoutRoom).total.toLocaleString()} UZS</p></div>
                        <div className='space-y-4'>
                            <input type="number" placeholder="TO'LANGAN PUL (UZS)" className='input-luxury-small' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {Number(paidAmount) < calculateSession(checkoutRoom).total && Number(paidAmount) > 0 && (
                                <div className='space-y-4 p-4 bg-red-500/10 rounded-3xl border border-red-500/20'>
                                    <p className='text-[10px] text-red-500 font-black uppercase'>QARZDOR MA'LUMOTI:</p>
                                    <input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small !bg-black/20' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL RAQAMI" className='input-luxury-small !bg-black/20' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                </div>
                            )}
                            <button onClick={handleCheckout} className='btn-gold-minimal'>TUGATISH</button>
                            <button onClick={() => setCheckoutRoom(null)} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {selectedRoomForBar && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content !max-w-md'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>BAR QO'SHISH: {selectedRoomForBar.name}</h2>
                        <div className='grid grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto px-2'>
                            {inventory.map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1, id: Date.now() }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-4 text-left border-white/5 active:scale-95 transition-transform'>
                                    <p className='text-[10px] font-black uppercase mb-1'>{item.name}</p>
                                    <p className='text-xs gold-text font-bold'>{item.price.toLocaleString()} UZS</p>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setSelectedRoomForBar(null)} className='w-full py-6 text-[10px] opacity-30 font-black uppercase tracking-widest'>YOPISH</button>
                    </motion.div></div>
                )}
                {showAddRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>YANGI XONA</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="NOMI" className='input-luxury-small' value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
                            <input type="number" placeholder="NARXI (SOATIGA)" className='input-luxury-small' value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} />
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
