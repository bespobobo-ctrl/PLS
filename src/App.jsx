import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight, BarChart, Boxes, LayoutGrid, Eye, EyeOff, ExternalLink, ListChecks, Info, ChevronLeft, Layout as LayoutIcon
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
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

    const addToHistory = (type, title, desc) => {
        const newEntry = { id: Date.now(), timestamp: Date.now(), type, title, desc, club: currentAdminData.club, dateStr: new Date().toISOString().split('T')[0] };
        setHistoryEntries(prev => [newEntry, ...(prev || []).slice(0, 499)]);
    };

    const currentAdminData = useMemo(() => {
        return (clubAdmins || []).find(a => a?.login === username) || { name: 'ADMIN', club: 'PLS' };
    }, [clubAdmins, username]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const calculateSession = (room, targetNow = now) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, items: [], startStr: '--:--' };
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
            const daily = clubLog.filter(s => (nowTime - s.timestamp) < day).reduce((acc, s) => acc + s.amount, 0);
            const weekly = clubLog.filter(s => (nowTime - s.timestamp) < week).reduce((acc, s) => acc + s.amount, 0);
            const monthly = clubLog.filter(s => (nowTime - s.timestamp) < month).reduce((acc, s) => acc + s.amount, 0);
            const yearly = clubLog.filter(s => (nowTime - s.timestamp) < year).reduce((acc, s) => acc + s.amount, 0);
            const activeRev = (activeRooms || []).filter(r => r?.isBusy).reduce((acc, r) => acc + calculateSession(r).total, 0);
            const totalD = (debts || []).filter(d => d?.club === currentAdminData?.club).reduce((acc, d) => acc + (d?.amount || 0), 0);
            return { daily: daily + activeRev, weekly: weekly + activeRev, monthly: monthly + activeRev, yearly: yearly + activeRev, totalDept: totalD, totalR: activeRooms.length, busyR: activeRooms.filter(r => r.isBusy).length, freeR: activeRooms.filter(r => !r.isBusy && !r.isSuspended).length };
        } catch { return { daily: 0, weekly: 0, monthly: 0, yearly: 0, totalDept: 0, totalR: 0, busyR: 0, freeR: 0 }; }
    }, [salesLog, debts, currentAdminData?.club, activeRooms, now]);

    const confirmCheckout = () => {
        const stats = finalStats; const paid = Number(paidAmount) || 0;
        if (paid > 0) setSalesLog(p => [...(p || []), { id: Date.now(), amount: paid, timestamp: Date.now(), club: checkoutRoom?.club }]);
        if ((stats?.total || 0) - paid > 0) setDebts(p => [...(p || []), { id: Date.now(), name: debtUser.name || 'Mijoz', phone: debtUser.phone || '', amount: stats.total - paid, date: new Date().toLocaleString(), timestamp: Date.now(), club: checkoutRoom?.club }]);
        addToHistory('SESS', checkoutRoom.name, `Xona yopildi: ${stats.total.toLocaleString()} UZS`);
        setRooms(prev => (prev || []).map(r => r.id === checkoutRoom?.id ? { ...r, isBusy: false, startTime: null, items: [] } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
    };

    const renderClubAsosiy = () => (
        <div className='p-6 space-y-5 pb-32 animate-fade-in'>
            <div className='flex gap-3'>
                <div className='gold-glass flex-1 !p-3 bg-white/5 border-transparent text-center'><p className='text-[8px] font-black opacity-30 mb-1 uppercase'>JAMI</p><p className='text-sm font-black gold-text'>{analytics.totalR}</p></div>
                <div className='gold-glass flex-1 !p-3 bg-white/5 border-transparent text-center'><p className='text-[8px] font-black opacity-30 mb-1 uppercase'>BAND</p><p className='text-sm font-black gold-text'>{analytics.busyR}</p></div>
                <div className='gold-glass flex-1 !p-3 bg-white/5 border-transparent text-center'><p className='text-[8px] font-black opacity-30 mb-1 uppercase'>BO'SH</p><p className='text-sm font-black gold-text'>{analytics.freeR}</p></div>
            </div>
            <div className='gold-glass !p-7 bg-gradient-to-br from-[#ffcf4b]/10 to-transparent border-[#ffcf4b]/10 rounded-[2.5rem] relative overflow-hidden'>
                <div className='absolute -right-10 -top-10 w-40 h-40 bg-[#ffcf4b]/5 rounded-full blur-3xl'></div>
                <p className='text-[10px] font-black opacity-40 uppercase tracking-[3px] mb-2'>BUGUNGI KASSA</p>
                <h2 className='text-4xl font-black italic gold-text tracking-tighter tabular-nums'>{analytics.daily.toLocaleString()} <span className='text-xs opacity-30 NOT-italic ml-1'>UZS</span></h2>
            </div>
            <div className='grid grid-cols-3 gap-3'>
                <div className='gold-glass !p-4 bg-white/5 border-transparent text-center'><p className='text-[7px] opacity-30 font-black mb-1 uppercase'>HAFTA</p><p className='text-xs font-black'>{analytics.weekly.toLocaleString()}</p></div>
                <div className='gold-glass !p-4 bg-white/5 border-transparent text-center'><p className='text-[7px] opacity-30 font-black mb-1 uppercase'>OY</p><p className='text-xs font-black'>{analytics.monthly.toLocaleString()}</p></div>
                <div className='gold-glass !p-4 bg-white/5 border-transparent text-center'><p className='text-[7px] opacity-30 font-black mb-1 uppercase'>YIL</p><p className='text-xs font-black gold-text'>{analytics.yearly.toLocaleString()}</p></div>
            </div>
            <div className='pt-2 space-y-3'>
                <p className='text-[10px] font-black opacity-20 uppercase tracking-widest px-1'>JONLI MONITORING</p>
                {(activeRooms || []).filter(r => r?.isBusy).map(r => {
                    const s = calculateSession(r);
                    return (<div key={r.id} onClick={() => setActiveTab('xarita')} className='gold-glass !p-5 flex justify-between items-center bg-black/30 border-white/5 active:scale-[0.98] transition-all cursor-pointer'><div><p className='text-xs font-black italic uppercase'>{r.name}</p><p className='text-[9px] opacity-30 mt-0.5'>{s.time} • {s.startStr}</p></div><p className='text-sm font-black gold-text'>{s.total.toLocaleString()}</p></div>);
                })}
            </div>
            <div className='gold-glass !p-6 bg-red-500/5 border-red-500/10'>
                <div onClick={() => setShowDebtsInAsosiy(!showDebtsInAsosiy)} className='flex justify-between items-center cursor-pointer'><div className='flex items-center gap-3'><Users size={18} className='text-red-500' /><p className='text-sm font-black'>QARZLAR: <span className='text-red-500'>{analytics.totalDept.toLocaleString()} UZS</span></p></div>{showDebtsInAsosiy ? <ChevronUp size={16} className='opacity-30' /> : <ChevronDown size={16} className='opacity-30' />}</div>
                <AnimatePresence>{showDebtsInAsosiy && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='mt-5 space-y-3 overflow-hidden'>
                    {(debts || []).filter(d => d?.club === currentAdminData?.club).reverse().map(d => (
                        <div key={d.id} className='bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center'><div className='space-y-1'><h4 className='text-[11px] font-black uppercase'>{d.name}</h4><p className='text-[10px] text-red-500 font-bold tracking-tight'>-{d.amount.toLocaleString()} UZS</p></div><button onClick={() => { if (window.confirm('Qarz to\'landimi?')) setDebts(p => p.filter(x => x.id !== d.id)) }} className='p-3 bg-green-500/10 text-green-500 rounded-xl active:scale-90 transition-all'><CheckCircle2 size={16} /></button></div>
                    ))}
                    {(debts || []).filter(d => d?.club === currentAdminData?.club).length === 0 && <p className='text-center py-4 text-[9px] opacity-30 font-black'>QARZLAR YO'Q</p>}
                </motion.div>)}</AnimatePresence>
            </div>
        </div>
    );

    const renderClubHistory = () => {
        const filteredEntries = (historyEntries || []).filter(e => e?.club === currentAdminData?.club && (e.dateStr === selectedHistoryDate || !e.dateStr));
        const dates = []; for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); dates.push(d.toISOString().split('T')[0]); }
        return (
            <div className='p-6 space-y-6 pb-32 animate-fade-in'>
                <div className='flex justify-between items-end px-1'><div className='flex items-center gap-3'><History size={24} className='text-[#ffcf4b]' /><h2 className='text-xl font-black italic gold-text uppercase'>ISTORIYA</h2></div><input type="date" className='bg-transparent text-[9px] font-black uppercase opacity-20 outline-none' value={selectedHistoryDate} onChange={(e) => setSelectedHistoryDate(e.target.value)} /></div>
                <div className='flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1'>
                    {dates.map(dStr => {
                        const dateObj = new Date(dStr); const isSel = selectedHistoryDate === dStr;
                        return (
                            <button key={dStr} onClick={() => setSelectedHistoryDate(dStr)} className={`shrink-0 w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${isSel ? 'bg-[#ffcf4b] text-black shadow-lg' : 'bg-white/5 text-white/40'}`}>
                                <span className='text-[7px] font-black uppercase opacity-60'>{dateObj.toLocaleDateString('uz-UZ', { weekday: 'short' })}</span>
                                <span className='text-sm font-black italic'>{dateObj.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
                <div className='space-y-3'>
                    {filteredEntries.map(e => (
                        <div key={e.id} className='gold-glass !p-4 flex gap-4 bg-black/30 border-white/5 active:bg-white/5 transition-all'>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${e.type === 'SESS' ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/20'}`}>{e.type === 'SESS' ? <Play size={16} /> : <ShoppingCart size={16} />}</div>
                            <div className='flex-1 py-1'><div className='flex justify-between items-start mb-0.5'><h4 className='text-[11px] font-black uppercase text-white/80'>{e.title}</h4><span className='text-[8px] opacity-20 font-black'>{formatTimeShort(e.timestamp)}</span></div><p className='text-[10px] opacity-40 leading-relaxed'>{e.desc}</p></div>
                        </div>
                    ))}
                    {filteredEntries.length === 0 && <p className='text-center py-24 text-[10px] opacity-20 font-black uppercase'>MAHLUMOT TOPILMADI</p>}
                </div>
            </div>
        );
    };

    const renderClubXarita = () => (
        <div className='p-6 space-y-4 pb-32 animate-fade-in'>
            <div className='flex justify-between items-center mb-2 px-1'><p className='text-[10px] font-black opacity-20 uppercase tracking-[2px]'>XONALAR RO'YXATI</p></div>
            <div className='grid grid-cols-1 gap-4'>{(activeRooms || []).map(r => {
                const s = calculateSession(r); const isExp = expRooms[r?.id];
                return (
                    <div key={r.id} className={`gold-glass transition-all border-white/5 ${r.isBusy ? 'bg-black/60 shadow-xl border-[#ffcf4b]/10' : 'bg-black/20 opacity-70'}`}>
                        <div className='p-5 flex justify-between items-center' onClick={() => r.isBusy && setExpRooms(p => ({ ...p, [r.id]: !isExp }))}>
                            <div className='flex items-center gap-4'><div className={`w-2.5 h-2.5 rounded-full ${r.isBusy ? 'bg-[#ffcf4b] animate-pulse shadow-[0_0_10px_#ffcf4b]' : 'bg-white/5'}`}></div><div><h3 className='text-lg font-black italic uppercase'>{r.name}</h3><p className='text-[8px] opacity-30 uppercase font-black tracking-widest mt-0.5'>{r.isBusy ? `OCHIK: ${s.startStr}` : 'BO\'SH'}</p></div></div>
                            <div className='flex gap-2' onClick={e => e.stopPropagation()}>
                                <button onClick={() => { setEditingRoom(r); setShowAddRoom(true); }} className='p-3 bg-white/5 rounded-2xl text-white/30 active:scale-90 transition-all'><Edit3 size={18} /></button>
                                <button onClick={() => { if (window.confirm('O\'chirrilsinmi?')) { setRooms(p => p.filter(x => x.id !== r.id)); addToHistory('SYS', r.name, 'Xona o\'chirildi.'); } }} className='p-3 bg-red-500/10 text-red-500/40 rounded-2xl active:scale-90 transition-all'><Trash2 size={18} /></button>
                            </div>
                        </div>
                        {r.isBusy ? (
                            <div className={`px-5 pb-5 ${isExp ? 'space-y-5 pt-3 border-t border-white/5' : 'flex justify-between items-center'}`}>
                                <div className='flex flex-col'><p className='text-[7px] font-black opacity-30 uppercase tracking-widest'>VAQT</p><p className={`${isExp ? 'text-4xl' : 'text-xl'} font-black gold-text italic tabular-nums tracking-tighter`}>{s.time}</p></div>
                                {!isExp && <p className='text-base font-black gold-text tracking-tighter'>{s.total.toLocaleString()} <span className='text-[8px] opacity-30 ml-0.5'>UZS</span></p>}
                                {isExp && (
                                    <div className='space-y-5'>
                                        <div className='flex justify-between items-center'><p className='text-3xl font-black gold-text italic tracking-tighter'>{s.total.toLocaleString()}</p><button onClick={() => setSelectedRoomForBar(r)} className='bg-[#ffcf4b] text-black px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-lg shadow-[#ffcf4b]/20 active:scale-90 transition-all'>+ BAR</button></div>
                                        <div className='flex flex-wrap gap-1.5'>{(r.items || []).map((i, idx) => (<div key={idx} className='text-[8px] font-black uppercase bg-white/5 px-4 py-2 rounded-2xl border border-white/5'>{i.name}</div>))}</div>
                                        <button onClick={() => { setFinalStats({ ...s }); setCheckoutRoom(r); }} className='w-full py-5 bg-red-600 rounded-3xl text-white font-black uppercase italic text-xs shadow-xl active:scale-95 transition-all'>YOPISH VA HISOBLASH</button>
                                    </div>
                                )}
                            </div>
                        ) : (<div className='px-5 pb-5'><button onClick={() => { setRooms(p => p.map(x => x.id === r.id ? { ...x, isBusy: true, startTime: Date.now(), items: [] } : x)); addToHistory('SESS', r.name, 'Xona ochildi.'); }} className='w-full py-4.5 bg-white/5 rounded-2xl text-white/40 font-black uppercase text-[10px] border border-white/5 active:bg-[#ffcf4b] active:text-black transition-all'>Xonani Ochish</button></div>)}
                    </div>
                );
            })}</div>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='fixed right-6 bottom-32 w-14 h-14 bg-[#ffcf4b] rounded-[1.8rem] flex items-center justify-center text-black shadow-[0_15px_40px_rgba(255,207,75,0.4)] active:scale-[0.85] transition-all z-50 border-[3px] border-black'><Plus size={30} strokeWidth={3} /></button>
        </div>
    );

    const renderClubBar = () => (
        <div className='p-6 space-y-6 pb-32 animate-fade-in'>
            <div className='flex justify-between items-end mb-2'><h2 className='text-xl font-black italic gold-text uppercase'>BAR PANEL</h2><div className='flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5'><button onClick={() => setBarSubTab('sotuv')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${barSubTab === 'sotuv' ? 'bg-[#ffcf4b] text-black shadow-md' : 'text-white/20'}`}>Sotuv</button><button onClick={() => setBarSubTab('ombor')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${barSubTab === 'ombor' ? 'bg-white/10 text-white' : 'text-white/20'}`}>Ombor</button></div></div>
            {barSubTab === 'sotuv' ? (
                <div className='grid grid-cols-2 gap-4'>
                    {(inventory || []).length > 0 ? (inventory || []).map(item => (<button key={item.id} onClick={() => { if (item.stock <= 0) return alert('Omborda yo\'q!'); if (window.confirm('Sotilsinmi?')) { setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSalesLog(p => [...p, { id: Date.now(), amount: item.price, timestamp: Date.now(), club: currentAdminData.club }]); addToHistory('BAR', item.name, `Sotuv: ${item.price.toLocaleString()} UZS`); } }} className='gold-glass !p-5 bg-black/40 text-left h-28 flex flex-col justify-between active:scale-95 transition-all border-white/5'><div><p className='text-[7px] opacity-30 font-black uppercase mb-1'>{item.category}</p><h4 className='text-xs font-black uppercase gold-text italic'>{item.name}</h4></div><p className='text-[11px] font-black tabular-nums'>{item.price.toLocaleString()} UZS</p></button>)) : <div className='col-span-2 py-32 text-center opacity-20 text-[10px] font-black uppercase tracking-widest'>OMBOR BO'SH</div>}
                </div>
            ) : (
                <div className='space-y-4'>
                    <button onClick={() => setShowInventoryModal(true)} className='w-full py-5 bg-white/5 border border-dashed border-white/10 rounded-[2rem] text-[10px] font-black uppercase text-[#ffcf4b] active:scale-95 transition-all'>+ YANGI MAHSULOT QO'SHISH</button>
                    {(inventory || []).map(item => (<div key={item.id} className='gold-glass !p-5 flex justify-between items-center bg-black/30 border-white/5'><div className='flex items-center gap-4'><div className='w-10 h-10 border border-white/5 bg-white/5 rounded-2xl flex items-center justify-center text-[#ffcf4b]'><Package size={20} /></div><div><h4 className='text-[11px] font-black uppercase'>{item.name}</h4><p className='text-[8px] opacity-30 tracking-widest'>{item.stock} ta qoldi</p></div></div><button onClick={() => { if (window.confirm('O\'chirilsinmi?')) setInventory(p => p.filter(i => i.id !== item.id)) }} className='p-3 bg-red-500/10 text-red-500 rounded-2xl active:scale-90 transition-all font-black text-[9px]'><Trash2 size={16} /></button></div>))}
                </div>
            )}
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg font-sans overflow-x-hidden selection:bg-[#ffcf4b]/30'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <div className='w-20 h-20 rounded-[2.5rem] bg-[#ffcf4b] flex items-center justify-center mb-12 shadow-2xl shadow-[#ffcf4b]/20'><Lock size={32} className='text-black' /></div>
                        <h2 className='text-4xl font-black italic mb-12 text-[#ffcf4b] tracking-tighter'>PLS_ACCESS</h2>
                        <input type="text" placeholder="LOGIN ID" className='input-luxury-small h-16 w-full max-w-[300px] text-center' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button onClick={() => setView('clubDashboard')} className='btn-gold-minimal mt-10 py-5 w-full max-w-[300px] text-lg font-black uppercase rounded-[2rem]'>TIZIMGA KIRISH</button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <header className='px-7 py-6 flex justify-between items-center bg-black/70 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'><div className='w-11 h-11 rounded-2xl bg-[#ffcf4b] flex items-center justify-center shadow-lg'><Activity size={22} className='text-black' /></div><div><h2 className='text-base font-black italic uppercase tracking-tighter'>{currentAdminData?.name}</h2><p className='text-[8px] opacity-30 uppercase font-black tracking-[4px]'>{currentAdminData?.club}</p></div></div>
                            <p className='text-[11px] font-black gold-text tabular-nums italic tracking-[2px]'>{new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
                        </header>
                        <main className='max-w-[480px] mx-auto pb-40'>{activeTab === 'asosiy' ? renderClubAsosiy() : activeTab === 'bar' ? renderClubBar() : activeTab === 'history' ? renderClubHistory() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Professional Floating Toolbar */}
            {view !== 'login' && (
                <div className='fixed bottom-8 left-0 right-0 flex justify-center z-50 px-8'>
                    <nav className='bg-black/80 backdrop-blur-3xl border border-white/10 p-2 rounded-[2.8rem] flex items-center shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative w-full max-w-[400px]'>
                        {['asosiy', 'xarita', 'bar', 'history'].map((tab) => {
                            const isSel = activeTab === tab;
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`relative flex-1 py-4 flex flex-col items-center justify-center gap-1.5 transition-all duration-500 rounded-[2rem] ${isSel ? 'text-black' : 'text-white/20'}`}>
                                    {isSel && <motion.div layoutId='tab-bg' className='absolute inset-0 bg-[#ffcf4b] rounded-[2rem] shadow-[0_10px_25px_rgba(255,207,75,0.4)]' transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
                                    <div className='relative z-10'>{tab === 'asosiy' ? <BarChart2 size={22} /> : tab === 'xarita' ? <Monitor size={22} /> : tab === 'bar' ? <Boxes size={22} /> : <History size={22} />}</div>
                                    {isSel && <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className='relative z-10 text-[8px] font-black uppercase tracking-widest'>{tab.slice(0, 4)}</motion.span>}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            )}

            {/* Unified Modal System with Cancel buttons */}
            <AnimatePresence>
                {checkoutRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='modal-content !p-8 !rounded-[3rem] !max-w-[90%] border border-[#ffcf4b]/10'>
                        <h2 className='text-2xl font-black italic gold-text text-center mb-8 uppercase tracking-[3px]'>YOPISH VA HISOBLASH</h2>
                        <div className='gold-glass !p-7 bg-[#ffcf4b]/5 text-center mb-8 border-transparent rounded-[2rem]'>
                            <p className='text-[9px] font-black opacity-30 uppercase tracking-[4px] mb-3'>UMUMIY SUMMA</p>
                            <p className='text-5xl font-black italic tracking-tighter tabular-nums gold-text'>{finalStats.total.toLocaleString()}<span className='text-[11px] NOT-italic opacity-30 ml-2 uppercase'>UZS</span></p>
                        </div>
                        <div className='space-y-4 mb-8'>
                            <input type="number" placeholder="OLINGAN PUL" className='input-luxury-small h-16 text-2xl font-black text-center outline-none border-white/10 rounded-[1.5rem]' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {(finalStats.total - Number(paidAmount) > 0 && Number(paidAmount) > 0) && (
                                <div className='p-5 bg-red-500/5 rounded-2xl border border-red-500/10 space-y-3'>
                                    <p className='text-[9px] font-black text-red-500 text-center uppercase tracking-widest mb-1'>QARZDORLIK QOLDI</p>
                                    <input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small h-12 text-[10px]' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL RAQAM" className='input-luxury-small h-12 text-[10px]' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col gap-3'>
                            <button onClick={confirmCheckout} className='py-5 bg-[#ffcf4b] text-black text-sm font-black uppercase rounded-2xl shadow-xl active:scale-95 transition-all'>TO'LOVNI TASDIQLASH</button>
                            <button onClick={() => setCheckoutRoom(null)} className='py-4 text-[10px] opacity-40 font-black uppercase tracking-widest hover:opacity-100 transition-all'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {showAddRoom && (<div className='modal-overlay'><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='modal-content !p-8 !rounded-[3rem] border border-white/5'><h2 className='text-2xl font-black italic uppercase gold-text text-center mb-8 tracking-tighter'>XONA SOZLAMALARI</h2><div className='space-y-5'><input type="text" placeholder="XONA NOMI (MASALAN: VIP)" className='input-luxury-small h-16 text-center' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} /><input type="number" placeholder="SOATIGA NARXI (UZS)" className='input-luxury-small h-16 text-center' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: Number(e.target.value) }) : setNewRoom({ ...newRoom, price: Number(e.target.value) })} /><div className='flex flex-col gap-3 pt-4'><button onClick={() => { if (editingRoom) { setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r)); setEditingRoom(null); } else { setRooms([...rooms, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, isSuspended: false }]); } setShowAddRoom(false); }} className='py-5 bg-[#ffcf4b] text-black font-black uppercase rounded-2xl shadow-xl active:scale-95 transition-all'>SAQLASH</button><button onClick={() => setShowAddRoom(false)} className='py-3 text-[10px] opacity-30 font-black uppercase tracking-widest'>BEKOR QILISH</button></div></div></motion.div></div>)}
                {showInventoryModal && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[3rem]'><h2 className='text-2xl font-black gold-text text-center mb-8 uppercase tracking-tighter'>YANGI MAHSULOT</h2><div className='space-y-4'><input type="text" placeholder="NOMI" className='input-luxury-small h-16 text-center' value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /><div className='grid grid-cols-2 gap-4'><input type="number" placeholder="NARXI" className='input-luxury-small h-16 text-center' value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} /><input type="number" placeholder="SONI" className='input-luxury-small h-16 text-center' value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })} /></div><div className='flex flex-col gap-3 pt-4'><button onClick={() => { setInventory([...inventory, { ...newItem, id: Date.now(), sold: 0 }]); setShowInventoryModal(false); }} className='py-5 bg-[#ffcf4b] text-black font-black uppercase rounded-2xl active:scale-95 transition-all'>OMBORGA QO'SHISH</button><button onClick={() => setShowInventoryModal(false)} className='py-3 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button></div></div></motion.div></div>)}
                {selectedRoomForBar && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[3rem]'><div className='flex justify-between items-center mb-8'><p className='text-xl font-black italic gold-text uppercase'>BAR TANLASH</p><button onClick={() => setSelectedRoomForBar(null)} className='p-3 bg-white/5 rounded-full text-white/30'><X size={20} /></button></div><div className='grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto no-scrollbar'>{(inventory || []).map(item => (<button key={item.id} disabled={item.stock <= 0} onClick={() => { setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r)); setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); addToHistory('BAR', item.name, `Xonaga berildi: ${selectedRoomForBar.name}`); setSelectedRoomForBar(null); }} className='bg-white/5 p-5 rounded-3xl text-left text-[9px] font-black uppercase active:scale-[0.9] transition-all flex flex-col justify-between h-28 border border-white/5'><span>{item.name}</span><span className='gold-text text-sm'>{item.price.toLocaleString()}</span></button>))}</div><button onClick={() => setSelectedRoomForBar(null)} className='w-full mt-6 py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button></motion.div></div>)}
            </AnimatePresence>
        </div>
    );
};

const BarChart2 = ({ size, className }) => <BarChart3 size={size} className={className} />;

export default App;
