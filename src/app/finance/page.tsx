'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  QrCode,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';

interface Transaction {
  id: string;
  payer: string;
  description: string;
  amount: number;
  type: 'receita' | 'despesa';
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  method: 'pix' | 'boleto' | 'card';
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't-1',
    payer: 'Bella Estética Integrada',
    description: 'Gestão de Tráfego e Social Media (Mensalidade)',
    amount: 2500,
    type: 'receita',
    dueDate: '2026-10-30',
    status: 'pending',
    method: 'pix',
  },
  {
    id: 't-2',
    payer: 'Clínica Almeida',
    description: 'Contrato Semestral - Entrada 50%',
    amount: 4800,
    type: 'receita',
    dueDate: '2026-10-25',
    status: 'paid',
    method: 'pix',
  },
  {
    id: 't-3',
    payer: 'Arte Nobre Móveis',
    description: 'Desenvolvimento de Website + Identidade Visual',
    amount: 3600,
    type: 'receita',
    dueDate: '2026-10-20',
    status: 'paid',
    method: 'card',
  },
  {
    id: 't-4',
    payer: 'Meta Ads Plataforma',
    description: 'Fatura Anúncios em Conta de Gestão',
    amount: 1450,
    type: 'despesa',
    dueDate: '2026-10-28',
    status: 'paid',
    method: 'card',
  },
  {
    id: 't-5',
    payer: 'Adobe Creative Cloud',
    description: 'Assinatura Equipe Criativa',
    amount: 480,
    type: 'despesa',
    dueDate: '2026-11-05',
    status: 'pending',
    method: 'card',
  },
];

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<'geral' | 'receber' | 'pagar'>('geral');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [payer, setPayer] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'receita' | 'despesa'>('receita');
  const [dueDate, setDueDate] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payer || !amount) return;

    const newTx: Transaction = {
      id: `t-${Date.now()}`,
      payer,
      description,
      amount: parseFloat(amount),
      type,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      status: 'pending',
      method: 'pix',
    };

    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    setPayer('');
    setDescription('');
    setAmount('');
  };

  const totalReceitas = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => acc + t.amount, 0);

  const lucroLiquido = totalReceitas - totalDespesas;

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'receber') return t.type === 'receita';
    if (activeTab === 'pagar') return t.type === 'despesa';
    return true;
  });

  return (
    <AppShell>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Financeiro & Faturamento</h1>
          <p className="text-xs text-[#8e8e8e]">Controle de entradas, saídas, emissão Asaas e conciliação de caixa</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#e8363b] hover:bg-[#d42d32] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-[#e8363b]/20 transition-all hover:scale-105"
        >
          <Plus className="w-3.5 h-3.5" />
          Lançar Cobrança / Despesa
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#121212] border border-[#1f1f1f] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#8e8e8e] block mb-1">Contas a Receber</span>
            <span className="text-2xl font-black text-emerald-400">
              R$ {totalReceitas.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-[#666666] block mt-1">Total de receitas previstas</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121212] border border-[#1f1f1f] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#8e8e8e] block mb-1">Contas a Pagar</span>
            <span className="text-2xl font-black text-rose-400">
              R$ {totalDespesas.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-[#666666] block mt-1">Custos e despesas fixas</span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#121212] border border-[#1f1f1f] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#8e8e8e] block mb-1">Lucro Líquido Previsto</span>
            <span className="text-2xl font-black text-white">
              R$ {lucroLiquido.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-emerald-400 block mt-1">Margem operacional de 84%</span>
          </div>
          <div className="p-3 bg-[#e8363b]/10 text-[#e8363b] rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-[#1f1f1f] pb-3">
          <button
            onClick={() => setActiveTab('geral')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'geral' ? 'bg-[#e8363b] text-white' : 'text-[#8e8e8e] hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('receber')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'receber' ? 'bg-[#e8363b] text-white' : 'text-[#8e8e8e] hover:text-white'
            }`}
          >
            A Receber
          </button>
          <button
            onClick={() => setActiveTab('pagar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'pagar' ? 'bg-[#e8363b] text-white' : 'text-[#8e8e8e] hover:text-white'
            }`}
          >
            A Pagar
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-[#666666] uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Cliente / Fornecedor</th>
                <th className="pb-3 font-semibold">Descrição</th>
                <th className="pb-3 font-semibold">Vencimento</th>
                <th className="pb-3 font-semibold">Método</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#141414] transition-colors">
                  <td className="py-3.5 font-bold text-white">{tx.payer}</td>
                  <td className="py-3.5 text-[#8e8e8e]">{tx.description}</td>
                  <td className="py-3.5 text-[#aaaaaa]">
                    {new Date(tx.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3.5">
                    <span className="bg-[#1c1c1c] text-[#bbbbbb] px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-[#2b2b2b]">
                      {tx.method}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        tx.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : tx.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {tx.status === 'paid' ? 'Recebido' : tx.status === 'pending' ? 'Pendente' : 'Vencido'}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 text-right font-bold text-sm ${
                      tx.type === 'receita' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'receita' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2b2b2b] rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f1f1f] mb-4">
              <h2 className="text-base font-bold text-white">Novo Lançamento Financeiro</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8e8e8e] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Tipo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('receita')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      type === 'receita'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                        : 'bg-[#1a1a1a] text-[#8e8e8e] border-[#262626]'
                    }`}
                  >
                    Receita (Receber)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('despesa')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                      type === 'despesa'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500'
                        : 'bg-[#1a1a1a] text-[#8e8e8e] border-[#262626]'
                    }`}
                  >
                    Despesa (Pagar)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Cliente ou Fornecedor *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Bella Estética"
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#262626] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex.: Mensalidade de Gestão"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#262626] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Valor (R$) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#262626] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Vencimento</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#262626] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1f1f1f]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#8e8e8e] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#e8363b] hover:bg-[#d42d32] text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
