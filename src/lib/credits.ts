const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzjugxtxuxgkiszbpuxx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
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
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
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
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: JSON.stringify(updatedData),
      }),
    }
  );

  return { success: true, balance: newBalance };
}

export function getCreditCosts() {
  return Object.entries(DEFAULT_COSTS).map(([operation, cost]) => ({
    operation,
    cost,
    is_active: true,
  }));
}
