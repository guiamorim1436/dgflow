'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Bot,
  Sparkles,
  Key,
  Wand2,
  FileText,
  BarChart3,
  Palette,
  Send,
  Copy,
  Check,
  ShieldAlert,
} from 'lucide-react';

export default function AiAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<'copy' | 'analyst' | 'designer'>('copy');
  const [promptInput, setPromptInput] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput) return;

    setIsGenerating(true);
    setTimeout(() => {
      if (selectedAgent === 'copy') {
        setOutput(
          `✨ [COPY PRONTA PARA INSTAGRAM - FORMATO CARROSSEL]\n\n` +
          `📌 GANCHO (Slide 1):\n` +
          `"Você passa o dia inteiro ocupado, mas chega no fim do mês sem ver a cor do lucro?"\n\n` +
          `💡 DESENVOLVIMENTO (Slides 2-4):\n` +
          `1. Ter muito cliente não significa ter margem alta. Se você cobra barato para fechar, você financia o cliente.\n` +
          `2. Planilhas desatualizadas escondem os ralos financeiros da sua agência.\n` +
          `3. O segredo dos negócios que escalam é previsibilidade e contrato com recorrência.\n\n` +
          `🎯 CHAMADA PARA AÇÃO (Slide 5):\n` +
          `"Comente 'DIAGNÓSTICO' abaixo e receba nosso checklist gratuito de precificação lucrativa no seu direct!"\n\n` +
          `#gestao #agenciasdemarketing #lucratividade #empreendedorismo`
        );
      } else if (selectedAgent === 'analyst') {
        setOutput(
          `📊 [DIAGNÓSTICO AUTOMÁTICO DO SEU FUNIL]\n\n` +
          `• Conversão de Leads: 50% (Excelente - benchmark é 25%).\n` +
          `• Ponto de Atenção: 12 leads estão há mais de 4 dias na etapa 'Novo Lead' sem follow-up inicial.\n` +
          `• Oportunidade Financeira: R$ 7.400 em cobranças com vencimento nesta semana. Recomendamos disparo automático de lembrete pelo WhatsApp 2 dias antes do vencimento.\n` +
          `• Ação Prioritária nº 1: Subir ticket médio dos novos contratos para R$ 4.200.`
        );
      } else {
        setOutput(
          `🎨 [DIREÇÃO DE ARTE & PROMPT VISUAL]\n\n` +
          `• Paleta Recomendada: Fundo Grafite #121212, Acentos Vermelho Carmim #E8363B e tipografia Branco #F2F2F2.\n` +
          `• Estilo Visual: Minimalista, editorial moderno, fotos em alta resolução com iluminação suave.\n` +
          `• Prompt Midjourney / Flux: "Professional modern creative agency workspace, clean aesthetics, subtle red neon accent, cinematic light, 8k, minimalistic --ar 4:5"`
        );
      }
      setIsGenerating(false);
    }, 1200);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Agentes de Inteligência Artificial
            <span className="text-[10px] bg-[#e8363b]/10 text-[#e8363b] border border-[#e8363b]/30 px-2 py-0.5 rounded-full font-semibold">
              BETA
            </span>
          </h1>
          <p className="text-xs text-[#8e8e8e]">
            Especialistas autônomos para redação de posts, diagnósticos de negócio e direção de arte
          </p>
        </div>

        {/* BYOK Status */}
        <div className="flex items-center gap-2 bg-[#141414] border border-[#222222] px-3.5 py-1.5 rounded-xl">
          <Key className="w-3.5 h-3.5 text-[#e8363b]" />
          <span className="text-xs text-[#aaaaaa]">Provedor: Google Gemini (Ativo)</span>
        </div>
      </div>

      {/* Agents Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setSelectedAgent('copy')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            selectedAgent === 'copy'
              ? 'bg-[#181818] border-[#e8363b] shadow-lg shadow-[#e8363b]/10'
              : 'bg-[#121212] border-[#1f1f1f] hover:border-[#2b2b2b]'
          }`}
        >
          <div className="p-2.5 w-fit rounded-xl bg-[#e8363b]/10 text-[#e8363b] mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Copywriter IA</h3>
          <p className="text-xs text-[#8e8e8e]">
            Cria legendas para feed, carrossel, roteiros de reels e copies de anúncios com ganchos de alta retenção.
          </p>
        </button>

        <button
          onClick={() => setSelectedAgent('analyst')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            selectedAgent === 'analyst'
              ? 'bg-[#181818] border-[#e8363b] shadow-lg shadow-[#e8363b]/10'
              : 'bg-[#121212] border-[#1f1f1f] hover:border-[#2b2b2b]'
          }`}
        >
          <div className="p-2.5 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-3">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Analista de Negócios</h3>
          <p className="text-xs text-[#8e8e8e]">
            Diagnostica gargalos no funil de vendas, tempo de resposta e sugere ações práticas de aumento de receita.
          </p>
        </button>

        <button
          onClick={() => setSelectedAgent('designer')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            selectedAgent === 'designer'
              ? 'bg-[#181818] border-[#e8363b] shadow-lg shadow-[#e8363b]/10'
              : 'bg-[#121212] border-[#1f1f1f] hover:border-[#2b2b2b]'
          }`}
        >
          <div className="p-2.5 w-fit rounded-xl bg-purple-500/10 text-purple-400 mb-3">
            <Palette className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Designer IA</h3>
          <p className="text-xs text-[#8e8e8e]">
            Estrutura identidade visual, paletas de cores e gera prompts fotográficos e 3D prontos para produção.
          </p>
        </button>
      </div>

      {/* Generation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Input Panel */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-[#e8363b]" />
              O que você gostaria de criar agora?
            </h2>
            <p className="text-xs text-[#8e8e8e] mb-4">
              Informe o cliente, o nicho, o objetivo da campanha ou o tema central.
            </p>

            <form onSubmit={handleGenerate}>
              <textarea
                required
                rows={6}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={
                  selectedAgent === 'copy'
                    ? 'Ex.: Crie um carrossel para uma clínica de estética sobre tratamentos preventivos para o verão, com gancho forte e CTA para agendamento no WhatsApp...'
                    : selectedAgent === 'analyst'
                    ? 'Ex.: Analise o desempenho dos últimos 30 dias do meu funil comercial e aponte os 3 maiores gargalos...'
                    : 'Ex.: Crie a direção visual e prompts de arte para um lançamento de marca de café gourmet premium...'
                }
                className="w-full bg-[#171717] border border-[#262626] focus:border-[#e8363b] rounded-xl p-3.5 text-xs text-white placeholder-[#666666] outline-none resize-none leading-relaxed"
              />

              <button
                type="submit"
                disabled={isGenerating || !promptInput}
                className="mt-4 w-full bg-[#e8363b] hover:bg-[#d42d32] disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#e8363b]/20 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <span>Processando com IA...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Conteúdo com {selectedAgent === 'copy' ? 'Copywriter' : selectedAgent === 'analyst' ? 'Analista' : 'Designer'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1f1f1f] mb-3">
              <span className="text-xs font-bold text-white">Resultado Gerado</span>
              {output && (
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1.5 text-xs text-[#8e8e8e] hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              )}
            </div>

            <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-4 min-h-[220px] max-h-[340px] overflow-y-auto text-xs text-[#ededed] whitespace-pre-wrap font-mono leading-relaxed">
              {output || (
                <span className="text-[#555555] italic">
                  O conteúdo gerado pela IA aparecerá aqui em tempo real...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bring Your Own Key (BYOK) Section */}
      <div className="bg-[#121212] border border-[#1f1f1f] p-6 rounded-2xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#1a1a1a] rounded-2xl border border-[#2b2b2b] text-[#e8363b]">
            <Key className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-1">
              Modo Chave Própria (BYOK - Google Gemini API)
            </h3>
            <p className="text-xs text-[#8e8e8e] mb-4 leading-relaxed">
              Conecte sua chave de API e utilize o modelo Gemini 1.5 Pro / Flash diretamente sem limites de créditos da plataforma.
            </p>

            <div className="flex items-center gap-3 max-w-lg">
              <input
                type="password"
                placeholder="Insira sua chave AIzaSy..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="flex-1 bg-[#171717] border border-[#262626] focus:border-[#e8363b] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
              <button
                onClick={() => setKeySaved(true)}
                className="bg-[#1f1f1f] hover:bg-[#2b2b2b] text-white px-4 py-2 rounded-xl text-xs font-semibold border border-[#333333] transition-colors"
              >
                {keySaved ? 'Salvo ✓' : 'Salvar Chave'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
