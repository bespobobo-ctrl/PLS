import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
};

const App = () => {
    const [view, setView] = useState(getInitialState('view', 'login'));
    const [username, setUsername] = useState(getInitialState('username', ''));
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('asosiy');
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [clubAdmins, setClubAdmins] = useState(getInitialState('clubAdmins', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [hiddenMode, setHiddenMode] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [expRooms, setExpRooms] = useState({});

    // Checkout States
    const [checkoutRoom, setCheckoutRoom] = useState(null);
    const [finalStats, setFinalStats] = useState(null); // Frozen stats
    const [paidAmount, setPaidAmount] = useState('');
    const [debtUser, setDebtUser] = useState({ name: '', phone: '' });

    // Modals
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [selectedRoomForBar, setSelectedRoomForBar] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '' });
    const longPressTimer = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('rooms', JSON.stringify(rooms));
        localStorage.setItem('debts', JSON.stringify(debts));
        localStorage.setItem('view', JSON.stringify(view));
    }, [rooms, debts, view]);

    const currentAdminData = useMemo(() => {
        return clubAdmins?.find(a => a?.login === username) || { name: 'ADMIN', club: 'PLS' };
    }, [clubAdmins, username]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const calculateSession = (room) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, items: [], itemsPrice: 0 };
        const diff = Math.floor((now - room.startTime) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        const timePrice = (diff / 3600) * Number(room.price || 0);
        const items = room.items || [];
        const itemsPrice = items.reduce((acc, i) => acc + (Number(i.price) * (i.quantity || 1)), 0);
        return {
            time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice),
            items,
            itemsPrice
        };
    };

    const handleStopClick = (room) => {
        const stats = calculateSession(room);
        setFinalStats(stats);
        setCheckoutRoom(room);
    };

    const confirmCheckout = () => {
        const total = finalStats.total;
        const paid = Number(paidAmount) || 0;
        const remaining = total - paid;

        if (remaining > 0) {
            setDebts(prev => [...prev, {
                id: Date.now(),
                name: debtUser.name || 'Ismsiz mijoz',
                phone: debtUser.phone || 'Tel kiritilmagn',
                amount: remaining,
                date: new Date().toLocaleString(),
                club: checkoutRoom.club
            }]);
        }

        setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? {
            ...r, isBusy: false, startTime: null, items: [],
            dailyRevenue: (r.dailyRevenue || 0) + paid,
            barRevenue: (r.barRevenue || 0) + finalStats.itemsPrice
        } : r));

        setCheckoutRoom(null);
        setFinalStats(null);
        setPaidAmount('');
        setDebtUser({ name: '', phone: '' });
    };

    const renderClubXarita = () => (
        <div className='p-3 space-y-4 font-sans'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='btn-gold-minimal !py-4'><Plus size={16} /><span>YANGI XONA</span></button>
            <div className='grid grid-cols-1 gap-4'>
                {activeRooms?.map(room => {
                    const session = calculateSession(room);
                    const isExp = expRooms[room.id];
                    return (
                        <div key={room.id} className={`gold-glass overflow-hidden border-white/5 ${room.isBusy ? ' ring-1 ring-[#ffcf4b]/10 bg-black/40' : 'opacity-60'}`}>
                            <div className='p-4 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-2 h-2 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse shadow-[0_0_8px_#ffcf4b]' : 'bg-white/5'}`}></div>
                                    <div><h3 className='text-xl font-black italic uppercase tracking-tighter'>{room.name || 'PC'}</h3><p className='text-[8px] opacity-40 font-black uppercase'>{room.isBusy ? 'ACTIVE' : 'READY'}</p></div>
                                </div>
                                <div className='flex gap-2' onClick={e => e.stopPropagation()}>
                                    {room.isBusy && <button onClick={() => setExpRooms(p => ({ ...p, [room.id]: !isExp }))} className='p-2 bg-white/5 rounded-xl text-[#ffcf4b]'>{isExp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>}
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2 bg-white/5 rounded-xl text-white/20'><Edit3 size={14} /></button>
                                </div>
                            </div>

                            {room.isBusy && (
                                <div className={`border-t border-white/5 transition-all bg-[#ffcf4b]/5 p-4 ${isExp ? 'space-y-4' : 'flex justify-between items-center'}`}>
                                    <div className='flex flex-col'>
                                        <p className='text-[8px] font-black opacity-30 uppercase'>O'YIN_VAQTI</p>
                                        <p className={`${isExp ? 'text-4xl' : 'text-lg'} font-black tabular-nums gold-text italic tracking-tighter`}>{session.time}</p>
                                    </div>
                                    <div className={`flex flex-col ${isExp ? '' : 'text-right'}`}>
                                        <p className='text-[8px] font-black opacity-30 uppercase'>HISOBLANDI</p>
                                        <p className={`${isExp ? 'text-2xl' : 'text-lg'} font-black tabular-nums`}>{session.total.toLocaleString()} <span className='text-[8px] opacity-40'>UZS</span></p>
                                    </div>
                                    {isExp && (
                                        <div className='pt-4 space-y-4 border-t border-white/5'>
                                            <div className='flex justify-between items-center'><p className='text-[8px] font-black opacity-50 uppercase'>BAR MAHSULOTLARI</p><button onClick={() => setSelectedRoomForBar(room)} className='text-[8px] font-black uppercase bg-[#ffcf4b] text-black px-4 py-1.5 rounded-full hover:scale-105 transition-transform'>+ BAR</button></div>
                                            <div className='flex flex-wrap gap-1.5'>{session.items.map((i, idx) => (<div key={idx} className='text-[8px] font-black uppercase bg-white/10 px-3 py-1.5 rounded-xl border border-white/5'>{i.name} x{i.quantity}</div>))}</div>
                                            <button onClick={() => handleStopClick(room)} className='w-full py-4 bg-red-500 rounded-2xl text-white font-black uppercase italic text-xs shadow-xl shadow-red-500/20 active:scale-95 transition-all'>STOP VA HISOBLASH</button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!room.isBusy && (
                                <div className='px-4 pb-4'><button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-3.5 bg-white/5 rounded-2xl text-white font-black uppercase text-xs border border-white/5 hover:bg-[#ffcf4b] hover:text-black transition-all'>START SESSION <Play size={12} className='inline ml-1' /></button></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg pb-28 selection:bg-[#ffcf4b] selection:text-black'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div onPointerDown={() => { longPressTimer.current = setTimeout(() => setHiddenMode(true), 2000); }} onPointerUp={() => clearTimeout(longPressTimer.current)} className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 transition-all ${hiddenMode ? 'bg-red-500' : 'bg-[#ffcf4b]'}`}><Lock size={28} className='text-black' /></div>
                        <h1 className='text-4xl font-black italic mb-12 tracking-tighter'>PLS</h1>
                        <div className='w-full max-w-[280px] space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small h-14 !bg-white/5' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small h-14 !bg-white/5' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={() => setView('clubDashboard')} className='btn-gold-minimal mt-6 py-4'>KIRISH</button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='p-6 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-3'><div className='w-10 h-10 rounded-xl bg-[#ffcf4b] flex items-center justify-center'><Activity size={20} className='text-black' /></div><div><h2 className='text-sm font-black italic uppercase'>{currentAdminData?.name}</h2><p className='text-[8px] font-black opacity-30 uppercase'>{currentAdminData?.club}</p></div></div>
                            <button onClick={() => setView('login')} className='p-2 bg-white/5 rounded-xl text-white/20'><X size={20} /></button>
                        </div>
                        <main>{activeTab === 'asosiy' ? <div className='p-12 text-center'><div className='gold-glass p-8 opacity-20 italic font-black text-xl uppercase tracking-widest'>REPORTS_V61</div></div> : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-4 left-4 right-4 bg-white/5 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl flex justify-around z-50'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><BarChart3 size={20} /><span className='text-[8px] font-black uppercase'>STATS</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1.5 ${activeTab === 'xarita' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[8px] font-black uppercase'>DEVICES</span></button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {checkoutRoom && finalStats && (
                    <div className='modal-overlay'><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className='modal-content !p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5'>
                        <h2 className='text-2xl font-black italic gold-text text-center mb-10 tracking-widest'>HISOBLASH</h2>
                        <div className='gold-glass p-8 text-center mb-8 bg-[#ffcf4b]/5 border-[#ffcf4b]/20'>
                            <p className='text-[10px] opacity-40 uppercase font-black tracking-widest mb-2'>TO'LANADIGAN SUMMA</p>
                            <p className='text-4xl font-black tabular-nums'>{finalStats.total.toLocaleString()} <span className='text-xs'>UZS</span></p>
                            <p className='text-[9px] opacity-30 mt-2 uppercase font-black'>Vaqt: {finalStats.time}</p>
                        </div>
                        <div className='space-y-4'>
                            <input type="number" placeholder="OLINGAN PUL" className='input-luxury-small h-16 text-2xl font-black text-center' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {finalStats.total - (Number(paidAmount) || 0) > 0 && (
                                <div className='space-y-4 p-5 bg-red-500/10 rounded-3xl border border-red-500/20'>
                                    <p className='text-[10px] text-red-500 font-black uppercase tracking-widest text-center'>QARZNI RASMIYLASHTIRISH</p>
                                    <input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small !bg-black/40 h-14' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL RAQAMI" className='input-luxury-small !bg-black/40 h-14' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                    <p className='text-[9px] text-white/30 text-center font-black'>Qarz summasi: {(finalStats.total - Number(paidAmount)).toLocaleString()} UZS</p>
                                </div>
                            )}
                            <button onClick={confirmCheckout} className='btn-gold-minimal !py-6 !rounded-2xl text-lg font-black'>NATIJANI SAQLASH</button>
                            <button onClick={() => { setCheckoutRoom(null); setFinalStats(null); }} className='w-full py-4 text-[10px] opacity-20 font-black uppercase'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}

                {selectedRoomForBar && (
                    <div className='modal-overlay'><div className='modal-content !max-w-md'>
                        <div className='flex justify-between items-center mb-8'><h2 className='text-xl font-black italic gold-text'>BARDAN TANLASH</h2><button onClick={() => setSelectedRoomForBar(null)} className='p-2 bg-white/5 rounded-full'><X size={20} /></button></div>
                        <div className='grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto px-1'>
                            {[{ id: 1, name: 'PEPSI', price: 7000 }, { id: 2, name: 'LAYS', price: 12000 }, { id: 3, name: 'HOTDOG', price: 15000 }, { id: 4, name: 'COFEE', price: 10000 }].map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-5 text-left border-white/5 active:scale-95 transition-all'>
                                    <p className='text-[10px] font-black uppercase mb-1 opacity-50'>{item.name}</p>
                                    <p className='text-md font-black gold-text'>{item.price.toLocaleString()} <span className='text-[9px]'>UZS</span></p>
                                </button>
                            ))}
                        </div>
                    </div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
