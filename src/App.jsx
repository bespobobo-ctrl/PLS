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
        if (view === 'login') return;
        localStorage.setItem('rooms', JSON.stringify(rooms || []));
        localStorage.setItem('debts', JSON.stringify(debts || []));
        localStorage.setItem('salesLog', JSON.stringify(salesLog || []));
        localStorage.setItem('inventory', JSON.stringify(inventory || []));
        localStorage.setItem('view', JSON.stringify(view));
        localStorage.setItem('username', JSON.stringify(username));
    }, [rooms, debts, salesLog, inventory, view, username]);

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
            const dayTs = 24 * 60 * 60 * 1000;
            const completedDaily = clubLog.filter(s => (Date.now() - (s?.timestamp || 0)) < dayTs).reduce((acc, s) => acc + (s?.amount || 0), 0);
            const runningRevenue = (activeRooms || []).filter(r => r?.isBusy).reduce((acc, r) => acc + calculateSession(r).total, 0);
            const totalDebt = (debts || []).filter(d => d?.club === currentAdminData?.club).reduce((acc, d) => acc + (d?.amount || 0), 0);
            return { daily: completedDaily + runningRevenue, busy: activeRooms.filter(r => r?.isBusy).length, totalDebt };
        } catch { return { daily: 0, busy: 0, totalDebt: 0 }; }
    }, [salesLog, debts, currentAdminData?.club, activeRooms, now]);

    const confirmCheckout = () => {
        const stats = finalStats; const paid = Number(paidAmount) || 0;
        if (paid > 0) setSalesLog(p => [...(p || []), { id: Date.now(), amount: paid, timestamp: Date.now(), club: checkoutRoom?.club }]);
        if ((stats?.total || 0) - paid > 0) setDebts(p => [...(p || []), { id: Date.now(), name: debtUser.name || 'Mijoz', phone: debtUser.phone || '', amount: stats.total - paid, date: new Date().toLocaleString(), club: checkoutRoom?.club }]);
        setRooms(prev => (prev || []).map(r => r.id === checkoutRoom?.id ? { ...r, isBusy: false, startTime: null, items: [] } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
    };

    const renderClubAsosiy = () => (
        <div className='p-4 space-y-4 pb-28'>
            <div className='gold-glass !p-5 bg-gradient-to-br from-[#ffcf4b]/15 to-transparent border-[#ffcf4b]/20'>
                <p className='text-[8px] font-black opacity-30 uppercase tracking-[2px] mb-1'>KASSA LIVE</p>
                <h2 className='text-3xl font-black italic gold-text tracking-tighter tabular-nums'>{analytics.daily.toLocaleString()} <span className='text-[10px] opacity-40'>UZS</span></h2>
            </div>
            <div className='space-y-2'>
                <p className='text-[8px] font-black opacity-40 uppercase px-1 tracking-widest'>Sessions</p>
                {(activeRooms || []).filter(r => r?.isBusy).map(r => {
                    const s = calculateSession(r);
                    return (<div key={r.id} onClick={() => setActiveTab('xarita')} className='gold-glass !p-3.5 flex justify-between items-center bg-black/40 border-white/5 active:scale-95 transition-all'><div><p className='text-sm font-black italic uppercase'>{r.name}</p><p className='text-[7px] font-black gold-text opacity-60'>{s.time} • {s.startStr}</p></div><p className='text-xs font-black'>{s.total.toLocaleString()} UZS</p></div>);
                })}
            </div>
            <div className='gold-glass !p-4 border-white/5 bg-red-500/5'>
                <div className='flex justify-between items-center mb-2'><p className='text-[8px] font-black uppercase opacity-60'>Qarzlar</p><p className='text-xs font-black text-red-500'>{analytics.totalDebt.toLocaleString()} UZS</p></div>
                {(debts || []).filter(d => d?.club === currentAdminData?.club).slice(0, 3).map(d => (<div key={d.id} className='flex justify-between items-center p-2.5 bg-black/40 rounded-xl mb-1.5 border border-white/5 text-[9px]'><p className='font-black uppercase'>{d.name}</p><p className='font-black text-red-500'>-{d.amount.toLocaleString()}</p></div>))}
            </div>
        </div>
    );

    const renderClubXarita = () => (
        <div className='p-4 space-y-3 pb-28'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='w-full py-3.5 bg-[#ffcf4b] text-black font-black text-[10px] uppercase rounded-xl shadow-lg'>+ Yangi xona</button>
            <div className='grid grid-cols-1 gap-3'>
                {(activeRooms || []).map(room => {
                    const session = calculateSession(room); const isExp = expRooms[room?.id];
                    return (
                        <div key={room.id} className={`gold-glass transition-all ${room.isBusy ? 'ring-1 ring-[#ffcf4b]/20 bg-black/60 shadow-xl' : room.isSuspended ? 'opacity-40 grayscale border-red-500/20' : 'opacity-80'}`}>
                            <div className='p-3.5 border-b border-white/5 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                                <div className='flex items-center gap-3'><div className={`w-2 h-2 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div><div><h3 className='text-base font-black italic uppercase tracking-tighter'>{room.name}</h3><p className='text-[7px] font-black opacity-40 uppercase'>{room.isBusy ? `Ochildi: ${session.startStr}` : 'READY'}</p></div></div>
                                <div className='flex gap-1' onClick={e => e.stopPropagation()}>
                                    <button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isSuspended: !r.isSuspended, isBusy: false } : r))} className={`p-2 rounded-lg transition-all ${room.isSuspended ? 'bg-red-500 text-white' : 'bg-white/5 text-white/30'}`}><PauseCircle size={16} /></button>
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2 bg-white/5 rounded-lg text-white/30'><Edit3 size={16} /></button>
                                    <button onClick={() => { if (window.confirm('O\'chirish?')) setRooms(p => p.filter(r => r.id !== room.id)); }} className='p-2 bg-red-500/10 rounded-lg text-red-500/50'><Trash2 size={16} /></button>
                                </div>
                            </div>
                            {room.isBusy && (
                                <div className={`p-3.5 ${isExp ? 'space-y-4' : 'flex justify-between items-center'}`}>
                                    <div className='flex flex-col'><p className='text-[7px] font-black opacity-30 uppercase'>Vaqt</p><p className={`${isExp ? 'text-3xl' : 'text-lg'} font-black gold-text italic tabular-nums`}>{session.time}</p></div>
                                    {!isExp && <div className='text-right'><p className='text-[7px] font-black opacity-30 uppercase'>Jami</p><p className='text-lg font-black tabular-nums'>{session.total.toLocaleString()}</p></div>}
                                    {isExp && (
                                        <div className='pt-3.5 border-t border-white/5 space-y-4'>
                                            <div className='flex justify-between items-center'><p className='text-[10px] font-black italic gold-text'>{session.total.toLocaleString()} UZS</p><button onClick={() => setSelectedRoomForBar(room)} className='bg-[#ffcf4b] text-black px-4 py-1 rounded-full text-[8px] font-black uppercase shadow-lg shadow-[#ffcf4b]/20'>+ BAR</button></div>
                                            <div className='flex flex-wrap gap-1'>{(room.items || []).map((i, idx) => (<div key={idx} className='text-[7px] font-black uppercase bg-white/5 px-2 py-1 rounded-lg border border-white/5'>{i.name}</div>))}</div>
                                            <button onClick={() => { setFinalStats({ ...session }); setCheckoutRoom(room); }} className='w-full py-3.5 bg-red-600 rounded-xl text-white font-black uppercase italic text-[10px] shadow-xl active:scale-95'>Hisoblash</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!room.isBusy && !room.isSuspended && (<div className='px-3 pb-3 pt-0.5'><button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-3 bg-white/5 rounded-xl text-white font-black uppercase text-[9px] border border-white/5'>Ochish</button></div>)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderClubBar = () => (
        <div className='p-4 space-y-4 pb-28'>
            <div className='flex p-1 bg-white/5 rounded-xl border border-white/5 mb-4'>
                <button onClick={() => setBarSubTab('sotuv')} className={`flex-1 py-2.5 text-[8px] font-black uppercase rounded-lg ${barSubTab === 'sotuv' ? 'bg-[#ffcf4b] text-black' : 'text-white/30'}`}>Sotuv</button>
                <button onClick={() => setBarSubTab('ombor')} className={`flex-1 py-2.5 text-[8px] font-black uppercase rounded-lg ${barSubTab === 'ombor' ? 'bg-white/10 text-white' : 'text-white/30'}`}>Ombor</button>
            </div>
            {barSubTab === 'sotuv' ? (
                <div className='grid grid-cols-2 gap-2'>{(inventory || []).map(item => (<button key={item.id} onClick={() => { if (item.stock <= 0) return alert('Skladda yo\'q!'); if (window.confirm(`${item.name} sotilsinmi?`)) { setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSalesLog(p => [...p, { id: Date.now(), amount: item.price, timestamp: Date.now(), club: currentAdminData.club }]); } }} className='gold-glass !p-3.5 bg-black/40 border-white/5 h-[100px] flex flex-col justify-between text-left'><div><h4 className='text-[10px] font-black italic gold-text'>{item.name}</h4><p className='text-[7px] opacity-30'>{item.category}</p></div><p className='text-[10px] font-black'>{item.price.toLocaleString()} UZS</p></button>))}</div>
            ) : (
                <div className='space-y-2'>
                    <button onClick={() => setShowInventoryModal(true)} className='w-full py-3 bg-white/5 rounded-lg font-black text-[8px] uppercase border border-white/5 mb-3'>+ MAHSULOT QO'SHISH</button>
                    {(inventory || []).map(item => (<div key={item.id} className='gold-glass !p-3 flex justify-between items-center text-[10px]'><div className='flex items-center gap-3'><div className='w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#ffcf4b]'><Package size={14} /></div><div><h4 className='font-black'>{item.name}</h4><p className='text-[7px] opacity-30'>Qoldiq: {item.stock} ta</p></div></div><button onClick={() => setInventory(p => p.filter(i => i.id !== item.id))} className='p-2 bg-red-500/10 rounded-lg text-red-500/50'><Trash2 size={12} /></button></div>))}
                </div>
            )}
        </div>
    );

    return (
        <div className='min-h-screen bg-[#000] text-white animated-bg pb-32 font-sans'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-10'>
                        <div className='w-14 h-14 rounded-2xl bg-[#ffcf4b] flex items-center justify-center mb-8 shadow-2xl'><Lock size={24} className='text-black' /></div>
                        <h1 className='text-3xl font-black italic mb-10 uppercase text-[#ffcf4b] tracking-tighter'>PLS_ADMIN</h1>
                        <input type="text" placeholder="LOGIN" className='input-luxury-small h-12 w-full max-w-[260px] text-sm' value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button onClick={() => setView('clubDashboard')} className='btn-gold-minimal mt-8 py-4 w-full max-w-[260px] text-sm font-black uppercase rounded-xl shadow-xl'>KIRISH</button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='px-5 py-3.5 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-3'><div className='w-9 h-9 rounded-xl bg-[#ffcf4b] flex items-center justify-center'><Activity size={18} className='text-black' /></div><div><h2 className='text-sm font-black italic uppercase tracking-tighter'>{currentAdminData?.name}</h2><p className='text-[6px] font-black opacity-30 uppercase tracking-[2px]'>{currentAdminData?.club}</p></div></div>
                            <div className='text-right'><p className='text-[10px] font-black tabular-nums gold-text'>{new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p><p className='text-[6px] opacity-30 font-black uppercase italic'>LIVE</p></div>
                        </div>
                        <main>{activeTab === 'asosiy' ? renderClubAsosiy() : activeTab === 'bar' ? renderClubBar() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation (Very Compact) */}
            {view !== 'login' && (
                <div className='fixed bottom-4 left-4 right-4 bg-black/95 backdrop-blur-3xl border border-white/5 p-3 rounded-2xl flex justify-around z-50 shadow-2xl'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><BarChart size={20} /><span className='text-[7px] font-black uppercase'>Asosiy</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1 ${activeTab === 'xarita' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[7px] font-black uppercase'>Xarita</span></button>
                    <button onClick={() => setActiveTab('bar')} className={`flex flex-col items-center gap-1 ${activeTab === 'bar' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Boxes size={20} /><span className='text-[7px] font-black uppercase'>Bar</span></button>
                </div>
            )}

            {/* Checkout Modal (ULTRA COMPACT) */}
            <AnimatePresence>
                {checkoutRoom && finalStats && (
                    <div className='modal-overlay'><motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='modal-content !p-5 !max-w-[92%] border border-white/10'>
                        <h2 className='text-base font-black italic gold-text text-center mb-5 uppercase tracking-widest'>HISOB-KITOBLAR</h2>
                        <div className='grid grid-cols-2 gap-2 mb-4'>
                            <div className='gold-glass !p-2 border-white/5 text-center'><p className='text-[6px] opacity-40 font-black uppercase'>BOSHLA</p><p className='text-sm font-black italic'>{finalStats.startStr}</p></div>
                            <div className='gold-glass !p-2 border-white/5 text-center'><p className='text-[6px] opacity-40 font-black uppercase'>TUGADI</p><p className='text-sm font-black italic gold-text'>{finalStats.endStr}</p></div>
                        </div>
                        <div className='gold-glass !p-4 text-center mb-5 bg-[#ffcf4b]/5 relative'>
                            <p className='text-[7px] opacity-40 font-black mb-1'>DAVOMIYLIGI: <span className='text-white'>{finalStats.time}</span></p>
                            <p className='text-3xl font-black gold-text italic tracking-tighter tabular-nums'>{finalStats.total.toLocaleString()} <span className='text-[10px] opacity-40'>UZS</span></p>
                        </div>
                        <div className='space-y-2 mb-5'>
                            <input type="number" placeholder="OLINGAN PUL" className='input-luxury-small h-12 text-lg font-black text-center' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {(finalStats.total - Number(paidAmount) > 0 && Number(paidAmount) > 0) && (
                                <div className='space-y-1.5 p-3 bg-red-500/5 rounded-xl border border-red-500/10'>
                                    <input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small h-9 text-[10px]' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL" className='input-luxury-small h-9 text-[10px]' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                </div>
                            )}
                        </div>
                        <div className='flex flex-col gap-2'>
                            <button onClick={confirmCheckout} className='py-4 bg-[#ffcf4b] text-black text-xs font-black uppercase rounded-xl active:scale-95 shadow-lg shadow-[#ffcf4b]/10'>HISOBLASHNI TASDIQLASH</button>
                            <button onClick={() => setCheckoutRoom(null)} className='py-2 text-[8px] opacity-30 font-black uppercase tracking-widest'>YOPISH</button>
                        </div>
                    </motion.div></div>
                )}

                {/* Other Modals (Minimized Padding) */}
                {showInventoryModal && (<div className='modal-overlay'><motion.div className='modal-content !p-5'><h2 className='text-base font-black gold-text mb-4 text-center uppercase'>MAHSULOT</h2><div className='space-y-3'><input type="text" placeholder="Nomi" className='input-luxury-small h-11 text-xs' value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /><div className='grid grid-cols-2 gap-2'><input type="number" placeholder="Narxi" className='input-luxury-small h-11 text-xs' value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} /><input type="number" placeholder="Sklad" className='input-luxury-small h-11 text-xs' value={newItem.stock} onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })} /></div><button onClick={() => { setInventory([...inventory, { ...newItem, id: Date.now(), sold: 0 }]); setShowInventoryModal(false); }} className='w-full py-4 bg-[#ffcf4b] text-black font-black uppercase rounded-xl text-xs'>SAQLASH</button></div></motion.div></div>)}
                {selectedRoomForBar && (<div className='modal-overlay'><motion.div className='modal-content !p-5'><div className='flex justify-between items-center mb-4'><p className='text-xs font-black italic gold-text uppercase'>BAR TANLASH</p><button onClick={() => setSelectedRoomForBar(null)} className='p-1.5 bg-white/5 rounded-full'><X size={14} /></button></div><div className='grid grid-cols-2 gap-2 max-h-[40vh] overflow-y-auto pr-1'>{(inventory || []).map(item => (<button key={item.id} disabled={item.stock <= 0} onClick={() => { setRooms(p => p.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r)); setInventory(p => p.map(i => i.id === item.id ? { ...i, stock: i.stock - 1, sold: (i.sold || 0) + 1 } : i)); setSelectedRoomForBar(null); }} className='gold-glass !p-3 h-[80px] text-left text-[8px] font-black uppercase active:scale-95 disabled:opacity-20 flex flex-col justify-between'><span>{item.name}</span><span className='gold-text'>{item.price.toLocaleString()}</span></button>))}</div></motion.div></div>)}
                {showAddRoom && (<div className='modal-overlay'><motion.div className='modal-content !p-5'><h2 className='text-base font-black italic text-center mb-5 uppercase tracking-widest'>XONA PARAMETRI</h2><div className='space-y-3'><input type="text" placeholder="XONA NOMI" className='input-luxury-small h-11 text-xs' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} /><input type="number" placeholder="SOATIGA NARX" className='input-luxury-small h-11 text-xs' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: Number(e.target.value) }) : setNewRoom({ ...newRoom, price: Number(e.target.value) })} /><button onClick={() => { if (editingRoom) { setRooms(rooms.map(r => r.id === editingRoom.id ? editingRoom : r)); setEditingRoom(null); } else { setRooms([...rooms, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, isSuspended: false }]); } setShowAddRoom(false); }} className='w-full py-4 bg-[#ffcf4b] text-black font-black uppercase rounded-xl text-xs shadow-lg'>SAQLASH</button></div></motion.div></div>)}
            </AnimatePresence>
        </div>
    );
};

export default App;
