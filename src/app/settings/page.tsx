'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Settings,
  CreditCard,
  MessageSquare,
  Calendar,
  FolderGit2,
  Share2,
  ShieldCheck,
  Check,
  Plus,
  ExternalLink,
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  connected: boolean;
  badge?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'asaas',
    name: 'Asaas Pagamentos',
    category: 'Financeiro',
    description: 'Emissão automática de cobranças via Pix, boleto bancário e cartão de crédito com baixa imediata.',
    connected: true,
    badge: 'Ativo',
  },
  {
    id: 'mercadopago',
    name: 'Mercado Pago',
    category: 'Financeiro',
    description: 'Checkout transparente e links de pagamento para propostas e assinaturas recorrentes.',
    connected: false,
  },
  {
    id: 'evolution',
    name: 'WhatsApp (Evolution API)',
    category: 'Comunicação',
    description: 'Conexão multi-número com leitura de QR Code, disparo em lote e sincronização de mensagens.',
    connected: true,
    badge: 'Conectado',
  },
  {
    id: 'mcp',
    name: 'Conector MCP (Claude / ChatGPT)',
    category: 'Inteligência Artificial',
    description: 'Permite que assistentes como Claude Desktop operem o CRM, movam leads e criem tarefas por comando de voz.',
    connected: true,
    badge: 'MCP Ativo',
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar & Agenda',
    category: 'Produtividade',
    description: 'Sincronização bidirecional de reuniões com clientes e agendamento online público.',
    connected: true,
    badge: 'Sincronizado',
  },
  {
    id: 'google-drive',
    name: 'Google Drive & Dropbox',
    category: 'Armazenamento',
    description: 'Vincula pastas automáticas para cada cliente para salvar vídeos e imagens em alta definição.',
    connected: false,
  },
  {
    id: 'meta',
    name: 'Meta Ads & Instagram Direct',
    category: 'Marketing',
    description: 'Agendamento direto no Instagram/Facebook e rastreamento de conversões via Pixel CAPI.',
    connected: true,
    badge: 'API v21',
  },
];

export default function SettingsPage() {
  const [integrationsList, setIntegrationsList] = useState(INTEGRATIONS);

  const toggleConnection = (id: string) => {
    setIntegrationsList(prev =>
      prev.map(item =>
        item.id === id ? { ...item, connected: !item.connected, badge: !item.connected ? 'Ativo' : undefined } : item
      )
    );
  };

  return (
    <AppShell>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Configurações & Integrações</h1>
          <p className="text-xs text-[#8e8e8e]">Gerencie conexões de pagamento, WhatsApp, IA e provedores</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] border border-[#2b2b2b] flex items-center justify-center font-black text-lg text-white">
            LA
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Lucas Amorim</h2>
            <p className="text-xs text-[#8e8e8e]">lgajspfc@gmail.com · Administrador Principal</p>
            <span className="inline-block mt-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold">
              Ambiente de Produção Conectado
            </span>
          </div>
        </div>

        <button className="bg-[#1a1a1a] hover:bg-[#222222] border border-[#2b2b2b] text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors">
          Editar Perfil
        </button>
      </div>

      {/* Integrations Grid */}
      <h2 className="text-base font-bold text-white mb-4">Conexões Ativas e Disponíveis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrationsList.map((item) => (
          <div
            key={item.id}
            className="bg-[#121212] border border-[#1f1f1f] hover:border-[#2b2b2b] p-5 rounded-2xl flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider">
                  {item.category}
                </span>
                {item.badge && (
                  <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{item.name}</h3>
              <p className="text-xs text-[#8e8e8e] leading-relaxed mb-4">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-[#1a1a1a] flex items-center justify-between">
              <span className="text-[11px] text-[#666666]">
                Status: {item.connected ? 'Configurado e operacional' : 'Desconectado'}
              </span>
              <button
                onClick={() => toggleConnection(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  item.connected
                    ? 'bg-[#181818] text-[#aaaaaa] border-[#262626] hover:bg-[#202020]'
                    : 'bg-[#e8363b] hover:bg-[#d42d32] text-white border-transparent shadow-sm'
                }`}
              >
                {item.connected ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
