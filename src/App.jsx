import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight, BarChart, Boxes, LayoutGrid, Eye, EyeOff, ExternalLink, ListChecks, Info, ChevronLeft, Layout as LayoutIcon, Receipt, LogOut, Terminal, User, Globe, Server, Layers
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
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [clubAdmins, setClubAdmins] = useState(getInitialState('clubAdmins', []));
    const [superAdmins, setSuperAdmins] = useState(getInitialState('superAdmins', []));
    const [glavniyHistory, setGlavniyHistory] = useState(getInitialState('glavniyHistory', []));
    const [salesLog, setSalesLog] = useState(getInitialState('salesLog', []));
    const [historyEntries, setHistoryEntries] = useState(getInitialState('historyEntries', []));
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [now, setNow] = useState(Date.now());

    // Login Long Press Logic
    const [isPressingLock, setIsPressingLock] = useState(false);
    const [showHiddenLogin, setShowHiddenLogin] = useState(false);
    const pressTimer = useRef(null);

    // Modals
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

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Global persistence for users and history (always save)
    useEffect(() => {
        localStorage.setItem('clubAdmins', JSON.stringify(clubAdmins || []));
    }, [clubAdmins]);

    useEffect(() => {
        localStorage.setItem('superAdmins', JSON.stringify(superAdmins || []));
    }, [superAdmins]);

    useEffect(() => {
        localStorage.setItem('glavniyHistory', JSON.stringify(glavniyHistory || []));
    }, [glavniyHistory]);

    // Dashboard specific persistence
    useEffect(() => {
        if (view === 'login') return;
        localStorage.setItem('rooms', JSON.stringify(rooms || []));
        localStorage.setItem('salesLog', JSON.stringify(salesLog || []));
        localStorage.setItem('historyEntries', JSON.stringify(historyEntries || []));
        localStorage.setItem('inventory', JSON.stringify(inventory || []));
        localStorage.setItem('view', JSON.stringify(view));
        localStorage.setItem('username', JSON.stringify(username));
    }, [rooms, salesLog, historyEntries, inventory, view, username]);

    const addToGlavniyHistory = (text) => {
        const entry = { id: Date.now(), text, timestamp: Date.now(), dateStr: new Date().toLocaleString() };
        setGlavniyHistory(prev => [entry, ...(prev || []).slice(0, 999)]);
    };

    const currentAdminData = useMemo(() => {
        if (view === 'glavniyAdminDashboard') return { name: 'GLAVNIY ADMIN', club: 'EMPIRE', role: 'GLAVNIY' };
        const sAdmin = (superAdmins || []).find(a => a.login?.toLowerCase() === username?.toLowerCase());
        if (sAdmin) return { ...sAdmin, role: 'SUPER' };
        const cAdmin = (clubAdmins || []).find(a => a.login?.toLowerCase() === username?.toLowerCase());
        return cAdmin || { name: 'ADMIN', club: 'PLS', role: 'ADMIN' };
    }, [clubAdmins, superAdmins, username, view]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const calculateSession = (room, targetNow = now) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, items: [], startStr: '--:--' };
        try {
            const diff = Math.floor((targetNow - room.startTime) / 1000);
            return {
                time: `${Math.floor(diff / 3600).toString().padStart(2, '0')}:${Math.floor((diff % 3600) / 60).toString().padStart(2, '0')}:${(diff % 60).toString().padStart(2, '0')}`,
                total: Math.round((diff / 3600) * Number(room.price || 0) + (room.items || []).reduce((acc, i) => acc + (Number(i.price || 0) * (i.quantity || 1)), 0)),
                startStr: formatTimeShort(room.startTime)
            };
        } catch { return { time: '00:00:00', total: 0, startStr: '--:--' }; }
    };

    const empireStats = useMemo(() => {
        const nowTime = Date.now();
        const d = 24 * 60 * 60 * 1000; const m = 30 * d; const y = 365 * d;
        const totalDay = (salesLog || []).filter(s => (nowTime - s.timestamp) < d).reduce((acc, s) => acc + s.amount, 0);
        const totalMonth = (salesLog || []).filter(s => (nowTime - s.timestamp) < m).reduce((acc, s) => acc + s.amount, 0);
        const totalYear = (salesLog || []).filter(s => (nowTime - s.timestamp) < y).reduce((acc, s) => acc + s.amount, 0);
        return { totalDay, totalMonth, totalYear, superCount: (superAdmins || []).length, clubCount: (clubAdmins || []).length };
    }, [salesLog, superAdmins, clubAdmins]);

    const handleLogin = () => {
        const uLower = username?.trim().toLowerCase();
        const pTrim = pass?.trim();

        if (showHiddenLogin && uLower === '4567' && pTrim === '4567') {
            setView('glavniyAdminDashboard'); setUsername('4567'); setPass(''); return;
        }

        const sAdmin = (superAdmins || []).find(a => a.login?.toLowerCase() === uLower && a.pass === pTrim);
        if (sAdmin) { setView('superAdminDashboard'); setPass(''); setUsername(sAdmin.login); return; }

        const cAdmin = (clubAdmins || []).find(a => a.login?.toLowerCase() === uLower && a.pass === pTrim);
        if (cAdmin) { setView('clubDashboard'); setPass(''); setUsername(cAdmin.login); return; }

        alert('ID yoki Parol noto\'g\'ri!');
    };

    const startPress = () => {
        setIsPressingLock(true);
        pressTimer.current = setTimeout(() => {
            setShowHiddenLogin(true);
            window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
        }, 2000);
    };
    const endPress = () => { clearTimeout(pressTimer.current); setIsPressingLock(false); };

    const renderGlavniyDashboard = () => (
        <div className='p-6 space-y-6 pb-40 animate-fade-in'>
            <div className='flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5'>
                {[{ id: 'dashboard', l: 'Status' }, { id: 'superAdmins', l: 'Adminlar' }, { id: 'history', l: 'Istorya' }].map(t => (
                    <button key={t.id} onClick={() => setGlavniyTab(t.id)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${glavniyTab === t.id ? 'bg-[#ffcf4b] text-black shadow-lg shadow-[#ffcf4b]/20' : 'text-white/30'}`}>{t.l}</button>
                ))}
            </div>
            {glavniyTab === 'dashboard' && (
                <div className='space-y-6'>
                    <div className='bg-gradient-to-br from-[#ffcf4b]/10 to-transparent p-7 rounded-[2.5rem] border border-[#ffcf4b]/5 overflow-hidden'><p className='text-[10px] font-black opacity-30 uppercase tracking-[4px] mb-3'>SISTEMA_DAROMADI</p><h2 className='text-3xl font-black italic gold-text tracking-tighter mb-8 tabular-nums'>{empireStats.totalMonth.toLocaleString()} <span className='text-[10px] NOT-italic opacity-20'>UZS / OY</span></h2><div className='grid grid-cols-2 gap-4 pt-6 border-t border-white/5'><div><p className='text-[7px] font-black opacity-20 uppercase mb-1'>BUGUN</p><p className='text-sm font-black text-white/80'>{empireStats.totalDay.toLocaleString()}</p></div><div className='text-right'><p className='text-[7px] font-black opacity-20 uppercase mb-1'>YILLIK</p><p className='text-sm font-black gold-text'>{empireStats.totalYear.toLocaleString()}</p></div></div></div>
                    <div className='grid grid-cols-2 gap-3.5'><div className='bg-white/5 p-6 rounded-[2rem] border border-white/5 text-center'><p className='text-[8px] opacity-20 font-black mb-1 uppercase'>SUPERLAR</p><p className='text-2xl font-black gold-text italic'>{empireStats.superCount}</p></div><div className='bg-white/5 p-6 rounded-[2rem] border border-white/5 text-center'><p className='text-[8px] opacity-20 font-black mb-1 uppercase'>KLUBLAR</p><p className='text-2xl font-black italic opacity-30'>{empireStats.clubCount}</p></div></div>
                </div>
            )}
            {glavniyTab === 'superAdmins' && (
                <div className='space-y-4'>
                    <button onClick={() => setShowSuperAdminModal(true)} className='w-full py-5 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase text-[#ffcf4b] active:scale-95 transition-all'>+ SUPER ADMIN QO'SHISH</button>
                    {(superAdmins || []).map((sa, idx) => (
                        <div key={idx} className='bg-white/5 border border-white/5 p-5 rounded-[2rem] space-y-4'><div className='flex justify-between items-center'><div className='flex items-center gap-4'><div className='w-11 h-11 rounded-2xl bg-[#ffcf4b] flex items-center justify-center text-black'><Zap size={20} /></div><div><h4 className='text-[12px] font-black uppercase text-white/80'>{sa.name}</h4><p className='text-[8px] opacity-20 font-black uppercase'>{sa.phone}</p></div></div><button onClick={() => { if (window.confirm('O\'chirilsinmi?')) { setSuperAdmins(p => p.filter(x => x.login !== sa.login)); addToGlavniyHistory(`Super Admin o'chirildi: ${sa.name}`); } }} className='p-3 text-red-500/20 active:text-red-500 transition-colors'><Trash2 size={16} /></button></div><div className='grid grid-cols-2 gap-2'><div className='bg-black/30 p-3 rounded-xl border border-white/5 text-center'><p className='text-[6px] opacity-20 font-black uppercase mb-0.5'>LOGIN</p><p className='text-[10px] font-black opacity-60'>{sa.login}</p></div><div className='bg-black/30 p-3 rounded-xl border border-white/5 text-center'><p className='text-[6px] opacity-20 font-black uppercase mb-0.5'>PAROL</p><p className='text-[10px] font-black gold-text'>{sa.pass}</p></div></div></div>
                    ))}
                </div>
            )}
            {glavniyTab === 'history' && (<div className='space-y-3'>{(glavniyHistory || []).map(h => (<div key={h.id} className='bg-white/5 border border-white/5 p-4 rounded-2xl flex justify-between items-center'><div className='flex-1'><p className='text-[10px] font-medium text-white/60'>{h.text}</p></div><p className='text-[7px] opacity-10 font-black ml-4 uppercase text-right'>{h.dateStr}</p></div>))}</div>)}
        </div>
    );

    const renderSuperAdminDashboard = () => (
        <div className='p-6 space-y-6 pb-40 animate-fade-in'>
            <div className='bg-[#ffcf4b]/5 p-8 rounded-[2.5rem] border border-[#ffcf4b]/10'><div className='flex justify-between items-end'><div><p className='text-[10px] font-black opacity-20 uppercase tracking-[4px] mb-2'>SUPER_ADMIN_MODE</p><h2 className='text-3xl font-black italic gold-text tracking-tighter'>{currentAdminData.name}</h2></div><div className='w-12 h-12 rounded-2xl bg-[#ffcf4b] flex items-center justify-center text-black'><ShieldCheck size={24} /></div></div></div>
            <div className='space-y-4'><p className='text-[9px] font-black opacity-20 uppercase tracking-[4px] px-2'>CLUB ADMINLARINI BOSHQARISH</p><button onClick={() => setShowAdminModal(true)} className='w-full py-5 bg-white/5 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase text-[#ffcf4b] active:scale-95 transition-all'>+ YANGI CLUB ADMINI</button><div className='space-y-3.5'>{(clubAdmins || []).filter(a => a.creatorId === username).map((admin, idx) => (<div key={idx} className='bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4'><div className='flex justify-between items-center'><div className='flex items-center gap-4'><div className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#ffcf4b]/40'><User size={18} /></div><div><h4 className='text-[11px] font-black uppercase text-white/80'>{admin.name}</h4><p className='text-[8px] opacity-20 font-black uppercase'>{admin.club}</p></div></div><button onClick={() => { if (window.confirm('O\'chirilsinmi?')) setClubAdmins(p => p.filter(a => a.login !== admin.login)); }} className='p-3 text-red-500/20 active:text-red-500 transition-colors'><Trash2 size={16} /></button></div><div className='grid grid-cols-2 gap-2'><div className='bg-black/40 p-3 rounded-xl text-center'><p className='text-[6px] opacity-20 font-black uppercase'>ID</p><p className='text-[9px] font-black'>{admin.login}</p></div><div className='bg-black/40 p-3 rounded-xl text-center'><p className='text-[6px] opacity-20 font-black uppercase'>PS</p><p className='text-[9px] font-black gold-text'>{admin.pass}</p></div></div></div>))}</div></div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg font-sans overflow-x-hidden selection:bg-[#ffcf4b]/20'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <motion.div onMouseDown={startPress} onMouseUp={endPress} onTouchStart={startPress} onTouchEnd={endPress} animate={{ scale: isPressingLock ? 1.2 : 1, backgroundColor: showHiddenLogin ? '#ffcf4b' : isPressingLock ? '#ffcf4b' : 'rgba(255,255,255,0.05)', color: showHiddenLogin || isPressingLock ? '#000' : '#ffcf4b' }} className='w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-2xl transition-colors cursor-pointer'>{showHiddenLogin ? <Terminal size={28} /> : <Lock size={28} />}</motion.div>
                        <motion.h2 animate={{ color: showHiddenLogin ? '#ffcf4b' : 'rgba(255,207,75,0.8)' }} className='text-2xl font-black italic mb-10 tracking-tighter'>{showHiddenLogin ? 'GLAVNIY_ACCESS' : 'PLS_SYSTEM'}</motion.h2>
                        <div className='w-full max-w-[280px] space-y-3.5'>
                            <input type="text" placeholder={showHiddenLogin ? "ADMIN_ID" : "ID"} className={`bg-white/5 border h-14 w-full text-center rounded-2xl text-sm font-black uppercase tracking-widest placeholder:opacity-10 outline-none transition-all ${showHiddenLogin ? 'border-[#ffcf4b]' : 'border-white/10'}`} value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder={showHiddenLogin ? "ADMIN_PASS" : "PAROL"} className={`bg-white/5 border h-14 w-full text-center rounded-2xl text-sm font-black uppercase tracking-widest placeholder:opacity-10 outline-none transition-all ${showHiddenLogin ? 'border-[#ffcf4b]' : 'border-white/10'}`} value={pass} onChange={(e) => setPass(e.target.value)} />
                            <button onClick={handleLogin} className='mt-8 py-4 w-full text-xs font-black uppercase rounded-2xl bg-[#ffcf4b] text-black shadow-lg shadow-[#ffcf4b]/20 active:scale-95 transition-all'>TIZIMGA KIRISH</button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <header className='px-7 py-5 flex justify-between items-center bg-black/80 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-3'><div className='w-8 h-8 rounded-xl bg-[#ffcf4b] flex items-center justify-center shadow-md'>{view === 'glavniyAdminDashboard' ? <Globe size={16} className='text-black' /> : <Activity size={16} className='text-black' />}</div><div><h2 className='text-[13px] font-black italic uppercase tracking-tighter text-white/90'>{currentAdminData?.name}</h2><p className='text-[7px] opacity-20 uppercase font-black tracking-[3px]'>{currentAdminData?.club || 'SYSTEM'}</p></div></div>
                            <button onClick={() => { if (window.confirm('Chiqasizmi?')) { setView('login'); setUsername(''); setPass(''); setShowHiddenLogin(false); localStorage.setItem('view', 'login'); } }} className='p-2 bg-red-500/10 text-red-500/60 rounded-xl border border-red-500/10'><LogOut size={16} /></button>
                        </header>
                        <main className='max-w-[480px] mx-auto'>{view === 'glavniyAdminDashboard' ? renderGlavniyDashboard() : view === 'superAdminDashboard' ? renderSuperAdminDashboard() : <div className='p-6 py-40 text-center'><Activity className='mx-auto mb-4 opacity-10' size={48} /><p className='opacity-20 font-black text-[10px] uppercase tracking-[5px]'>CLUB PANEL ACTIVE</p></div>}</main>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showSuperAdminModal && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-lg font-black italic gold-text text-center mb-8 uppercase'>YANGI SUPER ADMIN</h2><div className='space-y-4'><input type="text" placeholder="ISMI" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newSuperAdmin.name} onChange={(e) => setNewSuperAdmin({ ...newSuperAdmin, name: e.target.value })} /><input type="text" placeholder="TEL" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newSuperAdmin.phone} onChange={(e) => setNewSuperAdmin({ ...newSuperAdmin, phone: e.target.value })} /><input type="text" placeholder="LOGIN" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newSuperAdmin.login} onChange={(e) => setNewSuperAdmin({ ...newSuperAdmin, login: e.target.value })} /><input type="password" placeholder="PAROL" className='bg-white/5 border border-white/10 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newSuperAdmin.pass} onChange={(e) => setNewSuperAdmin({ ...newSuperAdmin, pass: e.target.value })} /><div className='flex flex-col gap-2 pt-4'><button onClick={() => { setSuperAdmins([...superAdmins, newSuperAdmin]); addToGlavniyHistory(`Yangi Super Admin: ${newSuperAdmin.name}`); setShowSuperAdminModal(false); }} className='py-4.5 bg-[#ffcf4b] text-black font-black text-[10px] uppercase rounded-2xl'>QO'SHISH</button><button onClick={() => setShowSuperAdminModal(false)} className='py-2 text-[9px] opacity-20 font-black uppercase'>BEKOR QILISH</button></div></div></motion.div></div>)}
                {showAdminModal && (<div className='modal-overlay'><motion.div className='modal-content !p-8 !rounded-[2.5rem]'><h2 className='text-lg font-black italic gold-text text-center mb-8 uppercase'>CLUB ADMIN QO'SHISH</h2><div className='space-y-4'><input type="text" placeholder="ISMI" className='bg-white/5 border border-white/5 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} /><input type="text" placeholder="LOGIN" className='bg-white/5 border border-white/5 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newAdmin.login} onChange={(e) => setNewAdmin({ ...newAdmin, login: e.target.value })} /><input type="password" placeholder="PAROL" className='bg-white/5 border border-white/5 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newAdmin.pass} onChange={(e) => setNewAdmin({ ...newAdmin, pass: e.target.value })} /><input type="text" placeholder="KLUB NOMI" className='bg-white/5 border border-white/5 h-14 w-full text-center rounded-2xl text-[10px] font-black uppercase outline-none' value={newAdmin.club} onChange={(e) => setNewAdmin({ ...newAdmin, club: e.target.value })} /><div className='flex flex-col gap-2 pt-4'><button onClick={() => { setClubAdmins([...clubAdmins, { ...newAdmin, creatorId: username }]); addToGlavniyHistory(`Super Admin(${username}) yangi klub uladi: ${newAdmin.club}`); setShowAdminModal(false); }} className='py-4.5 bg-[#ffcf4b] text-black font-black text-[10px] uppercase rounded-2xl'>QO'SHISH</button><button onClick={() => setShowAdminModal(false)} className='py-2 text-[9px] opacity-20 font-black uppercase'>BEKOR QILISH</button></div></div></motion.div></div>)}
            </AnimatePresence>
        </div>
    );
};

export default App;
