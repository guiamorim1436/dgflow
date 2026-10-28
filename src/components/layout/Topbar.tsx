'use client';

import React, { useState } from 'react';
import { Search, Bell, Eye, EyeOff, Sparkles } from 'lucide-react';

interface TopbarProps {
  onSearchOpen?: () => void;
}

export function Topbar({ onSearchOpen }: TopbarProps) {
  const [hideValues, setHideValues] = useState(false);

  return (
    <header className="h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1f1f1f] sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 bg-[#141414] border border-[#222222] hover:border-[#333333] px-3.5 py-1.5 rounded-xl text-xs text-[#8e8e8e] transition-all w-64 md:w-80 text-left cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#666666]" />
          <span className="flex-1">Buscar clientes, leads, tarefas...</span>
          <kbd className="bg-[#1f1f1f] text-[#666666] text-[10px] px-1.5 py-0.5 rounded font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Financial Quick Glance & User Meta */}
      <div className="flex items-center gap-4">
        {/* Revenue Progress */}
        <div className="hidden lg:flex items-center gap-3 bg-[#121212] border border-[#1f1f1f] px-3.5 py-1.5 rounded-xl">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-medium text-[#8e8e8e] uppercase tracking-wider">Faturamento Outubro</span>
            <span className="text-xs font-bold text-white">
              {hideValues ? '••••••••' : 'R$ 49.500'}{' '}
              <span className="text-[11px] font-normal text-[#666666]">/ R$ 60.000</span>
            </span>
          </div>

          <button
            onClick={() => setHideValues(!hideValues)}
            title={hideValues ? 'Mostrar valores' : 'Ocultar valores'}
            className="text-[#666666] hover:text-[#aaaaaa] transition-colors p-1"
          >
            {hideValues ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-[#8e8e8e] hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-[#222222] rounded-xl transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e8363b]"></span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#1f1f1f]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-[#333333] flex items-center justify-center font-bold text-xs text-white">
            LA
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-white">Lucas Amorim</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Pro Anual
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
