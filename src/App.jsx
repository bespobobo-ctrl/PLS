import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, Gamepad2, ShieldCheck, Zap, Headphones } from 'lucide-react';

function App() {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 100 } }
  };

  return (
    <div className='min-h-screen relative bg-[#050210] text-white font-outfit overflow-hidden selection:bg-pls-cyan/30'>
      <div className='fixed inset-0 z-0 overflow-hidden'>
        <img src='/club-v2.png' className='w-full h-full object-cover scale-[1.05] blur-[1px]' alt='Gaming Club BG' />
        <div className='bg-overlay fixed inset-0 z-0 bg-gradient-to-b from-[#050210]/40 via-[#050210]/75 to-[#050210]'></div>
        <div className='mesh-gradient'></div>
        <div className='particle w-[300px] h-[300px] top-[-100px] right-[-100px]'></div>
        <div className='particle w-[200px] h-[200px] bottom-[100px] left-[-100px] bg-pls-purple'></div>
      </div>

      <motion.div 
        variants={containerVariants} initial='hidden' animate='visible'
        className='relative z-10 w-full h-screen flex flex-col justify-between p-8 pb-14 max-w-lg mx-auto'
      >
        <motion.div variants={itemVariants} className='flex justify-between items-center opacity-90'>
          <div className='flex items-center gap-3 group'>
             <div className='w-11 h-11 glass-card flex items-center justify-center border-white/20 transition-transform group-hover:rotate-12'>
                <Gamepad2 size={22} className='text-pls-cyan' />
             </div>
             <div className='flex flex-col'>
                <span className='unbounded text-[15px] leading-none font-black tracking-[5px] text-white uppercase'>PLS</span>
                <span className='text-[10px] text-pls-cyan font-black uppercase tracking-[3px] leading-none mt-1'>Kokand</span>
             </div>
          </div>
          <div className='flex items-center gap-2 px-4 py-2.5 glass-card border-white/5 active:scale-95 transition-transform'>
             <ShieldCheck size={14} className='text-emerald-400' />
             <span className='text-[10px] font-black uppercase tracking-widest text-emerald-400/90'>Secured</span>
          </div>
        </motion.div>

        <div className='mb-4'>
           <motion.div variants={itemVariants} className='flex flex-col gap-3 mb-10 text-center'>
              <h2 className='text-7xl font-black italic unbounded tracking-[-3px] leading-none uppercase'>
                 <span className='block text-transparent bg-clip-text bg-gradient-to-r from-[#ff3c41] via-[#9d3cff] to-[#00f2ff] drop-shadow-2xl'>ARENA</span>
              </h2>
              <p className='text-slate-400 text-[11px] tracking-widest uppercase font-black opacity-50 flex items-center justify-center gap-2'>
                <Zap size={10} className='text-pls-cyan' /> Welcome back, Player
              </p>
           </motion.div>

           <motion.div variants={itemVariants} className='glass-card p-10 flex flex-col gap-8'>
              <div className='space-y-4'>
                 <div className='relative group'>
                    <div className='absolute left-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-pls-cyan transition-all duration-300'>
                       <User size={19} />
                    </div>
                    <input 
                       type='text' placeholder='Username'
                       className='w-full bg-white/[0.04] border border-white/5 rounded-[26px] py-5 px-6 pl-14 text-[13px] font-bold focus:outline-none focus:border-pls-cyan/40 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700' 
                    />
                 </div>

                 <div className='relative group'>
                    <div className='absolute left-5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 group-focus-within:text-pls-cyan transition-all duration-300'>
                       <Lock size={18} />
                    </div>
                    <input 
                       type='password' placeholder='Password'
                       className='w-full bg-white/[0.04] border border-white/5 rounded-[26px] py-5 px-6 pl-14 text-[13px] font-bold focus:outline-none focus:border-pls-cyan/40 focus:bg-white/[0.08] transition-all text-white placeholder:text-slate-700' 
                    />
                 </div>
              </div>

              <div className='flex flex-col gap-6 items-center'>
                 <motion.button 
                    whileTap={{ scale: 0.94 }}
                    className='group relative w-full py-5.5 bg-gradient-to-r from-[#00f2ff] to-[#9d3cff] text-black font-black rounded-[28px] text-[13px] uppercase tracking-[4px] shadow-[0_20px_60px_-15px_rgba(0,242,255,0.35)] overflow-hidden transition-all hover:brightness-110'
                 >
                    <span className='relative z-10 flex items-center justify-center gap-3'>
                       Join Arena <ArrowRight size={20} className='group-hover:translate-x-1 transition-transform'/>
                    </span>
                    <div className='absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out'></div>
                 </motion.button>
                 
                 <button className='flex items-center gap-2.5 text-[11px] text-slate-500 font-black uppercase tracking-[3px] hover:text-white transition-all active:scale-95 group'>
                    <Headphones size={14} className='group-hover:rotate-12 transition-transform'/>
                    Contact Administrator
                 </button>
              </div>
           </motion.div>
        </div>

        <motion.div variants={itemVariants} className='flex justify-center flex-col items-center gap-4 opacity-40 mt-4'>
           <div className='w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent'></div>
           <span className='text-[10px] font-black uppercase tracking-[5px] text-slate-500'>2024 © PLS GAME NETWORK</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;