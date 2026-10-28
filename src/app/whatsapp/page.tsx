'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  MessageSquare,
  Search,
  Send,
  Phone,
  CheckCheck,
  Paperclip,
  Smile,
  Bot,
  QrCode,
  ShieldCheck,
  User,
  DollarSign,
} from 'lucide-react';
import { INITIAL_CONTACTS, INITIAL_MESSAGES } from '@/lib/store';
import { WhatsAppContact, WhatsAppMessage } from '@/lib/types';

export default function WhatsAppPage() {
  const [contacts, setContacts] = useState<WhatsAppContact[]>(INITIAL_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact>(INITIAL_CONTACTS[0]);
  const [messages, setMessages] = useState<Record<string, WhatsAppMessage[]>>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [search, setSearch] = useState('');

  const currentMessages = messages[selectedContact.id] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: `msg-${Date.now()}`,
      contact_id: selectedContact.id,
      sender: 'user',
      message_text: inputMessage,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages({
      ...messages,
      [selectedContact.id]: [...currentMessages, newMsg],
    });

    setInputMessage('');
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1f1f1f] mb-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              WhatsApp CRM Integrado
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                ● Conectado (Evolution API)
              </span>
            </h1>
            <p className="text-xs text-[#8e8e8e]">Centralize atendimento de múltiplos colaboradores sem perder histórico</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#222222] text-[#aaaaaa] px-3 py-1.5 rounded-xl text-xs font-medium transition-all">
              <QrCode className="w-3.5 h-3.5 text-[#e8363b]" />
              Conectar Outro Número
            </button>
          </div>
        </div>

        {/* WhatsApp App Container */}
        <div className="flex-1 bg-[#111111] border border-[#1f1f1f] rounded-2xl overflow-hidden flex shadow-xl">
          {/* Left Panel: Contacts List */}
          <div className="w-80 md:w-96 border-r border-[#1f1f1f] flex flex-col bg-[#0d0d0d]">
            {/* Search */}
            <div className="p-3 border-b border-[#1a1a1a]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar conversa ou número..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#171717] border border-[#222222] focus:border-[#e8363b] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#666666] outline-none"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#171717]">
              {filteredContacts.map((contact) => {
                const isSelected = contact.id === selectedContact.id;
                return (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#1a1a1a]' : 'hover:bg-[#141414]'
                    }`}
                  >
                    <div className="relative">
                      {contact.avatar_url ? (
                        <img
                          src={contact.avatar_url}
                          alt={contact.name}
                          className="w-11 h-11 rounded-full object-cover border border-[#262626]"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-[#222222] flex items-center justify-center font-bold text-xs text-white">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-[#0d0d0d]"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white truncate">{contact.name}</span>
                        <span className="text-[10px] text-[#666666]">{contact.last_message_at}</span>
                      </div>
                      <p className="text-[11px] text-[#8e8e8e] truncate">{contact.last_message_text}</p>
                    </div>

                    {contact.unread_count > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#e8363b] text-white text-[9px] font-bold flex items-center justify-center">
                        {contact.unread_count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Chat Area */}
          <div className="flex-1 flex flex-col bg-[#0a0a0a]">
            {/* Chat Header */}
            <div className="h-16 px-5 border-b border-[#1f1f1f] bg-[#0e0e0e] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#222222] overflow-hidden">
                  {selectedContact.avatar_url && (
                    <img src={selectedContact.avatar_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">{selectedContact.name}</h2>
                  <span className="text-[10px] text-emerald-400 font-medium">online no WhatsApp</span>
                </div>
              </div>

              {/* Quick CRM Info */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-[#1a1a1a] text-[#8e8e8e] px-2.5 py-1 rounded-lg border border-[#262626]">
                  {selectedContact.phone}
                </span>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-semibold flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Lead Ativo
                </span>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-[radial-gradient(#181818_1px,transparent_1px)] [background-size:16px_16px]">
              {currentMessages.map((msg) => {
                const isMe = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-[#e8363b] text-white rounded-tr-none'
                          : 'bg-[#181818] border border-[#262626] text-[#ededed] rounded-tl-none'
                      }`}
                    >
                      <p>{msg.message_text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-75">
                        <span>{msg.created_at}</span>
                        {isMe && <CheckCheck className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#0e0e0e] border-t border-[#1f1f1f] flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-[#8e8e8e] hover:text-white transition-colors"
              >
                <Smile className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 text-[#8e8e8e] hover:text-white transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                placeholder="Digite uma mensagem ou comando de IA..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-[#171717] border border-[#222222] focus:border-[#e8363b] rounded-xl px-4 py-2 text-xs text-white outline-none"
              />

              <button
                type="submit"
                className="bg-[#e8363b] hover:bg-[#d42d32] text-white p-2.5 rounded-xl transition-all shadow-md shadow-[#e8363b]/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
