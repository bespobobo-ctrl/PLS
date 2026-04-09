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
    const [inventory, setInventory] = useState(getInitialState('inventory', [
        { id: 1, name: 'Pepsi 0.5', price: 7000 },
        { id: 2, name: 'Lays Chips', price: 12000 },
        { id: 3, name: 'Hot Dog', price: 15000 },
        { id: 4, name: 'Energy Drink', price: 18000 }
    ]));
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [superAdmins, setSuperAdmins] = useState(getInitialState('superAdmins', []));
    const [clubAdmins, setClubAdmins] = useState(getInitialState('clubAdmins', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [hiddenMode, setHiddenMode] = useState(false);
    const [now, setNow] = useState(Date.now());
    const [expandedRooms, setExpandedRooms] = useState({}); // Tracking which room cards are open

    // Modals & Forms
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [checkoutRoom, setCheckoutRoom] = useState(null);
    const [selectedRoomForBar, setSelectedRoomForBar] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '', club: '' });
    const [paidAmount, setPaidAmount] = useState('');
    const longPressTimer = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('rooms', JSON.stringify(rooms));
        localStorage.setItem('superAdmins', JSON.stringify(superAdmins));
        localStorage.setItem('clubAdmins', JSON.stringify(clubAdmins));
        localStorage.setItem('debts', JSON.stringify(debts));
        localStorage.setItem('view', JSON.stringify(view));
        localStorage.setItem('username', JSON.stringify(username));
    }, [inventory, rooms, superAdmins, clubAdmins, debts, view, username]);

    const currentAdminData = useMemo(() => {
        return clubAdmins?.find(a => a?.login === username) || superAdmins?.find(s => s?.login === username) || { name: 'ROOT', club: 'SYSTEM' };
    }, [clubAdmins, superAdmins, username]);

    const activeRooms = useMemo(() => (rooms || []).filter(r => r?.club === currentAdminData?.club), [rooms, currentAdminData]);

    const calculateSession = (room) => {
        if (!room?.startTime) return { time: '00:00:00', total: 0, itemsHtml: null, itemsPrice: 0 };
        const diff = Math.floor((now - room.startTime) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        const timePrice = (diff / 3600) * Number(room.price || 0);
        const items = room.items || [];
        const itemsPrice = items.reduce((acc, i) => acc + (Number(i.price) * (i.quantity || 1)), 0);
        return {
            time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice),
            itemsList: items,
            itemsPrice
        };
    };

    const toggleExpand = (id) => setExpandedRooms(prev => ({ ...prev, [id]: !prev[id] }));

    const renderClubXarita = () => (
        <div className='p-4 space-y-6'>
            <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'><Plus size={18} /><span>YANGI XONA QO'SHISH</span></button>
            <div className='grid grid-cols-1 gap-4'>
                {activeRooms?.map(room => {
                    const session = calculateSession(room);
                    const isExpanded = expandedRooms[room.id];
                    return (
                        <div key={room.id} className={`room-card-premium ${room.isBusy ? 'ring-1 ring-[#ffcf4b]/20' : room.isSuspended ? 'opacity-40' : ''}`}>
                            {/* Card Header */}
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-3' onClick={() => room.isBusy && toggleExpand(room.id)}>
                                    <div className={`w-3 h-3 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse shadow-[0_0_10px_#ffcf4b]' : room.isSuspended ? 'bg-red-500' : 'bg-white/10'}`}></div>
                                    <div><h3 className='text-2xl font-black italic uppercase'>{room.name || 'XONA'}</h3><p className='text-[9px] opacity-40 font-bold uppercase'>{room.isBusy ? 'BAND (OʻYINDA)' : room.isSuspended ? 'TOʻXTATILGAN' : 'BOʻSH'}</p></div>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    {room.isBusy && (
                                        <button onClick={() => toggleExpand(room.id)} className='p-2 bg-white/5 rounded-xl text-[#ffcf4b]'>
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                    )}
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-2 bg-white/5 rounded-xl text-white/20'><Edit3 size={16} /></button>
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {room.isBusy && (
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className='overflow-hidden'>
                                            <div className='mt-6 pt-6 border-t border-white/5 space-y-6'>
                                                <div className='flex justify-between items-end'>
                                                    <div><p className='text-[10px] opacity-30 font-black uppercase mb-1'>CLUB_TIMER</p><p className='text-4xl font-black italic gold-text tracking-tighter tabular-nums'>{session.time}</p></div>
                                                    <div className='text-right'><p className='text-[10px] opacity-30 font-black uppercase mb-1'>HISOBLANDI</p><p className='text-2xl font-black'>{session.total.toLocaleString()} UZS</p></div>
                                                </div>

                                                <div className='space-y-3'>
                                                    <div className='flex justify-between items-center'><p className='text-[10px] font-black opacity-30 uppercase'>XONA_BARI</p><button onClick={() => setSelectedRoomForBar(room)} className='flex items-center gap-1 text-[9px] font-black uppercase bg-[#ffcf4b] text-black px-3 py-1 rounded-full'>+ MAHSULOT</button></div>
                                                    <div className='flex flex-wrap gap-2'>{session.itemsList.map((item, idx) => (<div key={idx} className='text-[9px] font-black uppercase bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2'><span>{item.name}</span><span className='opacity-40'>x{item.quantity}</span></div>))}</div>
                                                </div>

                                                <button onClick={() => setCheckoutRoom(room)} className='w-full py-4 bg-red-500 rounded-2xl text-white font-black uppercase italic shadow-lg shadow-red-500/20 flex items-center justify-center gap-2'>HISOBLASH VA STOP <Square size={16} /></button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}

                            {/* Action when Closed & Free */}
                            {!room.isBusy && !room.isSuspended && (
                                <button onClick={() => setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='mt-6 w-full py-4 bg-[#ffcf4b] rounded-2xl text-black font-black uppercase italic shadow-lg shadow-[#ffcf4b]/20 flex items-center justify-center gap-2'>START <Play size={18} /></button>
                            )}

                            {/* Summary when Closed & Busy */}
                            {room.isBusy && !isExpanded && (
                                <div className='mt-4 flex justify-between items-center' onClick={() => toggleExpand(room.id)}>
                                    <div className='flex items-center gap-2'><Clock size={12} className='text-[#ffcf4b]' /><span className='text-xs font-black tabular-nums'>{session.time}</span></div>
                                    <div className='text-[10px] font-black gold-text'>{session.total.toLocaleString()} UZS</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const handleLogin = () => {
        const h = hiddenMode;
        if (h) {
            if (username === '4567' && password === '4567') { setView('glavniyDashboard'); return; }
        } else {
            if (clubAdmins?.find(a => a?.login === username && a?.password === password)) { setView('clubDashboard'); return; }
        }
    };

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg pb-32'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div onPointerDown={() => { longPressTimer.current = setTimeout(() => setHiddenMode(true), 2000); }} onPointerUp={() => clearTimeout(longPressTimer.current)} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl ${hiddenMode ? 'bg-red-500' : 'bg-[#ffcf4b]'}`}><Lock size={32} className={hiddenMode ? 'text-white' : 'text-black'} /></div>
                        <h1 className='text-4xl font-black italic mb-8 uppercase'>PLS</h1>
                        <div className='w-full max-w-sm space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={handleLogin} className='btn-gold-minimal mt-4'>KIRISH</button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${view.includes('glavniy') ? 'bg-red-500' : 'bg-[#ffcf4b]'}`}><Activity size={24} className='text-black' /></div>
                                <div><h2 className='text-lg font-black italic uppercase'>{currentAdminData?.name || 'ADMIN'}</h2><p className='text-[8px] font-bold opacity-40 uppercase'>{currentAdminData?.club || 'SYSTEM'}</p></div>
                            </div>
                            <button onClick={() => setView('login')} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20'><X size={20} /></button>
                        </div>
                        <main>{activeTab === 'asosiy' ? <div className='p-8 text-center opacity-30 uppercase font-black tracking-widest'>Statistika_Yaqinda...</div> : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 flex justify-around z-50'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Activity size={20} /><span className='text-[8px] font-black uppercase'>ASOSIY</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1 ${activeTab === 'xarita' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[8px] font-black uppercase'>XARITA</span></button>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {selectedRoomForBar && (
                    <div className='modal-overlay'><div className='modal-content'>
                        <div className='flex justify-between items-center mb-8'><h2 className='text-xl font-black italic gold-text'>BARDAN QO'SHISH</h2><button onClick={() => setSelectedRoomForBar(null)}><X size={24} /></button></div>
                        <div className='grid grid-cols-2 gap-4'>
                            {inventory.map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-5 text-left border-white/5 active:scale-95 transition-all'>
                                    <p className='text-[10px] font-black uppercase mb-1 opacity-70'>{item.name}</p>
                                    <p className='text-md font-black gold-text'>{item.price.toLocaleString()} UZS</p>
                                </button>
                            ))}
                        </div>
                    </div></div>
                )}
                {checkoutRoom && (
                    <div className='modal-overlay'><div className='modal-content'>
                        <h2 className='text-3xl font-black italic gold-text text-center mb-8'>HISOBLASH</h2>
                        <div className='gold-glass p-8 text-center mb-6'><p className='text-[10px] opacity-40 uppercase font-black'>JAMI TO'LOV</p><p className='text-4xl font-black'>{calculateSession(checkoutRoom).total.toLocaleString()} UZS</p></div>
                        <input type="number" placeholder="TO'LANGAN SUMMA" className='input-luxury-small' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                        <button onClick={() => {
                            const s = calculateSession(checkoutRoom);
                            const paid = Number(paidAmount);
                            if (s.total - paid > 0) setDebts(p => [...p, { id: Date.now(), name: 'MIJOZ', amount: s.total - paid, club: checkoutRoom.club }]);
                            setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? { ...r, isBusy: false, startTime: null, items: [], dailyRevenue: (r.dailyRevenue || 0) + paid } : r));
                            setCheckoutRoom(null); setPaidAmount('');
                        }} className='btn-gold-minimal mt-4'>HISOBOTNI YOPISH</button>
                        <button onClick={() => setCheckoutRoom(null)} className='w-full py-4 text-[10px] opacity-20 font-black uppercase mt-2'>BEKOR QILISH</button>
                    </div></div>
                )}
                {showAddRoom && (
                    <div className='modal-overlay'><div className='modal-content'>
                        <h2 className='text-xl font-black italic gold-text mb-8'>XONA SOZLAMALARI</h2>
                        <div className='space-y-4'>
                            <input type="text" placeholder="XONA NOMI" className='input-luxury-small' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} />
                            <input type="number" placeholder="SOATIGA NARX" className='input-luxury-small' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: e.target.value }) : setNewRoom({ ...newRoom, price: e.target.value })} />
                            <button onClick={() => {
                                if (editingRoom) setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
                                else setRooms(prev => [...prev, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, dailyRevenue: 0 }]);
                                setShowAddRoom(false); setEditingRoom(null);
                            }} className='btn-gold-minimal'>SAQLASH</button>
                            <button onClick={() => setShowAddRoom(false)} className='w-full py-4 text-[10px] opacity-20 font-black uppercase'>YOPISH</button>
                        </div>
                    </div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
