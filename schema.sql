-- ==============================================================================
-- DGFlow Database Schema (Supabase / PostgreSQL)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & TEAMS
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'owner',
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'pt-BR',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CRM & LEADS
CREATE TABLE IF NOT EXISTS lead_pipelines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Pipeline Padrão',
  stages JSONB NOT NULL DEFAULT '[
    {"id": "novo", "name": "Novo Lead", "color": "#3b82f6"},
    {"id": "contato", "name": "Primeiro Contato", "color": "#eab308"},
    {"id": "proposta", "name": "Proposta Enviada", "color": "#a855f7"},
    {"id": "negociacao", "name": "Negociação", "color": "#f97316"},
    {"id": "fechado", "name": "Fechado", "color": "#22c55e"}
  ]'::jsonb,
  is_default BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pipeline_id UUID REFERENCES lead_pipelines(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  stage_id TEXT NOT NULL DEFAULT 'novo',
  value NUMERIC(12,2) DEFAULT 0.00,
  is_client BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  ctwa_clid TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROPOSTAS & CONTRATOS
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  content_html TEXT NOT NULL,
  signature_image_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTEÚDO & APROVAÇÃO EXTERNA
CREATE TABLE IF NOT EXISTS content_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Fluxo Social Media',
  steps JSONB NOT NULL DEFAULT '[
    {"id": "ideia", "name": "Ideia / Pauta"},
    {"id": "copy", "name": "Copywriter"},
    {"id": "design", "name": "Design"},
    {"id": "revisao", "name": "Revisão Interna"},
    {"id": "aprovacao", "name": "Aprovação do Cliente"},
    {"id": "agendado", "name": "Agendado"},
    {"id": "publicado", "name": "Publicado"}
  ]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  workflow_id UUID REFERENCES content_workflows(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  format TEXT DEFAULT 'feed' CHECK (format IN ('feed', 'story', 'reels', 'carousel')),
  copy_text TEXT,
  current_step_id TEXT DEFAULT 'ideia',
  post_date TIMESTAMPTZ,
  scheduled_date TIMESTAMPTZ,
  attachments TEXT[] DEFAULT ARRAY[]::TEXT[],
  approval_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('approved', 'changes_requested')),
  feedback_notes TEXT,
  client_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. OPERACIONAL & TAREFAS
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'cancelled')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FINANCEIRO
CREATE TABLE IF NOT EXISTS accounts_receivable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  payer_name TEXT NOT NULL,
  description TEXT,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT DEFAULT 'pix' CHECK (payment_method IN ('pix', 'boleto', 'card', 'transfer')),
  is_subscription BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accounts_payable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  supplier_name TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. WHATSAPP & COMUNICAÇÃO
CREATE TABLE IF NOT EXISTS whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'WhatsApp Principal',
  phone_number TEXT,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'connecting', 'qrcode')),
  qrcode_base64 TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  avatar_url TEXT,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES whatsapp_contacts(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'contact', 'bot')),
  message_text TEXT NOT NULL,
  media_url TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. IA & BYOK KEYS
CREATE TABLE IF NOT EXISTS user_ai_provider_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('gemini', 'openai', 'anthropic')),
  key_preview TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts_payable ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ai_provider_keys ENABLE ROW LEVEL SECURITY;

-- Base RLS Policies (Allow access to authenticated owner or public token where applicable)
CREATE POLICY "Users can manage own profiles" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own lead_pipelines" ON lead_pipelines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own leads" ON leads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own quotes" ON quotes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public quotes viewable by token" ON quotes FOR SELECT USING (token IS NOT NULL);
CREATE POLICY "Users can manage own contracts" ON contracts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public contracts viewable by token" ON contracts FOR SELECT USING (token IS NOT NULL);
CREATE POLICY "Users can manage own content_workflows" ON content_workflows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own content_items" ON content_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public content_items viewable by approval token" ON content_items FOR SELECT USING (approval_token IS NOT NULL);
CREATE POLICY "Public can insert approvals" ON content_approvals FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own accounts_receivable" ON accounts_receivable FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own accounts_payable" ON accounts_payable FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own whatsapp_instances" ON whatsapp_instances FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own whatsapp_contacts" ON whatsapp_contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own whatsapp_messages" ON whatsapp_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own user_ai_provider_keys" ON user_ai_provider_keys FOR ALL USING (auth.uid() = user_id);
