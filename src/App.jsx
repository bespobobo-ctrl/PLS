import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const BOT_URL = 'https://pls-taupe.vercel.app/?v=v49';
        const API_URL = 'http://161.35.196.164:3001/api';
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const App = () => {
    // --- STATE MANAGEMENT ---
    const [view, setView] = useState(getInitialState('view', 'login'));
    const [username, setUsername] = useState(getInitialState('username', ''));
    const [password, setPassword] = useState('');
    const [clubAdminTab, setClubAdminTab] = useState('asosiy');
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [history, setHistory] = useState(getInitialState('history', []));
    const [loginError, setLoginError] = useState(false);
    const [hiddenMode, setHiddenMode] = useState(false);

    // Modals
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);

    // Forms
    const [newRoom, setNewRoom] = useState({ name: '', price: '', type: 'VIP' });
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Ichimliklar', image: '/images/pepsi.png' });

    const clubAdmins = [
        { login: 'admin1', password: '11', club: 'KOKAND_1' },
        { login: 'admin2', password: '22', club: 'KOKAND_2' },
        { login: '4567', password: '4567', club: 'SUPER_ADMIN' },
        { login: '0008', password: '0008', club: 'GLAVNIY_ADMIN' },
        { login: '123', password: '123', club: 'TEST_CLUB' }
    ];

    // --- LONG PRESS LOGIC ---
    const longPressTimer = useRef(null);
    const handleLongPressStart = () => {
        longPressTimer.current = setTimeout(() => {
            setHiddenMode(true);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
            }
        }, 2000);
    };
    const handleLongPressEnd = () => {
        clearTimeout(longPressTimer.current);
    };

    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('rooms', JSON.stringify(rooms));
        localStorage.setItem('debts', JSON.stringify(debts));
        localStorage.setItem('history', JSON.stringify(history));
        localStorage.setItem('username', JSON.stringify(username));
        localStorage.setItem('view', JSON.stringify(view));
    }, [inventory, rooms, debts, history, username, view]);

    const handleLogin = () => {
        const admin = clubAdmins.find(a => a.login === username && a.password === password);
        if (admin) {
            setView('clubAdmin');
            setLoginError(false);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
        } else {
            setLoginError(true);
        }
    };

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div
                            onPointerDown={handleLongPressStart}
                            onPointerUp={handleLongPressEnd}
                            onPointerLeave={handleLongPressEnd}
                            className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl transition-all duration-500 ${hiddenMode ? 'bg-red-500 shadow-red-500/50' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20'}`}
                        >
                            {hiddenMode ? <Unlock size={32} className='text-white' /> : <Lock size={32} className='text-black' />}
                        </div>

                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>
                            {hiddenMode ? 'HIDDEN_PANEL' : 'PLS_ADMIN'}
                        </h1>
                        <p className='text-[10px] font-bold opacity-30 tracking-[4px] mb-12 uppercase'>
                            {hiddenMode ? 'Access Restricted' : 'Premium Management System'}
                        </p>

                        {loginError && <p className='text-red-500 text-[10px] font-black mb-4 uppercase'>XATO LOGIN YOKI PAROL!</p>}

                        <div className='w-full max-w-sm space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={handleLogin} className='btn-gold-minimal mt-4'>KIRISH <ArrowRight size={18} /></button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key='admin' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='pb-32'>
                        {/* Header */}
                        <div className='p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-[#ffcf4b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ffcf4b]/20'>
                                    <Activity size={24} className='text-black' />
                                </div>
                                <div>
                                    <h2 className='text-lg font-black italic tracking-tighter uppercase'>PLS CLUB</h2>
                                    <p className='text-[8px] font-bold opacity-40 uppercase tracking-widest'>{clubAdmins.find(a => a.login === username)?.club}</p>
                                </div>
                            </div>
                            <button onClick={() => setView('login')} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40'><X size={20} /></button>
                        </div>

                        {/* Tabs Content */}
                        <main>
                            {clubAdminTab === 'asosiy' ? (
                                <div className='p-4 space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='gold-glass p-6 text-center'><p className='text-[10px] opacity-40 mb-2 font-bold uppercase'>TUSHUM</p><p className='text-2xl gold-text font-black'>{Number(rooms.reduce((acc, r) => acc + (r.dailyRevenue || 0), 0)).toLocaleString()}</p></div>
                                        <div className='gold-glass p-6 text-center'><p className='text-[10px] opacity-40 mb-2 font-bold uppercase'>ONLINE</p><p className='text-3xl gold-text font-black'>{rooms.filter(r => r.isBusy).length}</p></div>
                                    </div>
                                    <div className='gold-glass p-6 border-white/5 flex items-center gap-4'>
                                        <TrendingUp className='text-[#ffcf4b] opacity-40' size={24} />
                                        <div>
                                            <p className='text-[10px] font-black opacity-30 uppercase'>TIZIM_HOLATI</p>
                                            <p className='text-[10px] font-medium opacity-60 uppercase'>Super Admin tomonidan boshqarilmoqda</p>
                                        </div>
                                    </div>
                                </div>
                            ) : clubAdminTab === 'xarita' ? (
                                <div className='p-4 space-y-6'>
                                    <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'><Plus size={18} /><span>Xona Qo'shish</span></button>
                                    <div className='space-y-4'>
                                        {rooms.filter(r => r.club === clubAdmins.find(ca => ca.login === username)?.club).map(room => (
                                            <div key={room.id} className='room-card-premium'>
                                                <div className='flex justify-between items-start mb-6'>
                                                    <div><h3 className='text-3xl font-black italic tracking-tighter uppercase mb-1'>{room.name}</h3><p className='text-[10px] font-bold opacity-30 tracking-widest'>{room.price} UZS / SOAT</p></div>
                                                    <div className='flex gap-2'>
                                                        <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center'><Settings size={14} /></button>
                                                        <button onClick={() => setRooms(prev => prev.filter(r => r.id !== room.id))} className='w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-red-500'><Trash2 size={14} /></button>
                                                        <button className='w-8 h-8 rounded-xl bg-[#ffcf4b] flex items-center justify-center text-black'><ChevronRight size={16} /></button>
                                                    </div>
                                                </div>
                                                <div className='flex justify-between items-center pt-6 border-t border-white/5'>
                                                    <div className={`status-indicator ${room.isBusy ? 'status-busy' : 'status-free'}`}>{room.isBusy ? 'BAND' : 'BO\'SH'}</div>
                                                    <p className='text-xl gold-text'>{(room.dailyRevenue || 0).toLocaleString()} <span className='text-[8px] opacity-40 uppercase'>uzs</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : clubAdminTab === 'bar' ? (
                                <div className='p-4 space-y-6'>
                                    <button onClick={() => setShowAddProduct(true)} className='btn-gold-minimal'><Plus size={18} /><span>MAHSULOT QO'SHISH</span></button>
                                    <div className='grid grid-cols-2 gap-4'>
                                        {inventory.map(item => (
                                            <div key={item.id} className='gold-glass p-4 border-white/5'>
                                                <div className='aspect-square bg-white/5 rounded-2xl mb-4 flex items-center justify-center'><Package size={32} className='opacity-20' /></div>
                                                <h3 className='text-xs font-black uppercase mb-1'>{item.name}</h3>
                                                <p className='text-[10px] gold-text font-black mb-4'>{item.price.toLocaleString()} UZS</p>
                                                <div className='flex justify-between items-center'>
                                                    <p className='text-[8px] font-bold opacity-30 uppercase'>STOCK: {item.stock}</p>
                                                    <button className='w-8 h-8 rounded-lg bg-[#ffcf4b] text-black flex items-center justify-center'><Plus size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </main>

                        {/* Navigation */}
                        <div className='fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 flex justify-around z-50'>
                            {[
                                { id: 'asosiy', icon: Activity, label: 'ASOSIY' },
                                { id: 'xarita', icon: Monitor, label: 'XARITA' },
                                { id: 'bar', icon: ShoppingCart, label: 'BAR' },
                                { id: 'ombor', icon: Database, label: 'OMBOR' }
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setClubAdminTab(tab.id)} className={`flex flex-col items-center gap-1 ${clubAdminTab === tab.id ? 'text-[#ffcf4b]' : 'text-white/20'}`}>
                                    <tab.icon size={20} />
                                    <span className='text-[8px] font-black tracking-widest'>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Room Modal */}
            <AnimatePresence>
                {showAddRoom && (
                    <div className='modal-overlay'>
                        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                            <h2 className='text-xl font-black italic uppercase mb-8'>{editingRoom ? 'TAHRIRLASH' : 'YANGI XONA'}</h2>
                            <div className='space-y-4'>
                                <input type="text" placeholder="NOMI" className='input-luxury-small' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} />
                                <input type="number" placeholder="NARXI" className='input-luxury-small' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: e.target.value }) : setNewRoom({ ...newRoom, price: e.target.value })} />
                                <button onClick={() => {
                                    if (editingRoom) setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
                                    else setRooms(prev => [...prev, { ...newRoom, id: Date.now(), isBusy: false, dailyRevenue: 0, club: 'KOKAND_1' }]);
                                    setShowAddRoom(false);
                                    setEditingRoom(null);
                                }} className='btn-gold-minimal'>SAQLASH</button>
                                <button onClick={() => setShowAddRoom(false)} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                            </div>
                        </motion.div>
                    </div>
                )}
                {showAddProduct && (
                    <div className='modal-overlay'>
                        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                            <h2 className='text-xl font-black italic uppercase mb-8'>YANGI MAHSULOT</h2>
                            <div className='space-y-4'>
                                <input type="text" placeholder="NOMI" className='input-luxury-small' value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                                <input type="number" placeholder="NARXI" className='input-luxury-small' value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                                <input type="number" placeholder="SONI" className='input-luxury-small' value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                <button onClick={() => {
                                    setInventory(prev => [...prev, { ...newProduct, id: Date.now() }]);
                                    setShowAddProduct(false);
                                    setNewProduct({ name: '', price: '', stock: '', category: 'Ichimliklar', image: '/images/pepsi.png' });
                                }} className='btn-gold-minimal'>QO'SHISH</button>
                                <button onClick={() => setShowAddProduct(false)} className='w-full py-4 text-[10px] opacity-30 font-black uppercase'>BEKOR QILISH</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
