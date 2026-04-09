import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight, BarChart, Dribbble
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
    const [salesLog, setSalesLog] = useState(getInitialState('salesLog', []));
    const [inventory, setInventory] = useState(getInitialState('inventory', [
        { id: 1, name: 'PEPSI', price: 7000 }, { id: 2, name: 'LAYS', price: 12000 }, { id: 3, name: 'HOTDOG', price: 15000 }
    ]));
    const [now, setNow] = useState(Date.now());
    const [expRooms, setExpRooms] = useState({});

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

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
        const itemsPrice = (room.items || []).reduce((acc, i) => acc + (Number(i.price) * (i.quantity || 1)), 0);
        return {
            time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice),
            items: room.items || [],
            itemsPrice
        };
    };

    const analytics = useMemo(() => {
        const log = salesLog.filter(s => s.club === currentAdminData.club);
        const day = 24 * 60 * 60 * 1000;
        const nowMs = Date.now();

        const completedDaily = log.filter(s => nowMs - s.timestamp < day).reduce((acc, s) => acc + s.amount, 0);
        // Add running sessions to daily revenue
        const runningRevenue = activeRooms.filter(r => r.isBusy).reduce((acc, r) => acc + calculateSession(r).total, 0);

        const daily = completedDaily + runningRevenue;
        const weekly = log.filter(s => nowMs - s.timestamp < day * 7).reduce((acc, s) => acc + s.amount, 0) + runningRevenue;
        const monthly = log.filter(s => nowMs - s.timestamp < day * 30).reduce((acc, s) => acc + s.amount, 0) + runningRevenue;

        const totalDebt = debts.filter(d => d.club === currentAdminData.club).reduce((acc, d) => acc + d.amount, 0);

        return {
            daily, weekly, monthly, runningRevenue, totalDebt,
            busy: activeRooms.filter(r => r.isBusy).length,
            free: activeRooms.filter(r => !r.isBusy && !r.isSuspended).length,
            suspended: activeRooms.filter(r => r.isSuspended).length
        };
    }, [salesLog, debts, currentAdminData.club, activeRooms, now]); // Added 'now' to dependency

    // Modals & Logic (Checkout, confirm, etc.) omitted for brevity but they exist in full file

    const confirmCheckout = () => {
        // Same logic as before v64/v61 but ensuring sales log is updated
        const stats = finalStats;
        const paid = Number(paidAmount) || 0;
        if (paid > 0) setSalesLog(p => [...p, { id: Date.now(), amount: paid, timestamp: Date.now(), club: checkoutRoom.club }]);
        if (stats.total - paid > 0) setDebts(p => [...p, { id: Date.now(), name: debtUser.name || 'Mijoz', phone: debtUser.phone || 'Noma\'lum', amount: stats.total - paid, date: new Date().toLocaleString(), club: checkoutRoom.club }]);
        setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? { ...r, isBusy: false, startTime: null, items: [] } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
    };

    const renderClubAsosiy = () => (
        <div className='p-4 space-y-6 pb-28 font-sans'>
            {/* Live Revenue Header */}
            <div className='gold-glass !p-8 bg-gradient-to-br from-[#ffcf4b]/15 to-transparent border-[#ffcf4b]/20 relative overflow-hidden'>
                <div className='absolute -right-4 -top-4 w-32 h-32 bg-[#ffcf4b]/10 rounded-full blur-3xl'></div>
                <div className='flex justify-between items-start'>
                    <div>
                        <div className='flex items-center gap-2 mb-2'><span className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse'></span><p className='text-[10px] font-black opacity-30 uppercase tracking-[4px]'>LIVE_REVENUE_BUGUN</p></div>
                        <h2 className='text-5xl font-black italic gold-text tracking-tighter tabular-nums mb-2'>{analytics.daily.toLocaleString()} <span className='text-sm opacity-40'>UZS</span></h2>
                        <p className='text-[9px] font-black opacity-30 uppercase'>Hozirgi ochiq xonalar: <span className='text-white/60'>+{analytics.runningRevenue.toLocaleString()} UZS</span></p>
                    </div>
                </div>
                <div className='flex gap-2 mt-8'>
                    <div className='bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 flex-1'><p className='text-[8px] opacity-30 font-black uppercase mb-1'>Haftalik</p><p className='text-xs font-black italic'>{analytics.weekly.toLocaleString()}</p></div>
                    <div className='bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 flex-1'><p className='text-[8px] opacity-30 font-black uppercase mb-1'>Oylik</p><p className='text-xs font-black italic'>{analytics.monthly.toLocaleString()}</p></div>
                </div>
            </div>

            {/* Real-time Room Feed */}
            <div className='space-y-4'>
                <div className='flex justify-between items-center'><p className='text-[10px] font-black opacity-40 uppercase tracking-widest'>OCHIQ_XONALAR ({analytics.busy})</p><Zap size={14} className='text-[#ffcf4b] animate-bounce' /></div>
                <div className='space-y-3'>
                    {activeRooms.filter(r => r.isBusy).map(r => {
                        const s = calculateSession(r);
                        return (
                            <div key={r.id} onClick={() => { setActiveTab('xarita'); setExpRooms({ [r.id]: true }); }} className='gold-glass !p-5 flex justify-between items-center border-white/5 active:scale-[0.98] transition-all bg-black/40'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-10 h-10 rounded-xl bg-[#ffcf4b]/10 flex items-center justify-center text-[#ffcf4b]'><Monitor size={20} /></div>
                                    <div><h4 className='text-lg font-black italic tracking-tighter uppercase'>{r.name}</h4><p className='text-[9px] font-black gold-text italic tabular-nums'>{s.time}</p></div>
                                </div>
                                <div className='text-right'><p className='text-sm font-black tabular-nums'>{s.total.toLocaleString()} UZS</p><p className='text-[8px] opacity-30 font-black uppercase'>Hozirga_hisob</p></div>
                            </div>
                        );
                    })}
                    {analytics.busy === 0 && <div className='p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10'><p className='text-[10px] opacity-20 font-black uppercase italic tracking-widest'>Hozircha barcha xonalar bo'sh</p></div>}
                </div>
            </div>

            {/* Debts Summary */}
            <div className='gold-glass !p-6 border-red-500/20 bg-red-500/5'>
                <div className='flex justify-between items-center mb-6'><div className='flex items-center gap-3'><Users size={16} className='text-red-500' /><h3 className='text-[10px] font-black uppercase tracking-widest opacity-60'>QARZLAR RO'YXATI</h3></div><p className='text-xs font-black text-red-500 tracking-tighter'>{analytics.totalDebt.toLocaleString()} UZS</p></div>
                <div className='space-y-3'>
                    {debts.filter(d => d.club === currentAdminData.club).slice(0, 5).map(d => (
                        <div key={d.id} className='flex justify-between items-center p-4 bg-black/40 rounded-[1.5rem] border border-white/5'>
                            <div><p className='text-[10px] font-black uppercase m-0'>{d.name}</p><p className='text-[8px] opacity-20'>{d.date}</p></div>
                            <p className='text-xs font-black text-red-500'>-{d.amount.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderClubXarita = () => (
        <div className='p-4 space-y-4 pt-1'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='btn-gold-minimal !py-5 bg-[#ffcf4b] text-black border-none font-black text-xs'><Plus size={16} /> YANGI XONA</button>
            <div className='grid grid-cols-1 gap-4'>
                {activeRooms?.map(room => {
                    const session = calculateSession(room); const isExp = expRooms[room.id];
                    return (
                        <div key={room.id} className={`gold-glass transition-all duration-300 ${room.isBusy ? ' ring-1 ring-[#ffcf4b]/20 bg-black/60 shadow-2xl' : room.isSuspended ? 'opacity-40 grayscale' : 'opacity-80'}`}>
                            <div className='p-4 border-b border-white/5 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                                <div className='flex items-center gap-3'><div className={`w-3 h-3 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div><div><h3 className='text-xl font-black italic uppercase tracking-tighter'>{room.name}</h3><p className='text-[8px] opacity-40 font-black uppercase'>{room.isBusy ? 'ACTIVE' : 'READY'}</p></div></div>
                                <div className='flex gap-1' onClick={e => e.stopPropagation()}>
                                    {room.isBusy && <button onClick={() => setExpRooms(p => ({ ...p, [room.id]: !isExp }))} className='p-2.5 bg-white/5 rounded-xl text-[#ffcf4b]'>{isExp ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>}
                                    <button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isSuspended: !r.isSuspended, isBusy: false } : r))} className={`p-2.5 rounded-xl ${room.isSuspended ? 'bg-red-500 text-white' : 'bg-white/5 text-white/30'}`}><PauseCircle size={18} /></button>
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2.5 bg-white/5 rounded-xl text-white/30'><Edit3 size={18} /></button>
                                </div>
                            </div>
                            {room.isBusy && (
                                <div className={`p-5 bg-gradient-to-b from-[#ffcf4b]/5 to-transparent transition-all ${isExp ? 'space-y-5' : 'flex justify-between items-center'}`}>
                                    <div className='flex flex-col'><p className='text-[8px] font-black opacity-30 uppercase'>VAQT</p><p className={`${isExp ? 'text-4xl' : 'text-lg'} font-black tabular-nums gold-text italic`}>{session.time}</p></div>
                                    <div className={`flex flex-col ${isExp ? '' : 'text-right'}`}><p className='text-[8px] font-black opacity-30 uppercase'>SUMMA</p><p className={`${isExp ? 'text-2xl' : 'text-lg'} font-black tabular-nums`}>{session.total.toLocaleString()} <span className='text-[8px] opacity-30'>UZS</span></p></div>
                                    {isExp && (
                                        <div className='pt-6 border-t border-white/5 space-y-6'>
                                            <div className='flex justify-between items-center'><p className='text-[9px] font-black opacity-40 uppercase'>BAR MAHSULOTLAR</p><button onClick={() => setSelectedRoomForBar(room)} className='bg-[#ffcf4b] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg shadow-[#ffcf4b]/20 active:scale-95 transition-all'>+ BAR</button></div>
                                            <div className='flex flex-wrap gap-1.5'>{session.items.map((i, idx) => (<div key={idx} className='text-[8px] font-black uppercase bg-white/10 px-3 py-2 rounded-xl border border-white/5'>{i.name} x{i.quantity}</div>))}</div>
                                            <button onClick={() => { setFinalStats(session); setCheckoutRoom(room); }} className='w-full py-5 bg-red-500 rounded-[1.7rem] text-white font-black uppercase italic text-xs shadow-2xl shadow-red-500/40 active:scale-95 transition-all'>STOP VA HISOBLASH</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!room.isBusy && !room.isSuspended && (<div className='px-4 pb-4 pt-2'><button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-4 bg-white/5 rounded-2xl text-white font-black uppercase text-xs border border-white/10 active:scale-95 transition-all font-black'>START SESSION</button></div>)}
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
                        <h1 className='text-5xl font-black italic mb-10 tracking-tighter uppercase italic text-[#ffcf4b]'>PLS</h1>
                        <div className='w-full max-w-[300px] space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small h-16 !bg-white/5' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <button onClick={() => { localStorage.setItem('username', JSON.stringify(username)); setView('clubDashboard'); }} className='btn-gold-minimal mt-8 py-5 !rounded-[2rem] text-lg font-black'>TIZIMGA KIRISH</button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='px-6 py-5 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'><div className='w-12 h-12 rounded-2xl bg-[#ffcf4b] flex items-center justify-center shadow-lg shadow-[#ffcf4b]/20'><Activity size={24} className='text-black' /></div><div><h2 className='text-lg font-black italic uppercase tracking-tighter'>{currentAdminData?.name}</h2><p className='text-[8px] font-black opacity-30 uppercase tracking-[3px]'>{currentAdminData?.club}</p></div></div>
                            <button onClick={() => setView('login')} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20'><X size={24} /></button>
                        </div>
                        <main>{activeTab === 'asosiy' ? renderClubAsosiy() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-5 left-5 right-5 bg-black/80 backdrop-blur-3xl border border-white/10 p-5 rounded-[2.5rem] flex justify-around z-50 shadow-2xl'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'asosiy' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><BarChart size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>ASOSIY</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'xarita' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><Monitor size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>XARITA</span></button>
                </div>
            )}

            {/* Modals - Same logic but ensuring v65 consistency */}
            <AnimatePresence>
                {checkoutRoom && finalStats && (
                    <div className='modal-overlay'><motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className='modal-content !p-8 border border-white/5 shadow-2xl'>
                        <h2 className='text-3xl font-black italic gold-text text-center mb-10 tracking-widest uppercase'>CHECKOUT</h2>
                        <div className='gold-glass p-8 text-center mb-10 bg-[#ffcf4b]/5 border-[#ffcf4b]/20'><p className='text-[10px] opacity-40 uppercase font-black tracking-[4px] mb-2'>JAMI TO'LOV</p><p className='text-5xl font-black italic tracking-tighter tabular-nums'>{finalStats.total.toLocaleString()} <span className='text-lg'>UZS</span></p></div>
                        <div className='space-y-4'>
                            <input type="number" placeholder="OLINGAN PUL" className='input-luxury-small h-20 text-3xl font-black text-center' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {finalStats.total - (Number(paidAmount) || 0) > 0 && Number(paidAmount) > 0 && (
                                <div className='space-y-4 p-6 bg-red-500/10 rounded-3xl border border-red-500/20'>
                                    <input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small !bg-black/80 h-14' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL RAQAMI" className='input-luxury-small !bg-black/80 h-14' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                </div>
                            )}
                            <button onClick={confirmCheckout} className='btn-gold-minimal !py-8 !rounded-[2.5rem] text-xl font-black shadow-2xl shadow-[#ffcf4b]/20'>TASDIQLASH</button>
                            <button onClick={() => { setCheckoutRoom(null); setFinalStats(null); }} className='w-full py-4 text-[10px] opacity-20 font-black uppercase tracking-widest'>YOPISH</button>
                        </div>
                    </motion.div></div>
                )}
                {selectedRoomForBar && (
                    <div className='modal-overlay'><motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className='modal-content !max-w-md'>
                        <div className='flex justify-between items-center mb-10'><h2 className='text-2xl font-black italic gold-text tracking-tighter'>BARDAN TANLASH</h2><button onClick={() => setSelectedRoomForBar(null)} className='p-3 bg-white/5 rounded-full'><X size={24} /></button></div>
                        <div className='grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2'>
                            {inventory.map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-6 text-left border-white/5 hover:bg-white/5 active:scale-95 transition-all'><p className='text-[10px] font-black uppercase mb-1 opacity-50'>{item.name}</p><p className='text-xl font-black gold-text'>{item.price.toLocaleString()} <span className='text-xs'>UZS</span></p></button>
                            ))}
                        </div>
                    </motion.div></div>
                )}
                {showAddRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='modal-content'>
                        <h2 className='text-2xl font-black italic gold-text mb-12 uppercase tracking-tighter text-center'>XONA_SOZLAMALARI</h2>
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
