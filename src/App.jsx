import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Plus, Search, Settings, Trash2, X, ChevronRight,
    Monitor, ArrowRight, Lock, Unlock, Clock, CreditCard, Users,
    BarChart3, ShoppingCart, Database, Zap, PieChart, AlertTriangle,
    Package, TrendingUp, History, UserCheck, ShieldCheck, Briefcase
} from 'lucide-react';

const getInitialState = (key, defaultValue) => {
    try {
        const BOT_URL = 'https://pls-taupe.vercel.app/?v=v50';
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
    const [activeTab, setActiveTab] = useState('asosiy');
    const [inventory, setInventory] = useState(getInitialState('inventory', []));
    const [rooms, setRooms] = useState(getInitialState('rooms', []));
    const [debts, setDebts] = useState(getInitialState('debts', []));
    const [loginError, setLoginError] = useState(false);
    const [hiddenMode, setHiddenMode] = useState(false);

    // Rollar turlari
    const clubAdmins = [
        { login: 'admin1', password: '11', club: 'KOKAND_1', role: 'admin' },
        { login: 'admin2', password: '22', club: 'KOKAND_2', role: 'admin' },
        { login: '4567', password: '4567', club: 'GLOBAL', role: 'super' },
        { login: '0008', password: '0008', club: 'GLOBAL', role: 'glavniy' }
    ];

    const currentAdmin = clubAdmins.find(a => a.login === username);

    // Modallar
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '', type: 'VIP' });
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Ichimliklar' });

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
    const handleLongPressEnd = () => clearTimeout(longPressTimer.current);

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
            setView('dashboard');
            setLoginError(false);
        } else {
            setLoginError(true);
        }
    };

    // --- RENDER HELPERS ---
    const renderClubAdmin = () => (
        <div className='p-4 space-y-4'>
            {activeTab === 'asosiy' && (
                <div className='grid grid-cols-2 gap-4'>
                    <div className='gold-glass p-6 text-center'><p className='text-[10px] opacity-40 mb-1 font-bold'>BUGUNGI TUSHUM</p><p className='text-2xl gold-text font-black'>{rooms.filter(r => r.club === currentAdmin?.club).reduce((acc, r) => acc + (r.dailyRevenue || 0), 0).toLocaleString()}</p></div>
                    <div className='gold-glass p-6 text-center'><p className='text-[10px] opacity-40 mb-1 font-bold'>ONLINE KONSOL</p><p className='text-3xl gold-text font-black'>{rooms.filter(r => r.club === currentAdmin?.club && r.isBusy).length}</p></div>
                </div>
            )}
            {activeTab === 'xarita' && (
                <div className='space-y-4'>
                    <button onClick={() => setShowAddRoom(true)} className='btn-gold-minimal'><Plus size={18} /><span>Xona Qo'shish</span></button>
                    {rooms.filter(r => r.club === currentAdmin?.club).map(room => (
                        <div key={room.id} className='room-card-premium'>
                            <div className='flex justify-between items-center'><h3 className='text-2xl font-black italic'>{room.name}</h3><div className='flex gap-2'><button className='p-2 bg-white/5 rounded-xl'><Settings size={14} /></button><button className='p-2 bg-[#ffcf4b] text-black rounded-xl'><ChevronRight size={14} /></button></div></div>
                            <div className='mt-4 pt-4 border-t border-white/5 flex justify-between items-center'><span className={`status-indicator ${room.isBusy ? 'status-busy' : 'status-free'}`}>{room.isBusy ? 'BAND' : 'BO\'SH'}</span><p className='gold-text font-bold'>{room.price} UZS</p></div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'bar' && (
                <div className='space-y-4'>
                    <div className='gold-glass p-8 text-center'><ShoppingCart size={40} className='mx-auto mb-4 opacity-20' /><p className='text-[10px] uppercase font-black opacity-30'>Bar sotuvi faol</p></div>
                </div>
            )}
        </div>
    );

    const renderSuperAdmin = () => (
        <div className='p-4 space-y-4'>
            <div className='flex items-center gap-4 bg-red-500/10 p-4 rounded-3xl border border-red-500/20 mb-6'>
                <ShieldCheck className='text-red-500' size={24} />
                <div><p className='text-[10px] font-black uppercase text-red-500'>SUPER_ADMIN_MODE</p><p className='text-[10px] opacity-50 uppercase'>Tizimni to'liq boshqarish huquqi</p></div>
            </div>
            {activeTab === 'statika' && (
                <div className='grid grid-cols-1 gap-4'>
                    <div className='gold-glass p-6'><p className='text-[10px] opacity-40 mb-2 font-black uppercase'>GLOBAL_TUSHUM</p><p className='text-5xl gold-text font-black tracking-tighter'>{rooms.reduce((acc, r) => acc + (r.dailyRevenue || 0), 0).toLocaleString()} <span className='text-xs opacity-30 italic'>UZS</span></p></div>
                </div>
            )}
            {activeTab === 'ombor' && (
                <div className='space-y-4'>
                    <button onClick={() => setShowAddProduct(true)} className='btn-gold-minimal'><Plus size={18} /><span>GLOBAL OMBOBGA QO'SHISH</span></button>
                    <div className='grid grid-cols-2 gap-4'>
                        {inventory.map(item => (
                            <div key={item.id} className='gold-glass p-4'><p className='text-[10px] font-black uppercase mb-2'>{item.name}</p><p className='text-xs gold-text font-bold'>{item.price.toLocaleString()} UZS</p><p className='text-[8px] opacity-30 uppercase mt-4'>OMBORDA: {item.stock} TA</p></div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderGlavniyAdmin = () => (
        <div className='p-4 space-y-4'>
            <div className='flex items-center gap-4 bg-[#ffcf4b]/10 p-4 rounded-3xl border border-[#ffcf4b]/20 mb-6'>
                <Briefcase className='text-[#ffcf4b]' size={24} />
                <div><p className='text-[10px] font-black uppercase gold-text'>GLAVNIY_ADMIN</p><p className='text-[10px] opacity-50 uppercase'>Klublararo hisobotlar va nazorat</p></div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div className='gold-glass p-6 text-center border-white/10'><p className='text-[8px] opacity-40 mb-2 font-bold uppercase'>Klublar Soni</p><p className='text-3xl gold-text font-black'>2</p></div>
                <div className='gold-glass p-6 text-center border-white/10'><p className='text-[8px] opacity-40 mb-2 font-bold uppercase'>Xodimlar Online</p><p className='text-3xl gold-text font-black'>4</p></div>
            </div>
            <div className='gold-glass p-6 border-white/5 space-y-4 font-black uppercase text-[10px]'>
                <p className='opacity-30 tracking-widest mb-4'>SO'NGGI_HISOBOTLAR</p>
                <div className='flex justify-between items-center border-b border-white/5 pb-2'><p>KOKAND_1 TUSHUM</p><p className='gold-text'>7,240,000</p></div>
                <div className='flex justify-between items-center border-b border-white/5 pb-2'><p>KOKAND_2 TUSHUM</p><p className='gold-text'>5,100,000</p></div>
            </div>
        </div>
    );

    return (
        <div className='min-h-screen bg-[#050505] text-white animated-bg'>
            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div key='login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex flex-col items-center justify-center min-h-screen p-8'>
                        <div onPointerDown={handleLongPressStart} onPointerUp={handleLongPressEnd} className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 shadow-2xl transition-all duration-700 ${hiddenMode ? 'bg-red-500 shadow-red-500/50 scale-110' : 'bg-[#ffcf4b] shadow-[#ffcf4b]/20'}`}>
                            {hiddenMode ? <Unlock size={32} /> : <Lock size={32} className='text-black' />}
                        </div>
                        <h1 className='text-4xl font-black italic tracking-tighter mb-2 uppercase'>{hiddenMode ? 'RESTRICTED' : 'PLS_ADMIN'}</h1>
                        <p className='text-[10px] font-bold opacity-30 tracking-[4px] mb-12 uppercase'>{hiddenMode ? 'Root Access Enabled' : 'Premium Management System'}</p>
                        {loginError && <p className='text-red-500 text-[10px] font-black mb-4 uppercase'>XATO LOGIN YOKI PAROL!</p>}
                        <div className='w-full max-w-sm space-y-4'>
                            <input type="text" placeholder="LOGIN" className='input-luxury-small' value={username} onChange={(e) => setUsername(e.target.value)} />
                            <input type="password" placeholder="PASSWORD" className='input-luxury-small' value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button onClick={handleLogin} className='btn-gold-minimal mt-4'>KIRISH <ArrowRight size={18} /></button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key='dash' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='pb-32'>
                        {/* Header */}
                        <div className='p-6 flex justify-between items-center bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 bg-[#ffcf4b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#ffcf4b]/20'><Activity size={24} className='text-black' /></div>
                                <div><h2 className='text-lg font-black italic tracking-tighter uppercase'>PLS {currentAdmin?.role === 'super' ? 'SYSTEM' : 'CLUB'}</h2><p className='text-[8px] font-bold opacity-40 uppercase tracking-widest'>{currentAdmin?.club}</p></div>
                            </div>
                            <button onClick={() => setView('login')} className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center'><X size={20} /></button>
                        </div>

                        {/* Content By Role */}
                        <main>
                            {currentAdmin?.role === 'super' ? renderSuperAdmin() : currentAdmin?.role === 'glavniy' ? renderGlavniyAdmin() : renderClubAdmin()}
                        </main>

                        {/* Navigation By Role */}
                        <div className='fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-3xl border-t border-white/5 p-6 flex justify-around z-50'>
                            {currentAdmin?.role === 'super' ? (
                                <>
                                    <button onClick={() => setActiveTab('statika')} className={`flex flex-col items-center gap-1 ${activeTab === 'statika' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><BarChart3 size={20} /><span className='text-[8px] font-black uppercase'>GLO_STAT</span></button>
                                    <button onClick={() => setActiveTab('ombor')} className={`flex flex-col items-center gap-1 ${activeTab === 'ombor' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Database size={20} /><span className='text-[8px] font-black uppercase'>GLOBAL_OMBOR</span></button>
                                </>
                            ) : currentAdmin?.role === 'glavniy' ? (
                                <>
                                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Activity size={20} /><span className='text-[8px] font-black uppercase'>HISOBOT</span></button>
                                    <button onClick={() => setActiveTab('users')} className={`flex flex-col items-center gap-1 ${activeTab === 'users' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Users size={20} /><span className='text-[8px] font-black uppercase'>XODIMLAR</span></button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setActiveTab('asosiy')} className={`flex flex-col items-center gap-1 ${activeTab === 'asosiy' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Activity size={20} /><span className='text-[8px] font-black uppercase'>STAT</span></button>
                                    <button onClick={() => setActiveTab('xarita')} className={`flex flex-col items-center gap-1 ${activeTab === 'xarita' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><Monitor size={20} /><span className='text-[8px] font-black uppercase'>XARITA</span></button>
                                    <button onClick={() => setActiveTab('bar')} className={`flex flex-col items-center gap-1 ${activeTab === 'bar' ? 'text-[#ffcf4b]' : 'text-white/20'}`}><ShoppingCart size={20} /><span className='text-[8px] font-black uppercase'>BAR</span></button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals placeholders... */}
            <AnimatePresence>
                {showAddRoom && (
                    <div className='modal-overlay'>
                        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className='modal-content'>
                            <h2 className='text-xl font-black italic uppercase mb-8'>YANGI XONA</h2>
                            <div className='space-y-4'>
                                <input type="text" placeholder="NOMI" className='input-luxury-small' value={newRoom.name} onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })} />
                                <input type="number" placeholder="NARXI" className='input-luxury-small' value={newRoom.price} onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })} />
                                <button onClick={() => { setRooms(prev => [...prev, { ...newRoom, id: Date.now(), isBusy: false, dailyRevenue: 0, club: currentAdmin?.club }]); setShowAddRoom(false); }} className='btn-gold-minimal'>SAQLASH</button>
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
                                <button onClick={() => { setInventory(prev => [...prev, { ...newProduct, id: Date.now() }]); setShowAddProduct(false); }} className='btn-gold-minimal'>QO'SHISH</button>
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
