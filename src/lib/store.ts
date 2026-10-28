'use client';

import { Lead, ContentItem, Task, FinancialMetric, WhatsAppContact, WhatsAppMessage } from './types';

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    customer_name: 'Studio Estética Bella',
    email: 'contato@studiabella.com.br',
    phone: '(11) 98765-4321',
    company: 'Bella Estética Integrada',
    stage_id: 'novo',
    value: 2500,
    tags: ['Instagram', 'Tráfego Pago'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'lead-2',
    customer_name: 'Dr. Roberto Almeida',
    email: 'roberto@almeidamed.com.br',
    phone: '(11) 99123-8877',
    company: 'Clínica Almeida',
    stage_id: 'contato',
    value: 4800,
    tags: ['Branding', 'Social Media'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'lead-3',
    customer_name: 'Marcenaria Arte Nobre',
    email: 'vendas@artenobre.com.br',
    phone: '(19) 98111-2233',
    company: 'Arte Nobre Móveis',
    stage_id: 'proposta',
    value: 3600,
    tags: ['Site Institucional'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'lead-4',
    customer_name: 'Restaurante Sabor & Raiz',
    email: 'adm@saboreraiz.com.br',
    phone: '(21) 97766-5544',
    company: 'Grupo Gastronômico Raiz',
    stage_id: 'negociacao',
    value: 6000,
    tags: ['Contrato Anual', 'Tráfego'],
    created_at: new Date().toISOString(),
  },
  {
    id: 'lead-5',
    customer_name: 'TechFlow Soluções',
    email: 'contato@techflow.io',
    phone: '(31) 98444-1234',
    company: 'TechFlow Corp',
    stage_id: 'fechado',
    value: 8500,
    tags: ['Fechado', 'Recorrência'],
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_POSTS: ContentItem[] = [
  {
    id: 'post-1',
    title: 'Carrossel: 5 Erros que impedem seu negócio de escalar no digital',
    client_name: 'Bella Estética Integrada',
    format: 'carousel',
    copy_text: 'Você trabalha o dia inteiro mas sente que os clientes não aumentam? Veja este carrossel até o fim e descubra o gargalo invisível que trava seu faturamento.',
    current_step_id: 'aprovacao',
    scheduled_date: '2026-10-30T18:00:00Z',
    attachments: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'],
    approval_token: 'token-bella-carousel-01',
    status: 'Aguardando Aprovação',
  },
  {
    id: 'post-2',
    title: 'Reels: Bastidores do novo consultório do Dr. Roberto',
    client_name: 'Clínica Almeida',
    format: 'reels',
    copy_text: 'A tecnologia a favor da sua saúde. Confira em primeira mão os novos equipamentos que chegaram nesta semana.',
    current_step_id: 'design',
    scheduled_date: '2026-11-01T12:00:00Z',
    attachments: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'],
    approval_token: 'token-almeida-reels-02',
    status: 'Em Produção',
  },
  {
    id: 'post-3',
    title: 'Feed Estático: Nova Coleção de Madeiras Maciças',
    client_name: 'Arte Nobre Móveis',
    format: 'feed',
    copy_text: 'O luxo da madeira de demolição transformada em arte sob medida para a sua sala de jantar.',
    current_step_id: 'agendado',
    scheduled_date: '2026-11-02T19:30:00Z',
    attachments: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800'],
    approval_token: 'token-arte-feed-03',
    status: 'Agendado no Meta',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Ajustar copy do carrossel com observações do cliente',
    client_name: 'Bella Estética',
    priority: 'high',
    status: 'todo',
    due_date: 'Hoje, 17:00',
  },
  {
    id: 'task-2',
    title: 'Subir criativos da campanha no Gerenciador de Anúncios Meta',
    client_name: 'TechFlow',
    priority: 'urgent',
    status: 'in_progress',
    due_date: 'Hoje, 18:30',
  },
  {
    id: 'task-3',
    title: 'Emitir cobrança Asaas do fechamento mensal',
    client_name: 'Arte Nobre',
    priority: 'medium',
    status: 'done',
    due_date: 'Concluído',
  },
];

export const FINANCIAL_METRICS: FinancialMetric[] = [
  { month: 'Mai', receita: 18500, despesas: 4200 },
  { month: 'Jun', receita: 22400, despesas: 5100 },
  { month: 'Jul', receita: 28900, despesas: 6300 },
  { month: 'Ago', receita: 34200, despesas: 7800 },
  { month: 'Set', receita: 41800, despesas: 8500 },
  { month: 'Out', receita: 49500, despesas: 9200 },
];

export const INITIAL_CONTACTS: WhatsAppContact[] = [
  {
    id: 'w-1',
    name: 'Dra. Camila - Bella Estética',
    phone: '+55 11 98765-4321',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    last_message_text: 'Adorei a arte do post! Já posso aprovar pelo link?',
    last_message_at: '10:42',
    unread_count: 1,
  },
  {
    id: 'w-2',
    name: 'Dr. Roberto Almeida',
    phone: '+55 11 99123-8877',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    last_message_text: 'Consegue me enviar o contrato atualizado em PDF?',
    last_message_at: '09:15',
    unread_count: 0,
  },
  {
    id: 'w-3',
    name: 'Carlos - Marcenaria Arte Nobre',
    phone: '+55 19 98111-2233',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    last_message_text: 'O Pix do valor da entrada já foi efetuado.',
    last_message_at: 'Ontem',
    unread_count: 0,
  },
];

export const INITIAL_MESSAGES: Record<string, WhatsAppMessage[]> = {
  'w-1': [
    {
      id: 'm-1',
      contact_id: 'w-1',
      sender: 'user',
      message_text: 'Olá Dra. Camila! Acabei de enviar o carrossel desta semana para o seu link exclusivo de aprovação.',
      created_at: '10:30',
      status: 'read',
    },
    {
      id: 'm-2',
      contact_id: 'w-1',
      sender: 'contact',
      message_text: 'Adorei a arte do post! Já posso aprovar pelo link?',
      created_at: '10:42',
      status: 'delivered',
    },
  ],
  'w-2': [
    {
      id: 'm-3',
      contact_id: 'w-2',
      sender: 'contact',
      message_text: 'Consegue me enviar o contrato atualizado em PDF?',
      created_at: '09:15',
      status: 'read',
    },
  ],
};
