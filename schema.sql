-- ==============================================================================
-- DGFlow Complete Supabase Schema & Initial Seed
-- Project: xzjugxtxuxgkiszbpuxx
-- User: lgajspfc@gmail.com (ID: 198bf0db-ed7a-45d7-b6e2-7aabf5093f5b)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CORE ENUMS & RPC FUNCTIONS
CREATE OR REPLACE FUNCTION tem_plano_ativo_por_equipe()
RETURNS boolean AS $$
BEGIN
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_team_owner_for(p_team_id uuid)
RETURNS uuid AS $$
DECLARE
  v_owner_id uuid;
BEGIN
  SELECT owner_id INTO v_owner_id FROM public.teams WHERE id = p_team_id;
  RETURN v_owner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_active_team_member_count(p_team_id uuid)
RETURNS integer AS $$
DECLARE
  v_count integer;
BEGIN
  SELECT count(*) INTO v_count FROM public.team_members WHERE team_id = p_team_id AND status = 'active';
  RETURN COALESCE(v_count, 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CORE IDENTITY & ACCESS TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  company_name text DEFAULT 'Minha Agência',
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Equipe Principal',
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text DEFAULT 'enterprise',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'owner',
  job_title text DEFAULT 'Fundador',
  seller_type text,
  monthly_goal numeric,
  permissions jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  invited_by uuid,
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.user_active_team (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id text DEFAULT 'enterprise',
  is_active boolean DEFAULT true,
  is_trial boolean DEFAULT false,
  expires_at timestamptz DEFAULT (now() + interval '10 years'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price numeric DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  enabled boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4. CRM & SALES TABLES
CREATE TABLE IF NOT EXISTS public.lead_pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Funil Padrão',
  stages jsonb DEFAULT '["Novo Lead", "Contato Inicial", "Proposta Enviada", "Em Negociação", "Fechado Ganho", "Perdido"]'::jsonb,
  is_default boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pipeline_id uuid REFERENCES public.lead_pipelines(id) ON DELETE SET NULL,
  name text NOT NULL,
  company text,
  email text,
  phone text,
  value numeric DEFAULT 0,
  stage text DEFAULT 'Novo Lead',
  status text DEFAULT 'active',
  source text DEFAULT 'Manual',
  notes text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lead_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  role text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  title text NOT NULL,
  token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status text DEFAULT 'draft',
  total_amount numeric DEFAULT 0,
  discount numeric DEFAULT 0,
  items jsonb DEFAULT '[]'::jsonb,
  terms text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quote_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  quantity numeric DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_price numeric DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  title text NOT NULL,
  token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status text DEFAULT 'draft',
  content text,
  signed_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contract_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE,
  signer_name text NOT NULL,
  signer_email text NOT NULL,
  signer_document text,
  ip_address text,
  signed_at timestamptz DEFAULT now()
);

-- 5. PROJECTS & TASKS
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'in_progress',
  start_date date DEFAULT CURRENT_DATE,
  end_date date,
  budget numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo',
  priority text DEFAULT 'medium',
  due_date timestamptz,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  title text NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  time_estimate int,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES public.daily_tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_date date DEFAULT CURRENT_DATE,
  completed_at timestamptz DEFAULT now()
);

-- 6. CONTENT MANAGEMENT & APPROVALS
CREATE TABLE IF NOT EXISTS public.content_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Fluxo Padrão',
  stages jsonb DEFAULT '["Ideia", "Roteiro", "Design", "Revisão", "Aprovação Cliente", "Agendado", "Publicado"]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES public.content_workflows(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  title text NOT NULL,
  copy text,
  channels text[] DEFAULT '{"instagram"}',
  format text DEFAULT 'post',
  status text DEFAULT 'Ideia',
  scheduled_for timestamptz,
  published_at timestamptz,
  media_urls text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid REFERENCES public.content_items(id) ON DELETE CASCADE,
  token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status text DEFAULT 'pending',
  client_feedback text,
  responded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_item_id uuid REFERENCES public.content_items(id) ON DELETE CASCADE,
  platform text NOT NULL,
  scheduled_time timestamptz NOT NULL,
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now()
);

-- 7. FINANCE & CASH FLOW
CREATE TABLE IF NOT EXISTS public.cash_registers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Caixa Principal',
  initial_balance numeric DEFAULT 0,
  current_balance numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.finance_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL, -- 'income' or 'expense'
  color text DEFAULT '#e8363b'
);

