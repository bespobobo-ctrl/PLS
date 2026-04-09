import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase, Phone, UserPlus, Key, Edit3, Calendar, Play, Square, UserMinus,
    PauseCircle, Coffee, CheckCircle2, ChevronDown, ChevronUp
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
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('asosiy');
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [clubAdmins, setClubAdmins] = useState(getInitialState('clubAdmins', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [hiddenMode, setHiddenMode] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [expRooms, setExpRooms] = useState({});

    // Forms
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [checkoutRoom, setCheckoutRoom] = useState(null);
    const [selectedRoomForBar, setSelectedRoomForBar] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '' });
    const [paidAmount, setPaidAmount] = useState('');
    const longPressTimer = useRef(null);

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

    const calculateSession = (room) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, items: [] };
        const diff = Math.floor((now - room.startTime) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        const timePrice = (diff / 3600) * Number(room.price || 0);
        const itemsPrice = (room.items || []).reduce((acc, i) => acc + (Number(i.price) * (i.quantity || 1)), 0);
        return {
            time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice),
            items: room.items || []
        };
    };

    const renderClubXarita = () => (
        <div className='p-3 space-y-4'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='btn-gold-minimal !py-4'><Plus size={16} /><span>YANGI XONA</span></button>
            <div className='grid grid-cols-1 gap-4'>
                {activeRooms?.map(room => {
                    const session = calculateSession(room);
                    const isExp = expRooms[room.id];
                    return (
                        <div key={room.id} className={`gold-glass overflow-hidden ${room.isBusy ? 'border-[#ffcf4b]/20 bg-black/40' : 'opacity-60'}`}>
                            {/* Header */}
                            <div className='p-4 flex justify-between items-center' onClick={() => room.isBusy && setExpRooms(p => ({ ...p, [room.id]: !isExp }))}>
                                <div className='flex items-center gap-3'>
                                    <div className={`w-2.5 h-2.5 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse shadow-[0_0_8px_#ffcf4b]' : 'bg-white/10'}`}></div>
                                    <div><h3 className='text-xl font-black italic uppercase tracking-tight'>{room.name || 'XONA'}</h3><p className='text-[8px] opacity-40 font-black uppercase'>{room.isBusy ? 'O\'yin ketyapti' : 'Bo\'sh'}</p></div>
                                </div>
                                <div className='flex gap-2' onClick={(e) => e.stopPropagation()}>
                                    {room.isBusy && <button onClick={() => setExpRooms(p => ({ ...p, [room.id]: !isExp }))} className='p-2 bg-white/5 rounded-xl text-[#ffcf4b]'>{isExp ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>}
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2 bg-white/5 rounded-xl text-white/20'><Edit3 size={14} /></button>
                                </div>
                            </div>

                            {/* Info Bar when Collapsed or Busy */}
                            {room.isBusy && (
                                <AnimatePresence>
                                    <motion.div initial={false} className={`border-t border-white/5 bg-[#ffcf4b]/5 p-4 ${isExp ? 'space-y-4' : 'flex justify-between items-center'}`}>
                                        <div className='flex flex-col'>
                                            <p className='text-[8px] font-black opacity-30 uppercase'>VAQT</p>
                                            <p className={`${isExp ? 'text-4xl' : 'text-xl'} font-black tabular-nums gold-text italic`}>{session.time}</p>
                                        </div>
                                        <div className={`flex flex-col ${isExp ? '' : 'text-right'}`}>
                                            <p className='text-[8px] font-black opacity-30 uppercase'>HISOB</p>
                                            <p className={`${isExp ? 'text-2xl' : 'text-lg'} font-black tabular-nums`}>{session.total.toLocaleString()} <span className='text-[8px] opacity-40'>UZS</span></p>
                                        </div>

                                        {isExp && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='pt-4 space-y-4 border-t border-white/5'>
                                                <div className='flex justify-between items-center'><p className='text-[8px] font-black opacity-40 uppercase'>BAR_XIZMATI</p><button onClick={() => setSelectedRoomForBar(room)} className='text-[8px] font-black uppercase bg-[#ffcf4b] text-black px-3 py-1 rounded-full'>+ MAHSULOT</button></div>
                                                <div className='flex flex-wrap gap-1'>{session.items.map((i, idx) => (<div key={idx} className='text-[8px] font-black uppercase bg-white/5 px-2 py-1 rounded-lg border border-white/5'>{i.name} x{i.quantity}</div>))}</div>
                                                <button onClick={() => setCheckoutRoom(room)} className='w-full py-4 bg-red-500 rounded-2xl text-white font-black uppercase italic text-xs shadow-lg shadow-red-500/20'>HISOBLASH VA STOP</button>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            )}

                            {/* Free Action */}
                            {!room.isBusy && (
                                <div className='px-4 pb-4'>
                                    <button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-3 bg-white/5 rounded-2xl text-white font-black uppercase text-xs border border-white/5'>START <Play size={12} className='inline ml-1' /></button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg pb-28'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div onPointerDown={() => { longPressTimer.current = setTimeout(() => setHiddenMode(true), 2000); }} onPointerUp={() => clearTimeout(longPressTimer.current)} className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 ${hiddenMode ? 'bg-red-500 shadow-red-500/30' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/10'}`}><Lock size={28} className='text-black' /></div>
                        <h1 className='text-3xl font-black italic mb-10'>PLS</h1>
                        <div className='w-full max-w-sm space-y-3'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small h-14' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small h-14' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={() => { if (username === '4567') setView('glavniyDashboard'); else setView('clubDashboard'); }} className='btn-gold-minimal mt-4 py-4 !rounded-xl'>KIRISH</button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='p-5 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-xl bg-[#ffcf4b] flex items-center justify-center'><Activity size={20} className='text-black' /></div>
                                <div><h2 className='text-md font-black italic uppercase'>{currentAdminData?.name}</h2><p className='text-[8px] font-black opacity-40 uppercase'>{currentAdminData?.club}</p></div>
                            </div>
                            <button onClick={() => setView('login')} className='p-2 bg-white/5 rounded-xl text-white/20'><X size={18} /></button>
                        </div>
                        <main>{activeTab === 'asosiy' ? <div className='p-12 text-center opacity-10 font-black text-xl italic uppercase'>DASHBOARD</div> : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-white/5 p-4 flex justify-around z-50'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><BarChart3 size={20} /><span className='text-[8px] font-black uppercase'>ASOSIY</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1 ${activeTab === 'xarita' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[8px] font-black uppercase'>XARITA</span></button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {selectedRoomForBar && (
                    <div className='modal-overlay'><div className='modal-content !p-6'>
                        <div className='flex justify-between items-center mb-6'><h2 className='text-lg font-black italic gold-text'>BAR</h2><button onClick={() => setSelectedRoomForBar(null)}><X size={20} /></button></div>
                        <div className='grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto'>
                            {[{ id: 1, name: 'PEPSI', price: 7000 }, { id: 2, name: 'LAYS', price: 12000 }, { id: 3, name: 'HOTDOG', price: 15000 }].map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-4 text-left text-[10px] uppercase font-black'>
                                    {item.name}<br /><span className='gold-text'>{item.price.toLocaleString()}</span>
                                </button>
                            ))}
                        </div>
                    </div></div>
                )}
                {checkoutRoom && (
                    <div className='modal-overlay'><div className='modal-content !p-6'>
                        <h2 className='text-xl font-black italic gold-text text-center mb-6'>HISOBLASH</h2>
                        <div className='gold-glass p-6 text-center mb-6'><p className='text-[8px] opacity-40 uppercase'>JAMI</p><p className='text-3xl font-black'>{calculateSession(checkoutRoom).total.toLocaleString()} UZS</p></div>
                        <input type="number" placeholder="TO'LOV" className='input-luxury-small h-14 mb-4 text-center' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                        <button onClick={() => {
                            const s = calculateSession(checkoutRoom); const paid = Number(paidAmount);
                            if (s.total - paid > 0) setDebts(p => [...p, { id: Date.now(), name: 'MIJOZ', amount: s.total - paid, club: checkoutRoom.club }]);
                            setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? { ...r, isBusy: false, startTime: null, items: [], dailyRevenue: (r.dailyRevenue || 0) + paid } : r));
                            setCheckoutRoom(null); setPaidAmount('');
                        }} className='btn-gold-minimal !py-4'>TASDIQLASH</button>
                    </div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
