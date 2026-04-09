import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight, BarChart, Boxes, LayoutGrid
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
    const [barSubTab, setBarSubTab] = useState('sotuv');
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [clubAdmins, setClubAdmins] = useState(getInitialState('clubAdmins', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [salesLog, setSalesLog] = useState(getInitialState('salesLog', []));
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [now, setNow] = useState(Date.now());
    const [expRooms, setExpRooms] = useState({});

    // Modals
    const [checkoutRoom, setCheckoutRoom] = useState(null);
    const [finalStats, setFinalStats] = useState(null);
    const [paidAmount, setPaidAmount] = useState('');
    const [debtUser, setDebtUser] = useState({ name: '', phone: '' });
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [selectedRoomForBar, setSelectedRoomForBar] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '' });
    const [newItem, setNewItem] = useState({ name: '', price: '', stock: '', category: 'Ichimlik' });

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('rooms', JSON.stringify(rooms || []));
        localStorage.setItem('debts', JSON.stringify(debts || []));
        localStorage.setItem('salesLog', JSON.stringify(salesLog || []));
        localStorage.setItem('inventory', JSON.stringify(inventory || []));
        localStorage.setItem('view', JSON.stringify(view));
    }, [rooms, debts, salesLog, inventory, view]);

    const currentAdminData = useMemo(() => {
        return (clubAdmins || []).find(a => a?.login === username) || { name: 'ADMIN', club: 'PLS' };
    }, [clubAdmins, username]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const calculateSession = (room) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, items: [], itemsPrice: 0 };
        try {
            const diff = Math.floor((now - room.startTime) / 1000);
            const timePrice = (diff / 3600) * Number(room.price || 0);
            const itemsPrice = (room.items || []).reduce((acc, i) => acc + (Number(i.price || 0) * (i.quantity || 1)), 0);
            return {
                time: `${Math.floor(diff / 3600).toString().padStart(2, '0')}:${Math.floor((diff % 3600) / 60).toString().padStart(2, '0')}:${(diff % 60).toString().padStart(2, '0')}`,
                total: Math.max(0, Math.round(timePrice + itemsPrice)),
                items: room.items || [],
                itemsPrice
            };
        } catch { return { time: '00:00:00', total: 0, items: [], itemsPrice: 0 }; }
    };

    const analytics = useMemo(() => {
        try {
            const log = salesLog || [];
            const clubLog = log.filter(s => s?.club === currentAdminData?.club);
            const dayMs = 24 * 60 * 60 * 1000;
            const nowMs = Date.now();

            const completedDaily = clubLog.filter(s => (nowMs - (s?.timestamp || 0)) < dayMs).reduce((acc, s) => acc + (s?.amount || 0), 0);
            const runningRevenue = (activeRooms || []).filter(r => r?.isBusy).reduce((acc, r) => acc + calculateSession(r).total, 0);

            const daily = completedDaily + runningRevenue;
            const weekly = clubLog.filter(s => (nowMs - (s?.timestamp || 0)) < dayMs * 7).reduce((acc, s) => acc + (s?.amount || 0), 0) + runningRevenue;
            const monthly = clubLog.filter(s => (nowMs - (s?.timestamp || 0)) < dayMs * 30).reduce((acc, s) => acc + (s?.amount || 0), 0) + runningRevenue;
            const totalDebt = (debts || []).filter(d => d?.club === currentAdminData?.club).reduce((acc, d) => acc + (d?.amount || 0), 0);

            return {
                daily, weekly, monthly, runningRevenue, totalDebt,
                busy: activeRooms.filter(r => r?.isBusy).length,
                free: activeRooms.filter(r => !r?.isBusy && !r?.isSuspended).length,
                suspended: activeRooms.filter(r => r?.isSuspended).length
            };
        } catch { return { daily: 0, weekly: 0, monthly: 0, runningRevenue: 0, totalDebt: 0, busy: 0, free: 0, suspended: 0 }; }
    }, [salesLog, debts, currentAdminData?.club, activeRooms, now]);

    const confirmCheckout = () => {
        const stats = finalStats; const paid = Number(paidAmount) || 0;
        if (paid > 0) setSalesLog(p => [...(p || []), { id: Date.now(), amount: paid, timestamp: Date.now(), club: checkoutRoom?.club }]);
        if ((stats?.total || 0) - paid > 0) setDebts(p => [...(p || []), { id: Date.now(), name: debtUser.name || 'Mijoz', phone: debtUser.phone || '', amount: stats.total - paid, date: new Date().toLocaleString(), club: checkoutRoom?.club }]);
        setRooms(prev => (prev || []).map(r => r.id === checkoutRoom?.id ? { ...r, isBusy: false, startTime: null, items: [] } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount('');
    };

    const renderClubAsosiy = () => (
        <div className='p-4 space-y-6 pb-28 font-sans'>
            {/* Live Kassa */}
            <div className='gold-glass !p-8 bg-gradient-to-br from-[#ffcf4b]/15 to-transparent border-[#ffcf4b]/20'>
                <div className='flex items-center gap-2 mb-2'><span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></span><p className='text-[10px] font-black opacity-30 uppercase tracking-[4px]'>KASSA_LIVE</p></div>
                <h2 className='text-5xl font-black italic gold-text tracking-tighter tabular-nums mb-4'>{analytics.daily.toLocaleString()} <span className='text-sm opacity-40'>UZS</span></h2>
                <div className='flex gap-2'>
                    <div className='bg-white/5 px-4 py-2 rounded-xl flex-1 text-center'><p className='text-[8px] opacity-30 font-black uppercase mb-1'>Haftalik</p><p className='text-xs font-black italic'>{analytics.weekly.toLocaleString()}</p></div>
                    <div className='bg-white/5 px-4 py-2 rounded-xl flex-1 text-center'><p className='text-[8px] opacity-30 font-black uppercase mb-1'>Oylik</p><p className='text-xs font-black italic'>{analytics.monthly.toLocaleString()}</p></div>
                </div>
            </div>

            {/* Status Grid */}
            <div className='grid grid-cols-3 gap-2'>
                <div className='gold-glass !p-4 border-white/5 text-center'><p className='text-[8px] opacity-40 font-black uppercase mb-1'>BAND</p><p className='text-xl font-black gold-text'>{analytics.busy}</p></div>
                <div className='gold-glass !p-4 border-white/5 text-center'><p className='text-[8px] opacity-40 font-black uppercase mb-1'>BO'SH</p><p className='text-xl font-black'>{analytics.free}</p></div>
                <div className='gold-glass !p-4 border-white/10 text-center bg-red-500/5'><p className='text-[8px] opacity-40 font-black uppercase mb-1'>TEXNIK</p><p className='text-xl font-black text-red-500'>{analytics.suspended}</p></div>
            </div>

            {/* Active Feed */}
            <div className='space-y-3'>
                <p className='text-[10px] font-black opacity-40 uppercase tracking-widest px-2'>Ochiq xonalar</p>
                {(activeRooms || []).filter(r => r?.isBusy).map(r => {
                    const s = calculateSession(r);
                    return (<div key={r.id} onClick={() => setActiveTab('xarita')} className='gold-glass !p-5 flex justify-between items-center bg-black/40 border-white/5 active:scale-95 transition-all'><div><h4 className='text-lg font-black italic uppercase'>{r.name}</h4><p className='text-[9px] font-black gold-text italic'>{s.time}</p></div><div className='text-right'><p className='text-sm font-black'>{s.total.toLocaleString()} UZS</p></div></div>);
                })}
            </div>

            {/* Debts */}
            <div className='gold-glass !p-6 border-red-500/20 bg-red-500/5'>
                <div className='flex justify-between items-center mb-4'><div className='flex items-center gap-2'><Users size={16} className='text-red-500' /><p className='text-[10px] font-black uppercase tracking-widest opacity-60'>Qarzlar ro'yxati</p></div><p className='text-xs font-black text-red-500'>{analytics.totalDebt.toLocaleString()} UZS</p></div>
                <div className='space-y-2'>
                    {(debts || []).filter(d => d?.club === currentAdminData?.club).slice(0, 5).map(d => (
                        <div key={d.id} className='flex justify-between items-center p-3.5 bg-black/40 rounded-2xl border border-white/5'>
                            <div><p className='text-[10px] font-black uppercase'>{d.name}</p><p className='text-[8px] opacity-20'>{d.date}</p></div>
                            <p className='text-xs font-black text-red-500'>-{d.amount.toLocaleString()}</p>
                        </div>
                    ))}
                    {analytics.totalDebt === 0 && <p className='text-[8px] opacity-20 text-center py-2 uppercase italic'>Qarzlar yo'q</p>}
                </div>
            </div>
        </div>
    );

    const renderClubXarita = () => (
        <div className='p-4 space-y-4 pb-28'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='btn-gold-minimal !py-5 bg-[#ffcf4b] text-black font-black text-xs uppercase'>+ YANGI XONA</button>
            <div className='grid grid-cols-1 gap-4'>
                {(activeRooms || []).map(room => {
                    const session = calculateSession(room); const isExp = expRooms[room?.id];
                    return (
                        <div key={room.id} className={`gold-glass transition-all ${room.isBusy ? 'ring-1 ring-[#ffcf4b]/20 bg-black/60 shadow-2xl' : room.isSuspended ? 'opacity-40 grayscale' : 'opacity-80'}`}>
                            <div className='p-4 border-b border-white/5 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                                <div className='flex items-center gap-3'><div className={`w-3 h-3 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse shadow-[0_0_10px_#ffcf4b]' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div><div><h3 className='text-xl font-black italic uppercase'>{room.name}</h3><p className='text-[8px] font-black opacity-40 uppercase'>{room.isBusy ? 'ACTIVE' : 'READY'}</p></div></div>
                                <div className='flex gap-1' onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setRooms(p => (p || []).map(r => r.id === room.id ? { ...r, isSuspended: !r.isSuspended, isBusy: false } : r))} className={`p-2.5 rounded-xl ${room.isSuspended ? 'bg-red-500 text-white shadow-lg' : 'bg-white/5 text-white/30'}`}><PauseCircle size={18} /></button>
                                    <button onClick={() => { if (window.confirm('O\'chirmoqchimisiz?')) setRooms(prev => prev.filter(r => r.id !== room.id)) }} className='p-2.5 bg-red-500/10 rounded-xl text-red-500'><Trash2 size={18} /></button>
                                </div>
                            </div>
                            {room.isBusy && (
                                <div className={`p-5 bg-gradient-to-b from-[#ffcf4b]/5 to-transparent ${isExp ? 'space-y-4' : 'flex justify-between items-center'}`}>
                                    <div className='flex flex-col'><p className='text-[8px] font-black opacity-30 uppercase tracking-widest'>VAQT</p><p className={`${isExp ? 'text-4xl' : 'text-lg'} font-black gold-text italic`}>{session.time}</p></div>
                                    <div className='text-right'><p className='text-[8px] font-black opacity-30 uppercase tracking-widest'>SUMMA</p><p className={`${isExp ? 'text-2xl' : 'text-lg'} font-black`}>{session.total.toLocaleString()} <span className='text-[8px] opacity-30'>UZS</span></p></div>
                                    {isExp && (
                                        <div className='pt-6 border-t border-white/5 space-y-6'>
                                            <div className='flex justify-between items-center'><p className='text-[9px] font-black opacity-40 uppercase text-xs'>BAR XIZMATI</p><button onClick={() => setSelectedRoomForBar(room)} className='bg-[#ffcf4b] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase active:scale-95 shadow-lg shadow-[#ffcf4b]/20'>+ BAR</button></div>
                                            <div className='flex flex-wrap gap-1.5'>{(room.items || []).map((i, idx) => (<div key={idx} className='text-[8px] font-black uppercase bg-white/10 px-3 py-2 rounded-xl border border-white/5'>{i.name} x{i.quantity}</div>))}</div>
                                            <button onClick={() => { setFinalStats(session); setCheckoutRoom(room); }} className='w-full py-5 bg-red-500 rounded-[1.7rem] text-white font-black uppercase italic text-xs shadow-2xl active:scale-95 transition-all shadow-red-500/20'>HISOBLASH VA YOPISH</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!room.isBusy && !room.isSuspended && (<div className='px-4 pb-4 pt-2'><button onClick={() => setRooms(p => (p || []).map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-4 bg-white/5 rounded-2xl text-white font-black uppercase text-xs border border-white/10'>START SESSION</button></div>)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderClubBar = () => (
        <div className='p-4 space-y-4 pb-28'>
            <div className='flex p-1.5 bg-white/5 rounded-[1.5rem] border border-white/5 mb-6'>
                <button onClick={() => setBarSubTab('sotuv')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${barSubTab === 'sotuv' ? 'bg-[#ffcf4b] text-black shadow-lg shadow-[#ffcf4b]/20' : 'text-white/30'}`}>Sotuv (Shop)</button>
                <button onClick={() => setBarSubTab('ombor')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${barSubTab === 'ombor' ? 'bg-white/10 text-white' : 'text-white/30'}`}>Ombor (Warehouse)</button>
            </div>
            {barSubTab === 'sotuv' ? (
                <div className='grid grid-cols-2 gap-3'>
                    {(inventory || []).map(item => (
                        <button key={item.id} onClick={() => {
                            if (item.stock <= 0) return alert('Omborda qolmagan!');
                            if (window.confirm(`${item.name} sotilsinmi?`)) {
                                setInventory(prev => prev.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i));
                                setSalesLog(prev => [...prev, { id: Date.now(), amount: item.price, timestamp: Date.now(), club: currentAdminData.club }]);
                            }
                        }} className='gold-glass !p-5 bg-black/40 border-white/5 text-left active:scale-95 flex flex-col justify-between h-[140px]'>
                            <div><p className='text-[8px] opacity-40 font-black uppercase mb-1'>{item.category}</p><h4 className='text-sm font-black italic gold-text'>{item.name}</h4></div>
                            <div><p className='text-[10px] font-black'>{item.price.toLocaleString()} UZS</p><p className='text-[7px] opacity-30 uppercase'>Sotildi: {item.sold || 0}</p></div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className='space-y-3'>
                    <button onClick={() => setShowInventoryModal(true)} className='w-full py-5 bg-white/5 rounded-2xl border border-white/10 font-black text-[10px] uppercase tracking-[3px] opacity-80 mb-4'>Yangi mahsulot qo'shish</button>
                    {(inventory || []).map(item => (
                        <div key={item.id} className='gold-glass !p-5 flex justify-between items-center bg-black/40'>
                            <div className='flex items-center gap-4'><div className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#ffcf4b]'><Package size={20} /></div><div><h4 className='text-sm font-black'>{item.name}</h4><p className='text-[9px] opacity-30 font-black uppercase'>Qoldiq: <span className='text-white'>{item.stock} ta</span></p></div></div>
                            <button onClick={() => setInventory(prev => prev.filter(i => i.id !== item.id))} className='p-2 bg-red-500/10 rounded-xl text-red-500'><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg pb-32 font-sans'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <div className='w-20 h-20 rounded-[2.5rem] bg-[#ffcf4b] flex items-center justify-center mb-12 shadow-2xl shadow-[#ffcf4b]/20'><Lock size={32} className='text-black' /></div>
                        <h1 className='text-5xl font-black italic mb-10 tracking-tighter uppercase text-[#ffcf4b]'>PLS</h1>
                        <input type="text" placeholder="LOGIN" className='input-luxury-small h-16 !bg-white/5 w-full max-w-[300px]' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button onClick={() => setView('clubDashboard')} className='btn-gold-minimal mt-8 py-5 !rounded-[2rem] w-full max-w-[300px] text-lg font-black'>KIRISH</button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='px-6 py-5 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'><div className='w-11 h-11 rounded-2xl bg-[#ffcf4b] flex items-center justify-center'><Activity size={22} className='text-black' /></div><div><h2 className='text-lg font-black italic uppercase tracking-tighter'>{currentAdminData?.name}</h2><p className='text-[8px] font-black opacity-30 uppercase tracking-[3px]'>{currentAdminData?.club}</p></div></div>
                            <button onClick={() => setView('login')} className='w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-white/20'><X size={24} /></button>
                        </div>
                        <main>{activeTab === 'asosiy' ? renderClubAsosiy() : activeTab === 'bar' ? renderClubBar() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-5 left-5 right-5 bg-black/80 backdrop-blur-3xl border border-white/10 p-5 rounded-[2.5rem] flex justify-around z-50 shadow-2xl'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'asosiy' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><BarChart size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>ASOSIY</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'xarita' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><Monitor size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>XARITA</span></button>
                    <button onClick={() => setActiveTab('bar')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'bar' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><Boxes size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>BAR</span></button>
                </div>
            )}

            {/* Modal Components */}
            <AnimatePresence>
                {checkoutRoom && finalStats && (
                    <div className='modal-overlay'><motion.div className='modal-content !p-8 border border-white/5'><h2 className='text-2xl font-black italic gold-text mb-10 text-center uppercase tracking-widest'>HISOBLASH</h2><div className='gold-glass p-8 text-center mb-10 bg-[#ffcf4b]/5'><p className='text-[10px] opacity-40 uppercase font-black mb-2'>JAMI TO'LOV</p><p className='text-5xl font-black gold-text italic tracking-tighter'>{finalStats.total.toLocaleString()} <span className='text-sm'>UZS</span></p></div><input type="number" placeholder="OLINGAN PUL" className='input-luxury-small h-20 text-3xl font-black text-center mb-8' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                        {finalStats.total - Number(paidAmount) > 0 && Number(paidAmount) > 0 && (<div className='space-y-4 mb-8 p-6 bg-red-500/10 rounded-3xl border border-red-500/20'><input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small h-14 !bg-black/60' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} /><input type="text" placeholder="TEL RAQAMI" className='input-luxury-small h-14 !bg-black/60' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} /></div>)}<button onClick={confirmCheckout} className='btn-gold-minimal !py-8 text-xl font-black shadow-2xl'>TASDIQLASH</button></motion.div></div>
                )}
                {showInventoryModal && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'><h2 className='text-2xl font-black italic gold-text mb-10 text-center uppercase'>MAHSULOT QO'SHISH</h2><div className='space-y-4'><input type="text" placeholder="NOMI" className='input-luxury-small h-16' onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /><div className='grid grid-cols-2 gap-4'><input type="number" placeholder="NARXI (UZS)" className='input-luxury-small h-16' onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} /><input type="number" placeholder="SONI (TA)" className='input-luxury-small h-16' onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })} /></div><select className='input-luxury-small h-16 !bg-black/80' onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}><option value="Ichimlik">Ichimlik</option><option value="Yegulik">Yegulik</option><option value="Energetik">Energetik</option></select><button onClick={() => { setInventory([...inventory, { ...newItem, id: Date.now(), sold: 0 }]); setShowInventoryModal(false); }} className='btn-gold-minimal !py-6 font-black uppercase text-lg shadow-2xl'>OMBORGA SAQLASH</button></div></motion.div></div>
                )}
                {selectedRoomForBar && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content !max-w-md'><div className='flex justify-between items-center mb-8'><h2 className='text-xl font-black italic gold-text uppercase'>BAR TANLASH</h2><button onClick={() => setSelectedRoomForBar(null)} className='p-2 bg-white/5 rounded-full'><X /></button></div><div className='grid grid-cols-2 gap-3'>{(inventory || []).map(item => (<button key={item.id} disabled={item.stock <= 0} onClick={() => { setRooms(prev => (prev || []).map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r)); setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSelectedRoomForBar(null); }} className='gold-glass p-5 text-left active:scale-95 transition-all text-[10px] font-black uppercase disabled:opacity-20'>{item.name} <br /> <span className='gold-text'>{item.price.toLocaleString()}</span> <br /> {item.stock} ta</button>))}</div></motion.div></div>
                )}
                {showAddRoom && (
                    <div className='modal-overlay'><motion.div className='modal-content'><h2 className='text-xl font-black italic text-center mb-8 uppercase tracking-widest'>XONA QO'SHISH</h2><input type="text" placeholder="XONA NOMI" className='input-luxury-small h-16 mb-4' onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} /><input type="number" placeholder="NARXI (SOATIGA)" className='input-luxury-small h-16 mb-6' onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })} /><button onClick={() => { setRooms([...rooms, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false }]); setShowAddRoom(false); }} className='btn-gold-minimal !py-6'>SAQLASH</button></motion.div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
