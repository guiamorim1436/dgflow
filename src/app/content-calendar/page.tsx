'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  CalendarDays,
  Plus,
  Share2,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

function InstagramIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}
import { INITIAL_POSTS } from '@/lib/store';
import { ContentItem } from '@/lib/types';
import Link from 'next/link';

export default function ContentCalendarPage() {
  const [posts, setPosts] = useState<ContentItem[]>(INITIAL_POSTS);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyApprovalLink = (token: string) => {
    const url = `${window.location.origin}/aprovar/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <AppShell>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Calendário & Produção de Conteúdo</h1>
          <p className="text-xs text-[#8e8e8e]">Fluxo editorial integrado com aprovação externa e agendamento Meta</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/ai-agents"
            className="flex items-center gap-1.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] text-white px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e8363b]" />
            Gerar com IA
          </Link>

          <button
            onClick={() => {
              const newPost: ContentItem = {
                id: `post-${Date.now()}`,
                title: 'Novo Post: Dicas Práticas de Gestão',
                client_name: 'Bella Estética Integrada',
                format: 'carousel',
                copy_text: 'Confira as melhores dicas para transformar sua rotina com processos claros e organizados.',
                current_step_id: 'copy',
                scheduled_date: new Date(Date.now() + 86400000 * 3).toISOString(),
                attachments: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800'],
                approval_token: `token-post-${Date.now()}`,
                status: 'Em Produção',
              };
              setPosts([newPost, ...posts]);
            }}
            className="flex items-center gap-1.5 bg-[#e8363b] hover:bg-[#d42d32] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-[#e8363b]/20 transition-all hover:scale-105"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo Post
          </button>
        </div>
      </div>

      {/* Grid of Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#121212] border border-[#1f1f1f] hover:border-[#2b2b2b] rounded-2xl overflow-hidden flex flex-col justify-between transition-all"
          >
            {/* Visual Attachment Preview */}
            <div className="relative aspect-video bg-[#0a0a0a] overflow-hidden">
              {post.attachments[0] && (
                <img
                  src={post.attachments[0]}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              )}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider">
                <InstagramIcon className="w-3 h-3 text-[#e8363b]" />
                {post.format}
              </div>

              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white font-medium">
                {new Date(post.scheduled_date).toLocaleDateString('pt-BR')}
              </div>
            </div>

            {/* Post Content & Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#e8363b] block mb-1">
                  {post.client_name}
                </span>
                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{post.title}</h3>
                <p className="text-xs text-[#8e8e8e] line-clamp-3 leading-relaxed mb-4">
                  {post.copy_text}
                </p>
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-4 border-t border-[#1c1c1c] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#666666] text-[11px]">Etapa do Fluxo:</span>
                  <span className="bg-[#1c1c1c] text-white font-medium px-2 py-0.5 rounded-md text-[11px] border border-[#2b2b2b]">
                    {post.current_step_id === 'aprovacao'
                      ? 'Aguardando Aprovação'
                      : post.current_step_id === 'agendado'
                      ? 'Agendado no Meta'
                      : post.current_step_id.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyApprovalLink(post.approval_token)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#171717] hover:bg-[#222222] border border-[#262626] text-xs font-medium text-white py-2 rounded-xl transition-colors"
                  >
                    {copiedToken === post.approval_token ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Link Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-[#8e8e8e]" />
                        <span>Link de Aprovação</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/aprovar/${post.approval_token}`}
                    target="_blank"
                    className="p-2 bg-[#171717] hover:bg-[#222222] border border-[#262626] rounded-xl text-[#8e8e8e] hover:text-white transition-colors"
                    title="Visualizar portal do cliente"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
