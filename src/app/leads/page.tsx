'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  Phone,
  Building,
  Tag,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
} from 'lucide-react';
import { INITIAL_LEADS } from '@/lib/store';
import { Lead } from '@/lib/types';

const STAGES = [
  { id: 'novo', name: 'Novo Lead', color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
  { id: 'contato', name: 'Primeiro Contato', color: 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' },
  { id: 'proposta', name: 'Proposta Enviada', color: 'border-purple-500/40 text-purple-400 bg-purple-500/10' },
  { id: 'negociacao', name: 'Negociação', color: 'border-orange-500/40 text-orange-400 bg-orange-500/10' },
  { id: 'fechado', name: 'Fechado (Ganho)', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
] as const;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newTags, setNewTags] = useState('Tráfego Pago, Social Media');

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      customer_name: newName,
      company: newCompany || 'Empresa Própria',
      phone: newPhone || '(11) 90000-0000',
      value: parseFloat(newValue) || 0,
      stage_id: 'novo',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
    };

    setLeads([newLead, ...leads]);
    setIsModalOpen(false);
    setNewName('');
    setNewCompany('');
    setNewPhone('');
    setNewValue('');
  };

  const moveStage = (leadId: string, direction: 'prev' | 'next') => {
    const stageIds: Lead['stage_id'][] = ['novo', 'contato', 'proposta', 'negociacao', 'fechado'];
    setLeads(prev =>
      prev.map(l => {
        if (l.id !== leadId) return l;
        const currentIndex = stageIds.indexOf(l.stage_id);
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < stageIds.length) {
          return { ...l, stage_id: stageIds[nextIndex] };
        }
        return l;
      })
    );
  };

  const filteredLeads = leads.filter(
    l =>
      l.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(search.toLowerCase())) ||
      (l.tags && l.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <AppShell>
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Leads & Funil de Vendas</h1>
          <p className="text-xs text-[#8e8e8e]">Gerencie suas negociações e pipeline comercial</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar lead ou tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#141414] border border-[#222222] focus:border-[#e8363b] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#666666] outline-none transition-all w-52 md:w-64"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#e8363b] hover:bg-[#d42d32] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-[#e8363b]/20 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Lead
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 items-start">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter(l => l.stage_id === stage.id);
          const totalValue = stageLeads.reduce((acc, l) => acc + l.value, 0);

          return (
            <div
              key={stage.id}
              className="w-72 flex-shrink-0 bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-3 flex flex-col max-h-[calc(100vh-220px)]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${stage.color}`}>
                    {stage.name}
                  </span>
                  <span className="text-xs font-medium text-[#666666]">({stageLeads.length})</span>
                </div>
                <span className="text-xs font-bold text-white">
                  R$ {totalValue.toLocaleString('pt-BR')}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {stageLeads.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#555555] border border-dashed border-[#1a1a1a] rounded-xl">
                    Nenhum lead nesta etapa
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-[#141414] hover:bg-[#181818] border border-[#222222] hover:border-[#333333] p-3.5 rounded-xl transition-all shadow-sm flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-bold text-white leading-tight">
                          {lead.customer_name}
                        </h3>
                        <span className="text-xs font-bold text-emerald-400">
                          R$ {lead.value.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      {lead.company && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8e8e8e]">
                          <Building className="w-3 h-3 text-[#666666]" />
                          <span>{lead.company}</span>
                        </div>
                      )}

                      {lead.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-[#8e8e8e]">
                          <Phone className="w-3 h-3 text-[#666666]" />
                          <span>{lead.phone}</span>
                        </div>
                      )}

                      {lead.tags && lead.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] bg-[#1f1f1f] text-[#aaaaaa] px-1.5 py-0.5 rounded font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Move Stage Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#1c1c1c] text-[10px]">
                        <button
                          disabled={stage.id === 'novo'}
                          onClick={() => moveStage(lead.id, 'prev')}
                          className="flex items-center gap-0.5 text-[#666666] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <ChevronLeft className="w-3 h-3" /> Voltar
                        </button>
                        <button
                          disabled={stage.id === 'fechado'}
                          onClick={() => moveStage(lead.id, 'next')}
                          className="flex items-center gap-0.5 text-[#e8363b] hover:text-[#ff6b6b] font-semibold disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          Avançar <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#2b2b2b] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1f1f1f] mb-4">
              <h2 className="text-base font-bold text-white">Criar Novo Lead</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8e8e8e] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Nome do Cliente / Responsável *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex.: Juliana Paes"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#171717] border border-[#222222] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Nome da Empresa</label>
                <input
                  type="text"
                  placeholder="Ex.: Studio Estética"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-[#171717] border border-[#222222] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#aaaaaa] mb-1">WhatsApp</label>
                  <input
                    type="text"
                    placeholder="(11) 90000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#171717] border border-[#222222] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-[#171717] border border-[#222222] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#aaaaaa] mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Tráfego, Social Media, Site"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-[#171717] border border-[#222222] focus:border-[#e8363b] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#1f1f1f]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#8e8e8e] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#e8363b] hover:bg-[#d42d32] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-[#e8363b]/20"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
