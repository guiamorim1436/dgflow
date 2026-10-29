import { NextRequest, NextResponse } from 'next/server';
import {
  getUserCredits,
  checkCredits,
  deductCredits,
  getCreditCosts,
  CREDIT_PACKAGES,
} from '@/lib/credits';
import { callOpenRouter } from '@/lib/openrouter';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xzjugxtxuxgkiszbpuxx.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function extractUserId(req: NextRequest, bodyObj?: any): string {
  if (bodyObj?.userId) return String(bodyObj.userId);
  if (bodyObj?.user_id) return String(bodyObj.user_id);
  if (bodyObj?.ownerId) return String(bodyObj.ownerId);

  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
        if (payload.sub) return String(payload.sub);
      }
    } catch {}
  }

  const search = req.nextUrl.searchParams;
  const userParam = search.get('user_id');
  if (userParam) {
    return userParam.replace(/^eq\./, '');
  }

  return '198bf0db-ed7a-45d7-b6e2-7aabf5093f5b';
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };
}

async function handleProxy(req: NextRequest, paramsPromise: Promise<{ path: string[] }>) {
  const { path } = await paramsPromise;
  const targetPath = (path || []).join('/');
  const search = req.nextUrl.search;

  // ==========================================
  // 1. ENDPOINTS DE CRÉDITOS DO FRONT-END (REST)
  // ==========================================
  if (targetPath === 'rest/v1/user_ai_credits') {
    const userId = extractUserId(req);
    const credits = await getUserCredits(userId);
    const acceptHeader = req.headers.get('accept') || '';
    if (acceptHeader.includes('application/vnd.pgrst.object+json')) {
      return NextResponse.json({ balance: credits.balance }, { headers: corsHeaders() });
    }
    return NextResponse.json([{ balance: credits.balance }], { headers: corsHeaders() });
  }

  if (targetPath === 'rest/v1/ai_credit_costs') {
    const costs = getCreditCosts();
    return NextResponse.json(costs, { headers: corsHeaders() });
  }

  if (targetPath === 'rest/v1/credit_packages') {
    return NextResponse.json(CREDIT_PACKAGES, { headers: corsHeaders() });
  }

  if (targetPath === 'rest/v1/ai_credit_transactions') {
    const userId = extractUserId(req);
    const credits = await getUserCredits(userId);
    return NextResponse.json(credits.transactions, { headers: corsHeaders() });
  }

  // ==========================================
  // 2. EDGE FUNCTIONS DE IA DO FRONT-END
  // ==========================================

  // A) Geração de Copy para Carrosséis de Design (AIDesign)
  if (targetPath === 'functions/v1/generate-design-copy') {
    try {
      const body = await req.json();
      const userId = extractUserId(req, body);
      const requiredCredits = (body.slideCount && body.slideCount > 6) ? 3 : 2;

      // 1. Validação de Limite de Crédito
      const creditCheck = await checkCredits(userId, requiredCredits);
      if (!creditCheck.allowed) {
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            message: creditCheck.error,
            required: requiredCredits,
            balance: creditCheck.balance,
          },
          { status: 402, headers: corsHeaders() }
        );
      }

      // 2. Prompt Estruturado para o Modelo Claude Sonnet
      const prompt = `Você é um copywriter sênior especialista em carrosséis educativos de alto impacto e conversão para Instagram e LinkedIn.
Gere um carrossel completo com ${body.slideCount || 6} slides sobre o tema: "${body.topic || 'Dicas de alta performance'}".
Objetivo: ${body.goal || 'Educar e engajar'}
Público-alvo: ${body.audience || 'Geral'}
Tom de voz: ${body.tone || 'Profissional e magnético'}
Idioma: ${body.language || 'Português'}
${body.includeCTA ? 'O último slide DEVE ser um Call To Action (CTA) claro e persuasivo.' : ''}

Retorne ESTRITAMENTE um array JSON de slides no seguinte formato:
[
  { "title": "Título impactante da capa", "body": "Subtítulo chamativo", "kind": "cover" },
  { "title": "Título do slide 2", "body": "Texto claro com valor prático", "kind": "slide" },
  ...
  { "title": "Chamada final", "body": "Instrução para curtir, salvar ou comentar", "kind": "cta", "cta": "Salva este post para consultar depois!" }
]`;

      const aiRes = await callOpenRouter(
        [
          { role: 'system', content: 'Você é um assistente especialista que responde apenas em JSON válido.' },
          { role: 'user', content: prompt },
        ],
        'carousel'
      );

      let slides = [];
      try {
        const cleaned = aiRes.text.replace(/```json/g, '').replace(/```/g, '').trim();
        slides = JSON.parse(cleaned);
      } catch {
        slides = [
          { title: body.topic || 'Dica Estratégica', body: aiRes.text.slice(0, 200), kind: 'cover' },
          { title: 'Conclusão', body: 'Aplique hoje mesmo na sua rotina.', kind: 'cta', cta: 'Salvar' }
        ];
      }

      // 3. Dedução de Créditos
      const deductRes = await deductCredits(
        userId,
        requiredCredits,
        `Geração de Copy Carrossel (${body.topic?.slice(0, 30) || 'Geral'})`
      );

      return NextResponse.json(
        { slides, credits_used: requiredCredits, balance: deductRes.balance },
        { headers: corsHeaders() }
      );
    } catch (err: any) {
      console.error('generate-design-copy error:', err);
      return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
    }
  }

  // B) Agente de Conteúdo (Legendas, Roteiros, Hashtags)
  if (targetPath === 'functions/v1/ai-agent-content') {
    try {
      const body = await req.json();
      const userId = extractUserId(req, body);
      const requiredCredits = 1;

      // 1. Validação de Limite de Crédito
      const creditCheck = await checkCredits(userId, requiredCredits);
      if (!creditCheck.allowed) {
        return NextResponse.json(
          {
            error: creditCheck.error,
            required: requiredCredits,
            balance: creditCheck.balance,
          },
          { status: 402, headers: corsHeaders() }
        );
      }

      const prompt = `Você é o estrategista de conteúdo da agência.
Crie o conteúdo para o formato "${body.targetFormat || 'feed'}".
Temas e referências: ${JSON.stringify(body.userThemes || 'Conteúdo relevante e engajador')}.
${body.contentType ? `Tipo: ${body.contentType}` : ''}

Você DEVE estruturar sua resposta exatamente com estas seções:
TITULO: [Título chamativo para o post]
LEGENDA: [Legenda completa, engajadora, com quebras de linha e gatilhos mentais]
ROTEIRO: [Roteiro passo a passo com gancho, desenvolvimento e desfecho]
BRIEFING: [Diretriz visual para a criação da imagem ou vídeo]
HASHTAGS: [#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5]`;

      const aiRes = await callOpenRouter(
        [
          { role: 'system', content: 'Você é um copywriter de elite especialista em redes sociais.' },
          { role: 'user', content: prompt },
        ],
        'copy_post'
      );

      // Dedução de créditos
      await deductCredits(
        userId,
        requiredCredits,
        `Geração de Conteúdo IA (${body.targetFormat || 'Post'})`
      );

      // O front-end qe() lê em streaming SSE (data: ...) ou plain text por linhas
      const responseText = aiRes.text;
      const sseStream = `data: ${JSON.stringify({ text: responseText })}\n\ndata: [DONE]\n\n`;

      return new NextResponse(sseStream, {
        headers: {
          ...corsHeaders(),
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } catch (err: any) {
      console.error('ai-agent-content error:', err);
      return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
    }
  }

  // C) Sugestão de Prompt Visual para Design (ai-design-text)
  if (targetPath === 'functions/v1/ai-design-text') {
    try {
      const body = await req.json();
      const userId = extractUserId(req, body);
      const requiredCredits = 1;

      const creditCheck = await checkCredits(userId, requiredCredits);
      if (!creditCheck.allowed) {
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            message: creditCheck.error,
            required: requiredCredits,
            balance: creditCheck.balance,
          },
          { status: 402, headers: corsHeaders() }
        );
      }

      const prompt = `Crie um prompt visual descritivo e fotorrealista para uma arte de design baseada no seguinte conteúdo:
Texto do slide: "${body.slideText || ''}"
Contexto: "${body.carouselContext || ''}"
Formato: "${body.format || 'post'}"
Retorne apenas o texto do prompt em português, claro e detalhado para imagem fotográfica ou 3D conceitual.`;

      const aiRes = await callOpenRouter(
        [
          { role: 'system', content: 'Você é um diretor de arte e engenheiro de prompts para imagens.' },
          { role: 'user', content: prompt },
        ],
        'image_prompt'
      );

      await deductCredits(userId, requiredCredits, 'Geração de Prompt Visual para Design');

      return NextResponse.json(
        { text: aiRes.text.trim(), prompt: aiRes.text.trim() },
        { headers: corsHeaders() }
      );
    } catch (err: any) {
      console.error('ai-design-text error:', err);
      return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
    }
  }

  // D) Chat com Assistente do CRM (dgflow-assistant / dgflow-agent)
  if (targetPath === 'functions/v1/dgflow-assistant' || targetPath === 'functions/v1/dgflow-agent') {
    try {
      const body = await req.json();
      const userId = extractUserId(req, body);
      const requiredCredits = 1;

      const creditCheck = await checkCredits(userId, requiredCredits);
      if (!creditCheck.allowed) {
        return NextResponse.json(
          {
            reply: creditCheck.error,
            error: 'insufficient_credits',
            balance: creditCheck.balance,
          },
          { headers: corsHeaders() }
        );
      }

      const userMessage = body.message || body.input || 'Olá!';
      const currentRoute = body.current_route || '/';

      const promptMessages = [
        {
          role: 'system' as const,
          content: `Você é o Tenno Assistant, o agente inteligente integrado ao Tenno Flow (CRM para freelancers e agências).
Você ajuda o usuário a organizar leads, projetos, clientes, tarefas, propostas e financeiro.
Página atual do usuário: ${currentRoute}.
Seja sempre simpático, objetivo, proativo e responda em português brasileiro com formatação agradável e markdown limpo.`,
        },
        { role: 'user' as const, content: userMessage },
      ];

      const aiRes = await callOpenRouter(promptMessages, 'assistant');

      await deductCredits(userId, requiredCredits, 'Mensagem com Assistente Tenno Flow');

      return NextResponse.json(
        {
          reply: aiRes.text,
          segments: [aiRes.text],
          conversation_id: body.conversation_id || `conv_${Date.now()}`,
          actions: [],
        },
        { headers: corsHeaders() }
      );
    } catch (err: any) {
      console.error('dgflow-assistant error:', err);
      return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
    }
  }

  // E) Analista de BI e Performance (admin-ai-analyst)
  if (targetPath === 'functions/v1/admin-ai-analyst') {
    try {
      const body = await req.json();
      const userId = extractUserId(req, body);
      const requiredCredits = 3;

      const creditCheck = await checkCredits(userId, requiredCredits);
      if (!creditCheck.allowed) {
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            message: creditCheck.error,
            required: requiredCredits,
            balance: creditCheck.balance,
          },
          { status: 402, headers: corsHeaders() }
        );
      }

      const prompt = `Você é um CFO e estrategista de operações de agências e negócios digitais.
Analise os seguintes dados e gere um diagnóstico executivo focado em decisões práticas, gargalos operacionais e oportunidades de crescimento:
Dados: ${JSON.stringify(body)}`;

      const aiRes = await callOpenRouter(
        [
          { role: 'system', content: 'Você é um consultor executivo sênior de BI e finanças.' },
          { role: 'user', content: prompt },
        ],
        'analyst'
      );

      await deductCredits(userId, requiredCredits, 'Diagnóstico e Relatório de BI Executivo');

      return NextResponse.json(
        { analysis: aiRes.text, report: aiRes.text },
        { headers: corsHeaders() }
      );
    } catch (err: any) {
      console.error('admin-ai-analyst error:', err);
      return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
    }
  }

  // ==========================================
  // 3. PASSTHROUGH PADRÃO PARA O SUPABASE REST / STORAGE
  // ==========================================
  const targetUrl = `${SUPABASE_URL}/${targetPath}${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (!['host', 'connection', 'content-length', 'accept-encoding'].includes(lower)) {
      headers.set(key, value);
    }
  });

  // Anexa a service role key do Supabase com segurança no backend
  headers.set('apikey', SERVICE_KEY);
  headers.set('Authorization', `Bearer ${SERVICE_KEY}`);

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer();

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (!['content-encoding', 'content-length'].includes(lower)) {
        resHeaders.set(key, value);
      }
    });

    resHeaders.set('Access-Control-Allow-Origin', '*');
    resHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    resHeaders.set('Access-Control-Allow-Headers', '*');

    const resBody = await response.arrayBuffer();
    return new NextResponse(resBody, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (err: any) {
    console.error('Supabase proxy error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function HEAD(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, context.params);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}
