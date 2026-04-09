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
        const BOT_URL = 'https://pls-taupe.vercel.app/?v=v56';
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

    // --- CALCULATIONS ---
    const currentAdminData = clubAdmins.find(a => a.login === username) || superAdmins.find(s => s.login === username) || { name: 'ROOT' };
    const clubRooms = rooms.filter(r => r.club === currentAdminData.club);

    const stats = useMemo(() => {
        const busy = clubRooms.filter(r => r.isBusy).length;
        const totalRooms = clubRooms.length;
        const free = totalRooms - busy - clubRooms.filter(r => r.isSuspended).length;

        const roomRevenue = clubRooms.reduce((acc, r) => acc + (r.dailyRevenue || 0), 0);
        const barRevenue = clubRooms.reduce((acc, r) => acc + (r.barRevenue || 0), 0);
        const totalDaily = roomRevenue + barRevenue;

        return {
            busy, free, totalRooms, suspended: clubRooms.filter(r => r.isSuspended).length,
            roomRevenue, barRevenue, totalDaily,
            weekly: totalDaily * 7,
            monthly: totalDaily * 30
        };
    }, [clubRooms]);

    const calculateSession = (room) => {
        if (!room.startTime) return { time: '00:00:00', total: 0, itemsPrice: 0 };
        const diff = Math.floor((now - room.startTime) / 1000);
        const hours = Math.floor(diff / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        const secs = diff % 60;

        const timePrice = (diff / 3600) * Number(room.price);
        const itemsPrice = (room.items || []).reduce((acc, item) => acc + (item.price * item.quantity), 0);

        return {
            time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice),
            itemsPrice
        };
    };

    // --- ACTIONS ---
    const startSession = (roomId) => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, isBusy: true, isSuspended: false, startTime: Date.now(), items: [] } : r));
    };

    const toggleSuspend = (roomId) => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, isSuspended: !r.isSuspended, isBusy: false } : r));
    };

    const handleCheckout = () => {
        const sessionStats = calculateSession(checkoutRoom);
        const total = sessionStats.total;
        const paid = Number(paidAmount) || 0;
        const remaining = total - paid;

        if (remaining > 0) {
            setDebts(prev => [...prev, { id: Date.now(), name: debtUser.name || 'Noma\'lum', phone: debtUser.phone || 'Noma\'lum', amount: remaining, date: new Date().toLocaleDateString(), club: checkoutRoom.club }]);
        }

        setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? {
            ...r, isBusy: false, startTime: null, items: [],
            dailyRevenue: (r.dailyRevenue || 0) + (total - sessionStats.itemsPrice),
            barRevenue: (r.barRevenue || 0) + sessionStats.itemsPrice
        } : r));
        setCheckoutRoom(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
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

    // --- RENDER SECTIONS ---
    const renderClubAsosiy = () => (
        <div className='p-4 space-y-6'>
            {/* Room Status Hero */}
            <div className='grid grid-cols-3 gap-3'>
                <div className='gold-glass p-4 text-center border-white/5'>
                    <p className='text-[8px] font-black opacity-30 uppercase'>XONALAR</p>
                    <p className='text-xl font-black italic gold-text'>{stats.totalRooms}</p>
                </div>
                <div className='gold-glass p-4 text-center bg-[#ffcf4b]/5 border-[#ffcf4b]/20'>
                    <p className='text-[8px] font-black text-[#ffcf4b] uppercase'>BAND</p>
                    <p className='text-xl font-black italic text-[#ffcf4b]'>{stats.busy}</p>
                </div>
                <div className='gold-glass p-4 text-center border-white/5'>
                    <p className='text-[8px] font-black opacity-30 uppercase'>BO'SH</p>
                    <p className='text-xl font-black italic opacity-50'>{stats.free}</p>
                </div>
            </div>

            {/* Revenue Analytics */}
            <div className='space-y-4'>
                <p className='text-[10px] font-black opacity-30 tracking-[4px] uppercase ml-2'>DAROMAD_TAHLILI</p>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='gold-glass p-5 border-white/5 relative overflow-hidden'>
                        <div className='absolute -right-2 -top-2 opacity-5'><Monitor size={64} /></div>
                        <p className='text-[8px] font-black opacity-40 uppercase'>XONALARDAN</p>
                        <p className='text-lg font-black'>{(stats.roomRevenue).toLocaleString()} <span className='text-[8px] opacity-30 uppercase'>uzs</span></p>
                    </div>
                    <div className='gold-glass p-5 border-white/5 relative overflow-hidden'>
                        <div className='absolute -right-2 -top-2 opacity-5'><Coffee size={64} /></div>
                        <p className='text-[8px] font-black opacity-40 uppercase'>BARDAN</p>
                        <p className='text-lg font-black'>{(stats.barRevenue).toLocaleString()} <span className='text-[8px] opacity-30 uppercase'>uzs</span></p>
                    </div>
                </div>

                <div className='gold-glass p-6 border-[#ffcf4b]/10 bg-gradient-to-br from-[#ffcf4b]/5 to-transparent'>
                    <div className='flex justify-between items-center mb-6'>
                        <div><p className='text-[10px] font-black opacity-40 uppercase'>KUNLIK_JAMI</p>
                            <p className='text-3xl font-black gold-text italic tracking-tighter'>{(stats.totalDaily).toLocaleString()} UZS</p></div>
                        <TrendingUp className='text-[#ffcf4b]' />
                    </div>
                    <div className='grid grid-cols-2 gap-6 pt-4 border-t border-white/5'>
                        <div><p className='text-[8px] opacity-30 uppercase font-black'>HAFTALIK (EHTIMOLIY)</p><p className='font-black'>{(stats.weekly).toLocaleString()} UZS</p></div>
                        <div><p className='text-[8px] opacity-30 uppercase font-black'>OYLIK (EHTIMOLIY)</p><p className='font-black'>{(stats.monthly).toLocaleString()} UZS</p></div>
                    </div>
                </div>
            </div>

            <div className='gold-glass p-6 border-white/5 flex items-center gap-4'>
                <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
                <p className='text-[10px] font-black opacity-40 uppercase tracking-widest italic'>TIZIM_BARQAROR_ISHLA MOQDA</p>
            </div>
        </div>
    );

    const renderClubXarita = () => (
        <div className='p-4 space-y-6'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='btn-gold-minimal'><Plus size={18} /><span>YANGI XONA QO'SHISH</span></button>

            <div className='grid grid-cols-1 gap-4'>
                {clubRooms.map(room => {
                    const session = calculateSession(room);
                    return (
                        <div key={room.id} className={`room-card-premium transition-all duration-500 ${room.isBusy ? 'ring-2 ring-[#ffcf4b]/30' : room.isSuspended ? 'opacity-50 grayscale' : ''}`}>
                            <div className='flex justify-between items-start mb-4'>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-3 h-3 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse shadow-[0_0_10px_#ffcf4b]' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div>
                                    <div><h3 className='text-2xl font-black italic uppercase'>{room.name}</h3><p className='text-[9px] opacity-40 font-bold'>{room.price} UZS / SOAT</p></div>
                                </div>
                                <div className='flex gap-2'>
                                    <button onClick={() => toggleSuspend(room.id)} className={`p-2 rounded-xl transition-colors ${room.isSuspended ? 'bg-red-500 text-white' : 'bg-white/5 text-white/20'}`}><PauseCircle size={16} /></button>
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2 bg-white/5 rounded-xl text-white/20'><Edit3 size={16} /></button>
                                    <button onClick={() => setRooms(prev => prev.filter(r => r.id !== room.id))} className='p-2 bg-white/5 rounded-xl text-red-500/20'><Trash2 size={16} /></button>
                                </div>
                            </div>

                            {room.isBusy ? (
                                <div className='mt-6 pt-6 border-t border-white/5 flex justify-between items-end'>
                                    <div><p className='text-[10px] opacity-30 font-black uppercase mb-1'>CLUB_TIMER</p><p className='text-3xl font-black italic tracking-tighter gold-text'>{session.time}</p></div>
                                    <div className='text-right'>
                                        <button onClick={() => setSelectedRoomForBar(room)} className='flex items-center gap-1 text-[8px] font-black uppercase bg-white/5 px-2 py-1 rounded ml-auto mb-2'><ShoppingCart size={10} /> Bar</button>
                                        <p className='text-[10px] opacity-30 font-black uppercase mb-1'>HISOBLANDI</p><p className='text-xl font-black tabular-nums'>{(session.total).toLocaleString()} UZS</p>
                                        <button onClick={() => setCheckoutRoom(room)} className='mt-2 p-2 bg-red-500 rounded-xl text-white w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase'>STOP <Square size={12} /></button>
                                    </div>
                                </div>
                            ) : room.isSuspended ? (
                                <div className='mt-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-center'><p className='text-[10px] font-black text-red-500 uppercase tracking-widest'>TEXNIK_NOSOZLIK / TO'XTATILGAN</p></div>
                            ) : (
                                <button onClick={() => startSession(room.id)} className='mt-6 w-full py-4 bg-[#ffcf4b] rounded-2xl text-black font-black uppercase italic italic flex items-center justify-center gap-2 shadow-lg shadow-[#ffcf4b]/20'>VAQTNI_BOSHLASH <Play size={16} /></button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div onPointerDown={handleLongPressStart} onPointerUp={handleLongPressEnd} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl transition-all duration-700 ${hiddenMode ? 'bg-red-500 shadow-red-500/50 scale-110' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20'}`}><Lock size={32} className={hiddenMode ? 'text-white' : 'text-black'} /></div>
                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>PLS</h1>
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
                                <div><h2 className='text-lg font-black italic tracking-tighter uppercase'>{currentAdminData.name || currentRole.toUpperCase()}</h2><p className='text-[8px] font-bold opacity-40 uppercase tracking-widest'>{currentAdminData.club || 'SYSTEM'}</p></div>
                            </div>
                            <button onClick={() => { setView('login'); setHiddenMode(false); }} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20'><X size={20} /></button>
                        </div>

                        {/* Club Admin Tabs */}
                        <main>
                            {currentRole === 'club' ? (
                                activeTab === 'asosiy' ? renderClubAsosiy() : renderClubXarita()
                            ) : (
                                <div className='p-8 text-center opacity-30 italic uppercase'>Glavniy Admin uchun xizmat ko'rsatuvchi xodimlar paneli...</div>
                            )}
                        </main>

                        {/* Navigation */}
                        <div className='fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 flex justify-around z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]'>
                            {[
                                { id: 'asosiy', icon: Activity, label: 'ASOSIY' },
                                { id: 'xarita', icon: Monitor, label: 'XARITA' }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}>
                                    <tab.icon size={20} />
                                    <span className='text-[8px] font-black tracking-widest'>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
                {showAddRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-xl font-black italic uppercase mb-8 gold-text'>{editingRoom ? 'XONANI TAHRIRLASH' : 'YANGI XONA QOʻSHISH'}</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="XONA NOMI (Masalan: VIP_1)" className='input-luxury-small' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} />
                            <input type="number" placeholder="NARXI (SOATIGA)" className='input-luxury-small' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: e.target.value }) : setNewRoom({ ...newRoom, price: e.target.value })} />
                            <button onClick={() => {
                                if (editingRoom) setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
                                else setRooms(prev => [...prev, { ...newRoom, id: Date.now(), isBusy: false, isSuspended: false, dailyRevenue: 0, barRevenue: 0, club: currentAdminData.club }]);
                                setShowAddRoom(false); setEditingRoom(null);
                            }} className='btn-gold-minimal'>SAQLASH</button>
                            <button onClick={() => { setShowAddRoom(false); setEditingRoom(null); }} className='w-full py-4 text-[10px] opacity-30 font-black uppercase tracking-widest'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {checkoutRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-3xl font-black italic uppercase mb-8 gold-text text-center'>TO'LOV: {checkoutRoom.name}</h2>
                        <div className='gold-glass p-8 text-center mb-8 border-[#ffcf4b]/20 bg-[#ffcf4b]/5'>
                            <p className='text-[10px] opacity-40 uppercase font-black mb-2'>UMUMIY_HISOB</p>
                            <p className='text-5xl font-black italic tracking-tighter'>{(calculateSession(checkoutRoom).total).toLocaleString()} <span className='text-xs'>UZS</span></p>
                        </div>
                        <div className='space-y-4'>
                            <input type="number" placeholder="TO'LANGAN_SUMMA" className='input-luxury-small' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {Number(paidAmount) < calculateSession(checkoutRoom).total && Number(paidAmount) > 0 && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className='space-y-4 p-5 bg-red-500/10 rounded-3xl border border-red-500/20'>
                                    <p className='text-[10px] text-red-500 font-black uppercase tracking-widest flex items-center gap-2'><AlertTriangle size={14} /> QARZ_MA'LUMOTLARI:</p>
                                    <input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small !bg-black/40' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL RAQAMI" className='input-luxury-small !bg-black/40' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                </motion.div>
                            )}
                            <button onClick={handleCheckout} className='btn-gold-minimal py-6 !rounded-[2rem]'>HISOBLASHNI_TASDIQLASH</button>
                            <button onClick={() => setCheckoutRoom(null)} className='w-full py-4 text-[10px] opacity-20 font-black uppercase'>YOPISH</button>
                        </div>
                    </motion.div></div>
                )}
                {selectedRoomForBar && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content !max-w-md'>
                        <div className='flex justify-between items-center mb-8'><h2 className='text-xl font-black italic uppercase gold-text'>BAR_MAHSULOTLARI</h2><button onClick={() => setSelectedRoomForBar(null)} className='p-2 bg-white/5 rounded-full'><X size={20} /></button></div>
                        <div className='grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto px-1'>
                            {inventory.map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1, id: Date.now() }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-5 text-left border-white/5 active:scale-95 transition-all hover:bg-white/5'>
                                    <p className='text-[10px] font-black uppercase mb-1 opacity-70'>{item.name}</p>
                                    <p className='text-md font-black gold-text'>{(item.price).toLocaleString()} UZS</p>
                                </button>
                            ))}
                        </div>
                    </motion.div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
