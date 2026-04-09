import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight, BarChart
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
    const [activeTab, setActiveTab] = useState('asosiy');
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [clubAdmins, setClubAdmins] = useState(getInitialState('clubAdmins', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [salesLog, setSalesLog] = useState(getInitialState('salesLog', [])); // Sales history
    const [inventory, setInventory] = useState(getInitialState('inventory', [
        { id: 1, name: 'PEPSI', price: 7000 }, { id: 2, name: 'LAYS', price: 12000 }, { id: 3, name: 'HOTDOG', price: 15000 }
    ]));
    const [now, setNow] = useState(Date.now());
    const [expRooms, setExpRooms] = useState({});

    // Checkout States
    const [checkoutRoom, setCheckoutRoom] = useState(null);
    const [finalStats, setFinalStats] = useState(null);
    const [paidAmount, setPaidAmount] = useState('');
    const [debtUser, setDebtUser] = useState({ name: '', phone: '' });
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [selectedRoomForBar, setSelectedRoomForBar] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '' });

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('rooms', JSON.stringify(rooms));
        localStorage.setItem('debts', JSON.stringify(debts));
        localStorage.setItem('salesLog', JSON.stringify(salesLog));
        localStorage.setItem('view', JSON.stringify(view));
    }, [rooms, debts, salesLog, view]);

    const currentAdminData = useMemo(() => {
        return clubAdmins?.find(a => a?.login === username) || { name: 'ADMIN', club: 'PLS' };
    }, [clubAdmins, username]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const analytics = useMemo(() => {
        const log = salesLog.filter(s => s.club === currentAdminData.club);
        const day = 24 * 60 * 60 * 1000;
        const nowMs = Date.now();

        const daily = log.filter(s => nowMs - s.timestamp < day).reduce((acc, s) => acc + s.amount, 0);
        const weekly = log.filter(s => nowMs - s.timestamp < day * 7).reduce((acc, s) => acc + s.amount, 0);
        const monthly = log.filter(s => nowMs - s.timestamp < day * 30).reduce((acc, s) => acc + s.amount, 0);
        const yearly = log.filter(s => nowMs - s.timestamp < day * 365).reduce((acc, s) => acc + s.amount, 0);

        const totalDebt = debts.filter(d => d.club === currentAdminData.club).reduce((acc, d) => acc + d.amount, 0);

        return {
            daily, weekly, monthly, yearly, totalDebt,
            busy: activeRooms.filter(r => r.isBusy).length,
            free: activeRooms.filter(r => !r.isBusy && !r.isSuspended).length,
            suspended: activeRooms.filter(r => r.isSuspended).length
        };
    }, [salesLog, debts, currentAdminData.club, activeRooms]);

    const calculateSession = (room) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, items: [], itemsPrice: 0 };
        const diff = Math.floor((now - room.startTime) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        const timePrice = (diff / 3600) * Number(room.price || 0);
        const itemsPrice = (room.items || []).reduce((acc, i) => acc + (Number(i.price) * (i.quantity || 1)), 0);
        return {
            time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice),
            items: room.items || [],
            itemsPrice
        };
    };

    const confirmCheckout = () => {
        const total = finalStats.total;
        const paid = Number(paidAmount) || 0;
        const remaining = total - paid;

        // Add to Sales Log (Only paid amount)
        if (paid > 0) {
            setSalesLog(prev => [...prev, { id: Date.now(), amount: paid, timestamp: Date.now(), club: checkoutRoom.club }]);
        }

        if (remaining > 0) {
            setDebts(prev => [...prev, { id: Date.now(), name: debtUser.name || 'Noma\'lum', phone: debtUser.phone || 'Noma\'lum', amount: remaining, date: new Date().toLocaleString(), club: checkoutRoom.club }]);
        }

        setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? { ...r, isBusy: false, startTime: null, items: [], dailyRevenue: (r.dailyRevenue || 0) + paid, barRevenue: (r.barRevenue || 0) + finalStats.itemsPrice } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
    };

    const renderClubAsosiy = () => (
        <div className='p-4 space-y-6 pb-24'>
            {/* Real-time Sales Stats */}
            <div className='gold-glass !p-6 bg-gradient-to-br from-[#ffcf4b]/10 to-transparent border-[#ffcf4b]/20'>
                <div className='flex justify-between items-center mb-6'>
                    <div><p className='text-[8px] font-black opacity-30 uppercase tracking-[4px] mb-1'>BUGUNGI_SAVDO</p><h2 className='text-4xl font-black gold-text italic tracking-tighter tabular-nums'>{analytics.daily.toLocaleString()} <span className='text-xs opacity-50'>UZS</span></h2></div>
                    <div className='p-3 bg-white/5 rounded-2xl text-[#ffcf4b]'><BarChart size={24} /></div>
                </div>

                {/* Advanced Period Stats */}
                <div className='grid grid-cols-1 gap-3 mt-6'>
                    <div className='flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5'>
                        <div className='flex items-center gap-3'><div className='w-2 h-2 rounded-full bg-blue-500'></div><span className='text-[10px] font-black uppercase tracking-widest opacity-60'>Haftalik</span></div>
                        <p className='text-sm font-black italic'>{analytics.weekly.toLocaleString()} UZS</p>
                    </div>
                    <div className='flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5'>
                        <div className='flex items-center gap-3'><div className='w-2 h-2 rounded-full bg-[#ffcf4b]'></div><span className='text-[10px] font-black uppercase tracking-widest opacity-60'>Oylik</span></div>
                        <p className='text-sm font-black italic'>{analytics.monthly.toLocaleString()} UZS</p>
                    </div>
                    <div className='flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5'>
                        <div className='flex items-center gap-3'><div className='w-2 h-2 rounded-full bg-green-500'></div><span className='text-[10px] font-black uppercase tracking-widest opacity-60'>Yillik</span></div>
                        <p className='text-sm font-black italic'>{analytics.yearly.toLocaleString()} UZS</p>
                    </div>
                </div>
            </div>

            {/* Room Counters */}
            <div className='grid grid-cols-3 gap-2'>
                <div className='gold-glass !p-4 border-white/5 text-center'><p className='text-[7px] opacity-40 font-black uppercase mb-1'>BAND</p><p className='text-xl font-black gold-text'>{analytics.busy}</p></div>
                <div className='gold-glass !p-4 border-white/5 text-center'><p className='text-[7px] opacity-40 font-black uppercase mb-1'>BO'SH</p><p className='text-xl font-black'>{analytics.free}</p></div>
                <div className='gold-glass !p-4 border-white/10 text-center bg-red-500/5'><p className='text-[7px] opacity-40 font-black uppercase mb-1'>TEXNIK</p><p className='text-xl font-black text-red-500'>{analytics.suspended}</p></div>
            </div>

            {/* Debts list */}
            <div className='gold-glass !p-5 border-red-500/20 bg-red-500/5'>
                <div className='flex justify-between items-center mb-5'><div className='flex items-center gap-2'><Users size={16} className='text-red-500' /><p className='text-[9px] font-black uppercase tracking-[2px] opacity-70'>QARZLAR RO'YHATIDAN</p></div><p className='text-[10px] font-black text-red-500'>{analytics.totalDebt.toLocaleString()} UZS</p></div>
                <div className='space-y-2 max-h-[200px] overflow-y-auto'>
                    {debts.filter(d => d.club === currentAdminData.club).map(d => (
                        <div key={d.id} className='flex justify-between items-center p-3.5 bg-black/40 rounded-2xl border border-white/5'>
                            <div><p className='text-[9px] font-black uppercase mb-0.5'>{d.name}</p><p className='text-[7px] opacity-30'>{d.date}</p></div>
                            <p className='text-[10px] font-black text-red-500'>-{d.amount.toLocaleString()}</p>
                        </div>
                    ))}
                    {debts.filter(d => d.club === currentAdminData.club).length === 0 && <p className='text-[8px] opacity-20 text-center py-4 uppercase font-black italic'>Hozircha qarzlar mavjud emas</p>}
                </div>
            </div>
        </div>
    );

    const renderClubXarita = () => (
        <div className='p-3 space-y-4 font-sans'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='btn-gold-minimal !py-5 bg-gradient-to-r from-[#ffcf4b] to-[#ffb14b] text-black border-none font-black'><Plus size={18} /> YANGI XONA QO'SHISH</button>
            <div className='grid grid-cols-1 gap-4'>
                {activeRooms?.map(room => {
                    const session = calculateSession(room);
                    const isExp = expRooms[room.id];
                    return (
                        <div key={room.id} className={`gold-glass transition-all duration-300 ${room.isBusy ? ' ring-1 ring-[#ffcf4b]/20 bg-black/40 shadow-2xl' : room.isSuspended ? 'opacity-40 grayscale' : 'opacity-80'}`}>
                            <div className='p-4 border-b border-white/5 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-3 h-3 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse shadow-[0_0_10px_#ffcf4b]' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div>
                                    <div><h3 className='text-xl font-black italic uppercase italic tracking-tighter'>{room.name || 'PC'}</h3><p className='text-[8px] opacity-40 font-black uppercase tracking-widest'>{room.isBusy ? 'ACTIVE' : room.isSuspended ? 'OFFLINE' : 'READY'}</p></div>
                                </div>
                                <div className='flex gap-1.5' onClick={e => e.stopPropagation()}>
                                    {room.isBusy && <button onClick={() => setExpRooms(p => ({ ...p, [room.id]: !isExp }))} className='p-2.5 bg-white/5 rounded-xl text-[#ffcf4b]'>{isExp ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>}
                                    <button onClick={() => setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isSuspended: !r.isSuspended, isBusy: false } : r))} className={`p-2.5 rounded-xl ${room.isSuspended ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/30'}`}><PauseCircle size={18} /></button>
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2.5 bg-white/5 rounded-xl text-white/30'><Edit3 size={18} /></button>
                                    <button onClick={() => { if (window.confirm('O\'chirmoqchimisiz?')) setRooms(prev => prev.filter(r => r.id !== room.id)) }} className='p-2.5 bg-white/5 rounded-xl text-red-500/30'><Trash2 size={18} /></button>
                                </div>
                            </div>
                            {room.isBusy && (
                                <div className={`p-5 bg-gradient-to-b from-[#ffcf4b]/5 to-transparent transition-all ${isExp ? 'space-y-5' : 'flex justify-between items-center'}`}>
                                    <div className='flex flex-col'><p className='text-[8px] font-black opacity-30 uppercase tracking-widest mb-0.5 text-center'>VAQT</p><p className={`${isExp ? 'text-4xl' : 'text-xl'} font-black tabular-nums gold-text italic tracking-tighter`}>{session.time}</p></div>
                                    <div className={`flex flex-col ${isExp ? '' : 'text-right'}`}><p className='text-[8px] font-black opacity-30 uppercase tracking-widest mb-0.5'>SUMMA</p><p className={`${isExp ? 'text-2xl' : 'text-xl'} font-black tabular-nums`}>{session.total.toLocaleString()} <span className='text-[9px] opacity-30'>UZS</span></p></div>
                                    {isExp && (
                                        <div className='pt-6 border-t border-white/5 space-y-6'>
                                            <div className='flex justify-between items-center'><p className='text-[9px] font-black opacity-40 uppercase'>BAR_MAHSULOTLAR</p><button onClick={() => setSelectedRoomForBar(room)} className='bg-[#ffcf4b] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg shadow-[#ffcf4b]/20 active:scale-95 transition-all'>+ BAR</button></div>
                                            <div className='flex flex-wrap gap-1.5'>{session.items.map((i, idx) => (<div key={idx} className='text-[8px] font-black uppercase bg-white/10 px-3 py-2 rounded-xl border border-white/5'>{i.name} x{i.quantity}</div>))}</div>
                                            <button onClick={() => { setFinalStats(session); setCheckoutRoom(room); }} className='w-full py-5 bg-red-500 rounded-[1.7rem] text-white font-black uppercase italic text-xs shadow-2xl shadow-red-500/40 active:scale-95 transition-all'>STOP VA HISOBLASH</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!room.isBusy && !room.isSuspended && (<div className='px-4 pb-4 pt-2'><button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-4 bg-white/5 rounded-2xl text-white font-black uppercase text-xs border border-white/10 active:scale-95 transition-all'>START SESSION <Play size={12} className='inline ml-1.5' /></button></div>)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg pb-32 font-sans'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <div className='w-20 h-20 rounded-[2.5rem] bg-[#ffcf4b] flex items-center justify-center mb-12 shadow-2xl shadow-[#ffcf4b]/20'><Lock size={32} className='text-black' /></div>
                        <h1 className='text-5xl font-black italic mb-2 tracking-tighter uppercase italic'>PLS</h1>
                        <p className='text-[9px] opacity-30 font-black tracking-[8px] mb-12 uppercase'>MANAGEMENT_SYSTEM</p>
                        <div className='w-full max-w-[300px] space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small h-16 !bg-white/5' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <button onClick={() => setView('clubDashboard')} className='btn-gold-minimal mt-8 py-5 !rounded-[2rem] text-lg font-black'>TIZIMGA KIRISH</button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='px-6 py-5 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'><div className='w-11 h-11 rounded-2xl bg-[#ffcf4b] flex items-center justify-center shadow-lg shadow-[#ffcf4b]/20'><Activity size={24} className='text-black' /></div><div><h2 className='text-lg font-black italic uppercase tracking-tighter'>{currentAdminData?.name}</h2><p className='text-[8px] font-black opacity-30 uppercase tracking-[3px]'>{currentAdminData?.club}</p></div></div>
                            <button onClick={() => setView('login')} className='w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-white/20'><X size={24} /></button>
                        </div>
                        <main>{activeTab === 'asosiy' ? renderClubAsosiy() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-5 left-5 right-5 bg-white/5 backdrop-blur-3xl border border-white/10 p-5 rounded-[2.5rem] flex justify-around z-50 shadow-2xl'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'asosiy' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><BarChart size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>ASOSIY</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'xarita' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><Monitor size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>XARITA</span></button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {checkoutRoom && finalStats && (
                    <div className='modal-overlay'><motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className='modal-content !p-8 border border-white/5'>
                        <h2 className='text-3xl font-black italic gold-text text-center mb-12 tracking-widest'>CHECKOUT</h2>
                        <div className='gold-glass p-8 text-center mb-10 bg-[#ffcf4b]/5 border-[#ffcf4b]/20'>
                            <p className='text-[9px] opacity-40 uppercase font-black tracking-[4px] mb-2'>UMUMIY SUMMA</p>
                            <p className='text-5xl font-black italic tracking-tighter tabular-nums'>{finalStats.total.toLocaleString()} <span className='text-lg'>UZS</span></p>
                        </div>
                        <div className='space-y-4'>
                            <input type="number" placeholder="OLINGAN PUL" className='input-luxury-small h-20 text-3xl font-black text-center' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {finalStats.total - (Number(paidAmount) || 0) > 0 && Number(paidAmount) > 0 && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className='space-y-4 p-6 bg-red-500/10 rounded-3xl border border-red-500/20'>
                                    <input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small !bg-black/80 h-14' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL RAQAMI" className='input-luxury-small !bg-black/80 h-14' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                </motion.div>
                            )}
                            <button onClick={confirmCheckout} className='btn-gold-minimal !py-8 !rounded-[2.5rem] text-xl font-black shadow-[0_20px_40px_rgba(255,207,75,0.2)]'>HISOBLASHNI YOPISH</button>
                            <button onClick={() => { setCheckoutRoom(null); setFinalStats(null); }} className='w-full py-4 text-[10px] opacity-20 font-black uppercase tracking-widest'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {selectedRoomForBar && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content !max-w-md'>
                        <div className='flex justify-between items-center mb-10'><h2 className='text-2xl font-black italic gold-text tracking-tighter'>BARDAN TANLASH</h2><button onClick={() => setSelectedRoomForBar(null)} className='p-3 bg-white/5 rounded-full'><X size={24} /></button></div>
                        <div className='grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2'>
                            {inventory.map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-6 text-left border-white/5 hover:bg-white/5 disabled:opacity-20 transition-all'>
                                    <p className='text-[10px] font-black uppercase mb-1 opacity-50'>{item.name}</p>
                                    <p className='text-xl font-black gold-text'>{item.price.toLocaleString()} <span className='text-xs'>UZS</span></p>
                                </button>
                            ))}
                        </div>
                    </motion.div></div>
                )}
                {showAddRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='modal-content'>
                        <h2 className='text-2xl font-black italic gold-text mb-12 uppercase tracking-tighter text-center'>SOZLAMALAR</h2>
                        <div className='space-y-6'>
                            <input type="text" placeholder="XONA_NOMI" className='input-luxury-small h-16' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} />
                            <input type="number" placeholder="SOATIGA_SUMMA" className='input-luxury-small h-16 text-2xl font-black' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: e.target.value }) : setNewRoom({ ...newRoom, price: e.target.value })} />
                            <button onClick={() => {
                                if (editingRoom) setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
                                else setRooms(prev => [...prev, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, isSuspended: false, dailyRevenue: 0, barRevenue: 0 }]);
                                setShowAddRoom(false); setEditingRoom(null);
                            }} className='btn-gold-minimal !py-6 !rounded-[2.5rem]'>SAQLASH</button>
                        </div>
                    </motion.div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
