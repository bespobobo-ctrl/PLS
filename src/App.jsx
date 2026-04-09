import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight, BarChart, Boxes, LayoutGrid, Eye, EyeOff, ExternalLink, ListChecks, Info, ChevronLeft, Layout as LayoutIcon, Receipt
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
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

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

    const addToHistory = (type, title, desc, extra = {}) => {
        const newEntry = { id: Date.now(), timestamp: Date.now(), type, title, desc, club: currentAdminData.club, dateStr: new Date().toISOString().split('T')[0], ...extra };
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
            const dailySales = clubLog.filter(s => (nowTime - s.timestamp) < day);
            const dailyBar = dailySales.filter(s => s?.type === 'BAR').reduce((acc, s) => acc + s.amount, 0);
            const dailyRoom = dailySales.filter(s => s?.type === 'ROOM' || !s?.type).reduce((acc, s) => acc + s.amount, 0);
            const weekly = clubLog.filter(s => (nowTime - s.timestamp) < week).reduce((acc, s) => acc + s.amount, 0);
            const monthly = clubLog.filter(s => (nowTime - s.timestamp) < month).reduce((acc, s) => acc + s.amount, 0);
            const yearly = clubLog.filter(s => (nowTime - s.timestamp) < year).reduce((acc, s) => acc + s.amount, 0);
            const activeRev = (activeRooms || []).filter(r => r?.isBusy).reduce((acc, r) => acc + calculateSession(r).total, 0);
            const totalD = (debts || []).filter(d => d?.club === currentAdminData?.club).reduce((acc, d) => acc + (d?.amount || 0), 0);
            return { daily: dailyRoom + dailyBar + activeRev, dailyBar, dailyRoom: dailyRoom + activeRev, weekly: weekly + activeRev, monthly: monthly + activeRev, yearly: yearly + activeRev, totalDept: totalD, totalR: activeRooms.length, busyR: activeRooms.filter(r => r.isBusy).length, freeR: activeRooms.filter(r => !r.isBusy && !r.isSuspended).length };
        } catch { return { daily: 0, dailyBar: 0, dailyRoom: 0, weekly: 0, monthly: 0, yearly: 0, totalDept: 0, totalR: 0, busyR: 0, freeR: 0 }; }
    }, [salesLog, debts, currentAdminData?.club, activeRooms, now]);

    const confirmCheckout = () => {
        const stats = finalStats; const paid = Number(paidAmount) || 0;
        const endTimeStr = formatTimeShort(now);
        if (paid > 0) setSalesLog(p => [...(p || []), { id: Date.now(), amount: paid, timestamp: Date.now(), club: checkoutRoom?.club, type: 'ROOM' }]);
        if ((stats?.total || 0) - paid > 0) setDebts(p => [...(p || []), { id: Date.now(), name: debtUser.name || 'Mijoz', phone: debtUser.phone || '', amount: stats.total - paid, date: new Date().toLocaleString(), timestamp: Date.now(), club: checkoutRoom?.club }]);

        addToHistory('SESS_CLOSE', checkoutRoom.name, `Seans yakunlandi.`, {
            startTime: stats.startStr,
            endTime: endTimeStr,
            amount: stats.total,
            duration: stats.time
        });

        setRooms(prev => (prev || []).map(r => r.id === checkoutRoom?.id ? { ...r, isBusy: false, startTime: null, items: [] } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
    };

    const renderClubAsosiy = () => (
        <div className='p-6 space-y-5 pb-40 animate-fade-in'>
            <div className='flex gap-2.5'>
                <div className='bg-white/5 border border-white/5 flex-1 p-3 rounded-2xl text-center'><p className='text-[8px] font-black opacity-20 mb-0.5 uppercase'>JAMI</p><p className='text-xs font-black opacity-60'>{analytics.totalR}</p></div>
                <div className='bg-white/5 border border-white/5 flex-1 p-3 rounded-2xl text-center'><p className='text-[8px] font-black opacity-20 mb-0.5 uppercase'>BAND</p><p className='text-xs font-black gold-text'>{analytics.busyR}</p></div>
                <div className='bg-white/5 border border-white/5 flex-1 p-3 rounded-2xl text-center'><p className='text-[8px] font-black opacity-20 mb-0.5 uppercase'>BO'SH</p><p className='text-xs font-black text-green-500/60'>{analytics.freeR}</p></div>
            </div>
            <div className='relative p-7 rounded-[2rem] bg-gradient-to-br from-[#ffcf4b]/10 to-transparent border border-[#ffcf4b]/5 overflow-hidden'>
                <div className='absolute -right-5 -top-5 w-32 h-32 bg-[#ffcf4b]/5 rounded-full blur-3xl'></div>
                <div className='flex justify-between items-start mb-2'>
                    <div><p className='text-[9px] font-black opacity-30 uppercase tracking-[3px] mb-1'>UMUMIY KASSA</p><h2 className='text-4xl font-black italic gold-text tracking-tighter tabular-nums'>{analytics.daily.toLocaleString()} <span className='text-[10px] opacity-20 NOT-italic'>UZS</span></h2></div>
                    <div className='text-right'><TrendingUp size={16} className='text-[#ffcf4b] opacity-30 ml-auto mb-1' /><p className='text-[7px] font-black opacity-20 uppercase'>LIVE_DATA</p></div>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5'>
                    <div><p className='text-[7px] font-black opacity-20 uppercase mb-1 tracking-widest'>XONA SAVDOSI</p><p className='text-sm font-black text-white/80 tabular-nums'>{analytics.dailyRoom.toLocaleString()}</p></div>
                    <div className='text-right'><p className='text-[7px] font-black opacity-20 uppercase mb-1 tracking-widest'>BAR SAVDOSI</p><p className='text-sm font-black gold-text tabular-nums'>{analytics.dailyBar.toLocaleString()}</p></div>
                </div>
            </div>
            <div className='grid grid-cols-3 gap-2.5'>
                {[{ l: 'HAFTA', v: analytics.weekly }, { l: 'OY', v: analytics.monthly }, { l: 'YIL', v: analytics.yearly }].map((item, idx) => (
                    <div key={idx} className='bg-white/5 border border-white/5 p-4 rounded-2xl text-center'><p className='text-[7px] opacity-20 font-black mb-1 uppercase'>{item.l}</p><p className='text-[10px] font-black opacity-60'>{item.v.toLocaleString()}</p></div>
                ))}
            </div>
            <div className='pt-2 space-y-2.5'>
                <p className='text-[9px] font-black opacity-20 uppercase tracking-[3px] px-1'>JONLI MONITORING</p>
                {(activeRooms || []).filter(r => r?.isBusy).map(r => {
                    const s = calculateSession(r);
                    return (<div key={r.id} onClick={() => setActiveTab('xarita')} className='bg-white/5 border border-white/5 p-5 rounded-2xl flex justify-between items-center active:scale-[0.98] transition-all cursor-pointer'><div><p className='text-[11px] font-black italic uppercase text-white/80'>{r.name}</p><p className='text-[8px] opacity-20 font-bold mt-0.5'>{s.time} • {s.startStr}</p></div><p className='text-xs font-black gold-text'>{s.total.toLocaleString()} UZS</p></div>);
                })}
            </div>
            <div className='bg-red-500/5 border border-red-500/10 p-5 rounded-[2rem]'>
                <div onClick={() => setShowDebtsInAsosiy(!showDebtsInAsosiy)} className='flex justify-between items-center cursor-pointer'><div className='flex items-center gap-3'><Users size={16} className='text-red-500' /><p className='text-[11px] font-black uppercase text-red-500/80'>QARZLAR: {analytics.totalDept.toLocaleString()}</p></div>{showDebtsInAsosiy ? <ChevronUp size={14} className='opacity-20' /> : <ChevronDown size={14} className='opacity-20' />}</div>
                <AnimatePresence>{showDebtsInAsosiy && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='mt-4 space-y-2.5 overflow-hidden'>
                    {(debts || []).filter(d => d?.club === currentAdminData?.club).reverse().map(d => (
                        <div key={d.id} className='bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center'><div className='space-y-0.5'><h4 className='text-[10px] font-black uppercase text-white/60'>{d.name}</h4><p className='text-[10px] text-red-500/80 font-black'>-{d.amount.toLocaleString()} UZS</p></div><button onClick={() => { if (window.confirm('Qarz to\'landimi?')) setDebts(p => p.filter(x => x.id !== d.id)) }} className='p-2.5 bg-green-500/5 text-green-500/60 rounded-xl active:scale-90 transition-all'><CheckCircle2 size={14} /></button></div>
                    ))}
                </motion.div>)}</AnimatePresence>
            </div>
        </div>
    );

    const renderClubHistory = () => {
        const filteredEntries = (historyEntries || []).filter(e => e?.club === currentAdminData?.club && (e.dateStr === selectedHistoryDate || !e.dateStr));
        const dates = []; for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); dates.push(d.toISOString().split('T')[0]); }
        return (
            <div className='p-6 space-y-6 pb-40 animate-fade-in'>
                <div className='flex justify-between items-end px-1'><h2 className='text-xl font-black italic gold-text uppercase tracking-tighter'>ISTORIYA</h2><input type="date" className='bg-transparent text-[8px] font-black uppercase opacity-10 outline-none' value={selectedHistoryDate} onChange={(e) => setSelectedHistoryDate(e.target.value)} /></div>
                <div className='flex gap-2.5 overflow-x-auto no-scrollbar px-1'>
                    {dates.map(dStr => {
                        const dateObj = new Date(dStr); const isSel = selectedHistoryDate === dStr;
                        return (
                            <button key={dStr} onClick={() => setSelectedHistoryDate(dStr)} className={`shrink-0 w-12 h-16 rounded-2xl flex flex-col items-center justify-center transition-all border ${isSel ? 'bg-[#ffcf4b] border-[#ffcf4b] text-black shadow-lg shadow-[#ffcf4b]/10' : 'bg-white/5 border-white/5 text-white/30'}`}>
                                <span className='text-[7px] font-black uppercase opacity-60 mb-0.5'>{dateObj.toLocaleDateString('uz-UZ', { weekday: 'short' })}</span>
                                <span className='text-sm font-black italic'>{dateObj.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
                <div className='space-y-2.5'>
                    {filteredEntries.map(e => (
                        <div key={e.id} onClick={() => setSelectedHistoryItem(e)} className='bg-white/5 border border-white/5 p-5 rounded-[2rem] flex justify-between items-center active:scale-[0.98] transition-all cursor-pointer'>
                            <div className='flex items-center gap-4'>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${e.type === 'SESS_CLOSE' ? 'bg-[#ffcf4b]/10 text-[#ffcf4b]' : e.type === 'BAR' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-white/40'}`}>
                                    {e.type === 'SESS_CLOSE' ? <Monitor size={18} /> : e.type === 'BAR' ? <ShoppingCart size={18} /> : <Activity size={18} />}
                                </div>
                                <div>
                                    <h4 className='text-[11px] font-black uppercase text-white/80 italic'>{e.title}</h4>
                                    <p className='text-[8px] opacity-20 font-black uppercase'>{e.type === 'SESS_CLOSE' ? 'Yopildi' : e.type === 'BAR' ? 'Sotuv' : 'Harakat'}</p>
                                </div>
                            </div>
                            <div className='text-right'>
                                {e.amount ? <p className='text-xs font-black gold-text'>{e.amount.toLocaleString()} UZS</p> : <p className='text-[8px] opacity-20 font-black uppercase'>Batafsil</p>}
                                <p className='text-[8px] opacity-10 font-bold mt-1'>{formatTimeShort(e.timestamp)}</p>
                            </div>
                        </div>
                    ))}
                    {filteredEntries.length === 0 && <p className='text-center py-24 text-[10px] opacity-20 font-black uppercase tracking-[5px]'>BO'SH</p>}
                </div>
            </div>
        );
    };

    const renderClubXarita = () => (
        <div className='p-6 space-y-4 pb-40 animate-fade-in'>
            <div className='grid grid-cols-1 gap-4'>{(activeRooms || []).map(r => {
                const s = calculateSession(r); const isExp = expRooms[r?.id];
                return (
                    <div key={r.id} className={`rounded-[2rem] border transition-all duration-300 ${r.isBusy ? 'bg-black/40 border-[#ffcf4b]/10 shadow-xl' : 'bg-black/20 border-white/5 opacity-60'}`}>
                        <div className='p-5 flex justify-between items-center' onClick={() => r.isBusy && setExpRooms(p => ({ ...p, [r.id]: !isExp }))}>
                            <div className='flex items-center gap-4'><div className={`w-2 h-2 rounded-full ${r.isBusy ? 'bg-[#ffcf4b]' : 'bg-white/10'}`}></div><div><h3 className='text-lg font-black italic uppercase text-white/90'>{r.name}</h3><p className='text-[8px] opacity-20 uppercase font-black tracking-widest mt-0.5'>{r.isBusy ? `OCHIQ: ${s.startStr}` : 'BO\'SH'}</p></div></div>
                            <div className='flex gap-1.5' onClick={e => e.stopPropagation()}>
                                <button onClick={() => { setEditingRoom(r); setShowAddRoom(true); }} className='p-2.5 bg-white/5 rounded-xl text-white/20 active:scale-90 transition-all'><Edit3 size={16} /></button>
                                <button onClick={() => { if (window.confirm('Xona o\'chirilsinmi?')) { setRooms(p => p.filter(x => x.id !== r.id)); addToHistory('SYS', r.name, 'Xona o\'chirildi.'); } }} className='p-2.5 bg-red-500/5 text-red-500/30 rounded-xl active:scale-90 transition-all font-black text-[9px]'><Trash2 size={16} /></button>
                            </div>
                        </div>
                        {r.isBusy ? (
                            <div className={`px-5 pb-5 ${isExp ? 'space-y-5 pt-4 border-t border-white/5' : 'flex justify-between items-center'}`}>
                                <div className='flex flex-col'><p className='text-[7px] font-black opacity-20 uppercase tracking-widest'>VAQT</p><p className={`${isExp ? 'text-4xl' : 'text-xl'} font-black gold-text italic tabular-nums tracking-tighter`}>{s.time}</p></div>
                                {!isExp && <p className='text-sm font-black gold-text'>{s.total.toLocaleString()} <span className='text-[8px] opacity-20 NOT-italic ml-0.5'>UZS</span></p>}
                                {isExp && (
                                    <div className='space-y-5'>
                                        <div className='flex justify-between items-center'><p className='text-3xl font-black gold-text italic tracking-tighter tabular-nums'>{s.total.toLocaleString()}</p><button onClick={() => setSelectedRoomForBar(r)} className='bg-white/5 border border-white/10 text-[#ffcf4b] px-5 py-2 rounded-full text-[9px] font-black uppercase active:scale-90 transition-all'>+ BAR</button></div>
                                        <div className='flex flex-wrap gap-1.5'>{(r.items || []).map((i, idx) => (<div key={idx} className='text-[7px] font-black uppercase bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 opacity-60'>{i.name}</div>))}</div>
                                        <button onClick={() => { setFinalStats({ ...s }); setCheckoutRoom(r); }} className='w-full py-4.5 bg-red-600/90 rounded-2xl text-white font-black uppercase text-[10px] shadow-xl active:scale-[0.98] transition-all'>XONANI YOPISH</button>
                                    </div>
                                )}
                            </div>
                        ) : (<div className='px-5 pb-5'><button onClick={() => { setRooms(p => p.map(x => x.id === r.id ? { ...x, isBusy: true, startTime: Date.now(), items: [] } : x)); addToHistory('SESS_OPEN', r.name, 'Seans boshlandi.'); }} className='w-full py-4 bg-white/5 rounded-2xl text-white/30 font-black uppercase text-[9px] border border-white/5 active:bg-[#ffcf4b] active:text-black transition-all'>Xonani Ochish</button></div>)}
                    </div>
                );
            })}</div>

            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='fixed right-8 bottom-32 w-12 h-12 bg-[#ffcf4b] rounded-2xl flex items-center justify-center text-black shadow-xl shadow-[#ffcf4b]/10 active:scale-90 transition-all z-50'><Plus size={24} strokeWidth={3} /></button>
        </div>
    );

    const renderClubBar = () => (
        <div className='p-6 space-y-6 pb-40 animate-fade-in'>
            <div className='flex justify-between items-end mb-2'><h2 className='text-xl font-black italic gold-text uppercase tracking-tighter'>BAR</h2><div className='flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5'><button onClick={() => setBarSubTab('sotuv')} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${barSubTab === 'sotuv' ? 'bg-[#ffcf4b] text-black shadow-md' : 'text-white/20'}`}>Sotuv</button><button onClick={() => setBarSubTab('ombor')} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${barSubTab === 'ombor' ? 'bg-white/10 text-white' : 'text-white/20'}`}>Ombor</button></div></div>
            {barSubTab === 'sotuv' ? (
                <div className='grid grid-cols-2 gap-3.5'>
                    {(inventory || []).length > 0 ? (inventory || []).map(item => (<button key={item.id} onClick={() => { if (item.stock <= 0) return alert('Omborda yo\'q!'); if (window.confirm('Sotilsinmi?')) { setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSalesLog(p => [...p, { id: Date.now(), amount: item.price, timestamp: Date.now(), club: currentAdminData.club, type: 'BAR' }]); addToHistory('BAR', item.name, `Bar savdosi.`, { amount: item.price }); } }} className='bg-white/5 border border-white/5 p-5 rounded-2xl text-left h-28 flex flex-col justify-between active:scale-95 transition-all'><div><p className='text-[6px] opacity-20 font-black uppercase mb-0.5'>{item.category}</p><h4 className='text-[11px] font-black uppercase text-white/70 italic'>{item.name}</h4></div><p className='text-[10px] font-black gold-text'>{item.price.toLocaleString()} UZS</p></button>)) : <div className='col-span-2 py-32 text-center opacity-10 text-[9px] font-black uppercase tracking-[5px]'>OMBOR BO'SH</div>}
                </div>
            ) : (
                <div className='space-y-3.5'>
                    <button onClick={() => setShowInventoryModal(true)} className='w-full py-4 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase text-[#ffcf4b]/60 active:scale-95 transition-all'>+ YANGI MAHSULOT</button>
                    {(inventory || []).map(item => (<div key={item.id} className='bg-white/5 p-5 rounded-2xl border border-white/5 flex justify-between items-center'><div className='flex items-center gap-4'><div className='w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-[#ffcf4b]/40'><Package size={16} /></div><div><h4 className='text-[10px] font-black uppercase text-white/50'>{item.name}</h4><p className='text-[7px] opacity-20 uppercase font-black'>{item.stock} ta qoldi</p></div></div><button onClick={() => { if (window.confirm('O\'chirilsinmi?')) setInventory(p => p.filter(i => i.id !== item.id)) }} className='p-2.5 text-red-500/20 active:text-red-500 transition-colors'><Trash2 size={16} /></button></div>))}
                </div>
            )}
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg font-sans overflow-x-hidden selection:bg-[#ffcf4b]/20'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <div className='w-14 h-14 rounded-2xl bg-[#ffcf4b] flex items-center justify-center mb-10 shadow-lg shadow-[#ffcf4b]/10'><Lock size={24} className='text-black' /></div>
                        <h2 className='text-2xl font-black italic mb-10 text-[#ffcf4b]/80 tracking-tighter'>PLS_SYSTEM</h2>
                        <input type="text" placeholder="ID" className='bg-white/5 border border-white/10 h-14 w-full max-w-[280px] text-center rounded-2xl text-sm font-black uppercase tracking-widest placeholder:opacity-10 outline-none' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button onClick={() => setView('clubDashboard')} className='mt-8 py-4 w-full max-w-[280px] text-xs font-black uppercase rounded-2xl bg-white/5 border border-white/10 text-white/40 active:bg-[#ffcf4b] active:text-black transition-all'>TIZIMGA KIRISH</button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <header className='px-7 py-5 flex justify-between items-center bg-black/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-3'><div className='w-8 h-8 rounded-xl bg-[#ffcf4b] flex items-center justify-center shadow-md'><Activity size={16} className='text-black' /></div><div><h2 className='text-[13px] font-black italic uppercase tracking-tighter text-white/90'>{currentAdminData?.name}</h2><p className='text-[7px] opacity-20 uppercase font-black tracking-[3px]'>{currentAdminData?.club}</p></div></div>
                            <p className='text-[10px] font-black gold-text tabular-nums italic tracking-wider'>{new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
                        </header>
                        <main className='max-w-[480px] mx-auto'>{activeTab === 'asosiy' ? renderClubAsosiy() : activeTab === 'bar' ? renderClubBar() : activeTab === 'history' ? renderClubHistory() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sleek Minimalist Toolbar */}
            {view !== 'login' && (
                <div className='fixed bottom-8 left-0 right-0 flex justify-center z-50 px-8'>
                    <nav className='bg-white/5 backdrop-blur-3xl border border-white/5 p-1.5 rounded-[2.5rem] flex items-center shadow-2xl w-full max-w-[360px]'>
                        {['asosiy', 'xarita', 'bar', 'history'].map((tab) => {
                            const isSel = activeTab === tab;
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`relative flex-1 py-3.5 flex flex-col items-center justify-center gap-1 transition-all duration-300 ${isSel ? 'text-[#ffcf4b]' : 'text-white/20'}`}>
                                    <div className={`transition-all duration-300 ${isSel ? 'scale-110' : 'scale-90 opacity-40'}`}>
                                        {tab === 'asosiy' ? <BarChart3 size={20} /> : tab === 'xarita' ? <Monitor size={20} /> : tab === 'bar' ? <Boxes size={20} /> : <History size={20} />}
                                    </div>
                                    <span className={`text-[7px] font-black uppercase tracking-[2px] transition-all duration-300 ${isSel ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                                        {tab.slice(0, 4)}
                                    </span>
                                    {isSel && <motion.div layoutId='nav-glow' className='absolute -bottom-1 w-1 h-1 bg-[#ffcf4b] rounded-full shadow-[0_0_8px_#ffcf4b]' />}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {selectedHistoryItem && (
                    <div className='modal-overlay' onClick={() => setSelectedHistoryItem(null)}><motion.div onClick={e => e.stopPropagation()} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='modal-content !p-0 !rounded-[2.5rem] !max-w-[85%] border border-white/10 overflow-hidden bg-[#0a0a0a]'>
                        <div className='p-8 text-center bg-gradient-to-b from-[#ffcf4b]/10 to-transparent'>
                            <div className='w-16 h-16 rounded-[2rem] bg-[#ffcf4b] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#ffcf4b]/20'><Receipt size={32} className='text-black' /></div>
                            <h2 className='text-xl font-black italic gold-text uppercase tracking-[3px]'>{selectedHistoryItem.title}</h2>
                            <p className='text-[9px] opacity-20 font-black uppercase mt-1'>Muvaffaqiyatli seans</p>
                        </div>
                        <div className='p-8 space-y-6'>
                            <div className='grid grid-cols-2 gap-8'>
                                <div><p className='text-[8px] font-black opacity-20 uppercase tracking-[2px] mb-1'>OCHILDI</p><p className='text-xs font-black italic text-white/80'>{selectedHistoryItem.startTime || formatTimeShort(selectedHistoryItem.timestamp)}</p></div>
                                <div className='text-right'><p className='text-[8px] font-black opacity-20 uppercase tracking-[2px] mb-1'>YOPILDI</p><p className='text-xs font-black italic text-white/80'>{selectedHistoryItem.endTime || formatTimeShort(selectedHistoryItem.timestamp)}</p></div>
                            </div>
                            {selectedHistoryItem.duration && (
                                <div className='pt-4 border-t border-white/5 flex justify-between items-center'>
                                    <p className='text-[8px] font-black opacity-20 uppercase'>DAVOMIYLIGI</p>
                                    <p className='text-xs font-black text-[#ffcf4b] tabular-nums'>{selectedHistoryItem.duration}</p>
                                </div>
                            )}
                            <div className='pt-6 border-t-2 border-dashed border-white/5'>
                                <p className='text-[8px] font-black opacity-20 uppercase tracking-[4px] text-center mb-2'>UMUMIY SUMMA</p>
                                <p className='text-4xl font-black italic gold-text text-center tracking-tighter'>{selectedHistoryItem.amount ? selectedHistoryItem.amount.toLocaleString() : '0'}<span className='text-[10px] NOT-italic opacity-20 ml-2'>UZS</span></p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedHistoryItem(null)} className='w-full py-6 bg-white/5 border-t border-white/5 text-[9px] font-black uppercase tracking-[3px] text-white/20 active:bg-white/10 transition-all'>Yopish</button>
                    </motion.div></div>
                )}
                {checkoutRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='modal-content !p-8 !rounded-[2.5rem] !max-w-[85%] border border-[#ffcf4b]/5'>
                        <h2 className='text-xl font-black italic gold-text text-center mb-8 uppercase tracking-[4px]'>YOPISH</h2>
                        <div className='bg-[#ffcf4b]/5 p-7 text-center mb-8 rounded-[2rem] border border-[#ffcf4b]/5'>
                            <p className='text-[8px] font-black opacity-20 uppercase tracking-[4px] mb-2'>JAMI SUMMA</p>
                            <p className='text-4xl font-black italic tracking-tighter tabular-nums gold-text'>{finalStats.total.toLocaleString()}<span className='text-[10px] opacity-20 ml-2'>UZS</span></p>
                        </div>
                        <div className='space-y-4 mb-8'>
                            <input type="number" placeholder="OLINGAN PUL" className='bg-white/5 border border-white/10 h-16 w-full text-2xl font-black text-center outline-none rounded-2xl placeholder:text-[10px]' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {(finalStats.total - Number(paidAmount) > 0 && Number(paidAmount) > 0) && (
                                <div className='p-5 bg-red-500/5 rounded-2xl border border-red-500/10 space-y-3'>
                                    <input type="text" placeholder="ISMI" className='bg-white/5 border border-white/5 h-12 w-full text-[10px] px-4 rounded-xl outline-none font-black uppercase' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL" className='bg-white/5 border border-white/5 h-12 w-full text-[10px] px-4 rounded-xl outline-none font-black uppercase' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <button onClick={confirmCheckout} className='py-4.5 bg-[#ffcf4b] text-black text-[11px] font-black uppercase rounded-2xl shadow-xl active:scale-95 transition-all'>TASDIQLASH</button>
                            <button onClick={() => setCheckoutRoom(null)} className='py-3 text-[9px] opacity-20 font-black uppercase tracking-widest'>BEKOR QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {showAddRoom && (<div className='modal-overlay'><motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='modal-content !p-8 !rounded-[2.5rem] border border-white/5'><h2 className='text-lg font-black italic uppercase gold-text text-center mb-8 tracking-tighter'>SOZLAMALAR</h2><div className='space-y-4'><input type="text" placeholder="XONA NOMI" className='bg-white/5 border border-white/5 h-14 w-full text-center rounded-2xl text-[11px] font-black uppercase outline-none' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} /><input type="number" placeholder="NARXI (SOATIGA)" className='bg-white/5 border border-white/5 h-14 w-full text-center rounded-2xl text-[11px] font-black uppercase outline-none' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: Number(e.target.value) }) : setNewRoom({ ...newRoom, price: Number(e.target.value) })} /><div className='flex flex-col gap-2 pt-4'><button onClick={() => { if (editingRoom) { setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r)); setEditingRoom(null); } else { setRooms([...rooms, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, isSuspended: false }]); } setShowAddRoom(false); }} className='py-4.5 bg-[#ffcf4b] text-black font-black text-[10px] uppercase rounded-2xl shadow-xl active:scale-95 transition-all'>SAQLASH</button><button onClick={() => setShowAddRoom(false)} className='py-2 text-[9px] opacity-20 font-black uppercase'>BEKOR QILISH</button></div></div></motion.div></div>)}
                {showInventoryModal && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-lg font-black gold-text text-center mb-8 uppercase tracking-tighter'>YANGI MAHSULOT</h2><div className='space-y-4'><input type="text" placeholder="NOMI" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /><div className='grid grid-cols-2 gap-4'><input type="number" placeholder="NARXI" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} /><input type="number" placeholder="SONI" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })} /></div><div className='flex flex-col gap-2 pt-4'><button onClick={() => { setInventory([...inventory, { ...newItem, id: Date.now(), sold: 0 }]); setShowInventoryModal(false); }} className='py-4.5 bg-[#ffcf4b] text-black font-black text-[10px] uppercase rounded-2xl active:scale-95 transition-all'>QO'SHISH</button><button onClick={() => setShowInventoryModal(false)} className='py-2 text-[9px] opacity-20 font-black uppercase'>BEKOR QILISH</button></div></div></motion.div></div>)}
                {selectedRoomForBar && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><div className='flex justify-between items-center mb-8'><p className='text-lg font-black italic gold-text uppercase'>BAR TANLASH</p><button onClick={() => setSelectedRoomForBar(null)} className='p-2 bg-white/5 rounded-full text-white/20'><X size={16} /></button></div><div className='grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto no-scrollbar'>{(inventory || []).map(item => (<button key={item.id} disabled={item.stock <= 0} onClick={() => { setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r)); setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSelectedRoomForBar(null); }} className='bg-white/5 p-5 rounded-2xl text-left h-24 flex flex-col justify-between active:scale-95 transition-all border border-white/5 opacity-80'><span className='text-[9px] font-black uppercase text-white/60 leading-tight'>{item.name}</span><span className='gold-text text-xs'>{item.price.toLocaleString()}</span></button>))}</div><button onClick={() => setSelectedRoomForBar(null)} className='w-full mt-6 py-4 text-[9px] opacity-10 font-black uppercase'>BEKOR QILISH</button></motion.div></div>)}
            </AnimatePresence>
        </div>
    );
};

export default App;