CREATE TABLE IF NOT EXISTS public.accounts_receivable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  payment_date date,
  status text DEFAULT 'pending',
  category_id uuid REFERENCES public.finance_categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.accounts_payable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  payment_date date,
  status text DEFAULT 'pending',
  category_id uuid REFERENCES public.finance_categories(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cash_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  register_id uuid REFERENCES public.cash_registers(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL,
  movement_date timestamptz DEFAULT now()
);

-- 8. WHATSAPP & AUTOMATIONS
CREATE TABLE IF NOT EXISTS public.whatsapp_instances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instance_name text NOT NULL,
  status text DEFAULT 'disconnected',
  qrcode text,
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id uuid REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  name text,
  phone text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id uuid REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  phone text NOT NULL,
  direction text NOT NULL,
  body text,
  media_url text,
  status text DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  trigger_type text NOT NULL,
  actions jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agent_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id uuid REFERENCES public.agent_automations(id) ON DELETE CASCADE,
  status text DEFAULT 'pending',
  payload jsonb DEFAULT '{}'::jsonb,
  result jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- 9. AI STUDIO & ASSETS
CREATE TABLE IF NOT EXISTS public.studio_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  image_url text,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_ai_provider_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL, -- 'openai', 'anthropic', 'google'
  api_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 10. PUBLIC PAGES & SETTINGS
CREATE TABLE IF NOT EXISTS public.portfolio_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT 'Portfólio',
  bio text,
  theme jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bio_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  links jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.capture_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  headline text NOT NULL,
  form_fields jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.client_portal_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  portal_name text DEFAULT 'Portal do Cliente',
  logo_url text,
  theme_color text DEFAULT '#e8363b',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dashboard_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_active_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_payable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_pages ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on teams" ON public.teams FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on team_members" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on user_active_team" ON public.user_active_team FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on user_subscriptions" ON public.user_subscriptions FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on lead_pipelines" ON public.lead_pipelines FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on quotes" ON public.quotes FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on contracts" ON public.contracts FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on tasks" ON public.tasks FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on daily_tasks" ON public.daily_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on content_workflows" ON public.content_workflows FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on content_items" ON public.content_items FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on cash_registers" ON public.cash_registers FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on accounts_receivable" ON public.accounts_receivable FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on accounts_payable" ON public.accounts_payable FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on whatsapp_instances" ON public.whatsapp_instances FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on portfolio_pages" ON public.portfolio_pages FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on bio_pages" ON public.bio_pages FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on capture_pages" ON public.capture_pages FOR ALL TO authenticated USING (true) WITH CHECK (true)';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 12. INITIAL SEED FOR ACTIVE USER (lgajspfc@gmail.com)
DO $$
DECLARE
  v_user_id uuid := '198bf0db-ed7a-45d7-b6e2-7aabf5093f5b'::uuid;
  v_team_id uuid;
  v_pipeline_id uuid;
  v_workflow_id uuid;
  v_register_id uuid;
BEGIN
  -- Insert or update profile
  INSERT INTO public.profiles (id, email, full_name, company_name, phone)
  VALUES (v_user_id, 'lgajspfc@gmail.com', 'Administrador DGFlow', 'DGFlow Agency', '+5511939342698')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name;

  -- Create default team if not exists
  SELECT id INTO v_team_id FROM public.teams WHERE owner_id = v_user_id LIMIT 1;
  IF v_team_id IS NULL THEN
    INSERT INTO public.teams (name, owner_id, plan)
    VALUES ('DGFlow Matriz', v_user_id, 'enterprise')
    RETURNING id INTO v_team_id;
  END IF;

  -- Add user as team owner
  INSERT INTO public.team_members (team_id, user_id, role, job_title, status)
  VALUES (v_team_id, v_user_id, 'owner', 'CEO & Fundador', 'active')
  ON CONFLICT (team_id, user_id) DO NOTHING;

  -- Set active team
  INSERT INTO public.user_active_team (user_id, team_id)
  VALUES (v_user_id, v_team_id)
  ON CONFLICT (user_id) DO UPDATE SET team_id = EXCLUDED.team_id;

  -- Grant full unlimited subscription
  INSERT INTO public.user_subscriptions (user_id, plan_id, is_active, is_trial, expires_at)
  VALUES (v_user_id, 'enterprise', true, false, now() + interval '10 years')
  ON CONFLICT DO NOTHING;

  -- Default Lead Pipeline
  INSERT INTO public.lead_pipelines (user_id, name, is_default)
  VALUES (v_user_id, 'Funil Comercial', true)
  RETURNING id INTO v_pipeline_id;

  -- Sample Leads
  INSERT INTO public.leads (user_id, pipeline_id, name, company, email, phone, value, stage, source)
  VALUES 
    (v_user_id, v_pipeline_id, 'Carlos Silveira', 'Tech Solutions', 'carlos@techsolutions.com', '+5511999990001', 4500, 'Contato Inicial', 'Instagram'),
    (v_user_id, v_pipeline_id, 'Marina Mendes', 'Studio Moda', 'marina@studiomoda.com', '+5511999990002', 8200, 'Proposta Enviada', 'Indicação');

  -- Default Content Workflow
  INSERT INTO public.content_workflows (user_id, name)
  VALUES (v_user_id, 'Fluxo de Produção Semanal')
  RETURNING id INTO v_workflow_id;

  -- Sample Content Item
  INSERT INTO public.content_items (user_id, workflow_id, title, copy, status, channels)
  VALUES (v_user_id, v_workflow_id, 'Carrossel: Tendências de Design 2026', 'Confira os 5 pilares do design de alta conversão para o segundo semestre.', 'Design', '{"instagram","linkedin"}');

  -- Default Cash Register
  INSERT INTO public.cash_registers (user_id, name, initial_balance, current_balance)
  VALUES (v_user_id, 'Conta Corrente Principal', 15000, 15000)
  RETURNING id INTO v_register_id;

END $$;
