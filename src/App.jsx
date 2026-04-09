import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp, Wallet, TrendingDown, ArrowUpRight
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
    const [inventory, setInventory] = useState(getInitialState('inventory', [
        { id: 1, name: 'PEPSI', price: 7000 }, { id: 2, name: 'LAYS', price: 12000 }, { id: 3, name: 'HOTDOG', price: 15000 }
    ]));
    const [now, setNow] = useState(Date.now());
    const [expRooms, setExpRooms] = useState({});

    // Modals
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
        localStorage.setItem('view', JSON.stringify(view));
    }, [rooms, debts, view]);

    const currentAdminData = useMemo(() => {
        return clubAdmins?.find(a => a?.login === username) || { name: 'ADMIN', club: 'PLS' };
    }, [clubAdmins, username]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const stats = useMemo(() => {
        const dailyRoom = activeRooms.reduce((acc, r) => acc + (r.dailyRevenue || 0), 0);
        const dailyBar = activeRooms.reduce((acc, r) => acc + (r.barRevenue || 0), 0);
        const totalDebt = debts.filter(d => d.club === currentAdminData.club).reduce((acc, d) => acc + d.amount, 0);
        const busy = activeRooms.filter(r => r.isBusy).length;
        const free = activeRooms.filter(r => !r.isBusy && !r.isSuspended).length;
        const suspended = activeRooms.filter(r => r.isSuspended).length;

        return { dailyTotal: dailyRoom + dailyBar, dailyRoom, dailyBar, totalDebt, busy, free, suspended, totalRooms: activeRooms.length };
    }, [activeRooms, debts, currentAdminData.club]);

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
        if (remaining > 0) {
            setDebts(prev => [...prev, { id: Date.now(), name: debtUser.name || 'Noma\'lum', phone: debtUser.phone || 'Noma\'lum', amount: remaining, date: new Date().toLocaleString(), club: checkoutRoom.club }]);
        }
        setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? { ...r, isBusy: false, startTime: null, items: [], dailyRevenue: (r.dailyRevenue || 0) + paid, barRevenue: (r.barRevenue || 0) + finalStats.itemsPrice } : r));
        setCheckoutRoom(null); setFinalStats(null); setPaidAmount(''); setDebtUser({ name: '', phone: '' });
    };

    const renderClubAsosiy = () => (
        <div className='p-4 space-y-6 pb-20'>
            {/* Main Stats Card */}
            <div className='relative overflow-hidden gold-glass !p-6 bg-gradient-to-br from-[#ffcf4b]/20 to-transparent border-[#ffcf4b]/30'>
                <div className='flex justify-between items-start mb-6'>
                    <div><p className='text-[10px] font-black opacity-40 uppercase tracking-[3px] mb-1'>KASSA_BUGUN</p><h2 className='text-4xl font-black italic gold-text tracking-tighter'>{stats.dailyTotal.toLocaleString()} <span className='text-sm italic opacity-50'>UZS</span></h2></div>
                    <div className='w-12 h-12 rounded-2xl bg-[#ffcf4b] flex items-center justify-center text-black'><TrendingUp size={24} /></div>
                </div>
                <div className='grid grid-cols-2 gap-4 border-t border-white/5 pt-6'>
                    <div><p className='text-[8px] opacity-40 font-bold uppercase mb-1'>XONALARDAN</p><p className='text-md font-black'>+{stats.dailyRoom.toLocaleString()}</p></div>
                    <div><p className='text-[8px] opacity-40 font-bold uppercase mb-1'>BARDAN</p><p className='text-md font-black'>+{stats.dailyBar.toLocaleString()}</p></div>
                </div>
            </div>

            {/* Room Status Grid */}
            <div className='grid grid-cols-3 gap-3'>
                <div className='gold-glass !p-4 border-white/5 text-center'><p className='text-[8px] opacity-40 font-bold uppercase mb-2'>BAND</p><p className='text-2xl font-black gold-text italic'>{stats.busy}</p></div>
                <div className='gold-glass !p-4 border-white/5 text-center'><p className='text-[8px] opacity-40 font-bold uppercase mb-2'>BO'SH</p><p className='text-2xl font-black italic'>{stats.free}</p></div>
                <div className='gold-glass !p-4 border-white/5 text-center'><p className='text-[8px] opacity-40 font-bold uppercase mb-2'>TEXNIK</p><p className='text-2xl font-black text-red-500 italic'>{stats.suspended}</p></div>
            </div>

            {/* Debt Overview */}
            <div className='gold-glass !p-6 border-red-500/20 bg-red-500/5'>
                <div className='flex justify-between items-center mb-6'>
                    <div className='flex items-center gap-3'><div className='w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500'><Wallet size={16} /></div><h3 className='text-xs font-black uppercase tracking-widest'>QARZLAR RO'YXATI</h3></div>
                    <div className='text-right'><p className='text-[10px] text-red-500 font-bold'>{stats.totalDebt.toLocaleString()} UZS</p></div>
                </div>
                <div className='space-y-3 max-h-[300px] overflow-y-auto pr-1'>
                    {debts.filter(d => d.club === currentAdminData.club).length > 0 ? debts.filter(d => d.club === currentAdminData.club).map(debt => (
                        <div key={debt.id} className='flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5'>
                            <div><p className='text-[10px] font-black uppercase'>{debt.name}</p><p className='text-[8px] opacity-30'>{debt.date}</p></div>
                            <p className='text-xs font-black text-red-500'>-{debt.amount.toLocaleString()}</p>
                        </div>
                    )) : <p className='text-[10px] opacity-20 italic text-center py-4 uppercase'>Hozircha qarzlar yo'q</p>}
                </div>
            </div>

            {/* Quick Actions */}
            <div className='p-2 flex gap-4 overflow-x-auto no-scrollbar'>
                <button onClick={() => setActiveTab('xarita')} className='flex-shrink-0 bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col gap-3 min-w-[140px]'>
                    <Plus size={20} className='text-[#ffcf4b]' />
                    <span className='text-[9px] font-black uppercase tracking-wider'>Xona qo'shish</span>
                </button>
            </div>
        </div>
    );

    const renderClubXarita = () => (
        <div className='p-4 space-y-4 font-sans'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='btn-gold-minimal !py-5 bg-gradient-to-r from-[#ffcf4b] to-[#ffb14b] text-black border-none'><Plus size={18} /><span>YANGI XONA QO'SHISH</span></button>
            <div className='grid grid-cols-1 gap-4'>
                {activeRooms?.map(room => {
                    const session = calculateSession(room);
                    const isExp = expRooms[room.id];
                    return (
                        <div key={room.id} className={`gold-glass transition-all duration-300 ${room.isBusy ? ' ring-1 ring-[#ffcf4b]/20 bg-black/40' : room.isSuspended ? 'opacity-40' : 'opacity-80'}`}>
                            <div className='p-4 border-b border-white/5 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-3 h-3 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div>
                                    <div><h3 className='text-2xl font-black italic uppercase italic tracking-tighter'>{room.name || 'PC'}</h3><p className='text-[8px] opacity-40 font-black uppercase tracking-widest'>{room.isBusy ? 'ACTIVE' : room.isSuspended ? 'SUSPENDED' : 'READY'}</p></div>
                                </div>
                                <div className='flex gap-1.5' onClick={e => e.stopPropagation()}>
                                    {room.isBusy && <button onClick={() => setExpRooms(p => ({ ...p, [room.id]: !isExp }))} className='p-2.5 bg-white/5 rounded-xl text-[#ffcf4b]'>{isExp ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</button>}
                                    <button onClick={() => setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isSuspended: !r.isSuspended, isBusy: false } : r))} className={`p-2.5 rounded-xl transition-all ${room.isSuspended ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-white/30'}`}><PauseCircle size={18} /></button>
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2.5 bg-white/5 rounded-xl text-white/30'><Edit3 size={18} /></button>
                                    <button onClick={() => { if (window.confirm('O\'chirmoqchimisiz?')) setRooms(prev => prev.filter(r => r.id !== room.id)) }} className='p-2.5 bg-white/5 rounded-xl text-red-500/30'><Trash2 size={18} /></button>
                                </div>
                            </div>
                            {room.isBusy && (
                                <div className={`p-4 bg-[#ffcf4b]/5 transition-all ${isExp ? 'space-y-4' : 'flex justify-between items-center'}`}>
                                    <div className='flex flex-col'><p className='text-[8px] font-black opacity-30 uppercase tracking-wider'>VAQT</p><p className={`${isExp ? 'text-4xl' : 'text-xl'} font-black tabular-nums gold-text italic`}>{session.time}</p></div>
                                    <div className={`flex flex-col ${isExp ? '' : 'text-right'}`}><p className='text-[8px] font-black opacity-30 uppercase tracking-wider'>SUMMA</p><p className={`${isExp ? 'text-2xl' : 'text-lg'} font-black tabular-nums`}>{session.total.toLocaleString()} <span className='text-[8px] opacity-30'>UZS</span></p></div>
                                    {isExp && (
                                        <div className='pt-6 border-t border-white/5 space-y-5'>
                                            <div className='flex justify-between items-center'><p className='text-[9px] font-black opacity-40 uppercase'>BAR XIZMATI</p><button onClick={() => setSelectedRoomForBar(room)} className='bg-[#ffcf4b] text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase'>+ BAR</button></div>
                                            <div className='flex flex-wrap gap-1.5'>{session.items.map((i, idx) => (<div key={idx} className='text-[8px] font-black uppercase bg-white/10 px-3 py-2 rounded-xl border border-white/5'>{i.name} x{i.quantity}</div>))}</div>
                                            <button onClick={() => { setFinalStats(session); setCheckoutRoom(room); }} className='w-full py-5 bg-red-500 rounded-[1.5rem] text-white font-black uppercase italic text-xs shadow-2xl active:scale-95 transition-all'>STOP VS CHECKOUT</button>
                                        </div>
                                    )}
                                </div>
                            )}
                            {!room.isBusy && !room.isSuspended && (<div className='px-4 pb-4 pt-2'><button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-4 bg-white/5 rounded-2xl text-white font-black uppercase text-xs border border-white/10'>START SESSION</button></div>)}
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
                        <div className='w-20 h-20 rounded-[2rem] bg-[#ffcf4b] flex items-center justify-center mb-12'><Lock size={32} className='text-black' /></div>
                        <h1 className='text-5xl font-black italic mb-12 uppercase italic'>PLS</h1>
                        <div className='w-full max-w-[300px] space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small h-16' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <button onClick={() => setView('clubDashboard')} className='btn-gold-minimal mt-8 py-5 !rounded-[1.5rem] text-lg font-black'>KIRISH</button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='px-6 py-5 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'><div className='w-12 h-12 rounded-2xl bg-[#ffcf4b] flex items-center justify-center'><Activity size={24} className='text-black' /></div><div><h2 className='text-lg font-black italic uppercase tracking-tighter'>{currentAdminData?.name}</h2><p className='text-[9px] font-black opacity-30 uppercase'>{currentAdminData?.club}</p></div></div>
                            <button onClick={() => setView('login')} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20'><X size={24} /></button>
                        </div>
                        <main>{activeTab === 'asosiy' ? renderClubAsosiy() : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-4 left-4 right-4 bg-black/80 backdrop-blur-3xl border border-white/10 p-4 rounded-3xl flex justify-around z-50 shadow-2xl'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'asosiy' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><BarChart3 size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>ASOSIY</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'xarita' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><Monitor size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>XARITA</span></button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {checkoutRoom && finalStats && (
                    <div className='modal-overlay'><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className='modal-content !p-8 border border-white/5'>
                        <h2 className='text-2xl font-black italic gold-text text-center mb-10 tracking-widest uppercase'>CHECKOUT</h2>
                        <div className='gold-glass p-8 text-center mb-10 bg-[#ffcf4b]/5 border-[#ffcf4b]/20'><p className='text-[10px] opacity-40 uppercase font-black tracking-[4px] mb-2'>JAMI TO'LOV</p><p className='text-5xl font-black italic tracking-tighter tabular-nums'>{finalStats.total.toLocaleString()} <span className='text-lg'>UZS</span></p></div>
                        <div className='space-y-4'>
                            <input type="number" placeholder="OLINGAN PUL" className='input-luxury-small h-20 text-3xl font-black text-center' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            {finalStats.total - (Number(paidAmount) || 0) > 0 && Number(paidAmount) > 0 && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className='space-y-4 p-6 bg-red-500/10 rounded-3xl border border-red-500/20'>
                                    <input type="text" placeholder="MIJOZ ISMI" className='input-luxury-small !bg-black/60 h-14' value={debtUser.name} onChange={(e) => setDebtUser({ ...debtUser, name: e.target.value })} />
                                    <input type="text" placeholder="TEL RAQAMI" className='input-luxury-small !bg-black/60 h-14' value={debtUser.phone} onChange={(e) => setDebtUser({ ...debtUser, phone: e.target.value })} />
                                </motion.div>
                            )}
                            <button onClick={confirmCheckout} className='btn-gold-minimal !py-6 !rounded-[2rem] text-xl font-black'>TASDIQLASH</button>
                            <button onClick={() => { setCheckoutRoom(null); setFinalStats(null); }} className='w-full py-4 text-[10px] opacity-20 font-black uppercase tracking-widest'>YOPISH</button>
                        </div>
                    </motion.div></div>
                )}
                {selectedRoomForBar && (
                    <div className='modal-overlay'><motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className='modal-content !max-w-md'>
                        <div className='flex justify-between items-center mb-10'><h2 className='text-2xl font-black italic gold-text tracking-tighter'>BARDAN TANLASH</h2><button onClick={() => setSelectedRoomForBar(null)} className='p-3 bg-white/5 rounded-full'><X size={24} /></button></div>
                        <div className='grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2'>
                            {inventory.map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-6 text-left border-white/5 hover:bg-white/5 active:scale-95 transition-all'>
                                    <p className='text-[10px] font-black uppercase mb-1 opacity-50'>{item.name}</p>
                                    <p className='text-xl font-black gold-text'>{item.price.toLocaleString()} <span className='text-xs'>UZS</span></p>
                                </button>
                            ))}
                        </div>
                    </motion.div></div>
                )}
                {showAddRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-2xl font-black italic gold-text mb-12 uppercase tracking-tighter text-center'>XONA_SOZLAMALARI</h2>
                        <div className='space-y-6'>
                            <div className='space-y-2'><p className='text-[10px] font-black opacity-30 uppercase ml-4'>XONA NOMI</p><input type="text" placeholder="PC-01" className='input-luxury-small h-16' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} /></div>
                            <div className='space-y-2'><p className='text-[10px] font-black opacity-30 uppercase ml-4'>SOATIGA NARX</p><input type="number" placeholder="25000" className='input-luxury-small h-16 text-2xl font-black' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: e.target.value }) : setNewRoom({ ...newRoom, price: e.target.value })} /></div>
                            <button onClick={() => {
                                if (editingRoom) setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
                                else setRooms(prev => [...prev, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, isSuspended: false, dailyRevenue: 0, barRevenue: 0 }]);
                                setShowAddRoom(false); setEditingRoom(null); setNewRoom({ name: '', price: '' });
                            }} className='btn-gold-minimal !py-6 !rounded-[2rem] text-lg font-black'>SAQLASH</button>
                            <button onClick={() => { setShowAddRoom(false); setEditingRoom(null); }} className='w-full py-4 text-[10px] opacity-20 font-black uppercase tracking-[5px]'>YOPISH</button>
                        </div>
                    </motion.div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
