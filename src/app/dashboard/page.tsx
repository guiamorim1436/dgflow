'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Plus,
  Tv,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import confetti from 'canvas-confetti';
import { FINANCIAL_METRICS, INITIAL_TASKS } from '@/lib/store';

export default function DashboardPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [tvMode, setTvMode] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t
      )
    );
  };

  const triggerCelebrateSale = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e8363b', '#22c55e', '#3b82f6', '#ffffff'],
    });
  };

  if (tvMode) {
    return (
      <div className="fixed inset-0 z-50 bg-[#080808] text-white flex flex-col justify-between p-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e8363b] flex items-center justify-center font-extrabold text-2xl shadow-xl shadow-[#e8363b]/30">
              DG
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">Painel de Vendas em Tempo Real</h1>
              <p className="text-[#8e8e8e]">Exibição para TV / Segundo Monitor</p>
            </div>
          </div>
          <button
            onClick={() => setTvMode(false)}
            className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] rounded-xl text-sm font-medium transition-all"
          >
            Sair do Modo TV
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 my-auto">
          <div className="bg-[#121212] border border-[#222222] p-8 rounded-3xl flex flex-col justify-center items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#8e8e8e]">Faturamento do Mês</span>
            <span className="text-6xl font-black text-white mt-3">R$ 49.500</span>
            <span className="text-emerald-400 font-medium text-sm mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +28% vs mês anterior
            </span>
          </div>

          <div className="bg-[#121212] border border-[#222222] p-8 rounded-3xl flex flex-col justify-center items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#8e8e8e]">Meta Mensal</span>
            <span className="text-6xl font-black text-[#e8363b] mt-3">82.5%</span>
            <span className="text-[#8e8e8e] text-sm mt-2">Faltam apenas R$ 10.500</span>
          </div>

          <div className="bg-[#121212] border border-[#222222] p-8 rounded-3xl flex flex-col justify-center items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#8e8e8e]">Vendas Fechadas</span>
            <span className="text-6xl font-black text-white mt-3">14</span>
            <span className="text-emerald-400 font-medium text-sm mt-2">Ticket médio R$ 3.535</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[#1f1f1f]">
          <span className="text-sm text-[#666666]">DGFlow TV Engine · Atualização automática via WebSocket</span>
          <button
            onClick={triggerCelebrateSale}
            className="flex items-center gap-2 bg-[#e8363b] hover:bg-[#d42d32] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#e8363b]/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Comemorar Venda! 🎉
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Dashboard</h1>
          <p className="text-xs text-[#8e8e8e] mt-0.5">Visão geral do seu negócio e performance em tempo real</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTvMode(true)}
            className="flex items-center gap-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#222222] text-[#aaaaaa] hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Modo TV</span>
          </button>

          <button
            onClick={triggerCelebrateSale}
            className="flex items-center gap-1.5 bg-[#e8363b]/10 hover:bg-[#e8363b]/20 border border-[#e8363b]/30 text-[#e8363b] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simular Venda
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Meta de Receita */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-5 rounded-2xl flex flex-col justify-between hover:border-[#2b2b2b] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8e8e8e]">Meta de Receita</span>
            <div className="p-2 rounded-xl bg-[#e8363b]/10 text-[#e8363b]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-black text-white">82.5%</span>
              <span className="text-xs text-[#8e8e8e]">R$ 49.500 / R$ 60k</span>
            </div>
            <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#e8363b] to-[#ff6b6b] rounded-full" style={{ width: '82.5%' }}></div>
            </div>
            <span className="text-[11px] text-[#666666] mt-2 block">Faltam R$ 10.500 para a meta</span>
          </div>
        </div>

        {/* Card 2: Faturamento do Mês */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-5 rounded-2xl flex flex-col justify-between hover:border-[#2b2b2b] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8e8e8e]">Faturamento (Outubro)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white">R$ 49.500</span>
            <div className="flex items-center justify-between mt-2 text-[11px]">
              <span className="text-emerald-400 font-medium">Recebido: R$ 42.100</span>
              <span className="text-amber-400 font-medium">Pendente: R$ 7.400</span>
            </div>
          </div>
        </div>

        {/* Card 3: Novos Leads */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-5 rounded-2xl flex flex-col justify-between hover:border-[#2b2b2b] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8e8e8e]">Novos Leads</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">28</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14%
              </span>
            </div>
            <span className="text-[11px] text-[#666666] mt-2 block">12 aguardando primeiro contato</span>
          </div>
        </div>

        {/* Card 4: Clientes Fechados */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-5 rounded-2xl flex flex-col justify-between hover:border-[#2b2b2b] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#8e8e8e]">Clientes Fechados</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">14</span>
              <span className="text-xs font-semibold text-purple-400">Conversão de 50%</span>
            </div>
            <span className="text-[11px] text-[#666666] mt-2 block">Ticket médio R$ 3.535</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Chart + Daily Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column: Financial Chart (2 cols) */}
        <div className="lg:col-span-2 bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Análise Financeira Consolidada</h2>
              <p className="text-xs text-[#8e8e8e]">Evolução de faturamento e despesas operacionais nos últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e8363b]"></span>
                <span className="text-[#8e8e8e]">Receita</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                <span className="text-[#8e8e8e]">Despesas</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FINANCIAL_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="receitaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8363b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e8363b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="despesaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
                <XAxis dataKey="month" stroke="#666666" fontSize={11} tickLine={false} />
                <YAxis stroke="#666666" fontSize={11} tickLine={false} tickFormatter={(v) => `R$${v/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#171717',
                    borderColor: '#2b2b2b',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#ffffff',
                  }}
                  formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
                />
                <Area type="monotone" dataKey="receita" stroke="#e8363b" strokeWidth={2.5} fillOpacity={1} fill="url(#receitaGrad)" />
                <Area type="monotone" dataKey="despesas" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#despesaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Daily Tasks (1 col) */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Tarefas de Hoje</h2>
              <p className="text-xs text-[#8e8e8e]">Seu foco prioritário para o dia</p>
            </div>
            <span className="text-xs bg-[#1a1a1a] text-[#8e8e8e] px-2 py-0.5 rounded-md font-medium">
              {tasks.filter(t => t.status === 'done').length}/{tasks.length}
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {tasks.map((task) => {
              const isDone = task.status === 'done';
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isDone
                      ? 'bg-[#0f0f0f] border-[#1a1a1a] opacity-50'
                      : 'bg-[#171717] border-[#222222] hover:border-[#333333]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                      isDone ? 'bg-[#e8363b] border-[#e8363b]' : 'border-[#444444] bg-[#1a1a1a]'
                    }`}
                  >
                    {isDone && <Check className="w-3 h-3 text-white" />}
                  </div>

                  <div className="flex-1">
                    <p className={`text-xs font-medium text-white ${isDone ? 'line-through text-[#8e8e8e]' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="text-[#8e8e8e]">{task.client_name}</span>
                      <span className="text-[#444444]">·</span>
                      <span className={task.priority === 'urgent' ? 'text-red-400 font-semibold' : 'text-[#8e8e8e]'}>
                        {task.due_date}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="mt-4 w-full py-2 bg-[#1a1a1a] hover:bg-[#222222] text-[#aaaaaa] hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#222222]">
            <Plus className="w-3.5 h-3.5" />
            Adicionar Tarefa
          </button>
        </div>
      </div>
    </AppShell>
  );
}
