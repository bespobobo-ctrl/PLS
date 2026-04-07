import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }
  }, []);

  return (
    <div className='min-h-screen relative bg-black text-white font-sans overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <img src='/bg.png' className='w-full h-full object-cover opacity-80' alt='BG' />
        <div className='absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent'></div>
      </div>
      <div className='relative z-10 flex flex-col justify-end p-8 pb-16 min-h-screen'>
        <h1 className='text-5xl font-black text-cyan-400 mb-2'>PLS GAME</h1>
        <p className='text-xs text-slate-400 mb-12 tracking-widest'>The ultimate gaming experience</p>
        <button className='w-full py-5 bg-cyan-400 text-black font-black rounded-3xl mb-4 shadow-lg shadow-cyan-500/20'>Sign In</button>
        <button className='w-full py-5 border-2 border-white/20 backdrop-blur-md rounded-3xl font-black'>Sign Up</button>
      </div>
    </div>
  );
}
export default App;