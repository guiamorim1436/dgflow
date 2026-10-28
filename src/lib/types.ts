export interface Lead {
  id: string;
  customer_name: string;
  email?: string;
  phone?: string;
  company?: string;
  stage_id: 'novo' | 'contato' | 'proposta' | 'negociacao' | 'fechado';
  value: number;
  tags?: string[];
  created_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  client_name: string;
  format: 'feed' | 'story' | 'reels' | 'carousel';
  copy_text: string;
  current_step_id: 'ideia' | 'copy' | 'design' | 'revisao' | 'aprovacao' | 'agendado' | 'publicado';
  scheduled_date: string;
  attachments: string[];
  approval_token: string;
  status: string;
}

export interface Task {
  id: string;
  title: string;
  client_name?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
}

export interface FinancialMetric {
  month: string;
  receita: number;
  despesas: number;
}

export interface WhatsAppMessage {
  id: string;
  contact_id: string;
  sender: 'user' | 'contact';
  message_text: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  avatar_url?: string;
  last_message_text: string;
  last_message_at: string;
  unread_count: number;
}
