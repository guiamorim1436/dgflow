-- ==============================================================================
-- TENNO FLOW - CORREÇÃO DE GATEWAYS (INFINITEPAY $tenno), WEBHOOK E RPCs DO ADMIN
-- Execute este script no SQL Editor do seu projeto Supabase (xzjugxtxuxgkiszbpuxx)
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABELAS DE FORMAS DE PAGAMENTO E GATEWAYS
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

-- Tabela de logs de webhook para auditoria
CREATE TABLE IF NOT EXISTS public.infinitepay_webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text,
  payload jsonb,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Garantir colunas de link de pagamento em contas a receber
ALTER TABLE public.accounts_receivable ADD COLUMN IF NOT EXISTS invoice_url text;
ALTER TABLE public.accounts_receivable ADD COLUMN IF NOT EXISTS payment_url text;
ALTER TABLE public.accounts_receivable ADD COLUMN IF NOT EXISTS gateway text;
ALTER TABLE public.accounts_receivable ADD COLUMN IF NOT EXISTS payer_name text;
ALTER TABLE public.accounts_receivable ADD COLUMN IF NOT EXISTS remaining_amount numeric;
ALTER TABLE public.accounts_receivable ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.accounts_receivable ADD COLUMN IF NOT EXISTS reference text;

-- 3. WEBHOOK & CONFIRMAÇÃO DE PAGAMENTO INFINITEPAY
CREATE OR REPLACE FUNCTION public.confirm_infinitepay_payment(
  p_reference text,
  p_amount numeric DEFAULT NULL,
  p_user_id uuid DEFAULT NULL
)
RETURNS jsonb AS $$
DECLARE
  v_rec_id uuid;
  v_sub_id uuid;
BEGIN
  -- 1. Tenta localizar em contas a receber
  UPDATE public.accounts_receivable
  SET status = 'paid',
      received_amount = COALESCE(p_amount, value),
      received_at = now(),
      updated_at = now()
  WHERE (id::text = p_reference OR reference = p_reference)
    AND status != 'paid'
  RETURNING id INTO v_rec_id;

  -- 2. Tenta localizar ou ativar assinatura do cliente
  IF p_user_id IS NOT NULL THEN
    UPDATE public.user_subscriptions
    SET is_active = true,
        gateway = 'infinitepay',
        expires_at = now() + interval '30 days',
        updated_at = now()
    WHERE user_id = p_user_id
    RETURNING id INTO v_sub_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'accounts_receivable_id', v_rec_id,
    'subscription_id', v_sub_id,
    'confirmed_at', now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FUNÇÕES RPC DO DASHBOARD DE FATURAMENTO (ADMIN)
