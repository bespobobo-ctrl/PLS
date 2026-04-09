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
    const [expandedRooms, setExpandedRooms] = useState({});

    // Modals
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
        const items = room.items || [];
        const itemsPrice = items.reduce((acc, i) => acc + (Number(i.price) * (i.quantity || 1)), 0);
        return {
            time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
            total: Math.round(timePrice + itemsPrice),
            items
        };
    };

    const renderClubXarita = () => (
        <div className='p-4 space-y-8'>
            <button onClick={() => { setEditingRoom(null); setShowAddRoom(true); }} className='btn-gold-minimal py-6'><Plus size={18} /><span>YANGI XONA QO'SHISH</span></button>

            <div className='grid grid-cols-1 gap-6'>
                {activeRooms?.map(room => {
                    const session = calculateSession(room);
                    const isExp = expandedRooms[room.id];
                    return (
                        <div key={room.id} className={`gold-glass transition-all duration-500 overflow-hidden ${room.isBusy ? 'ring-2 ring-[#ffcf4b]/20 bg-black/60 shadow-2xl' : 'opacity-60 border-white/5'}`}>
                            {/* Header */}
                            <div className='p-6 flex justify-between items-center'>
                                <div className='flex items-center gap-4' onClick={() => room.isBusy && setExpandedRooms(p => ({ ...p, [room.id]: !isExp }))}>
                                    <div className={`w-4 h-4 rounded-full ${room.isBusy ? 'bg-[#ffcf4b] animate-pulse shadow-[0_0_15px_#ffcf4b]' : 'bg-white/10'}`}></div>
                                    <div><h3 className='text-3xl font-black italic uppercase italic tracking-tighter'>{room.name || 'XONA'}</h3><p className='text-[10px] opacity-40 font-black uppercase tracking-widest'>{room.isBusy ? 'Band (O\'yin ketyapti)' : 'Hozir bo\'sh'}</p></div>
                                </div>
                                <div className='flex gap-2'>
                                    {room.isBusy && (
                                        <button onClick={() => setExpandedRooms(p => ({ ...p, [room.id]: !isExp }))} className='p-3 bg-white/5 rounded-2xl text-[#ffcf4b] active:scale-90 transition-transform'>
                                            {isExp ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </button>
                                    )}
                                    <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='p-3 bg-white/5 rounded-2xl text-white/20 hover:text-white'><Edit3 size={18} /></button>
                                </div>
                            </div>

                            {/* Collapsed Brief Info */}
                            {room.isBusy && !isExp && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='px-6 pb-6 flex justify-between items-center border-t border-white/5 pt-4 bg-[#ffcf4b]/5'>
                                    <div className='flex items-center gap-2'><Clock size={16} className='text-[#ffcf4b]' /><span className='text-xl font-black italic tabular-nums'>{session.time}</span></div>
                                    <div className='text-xl font-black gold-text tabular-nums'>{session.total.toLocaleString()} UZS</div>
                                </motion.div>
                            )}

                            {/* Expanded High-End UI */}
                            {room.isBusy && isExp && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className='border-t border-white/5 bg-gradient-to-b from-[#ffcf4b]/5 to-transparent'>
                                    <div className='p-8 space-y-10'>
                                        {/* Timer & Sum - SEPARATED */}
                                        <div className='flex flex-col gap-6 items-center text-center'>
                                            <div className='space-y-1'>
                                                <p className='text-[10px] font-black opacity-30 uppercase tracking-[4px]'>O'YIN_VAQTI</p>
                                                <p className='text-6xl font-black italic gold-text tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,207,75,0.2)]'>{session.time}</p>
                                            </div>
                                            <div className='space-y-1 bg-white/5 w-full py-6 rounded-[2rem] border border-white/5'>
                                                <p className='text-[10px] font-black opacity-30 uppercase tracking-[4px]'>HISOBLANGAN_SUMMA</p>
                                                <p className='text-4xl font-black italic tabular-nums'>{session.total.toLocaleString()} <span className='text-sm opacity-40'>UZS</span></p>
                                            </div>
                                        </div>

                                        {/* Bar Section */}
                                        <div className='space-y-4'>
                                            <div className='flex justify-between items-center'><p className='text-[10px] font-black opacity-40 uppercase tracking-widest'>BAR_XIZMATI</p><button onClick={() => setSelectedRoomForBar(room)} className='btn-gold-minimal !py-2 !px-4 !rounded-full !text-[10px]'><Plus size={14} /> MAHSULOT</button></div>
                                            <div className='flex flex-wrap gap-2'>
                                                {session.items.length > 0 ? session.items.map((i, idx) => (
                                                    <div key={idx} className='bg-white/5 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-3'>
                                                        <span className='text-[10px] font-black uppercase text-white/80'>{i.name}</span>
                                                        <span className='w-5 h-5 rounded-full bg-[#ffcf4b] text-black text-[9px] font-black flex items-center justify-center'>{i.quantity}</span>
                                                    </div>
                                                )) : <p className='text-[9px] opacity-20 italic font-medium'>Hali mahsulot qo'shilmagan...</p>}
                                            </div>
                                        </div>

                                        {/* Stop Button */}
                                        <button onClick={() => setCheckoutRoom(room)} className='w-full py-6 bg-red-500 rounded-[2.5rem] text-white font-black uppercase italic tracking-widest shadow-[0_20px_40px_rgba(239,68,68,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg'>
                                            HISOBLASH VA STOP <Square size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Free State Action */}
                            {!room.isBusy && (
                                <div className='px-6 pb-6'>
                                    <button onClick={() => setRooms(p => p.map(r => r.id === room.id ? { ...r, isBusy: true, startTime: Date.now(), items: [] } : r))} className='w-full py-5 bg-white/5 rounded-3xl text-white font-black uppercase italic tracking-[2px] border border-white/5 hover:bg-[#ffcf4b] hover:text-black transition-all flex items-center justify-center gap-3'>
                                        VAQTNI BOSHLASH <Play size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg pb-32 font-sans'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <div className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div onPointerDown={() => { longPressTimer.current = setTimeout(() => setHiddenMode(true), 2000); }} onPointerUp={() => clearTimeout(longPressTimer.current)} className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl transition-all duration-700 ${hiddenMode ? 'bg-red-500 shadow-red-500/40 rotate-12' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20 hover:scale-110'}`}><Lock size={40} className={hiddenMode ? 'text-white' : 'text-black'} /></div>
                        <h1 className='text-5xl font-black italic tracking-tighter mb-2 uppercase italic'>PLS</h1>
                        <p className='text-[10px] font-black opacity-30 tracking-[6px] mb-12 uppercase'>PREMIUM_PANEL</p>
                        <div className='w-full max-w-sm space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small h-16' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small h-16' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={() => {
                                if (username === '4567' && password === '4567') { setView('glavniyDashboard'); return; }
                                setView('clubDashboard');
                            }} className='btn-gold-minimal mt-6 py-6 !rounded-[2rem] text-lg'>TIZIMGA KIRISH <ArrowRight size={20} /></button>
                        </div>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className='p-8 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-5'>
                                <div className='w-14 h-14 rounded-2xl bg-[#ffcf4b] flex items-center justify-center shadow-lg shadow-[#ffcf4b]/20'><Activity size={28} className='text-black' /></div>
                                <div><h2 className='text-2xl font-black italic tracking-tighter uppercase'>{currentAdminData?.name}</h2><p className='text-[9px] font-black opacity-40 uppercase tracking-[3px]'>{currentAdminData?.club}</p></div>
                            </div>
                            <button onClick={() => setView('login')} className='w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/30'><X size={24} /></button>
                        </div>
                        <main>{activeTab === 'asosiy' ? <div className='p-20 text-center opacity-10 italic font-black text-4xl uppercase select-none pointer-events-none'>ANALYTICS_V59</div> : renderClubXarita()}</main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Navigation */}
            {view !== 'login' && (
                <div className='fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-3xl border-t border-white/5 p-8 flex justify-around z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]'>
                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'asosiy' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><BarChart3 size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>ASOSIY</span></button>
                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-2 transition-all ${activeTab === 'xarita' ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}><Monitor size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>XARITA</span></button>
                    <button className='flex flex-col items-center gap-2 text-white/10'><Settings size={24} /><span className='text-[9px] font-black uppercase tracking-widest'>SOZLAMALAR</span></button>
                </div>
            )}

            {/* Modals - Polished */}
            <AnimatePresence>
                {selectedRoomForBar && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='modal-content !max-w-md'>
                        <div className='flex justify-between items-center mb-10'><h2 className='text-2xl font-black italic gold-text'>BARDAN_QO'SHISH</h2><button onClick={() => setSelectedRoomForBar(null)} className='p-3 bg-white/5 rounded-full'><X size={24} /></button></div>
                        <div className='grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2'>
                            {[{ id: 1, name: 'PEPSI 0.5', price: 7000 }, { id: 2, name: 'LAYS', price: 12000 }, { id: 3, name: 'HOT DOG', price: 15000 }, { id: 4, name: 'ENERGY', price: 18000 }].map(item => (
                                <button key={item.id} onClick={() => {
                                    setRooms(prev => prev.map(r => r.id === selectedRoomForBar.id ? { ...r, items: [...(r.items || []), { ...item, quantity: 1 }] } : r));
                                    setSelectedRoomForBar(null);
                                }} className='gold-glass p-6 text-left border-white/5 hover:bg-[#ffcf4b]/5 active:scale-95 transition-all'>
                                    <p className='text-[10px] font-black uppercase mb-1 opacity-50 tracking-wider'>{item.name}</p>
                                    <p className='text-lg font-black gold-text'>{item.price.toLocaleString()} <span className='text-[9px]'>UZS</span></p>
                                </button>
                            ))}
                        </div>
                    </motion.div></div>
                )}
                {checkoutRoom && (
                    <div className='modal-overlay'><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className='modal-content'>
                        <h2 className='text-3xl font-black italic gold-text text-center mb-12 tracking-tighter uppercase'>HISOBOTNI_YOPISH</h2>
                        <div className='gold-glass p-10 text-center mb-10 bg-[#ffcf4b]/5 border-[#ffcf4b]/20'>
                            <p className='text-[10px] opacity-40 uppercase font-black tracking-[4px] mb-2'>UMUMIY_SUMMA</p>
                            <p className='text-6xl font-black italic tracking-tighter tabular-nums'>{(calculateSession(checkoutRoom).total).toLocaleString()} <span className='text-lg opacity-40'>UZS</span></p>
                        </div>
                        <div className='space-y-4'>
                            <input type="number" placeholder="TO'LANGAN_SUMMA" className='input-luxury-small h-20 text-3xl font-black text-center' value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} />
                            <button onClick={() => {
                                const s = calculateSession(checkoutRoom);
                                const paid = Number(paidAmount);
                                if (s.total - paid > 0) setDebts(p => [...p, { id: Date.now(), name: 'MIJOZ', amount: s.total - paid, club: checkoutRoom.club }]);
                                setRooms(prev => prev.map(r => r.id === checkoutRoom.id ? { ...r, isBusy: false, startTime: null, items: [], dailyRevenue: (r.dailyRevenue || 0) + paid } : r));
                                setCheckoutRoom(null); setPaidAmount('');
                            }} className='btn-gold-minimal !py-8 !rounded-[2.5rem] !text-xl shadow-2xl'>TO'LOVNI_QABUL_QILISH</button>
                            <button onClick={() => setCheckoutRoom(null)} className='w-full py-4 text-[10px] opacity-20 font-black uppercase tracking-[3px]'>BEKOR_QILISH</button>
                        </div>
                    </motion.div></div>
                )}
                {showAddRoom && (
                    <div className='modal-overlay'><motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                        <h2 className='text-2xl font-black italic gold-text mb-10 uppercase tracking-tighter'>XONA_SOZLAMALARI</h2>
                        <div className='space-y-6'>
                            <div className='space-y-2'><p className='text-[10px] font-black opacity-30 uppercase ml-4'>XONA NOMI</p><input type="text" placeholder="Masalan: VIP_1" className='input-luxury-small h-16' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} /></div>
                            <div className='space-y-2'><p className='text-[10px] font-black opacity-30 uppercase ml-4'>SOATIGA NARX (UZS)</p><input type="number" placeholder="Masalan: 30000" className='input-luxury-small h-16' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: e.target.value }) : setNewRoom({ ...newRoom, price: e.target.value })} /></div>
                            <button onClick={() => {
                                if (editingRoom) setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
                                else setRooms(prev => [...prev, { ...newRoom, id: Date.now(), club: currentAdminData.club, isBusy: false, dailyRevenue: 0 }]);
                                setShowAddRoom(false); setEditingRoom(null);
                            }} className='btn-gold-minimal !py-6 !rounded-[2rem]'>XONANI SAQLASH</button>
                            <button onClick={() => setShowAddRoom(false)} className='w-full py-4 text-[10px] opacity-20 font-black uppercase tracking-widest transition-all hover:opacity-100'>YOPISH</button>
                        </div>
                    </motion.div></div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
