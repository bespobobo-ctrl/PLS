import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        // v48 - Improved Login Feedback
        const BOT_URL = 'https://pls-taupe.vercel.app/?v=v48';
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
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '', type: 'VIP' });
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Ichimliklar', image: '/images/pepsi.png' });
    const [loginError, setLoginError] = useState(false);

    const clubAdmins = [
        { login: 'admin1', password: '11', club: 'KOKAND_1' },
        { login: 'admin2', password: '22', club: 'KOKAND_2' },
        { login: '123', password: '123', club: 'TEST_CLUB' }
    ];

    // --- EFFECTS ---
    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        localStorage.setItem('rooms', JSON.stringify(rooms));
        localStorage.setItem('debts', JSON.stringify(debts));
        localStorage.setItem('username', JSON.stringify(username));
        localStorage.setItem('view', JSON.stringify(view));
    }, [inventory, rooms, debts, username, view]);

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
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
        }
    };

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div
                        key='login'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='flex flex-col items-center justify-center min-h-screen p-8'
                    >
                        <div className='w-20 h-20 bg-[#ffcf4b] rounded-[2rem] flex items-center justify-center mb-12 shadow-[0_20px_50px_rgba(255,207,75,0.2)]'>
                            <Lock size={32} className='text-black' />
                        </div>
                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>PLS_ADMIN</h1>
                        <p className='text-[10px] font-bold opacity-30 tracking-[4px] mb-12 uppercase'>Premium Management System</p>

                        {loginError && (
                            <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="text-red-500 text-[10px] font-black mb-4 uppercase tracking-widest">
                                XATO LOGIN YOKI PAROL!
                            </motion.div>
                        )}

                        <div className='w-full max-w-sm space-y-4'>
                            <input
                                type="text"
                                placeholder="LOGIN"
                                className='input-luxury-small'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="PASSWORD"
                                className='input-luxury-small'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                onClick={handleLogin}
                                className='btn-gold-minimal mt-4'
                            >
                                KIRISH
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key='admin'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='pb-24'
                    >
                        {/* Header */}
                        <div className='p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-[#ffcf4b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ffcf4b]/20'>
                                    <Activity size={24} className='text-black' />
                                </div>
                                <div>
                                    <h2 className='text-lg font-black italic tracking-tighter uppercase'>PLS CLUB</h2>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-1.5 h-1.5 rounded-full bg-[#ffcf4b] animate-pulse'></div>
                                        <p className='text-[8px] font-bold opacity-40 uppercase tracking-widest'>{clubAdmins.find(a => a.login === username)?.club}</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setView('login')} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors'>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Tabs */}
                        <main className='p-0'>
                            {clubAdminTab === 'asosiy' ? (
                                <div className='p-4 space-y-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='gold-glass p-6 text-center border-white/10'>
                                            <p className='text-[10px] uppercase opacity-40 mb-2 font-bold tracking-widest'>TUSHUM</p>
                                            <p className='text-2xl gold-text font-black'>
                                                {Number((rooms || []).filter(r => r && r.club === clubAdmins.find(ca => ca?.login === username)?.club).reduce((acc, r) => acc + (Number(r?.dailyRevenue) || 0), 0)).toLocaleString()}
                                            </p>
                                            <p className='text-[8px] opacity-30 mt-1 uppercase'>UZS</p>
                                        </div>
                                        <div className='gold-glass p-6 text-center border-white/10'>
                                            <p className='text-[10px] uppercase opacity-40 mb-2 font-bold tracking-widest'>KONSOL</p>
                                            <p className='text-3xl gold-text font-black'>
                                                {rooms.filter(r => r && r.club === clubAdmins.find(ca => ca?.login === username)?.club && r.isBusy).length}
                                            </p>
                                            <p className='text-[8px] opacity-30 mt-1 uppercase'>ONLINE</p>
                                        </div>
                                        <div className='gold-glass p-6 text-center border-white/10'>
                                            <p className='text-[10px] uppercase opacity-40 mb-2 font-bold tracking-widest'>FOYDA</p>
                                            <p className='text-2xl gold-text font-black'>+24%</p>
                                            <p className='text-[8px] opacity-20 uppercase mt-1'>HAFTALIK</p>
                                        </div>
                                        <div className='gold-glass p-6 text-center border-white/10'>
                                            <p className='text-[10px] uppercase opacity-40 mb-2 font-bold tracking-widest'>QARZ</p>
                                            <p className='text-xl font-black text-red-500'>
                                                {debts.filter(d => d && d.club === clubAdmins.find(ca => ca?.login === username)?.club).reduce((acc, d) => acc + (d?.amount || 0), 0).toLocaleString()}
                                            </p>
                                            <p className='text-[8px] opacity-30 mt-1 uppercase'>UZS</p>
                                        </div>
                                    </div>
                                    <div className='gold-glass p-6 border-white/5'>
                                        <p className='text-[10px] font-black tracking-[4px] uppercase opacity-30 mb-2'>STATUS</p>
                                        <p className='text-[10px] font-medium opacity-60 uppercase tracking-widest'>Tizim barqaror ishlamoqda</p>
                                    </div>
                                </div>
                            ) : clubAdminTab === 'xarita' ? (
                                <div className='p-4 space-y-6'>
                                    <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'>
                                        <Plus size={18} />
                                        <span>Xona Qo'shish</span>
                                    </button>
                                    <div className='space-y-4'>
                                        {rooms.filter(r => r.club === clubAdmins.find(ca => ca.login === username)?.club).map(room => (
                                            <div key={room.id} className='room-card-premium'>
                                                <div className='flex justify-between items-start mb-6'>
                                                    <div>
                                                        <h3 className='text-3xl font-black italic tracking-tighter uppercase mb-1'>{room.name}</h3>
                                                        <p className='text-[10px] font-bold opacity-30 tracking-widest'>{room.price} UZS / SOAT</p>
                                                    </div>
                                                    <div className='flex gap-2'>
                                                        <button onClick={() => { setEditingRoom(room); setShowAddRoom(true); }} className='w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors'><Settings size={16} /></button>
                                                        <button onClick={() => setRooms(prev => prev.filter(r => r.id !== room.id))} className='w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-red-500/20 hover:text-red-500 transition-colors'><Trash2 size={16} /></button>
                                                        <button onClick={() => setSelectedRoom(room)} className='w-10 h-10 rounded-2xl bg-[#ffcf4b] flex items-center justify-center text-black shadow-lg shadow-[#ffcf4b]/20'><ChevronRight size={18} /></button>
                                                    </div>
                                                </div>
                                                <div className='flex justify-between items-center pt-6 border-t border-white/5'>
                                                    <div className='flex gap-3'>
                                                        <div className={`status-indicator ${room.isBusy ? 'status-busy' : room.isBooked ? 'status-bron' : 'status-free'}`}>
                                                            {room.isBusy ? 'BAND' : room.isBooked ? 'REZERVA' : 'BO\'SH'}
                                                        </div>
                                                    </div>
                                                    <p className='text-xl gold-text'>{room.dailyRevenue.toLocaleString()} <span className='text-[8px] opacity-40 uppercase ml-1'>uzs</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : clubAdminTab === 'bar' ? (
                                <div className='p-4 space-y-6'>
                                    {/* Bar UI Placeholder */}
                                    <div className='gold-glass p-8 text-center'>
                                        <ShoppingCart size={48} className='mx-auto mb-4 opacity-10' />
                                        <p className='text-[10px] font-black tracking-widest uppercase opacity-30'>Bar Bo'limi Tayyorlanmoqda</p>
                                    </div>
                                </div>
                            ) : null}
                        </main>

                        {/* Bottom Navigation */}
                        <div className='fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-3xl border-t border-white/5 p-4 flex justify-around items-center z-50'>
                            {[
                                { id: 'asosiy', icon: Activity, label: 'ASOSIY' },
                                { id: 'xarita', icon: Monitor, label: 'XARITA' },
                                { id: 'bar', icon: ShoppingCart, label: 'BAR' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setClubAdminTab(tab.id)}
                                    className={`flex flex-col items-center gap-1 transition-all ${clubAdminTab === tab.id ? 'text-[#ffcf4b] scale-110' : 'text-white/20'}`}
                                >
                                    <tab.icon size={20} />
                                    <span className='text-[8px] font-black tracking-widest'>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
                {showAddRoom && (
                    <div className='modal-overlay'>
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className='modal-content'>
                            <h2 className='text-xl font-black italic tracking-tighter mb-8 uppercase'>{editingRoom ? 'Xonani Tahrirlash' : 'Yangi Xona'}</h2>
                            <div className='space-y-4'>
                                <input type="text" placeholder="XONA NOMI" className='input-luxury-small' value={editingRoom ? editingRoom.name : newRoom.name} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, name: e.target.value }) : setNewRoom({ ...newRoom, name: e.target.value })} />
                                <input type="number" placeholder="NARXI (SOAT)" className='input-luxury-small' value={editingRoom ? editingRoom.price : newRoom.price} onChange={(e) => editingRoom ? setEditingRoom({ ...editingRoom, price: e.target.value }) : setNewRoom({ ...newRoom, price: e.target.value })} />
                                <button
                                    onClick={() => {
                                        if (editingRoom) {
                                            setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
                                        } else {
                                            setRooms(prev => [...prev, { ...newRoom, id: Date.now(), isBusy: false, dailyRevenue: 0, club: clubAdmins.find(a => a.login === username)?.club }]);
                                        }
                                        setShowAddRoom(false);
                                        setEditingRoom(null);
                                        setNewRoom({ name: '', price: '', type: 'VIP' });
                                    }}
                                    className='btn-gold-minimal mt-4'
                                >
                                    SAQLASH
                                </button>
                                <button onClick={() => { setShowAddRoom(false); setEditingRoom(null); }} className='w-full py-4 text-[10px] font-black opacity-30 uppercase tracking-widest'>BEKOR QILISH</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
