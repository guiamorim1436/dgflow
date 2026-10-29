const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzjugxtxuxgkiszbpuxx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || Buffer.from('c2Jfc2VjcmV0X3ZZYVQ4OVRGSnB3aUFyMXJsNkFjQUFfelVwVnBLd2E=', 'base64').toString('utf8');

function serverHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'User-Agent': 'TennoFlow-Server/1.0',
    ...extra,
  };
}

export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'consumption' | 'bonus' | 'refund';
  amount: number;
  description: string;
  created_at: string;
}

export interface UserCreditsData {
  balance: number;
  transactions: CreditTransaction[];
}

const DEFAULT_COSTS: Record<string, number> = {
  copy_post: 1,
  copy_stories: 1,
  copy_carousel_short: 2,
  copy_carousel_long: 2,
  copy_full_package: 3,
  image_prompt: 1,
  image_standard: 1,
  image_premium: 2,
  image_seedream: 2,
  assistant_message: 1,
  ai_agent_chat: 1,
  admin_ai_analyst: 3,
};

export const CREDIT_PACKAGES = [
  {
    id: 'pack_50',
    name: '50 Créditos (Starter)',
    credits: 50,
    price_cents: 2500, // R$ 25,00 = R$ 0,50 por crédito
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'pack_150',
    name: '150 Créditos (Profissional)',
    credits: 150,
    price_cents: 7500, // R$ 75,00 = R$ 0,50 por crédito
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'pack_500',
    name: '500 Créditos (Agência & Escala)',
    credits: 500,
    price_cents: 25000, // R$ 250,00 = R$ 0,50 por crédito
    sort_order: 3,
    is_active: true,
  },
];

export async function getUserCredits(userId: string): Promise<UserCreditsData> {
  if (!userId) {
    return { balance: 0, transactions: [] };
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?user_id=eq.${userId}&provider=eq.tenno_credits&limit=1`,
      {
        headers: serverHeaders(),
      }
    );

    if (!res.ok) {
      return { balance: 0, transactions: [] };
    }

    const rows = await res.json();
    if (rows && rows.length > 0) {
      try {
        const parsed = JSON.parse(rows[0].api_key);
        return {
          balance: typeof parsed.balance === 'number' ? parsed.balance : 0,
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        };
      } catch {
        return { balance: 0, transactions: [] };
      }
    }

    // Usuário sem créditos comprados: inicializar com saldo 0
    const initialData: UserCreditsData = {
      balance: 0,
      transactions: [],
    };

    await fetch(`${SUPABASE_URL}/rest/v1/user_ai_provider_keys`, {
      method: 'POST',
      headers: serverHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        user_id: userId,
        provider: 'tenno_credits',
        api_key: JSON.stringify(initialData),
      }),
    });

    return initialData;
  } catch (err) {
    console.error('Error fetching user credits:', err);
    return { balance: 0, transactions: [] };
  }
}

export async function checkCredits(
  userId: string,
  requiredAmount: number
): Promise<{ allowed: boolean; balance: number; error?: string }> {
  const current = await getUserCredits(userId);
  if (current.balance < requiredAmount) {
    return {
      allowed: false,
      balance: current.balance,
      error: `Seus créditos de IA acabaram ou são insuficientes (Saldo atual: ${current.balance} créditos, necessário: ${requiredAmount}). Por favor, recarregue seus créditos para continuar usando a IA.`,
    };
  }
  return { allowed: true, balance: current.balance };
}

export async function deductCredits(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; balance: number; error?: string }> {
  if (!userId) return { success: false, balance: 0, error: 'User ID is required' };
  if (amount <= 0) return { success: true, balance: 0 };

  const current = await getUserCredits(userId);
  if (current.balance < amount) {
    return {
      success: false,
      balance: current.balance,
      error: `Seus créditos de IA acabaram ou são insuficientes (Saldo: ${current.balance}, Necessário: ${amount}). Por favor, recarregue para continuar.`,
    };
  }

  const newBalance = Math.max(0, current.balance - amount);
  const newTransactions: CreditTransaction[] = [
    {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'consumption',
      amount: -amount,
      description,
      created_at: new Date().toISOString(),
    },
    ...current.transactions.slice(0, 49),
  ];

  const updatedData: UserCreditsData = {
    balance: newBalance,
    transactions: newTransactions,
  };

  await fetch(
    `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?user_id=eq.${userId}&provider=eq.tenno_credits`,
    {
      method: 'PATCH',
      headers: serverHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        api_key: JSON.stringify(updatedData),
      }),
    }
  );

  return { success: true, balance: newBalance };
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; balance: number }> {
  if (!userId) return { success: false, balance: 0 };
  if (amount <= 0) return { success: true, balance: 0 };

  const current = await getUserCredits(userId);
  const newBalance = current.balance + amount;
  const newTransactions: CreditTransaction[] = [
    {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: 'purchase',
      amount: amount,
      description,
      created_at: new Date().toISOString(),
    },
    ...current.transactions.slice(0, 49),
  ];

  const updatedData: UserCreditsData = {
    balance: newBalance,
    transactions: newTransactions,
  };

  await fetch(
    `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?user_id=eq.${userId}&provider=eq.tenno_credits`,
    {
      method: 'PATCH',
      headers: serverHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        api_key: JSON.stringify(updatedData),
      }),
    }
  );

  return { success: true, balance: newBalance };
}

export interface CreditOrder {
  id: string;
  user_id: string;
  package_id: string;
  package_name: string;
  credits: number;
  amount_cents: number;
  payment_method: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  pix_qr_code?: string;
  pix_qr_code_url?: string;
  customer?: any;
  created_at: string;
  paid_at?: string;
}

export async function saveCreditOrder(order: CreditOrder): Promise<void> {
  const providerKey = `credit_order_${order.id}`;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/user_ai_provider_keys`, {
      method: 'POST',
      headers: serverHeaders({
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      }),
      body: JSON.stringify({
        user_id: order.user_id,
        provider: providerKey,
        api_key: JSON.stringify(order),
      }),
    });
  } catch (err) {
    console.error('Error saving credit order:', err);
  }
}

export async function getCreditOrder(orderId: string): Promise<CreditOrder | null> {
  const providerKey = `credit_order_${orderId}`;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?provider=eq.${providerKey}&limit=1`,
      {
        headers: serverHeaders(),
      }
    );
    if (res.ok) {
      const rows = await res.json();
      if (rows && rows.length > 0) {
        return JSON.parse(rows[0].api_key);
      }
    }
  } catch (err) {
    console.error('Error getting credit order:', err);
  }
  return null;
}

export async function markCreditOrderPaid(orderId: string): Promise<CreditOrder | null> {
  const order = await getCreditOrder(orderId);
  if (!order || order.status === 'paid') return order;

  order.status = 'paid';
  order.paid_at = new Date().toISOString();

  await saveCreditOrder(order);
  await addCredits(
    order.user_id,
    order.credits,
    `Compra de Pacote ${order.package_name} (+${order.credits} créditos)`
  );

  return order;
}

export function getCreditCosts() {
  return Object.entries(DEFAULT_COSTS).map(([operation, cost]) => ({
    operation,
    cost,
    is_active: true,
  }));
}
