import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight, BarChart, Boxes, LayoutGrid, Eye, EyeOff, ExternalLink, ListChecks, Info
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

const formatTimeShort = (timestamp) => {
    if (!timestamp) return '--:--';
    const d = new Date(timestamp);
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
        if (!room?.startTime) return { time: '00:00:00', total: 0, items: [], itemsPrice: 0, startStr: '--:--', endStr: '--:--' };
        try {
            const diff = Math.floor((targetNow - room.startTime) / 1000);
            const timePrice = (diff / 3600) * Number(room.price || 0);
            const itemsPrice = (room.items || []).reduce((acc, i) => acc + (Number(i.price || 0) * (i.quantity || 1)), 0);
            return {
                time: `${Math.floor(diff / 3600).toString().padStart(2, '0')}:${Math.floor((diff % 3600) / 60).toString().padStart(2, '0')}:${(diff % 60).toString().padStart(2, '0')}`,
                total: Math.round(timePrice + itemsPrice),
                items: room.items || [],
                startStr: formatTimeShort(room.startTime),
                endStr: formatTimeShort(targetNow)
            };
        } catch { return { time: '00:00:00', total: 0, startStr: '--:--', endStr: '--:--' }; }
    };

    const analytics = useMemo(() => {
        try {
            const clubLog = (salesLog || []).filter(s => s?.club === currentAdminData?.club);
            const nowTime = Date.now();
            const day = 24 * 60 * 60 * 1000;
            const week = 7 * day;
            const month = 30 * day;
            const year = 365 * day;

            const dailyCompleted = clubLog.filter(s => (nowTime - s.timestamp) < day).reduce((acc, s) => acc + s.amount, 0);
            const weekly = clubLog.filter(s => (nowTime - s.timestamp) < week).reduce((acc, s) => acc + s.amount, 0);
            const monthly = clubLog.filter(s => (nowTime - s.timestamp) < month).reduce((acc, s) => acc + s.amount, 0);
            const yearly = clubLog.filter(s => (nowTime - s.timestamp) < year).reduce((acc, s) => acc + s.amount, 0);

            const runningRevenue = (activeRooms || []).filter(r => r?.isBusy).reduce((acc, r) => acc + calculateSession(r).total, 0);
            const totalDebt = (debts || []).filter(d => d?.club === currentAdminData?.club).reduce((acc, d) => acc + (d?.amount || 0), 0);

            return { daily: dailyCompleted + runningRevenue, weekly: weekly + runningRevenue, monthly: monthly + runningRevenue, yearly: yearly + runningRevenue, totalDept: totalDebt, totalRooms: activeRooms.length, busyRooms: activeRooms.filter(r => r.isBusy).length, freeRooms: activeRooms.filter(r => !r.isBusy && !r.isSuspended).length };
        } catch { return { daily: 0, weekly: 0, monthly: 0, yearly: 0, totalDept: 0, totalRooms: 0, busyRooms: 0, freeRooms: 0 }; }
    }, [salesLog, debts, currentAdminData?.club, activeRooms, now]);

    const confirmCheckout = () => {
        const stats = finalStats; const paid = Number(paidAmount) || 0;
        if (paid > 0) setSalesLog(p => [...(p || []), { id: Date.now(), amount: paid, timestamp: Date.now(), club: checkoutRoom?.club }]);
        if ((stats?.total || 0) - paid > 0) setDebts(p => [...(p || []), { id: Date.now(), name: debtUser.name || 'Mijoz', phone: debtUser.phone || '', amount: stats.total - paid, date: new Date().toLocaleString(), timestamp: Date.now(), club: checkoutRoom?.club }]);

        addToHistory('SESSION', checkoutRoom.name, `Xona yopildi. Jami: ${stats.total.toLocaleString()} UZS`, 'red');

        setRooms(prev => (prev || []).map(r => r.id === checkoutRoom?.id ? { ...r, isBusy: false, startTime: null, items: [] } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
    };

    const renderClubAsosiy = () => (
        <div className='p-4 space-y-4 pb-28'>
            <div className='grid grid-cols-3 gap-2'>
                <div className='gold-glass !p-3 border-white/5 text-center'><p className='text-[7px] opacity-40 uppercase font-black mb-1'>JAMI</p><p className='text-xs font-black'>{analytics.totalRooms}</p></div>
                <div className='gold-glass !p-3 border-[#ffcf4b]/20 bg-[#ffcf4b]/5 text-center'><p className='text-[7px] gold-text uppercase font-black mb-1'>BAND</p><p className='text-xs font-black gold-text'>{analytics.busyRooms}</p></div>
                <div className='gold-glass !p-3 border-green-500/20 bg-green-500/5 text-center'><p className='text-[7px] text-green-500 uppercase font-black mb-1'>BO'SH</p><p className='text-xs font-black text-green-500'>{analytics.freeRooms}</p></div>
            </div>
            <div className='gold-glass !p-5 bg-gradient-to-br from-[#ffcf4b]/20 to-transparent border-[#ffcf4b]/20 shadow-xl'>
                <div className='flex items-center gap-2 mb-1'><span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span><p className='text-[8px] font-black opacity-40 uppercase tracking-[4px]'>BUGUNGI KASSA</p></div>
                <h2 className='text-4xl font-black italic gold-text tracking-tighter tabular-nums'>{analytics.daily.toLocaleString()} <span className='text-xs opacity-40'>UZS</span></h2>
            </div>
            <div className='grid grid-cols-3 gap-2'>
                <div className='gold-glass !p-3 border-white/5 text-center'><p className='text-[7px] opacity-40 uppercase font-black mb-1'>HAFTALIK</p><p className='text-xs font-black'>{analytics.weekly.toLocaleString()}</p></div>
                <div className='gold-glass !p-3 border-white/5 text-center'><p className='text-[7px] opacity-40 uppercase font-black mb-1'>OYLIK</p><p className='text-xs font-black'>{analytics.monthly.toLocaleString()}</p></div>
                <div className='gold-glass !p-3 border-white/5 text-center'><p className='text-[7px] opacity-40 uppercase font-black mb-1'>YILLIK</p><p className='text-xs font-black text-[#ffcf4b]'>{analytics.yearly.toLocaleString()}</p></div>
            </div>
            <div className='space-y-2'>
                <p className='text-[9px] font-black opacity-40 uppercase px-1 tracking-widest flex items-center gap-2'><Monitor size={10} /> JONLI MONITORING</p>
                {(activeRooms || []).filter(r => r?.isBusy).map(r => {
                    const s = calculateSession(r);
                    return (<div key={r.id} onClick={() => setActiveTab('xarita')} className='gold-glass !p-4 flex justify-between items-center bg-black/40 border-white/5 active:scale-95 transition-all text-sm'><div><p className='font-black italic uppercase'>{r.name}</p><p className='text-[8px] font-black gold-text'>{s.time} • {s.startStr}</p></div><p className='font-black'>{s.total.toLocaleString()} UZS</p></div>);
                })}
            </div>
            <div className='gold-glass !p-0 overflow-hidden border-red-500/20 bg-red-500/5'>
                <div onClick={() => setShowDebtsInAsosiy(!showDebtsInAsosiy)} className='p-5 flex justify-between items-center bg-white/5 cursor-pointer active:bg-white/10 transition-all'>
                    <div className='flex items-center gap-3'><div className='w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500'><Users size={16} /></div><div><p className='text-[9px] font-black uppercase opacity-60'>QARZLAR</p><p className='text-xs font-black text-red-500'>{analytics.totalDept.toLocaleString()} UZS</p></div></div>
                    {showDebtsInAsosiy ? <EyeOff size={16} className='opacity-30' /> : <Eye size={16} className='opacity-30' />}
                </div>
                <AnimatePresence>{showDebtsInAsosiy && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='p-3 border-t border-white/5 space-y-2 max-h-[300px] overflow-y-auto'>
                    {(debts || []).filter(d => d?.club === currentAdminData?.club).reverse().map(d => (
                        <div key={d.id} className='gold-glass !p-3 bg-black/40 border-white/5 flex justify-between items-center'>
                            <div className='space-y-0.5'><div className='flex items-center gap-2'><h4 className='text-[11px] font-black uppercase'>{d.name}</h4><p className='text-[9px] font-black text-red-500'>-{d.amount.toLocaleString()}</p></div>{d.phone && (<a href={`tel:${d.phone}`} className='flex items-center gap-1 text-blue-400'><Phone size={8} /><span className='text-[9px] font-black'>{d.phone}</span></a>)}<div className='flex items-center gap-1 opacity-20'><Calendar size={8} /><span className='text-[7px] font-black uppercase'>{d.date}</span></div></div>
                            <button onClick={() => { if (window.confirm('To\'landimi?')) setDebts(p => p.filter(x => x.id !== d.id)) }} className='p-2 bg-green-500/10 rounded-lg text-green-500'><CheckCircle2 size={14} /></button>
                        </div>
                    ))}
                    {(debts || []).filter(d => d?.club === currentAdminData?.club).length === 0 && <p className='text-center py-4 text-[9px] opacity-20 font-black uppercase'>Qarzlar yo'q</p>}
                </motion.div>)}</AnimatePresence>
            </div>
        </div>
    );

    const renderClubHistory = () => {
        const filteredEntries = (historyEntries || []).filter(e => e?.club === currentAdminData?.club && (e.dateStr === selectedHistoryDate || !e.dateStr));
        return (
            <div className='p-4 space-y-4 pb-28'>
                <div className='flex flex-col gap-4 mb-6 px-2'>
                    <div className='flex justify-between items-center'><div className='flex items-center gap-2 text-[#ffcf4b]'><History size={20} /><h2 className='text-lg font-black uppercase italic'>ISTORIYA</h2></div><button onClick={() => { if (window.confirm('Istoriya tozalansinmi?')) setHistoryEntries([]) }} className='text-[8px] font-black opacity-20 uppercase'>Tozalash</button></div>
                    <div className='flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 overflow-hidden'>
                        <Calendar size={18} className='text-[#ffcf4b] shrink-0' />
                        <input type="date" className='bg-transparent text-white font-black text-xs uppercase outline-none flex-1 border-none' value={selectedHistoryDate} onChange={(e) => setSelectedHistoryDate(e.target.value)} />
                    </div>
                </div>
                <div className='space-y-3'>
                    {filteredEntries.map(entry => (
                        <div key={entry.id} className='gold-glass !p-4 flex gap-4 bg-black/40 border-white/5'>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${entry.type === 'SESSION' ? 'bg-red-500/10 text-red-500' : entry.type === 'BAR' ? 'bg-[#ffcf4b]/10 text-[#ffcf4b]' : entry.type === 'INV' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-400'}`}>
                                {entry.type === 'SESSION' ? <Play size={18} /> : entry.type === 'BAR' ? <ShoppingCart size={18} /> : entry.type === 'INV' ? <Database size={18} /> : <Settings size={18} />}
                            </div>
                            <div className='flex-1'>
                                <div className='flex justify-between items-start mb-0.5'><h4 className='text-xs font-black uppercase tracking-tight'>{entry.title}</h4><span className='text-[8px] font-black opacity-20 tabular-nums'>{formatTimeShort(entry.timestamp)}</span></div>
                                <p className='text-[10px] opacity-40 font-medium leading-relaxed'>{entry.desc}</p>
                            </div>
                        </div>
                    ))}
                    {filteredEntries.length === 0 && <div className='flex flex-col items-center justify-center py-20 opacity-20 text-center'><History size={48} className='mb-4' /><p className='text-xs font-black uppercase text-center'>Ushbu sana uchun ma'lumot yo'q</p></div>}
                </div>
            </div>
        );
    };

    const renderClubXarita = () => (
        <div className='p-4 space-y-4 pb-28'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='w-full py-4 bg-[#ffcf4b] text-black font-black text-xs uppercase rounded-xl shadow-lg'>+ YANGI XONA</button>
            <div className='grid grid-cols-1 gap-4'>{(activeRooms || []).map(room => {
                const session = calculateSession(room); const isExp = expRooms[room?.id];
                return (
                    <div key={room.id} className={`gold-glass transition-all ${room.isBusy ? 'ring-1 ring-[#ffcf4b]/20 bg-black/60 shadow-2xl' : room.isSuspended ? 'opacity-40 grayscale border-red-500/20' : 'opacity-80'}`}>
                        <div className='p-4 border-b border-white/5 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                            <div className='flex items-center gap-3'><div className={`w-2 h-2.5 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div><div><h3 className='text-lg font-black italic uppercase tracking-tighter'>{room.name}</h3><p className='text-[8px] font-black opacity-40 uppercase'>{room.isBusy ? `OCHILGAN: ${session.startStr}` : 'READY'}</p></div></div>
                            <div className='flex gap-1.5' onClick={e => e.stopPropagation()}>
                                <button onClick={() => { const status = !room.isSuspended; setRooms(p => p.map(r => r.id === room.id ? { ...r, isSuspended: status, isBusy: false } : r)); addToHistory('SYSTEM', room.name, status ? 'Xona bloklandi.' : 'Xonadan blok yechildi.', 'gray'); }} className={`p-2.5 rounded-xl transition-all ${room.isSuspended ? 'bg-red-500 text-white' : 'bg-white/5 text-white/30'}`}><PauseCircle size={18} /></button>
                                <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2.5 bg-white/5 rounded-xl text-white/30'><Edit3 size={18} /></button>
                                <button onClick={() => { if (window.confirm('O\'chirrilsinmi?')) { setRooms(p => p.filter(r => r.id !== room.id)); addToHistory('SYSTEM', room.name, 'Xona o\'chirildi.', 'red'); } }} className='p-2.5 bg-red-500/10 rounded-xl text-red-500/50'><Trash2 size={18} /></button>
                            </div>
                        </div>
                        {room.isBusy && (
                            <div className={`p-4 ${isExp ? 'space-y-4' : 'flex justify-between items-center'}`}>
                                <div className='flex flex-col'><p className='text-[7px] font-black opacity-30 uppercase'>Duration</p><p className={`${isExp ? 'text-3xl' : 'text-lg'} font-black gold-text italic tabular-nums`}>{session.time}</p></div>
                                {!isExp && <div className='text-right'><p className='text-[7px] font-black opacity-30 uppercase'>Total</p><p className='text-lg font-black tabular-nums'>{session.total.toLocaleString()} UZS</p></div>}
                                {isExp && (
                                    <div className='pt-4 border-t border-white/10 space-y-4'>
                                        <div className='flex justify-between items-center'><p className='text-lg font-black gold-text italic tabular-nums'>{session.total.toLocaleString()} <span className='text-[8px]'>UZS</span></p><button onClick={() => setSelectedRoomForBar(room)} className='bg-[#ffcf4b] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg shadow-[#ffcf4b]/20'>+ BAR</button></div>
                                        <div className='flex flex-wrap gap-1.5'>{(room.items || []).map((i, idx) => (<div key={idx} className='text-[8px] font-black uppercase bg-white/10 px-3 py-1.5 rounded-xl border border-white/5'>{i.name}</div>))}</div>
                                        <button onClick={() => { setFinalStats({ ...session }); setCheckoutRoom(room); }} className='w-full py-4 bg-red-600 rounded-2xl text-white font-black uppercase italic text-xs shadow-xl active:scale-95'>HISOBLASH VA YOPISH</button>
                                    </div>
                                )}
                            </div>
                        )}
                        {!room.isBusy && !room.isSuspended && (<div className='px-4 pb-4 pt-1'><button onClick={() => { setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r)); addToHistory('SESSION', room.name, 'Vaqt ochildi.', 'gold'); }} className='w-full py-4 bg-white/5 rounded-xl text-white font-black uppercase text-[10px] border border-white/5'>Ochish</button></div>)}
                    </div>
                );
            })}</div>
        </div>
    );

    const renderClubBar = () => (
        <div className='p-4 space-y-4 pb-28'>
            <div className='flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-4'>
                <button onClick={() => setBarSubTab('sotuv')} className={`flex-1 py-3 text-[9px] font-black uppercase rounded-xl ${barSubTab === 'sotuv' ? 'bg-[#ffcf4b] text-black shadow-lg' : 'text-white/30'}`}>Sotuv</button>
                <button onClick={() => setBarSubTab('ombor')} className={`flex-1 py-3 text-[9px] font-black uppercase rounded-xl ${barSubTab === 'ombor' ? 'bg-white/10 text-white' : 'text-white/30'}`}>Ombor</button>
            </div>
            {barSubTab === 'sotuv' ? (
                <div className='grid grid-cols-2 gap-2.5'>{(inventory || []).map(item => (<button key={item.id} onClick={() => { if (item.stock <= 0) return alert('Omborda yo\'q!'); if (window.confirm(`${item.name} sotilsinmi?`)) { setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSalesLog(p => [...p, { id: Date.now(), amount: item.price, timestamp: Date.now(), club: currentAdminData.club }]); addToHistory('BAR', item.name, `Mahsulot sotildi: ${item.price.toLocaleString()} UZS`, 'gold'); } }} className='gold-glass !p-4 bg-black/40 border-white/5 text-left h-[120px] flex flex-col justify-between'><div><p className='text-[7px] opacity-40 font-black uppercase'>{item.category}</p><h4 className='text-xs font-black italic gold-text'>{item.name}</h4></div><p className='text-[10px] font-black'>{item.price.toLocaleString()} UZS</p></button>))}</div>
            ) : (
                <div className='space-y-3'>
                    <button onClick={() => setShowInventoryModal(true)} className='w-full py-4 bg-white/5 rounded-xl font-black text-[9px] uppercase border border-white/10'>+ MAHSULOT QO'SHISH</button>
                    {(inventory || []).map(item => (<div key={item.id} className='gold-glass !p-4 flex justify-between items-center text-xs'><div className='flex items-center gap-3'><div className='w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#ffcf4b]'><Package size={16} /></div><div><h4 className='font-black'>{item.name}</h4><p className='text-[8px] opacity-30'>Qoldiq: {item.stock} ta</p></div></div><button onClick={() => { setInventory(p => p.filter(i => i.id !== item.id)); addToHistory('INV', item.name, 'Ombordan o\'chirildi.', 'gray'); }} className='p-2 bg-red-500/10 rounded-xl text-red-500'><Trash2 size={14} /></button></div>))}
                </div>
            )}
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg pb-32 font-sans'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <div className='w-16 h-16 rounded-[2rem] bg-[#ffcf4b] flex items-center justify-center mb-10 shadow-2xl shadow-[#ffcf4b]/20'><Lock size={28} className='text-black' /></div>
                        <h1 className='text-4xl font-black italic mb-10 uppercase text-[#ffcf4b] tracking-tighter'>PLS_COUNCIL</h1>
                        <input type="text" placeholder="LOGIN" className='input-luxury-small h-14 w-full max-w-[280px]' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button onClick={() => setView('clubDashboard')} className='btn-gold-minimal mt-8 py-4.5 w-full max-w-[280px] text-base font-black uppercase rounded-[1.5rem]'>KIRISH</button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='px-6 py-4 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-3'><div className='w-10 h-10 rounded-xl bg-[#ffcf4b] flex items-center justify-center shadow-lg'><Activity size={20} className='text-black' /></div><div><h2 className='text-base font-black italic uppercase tracking-tighter'>{currentAdminData?.name}</h2><p className='text-[7px] font-black opacity-30 uppercase tracking-[2px]'>{currentAdminData?.club}</p></div></div>
                            <div className='text-right group'><p className='text-[11px] font-black gold-text tabular-nums italic'>{new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p><p className='text-[6px] opacity-30 font-black uppercase italic'>SYSTEM_LIVE</p></div>
                        </div>
                        <main>{activeTab === 'asosiy' ? renderClubAsosiy() : activeTab === 'bar' ? renderClubBar() : activeTab === 'history' ? renderClubHistory() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-4 left-4 right-4 bg-black/95 backdrop-blur-3xl border border-white/10 p-2.5 rounded-[2.5rem] flex justify-between z-50 shadow-2xl'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex-1 flex flex-col items-center py-2 gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b] scale-105' : 'text-white/20'}`}><BarChart size={20} /><span className='text-[7px] font-black uppercase tracking-widest'>ASOSIY</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex-1 flex flex-col items-center py-2 gap-1 ${activeTab === 'xarita' ? 'text-[#ffcf4b] scale-105' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[7px] font-black uppercase tracking-widest'>XARITA</span></button>
                    <button onClick={() => setActiveTab('bar')} className={`flex-1 flex flex-col items-center py-2 gap-1 ${activeTab === 'bar' ? 'text-[#ffcf4b] scale-105' : 'text-white/20'}`}><Boxes size={20} /><span className='text-[7px] font-black uppercase tracking-widest'>BAR</span></button>
                    <button onClick={() => setActiveTab('history')} className={`flex-1 flex flex-col items-center py-2 gap-1 ${activeTab === 'history' ? 'text-[#ffcf4b] scale-105' : 'text-white/20'}`}><History size={20} /><span className='text-[7px] font-black uppercase tracking-widest'>ISTORIYA</span></button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {checkoutRoom && finalStats && (
                    <div className='modal-overlay'><motion.div initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className='modal-content !p-5 !max-w-[92%] border border-white/10'>
                        <h2 className='text-lg font-black italic gold-text text-center mb-5 uppercase tracking-widest'>HISOBLASH</h2>
                        <div className='grid grid-cols-2 gap-2 mb-4'>
                            <div className='gold-glass !p-2.5 border-white/5 text-center'><p className='text-[6px] opacity-40 uppercase font-black'>BOSHLANDI</p><p className='text-sm font-black italic'>{finalStats.startStr}</p></div>
                            <div className='gold-glass !p-2.5 border-white/5 text-center'><p className='text-[6px] opacity-40 uppercase font-black'>TUGADI</p><p className='text-sm font-black italic gold-text'>{finalStats.endStr}</p></div>
                        </div>
                        <div className='gold-glass !p-4 text-center mb-5 bg-[#ffcf4b]/5 relative'>
                            <p className='text-[7px] opacity-40 font-black mb-1 italic'>DAVOMIYLIGI: <span className='text-white'>{finalStats.time}</span></p>
                            <p className='text-4xl font-black gold-text italic tracking-tighter tabular-nums'>{finalStats.total.toLocaleString()} <span className='text-[10px] opacity-40 uppercase'>UZS</span></p>
                        </div>
                        <input type="number" placeholder="OLINGAN PUL" className='input-luxury-small h-12 text-xl font-black text-center mb-5' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                        <div className='flex flex-col gap-2'>
                            <button onClick={confirmCheckout} className='py-4.5 bg-[#ffcf4b] text-black text-xs font-black uppercase rounded-xl shadow-lg'>TASDIQLASH</button>
                            <button onClick={() => setCheckoutRoom(null)} className='py-2 text-[8px] opacity-20 font-black uppercase'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {showInventoryModal && (<div className='modal-overlay'><motion.div className='modal-content !p-6'><h2 className='text-xl font-black gold-text mb-6 text-center uppercase'>MAHSULOT</h2><div className='space-y-4'><input type="text" placeholder="NOMI" className='input-luxury-small h-14' value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /><div className='grid grid-cols-2 gap-3'><input type="number" placeholder="NARXI" className='input-luxury-small h-14' value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} /><input type="number" placeholder="SKLAD" className='input-luxury-small h-14' value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })} /></div><button onClick={() => { setInventory([...inventory, { ...newItem, id: Date.now(), sold: 0 }]); addToHistory('INV', newItem.name, `Mahsulot omborga qo'shildi: ${newItem.stock} ta`, 'blue'); setShowInventoryModal(false); }} className='w-full py-5 bg-[#ffcf4b] text-black font-black uppercase rounded-2xl'>SAQLASH</button></div></motion.div></div>)}
                {selectedRoomForBar && (<div className='modal-overlay'><motion.div className='modal-content !p-6'><div className='flex justify-between items-center mb-6'><p className='text-sm font-black italic gold-text uppercase'>BAR XIZMATI</p><button onClick={() => setSelectedRoomForBar(null)} className='p-2 bg-white/5 rounded-full'><X size={16} /></button></div><div className='grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto px-1'>{(inventory || []).map(item => (<button key={item.id} disabled={item.stock <= 0} onClick={() => { setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r)); setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); addToHistory('BAR', item.name, `Xonaga mahsulot berildi: ${selectedRoomForBar.name}`, 'gold'); setSelectedRoomForBar(null); }} className='gold-glass !p-3.5 h-[100px] text-left text-[8px] font-black uppercase active:scale-95 disabled:opacity-20 flex flex-col justify-between'><span>{item.name}</span><span className='gold-text'>{item.price.toLocaleString()}</span></button>))}</div></motion.div></div>)}
                {showAddRoom && (<div className='modal-overlay'><motion.div className='modal-content !p-6'><h2 className='text-lg font-black italic text-center mb-6 uppercase'>XONA MA'LUMOTLARI</h2><div className='space-y-4'><input type="text" placeholder="NOMI" className='input-luxury-small h-14' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} /><input type="number" placeholder="NARXI (SOAT)" className='input-luxury-small h-14' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: Number(e.target.value) }) : setNewRoom({ ...newRoom, price: Number(e.target.value) })} /><button onClick={() => { if (editingRoom) { setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r)); addToHistory('SYSTEM', editingRoom.name, 'Xona tahrirlandi.', 'gray'); setEditingRoom(null); } else { setRooms([...rooms, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, isSuspended: false }]); addToHistory('SYSTEM', newRoom.name, 'Yangi xona qo\'shildi.', 'blue'); } setShowAddRoom(false); }} className='w-full py-5 bg-[#ffcf4b] text-black font-black uppercase rounded-2xl shadow-xl'>SAQLASH</button></div></motion.div></div>)}
            </AnimatePresence>
        </div>
    );
};

export default App;
