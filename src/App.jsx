import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Version: 1.0.1 - Premium Bar UI
import { User, Lock, ArrowRight, Gamepad2, ShieldCheck, Zap, Settings, BarChart3, Database, Users, Monitor, CreditCard, Activity, LogOut, ChevronRight, Trash2, X, Coffee, ShoppingCart, Plus } from 'lucide-react';

function App() {
    const [view, setView] = useState('login');
    const [holdProgress, setHoldProgress] = useState(0);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [adminTab, setAdminTab] = useState('asosiy');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Persistent State for Main Admin
    const getInitialState = (key, defaultValue) => {
        try {
            // v43 - Stabilizing Dashboard Icons
            const BOT_URL = 'https://pls-taupe.vercel.app/?v=v43';
            const API_URL = 'http://161.35.196.164:3001/api';
            const stored = localStorage.getItem(key);
            const parsed = JSON.parse(stored);
            return (parsed && (Array.isArray(parsed) || typeof parsed === 'object')) ? parsed : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    };

    const [superAdmins, setSuperAdmins] = useState(() => getInitialState('pls_super_admins', [
        { name: 'Shoxrux Mirzo', phone: '+998 90 123 45 67', login: 'shox_pro', pass: '1111', club: 'PLS Kokand-1' },
        { name: 'Jasur Bek', phone: '+998 94 987 65 43', login: 'jasur_99', pass: '2222', club: 'PLS Fergana-2' }
    ]));

    const [clubAdmins, setClubAdmins] = useState(() => getInitialState('pls_club_admins', [
        { name: 'Otabek Admin', login: 'ota_admin', pass: '7777', club: 'PLS Kokand-1' }
    ]));

    const [inventory, setInventory] = useState(() => getInitialState('pls_inventory', [
        { id: 1, name: 'Pepsi 0.5L', price: 8000, stock: 24, category: 'Ichimliklar', image: '/images/pepsi.png' },
        { id: 2, name: 'Flash Energy', price: 12000, stock: 12, category: 'Energetiklar', image: '/images/energy.png' },
        { id: 3, name: 'Coca-Cola 0.5L', price: 8000, stock: 24, category: 'Ichimliklar', image: '/images/pepsi.png' },
        { id: 4, name: 'Chips Lays', price: 15000, stock: 10, category: 'Gazaklar', image: '/images/chips.png' },
        { id: 5, name: 'Sandwich', price: 18000, stock: 5, category: 'Taomlar', image: '/images/sandwich.png' }
    ]));

    const [sales, setSales] = useState(() => getInitialState('pls_sales', []));

    const [rooms, setRooms] = useState(() => getInitialState('pls_rooms', [
        { id: 1, name: 'VIP_01', price: '18,500', club: 'PLS Kokand-1', isBlocked: false, isBusy: false, startTime: null, dailyHours: 0, dailyRevenue: 0, sessionBarTotal: 0, barItems: [] },
        { id: 2, name: 'ROOM_02', price: '12,000', club: 'PLS Kokand-1', isBlocked: false, isBusy: false, startTime: null, dailyHours: 0, dailyRevenue: 0, sessionBarTotal: 0, barItems: [] },
        { id: 3, name: 'ROOM_03', price: '12,000', club: 'PLS Kokand-1', isBlocked: false, isBusy: false, startTime: null, dailyHours: 0, dailyRevenue: 0, sessionBarTotal: 0, barItems: [] }
    ]));

    const [debts, setDebts] = useState(() => getInitialState('pls_debts', []));
    const [sessions, setSessions] = useState(() => getInitialState('pls_sessions', []));

    const [currentTime, setCurrentTime] = useState(Date.now());

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('pls_super_admins', JSON.stringify(superAdmins));
    }, [superAdmins]);

    useEffect(() => {
        localStorage.setItem('pls_club_admins', JSON.stringify(clubAdmins));
    }, [clubAdmins]);

    useEffect(() => {
        localStorage.setItem('pls_inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('pls_rooms', JSON.stringify(rooms));
    }, [rooms]);

    useEffect(() => {
        localStorage.setItem('pls_debts', JSON.stringify(debts));
    }, [debts]);

    useEffect(() => {
        localStorage.setItem('pls_sales', JSON.stringify(sales));
    }, [sales]);

    useEffect(() => {
        localStorage.setItem('pls_sessions', JSON.stringify(sessions));
    }, [sessions]);

    // Global Clock
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isClubAddModalOpen, setIsClubAddModalOpen] = useState(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const [editIndex, setEditIndex] = useState(null);
    const [clubEditIndex, setClubEditIndex] = useState(null);
    const [roomEditIndex, setRoomEditIndex] = useState(null);

    const [newAdmin, setNewAdmin] = useState({ name: '', phone: '', login: '', pass: '', club: '' });
    const [newClubAdmin, setNewClubAdmin] = useState({ name: '', login: '', pass: '', club: '' });
    const [newRoom, setNewRoom] = useState({ name: '', price: '', isBlocked: false });

    const [selectedRoom, setSelectedRoom] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [clientInfo, setClientInfo] = useState({ name: '', phone: '' });
    const [sessionTotal, setSessionTotal] = useState(0);

    const [superAdminTab, setSuperAdminTab] = useState('asosiy');
    const [clubAdminTab, setClubAdminTab] = useState('rooms');
    const [barSubTab, setBarSubTab] = useState('sotuv'); // sotuv or ombor
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: 'Ichimliklar', image: '/images/pepsi.png' });
    const [barCategory, setBarCategory] = useState('Hammasi');

    const holdTimer = useRef(null);

    // Server Sync Logic
    const syncData = async (data) => {
        try {
            await fetch(`${API_URL}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (e) { console.error('Sync failed:', e); }
    };

    // Initial Load
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const res = await fetch(`${API_URL}/data`);
                const data = await res.json();
                if (data.inventory) setInventory(data.inventory);
                if (data.rooms) setRooms(data.rooms);
                if (data.sales) setSales(data.sales);
                if (data.debts) setDebts(data.debts);
                if (data.sessions) setSessions(data.sessions);
            } catch (e) { console.error('Initial load failed:', e); }
        };
        loadInitialData();
    }, []);

    // Effect to sync every change
    useEffect(() => {
        const timer = setTimeout(() => {
            syncData({
                superAdmins,
                clubAdmins,
                rooms,
                inventory,
                debts,
                sessions,
                sales
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [superAdmins, clubAdmins, rooms, inventory, debts, sessions, sales]);

    const startHold = () => {
        let progress = 0;
        holdTimer.current = setInterval(() => {
            progress += 1;
            setHoldProgress(progress);
            if (progress % 4 === 0 && window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
            }
            if (progress >= 30) {
                clearInterval(holdTimer.current);
                setHoldProgress(0);
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
                setView('admin-login');
            }
        }, 80);
    };

    const stopHold = () => {
        clearInterval(holdTimer.current);
        setHoldProgress(0);
    };

    const handleLogin = (e) => {
        e?.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setTimeout(() => {
            const superAdmin = superAdmins.find(sa => sa.login === username && sa.pass === password);
            const clubAdmin = clubAdmins.find(ca => ca.login === username && ca.pass === password);

            if (username === '4567' && password === '4567') {
                setView('admin');
            } else if (superAdmin) {
                setView('super-admin');
            } else if (clubAdmin) {
                setView('club-admin-view');
            } else if (username && password) {
                setView('player');
            } else {
                setErrorMessage('Iltimos, barcha maydonlarni to\'ldiring');
            }
            setIsLoading(false);
        }, 1500);
    };

    const handleAdminVerify = (e) => {
        e?.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        setTimeout(() => {
            const isMaster = (adminUser === '4567' && adminPass === '4567');
            const isAdmin = (adminUser.toLowerCase() === 'admin' && adminPass === 'admin777');
            const superAdmin = superAdmins.find(sa => sa.login === adminUser && sa.pass === adminPass);

            if (isMaster || isAdmin) {
                setView('admin');
                setUsername(adminUser);
            } else if (superAdmin) {
                setView('super-admin');
                setUsername(adminUser);
            } else {
                setErrorMessage('Xavfsizlik kaliti noto\'g\'ri');
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
                }
            }
            setIsLoading(false);
        }, 1800);
    };

    const handleSaveSuperAdmin = () => {
        if (!newAdmin.name || !newAdmin.login || !newAdmin.pass) return;
        if (editIndex !== null) {
            const updated = [...superAdmins];
            updated[editIndex] = newAdmin;
            setSuperAdmins(updated);
        } else {
            setSuperAdmins([...superAdmins, newAdmin]);
        }
        setNewAdmin({ name: '', phone: '', login: '', pass: '', club: '' });
        setIsAddModalOpen(false);
        setEditIndex(null);
    };

    const handleSaveClubAdmin = (currentClub) => {
        if (!newClubAdmin.name || !newClubAdmin.login || !newClubAdmin.pass) return;
        const adminData = { ...newClubAdmin, club: currentClub };

        if (clubEditIndex !== null) {
            const updated = [...clubAdmins];
            updated[clubEditIndex] = adminData;
            setClubAdmins(updated);
        } else {
            setClubAdmins([...clubAdmins, adminData]);
        }

        setNewClubAdmin({ name: '', login: '', pass: '', club: '' });
        setIsClubAddModalOpen(false);
        setClubEditIndex(null);
    };

    const formatTime = (ms) => {
        const secs = Math.floor(ms / 1000) % 60;
        const mins = Math.floor(ms / (1000 * 60)) % 60;
        const hrs = Math.floor(ms / (1000 * 60 * 60));
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const calculateCost = (room, now) => {
        if (!room.startTime) return 0;
        const elapsedMs = now - room.startTime;
        const priceStr = room.price || '0';
        const hourly = parseInt(priceStr.toString().replace(/[^0-9]/g, '')) || 0;
        const timeCost = Math.floor((elapsedMs / (1000 * 60 * 60)) * hourly);
        return timeCost + (Number(room.sessionBarTotal) || 0);
    };

    const handleAddBar = (roomId, amount, itemName, productId) => {
        const product = inventory.find(p => p.id === productId);
        if (!product || product.stock <= 0) {
            alert('Mahsulot omborga tugagan!');
            return;
        }

        setInventory(inventory.map(p => p.id === productId ? { ...p, stock: p.stock - 1 } : p));
        setRooms(rooms.map(r => r.id === roomId ? {
            ...r,
            sessionBarTotal: (r.sessionBarTotal || 0) + amount,
            barItems: [...(r.barItems || []), { name: itemName, price: amount, time: Date.now() }]
        } : r));
    };

    const handleDirectSale = (productId, club) => {
        const product = inventory.find(p => p.id === productId);
        if (!product || product.stock <= 0) return;

        setInventory(inventory.map(p => p.id === productId ? { ...p, stock: p.stock - 1 } : p));
        const saleRecord = {
            id: Date.now(),
            productName: product.name,
            totalCost: product.price,
            club: club,
            date: new Date().toLocaleDateString('uz-UZ'),
            time: new Date().toLocaleTimeString('uz-UZ', { hour12: false }),
            type: 'Naqd Sotuv'
        };
        setSales([saleRecord, ...sales]);

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
    };

    const handleStartSession = (id) => {
        setRooms(rooms.map(r => r.id === id ? { ...r, isBusy: true, startTime: Date.now(), sessionBarTotal: 0, barItems: [] } : r));
    };

    const handleStopSession = (room) => {
        const total = calculateCost(room, currentTime);
        setSessionTotal(total);
        setPaymentAmount(total.toString());
        setSelectedRoom(room);
        setIsPaymentModalOpen(true);
    };

    const handleProcessPayment = (room, total) => {
        const paid = parseInt(paymentAmount) || 0;
        const debt = total - paid;

        if (debt > 0) {
            const newDebt = {
                id: Date.now(),
                client: clientInfo.name || 'Noma\'lum Mijoz',
                phone: clientInfo.phone || 'Noma\'lum',
                amount: debt,
                date: new Date().toLocaleDateString(),
                club: room.club
            };
            setDebts([...debts, newDebt]);
        }

        const elapsedHours = (Date.now() - room.startTime) / (1000 * 60 * 60);

        // Record Session
        const sessionRecord = {
            id: Date.now(),
            roomName: room.name,
            startTime: room.startTime,
            endTime: Date.now(),
            duration: Date.now() - room.startTime,
            timeCost: total - (Number(room.sessionBarTotal) || 0),
            barCost: Number(room.sessionBarTotal) || 0,
            totalCost: total,
            paidAmount: paid,
            debtAmount: debt,
            club: room.club,
            admin: username,
            type: 'Xona Sessiyasi',
            date: new Date().toLocaleDateString('uz-UZ'),
            time: new Date().toLocaleTimeString('uz-UZ', { hour12: false })
        };
        setSessions([sessionRecord, ...sessions]);

        setRooms(rooms.map(r => r.id === room.id ? {
            ...r,
            isBusy: false,
            startTime: null,
            sessionBarTotal: 0,
            barItems: [],
            dailyHours: (r.dailyHours || 0) + elapsedHours,
            dailyRevenue: (r.dailyRevenue || 0) + paid
        } : r));

        setIsPaymentModalOpen(false);
        setClientInfo({ name: '', phone: '' });
        setSessionTotal(0);
    };

    const handleDeleteRoom = (id) => {
        if (window.confirm('Haqiqatdan ham ushbu xonani o\'chirmoqchimisiz?')) {
            setRooms(rooms.filter(r => r.id !== id));
        }
    };

    const handleStartRoomEdit = (room, index) => {
        setNewRoom(room);
        setRoomEditIndex(index);
        setIsRoomModalOpen(true);
    };

    const toggleBlockRoom = (id) => {
        setRooms(rooms.map(r => r.id === id ? { ...r, isBlocked: !r.isBlocked } : r));
    };

    const handleDeleteClubAdmin = (index) => {
        if (window.confirm('Haqiqatdan ham ushbu club adminni o\'chirmoqchimisiz?')) {
            setClubAdmins(clubAdmins.filter((_, i) => i !== index));
        }
    };

    const handleDeleteSuperAdmin = (index) => {
        if (window.confirm('Haqiqatdan ham ushbu super adminni o\'chirmoqchimisiz?')) {
            setSuperAdmins(superAdmins.filter((_, i) => i !== index));
        }
    };

    const handleStartEdit = (admin, index) => {
        setNewAdmin(admin);
        setEditIndex(index);
        setIsAddModalOpen(true);
    };

    const handleStartClubEdit = (admin, index) => {
        setNewClubAdmin(admin);
        setClubEditIndex(index);
        setIsClubAddModalOpen(true);
    };

    const handleSaveRoom = (currentClub) => {
        if (!newRoom.name || !newRoom.price) return;
        const roomData = { ...newRoom, id: Date.now(), club: currentClub, isBusy: false, startTime: null, dailyHours: 0, dailyRevenue: 0 };

        if (roomEditIndex !== null) {
            const updated = [...rooms];
            updated[roomEditIndex] = { ...updated[roomEditIndex], ...newRoom };
            setRooms(updated);
        } else {
            setRooms([...rooms, roomData]);
        }

        setNewRoom({ name: '', price: '', isBlocked: false });
        setIsRoomModalOpen(false);
        setRoomEditIndex(null);
    };

    return (
        <div className='min-h-screen relative bg-[#030308] text-white font-outfit overflow-hidden selection:bg-white/10'>
            {/* Elegant Background Mesh */}
            <div className='mesh-bg'></div>

            {/* Floating Glow Orbs */}
            <div className='absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-pls-cyan/10 blur-[120px] rounded-full animate-pulse'></div>
            <div className='absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-pls-purple/10 blur-[100px] rounded-full animate-pulse' style={{ animationDelay: '2s' }}></div>

            <AnimatePresence mode='wait'>
                {view === 'login' ? (
                    <motion.div
                        key='login' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        className='relative z-10 w-full h-screen flex flex-col justify-between p-8 pt-12 pb-16 max-w-lg mx-auto'
                    >
                        {/* Elegant Header */}
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 flex items-center justify-center relative'>
                                    <div className='absolute inset-0 bg-white/5 rounded-[14px] rotate-6'></div>
                                    <div className='absolute inset-0 bg-white/10 rounded-[14px] backdrop-blur-md'></div>
                                    <Gamepad2 size={24} className='relative z-10 text-white' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className='syncopate text-lg font-bold tracking-[3px] leading-tight'>PLS CLUB</span>
                                    <span className='text-[10px] text-white/40 font-medium uppercase tracking-[2px]'>Premium Tajriba</span>
                                </div>
                            </div>

                            <motion.div
                                onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}
                                className='w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative cursor-pointer active:scale-90 transition-transform group'
                            >
                                {holdProgress > 0 && (
                                    <svg className='absolute inset-0 w-full h-full -rotate-90'>
                                        <circle
                                            cx='24' cy='24' r='22'
                                            fill='none' stroke='white' strokeWidth='2'
                                            strokeDasharray='138.2'
                                            strokeDashoffset={138.2 - (holdProgress / 30) * 138.2}
                                            className='transition-all duration-100'
                                        />
                                    </svg>
                                )}
                                <ShieldCheck size={18} className='text-white/40 group-hover:text-white transition-colors' />
                            </motion.div>
                        </div>

                        {/* Minimal Main Title */}
                        <div className='flex flex-col items-center gap-10 w-full'>
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='text-center'>
                                <h1 className='text-6xl font-black italic syncopate luxury-gradient-text tracking-[-4px] leading-none mb-4'>
                                    ARENA
                                </h1>
                                <p className='text-white/30 text-[10px] font-semibold tracking-[4px] uppercase'>Premium o'yinlar olamiga xush kelibsiz</p>
                            </motion.div>

                            {/* Clean Form Container */}
                            <form onSubmit={handleLogin} className='premium-glass p-8 w-full flex flex-col gap-6'>
                                <div className='space-y-4'>
                                    <input
                                        type='text' placeholder='Login'
                                        value={username} onChange={(e) => setUsername(e.target.value)}
                                        className='input-luxury'
                                    />
                                    <input
                                        type='password' placeholder='Parol'
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        className='input-luxury'
                                    />
                                    {errorMessage && (
                                        <p className='text-[11px] text-red-400 font-medium text-center'>{errorMessage}</p>
                                    )}
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className='btn-luxury w-full mt-2'
                                >
                                    {isLoading ? 'Yuklanmoqda...' : 'Kirish'}
                                </button>
                            </form>
                        </div>

                        {/* Minimal Footer */}
                        <div className='flex flex-col items-center gap-4 opacity-20'>
                            <div className='w-12 h-[1px] bg-white'></div>
                            <span className='text-[9px] font-bold tracking-[3px] uppercase'>Tuzilgan: 2024</span>
                        </div>
                    </motion.div>
                ) : view === 'admin-login' ? (
                    <motion.div
                        key='admin-login' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className='relative z-20 w-screen h-screen flex items-center justify-center p-8 bg-[#030308]'
                    >
                        <div className='max-w-sm w-full space-y-12'>
                            <div className='text-center space-y-4'>
                                <div className='w-20 h-20 bg-white/5 rounded-[28px] mx-auto flex items-center justify-center border border-white/10'>
                                    <Lock size={32} className='text-white' />
                                </div>
                                <h3 className='syncopate text-sm font-bold tracking-[4px] uppercase'>ADMINISTRATOR</h3>
                            </div>

                            <form onSubmit={handleAdminVerify} className='space-y-6'>
                                <div className='space-y-3'>
                                    <input
                                        type='text' placeholder='Login'
                                        value={adminUser} onChange={(e) => setAdminUser(e.target.value)}
                                        className='input-luxury text-center tracking-[4px]'
                                    />
                                    <input
                                        type='password' placeholder='••••'
                                        value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                                        className='input-luxury text-center tracking-[8px]'
                                    />
                                    {errorMessage && <p className='text-xs text-center text-red-400'>{errorMessage}</p>}
                                </div>

                                <button
                                    type="submit" disabled={isLoading}
                                    className='btn-luxury w-full py-6'
                                >
                                    {isLoading ? 'Tasdiqlanmoqda...' : 'Kirish'}
                                </button>

                                <button type="button" onClick={() => setView('login')} className='w-full text-[10px] uppercase font-bold tracking-[2px] opacity-20 hover:opacity-100 transition-opacity'>Bekor qilish</button>
                            </form>
                        </div>
                    </motion.div>
                ) : view === 'admin' ? (
                    <motion.div
                        key='admin' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='relative z-10 w-full h-screen flex flex-col bg-[#030308] max-w-lg mx-auto overflow-hidden'
                    >
                        {/* Tab Control HUD */}
                        <div className='flex justify-between items-center p-6 bg-black/40 backdrop-blur-2xl border-b border-white/5'>
                            <div className='flex gap-3'>
                                {['asosiy', 'admins', 'jurnallar'].map(tab => (
                                    <button
                                        key={tab} onClick={() => setAdminTab(tab)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[2px] transition-all ${adminTab === tab ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'bg-white/5 text-white/40'}`}
                                    >
                                        {tab === 'asosiy' ? 'BOSHQUVAR' : tab === 'admins' ? 'SUPER ADMINLAR' : 'JURNALLAR'}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setView('login')} className='w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20'>
                                <LogOut size={18} />
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-6 space-y-8 pb-32'>
                            <AnimatePresence mode='wait'>
                                {adminTab === 'asosiy' ? (
                                    <motion.div key='admin-dash' initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='space-y-8'>
                                        {/* 🚀 REAL-TIME CLUBS AGGREGATION */}
                                        {(() => {
                                            const clubList = Array.from(new Set(clubAdmins.map(ca => ca.club))).map(clubName => {
                                                const clubRooms = (rooms || []).filter(r => r && r.club === clubName);
                                                return {
                                                    name: clubName,
                                                    rooms: clubRooms.length,
                                                    dailyRevenue: clubRooms.reduce((acc, r) => acc + (Number(r.dailyRevenue) || 0), 0)
                                                };
                                            });
                                            const clubs = clubList; // For legacy matching

                                            return (
                                                <>
                                                    {/*  KPI OVERVIEW */}
                                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                                        <div className='premium-glass p-8 bg-gradient-to-br from-[#39ff14]/10 to-transparent border-[#39ff14]/20 flex justify-between items-center'>
                                                            <div>
                                                                <div className='flex items-center gap-3 mb-2'>
                                                                    <div className='w-2 h-2 rounded-full bg-[#39ff14] animate-pulse'></div>
                                                                    <span className='text-[10px] font-bold tracking-[2px] uppercase opacity-40'>Global Network</span>
                                                                </div>
                                                                <h1 className='text-6xl font-black italic tracking-tighter'>{clubs.length}</h1>
                                                                <div className='text-[8px] text-white/20 font-bold tracking-[2px] uppercase'>AKTIV FILIALLAR 🟢</div>
                                                            </div>
                                                            <div className='grid gap-4'>
                                                                <div className='premium-glass p-5 flex flex-col justify-center text-center'>
                                                                    <p className='text-[8px] text-white/40 font-bold uppercase tracking-[2px] mb-1'>UMUMIY XONALAR 🔥</p>
                                                                    <h3 className='text-2xl font-bold text-[#39ff14]'>{clubs.reduce((acc, c) => acc + c.rooms, 0)}</h3>
                                                                </div>
                                                                <div className='premium-glass p-5 flex flex-col justify-center text-center'>
                                                                    <p className='text-[8px] text-white/40 font-bold uppercase tracking-[2px] mb-1'>JAMI DAROMAD 💰</p>
                                                                    <h3 className='text-2xl font-bold italic tracking-tight'>
                                                                        {(clubs.reduce((acc, c) => acc + c.dailyRevenue, 0) / 1000000).toFixed(1)}M
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* 🚀 CLUB NODES LIST */}
                                                        <div className='space-y-4'>
                                                            <h3 className='text-[10px] font-bold uppercase tracking-[4px] text-white/30 px-2'>ULANGAN XONALAR HOLATI</h3>
                                                            <div className='space-y-3'>
                                                                {clubs.map((club, i) => (
                                                                    <div key={i} className='premium-glass p-6 flex justify-between items-center border-white/5'>
                                                                        <div className='flex items-center gap-4'>
                                                                            <div className='w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10'>
                                                                                <Monitor size={22} className='text-[#39ff14]' />
                                                                            </div>
                                                                            <div>
                                                                                <p className='font-bold text-sm tracking-wide'>{club.name}</p>
                                                                                <p className='text-[10px] text-white/30 uppercase tracking-[1px]'>{club.rooms} TA STANTSIYA</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='text-right'>
                                                                            <p className='text-[12px] font-bold text-[#39ff14]'>{Number(club.dailyRevenue).toLocaleString()} SO'M</p>
                                                                            <p className='text-[8px] text-white/20 uppercase tracking-[1px]'>BUGUN</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}

                                        {/* 🚀 BROADCAST PANEL */}
                                        <div className='premium-glass p-6 border-[#39ff14]/10 bg-[#39ff14]/[0.02]'>
                                            <div className='flex items-center gap-3 mb-4'>
                                                <div className='w-2 h-2 rounded-full bg-[#39ff14]'></div>
                                                <span className='text-[11px] font-bold tracking-[2px] uppercase'>SUPER ADMINLARGA XABAR YUBORISH 🔉</span>
                                            </div>
                                            <textarea
                                                className='w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-white placeholder:text-white/20 min-h-[100px] outline-none focus:border-[#39ff14]/30 transition-all'
                                                placeholder='Barcha super adminlarga xabar yuborish... ✍️'
                                            />
                                            <button className='w-full mt-4 bg-[#39ff14] text-black font-black py-5 rounded-2xl text-[12px] tracking-[2px] hover:brightness-110 active:scale-[0.98] transition-all'>
                                                HAMMAGA TARQATISH 🔥
                                            </button>
                                        </div>

                                        {/* 🛠️ SERVER HEALTH STATUS */}
                                        <div className='flex justify-between items-center p-6 bg-white/[0.02] rounded-3xl border border-white/5'>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>TIZIM: <span className='text-[#39ff14]'>BARQAROR 🟢</span></div>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>YUKLAMA: <span className='text-[#39ff14]'>PAST 🟢</span></div>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>SINXRON: <span className='text-[#39ff14]'>JONLI ⚡</span></div>
                                        </div>
                                    </motion.div>
                                ) : adminTab === 'admins' ? (
                                    <motion.div key='admins' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className='space-y-6'>
                                        <button
                                            onClick={() => {
                                                setEditIndex(null);
                                                setNewAdmin({ name: '', phone: '', login: '', pass: '', club: '' });
                                                setIsAddModalOpen(!isAddModalOpen);
                                            }}
                                            className='w-full bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] py-5 rounded-2xl font-black text-[11px] tracking-[3px] uppercase hover:bg-[#39ff14]/20 transition-all'
                                        >
                                            {isAddModalOpen ? 'YOPISH' : "+ YANGI SUPER ADMIN QO'SHISH"}
                                        </button>

                                        {isAddModalOpen && (
                                            <div className='premium-glass p-6 space-y-4 border-[#39ff14]/20'>
                                                <input placeholder='Ism' className='input-luxury' value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
                                                <input placeholder='Telefon' className='input-luxury' value={newAdmin.phone} onChange={e => setNewAdmin({ ...newAdmin, phone: e.target.value })} />
                                                <input placeholder='Login' className='input-luxury' value={newAdmin.login} onChange={e => setNewAdmin({ ...newAdmin, login: e.target.value })} />
                                                <input placeholder='Parol' className='input-luxury' value={newAdmin.pass} onChange={e => setNewAdmin({ ...newAdmin, pass: e.target.value })} />
                                                <input placeholder='Klub nomi' className='input-luxury' value={newAdmin.club} onChange={e => setNewAdmin({ ...newAdmin, club: e.target.value })} />
                                                <button onClick={handleSaveSuperAdmin} className='w-full bg-[#39ff14] text-black font-bold py-3 rounded-xl uppercase tracking-[1px]'>
                                                    {editIndex !== null ? 'Yangilash' : 'Saqlash'}
                                                </button>
                                            </div>
                                        )}

                                        <div className='space-y-3'>
                                            {superAdmins.map((admin, i) => (
                                                <div key={i} className='premium-glass p-6 flex flex-col gap-4 border-white/5'>
                                                    <div className='flex justify-between items-start'>
                                                        <div className='flex items-center gap-4'>
                                                            <div className='w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center'>
                                                                <User size={28} className='text-white/40' />
                                                            </div>
                                                            <div>
                                                                <p className='font-bold text-lg tracking-tight'>{admin.name}</p>
                                                                <p className='text-[10px] text-[#39ff14] font-bold tracking-[1px]'>{admin.club}</p>
                                                            </div>
                                                        </div>
                                                        <div className='flex gap-3'>
                                                            <button onClick={() => handleStartEdit(admin, i)} className='w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors'><Settings size={16} className='text-white/40' /></button>
                                                            <button onClick={() => handleDeleteSuperAdmin(i)} className='w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10 transition-colors'><Trash2 size={16} className='text-red-400' /></button>
                                                        </div>
                                                    </div>

                                                    <div className='grid grid-cols-2 gap-3 pt-2 border-t border-white/5'>
                                                        <div>
                                                            <p className='text-[8px] text-white/20 uppercase tracking-[2px] mb-1'>Tel raqami</p>
                                                            <p className='text-[11px] font-medium'>{admin.phone || 'Nomalum'}</p>
                                                        </div>
                                                        <div>
                                                            <p className='text-[8px] text-white/20 uppercase tracking-[2px] mb-1'>Login / Parol</p>
                                                            <p className='text-[11px] font-bold text-[#39ff14] tracking-widest'>{admin.login} / {admin.pass}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key='logs' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className='space-y-6'>
                                        <div className='premium-glass bg-black/60 p-6 space-y-6 border-white/5'>
                                            <h4 className='text-[10px] font-bold opacity-30 uppercase tracking-[4px]'>TIZIM FAOLLIYATI (JONLI) ⚡</h4>
                                            <div className='space-y-6'>
                                                {[
                                                    { name: 'KOKAND_01', action: 'Xabarnoma yuborildi', time: 'hozir', status: 'active' },
                                                    { name: 'FERGANA_02', action: 'Yangi PC qo\'shildi', time: '5 daq', status: 'active' },
                                                    { name: 'SYSTEM_SRV', action: 'Arxivlash yakunlandi', time: '12 daq', status: 'active' }
                                                ].map((h, i) => (
                                                    <div key={i} className={`flex justify-between items-center p-5 bg-white/[0.02] rounded-2xl border-l-[3px] ${h.status === 'active' ? 'border-[#39ff14]' : 'border-red-500'}`}>
                                                        <div>
                                                            <div className='text-[13px] font-bold uppercase tracking-[1px]'>{h.name}</div>
                                                            <div className='text-[9px] opacity-40 uppercase tracking-[1px] mt-1'>{h.action}</div>
                                                        </div>
                                                        <div className='text-[10px] font-bold opacity-30 uppercase tracking-[1px]'>{h.time}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : view === 'super-admin' ? (
                    <motion.div
                        key='super-admin' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='relative z-10 w-full h-screen flex flex-col bg-[#030308] max-w-lg mx-auto overflow-hidden'
                    >
                        {/* Tab HUD for Super Admin */}
                        <div className='flex justify-between items-center p-6 bg-black/40 backdrop-blur-2xl border-b border-white/5'>
                            <div className='flex gap-3'>
                                {['asosiy', 'admins', 'logs'].map(tab => (
                                    <button
                                        key={tab} onClick={() => setSuperAdminTab(tab)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[2px] transition-all ${superAdminTab === tab ? 'bg-[#39ff14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]' : 'bg-white/5 text-white/40'}`}
                                    >
                                        {tab === 'asosiy' ? 'BOSHQUVAR' : tab === 'admins' ? 'ADMINLAR' : 'JURNALLAR'}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setView('login')} className='w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20'>
                                <LogOut size={18} />
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-6 space-y-8 pb-32'>
                            <AnimatePresence mode='wait'>
                                {superAdminTab === 'asosiy' ? (
                                    <motion.div key='sa-dash' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className='space-y-8'>
                                        {/* My Club Info */}
                                        <div className='premium-glass p-8 bg-gradient-to-br from-[#39ff14]/10 to-transparent border-[#39ff14]/30 relative overflow-hidden'>
                                            <div className='flex justify-between items-start mb-6'>
                                                <div className='space-y-1'>
                                                    <p className='text-[8px] text-[#39ff14] font-black tracking-[4px] uppercase'>FILIAL_HOLATI</p>
                                                    <h2 className='text-2xl font-black italic tracking-tighter uppercase syncopate'>{superAdmins.find(sa => sa.login === username)?.club || 'PLS FILIAL'}</h2>
                                                </div>
                                                <div className='w-3 h-3 rounded-full bg-[#39ff14] shadow-[0_0_12px_#39ff14] animate-pulse'></div>
                                            </div>
                                            <div className='grid grid-cols-2 gap-8'>
                                                <div>
                                                    <p className='text-[8px] text-white/30 font-bold uppercase tracking-[2px] mb-1'>AKTIV PC 🎮</p>
                                                    <p className='text-3xl font-black italic tracking-tighter'>18 / 24</p>
                                                </div>
                                                <div>
                                                    <p className='text-[8px] text-white/30 font-bold uppercase tracking-[2px] mb-1'>BUGUNGI KASSA 💰</p>
                                                    <p className='text-3xl font-black italic tracking-tighter'>1.2M</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='grid grid-cols-2 gap-4'>
                                            <button className='premium-glass p-6 text-center hover:bg-[#39ff14]/10 transition-all group'>
                                                <Monitor size={32} className='mx-auto mb-3 text-white/40 group-hover:text-[#39ff14]' />
                                                <p className='text-[10px] font-black tracking-[2px]'>MONITORING</p>
                                            </button>
                                            <button className='premium-glass p-6 text-center hover:bg-[#39ff14]/10 transition-all group'>
                                                <CreditCard size={32} className='mx-auto mb-3 text-white/40 group-hover:text-[#39ff14]' />
                                                <p className='text-[10px] font-black tracking-[2px]'>HISOBOTLAR</p>
                                            </button>
                                        </div>

                                        <div className='flex justify-between items-center p-6 bg-white/[0.02] rounded-3xl border border-white/5'>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>STANTSIYALAR: <span className='text-[#39ff14]'>ONLAYN 🌐</span></div>
                                            <div className='text-[9px] font-bold text-white/40 uppercase tracking-[2px]'>KASSA: <span className='text-white'>OCHIQ ✅</span></div>
                                        </div>
                                    </motion.div>
                                ) : superAdminTab === 'admins' ? (
                                    <motion.div key='sa-admins' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className='space-y-6'>
                                        <button
                                            onClick={() => {
                                                setClubEditIndex(null);
                                                setNewClubAdmin({ name: '', login: '', pass: '', club: '' });
                                                setIsClubAddModalOpen(!isClubAddModalOpen);
                                            }}
                                            className='w-full bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] py-5 rounded-2xl font-black text-[11px] tracking-[3px] uppercase hover:bg-[#39ff14]/20 transition-all'
                                        >
                                            {isClubAddModalOpen ? 'YOPISH' : "+ CLUB ADMIN QO'SHISH"}
                                        </button>

                                        {isClubAddModalOpen && (
                                            <div className='premium-glass p-6 space-y-4 border-[#39ff14]/20'>
                                                <input placeholder='Admin Ismi' className='input-luxury' value={newClubAdmin.name} onChange={e => setNewClubAdmin({ ...newClubAdmin, name: e.target.value })} />
                                                <input placeholder='Login' className='input-luxury' value={newClubAdmin.login} onChange={e => setNewClubAdmin({ ...newClubAdmin, login: e.target.value })} />
                                                <input placeholder='Parol' className='input-luxury' value={newClubAdmin.pass} onChange={e => setNewClubAdmin({ ...newClubAdmin, pass: e.target.value })} />
                                                <button onClick={() => handleSaveClubAdmin(superAdmins.find(sa => sa.login === username)?.club)} className='w-full bg-[#39ff14] text-black font-bold py-3 rounded-xl uppercase tracking-[1px]'>
                                                    {clubEditIndex !== null ? 'Yangilash' : 'Saqlash'}
                                                </button>
                                            </div>
                                        )}

                                        <div className='space-y-3'>
                                            {clubAdmins.filter(ca => ca.club === superAdmins.find(sa => sa.login === username)?.club).map((admin, i) => (
                                                <div key={i} className='premium-glass p-6 flex justify-between items-center border-white/5'>
                                                    <div className='flex items-center gap-4'>
                                                        <div className='w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center'>
                                                            <User size={22} className='text-white/40' />
                                                        </div>
                                                        <div>
                                                            <p className='font-bold text-sm tracking-wide'>{admin.name}</p>
                                                            <p className='text-[10px] text-[#39ff14] font-bold tracking-[1px]'>{admin.login} / {admin.pass}</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex gap-2'>
                                                        <button onClick={() => handleStartClubEdit(admin, i)} className='w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10'><Settings size={14} className='text-white/20' /></button>
                                                        <button onClick={() => handleDeleteClubAdmin(i)} className='w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/10'><Trash2 size={14} className='text-red-400/40' /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key='sa-logs' initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='space-y-6'>
                                        <div className='premium-glass p-6 space-y-6 border-white/5'>
                                            <h4 className='text-[10px] font-bold opacity-30 uppercase tracking-[4px]'>FILIAL FAOLLIYATI ⚡</h4>
                                            <div className='space-y-4'>
                                                {[
                                                    { msg: 'PC-14 sessiyasi tugadi', time: 'hozir' },
                                                    { msg: 'Kassa ochildi', time: '12 daq' },
                                                    { msg: 'Yangi xaridor: shox_pro', time: '24 daq' }
                                                ].map((log, i) => (
                                                    <div key={i} className='flex justify-between items-center py-3 border-b border-white/[0.03] last:border-0'>
                                                        <span className='text-[12px] font-medium text-white/60'>{log.msg}</span>
                                                        <span className='text-[9px] font-bold text-white/20 uppercase tracking-[1px]'>{log.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : view === 'club-admin-view' ? (
                    <motion.div
                        key='club-admin' initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className='relative z-10 w-full h-screen flex flex-col bg-[#030308] max-w-lg mx-auto overflow-hidden'
                    >
                        {/* Club Admin Header - GameZone Style */}
                        <div className='p-6 bg-black/40 backdrop-blur-3xl border-b border-white/5 flex justify-between items-center'>
                            <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 rounded-2xl bg-[#39ff14]/10 border border-[#39ff14]/20 flex items-center justify-center relative'>
                                    <ShieldCheck size={24} className='text-[#39ff14]' />
                                    <div className='absolute -top-1 -right-1 w-3 h-3 bg-[#39ff14] rounded-full shadow-[0_0_10px_#39ff14] border-2 border-[#030308]'></div>
                                </div>
                                <div>
                                    <h3 className='text-sm font-black italic tracking-tighter uppercase syncopate'>{clubAdmins.find(ca => ca.login === username)?.club || 'PLS CLUB'}</h3>
                                    <p className='text-[8px] text-[#39ff14] font-black uppercase tracking-[2px]'>{new Date(currentTime).toLocaleTimeString('uz-UZ', { hour12: false })}</p>
                                </div>
                            </div>
                            <button onClick={() => setView('login')} className='p-3 rounded-xl bg-white/5 border border-white/10'>
                                <LogOut size={18} className='text-white/40' />
                            </button>
                        </div>

                        <div className='fixed bottom-4 left-1/2 -translate-x-1/2 w-[98%] max-w-lg bg-black/80 backdrop-blur-3xl border border-white/5 rounded-full p-2.5 flex justify-around items-center z-50 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'>
                            <button onClick={() => setClubAdminTab('asosiy')} className={`flex flex-col items-center gap-1 transition-all ${clubAdminTab === 'asosiy' ? 'text-[#39ff14] scale-110' : 'text-white/20'}`}>
                                <Database size={20} />
                                <span className='text-[7px] font-black uppercase tracking-[1px]'>Asosiy</span>
                            </button>
                            <button onClick={() => setClubAdminTab('xarita')} className={`flex flex-col items-center gap-1 transition-all ${clubAdminTab === 'xarita' ? 'text-[#39ff14] scale-110' : 'text-white/20'}`}>
                                <Monitor size={20} />
                                <span className='text-[7px] font-black uppercase tracking-[1px]'>Xarita</span>
                            </button>
                            <button onClick={() => setClubAdminTab('bar')} className={`flex flex-col items-center gap-1 transition-all ${clubAdminTab === 'bar' ? 'text-[#39ff14] scale-110' : 'text-white/20'}`}>
                                <Coffee size={20} className={clubAdminTab === 'bar' ? 'drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]' : ''} />
                                <span className='text-[7px] font-black uppercase tracking-[1px]'>Bar</span>
                            </button>
                            <button onClick={() => setClubAdminTab('qarz')} className={`flex flex-col items-center gap-1 transition-all ${clubAdminTab === 'qarz' ? 'text-[#39ff14] scale-110' : 'text-white/20'}`}>
                                <CreditCard size={20} />
                                <span className='text-[7px] font-black uppercase tracking-[1px]'>Qarz</span>
                            </button>
                            <button onClick={() => setClubAdminTab('ops')} className={`flex flex-col items-center gap-1 transition-all ${clubAdminTab === 'ops' ? 'text-[#39ff14] scale-110' : 'text-white/20'}`}>
                                <Activity size={20} />
                                <span className='text-[7px] font-black uppercase tracking-[1px]'>Ops</span>
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-4 pb-32'>
                            <AnimatePresence mode='wait'>
                                {clubAdminTab === 'xarita' ? (
                                    <motion.div key='ca-map' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-6 pb-20'>
                                        <button
                                            onClick={() => {
                                                setRoomEditIndex(null);
                                                setNewRoom({ name: '', price: '', isBlocked: false });
                                                setIsRoomModalOpen(!isRoomModalOpen);
                                            }}
                                            className='w-full bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] py-5 rounded-2xl font-black text-[11px] tracking-[3px] uppercase hover:bg-[#39ff14]/20 transition-all'
                                        >
                                            {isRoomModalOpen ? 'YOPISH' : "+ XONA QO'SHISH"}
                                        </button>

                                        {isRoomModalOpen && (
                                            <div className='premium-glass p-6 space-y-4 border-[#39ff14]/20'>
                                                <input placeholder='Xona nomi' className='input-luxury' value={newRoom.name} onChange={e => setNewRoom({ ...newRoom, name: e.target.value })} />
                                                <input placeholder='Soatlik narxi' className='input-luxury' value={newRoom.price} onChange={e => setNewRoom({ ...newRoom, price: e.target.value })} />
                                                <div className='flex items-center gap-3 px-2'>
                                                    <input type='checkbox' id='block-room' checked={newRoom.isBlocked} onChange={e => setNewRoom({ ...newRoom, isBlocked: e.target.checked })} className='w-5 h-5 accent-[#39ff14]' />
                                                    <label htmlFor='block-room' className='text-[10px] font-bold uppercase tracking-[1px] opacity-60'>Vaqtincha bloklash</label>
                                                </div>
                                                <button onClick={() => handleSaveRoom(clubAdmins.find(ca => ca.login === username)?.club || '')} className='w-full bg-[#39ff14] text-black font-bold py-3 rounded-xl uppercase tracking-[1px]'>
                                                    {roomEditIndex !== null ? 'Yangilash' : 'Saqlash'}
                                                </button>
                                            </div>
                                        )}

                                        <div className='space-y-4 pb-32'>
                                            {(rooms || []).filter(r => r && r.club === clubAdmins.find(ca => ca.login === username)?.club).map((room, i) => (
                                                <div
                                                    key={room.id || i}
                                                    onClick={() => !room.isBlocked && setSelectedRoom(room)}
                                                    className={`premium-glass p-6 border-white/5 relative group transition-all ${room.isBusy ? 'bg-[#39ff14]/[0.02]' : 'hover:bg-white/[0.02]'}`}
                                                >
                                                    <div className='flex justify-between items-start mb-2'>
                                                        <div>
                                                            <h3 className='text-3xl font-black italic tracking-tighter uppercase syncopate leading-none'>{room.name}</h3>
                                                            <p className='text-[10px] font-bold text-white/30 tracking-[1.5px] mt-2'>{room.price} UZS / SOAT</p>
                                                        </div>
                                                        <div className='flex items-center gap-1 bg-black/40 p-2 rounded-xl border border-white/5'>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStartRoomEdit(room, rooms.findIndex(r => r.id === room.id));
                                                                }}
                                                                className='w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors'
                                                            >
                                                                <Settings size={14} className='opacity-30' />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id); }}
                                                                className='w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-colors text-red-500'
                                                            >
                                                                <Trash2 size={14} className='opacity-30' />
                                                            </button>
                                                            <ChevronRight size={20} className='ml-2 opacity-10' />
                                                        </div>
                                                    </div>

                                                    <div className='relative h-[3px] w-full bg-white/5 rounded-full overflow-hidden my-6'>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: room.isBusy ? '70%' : '0%' }}
                                                            className='absolute top-0 left-0 h-full bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]'
                                                        />
                                                    </div>

                                                    <div className='flex justify-between items-center'>
                                                        <div className='flex gap-4 items-center'>
                                                            <div className='flex items-center gap-2'>
                                                                <div className={`w-2 h-2 rounded-full ${room.isBusy ? 'bg-[#ff00ff] shadow-[0_0_8px_#ff00ff]' : 'bg-white/10'}`}></div>
                                                                <span className='text-[8px] font-black uppercase tracking-[1.5px] text-white/50'>{room.isBusy ? '1' : '0'} BAND</span>
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <div className='w-2 h-2 rounded-full bg-yellow-500/20'></div>
                                                                <span className='text-[8px] font-black uppercase tracking-[1.5px] text-white/20'>0 BRON</span>
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <div className={`w-2 h-2 rounded-full ${!room.isBusy && !room.isBlocked ? 'bg-[#39ff14] shadow-[0_0_8px_#39ff14]' : 'bg-white/10'}`}></div>
                                                                <span className='text-[8px] font-black uppercase tracking-[1.5px] text-white/50'>{!room.isBusy && !room.isBlocked ? '1' : '0'} BO'SH</span>
                                                            </div>
                                                        </div>
                                                        <div className='text-right'>
                                                            <p className='text-2xl font-black italic text-[#39ff14] tracking-tighter'>{(room.dailyRevenue || 0).toLocaleString()} <span className='text-[10px] opacity-40 font-bold uppercase tracking-[1px] ml-1'>UZS</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : clubAdminTab === 'asosiy' ? (
                                    <motion.div key='ca-dash' initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='space-y-6'>
                                        {/* Premium Gold Dashboard Grid */}
                                        <div className='stat-grid'>
                                            <div className='gold-glass gold-card'>
                                                <div className='absolute top-2 right-4 opacity-20'><Activity size={24} className='text-[#ffcf4b]' /></div>
                                                <p className='text-[8px] font-black tracking-[3px] uppercase opacity-40 mb-2'>BUGUNGI_TUSHUM</p>
                                                <p className='text-3xl gold-text italic tracking-tighter'>
                                                    {Number((rooms || []).filter(r => r && r.club === clubAdmins.find(ca => ca?.login === username)?.club).reduce((acc, r) => acc + (Number(r?.dailyRevenue) || 0), 0)).toLocaleString()}
                                                </p>
                                                <p className='text-[8px] font-bold opacity-30 mt-1 uppercase'>UZS</p>
                                            </div>

                                            <div className='gold-glass gold-card'>
                                                <div className='absolute top-2 right-4 opacity-20'><Zap size={24} className='text-[#ffcf4b]' /></div>
                                                <p className='text-[8px] font-black tracking-[3px] uppercase opacity-40 mb-2'>AKTIV_KONSOL</p>
                                                <p className='text-4xl gold-text italic tracking-tighter'>
                                                    {rooms.filter(r => r && r.club === clubAdmins.find(ca => ca?.login === username)?.club && r.isBusy).length}
                                                </p>
                                                <p className='text-[8px] font-bold opacity-30 mt-1 uppercase'>ONLINE</p>
                                            </div>

                                            <div className='gold-glass gold-card col-span-1'>
                                                <div className='absolute top-2 right-4 opacity-20'><PieChart size={24} className='text-[#ffcf4b]' /></div>
                                                <p className='text-[8px] font-black tracking-[3px] uppercase opacity-40 mb-2'>HAFTALIK_STAT</p>
                                                <p className='text-2xl gold-text italic tracking-tighter'>
                                                    +24%
                                                </p>
                                                <p className='text-[7px] font-bold opacity-20 uppercase mt-1'>O'SISH DAVRI</p>
                                            </div>

                                            <div className='gold-glass gold-card col-span-1'>
                                                <div className='absolute top-2 right-4 opacity-20'><AlertTriangle size={24} className='text-red-500' /></div>
                                                <p className='text-[8px] font-black tracking-[3px] uppercase opacity-40 mb-2 text-red-500/50'>QARZDORLIK</p>
                                                <p className='text-xl font-black italic tracking-tighter text-red-500'>
                                                    {debts.filter(d => d && d.club === clubAdmins.find(ca => ca?.login === username)?.club).reduce((acc, d) => acc + (d?.amount || 0), 0).toLocaleString()}
                                                </p>
                                                <p className='text-[8px] font-bold opacity-30 mt-1 uppercase'>UZS</p>
                                            </div>
                                        </div>

                                        {/* Bottom Action Cards */}
                                        <div className='px-4'>
                                            <div className='gold-glass p-6 border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent'>
                                                <p className='text-[8px] font-black tracking-[4px] uppercase opacity-30 mb-4'>SO'NGGI_XABARLAR</p>
                                                <div className='space-y-4'>
                                                    <div className='flex items-center gap-4'>
                                                        <div className='w-1.5 h-1.5 rounded-full bg-[#ffcf4b] animate-pulse'></div>
                                                        <p className='text-[10px] font-medium opacity-60 uppercase tracking-widest'>Barcha tizimlar barqaror ishlamoqda</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : clubAdminTab === 'bar' ? (
                                    <motion.div key='ca-bar' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-4 pb-40'>
                                        {/* Sub-Tabs Switcher */}
                                        <div className='sub-tab-container'>
                                            <button onClick={() => setBarSubTab('sotuv')} className={`sub-tab-btn ${barSubTab === 'sotuv' ? 'sub-tab-active' : 'sub-tab-inactive'}`}>
                                                <ShoppingCart size={14} /> SOTUV
                                            </button>
                                            <button onClick={() => setBarSubTab('ombor')} className={`sub-tab-btn ${barSubTab === 'ombor' ? 'sub-tab-active' : 'sub-tab-inactive'}`}>
                                                <Database size={14} /> OMBOR
                                            </button>
                                        </div>

                                        {barSubTab === 'sotuv' ? (
                                            <>
                                                {/* Minimalist Categories */}
                                                <div className='flex gap-2 overflow-x-auto no-scrollbar py-2 px-4'>
                                                    {['Hammasi', 'Ichimliklar', 'Energetiklar', 'Gazaklar', 'Taomlar'].map(cat => (
                                                        <button
                                                            key={cat}
                                                            onClick={() => setBarCategory(cat)}
                                                            className={`cat-btn ${barCategory === cat ? 'cat-btn-active' : 'cat-btn-inactive'}`}
                                                        >
                                                            {cat}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className='bar-grid'>
                                                    {inventory
                                                        .filter(p => barCategory === 'Hammasi' || p.category === barCategory)
                                                        .map(product => {
                                                            const club = clubAdmins.find(ca => ca.login === username)?.club;
                                                            return (
                                                                <div key={product.id} className='minimal-card'>
                                                                    <div className='item-img-box'>
                                                                        <img src={product.image} alt={product.name} />
                                                                    </div>
                                                                    <div className='item-info'>
                                                                        <p className='text-[11px] font-bold uppercase tracking-wider truncate mb-1'>{product.name}</p>
                                                                        <div className='flex justify-between items-center'>
                                                                            <p className='text-[13px] font-black italic'>{product.price.toLocaleString()} UZS</p>
                                                                            <span className='stock-badge'>{product.stock} dona</span>
                                                                        </div>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleDirectSale(product.id, club);
                                                                                if (window.Telegram?.WebApp?.HapticFeedback) {
                                                                                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                                                                                }
                                                                            }}
                                                                            disabled={product.stock <= 0}
                                                                            className='btn-sell-minimal'
                                                                        >
                                                                            Sotish
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </>
                                        ) : (
                                            <div className='inventory-list'>
                                                <div className='flex justify-between items-center mb-6 px-1'>
                                                    <h4 className='text-[10px] font-black tracking-[4px] opacity-30 uppercase'>Ombor Boshqaruvi</h4>
                                                    <button onClick={() => setShowAddProduct(true)} className='bg-white text-black text-[9px] font-black px-4 py-2 rounded-xl flex items-center gap-2 uppercase'>
                                                        <Plus size={14} /> Qo'shish
                                                    </button>
                                                </div>

                                                <div className='space-y-3'>
                                                    {inventory.map(item => (
                                                        <div key={item.id} className='inventory-item-row'>
                                                            <div className='flex items-center gap-4'>
                                                                <div className='w-12 h-12 rounded-xl bg-white/5 p-2'>
                                                                    <img src={item.image} alt="" className='w-full h-full object-contain' />
                                                                </div>
                                                                <div>
                                                                    <p className='text-[11px] font-black uppercase tracking-wide'>{item.name}</p>
                                                                    <p className='text-[10px] font-bold text-[#39ff14]'>{item.price.toLocaleString()} UZS</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex items-center gap-6'>
                                                                <div className='text-right'>
                                                                    <p className='text-[8px] font-bold opacity-30 uppercase'>Stock</p>
                                                                    <p className='text-[12px] font-black'>{item.stock}</p>
                                                                </div>
                                                                <div className='flex gap-2'>
                                                                    <button onClick={() => { setEditingProduct(item); setShowAddProduct(true); }} className='action-btn btn-edit'><Settings size={16} /></button>
                                                                    <button onClick={() => setInventory(inventory.filter(p => p.id !== item.id))} className='action-btn btn-delete'><X size={16} /></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : clubAdminTab === 'qarz' ? (
                                    <motion.div key='ca-qarz' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-4'>
                                        {debts.filter(d => d.club === clubAdmins.find(ca => ca.login === username)?.club).map(debt => (
                                            <div key={debt.id} className='premium-glass p-6 border-red-500/20 flex justify-between items-center'>
                                                <div>
                                                    <p className='font-black italic'>{debt.client}</p>
                                                    <p className='text-[9px] text-white/40 font-bold'>{debt.phone} • {debt.date}</p>
                                                </div>
                                                <p className='text-sm font-black text-red-500'>-{debt.amount.toLocaleString()} UZS</p>
                                            </div>
                                        ))}
                                        {debts.filter(d => d.club === clubAdmins.find(ca => ca.login === username)?.club).length === 0 && (
                                            <p className='text-center opacity-20 text-[10px] font-bold uppercase tracking-[2px] py-12'>Qarzdorlar yo'q</p>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div key='ca-ops' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='space-y-4 pb-32'>
                                        <div className='flex justify-between items-center px-4 mb-4'>
                                            <h4 className='text-[10px] font-black tracking-[4px] opacity-30 uppercase'>Barcha Amallar ({[...sessions, ...sales].filter(s => s.club === clubAdmins.find(ca => ca.login === username)?.club).length})</h4>
                                            <button onClick={() => { if (window.confirm('Tarixni tozalash?')) { setSessions(sessions.filter(s => s.club !== clubAdmins.find(ca => ca.login === username)?.club)); setSales(sales.filter(s => s.club !== clubAdmins.find(ca => ca.login === username)?.club)); } }} className='text-[8px] font-black text-red-500 opacity-30 hover:opacity-100 uppercase tracking-[2px] transition-all'>Tarixni Tozalash</button>
                                        </div>

                                        <div className='space-y-3 px-2'>
                                            {[...sessions, ...sales].filter(s => s.club === clubAdmins.find(ca => ca.login === username)?.club)
                                                .sort((a, b) => b.id - a.id)
                                                .map(item => (
                                                    <div key={item.id} className={`premium-glass p-5 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative overflow-hidden group ${item.type === 'Naqd Sotuv' ? 'border-l-2 border-l-blue-500' : ''}`}>
                                                        <div className='flex justify-between items-start mb-4'>
                                                            <div>
                                                                <div className='flex items-center gap-2 mb-1'>
                                                                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[1px] ${item.type === 'Naqd Sotuv' ? 'bg-blue-500/10 text-blue-500' : 'bg-[#39ff14]/10 text-[#39ff14]'}`}>{item.roomName || item.productName}</span>
                                                                    <span className='text-[8px] text-white/20 font-black uppercase tracking-[1px]'>{item.date} • {item.time}</span>
                                                                </div>
                                                                <p className='text-[13px] font-black italic tracking-tight uppercase'>{item.type === 'Naqd Sotuv' ? 'NAQD SOTUV' : `${formatTime(item.duration)} O'YIN DAVOMIYATI`}</p>
                                                            </div>
                                                            <div className='text-right'>
                                                                <p className={`text-[14px] font-black italic ${item.type === 'Naqd Sotuv' ? 'text-blue-500' : 'text-[#39ff14]'}`}>{item.totalCost?.toLocaleString() || item.price?.toLocaleString()} <span className='text-[8px] opacity-40 font-bold'>UZS</span></p>
                                                                {item.debtAmount > 0 && <p className='text-[8px] font-black text-red-500 uppercase mt-0.5 italic'>-{item.debtAmount.toLocaleString()} QARZ</p>}
                                                            </div>
                                                        </div>

                                                        {item.type !== 'Naqd Sotuv' && (
                                                            <div className='grid grid-cols-4 gap-2 pt-3 border-t border-white/5'>
                                                                <div>
                                                                    <p className='text-[7px] text-white/20 font-bold uppercase mb-0.5'>Vaqt</p>
                                                                    <p className='text-[9px] font-black opacity-60'>{item.timeCost?.toLocaleString()}</p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-[7px] text-white/20 font-bold uppercase mb-0.5'>Bar</p>
                                                                    <p className='text-[9px] font-black opacity-60'>{item.barCost?.toLocaleString()}</p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-[7px] text-white/20 font-bold uppercase mb-0.5'>To'lov</p>
                                                                    <p className='text-[9px] font-black text-[#39ff14]'>{item.paidAmount?.toLocaleString()}</p>
                                                                </div>
                                                                <div>
                                                                    <p className='text-[7px] text-white/20 font-bold uppercase mb-0.5'>Admin</p>
                                                                    <p className='text-[9px] font-black opacity-60 truncate'>{item.admin || 'Tizim'}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {selectedRoom && !isPaymentModalOpen && (() => {
                                const activeModalRoom = rooms.find(r => r.id === selectedRoom.id) || selectedRoom;
                                return (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4' onClick={() => setSelectedRoom(null)}>
                                        <motion.div
                                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 15 }}
                                            className='premium-glass w-full max-w-sm p-0 overflow-hidden bg-[#05050a] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]'
                                            onClick={e => e.stopPropagation()}
                                        >
                                            {/* Cinematic Header - Compact */}
                                            <div className='p-6 pb-2 flex justify-between items-start relative'>
                                                <div className='absolute top-0 right-0 w-24 h-24 bg-[#39ff14]/5 blur-[50px] rounded-full pointer-events-none'></div>
                                                <div>
                                                    <div className='flex items-center gap-2 mb-1'>
                                                        <div className='w-1 h-1 rounded-full bg-[#39ff14]'></div>
                                                        <span className='text-[8px] font-black tracking-[3px] text-[#39ff14] uppercase opacity-60'>STANTSIYA_NODO</span>
                                                    </div>
                                                    <h2 className='text-4xl font-black italic tracking-tighter uppercase syncopate luxury-gradient-text leading-none'>{activeModalRoom.name}</h2>
                                                </div>
                                                <button onClick={() => setSelectedRoom(null)} className='w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors'>
                                                    <X size={18} className='opacity-40' />
                                                </button>
                                            </div>

                                            {activeModalRoom.isBusy ? (
                                                <div className='p-6 pt-0 space-y-4'>
                                                    {/* Central Timer HUD - Compact */}
                                                    <div className='py-4 text-center relative'>
                                                        <div className='absolute inset-0 flex items-center justify-center opacity-5'>
                                                            <Activity size={80} className='text-[#39ff14]' />
                                                        </div>
                                                        <p className='text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-1'>
                                                            {formatTime(currentTime - activeModalRoom.startTime)}
                                                        </p>
                                                        <p className='text-[8px] font-black tracking-[4px] text-[#39ff14] uppercase animate-pulse'>SESSIA_AKTIV</p>
                                                    </div>

                                                    <div className='space-y-4'>
                                                        <div className='flex gap-2 overflow-x-auto no-scrollbar py-2'>
                                                            {['Hammasi', 'Ichimliklar', 'Energetiklar'].map(c => (
                                                                <button key={c} onClick={() => setBarCategory(c)} className={`cat-btn py-2 px-4 transition-all ${barCategory === c ? 'cat-btn-active scale-105' : 'cat-btn-inactive'}`}>{c}</button>
                                                            ))}
                                                        </div>
                                                        <div className='grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1'>
                                                            {inventory
                                                                .filter(p => barCategory === 'Hammasi' || p.category === barCategory)
                                                                .map(product => (
                                                                    <button
                                                                        key={product.id}
                                                                        onClick={() => {
                                                                            handleAddBar(activeModalRoom.id, product.price, product.name, product.id);
                                                                            if (window.Telegram?.WebApp?.HapticFeedback) {
                                                                                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                                                                            }
                                                                        }}
                                                                        className={`minimal-card p-3 flex flex-col items-center justify-between h-40 border-white/10 transition-all ${product.stock <= 0 ? 'opacity-20 grayscale cursor-not-allowed' : 'active:scale-95'}`}
                                                                    >
                                                                        <div className='w-20 h-20 mb-2'>
                                                                            <img src={product.image} alt="" className='w-full h-full object-contain' />
                                                                        </div>
                                                                        <div className='text-center'>
                                                                            <p className='text-[10px] font-bold uppercase truncate w-24'>{product.name}</p>
                                                                            <p className='text-[12px] font-black'>{product.price.toLocaleString()} UZS</p>
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    </div>

                                                    {/* Billing Breakdown - Compact HUD */}
                                                    <div className='bg-white/[0.02] border border-white/5 rounded-[22px] p-4 flex justify-between items-center'>
                                                        <div className='space-y-0.5'>
                                                            <p className='text-[8px] font-black tracking-[1.5px] opacity-20 uppercase'>UMUMIY_SUMMA</p>
                                                            <div className='flex items-baseline gap-1.5'>
                                                                <span className='text-3xl font-black italic tracking-tighter text-[#39ff14]'>
                                                                    {calculateCost(activeModalRoom, currentTime).toLocaleString()}
                                                                </span>
                                                                <span className='text-[9px] opacity-20 font-bold'>UZS</span>
                                                            </div>
                                                        </div>
                                                        <div className='text-right space-y-1 opacity-25'>
                                                            <div className='flex items-center gap-1.5 justify-end'>
                                                                <span className='text-[7px] font-bold uppercase'>Vaqt:</span>
                                                                <span className='text-[9px] font-black'>{(calculateCost(activeModalRoom, currentTime) - (activeModalRoom.sessionBarTotal || 0)).toLocaleString()}</span>
                                                            </div>
                                                            <div className='flex items-center gap-1.5 justify-end'>
                                                                <span className='text-[7px] font-bold uppercase'>Bar:</span>
                                                                <span className='text-[9px] font-black'>{(activeModalRoom.sessionBarTotal || 0).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleStopSession(activeModalRoom)}
                                                        className='w-full bg-[#ff00ff] text-white font-black py-5 rounded-[20px] uppercase tracking-[3px] text-[9px] shadow-[0_10px_30px_rgba(255,0,255,0.2)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
                                                    >
                                                        <div className='w-3 h-3 border border-white/40 rounded-[3px] flex items-center justify-center'>
                                                            <div className='w-1 h-1 bg-white rounded-full'></div>
                                                        </div>
                                                        Sessiyani Yakunlash
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='p-6 pt-0 space-y-6'>
                                                    <div className='py-8 flex flex-col items-center justify-center gap-4 relative'>
                                                        <div className='w-20 h-20 rounded-[28px] bg-white/[0.02] border border-white/5 flex items-center justify-center animate-pulse'>
                                                            <Monitor size={32} className='opacity-10' />
                                                        </div>
                                                        <div className='text-center space-y-1'>
                                                            <p className='text-[9px] font-bold tracking-[4px] opacity-20 uppercase'>STANTSIYA_BO'SH</p>
                                                            <p className='text-[10px] font-medium opacity-30'>Qabul uchun tayyor</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => { handleStartSession(activeModalRoom.id); setSelectedRoom(null); }}
                                                        className='w-full bg-[#39ff14] text-black font-black py-5 rounded-[20px] uppercase tracking-[5px] text-[10px] shadow-[0_10px_30px_rgba(57,255,20,0.2)] hover:brightness-110 active:scale-[0.98] transition-all'
                                                    >
                                                        ▶️ VAQTNI BOSHLASH
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                );
                            })()}
                        </AnimatePresence>

                        {/* Payment / Debt Modal */}
                        <AnimatePresence>
                            {isPaymentModalOpen && selectedRoom && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4'>
                                    <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className='premium-glass w-full max-w-sm p-6 space-y-6 border-white/5 bg-[#05050a]'>
                                        <div className='text-center space-y-1'>
                                            <div className='inline-block px-2.5 py-0.5 bg-[#39ff14]/10 rounded-full border border-[#39ff14]/20 mb-1'>
                                                <p className='text-[7px] font-black tracking-[2px] text-[#39ff14] uppercase'>TO'LOV_TERMINAL</p>
                                            </div>
                                            <h2 className='text-4xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]'>
                                                {sessionTotal.toLocaleString()}
                                                <span className='text-[10px] ml-1.5 opacity-20'>UZS</span>
                                            </h2>
                                        </div>

                                        <div className='space-y-4'>
                                            <div className='space-y-1.5'>
                                                <p className='text-[8px] font-black tracking-[1.5px] opacity-20 uppercase pl-1.5'>SUMMA_QABULI:</p>
                                                <input
                                                    placeholder='0.00'
                                                    className='input-luxury h-14 text-xl font-black italic text-[#39ff14] text-center'
                                                    value={paymentAmount}
                                                    onChange={e => setPaymentAmount(e.target.value)}
                                                    type='number'
                                                />
                                            </div>

                                            {Number(paymentAmount) < sessionTotal && (
                                                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className='space-y-3 p-4 bg-red-500/[0.02] border border-red-500/15 rounded-[18px]'>
                                                    <div className='flex items-center gap-1.5 mb-1'>
                                                        <Activity size={12} className='text-red-500/60' />
                                                        <p className='text-[9px] font-black tracking-[1.5px] text-red-500/60 uppercase'>QARZ_FAOL</p>
                                                    </div>
                                                    <input placeholder='KLIENT_NOMI' className='input-luxury-small h-10 bg-black/40 border-red-500/10' value={clientInfo.name} onChange={e => setClientInfo({ ...clientInfo, name: e.target.value })} />
                                                    <input placeholder='TEL_NUM' className='input-luxury-small h-10 bg-black/40 border-red-500/10' value={clientInfo.phone} onChange={e => setClientInfo({ ...clientInfo, phone: e.target.value })} />
                                                </motion.div>
                                            )}

                                            <button
                                                onClick={() => {
                                                    handleProcessPayment(selectedRoom, sessionTotal);
                                                    setSelectedRoom(null);
                                                }}
                                                className='w-full h-14 bg-[#39ff14] text-black font-black rounded-xl uppercase tracking-[3px] text-[10px] shadow-[0_8px_25px_rgba(57,255,20,0.2)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
                                            >
                                                TERMINALNI YOPISH <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Product Management Modal */}
                        <AnimatePresence>
                            {showAddProduct && (
                                <div className='modal-overlay !z-[1000]'>
                                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className='modal-content !max-w-[420px]'>
                                        <div className='flex justify-between items-center mb-8'>
                                            <h3 className='text-xl font-black uppercase tracking-widest'>{editingProduct ? 'Tahrirlash' : 'Yangi Mahsulot'}</h3>
                                            <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} className='w-10 h-10 rounded-full bg-white/5 flex items-center justify-center'><X size={20} /></button>
                                        </div>

                                        <div className='space-y-6'>
                                            <div className='grid grid-cols-2 gap-2'>
                                                {['Ichimliklar', 'Energetiklar', 'Gazaklar', 'Taomlar'].map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => editingProduct ? setEditingProduct({ ...editingProduct, category: c }) : setNewProduct({ ...newProduct, category: c })}
                                                        className={`py-3 rounded-xl border text-[10px] font-bold transition-all ${(editingProduct ? editingProduct.category === c : newProduct.category === c) ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 bg-white/[0.02]'}`}
                                                    >
                                                        {c}
                                                    </button>
                                                ))}
                                            </div>

                                            <input
                                                type="text"
                                                className='input-luxury-small !h-14'
                                                placeholder="Mahsulot nomi"
                                                value={editingProduct ? editingProduct.name : newProduct.name}
                                                onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, name: e.target.value }) : setNewProduct({ ...newProduct, name: e.target.value })}
                                            />

                                            <div className='grid grid-cols-2 gap-4'>
                                                <input
                                                    type="number"
                                                    className='input-luxury-small !h-14'
                                                    placeholder="Narxi"
                                                    value={editingProduct ? editingProduct.price : newProduct.price}
                                                    onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, price: Number(e.target.value) }) : setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                                />
                                                <input
                                                    type="number"
                                                    className='input-luxury-small !h-14'
                                                    placeholder="Soni"
                                                    value={editingProduct ? editingProduct.stock : newProduct.stock}
                                                    onChange={(e) => editingProduct ? setEditingProduct({ ...editingProduct, stock: Number(e.target.value) }) : setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                                                />
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (editingProduct) {
                                                        setInventory(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
                                                    } else {
                                                        const p = {
                                                            ...newProduct,
                                                            id: Date.now(),
                                                            image: newProduct.category === 'Ichimliklar' ? '/images/pepsi.png' :
                                                                newProduct.category === 'Energetiklar' ? '/images/energy.png' :
                                                                    newProduct.category === 'Gazaklar' ? '/images/chips.png' : '/images/sandwich.png'
                                                        };
                                                        setInventory(prev => [...prev, p]);
                                                    }
                                                    setShowAddProduct(false);
                                                    setEditingProduct(null);
                                                    setNewProduct({ name: '', price: '', stock: '', category: 'Ichimliklar', image: '/images/pepsi.png' });
                                                    if (window.Telegram?.WebApp?.HapticFeedback) {
                                                        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                                                    }
                                                }}
                                                className='btn-sell-minimal !h-16'
                                            >
                                                Saqlash
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        key='player' initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className='relative z-10 w-full h-screen p-12 flex flex-col items-center justify-center gap-12 max-w-sm mx-auto'
                    >
                        <div className='w-40 h-40 flex items-center justify-center relative'>
                            <div className='absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full'></div>
                            <div className='w-full h-full rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center float shadow-2xl'>
                                <ShieldCheck size={72} className='text-emerald-400' />
                            </div>
                        </div>
                        <div className='text-center space-y-3'>
                            <h2 className='text-3xl font-bold luxury-gradient-text tracking-tight'>Hush kelibsiz!</h2>
                            <p className='text-white/40 text-sm font-medium'>Sessiya muvaffaqiyatli ochildi</p>
                        </div>
                        <div className='premium-glass p-8 w-full text-center'>
                            <p className='text-[10px] text-white/30 uppercase tracking-[3px] font-bold mb-4'>Sizning ID raqamingiz</p>
                            <p className='text-3xl font-black syncopate tracking-widest text-glow'>{username.slice(0, 4).toUpperCase()}</p>
                        </div>
                        <button onClick={() => setView('login')} className='text-[10px] font-bold uppercase tracking-[4px] opacity-20 hover:opacity-100 transition-all'>Chiqish</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
