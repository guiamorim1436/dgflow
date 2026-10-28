'use client';

import React, { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Check, Edit3, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import confetti from 'canvas-confetti';

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function ApprovalContent() {
  const params = useParams();
  const token = params?.token as string;

  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleApprove = () => {
    setStatus('approved');
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#ffffff', '#e8363b'],
    });
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('rejected');
    setShowFeedbackModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-between p-4 sm:p-6 md:p-10">
      {/* Top Header */}
      <header className="w-full max-w-xl flex items-center justify-between py-4 border-b border-[#1f1f1f] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#e8363b] flex items-center justify-center font-bold text-sm text-white">
            DG
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Portal de Aprovação</h1>
            <p className="text-[11px] text-[#8e8e8e]">Bella Estética Integrada</p>
          </div>
        </div>

        <div className="text-[11px] bg-[#1a1a1a] border border-[#2b2b2b] text-[#aaaaaa] px-2.5 py-1 rounded-full">
          Ref: {token ? token.slice(0, 12) : 'demo'}
        </div>
      </header>

      {/* Instagram Post Simulator */}
      <main className="w-full max-w-md bg-[#121212] border border-[#222222] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Post Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#1c1c1c]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px]">
              <div className="w-full h-full bg-[#121212] rounded-full flex items-center justify-center text-xs font-bold text-white">
                BE
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">bellaestetica.oficial</span>
              <span className="text-[10px] text-[#8e8e8e]">São Paulo, Brasil</span>
            </div>
          </div>
          <InstagramIcon className="w-4 h-4 text-[#8e8e8e]" />
        </div>

        {/* Media Preview */}
        <div className="relative aspect-square bg-black overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"
            alt="Preview do Post"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Post Actions Bar */}
        <div className="p-4 pb-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 cursor-pointer" />
            <MessageCircle className="w-5 h-5 cursor-pointer text-[#8e8e8e]" />
            <Send className="w-5 h-5 cursor-pointer text-[#8e8e8e]" />
          </div>
          <Bookmark className="w-5 h-5 cursor-pointer text-[#8e8e8e]" />
        </div>

        {/* Caption */}
        <div className="px-4 pb-6 pt-1 text-xs space-y-2">
          <p className="font-semibold text-white">2.418 curtidas</p>
          <p className="text-[#d4d4d4] leading-relaxed">
            <span className="font-bold text-white mr-2">bellaestetica.oficial</span>
            Você trabalha o dia inteiro mas sente que os clientes não aumentam? Veja este carrossel até o fim e descubra o gargalo invisível que trava seu faturamento diário.
          </p>
          <p className="text-[#8e8e8e] text-[11px]">
            #estetica #gestaoclinica #empreendedorismo #belezaesaude
          </p>
        </div>
      </main>

      {/* Decision Bar */}
      <footer className="w-full max-w-xl mt-8 pt-6 border-t border-[#1f1f1f]">
        {status === 'approved' ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
            <Check className="w-5 h-5" />
            Post Aprovado com Sucesso! Ele já foi enviado para agendamento.
          </div>
        ) : status === 'rejected' ? (
          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-center gap-2 text-amber-400 font-medium text-xs">
            Ajustes solicitados. Nossa equipe já recebeu seus comentários para revisão.
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2b2b2b] text-white py-3.5 rounded-2xl text-xs font-semibold transition-all"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              Solicitar Ajustes
            </button>

            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02]"
            >
              <Check className="w-4 h-4" />
              Aprovar Publicação
            </button>
          </div>
        )}
      </footer>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2b2b2b] rounded-2xl w-full max-w-md p-6">
            <h2 className="text-base font-bold text-white mb-1">O que você gostaria de ajustar?</h2>
            <p className="text-xs text-[#8e8e8e] mb-4">
              Descreva detalhadamente o que deve ser modificado no texto ou na imagem.
            </p>

            <form onSubmit={handleReject} className="space-y-4">
              <textarea
                required
                rows={4}
                placeholder="Ex.: Trocar a imagem do slide 2 e alterar o horário do atendimento no texto..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-[#262626] focus:border-amber-400 rounded-xl p-3 text-xs text-white outline-none resize-none"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-xs text-[#8e8e8e] hover:text-white"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Enviar Ajustes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicApprovalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center text-xs">Carregando portal de aprovação...</div>}>
      <ApprovalContent />
    </Suspense>
  );
}
