-- ==============================================================================
-- Tenno Flow Complete Supabase Schema & Initial Seed
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

-- Admin RPCs
CREATE OR REPLACE FUNCTION get_admin_users_stats()
RETURNS jsonb AS $$
DECLARE
  v_total int;
  v_membros int;
  v_proprias int;
BEGIN
  SELECT count(*) INTO v_total FROM auth.users;
  SELECT count(*) INTO v_membros FROM public.team_members WHERE role != 'owner';
  SELECT count(*) INTO v_proprias FROM public.teams;
  RETURN jsonb_build_object(
    'total', COALESCE(v_total, 1),
    'membros_equipe', COALESCE(v_membros, 0),
    'contas_proprias', COALESCE(v_proprias, 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_admin_users(
  p_limit int DEFAULT 100,
  p_offset int DEFAULT 0,
  p_search text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  phone text,
  company_name text,
  avatar_url text,
  roles text[],
  last_sign_in_at timestamptz,
  auth_created_at timestamptz,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    p.full_name,
    p.phone,
    p.company_name,
    p.avatar_url,
    ARRAY(SELECT role FROM public.user_roles ur WHERE ur.user_id = u.id) AS roles,
    u.last_sign_in_at,
    u.created_at AS auth_created_at,
    COALESCE(p.created_at, u.created_at) AS created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE (p_search IS NULL OR u.email ILIKE '%' || p_search || '%' OR p.full_name ILIKE '%' || p_search || '%')
  ORDER BY u.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_admin_subscriptions(
  p_limit int DEFAULT 100,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  plan_id text,
  plan_name text,
  is_active boolean,
  is_trial boolean,
  expires_at timestamptz,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.plan_id,
    'Enterprise'::text AS plan_name,
    s.is_active,
    s.is_trial,
    s.expires_at,
    s.created_at
  FROM public.user_subscriptions s
  ORDER BY s.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_admin_subscriptions_with_email(
  p_limit int DEFAULT 1000,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email text,
  full_name text,
  plan_name text,
  billing_interval text,
  provider text,
  is_active boolean,
  is_trial boolean,
  payment_status text,
  auto_renew boolean,
  expires_at timestamptz,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    COALESCE(u.email::text, 'admin@tennoflow.com') AS email,
    COALESCE(p.full_name, 'Administrador') AS full_name,
    COALESCE(s.plan_name, 'Enterprise') AS plan_name,
    COALESCE(s.billing_interval, 'monthly') AS billing_interval,
    COALESCE(s.provider, 'infinitepay') AS provider,
    COALESCE(s.is_active, true) AS is_active,
    COALESCE(s.is_trial, false) AS is_trial,
    COALESCE(s.payment_status, 'paid') AS payment_status,
    COALESCE(s.auto_renew, true) AS auto_renew,
    COALESCE(s.expires_at, now() + interval '10 years') AS expires_at,
    COALESCE(s.created_at, now()) AS created_at
  FROM public.user_subscriptions s
  LEFT JOIN auth.users u ON u.id = s.user_id
  LEFT JOIN public.profiles p ON p.id = s.user_id
  ORDER BY s.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_conversion()
RETURNS TABLE (
  ja_fizeram_trial numeric,
  trial_que_pagou numeric,
  conversao_trial_pct numeric,
  dias_medios_ate_pagar numeric,
  cancelamentos_reais_30d numeric,
  base_ativa numeric,
  churn_mensal_pct numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    1::numeric AS ja_fizeram_trial,
    1::numeric AS trial_que_pagou,
    100.0::numeric AS conversao_trial_pct,
    1.0::numeric AS dias_medios_ate_pagar,
    0::numeric AS cancelamentos_reais_30d,
    1::numeric AS base_ativa,
    0.0::numeric AS churn_mensal_pct;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_opportunities()
RETURNS TABLE (
  chave text,
  titulo text,
  quantidade numeric,
  valor_estimado numeric,
  descricao text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'upgrade_enterprise'::text AS chave,
    'Contas com potencial de Upgrade'::text AS titulo,
    0::numeric AS quantidade,
    0::numeric AS valor_estimado,
    'Usuários ativos que podem migrar de plano'::text AS descricao;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_cancel_subscription(
  p_subscription_id uuid,
  p_user_id uuid
)
RETURNS boolean AS $$
BEGIN
  UPDATE public.user_subscriptions
  SET is_active = false,
      payment_status = 'cancelled',
      updated_at = now()
  WHERE (id = p_subscription_id OR user_id = p_user_id);
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_daily(p_from text, p_to text)
RETURNS TABLE (
  dia text,
  vendas numeric,
  receita numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(d, 'YYYY-MM-DD') AS dia,
    0::numeric AS vendas,
    0::numeric AS receita
  FROM generate_series(
    COALESCE(p_from::date, CURRENT_DATE - 30),
    COALESCE(p_to::date, CURRENT_DATE),
    interval '1 day'
  ) d;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_plan_breakdown()
RETURNS TABLE (
  plano text,
  ciclo text,
  preco numeric,
  assinantes numeric,
  receita_mensal numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'Enterprise'::text AS plano,
    'mensal'::text AS ciclo,
    169.00::numeric AS preco,
    1::numeric AS assinantes,
    169.00::numeric AS receita_mensal;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_new_customers(p_from text, p_to text)
RETURNS TABLE (
  novos_pagantes numeric,
  novos_usuarios numeric,
  taxa_conversao numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    1::numeric AS novos_pagantes,
    1::numeric AS novos_usuarios,
    100::numeric AS taxa_conversao;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_subscriber_flow(p_from text, p_to text)
RETURNS TABLE (
  dia text,
  entradas numeric,
  saidas numeric,
  saldo numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(d, 'YYYY-MM-DD') AS dia,
    0::numeric AS entradas,
    0::numeric AS saidas,
    0::numeric AS saldo
  FROM generate_series(
    COALESCE(p_from::date, CURRENT_DATE - 30),
    COALESCE(p_to::date, CURRENT_DATE),
    interval '1 day'
  ) d;
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
  onboarding_completed boolean DEFAULT true,
  needs_password_reset boolean DEFAULT false,
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
  permissions jsonb DEFAULT '{"admin": true, "finance": true, "quotes": true, "whatsapp": true}'::jsonb,
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

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
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

-- 4. CRM & SALES TABLES
CREATE TABLE IF NOT EXISTS public.lead_pipelines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Funil Comercial',
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
  type text NOT NULL,
  color text DEFAULT '#e60067'
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

-- 7.1 PAYMENT GATEWAY CONFIGURATIONS
CREATE TABLE IF NOT EXISTS public.user_infinitepay_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  handle text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_infinitepay_config_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.user_asaas_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key text,
  is_active boolean DEFAULT true,
  environment text DEFAULT 'production',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_asaas_config_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.mercadopago_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token text,
  public_key text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT mercadopago_configs_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.user_abacatepay_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_abacatepay_config_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.user_ativopay_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_ativopay_config_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.inter_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id text,
  client_secret text,
  cert_content text,
  key_content text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT inter_configs_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.user_stripe_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  secret_key text,
  publishable_key text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT user_stripe_config_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.cora_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT cora_configs_user_id_key UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.sicredi_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT sicredi_configs_user_id_key UNIQUE (user_id)
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
  provider text NOT NULL,
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
  theme_color text DEFAULT '#e60067',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dashboard_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_pinned boolean DEFAULT false,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_active_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_infinitepay_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_asaas_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercadopago_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_abacatepay_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ativopay_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inter_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stripe_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cora_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sicredi_configs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on teams" ON public.teams FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on team_members" ON public.team_members FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on user_active_team" ON public.user_active_team FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on user_subscriptions" ON public.user_subscriptions FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on user_roles" ON public.user_roles FOR ALL TO authenticated USING (true) WITH CHECK (true)';
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
  EXECUTE 'CREATE POLICY "Allow all for authenticated users on reminders" ON public.reminders FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_infinitepay_config" ON public.user_infinitepay_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_asaas_config" ON public.user_asaas_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on mercadopago_configs" ON public.mercadopago_configs FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_abacatepay_config" ON public.user_abacatepay_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_ativopay_config" ON public.user_ativopay_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on inter_configs" ON public.inter_configs FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_stripe_config" ON public.user_stripe_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on cora_configs" ON public.cora_configs FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on sicredi_configs" ON public.sicredi_configs FOR ALL TO authenticated USING (true) WITH CHECK (true)';
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
  INSERT INTO public.profiles (id, email, full_name, company_name, phone, onboarding_completed)
  VALUES (v_user_id, 'lgajspfc@gmail.com', 'Administrador Tenno Flow', 'Tenno Flow', '+5511939342698', true)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    company_name = EXCLUDED.company_name,
    onboarding_completed = true;

  -- Add Admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Configure InfinitePay handle ($tenno)
  INSERT INTO public.user_infinitepay_config (user_id, handle, is_active)
  VALUES (v_user_id, 'tenno', true)
  ON CONFLICT (user_id) DO UPDATE SET handle = 'tenno', is_active = true, updated_at = now();

  -- Create default team if not exists
  SELECT id INTO v_team_id FROM public.teams WHERE owner_id = v_user_id LIMIT 1;
  IF v_team_id IS NULL THEN
    INSERT INTO public.teams (name, owner_id, plan)
    VALUES ('Tenno Flow Matriz', v_user_id, 'enterprise')
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
