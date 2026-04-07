import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [view, setView] = useState('login');

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className='min-h-screen relative bg-black text-white font-sans overflow-hidden'>
      {/* 🏞️ Real Background Image (The one you provided) */}
      <div className='fixed inset-0 z-0'>
        <img src='/bg.png' className='w-full h-full object-cover' alt='Gaming Club BG' />
        <div className='bg-overlay'></div>
      </div>

      <AnimatePresence mode='wait'>
        {view === 'login' ? (
          <motion.div 
            key='login'
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className='relative z-10 w-full h-screen flex flex-col justify-between p-7 pb-12'
          >
            {/* Header */}
            <div className='flex justify-between items-center opacity-80 mt-2'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 rounded-full bg-cyan-400 neon-glow'></div>
                <span className='unbounded text-[10px] tracking-[4px] uppercase font-bold text-slate-100'>PLS KOKAND</span>
              </div>
              <button className='px-4 py-2 bg-white/5 backdrop-blur-md rounded-2xl text-[9px] uppercase font-bold tracking-widest border border-white/5'>Skip</button>
            </div>

            {/* Main Login Form Overlay */}
            <div className='mb-6'>
              <div className='flex flex-col gap-2 mb-10'>
                 <h2 className='text-5xl font-black italic unbounded tracking-tighter leading-none'>ENTER THE
                    <span className='block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-green-400'> ARENA</span>
                 </h2>
                 <p className='text-slate-400 text-xs tracking-tight ml-1 font-medium opacity-60'>Log in to access your PLS Game Club console</p>
              </div>

              <div className='glass p-8 flex flex-col gap-6 border-t-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]'>
                 <div className='space-y-4'>
                    <Input icon='👤' placeholder='Username' />
                    <Input icon='🔒' placeholder='Password' type='password' />
                 </div>
                 <motion.button 
                    whileTap={{ scale: 0.96 }}
                    className='w-full py-5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black font-black rounded-2xl text-xs uppercase tracking-widest shadow-[0_15px_30px_-10px_rgba(34,211,238,0.4)]'
                 >
                    Sign In Now
                 </motion.button>
                 <div className='flex justify-between items-center px-1'>
                    <span className='text-[11px] text-slate-500 font-bold'>New Player?
                       <span className='text-slate-300 ml-1'>Register</span>
                    </span>
                    <span className='text-[11px] text-slate-500 font-bold'>Forgot?</span>
                 </div>
              </div>
            </div>
          </motion.div>
        ) : (
           <div className='p-8'>Admin Dashboard...</div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ icon, placeholder, type = 'text' }) {
  return (
    <div className='relative group'>
      <div className='absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg'>{icon}</div>
      <input 
        type={type}
        placeholder={placeholder}
        className='w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:border-cyan-400/50 focus:bg-white/10 transition-all'
      />
    </div>
  );
}

export default App;