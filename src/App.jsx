import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight, BarChart, Boxes, LayoutGrid, Eye, EyeOff, ExternalLink, ListChecks, Info, ChevronLeft, Layout
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
};

const formatTimeFull = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatTimeShort = (ts) => {
    if (!ts) return '--:--';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
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
    const [historyEntries, setHistoryEntries] = useState(getInitialState('historyEntries', []));
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [now, setNow] = useState(Date.now());
    const [expRooms, setExpRooms] = useState({});
    const [showDebtsInAsosiy, setShowDebtsInAsosiy] = useState(getInitialState('showDebtsInAsosiy', true));
    const [selectedHistoryDate, setSelectedHistoryDate] = useState(new Date().toISOString().split('T')[0]);

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
        if (view === 'login') return;
        localStorage.setItem('rooms', JSON.stringify(rooms || []));
        localStorage.setItem('debts', JSON.stringify(debts || []));
        localStorage.setItem('salesLog', JSON.stringify(salesLog || []));
        localStorage.setItem('historyEntries', JSON.stringify(historyEntries || []));
        localStorage.setItem('inventory', JSON.stringify(inventory || []));
        localStorage.setItem('view', JSON.stringify(view));
        localStorage.setItem('username', JSON.stringify(username));
    }, [rooms, debts, salesLog, historyEntries, inventory, view, username]);

    const addToHistory = (type, title, desc, iconColor = 'gold') => {
        const newEntry = { id: Date.now(), timestamp: Date.now(), type, title, desc, iconColor, club: currentAdminData.club, dateStr: new Date().toISOString().split('T')[0] };
        setHistoryEntries(prev => [newEntry, ...(prev || []).slice(0, 499)]);
    };

    const currentAdminData = useMemo(() => {
        return (clubAdmins || []).find(a => a?.login === username) || { name: 'ADMIN', club: 'PLS' };
    }, [clubAdmins, username]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const calculateSession = (room, targetNow = now) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, items: [], startStr: '--:--', endStr: '--:--' };
        try {
            const diff = Math.floor((targetNow - room.startTime) / 1000);
            const timePrice = (diff / 3600) * Number(room.price || 0);
            const itemsPrice = (room.items || []).reduce((acc, i) => acc + (Number(i.price || 0) * (i.quantity || 1)), 0);
            return {
                time: `${Math.floor(diff / 3600).toString().padStart(2, '0')}:${Math.floor((diff % 3600) / 60).toString().padStart(2, '0')}:${(diff % 60).toString().padStart(2, '0')}`,
                total: Math.round(timePrice + itemsPrice),
                items: room.items || [],
                startStr: formatTimeShort(room.startTime)
            };
        } catch { return { time: '00:00:00', total: 0, startStr: '--:--' }; }
    };

    const analytics = useMemo(() => {
        try {
            const clubLog = (salesLog || []).filter(s => s?.club === currentAdminData?.club);
            const nowTime = Date.now();
            const day = 24 * 60 * 60 * 1000; const week = 7 * day; const month = 30 * day; const year = 365 * day;
            const dailyComp = clubLog.filter(s => (nowTime - s.timestamp) < day).reduce((acc, s) => acc + s.amount, 0);
            const weekly = clubLog.filter(s => (nowTime - s.timestamp) < week).reduce((acc, s) => acc + s.amount, 0);
            const monthly = clubLog.filter(s => (nowTime - s.timestamp) < month).reduce((acc, s) => acc + s.amount, 0);
            const yearly = clubLog.filter(s => (nowTime - s.timestamp) < year).reduce((acc, s) => acc + s.amount, 0);
            const activeRev = (activeRooms || []).filter(r => r?.isBusy).reduce((acc, r) => acc + calculateSession(r).total, 0);
            const totalD = (debts || []).filter(d => d?.club === currentAdminData?.club).reduce((acc, d) => acc + (d?.amount || 0), 0);
            return { daily: dailyComp + activeRev, weekly: weekly + activeRev, monthly: monthly + activeRev, yearly: yearly + activeRev, totalDept: totalD, totalR: activeRooms.length, busyR: activeRooms.filter(r => r.isBusy).length, freeR: activeRooms.filter(r => !r.isBusy && !r.isSuspended).length };
        } catch { return { daily: 0, weekly: 0, monthly: 0, yearly: 0, totalDept: 0, totalR: 0, busyR: 0, freeR: 0 }; }
    }, [salesLog, debts, currentAdminData?.club, activeRooms, now]);

    const confirmCheckout = () => {
        const stats = finalStats; const paid = Number(paidAmount) || 0;
        if (paid > 0) setSalesLog(p => [...(p || []), { id: Date.now(), amount: paid, timestamp: Date.now(), club: checkoutRoom?.club }]);
        if ((stats?.total || 0) - paid > 0) setDebts(p => [...(p || []), { id: Date.now(), name: debtUser.name || 'Mijoz', phone: debtUser.phone || '', amount: stats.total - paid, date: new Date().toLocaleString(), timestamp: Date.now(), club: checkoutRoom?.club }]);
        addToHistory('SESSION', checkoutRoom.name, `Yakunlandi: ${stats.total.toLocaleString()} UZS`, 'red');
        setRooms(prev => (prev || []).map(r => r.id === checkoutRoom?.id ? { ...r, isBusy: false, startTime: null, items: [] } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
    };

    const renderClubAsosiy = () => (
        <div className='p-5 space-y-4 pb-32 animate-fade-in'>
            <div className='grid grid-cols-3 gap-2.5'>
                <div className='gold-glass !p-2 text-center opacity-60'><p className='text-[7px] font-black uppercase mb-0.5 opacity-40'>TOTAL</p><p className='text-xs font-black'>{analytics.totalR}</p></div>
                <div className='gold-glass !p-2 text-center border-[#ffcf4b]/20'><p className='text-[7px] font-black uppercase mb-0.5 gold-text'>BUSY</p><p className='text-xs font-black gold-text'>{analytics.busyR}</p></div>
                <div className='gold-glass !p-2 text-center border-green-500/20'><p className='text-[7px] font-black uppercase mb-0.5 text-green-500'>FREE</p><p className='text-xs font-black text-green-500'>{analytics.freeR}</p></div>
            </div>
            <div className='gold-glass !p-6 bg-gradient-to-br from-[#ffcf4b]/10 to-transparent border-[#ffcf4b]/20 rounded-[2rem]'>
                <p className='text-[9px] font-black opacity-30 uppercase tracking-[2px] mb-1'>BUGUNGI KASSA</p>
                <h2 className='text-3xl font-black italic gold-text tracking-tighter tabular-nums'>{analytics.daily.toLocaleString()} <span className='text-[10px] opacity-20 NOT-italic'>UZS</span></h2>
            </div>
            <div className='grid grid-cols-3 gap-2'>
                <div className='gold-glass !p-3 bg-white/5 border-transparent text-center'><p className='text-[7px] opacity-30 font-black mb-1'>WEEK</p><p className='text-[10px] font-black'>{analytics.weekly.toLocaleString()}</p></div>
                <div className='gold-glass !p-3 bg-white/5 border-transparent text-center'><p className='text-[7px] opacity-30 font-black mb-1'>MONTH</p><p className='text-[10px] font-black'>{analytics.monthly.toLocaleString()}</p></div>
                <div className='gold-glass !p-3 bg-white/5 border-transparent text-center'><p className='text-[7px] opacity-30 font-black mb-1'>YEAR</p><p className='text-[10px] font-black gold-text'>{analytics.yearly.toLocaleString()}</p></div>
            </div>
            <div className='space-y-2 pt-2'>
                <p className='text-[9px] font-black opacity-20 uppercase tracking-widest px-1'>LIVE MONITORING</p>
                {(activeRooms || []).filter(r => r?.isBusy).map(r => {
                    const s = calculateSession(r);
                    return (<div key={r.id} onClick={() => setActiveTab('xarita')} className='gold-glass !p-4 flex justify-between items-center bg-black/20 border-white/5 transition-all text-xs active:scale-[0.98]'><div><p className='font-black italic uppercase'>{r.name}</p><p className='text-[8px] opacity-30'>{s.time} • {s.startStr}</p></div><p className='font-black gold-text'>{s.total.toLocaleString()} UZS</p></div>);
                })}
            </div>
            <div className='gold-glass !p-5 bg-red-500/5 border-red-500/10'>
                <div onClick={() => setShowDebtsInAsosiy(!showDebtsInAsosiy)} className='flex justify-between items-center cursor-pointer'>
                    <div className='flex items-center gap-3'><Users size={16} className='text-red-500' /><p className='text-xs font-black gold-text'>QARZLAR: <span className='text-red-500'>{analytics.totalDept.toLocaleString()}</span></p></div>
                    {showDebtsInAsosiy ? <ChevronUp size={14} className='opacity-20' /> : <ChevronDown size={14} className='opacity-20' />}
                </div>
                <AnimatePresence>{showDebtsInAsosiy && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='mt-4 space-y-2'>
                    {(debts || []).filter(d => d?.club === currentAdminData?.club).reverse().map(d => (
                        <div key={d.id} className='bg-black/40 p-3 rounded-xl border border-white/5 flex justify-between items-center'><div className='text-[10px]'><h4 className='font-black uppercase'>{d.name}</h4><p className='text-red-500 font-bold'>-{d.amount.toLocaleString()}</p></div><button onClick={() => { if (window.confirm('To\'landimi?')) setDebts(p => p.filter(x => x.id !== d.id)) }} className='p-2 bg-green-500/10 text-green-500 rounded-lg'><CheckCircle2 size={12} /></button></div>
                    ))}
                </motion.div>)}</AnimatePresence>
            </div>
        </div>
    );

    const renderClubHistory = () => {
        const filteredEntries = (historyEntries || []).filter(e => e?.club === currentAdminData?.club && (e.dateStr === selectedHistoryDate || !e.dateStr));
        const dates = []; for (let i = 0; i < 14; i++) { const d = new Date(); d.setDate(d.getDate() - i); dates.push(d.toISOString().split('T')[0]); }
        return (
            <div className='p-5 space-y-5 pb-32 animate-fade-in'>
                <div className='flex justify-between items-end px-1'><h2 className='text-xl font-black italic gold-text uppercase tracking-tighter'>HISTORY</h2><input type="date" className='bg-transparent text-[8px] font-black uppercase opacity-20 outline-none' value={selectedHistoryDate} onChange={(e) => setSelectedHistoryDate(e.target.value)} /></div>
                <div className='flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth pb-2'>
                    {dates.map(dStr => {
                        const dateObj = new Date(dStr); const isSelected = selectedHistoryDate === dStr;
                        return (
                            <button key={dStr} onClick={() => setSelectedHistoryDate(dStr)} className={`shrink-0 w-12 h-16 rounded-[1rem] flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-[#ffcf4b] text-black shadow-lg shadow-[#ffcf4b]/20' : 'bg-white/5 text-white/40'}`}>
                                <span className='text-[7px] font-black uppercase mb-1'>{dateObj.toLocaleDateString('uz-UZ', { weekday: 'short' })}</span>
                                <span className='text-sm font-black italic'>{dateObj.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
                <div className='space-y-3'>
                    {filteredEntries.map(e => (
                        <div key={e.id} className='gold-glass !p-4 flex gap-4 bg-black/20 border-white/5'>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${e.type === 'SESSION' ? 'bg-red-500/10 text-red-500' : 'bg-white/10 text-white/40'}`}>{e.type === 'SESSION' ? <Play size={14} /> : <ShoppingCart size={14} />}</div>
                            <div className='flex-1'><div className='flex justify-between items-start'><h4 className='text-[10px] font-black uppercase'>{e.title}</h4><span className='text-[8px] opacity-20 font-black'>{formatTimeShort(e.timestamp)}</span></div><p className='text-[9px] opacity-40 mt-0.5'>{e.desc}</p></div>
                        </div>
                    ))}
                    {filteredEntries.length === 0 && <p className='text-center py-20 text-[9px] opacity-20 uppercase font-black'>No logs found</p>}
                </div>
            </div>
        );
    };

    const renderClubXarita = () => (
        <div className='p-5 space-y-4 pb-32 animate-fade-in relative'>
            <div className='grid grid-cols-1 gap-4'>{(activeRooms || []).map(room => {
                const session = calculateSession(room); const isExp = expRooms[room?.id];
                return (
                    <div key={room.id} className={`gold-glass transition-all ${room.isBusy ? 'bg-black/60 shadow-xl border-[#ffcf4b]/10' : 'opacity-70 bg-black/20 border-white/5'}`}>
                        <div className='p-4 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                            <div className='flex items-center gap-3'><div className={`w-2 h-2 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse' : 'bg-white/10'}`}></div><div><h3 className='text-base font-black italic uppercase'>{room.name}</h3><p className='text-[7px] font-black opacity-30 mt-0.5'>{room.isBusy ? `SINCE ${session.startStr}` : 'READY'}</p></div></div>
                            <div className='flex gap-1.5' onClick={e => e.stopPropagation()}>
                                <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2.5 bg-white/5 rounded-xl text-white/30'><Edit3 size={16} /></button>
                                <button onClick={() => { if (window.confirm('Delete?')) { setRooms(p => p.filter(r => r.id !== room.id)); addToHistory('SYSTEM', room.name, 'Deleted.', 'red'); } }} className='p-2.5 bg-red-500/10 rounded-xl text-red-500/40'><Trash2 size={16} /></button>
                            </div>
                        </div>
                        {room.isBusy ? (
                            <div className={`px-4 pb-4 ${isExp ? 'space-y-4 pt-2 border-t border-white/5' : 'flex justify-between items-center'}`}>
                                <div className='flex flex-col'><p className='text-[6px] font-black opacity-30 uppercase'>TIMER</p><p className={`${isExp ? 'text-4xl' : 'text-lg'} font-black gold-text italic tabular-nums tracking-tighter`}>{session.time}</p></div>
                                {!isExp && <p className='text-sm font-black gold-text'>{session.total.toLocaleString()} <span className='text-[7px] opacity-30 NOT-italic'>UZS</span></p>}
                                {isExp && (
                                    <div className='space-y-4'>
                                        <div className='flex justify-between items-center'><p className='text-3xl font-black gold-text italic tracking-tighter'>{session.total.toLocaleString()}</p><button onClick={() => setSelectedRoomForBar(room)} className='bg-[#ffcf4b] text-black px-5 py-2 rounded-full text-[9px] font-black uppercase shadow-lg'>+ BAR</button></div>
                                        <div className='flex flex-wrap gap-1'>{(room.items || []).map((i, idx) => (<div key={idx} className='text-[7px] font-black uppercase bg-white/5 px-3 py-1.5 rounded-xl'>{i.name}</div>))}</div>
                                        <button onClick={() => { setFinalStats({ ...session }); setCheckoutRoom(room); }} className='w-full py-4.5 bg-red-600 rounded-2xl text-white font-black uppercase italic text-xs shadow-xl active:scale-95'>CHECKOUT</button>
                                    </div>
                                )}
                            </div>
                        ) : (<div className='px-4 pb-4'><button onClick={() => { setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r)); addToHistory('SESSION', room.name, 'Started.', 'gold'); }} className='w-full py-3.5 bg-white/5 rounded-xl text-white/40 font-black uppercase text-[9px] border border-white/5 active:bg-white/10'>Xonani Ochish</button></div>)}
                    </div>
                );
            })}</div>

            {/* Unified Floating Action Button */}
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='fixed right-6 bottom-28 w-14 h-14 bg-[#ffcf4b] rounded-[1.5rem] flex items-center justify-center text-black shadow-2xl shadow-[#ffcf4b]/30 active:scale-90 transition-all z-[60]'><Plus size={24} strokeWidth={3} /></button>
        </div>
    );

    const renderClubBar = () => (
        <div className='p-5 space-y-5 pb-32 animate-fade-in'>
            <div className='flex justify-between items-end mb-4'><h2 className='text-xl font-black italic gold-text uppercase tracking-tighter'>BAR PANEL</h2><div className='flex gap-2 p-1 bg-white/5 rounded-xl'><button onClick={() => setBarSubTab('sotuv')} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase ${barSubTab === 'sotuv' ? 'bg-[#ffcf4b] text-black' : 'text-white/20'}`}>Sotuv</button><button onClick={() => setBarSubTab('ombor')} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase ${barSubTab === 'ombor' ? 'bg-white/10 text-white' : 'text-white/20'}`}>Ombor</button></div></div>
            {barSubTab === 'sotuv' ? (
                <div className='grid grid-cols-2 gap-3 pb-4'>
                    {(inventory || []).length > 0 ? (inventory || []).map(item => (<button key={item.id} onClick={() => { if (item.stock <= 0) return; if (window.confirm('Sotuv?')) { setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSalesLog(p => [...p, { id: Date.now(), amount: item.price, timestamp: Date.now(), club: currentAdminData.club }]); addToHistory('BAR', item.name, `Sotuv: ${item.price.toLocaleString()}`, 'gold'); } }} className='gold-glass !p-4 bg-black/40 text-left h-24 flex flex-col justify-between active:scale-95 transition-all'><div><p className='text-[6px] opacity-30 font-black uppercase mb-0.5'>{item.category}</p><h4 className='text-[10px] font-black uppercase gold-text leading-tight'>{item.name}</h4></div><p className='text-[9px] font-black'>{item.price.toLocaleString()} UZS</p></button>)) : <div className='col-span-2 py-20 text-center opacity-20 text-[9px] font-black uppercase'>Ombor bo'sh</div>}
                </div>
            ) : (
                <div className='space-y-3'>
                    <button onClick={() => setShowInventoryModal(true)} className='w-full py-4 bg-white/5 border border-dashed border-white/20 rounded-2xl text-[9px] font-black uppercase text-[#ffcf4b] active:scale-95'>+ YANGI MAHSULOT</button>
                    {(inventory || []).map(item => (<div key={item.id} className='gold-glass !p-4 flex justify-between items-center'><div className='flex items-center gap-3'><div className='w-9 h-9 border border-white/5 rounded-xl flex items-center justify-center text-[#ffcf4b]'><Package size={16} /></div><div><h4 className='text-[10px] font-black uppercase'>{item.name}</h4><p className='text-[7px] opacity-30'>Qoldiq: {item.stock} ta</p></div></div><button onClick={() => setInventory(p => p.filter(i => i.id !== item.id))} className='p-2.5 bg-red-500/10 text-red-500 rounded-xl'><Trash2 size={14} /></button></div>))}
                </div>
            )}
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg font-sans overflow-x-hidden'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <div className='w-16 h-16 rounded-[2rem] bg-[#ffcf4b] flex items-center justify-center mb-10 shadow-2xl'><Lock size={24} className='text-black' /></div>
                        <h1 className='text-3xl font-black italic mb-10 text-[#ffcf4b] tracking-tighter'>PLS_AUTH</h1>
                        <input type="text" placeholder="ID" className='input-luxury-small h-14 w-full max-w-[280px]' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button onClick={() => setView('clubDashboard')} className='btn-gold-minimal mt-8 py-4 w-full max-w-[280px] text-sm font-black uppercase rounded-2xl'>KIRISH</button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <header className='px-6 py-5 flex justify-between items-center bg-black/60 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-3'><div className='w-9 h-9 rounded-xl bg-[#ffcf4b] flex items-center justify-center shadow-lg'><Activity size={18} className='text-black' /></div><div><h2 className='text-sm font-black italic uppercase tracking-tighter'>{currentAdminData?.name}</h2><p className='text-[7px] opacity-20 uppercase tracking-[2px]'>{currentAdminData?.club}</p></div></div>
                            <div className='text-right'><p className='text-[10px] font-black gold-text tabular-nums italic tracking-wider'>{new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p></div>
                        </header>
                        <main className='max-w-[480px] mx-auto pb-32'>{activeTab === 'asosiy' ? renderClubAsosiy() : activeTab === 'bar' ? renderClubBar() : activeTab === 'history' ? renderClubHistory() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Refined Navigation Toolbar */}
            {view !== 'login' && (
                <div className='fixed bottom-6 left-10 right-10 flex justify-center z-50'>
                    <nav className='bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex items-center gap-1 shadow-2xl'>
                        {['asosiy', 'xarita', 'bar', 'history'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-3 rounded-[1.5rem] flex items-center gap-2 transition-all duration-300 ${activeTab === tab ? 'bg-[#ffcf4b] text-black shadow-lg shadow-[#ffcf4b]/20 scale-105' : 'text-white/20'}`}>
                                {tab === 'asosiy' ? <BarChart2 size={18} /> : tab === 'xarita' ? <Monitor size={18} /> : tab === 'bar' ? <Boxes size={18} /> : <History size={18} />}
                                {activeTab === tab && <span className='text-[8px] font-black uppercase tracking-[1px]'>{tab.slice(0, 4)}</span>}
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {/* Modals - Refined Scale */}
            <AnimatePresence>
                {checkoutRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='modal-content !p-8 !rounded-[2.5rem] !max-w-[85%] border border-[#ffcf4b]/10'>
                        <h2 className='text-xl font-black italic gold-text text-center mb-8 uppercase tracking-widest'>CHECKOUT</h2>
                        <div className='gold-glass !p-6 bg-[#ffcf4b]/5 text-center mb-8 border-transparent'>
                            <p className='text-[7px] font-black opacity-30 uppercase tracking-[3px] mb-2'>BILL_TOTAL</p>
                            <p className='text-4xl font-black italic tracking-tighter tabular-nums gold-text'>{finalStats.total.toLocaleString()}<span className='text-[10px] NOT-italic opacity-30 ml-2 uppercase'>UZS</span></p>
                        </div>
                        <input type="number" placeholder="RECEIVED AMOUNT" className='input-luxury-small h-14 text-xl font-black text-center mb-8 outline-none border-white/10' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                        {(finalStats.total - Number(paidAmount) > 0 && Number(paidAmount) > 0) && (
                            <div className='space-y-3 mb-8 bg-black/40 p-4 rounded-2xl border border-red-500/10'>
                                <input type="text" placeholder="NAME" className='input-luxury-small h-10 text-[9px]' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                <input type="text" placeholder="PHONE" className='input-luxury-small h-10 text-[9px]' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                            </div>
                        )}
                        <button onClick={confirmCheckout} className='w-full py-4.5 bg-[#ffcf4b] text-black text-xs font-black uppercase rounded-[1.5rem] shadow-xl'>CONFIRM_PAID</button>
                        <button onClick={() => setCheckoutRoom(null)} className='w-full py-3 mt-2 text-[8px] opacity-20 font-black uppercase'>CANCEL</button>
                    </motion.div></div>
                )}
                {showAddRoom && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-lg font-black italic uppercase text-center mb-8 tracking-widest'>CONFIGURATION</h2><div className='space-y-4'><input type="text" placeholder="XONA NOMI" className='input-luxury-small h-14' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} /><input type="number" placeholder="NARXI (SOATIGA)" className='input-luxury-small h-14' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: Number(e.target.value) }) : setNewRoom({ ...newRoom, price: Number(e.target.value) })} /><button onClick={() => { if (editingRoom) { setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r)); setEditingRoom(null); } else { setRooms([...rooms, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, isSuspended: false }]); } setShowAddRoom(false); }} className='w-full py-4.5 bg-[#ffcf4b] text-black font-black uppercase rounded-2xl shadow-xl'>SAVE_CONFIG</button></div></motion.div></div>)}
                {showInventoryModal && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-lg font-black gold-text text-center mb-8 uppercase tracking-widest'>NEW_INVENTORY</h2><div className='space-y-4'><input type="text" placeholder="NAME" className='input-luxury-small h-14' value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /><div className='grid grid-cols-2 gap-4'><input type="number" placeholder="PRICE" className='input-luxury-small h-14' value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} /><input type="number" placeholder="STOCK" className='input-luxury-small h-14' value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })} /></div><button onClick={() => { setInventory([...inventory, { ...newItem, id: Date.now(), sold: 0 }]); setShowInventoryModal(false); }} className='w-full py-4.5 bg-[#ffcf4b] text-black font-black uppercase rounded-2xl'>ADD_ITEM</button></div></motion.div></div>)}
                {selectedRoomForBar && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><div className='flex justify-between items-center mb-8'><p className='text-lg font-black italic gold-text uppercase'>BAR_SELECT</p><button onClick={() => setSelectedRoomForBar(null)} className='p-2 bg-white/5 rounded-full text-white/30'><X size={16} /></button></div><div className='grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto no-scrollbar'>{(inventory || []).map(item => (<button key={item.id} disabled={item.stock <= 0} onClick={() => { setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r)); setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSelectedRoomForBar(null); }} className='bg-white/5 p-4 rounded-2xl text-left text-[8px] font-black uppercase active:scale-95 disabled:opacity-20 flex flex-col justify-between h-24 border border-white/5'><span>{item.name}</span><span className='gold-text text-xs'>{item.price.toLocaleString()}</span></button>))}</div></motion.div></div>)}
            </AnimatePresence>
        </div>
    );
};

// Simplified Icons to avoid bloat
const BarChart2 = ({ size, className }) => <BarChart3 size={size} className={className} />;

export default App;