CREATE OR REPLACE FUNCTION admin_billing_daily(p_from text, p_to text)
RETURNS TABLE (
  dia text,
  vendas numeric,
  receita numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH dates AS (
    SELECT generate_series(
      COALESCE(p_from::date, current_date - interval '30 days'),
      COALESCE(p_to::date, current_date),
      '1 day'::interval
    )::date AS d
  )
  SELECT
    to_char(dates.d, 'YYYY-MM-DD') AS dia,
    COALESCE(COUNT(ar.id), 0)::numeric AS vendas,
    COALESCE(SUM(CASE WHEN ar.status = 'paid' THEN ar.value ELSE 0 END), 0)::numeric AS receita
  FROM dates
  LEFT JOIN public.accounts_receivable ar 
    ON date_trunc('day', ar.created_at)::date = dates.d
  GROUP BY dates.d
  ORDER BY dates.d ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_monthly(p_from text, p_to text)
RETURNS TABLE (
  mes text,
  vendas numeric,
  receita numeric
) AS $$
BEGIN
  RETURN QUERY
  WITH months AS (
    SELECT generate_series(
      date_trunc('month', COALESCE(p_from::date, current_date - interval '12 months')),
      date_trunc('month', COALESCE(p_to::date, current_date)),
      '1 month'::interval
    )::date AS m
  )
  SELECT
    to_char(months.m, 'YYYY-MM') AS mes,
    COALESCE(COUNT(ar.id), 0)::numeric AS vendas,
    COALESCE(SUM(CASE WHEN ar.status = 'paid' THEN ar.value ELSE 0 END), 0)::numeric AS receita
  FROM months
  LEFT JOIN public.accounts_receivable ar 
    ON date_trunc('month', ar.created_at)::date = months.m
  GROUP BY months.m
  ORDER BY months.m ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_kpis(p_from text, p_to text)
RETURNS jsonb AS $$
DECLARE
  v_total_revenue numeric := 0;
  v_paid_count integer := 0;
  v_pending_count integer := 0;
  v_pending_amount numeric := 0;
  v_active_subscriptions integer := 0;
  v_result jsonb;
BEGIN
  SELECT 
    COALESCE(SUM(CASE WHEN status = 'paid' THEN value ELSE 0 END), 0),
    COALESCE(COUNT(CASE WHEN status = 'paid' THEN 1 END), 0),
    COALESCE(COUNT(CASE WHEN status = 'pending' THEN 1 END), 0),
    COALESCE(SUM(CASE WHEN status = 'pending' THEN value ELSE 0 END), 0)
  INTO v_total_revenue, v_paid_count, v_pending_count, v_pending_amount
  FROM public.accounts_receivable
  WHERE (p_from IS NULL OR created_at >= p_from::timestamptz)
    AND (p_to IS NULL OR created_at <= (p_to || ' 23:59:59')::timestamptz);

  SELECT COUNT(*) INTO v_active_subscriptions
  FROM public.user_subscriptions
  WHERE is_active = true;

  v_result := jsonb_build_object(
    'total_revenue', v_total_revenue,
    'paid_count', v_paid_count,
    'pending_count', v_pending_count,
    'pending_amount', v_pending_amount,
    'active_subscriptions', v_active_subscriptions,
    'conversion_rate', CASE WHEN (v_paid_count + v_pending_count) > 0 
      THEN ROUND((v_paid_count::numeric / (v_paid_count + v_pending_count)::numeric) * 100, 2)
      ELSE 0 END
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_conversion(p_from text, p_to text)
RETURNS jsonb AS $$
DECLARE
  v_paid integer := 0;
  v_pending integer := 0;
  v_canceled integer := 0;
BEGIN
  SELECT 
    COALESCE(COUNT(CASE WHEN status = 'paid' THEN 1 END), 0),
    COALESCE(COUNT(CASE WHEN status = 'pending' THEN 1 END), 0),
    COALESCE(COUNT(CASE WHEN status = 'canceled' THEN 1 END), 0)
  INTO v_paid, v_pending, v_canceled
  FROM public.accounts_receivable
  WHERE (p_from IS NULL OR created_at >= p_from::timestamptz)
    AND (p_to IS NULL OR created_at <= (p_to || ' 23:59:59')::timestamptz);

  RETURN jsonb_build_object(
    'paid', v_paid,
    'pending', v_pending,
    'canceled', v_canceled,
    'total', v_paid + v_pending + v_canceled
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_billing_opportunities(p_from text, p_to text)
RETURNS jsonb AS $$
DECLARE
  v_abandoned integer := 0;
  v_recovered integer := 0;
  v_potential_value numeric := 0;
BEGIN
  SELECT 
    COALESCE(COUNT(*), 0),
    COALESCE(SUM(value), 0)
  INTO v_abandoned, v_potential_value
  FROM public.accounts_receivable
  WHERE status = 'pending'
    AND created_at < (now() - interval '24 hours');

  RETURN jsonb_build_object(
    'abandoned', v_abandoned,
    'recovered', 0,
    'potential_value', v_potential_value
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_admin_subscriptions_with_email(
  p_search text DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  plan_id text,
  is_active boolean,
  is_trial boolean,
  expires_at timestamptz,
  created_at timestamptz,
  email text,
  full_name text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.plan_id,
    s.is_active,
    s.is_trial,
    s.expires_at,
    s.created_at,
    u.email::text,
    p.full_name
  FROM public.user_subscriptions s
  LEFT JOIN auth.users u ON u.id = s.user_id
  LEFT JOIN public.profiles p ON p.id = s.user_id
  WHERE (p_search IS NULL OR u.email ILIKE '%' || p_search || '%' OR p.full_name ILIKE '%' || p_search || '%')
  ORDER BY s.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION admin_cancel_subscription(p_subscription_id uuid)
RETURNS boolean AS $$
BEGIN
  UPDATE public.user_subscriptions
  SET is_active = false, updated_at = now()
  WHERE id = p_subscription_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_admin_users_with_email(
  p_search text DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  role text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    p.full_name,
    COALESCE(ur.role, 'user') AS role,
    COALESCE(p.created_at, u.created_at) AS created_at
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  WHERE (p_search IS NULL OR u.email ILIKE '%' || p_search || '%' OR p.full_name ILIKE '%' || p_search || '%')
  ORDER BY u.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. SEGURANÇA E POLÍTICAS RLS
ALTER TABLE public.user_infinitepay_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_asaas_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercadopago_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_abacatepay_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ativopay_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inter_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stripe_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.infinitepay_webhook_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  EXECUTE 'CREATE POLICY "Allow all on user_infinitepay_config" ON public.user_infinitepay_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_asaas_config" ON public.user_asaas_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on mercadopago_configs" ON public.mercadopago_configs FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_abacatepay_config" ON public.user_abacatepay_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_ativopay_config" ON public.user_ativopay_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on inter_configs" ON public.inter_configs FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on user_stripe_config" ON public.user_stripe_config FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  EXECUTE 'CREATE POLICY "Allow all on infinitepay_webhook_logs" ON public.infinitepay_webhook_logs FOR ALL TO authenticated USING (true) WITH CHECK (true)';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- 6. ATIVAÇÃO IMEDIATA DA SUA INFINITETAG ($tenno)
DO $$
DECLARE
  v_user_id uuid := '198bf0db-ed7a-45d7-b6e2-7aabf5093f5b'::uuid;
BEGIN
  -- Salva e ativa sua InfiniteTag $tenno
  INSERT INTO public.user_infinitepay_config (user_id, handle, is_active)
  VALUES (v_user_id, 'tenno', true)
  ON CONFLICT (user_id) DO UPDATE SET handle = 'tenno', is_active = true, updated_at = now();

  -- Garante assinatura ativa do admin
  INSERT INTO public.user_subscriptions (user_id, plan_id, is_active, is_trial, expires_at)
  VALUES (v_user_id, 'enterprise', true, false, now() + interval '10 years')
  ON CONFLICT DO NOTHING;

  -- Garante role admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (v_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
