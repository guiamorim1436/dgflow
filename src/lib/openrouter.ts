const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || Buffer.from('c2stb3ItdjEtZjY4YzA4M2UzYzE0MDQyYjg1NDRhZmE4ZmNhMDlkZWU4YjAzMjNmNzY4ZWI5YjhkNzQ0NmMyOTI2YzVkZmQxZQ==', 'base64').toString('utf8');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export type AiTaskType = 'assistant' | 'copy_post' | 'carousel' | 'image_prompt' | 'analyst';

/**
 * Seleção do modelo mais adequado e custo-eficiente por tarefa
 */
export function getModelForTask(task: AiTaskType): string {
  switch (task) {
    case 'assistant':
      // Agente do CRM & Chat: ultrarrápido, conversação natural
      return 'anthropic/claude-haiku-5.5';
    case 'carousel':
    case 'copy_post':
      // Copywriting, storytelling e carrosséis: tom humano, estrutura profissional
      return 'anthropic/claude-sonnet-5.5';
    case 'image_prompt':
      // Geração de descrições e prompts conceituais para design
      return 'openai/gpt-4o-mini';
    case 'analyst':
      // BI, métricas financeiras e relatórios analíticos
      return 'openai/gpt-4o';
    default:
      return 'openai/gpt-4o-mini';
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  text: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost?: number;
  };
  creditsConsumed: number;
}

/**
 * Executa a chamada na OpenRouter e calcula a equivalência de créditos (R$ 0,50 = 1 crédito)
 */
export async function callOpenRouter(
  messages: ChatMessage[],
  task: AiTaskType,
  options?: { maxTokens?: number; temperature?: number; modelOverride?: string }
): Promise<OpenRouterResponse> {
  const model = options?.modelOverride || getModelForTask(task);

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://tennoflow.com.br',
      'X-Title': 'Tenno Flow AI',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: options?.maxTokens || 1500,
      temperature: options?.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    console.error('OpenRouter Error:', res.status, errBody);
    throw new Error(`OpenRouter error: ${res.status} - ${errBody}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const costUsd = data.usage?.cost || 0;

  // Conversão de moeda: Câmbio USD/BRL ~ 5.80
  const costBrl = costUsd * 5.80;

  // Regra base: R$ 0,50 na OpenRouter consome 1 crédito
  const calculatedCredits = Math.ceil(costBrl / 0.50);

  // Consumo mínimo por tipo de tarefa para cobrir custos de infraestrutura e garantir sustentabilidade
  const minCreditsMap: Record<AiTaskType, number> = {
    assistant: 1,
    copy_post: 1,
    carousel: 2,
    image_prompt: 1,
    analyst: 3,
  };

  const finalCredits = Math.max(minCreditsMap[task] || 1, calculatedCredits);

  return {
    text,
    usage: data.usage,
    creditsConsumed: finalCredits,
  };
}
