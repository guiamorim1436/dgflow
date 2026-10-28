'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  DollarSign,
  Bot,
  Settings,
  Sparkles,
  ChevronRight,
  PlusCircle,
  Tv,
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads & Funis', href: '/leads', icon: Users2, badge: '5' },
    { label: 'Calendário de Posts', href: '/content-calendar', icon: CalendarDays },
    { label: 'Aprovações', href: '/aprovar/demo-bella', icon: CheckCircle2, badge: 'Público' },
    { label: 'WhatsApp', href: '/whatsapp', icon: MessageSquare, badge: 'Online' },
    { label: 'Financeiro', href: '/finance', icon: DollarSign },
    { label: 'Agentes de IA', href: '/ai-agents', icon: Bot, isBeta: true },
    { label: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-[#0d0d0d] border-r border-[#1f1f1f] flex flex-col transition-all duration-200 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 border-b border-[#1f1f1f] gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e8363b] to-[#ff6b6b] flex items-center justify-center font-bold text-white shadow-lg shadow-[#e8363b]/20">
          DG
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              DGFlow <span className="text-[10px] font-medium bg-[#1f1f1f] text-[#8e8e8e] px-1.5 py-0.5 rounded">CRM</span>
            </span>
            <span className="text-[11px] text-[#8e8e8e]">Marketing & Gestão</span>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="p-3">
        <Link
          href="/leads?action=new"
          className="w-full flex items-center justify-center gap-2 bg-[#e8363b] hover:bg-[#d42d32] text-white py-2.5 px-3 rounded-xl font-medium text-sm transition-all shadow-md shadow-[#e8363b]/20 hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          {!collapsed && <span>Nova Venda / Lead</span>}
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[#666666] px-3 py-1">
          {!collapsed && 'Navegação'}
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#1a1a1a] text-white font-semibold border border-[#2b2b2b]'
                  : 'text-[#9e9e9e] hover:bg-[#141414] hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#e8363b]' : 'text-[#8e8e8e]'}`} />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        item.badge === 'Online'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-[#222222] text-[#bbbbbb]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.isBeta && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold bg-[#e8363b]/10 text-[#e8363b] border border-[#e8363b]/20">
                      BETA
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Banner - TV Mode & AI Credits */}
      {!collapsed && (
        <div className="p-3 border-t border-[#1f1f1f] space-y-2">
          <div className="bg-[#141414] border border-[#222222] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e8363b]" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">Créditos de IA</span>
                <span className="text-[10px] text-[#8e8e8e]">BYOK Ativo (Gemini)</span>
              </div>
            </div>
            <span className="text-xs font-bold text-white bg-[#1f1f1f] px-2 py-0.5 rounded-md">∞</span>
          </div>

          <Link
            href="/dashboard?view=tv"
            className="flex items-center justify-center gap-2 text-xs text-[#8e8e8e] hover:text-white py-2 hover:bg-[#141414] rounded-lg transition-colors"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Modo TV (Painel de Vendas)</span>
          </Link>
        </div>
      )}
    </aside>
  );
}
