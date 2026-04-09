import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Trash2, X, Monitor, Lock, Unlock, Clock, Users,
    BarChart3, ShoppingCart, Package, TrendingUp, History, UserCheck, ShieldCheck, Phone, Edit3, CheckCircle2, ChevronDown, ChevronUp, Wallet, Receipt, LogOut, Terminal, User, Globe, Layers, Boxes
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
    const [pass, setPass] = useState('');
    const [activeTab, setActiveTab] = useState('asosiy');
    const [glavniyTab, setGlavniyTab] = useState('dashboard');
    const [barSubTab, setBarSubTab] = useState('sotuv');
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [clubAdmins, setClubAdmins] = useState(getInitialState('clubAdmins', []));
    const [superAdmins, setSuperAdmins] = useState(getInitialState('superAdmins', []));
    const [glavniyHistory, setGlavniyHistory] = useState(getInitialState('glavniyHistory', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [salesLog, setSalesLog] = useState(getInitialState('salesLog', []));
    const [historyEntries, setHistoryEntries] = useState(getInitialState('historyEntries', []));
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [now, setNow] = useState(Date.now());
    const [expRooms, setExpRooms] = useState({});

    const [isPressingLock, setIsPressingLock] = useState(false);
    const [showHiddenLogin, setShowHiddenLogin] = useState(false);
    const pressTimer = useRef(null);

    const [checkoutRoom, setCheckoutRoom] = useState(null);
    const [finalStats, setFinalStats] = useState(null);
    const [paidAmount, setPaidAmount] = useState('');
    const [debtUser, setDebtUser] = useState({ name: '', phone: '' });
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '' });
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', login: '', pass: '', club: '', role: 'ADMIN', creatorId: '' });
    const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
    const [newSuperAdmin, setNewSuperAdmin] = useState({ name: '', phone: '', login: '', pass: '', role: 'SUPER' });
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '', stock: '', category: 'Ichimlik' });
    const [selectedRoomForBar, setSelectedRoomForBar] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('clubAdmins', JSON.stringify(clubAdmins || []));
        localStorage.setItem('superAdmins', JSON.stringify(superAdmins || []));
        localStorage.setItem('glavniyHistory', JSON.stringify(glavniyHistory || []));
        if (view !== 'login') {
            localStorage.setItem('rooms', JSON.stringify(rooms || []));
            localStorage.setItem('debts', JSON.stringify(debts || []));
            localStorage.setItem('salesLog', JSON.stringify(salesLog || []));
            localStorage.setItem('historyEntries', JSON.stringify(historyEntries || []));
            localStorage.setItem('inventory', JSON.stringify(inventory || []));
            localStorage.setItem('view', JSON.stringify(view));
            localStorage.setItem('username', JSON.stringify(username));
        }
    }, [rooms, clubAdmins, superAdmins, glavniyHistory, debts, salesLog, historyEntries, inventory, view, username]);

    const addToGlavniyHistory = (text) => setGlavniyHistory(p => [{ id: Date.now(), text, timestamp: Date.now(), dateStr: new Date().toLocaleString() }, ...(p || []).slice(0, 999)]);
    const addToHistory = (type, title, desc, extra = {}) => setHistoryEntries(p => [{ id: Date.now(), timestamp: Date.now(), type, title, desc, club: currentAdminData.club, dateStr: new Date().toISOString().split('T')[0], ...extra }, ...(p || []).slice(0, 499)]);

    const currentAdminData = useMemo(() => {
        if (view === 'glavniyAdminDashboard') return { name: 'GLAVNIY ADMIN', club: 'EMPIRE', role: 'GLAVNIY' };
        const sAdmin = (superAdmins || []).find(a => a.login?.toLowerCase() === username?.toLowerCase());
        if (sAdmin) return { ...sAdmin, role: 'SUPER' };
        return (clubAdmins || []).find(a => a.login?.toLowerCase() === username?.toLowerCase()) || { name: 'ADMIN', club: 'PLS', role: 'ADMIN' };
    }, [clubAdmins, superAdmins, username, view]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const calculateSession = (room, targetNow = now) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, startStr: '--:--' };
        const diff = Math.floor((targetNow - room.startTime) / 1000);
        return {
            time: `${Math.floor(diff / 3600).toString().padStart(2, '0')}:${Math.floor((diff % 3600) / 60).toString().padStart(2, '0')}:${(diff % 60).toString().padStart(2, '0')}`,
            total: Math.round((diff / 3600) * Number(room.price || 0) + (room.items || []).reduce((acc, i) => acc + (Number(i.price || 0) * (i.quantity || 1)), 0)),
            startStr: formatTimeShort(room.startTime)
        };
    };

    const analytics = useMemo(() => {
        const clubLog = (salesLog || []).filter(s => s?.club === currentAdminData?.club);
        const dayLimit = Date.now() - 24 * 60 * 60 * 1000;
        const dSales = clubLog.filter(s => s.timestamp > dayLimit);
        const dailyBar = dSales.filter(s => s.type === 'BAR').reduce((acc, s) => acc + s.amount, 0);
        const dailyRoom = dSales.filter(s => s.type === 'ROOM' || !s.type).reduce((acc, s) => acc + s.amount, 0);
        const activeRev = activeRooms.filter(r => r.isBusy).reduce((acc, r) => acc + calculateSession(r).total, 0);
        const totalD = (debts || []).filter(d => d?.club === currentAdminData?.club).reduce((acc, d) => acc + (d?.amount || 0), 0);
        return { daily: dailyRoom + dailyBar + activeRev, dailyBar, dailyRoom: dailyRoom + activeRev, totalDept: totalD, totalR: activeRooms.length, busyR: activeRooms.filter(r => r.isBusy).length, freeR: activeRooms.filter(r => !r.isBusy).length };
    }, [salesLog, debts, currentAdminData?.club, activeRooms, now]);

    const handleLogin = () => {
        const u = username?.trim().toLowerCase(); const p = pass?.trim();
        if (showHiddenLogin && u === '4567' && p === '4567') { setView('glavniyAdminDashboard'); setUsername('4567'); setPass(''); return; }
        const sa = (superAdmins || []).find(a => a.login?.toLowerCase() === u && a.pass === p);
        if (sa) { setView('superAdminDashboard'); setUsername(sa.login); setPass(''); return; }
        const ca = (clubAdmins || []).find(a => a.login?.toLowerCase() === u && a.pass === p);
        if (ca) { setView('clubDashboard'); setUsername(ca.login); setPass(''); return; }
        alert('Xato!');
    };

    const renderClubAsosiy = () => (
        <div className='p-6 space-y-5 pb-40 animate-fade-in'>
            <div className='flex gap-2.5'>
                {[{ l: 'JAMI', v: analytics.totalR }, { l: 'BAND', v: analytics.busyR, c: 'gold-text' }, { l: 'BO\'SH', v: analytics.freeR, c: 'text-green-500/60' }].map(i => (
                    <div key={i.l} className='bg-white/5 border border-white/5 flex-1 p-3 rounded-2xl text-center'><p className='text-[8px] font-black opacity-20 uppercase mb-0.5'>{i.l}</p><p className={`text-xs font-black ${i.c || 'opacity-60'}`}>{i.v}</p></div>
                ))}
            </div>
            <div className='relative p-7 rounded-[2rem] bg-gradient-to-br from-[#ffcf4b]/10 to-transparent border border-[#ffcf4b]/5 overflow-hidden'>
                <p className='text-[9px] font-black opacity-30 uppercase tracking-[3px] mb-1'>KASSA</p>
                <h2 className='text-4xl font-black italic gold-text tracking-tighter tabular-nums'>{analytics.daily.toLocaleString()} <span className='text-[10px] opacity-20 NOT-italic'>UZS</span></h2>
                <div className='grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5'>
                    <div><p className='text-[7px] font-black opacity-20 uppercase mb-1'>XONA</p><p className='text-sm font-black text-white/80'>{analytics.dailyRoom.toLocaleString()}</p></div>
                    <div className='text-right'><p className='text-[7px] font-black opacity-20 uppercase mb-1'>BAR</p><p className='text-sm font-black gold-text'>{analytics.dailyBar.toLocaleString()}</p></div>
                </div>
            </div>
            <div className='pt-2 space-y-2.5'><p className='text-[9px] font-black opacity-20 uppercase tracking-[3px] px-1'>LIVE</p>
                {activeRooms.filter(r => r?.isBusy).map(r => { const s = calculateSession(r); return (<div key={r.id} onClick={() => setActiveTab('xarita')} className='bg-white/5 border border-white/5 p-5 rounded-2xl flex justify-between items-center'><p className='text-[11px] font-black italic uppercase'>{r.name}</p><p className='text-xs font-black gold-text'>{s.total.toLocaleString()} UZS</p></div>); })}
            </div>
            <div className='bg-red-500/5 border border-red-500/10 p-5 rounded-[2rem] flex justify-between items-center'><div className='flex items-center gap-3'><Users size={16} className='text-red-500' /><p className='text-[11px] font-black uppercase text-red-500/80'>QARZLAR: {analytics.totalDept.toLocaleString()}</p></div><button onClick={() => setActiveTab('asosiy')} className='opacity-20'><ChevronDown size={14} /></button></div>
        </div>
    );

    const renderClubXarita = () => (
        <div className='p-6 space-y-4 pb-40 animate-fade-in'>{(activeRooms || []).map(r => {
            const s = calculateSession(r); const isE = expRooms[r.id];
            return (
                <div key={r.id} className={`rounded-[2rem] border transition-all ${r.isBusy ? 'bg-black/40 border-[#ffcf4b]/10' : 'bg-black/20 border-white/5 opacity-60'}`}>
                    <div className='p-5 flex justify-between items-center' onClick={() => r.isBusy && setExpRooms(p => ({ ...p, [r.id]: !isE }))}>
                        <div className='flex items-center gap-4'><div className={`w-2 h-2 rounded-full ${r.isBusy ? 'bg-[#ffcf4b]' : 'bg-white/10'}`}></div><div><h3 className='text-lg font-black italic uppercase'>{r.name}</h3><p className='text-[8px] opacity-20 uppercase font-black'>{r.isBusy ? `OCHIQ: ${s.startStr}` : 'BO\'SH'}</p></div></div>
                        <div className='flex gap-1'>{r.isBusy && <Clock size={16} className='opacity-20' />}<button onClick={(e) => { e.stopPropagation(); if (window.confirm('O\'chirilsinmi?')) setRooms(p => p.filter(x => x.id !== r.id)); }} className='p-2 text-white/10'><Trash2 size={16} /></button></div>
                    </div>
                    {r.isBusy ? (
                        <div className={`px-5 pb-5 ${isE ? 'pt-4 border-t border-white/5 space-y-4' : 'flex justify-between items-center'}`}>
                            <p className={`${isE ? 'text-4xl' : 'text-lg'} font-black gold-text italic tabular-nums`}>{s.time}</p>
                            {isE ? <button onClick={() => { setFinalStats({ ...s }); setCheckoutRoom(r); }} className='w-full py-4 bg-red-600 rounded-2xl text-white font-black uppercase text-[10px]'>YOPISH</button> : <p className='text-sm font-black gold-text'>{s.total.toLocaleString()} UZS</p>}
                        </div>
                    ) : <div className='px-5 pb-5'><button onClick={() => { setRooms(p => p.map(x => x.id === r.id ? { ...x, isBusy: true, startTime: Date.now(), items: [] } : x)); }} className='w-full py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase'>OCHISH</button></div>}
                </div>
            )
        })}
            <button onClick={() => setShowAddRoom(true)} className='fixed right-8 bottom-32 w-12 h-12 bg-[#ffcf4b] rounded-2xl flex items-center justify-center text-black shadow-xl z-50'><Plus size={24} /></button>
        </div>
    );

    const renderClubBar = () => (
        <div className='p-6 space-y-6 pb-40 animate-fade-in'>
            <div className='flex justify-between items-center'><h2 className='text-xl font-black gold-text italic'>BAR</h2><div className='flex p-1 bg-white/5 rounded-xl'><button onClick={() => setBarSubTab('sotuv')} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase ${barSubTab === 'sotuv' ? 'bg-[#ffcf4b] text-black' : 'text-white/20'}`}>Sotuv</button><button onClick={() => setBarSubTab('ombor')} className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase ${barSubTab === 'ombor' ? 'bg-white/10 text-white' : 'text-white/20'}`}>Ombor</button></div></div>
            {barSubTab === 'sotuv' ? (
                <div className='grid grid-cols-2 gap-3.5'>{(inventory || []).map(i => (<button key={i.id} onClick={() => { if (i.stock <= 0) return; setInventory(p => p.map(x => x.id === i.id ? { ...x, stock: x.stock - 1 } : x)); setSalesLog(p => [...p, { id: Date.now(), amount: i.price, timestamp: Date.now(), club: currentAdminData.club, type: 'BAR' }]); }} className='bg-white/5 p-5 rounded-2xl text-left h-28 flex flex-col justify-between'><h4 className='text-[11px] font-black uppercase opacity-70'>{i.name}</h4><p className='text-[10px] font-black gold-text'>{i.price.toLocaleString()} UZS</p></button>))}</div>
            ) : (
                <div className='space-y-3.5'><button onClick={() => setShowInventoryModal(true)} className='w-full py-4 border border-dashed border-white/10 rounded-2xl text-[9px] font-black uppercase'>+ YANGI</button>
                    {(inventory || []).map(i => (<div key={i.id} className='bg-white/5 p-5 rounded-2xl flex justify-between items-center'><div><h4 className='text-[10px] font-black uppercase opacity-50'>{i.name}</h4><p className='text-[7px] opacity-20'>{i.stock} ta</p></div><button onClick={() => setInventory(p => p.filter(x => x.id !== i.id))} className='p-2 text-white/10'><Trash2 size={16} /></button></div>))}
                </div>
            )}
        </div>
    );

    const renderClubHistory = () => (
        <div className='p-6 space-y-6 pb-40 animate-fade-in'>
            <h2 className='text-xl font-black gold-text italic'>ISTORIYA</h2>
            <div className='space-y-2.5'>{(historyEntries || []).filter(e => e.club === currentAdminData.club).map(e => (
                <div key={e.id} onClick={() => setSelectedHistoryItem(e)} className='bg-white/5 p-5 rounded-[2rem] flex justify-between items-center active:scale-95 transition-all cursor-pointer'>
                    <div className='flex items-center gap-4'><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${e.type === 'BAR' ? 'bg-green-500/10 text-green-500' : 'bg-[#ffcf4b]/10 text-[#ffcf4b]'}`}><Activity size={18} /></div><div><h4 className='text-[11px] font-black uppercase italic'>{e.title}</h4><p className='text-[7px] opacity-20 uppercase'>{formatTimeShort(e.timestamp)}</p></div></div>
                    <p className='text-xs font-black gold-text'>{e.amount?.toLocaleString()} UZS</p>
                </div>
            ))}</div>
        </div>
    );

    const renderSuperAdmin = () => (
        <div className='p-6 space-y-6 pb-40 animate-fade-in'>
            <div className='bg-[#ffcf4b]/5 p-8 rounded-[2.5rem] border border-[#ffcf4b]/10'><h2 className='text-3xl font-black gold-text italic tracking-tighter'>{currentAdminData.name}</h2><p className='text-[9px] opacity-20 font-black uppercase mt-1'>SUPER_ADMIN</p></div>
            <button onClick={() => setShowAdminModal(true)} className='w-full py-5 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase text-[#ffcf4b]'>+ YANGI CLUB ADMINI</button>
            <div className='space-y-3'>{(clubAdmins || []).filter(a => a.creatorId === username).map((a, idx) => (<div key={idx} className='bg-white/5 p-5 rounded-2xl flex justify-between items-center'><div><h4 className='text-[11px] font-black uppercase'>{a.name}</h4><p className='text-[8px] opacity-20'>{a.club} | ID: {a.login}</p></div><button onClick={() => setClubAdmins(p => p.filter(x => x.login !== a.login))} className='p-2 text-white/10'><Trash2 size={16} /></button></div>))}</div>
        </div>
    );

    const renderGlavniy = () => (
        <div className='p-6 space-y-6 pb-40 animate-fade-in'>
            <div className='flex gap-2 p-1 bg-white/5 rounded-2xl'>{['dashboard', 'superAdmins', 'history'].map(t => (<button key={t} onClick={() => setGlavniyTab(t)} className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase ${glavniyTab === t ? 'bg-[#ffcf4b] text-black' : 'text-white/20'}`}>{t}</button>))}</div>
            {glavniyTab === 'dashboard' ? (
                <div className='bg-gradient-to-br from-[#ffcf4b]/10 to-transparent p-7 rounded-[2.5rem] border border-[#ffcf4b]/5'><p className='text-[9px] font-black opacity-30 uppercase tracking-[4px] mb-1'>UMUMIY DAROMAD</p><h2 className='text-3xl font-black italic gold-text tracking-tighter tabular-nums'>{empireStats.totalMonth.toLocaleString()} <span className='text-[10px] opacity-20'>UZS / OY</span></h2></div>
            ) : glavniyTab === 'superAdmins' ? (
                <div className='space-y-4'><button onClick={() => setShowSuperAdminModal(true)} className='w-full py-5 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase text-[#ffcf4b]'>+ YANGI SUPER ADMIN</button>
                    {(superAdmins || []).map((sa, idx) => (<div key={idx} className='bg-white/5 p-5 rounded-[2rem] flex justify-between items-center'><div><h4 className='text-[11px] font-black uppercase'>{sa.name}</h4><p className='text-[8px] opacity-20'>ID: {sa.login} | PS: {sa.pass}</p></div><button onClick={() => setSuperAdmins(p => p.filter(x => x.login !== sa.login))} className='p-2 text-white/10'><Trash2 size={16} /></button></div>))}
                </div>
            ) : <div className='space-y-3'>{(glavniyHistory || []).map(h => (<div key={h.id} className='bg-white/5 p-4 rounded-xl flex justify-between'><p className='text-[10px] opacity-60'>{h.text}</p><p className='text-[7px] opacity-10 uppercase'>{h.dateStr}</p></div>))}</div>}
        </div>
    );

    return (
        <div className='min-h-screen bg-black text-white selection:bg-[#ffcf4b]/20'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <motion.div onMouseDown={() => pressTimer.current = setTimeout(() => setShowHiddenLogin(true), 2000)} onMouseUp={() => clearTimeout(pressTimer.current)} onTouchStart={() => pressTimer.current = setTimeout(() => setShowHiddenLogin(true), 2000)} onTouchEnd={() => clearTimeout(pressTimer.current)} animate={{ scale: showHiddenLogin ? 1.2 : 1 }} className='w-16 h-16 rounded-[1.5rem] bg-[#ffcf4b] flex items-center justify-center mb-10 text-black cursor-pointer'>{showHiddenLogin ? <Terminal size={28} /> : <Lock size={28} />}</motion.div>
                        <h2 className='text-2xl font-black italic mb-10 tracking-tighter gold-text'>{showHiddenLogin ? 'GLAVNIY_MODE' : 'PLS_SYSTEM'}</h2>
                        <div className='w-full max-w-[280px] space-y-3.5'><input type="text" placeholder="ID" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-sm font-black uppercase outline-none focus:border-[#ffcf4b]/30' value={username} onChange={(e) => setUsername(e.target.value)} /><input type="password" placeholder="PAROL" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-sm font-black uppercase outline-none focus:border-[#ffcf4b]/30' value={pass} onChange={(e) => setPass(e.target.value)} /><button onClick={handleLogin} className='mt-8 py-4 w-full text-xs font-black uppercase rounded-2xl bg-[#ffcf4b] text-black shadow-lg active:scale-95'>KIRISH</button></div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <header className='px-7 py-5 flex justify-between items-center bg-black border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-3'><div className='w-8 h-8 rounded-xl bg-[#ffcf4b] flex items-center justify-center text-black shadow-md'><Activity size={16} /></div><div><h2 className='text-[13px] font-black italic uppercase text-white/90'>{currentAdminData.name}</h2><p className='text-[7px] opacity-20 uppercase font-black'>{currentAdminData.club}</p></div></div>
                            <button onClick={() => { setView('login'); setUsername(''); setPass(''); setShowHiddenLogin(false); }} className='p-2 bg-red-500/10 text-red-500/60 rounded-xl'><LogOut size={16} /></button>
                        </header>
                        <main className='max-w-[480px] mx-auto'>
                            {view === 'glavniyAdminDashboard' ? renderGlavniy() : view === 'superAdminDashboard' ? renderSuperAdmin() : (activeTab === 'asosiy' ? renderClubAsosiy() : activeTab === 'xarita' ? renderClubXarita() : activeTab === 'bar' ? renderClubBar() : renderClubHistory())}
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>
            {view === 'clubDashboard' && (
                <div className='fixed bottom-8 left-0 right-0 flex justify-center z-50 px-8'>
                    <nav className='bg-white/5 backdrop-blur-3xl border border-white/5 p-1.5 rounded-[2.5rem] flex items-center shadow-2xl w-full max-w-[360px]'>
                        {[{ id: 'asosiy', i: BarChart3 }, { id: 'xarita', i: Monitor }, { id: 'bar', i: Boxes }, { id: 'history', i: History }].map(t => (
                            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`relative flex-1 py-3.5 flex flex-col items-center justify-center gap-1 transition-all ${activeTab === t.id ? 'text-[#ffcf4b]' : 'text-white/20'}`}><t.i size={20} />{activeTab === t.id && <motion.div layoutId='nav-glow' className='absolute -bottom-1 w-1 h-1 bg-[#ffcf4b] rounded-full shadow-[0_0_8px_#ffcf4b]' />}</button>
                        ))}
                    </nav>
                </div>
            )}
            <AnimatePresence>
                {selectedHistoryItem && (<div className='modal-overlay' onClick={() => setSelectedHistoryItem(null)}><motion.div onClick={e => e.stopPropagation()} className='modal-content !p-0 !rounded-[2.5rem] border border-white/10 overflow-hidden bg-[#0a0a0a]'><div className='p-8 text-center bg-gradient-to-b from-[#ffcf4b]/10 to-transparent'><Receipt size={32} className='mx-auto mb-4 text-[#ffcf4b]' /><h2 className='text-xl font-black italic gold-text uppercase'>{selectedHistoryItem.title}</h2></div><div className='p-8 space-y-6 text-center'><p className='text-4xl font-black gold-text italic'>{selectedHistoryItem.amount?.toLocaleString()} UZS</p><button onClick={() => setSelectedHistoryItem(null)} className='w-full py-4 text-white/20 uppercase font-black text-xs'>Yopish</button></div></motion.div></div>)}
                {checkoutRoom && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-xl font-black gold-text text-center mb-8 uppercase'>YOPISH</h2><div className='bg-[#ffcf4b]/5 p-7 text-center mb-8 rounded-[2rem]'><p className='text-4xl font-black gold-text italic'>{finalStats.total.toLocaleString()} UZS</p></div><input type="number" placeholder="PUL" className='bg-white/5 border border-white/10 h-16 w-full text-2xl font-black text-center rounded-2xl outline-none mb-8' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} /><button onClick={() => { if (Number(paidAmount) > 0) setSalesLog(p => [...p, { id: Date.now(), amount: Number(paidAmount), timestamp: Date.now(), club: checkoutRoom.club, type: 'ROOM' }]); addToHistory('SESS_CLOSE', checkoutRoom.name, 'Seans yopildi', { amount: finalStats.total }); setRooms(p => p.map(x => x.id === checkoutRoom.id ? { ...x, isBusy: false } : x)); setCheckoutRoom(null); }} className='w-full py-4.5 bg-[#ffcf4b] text-black font-black rounded-2xl'>TASDIQLASH</button></motion.div></div>)}
                {showAddRoom && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-lg font-black gold-text text-center mb-8'>YANGI XONA</h2><input type="text" placeholder="NOMI" className='bg-white/5 border border-white/5 h-14 w-full text-center rounded-2xl mb-4' value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} /><input type="number" placeholder="NARXI (SOATIGA)" className='bg-white/5 border border-white/5 h-14 w-full text-center rounded-2xl mb-8' value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: Number(e.target.value) })} /><button onClick={() => { setRooms([...rooms, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false }]); setShowAddRoom(false); }} className='w-full py-4.5 bg-[#ffcf4b] text-black font-black rounded-2xl'>SAQLASH</button></motion.div></div>)}
                {showSuperAdminModal && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-lg font-black gold-text text-center mb-8'>SUPER ADMIN</h2><input type="text" placeholder="LOGIN" className='bg-white/5 h-14 w-full text-center rounded-2xl mb-4' value={newSuperAdmin.login} onChange={(e) => setNewSuperAdmin({ ...newSuperAdmin, login: e.target.value })} /><input type="password" placeholder="PAROL" className='bg-white/5 h-14 w-full text-center rounded-2xl mb-8' value={newSuperAdmin.pass} onChange={(e) => setNewSuperAdmin({ ...newSuperAdmin, pass: e.target.value })} /><button onClick={() => { setSuperAdmins([...superAdmins, newSuperAdmin]); setShowSuperAdminModal(false); }} className='w-full py-4.5 bg-[#ffcf4b] text-black font-black rounded-2xl'>QO'SHISH</button></motion.div></div>)}
                {showAdminModal && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-lg font-black gold-text text-center mb-8'>CLUB ADMIN</h2><input type="text" placeholder="LOGIN" className='bg-white/5 h-14 w-full text-center rounded-2xl mb-4' value={newAdmin.login} onChange={(e) => setNewAdmin({ ...newAdmin, login: e.target.value })} /><input type="password" placeholder="PAROL" className='bg-white/5 h-14 w-full text-center rounded-2xl mb-4' value={newAdmin.pass} onChange={(e) => setNewAdmin({ ...newAdmin, pass: e.target.value })} /><input type="text" placeholder="CLUB" className='bg-white/5 h-14 w-full text-center rounded-2xl mb-8' value={newAdmin.club} onChange={(e) => setNewAdmin({ ...newAdmin, club: e.target.value })} /><button onClick={() => { setClubAdmins([...clubAdmins, { ...newAdmin, creatorId: username }]); setShowAdminModal(false); }} className='w-full py-4.5 bg-[#ffcf4b] text-black font-black rounded-2xl'>QO'SHISH</button></motion.div></div>)}
            </AnimatePresence>
        </div>
    );
};

export default App;
