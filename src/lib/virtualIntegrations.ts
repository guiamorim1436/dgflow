import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzjugxtxuxgkiszbpuxx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
}

export const VIRTUAL_INTEGRATION_TABLES = [
  'user_pixel_config',
  'form_webhooks',
  'user_api_keys',
  'cora_configs',
  'inter_configs',
  'sicredi_configs',
  'user_abacatepay_config',
  'user_ativopay_config',
  'user_stripe_config',
  'google_calendar_tokens',
  'google_drive_tokens',
  'dropbox_tokens',
  'trello_connections',
  'meta_event_rules',
];

export async function handleVirtualIntegration(
  req: NextRequest,
  tableName: string,
  userId: string
): Promise<NextResponse> {
  const providerKey = `config_${tableName}`;
  const acceptHeader = req.headers.get('accept') || '';
  const isSingle = acceptHeader.includes('application/vnd.pgrst.object+json');

  // 1. GET: Retorna os dados persistidos ou vazio
  if (req.method === 'GET') {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?user_id=eq.${userId}&provider=eq.${providerKey}&limit=1`,
        {
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
        }
      );

      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          try {
            const parsed = JSON.parse(rows[0].api_key);
            if (isSingle) {
              return NextResponse.json(parsed, { headers: corsHeaders() });
            }
            return NextResponse.json(Array.isArray(parsed) ? parsed : [parsed], {
              headers: corsHeaders(),
            });
          } catch {}
        }
      }
    } catch (err) {
      console.error(`Error loading virtual table ${tableName}:`, err);
    }

    // Retorno padrão vazio compatível com PostgREST
    if (isSingle) {
      return new NextResponse(null, { status: 406, headers: corsHeaders() });
    }
    return NextResponse.json([], { headers: corsHeaders() });
  }

  // 2. POST / PUT / PATCH: Salva os dados enviados
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    try {
      const body = await req.json();
      const currentRows = await fetch(
        `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?user_id=eq.${userId}&provider=eq.${providerKey}&limit=1`,
        {
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
        }
      ).then((r) => r.json());

      const dataToSave = {
        id: body.id || `cfg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        user_id: userId,
        ...body,
        updated_at: new Date().toISOString(),
      };

      if (currentRows && currentRows.length > 0) {
        // Atualizar
        await fetch(
          `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?user_id=eq.${userId}&provider=eq.${providerKey}`,
          {
            method: 'PATCH',
            headers: {
              apikey: SERVICE_KEY,
              Authorization: `Bearer ${SERVICE_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: JSON.stringify(dataToSave),
            }),
          }
        );
      } else {
        // Inserir
        await fetch(`${SUPABASE_URL}/rest/v1/user_ai_provider_keys`, {
          method: 'POST',
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            provider: providerKey,
            api_key: JSON.stringify(dataToSave),
          }),
        });
      }

      const responsePayload = isSingle ? dataToSave : [dataToSave];
      return NextResponse.json(responsePayload, { status: 201, headers: corsHeaders() });
    } catch (err: any) {
      console.error(`Error saving virtual table ${tableName}:`, err);
      return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
    }
  }

  // 3. DELETE: Limpa a configuração
  if (req.method === 'DELETE') {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?user_id=eq.${userId}&provider=eq.${providerKey}`,
        {
          method: 'DELETE',
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
          },
        }
      );
    } catch {}
    return new NextResponse(null, { status: 204, headers: corsHeaders() });
  }

  return NextResponse.json([], { headers: corsHeaders() });
}

/**
 * Gerador de Chave de API para o MCP Server (Claude/ChatGPT/Cursor)
 */
export async function handleGenerateMcpApiKey(userId: string, pName?: string): Promise<NextResponse> {
  const randomSuffix = Math.random().toString(36).substring(2, 12);
  const rawKey = `tf_mcp_${randomSuffix}`;
  const keyPrefix = rawKey.substring(0, 10) + '...';

  const newKeyRecord = {
    id: `mcp_${Date.now()}`,
    user_id: userId,
    name: pName || 'Claude/ChatGPT',
    key_prefix: keyPrefix,
    api_key: rawKey,
    last_used_at: null,
    created_at: new Date().toISOString(),
    revoked_at: null,
  };

  try {
    const existingKeysRes = await fetch(
      `${SUPABASE_URL}/rest/v1/user_ai_provider_keys?user_id=eq.${userId}&provider=eq.config_user_api_keys&limit=1`,
      {
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
      }
    );

    let keysList = [];
    if (existingKeysRes.ok) {
      const rows = await existingKeysRes.json();
      if (rows && rows.length > 0) {
        try {
          keysList = JSON.parse(rows[0].api_key);
          if (!Array.isArray(keysList)) keysList = [keysList];
        } catch {}
      }
    }

    keysList.unshift(newKeyRecord);

    await fetch(`${SUPABASE_URL}/rest/v1/user_ai_provider_keys`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        user_id: userId,
        provider: 'config_user_api_keys',
        api_key: JSON.stringify(keysList),
      }),
    });

    return NextResponse.json({ api_key: rawKey }, { headers: corsHeaders() });
  } catch (err: any) {
    return NextResponse.json({ api_key: rawKey }, { headers: corsHeaders() });
  }
}

/**
 * Webhook de Entrada de Leads (Typeform, n8n, Zapier, Elementor)
 */
export async function handleWebhookLead(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json().catch(() => ({}));
    const name = body.name || body.nome || body.full_name || 'Novo Lead via Webhook';
    const email = body.email || null;
    const phone = body.phone || body.telefone || body.whatsapp || null;
    const notes = body.message || body.mensagem || body.notes || JSON.stringify(body);
    const userId = body.user_id || '198bf0db-ed7a-45d7-b6e2-7aabf5093f5b';

    const leadData = {
      user_id: userId,
      name,
      email,
      phone,
      notes,
      source: 'Webhook',
      status: 'novo',
      stage: 'Novo Lead',
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(leadData),
    });

    const created = await res.json();
    return NextResponse.json({ success: true, lead: created }, { headers: corsHeaders() });
  } catch (err: any) {
    console.error('Webhook Lead error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
