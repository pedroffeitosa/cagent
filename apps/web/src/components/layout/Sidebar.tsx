import React from 'react';
import { UserProfile } from '@cagent/shared';
import {
  ChevronRight,
  ChevronLeft,
  MessageSquare,
  Plus,
  X,
  SlidersHorizontal,
  History,
  ChevronDown,
  ChevronUp,
  Home,
} from 'lucide-react';
import { UserProfilePopover } from '../UserProfilePopover';
import { handleImageError } from '../../utils/imageFallback';
import { ChatSession, MainViewType } from '../../types/chat';

interface SidebarProps {
  activeMainView: MainViewType;
  onNavigateHome: () => void;
  isSidebarCollapsed: boolean;
  onToggleCollapse: () => void;
  isSidebarOpen: boolean;
  onCloseMobile: () => void;
  onBackToLanding: () => void;
  onNewChat: () => void;
  activeSession?: ChatSession;
  pastSessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
  showPastChats: boolean;
  onToggleShowPastChats: () => void;
  userProfile: UserProfile;
  isProfilePopoverOpen: boolean;
  onToggleProfilePopover: () => void;
  onCloseProfilePopover: () => void;
  onOpenPreferences: () => void;
  onOpenThemeModal: () => void;
}

export function Sidebar({
  activeMainView,
  onNavigateHome,
  isSidebarCollapsed,
  onToggleCollapse,
  isSidebarOpen,
  onCloseMobile,
  onBackToLanding,
  onNewChat,
  activeSession,
  pastSessions,
  onSelectSession,
  showPastChats,
  onToggleShowPastChats,
  userProfile,
  isProfilePopoverOpen,
  onToggleProfilePopover,
  onCloseProfilePopover,
  onOpenPreferences,
  onOpenThemeModal,
}: SidebarProps) {
  return (
    <aside
      className={`bg-card/70 backdrop-blur-xl border-r border-border/80 flex flex-col justify-between transition-all duration-300 z-20 relative ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      } ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Logo Section (Clicking $Agent or $A returns to Home) */}
      <div className={`h-16 border-b border-border/80 flex items-center shrink-0 ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={onNavigateHome}
          title="Voltar para Início (Loja $Agent)"
        >
          <span className="logo-agent-financial text-2xl tracking-tighter transition-all group-hover:opacity-90">
            {isSidebarCollapsed ? '$A' : '$Agent'}
          </span>
        </div>

        {/* Desktop Collapse / Expand Toggle Button (< or >) */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-elevated/80 transition"
          title={isSidebarCollapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-primary" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-muted-foreground hover:text-foreground p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Back to Landing Page Link */}
      {!isSidebarCollapsed && (
        <button
          onClick={onBackToLanding}
          title="Voltar para a página inicial do projeto"
          className="mx-3 mt-3 text-left text-[10px] text-faint hover:text-primary transition font-mono-tech shrink-0"
        >
          ← Sobre o $Agent
        </button>
      )}

      {/* Bottom-Aligned Controls (Página Inicial + Nova conversa + Chat Atual + Chats Anteriores) */}
      <div className="flex-1 flex flex-col justify-end p-3 gap-2 overflow-y-auto custom-scrollbar">

        {/* Home Button */}
        <button
          onClick={onNavigateHome}
          title="Página Inicial da Loja"
          className={`w-full py-2.5 rounded-2xl border transition shadow-sm font-semibold text-xs tracking-wide flex items-center gap-2 ${
            activeMainView === 'home'
              ? 'bg-elevated border-primary/40 text-primary'
              : 'bg-background/40 border-border/80 text-muted-foreground hover:text-foreground hover:bg-elevated/50'
          } ${isSidebarCollapsed ? 'justify-center px-0' : 'px-4'}`}
        >
          <Home className="w-4 h-4 text-primary shrink-0" />
          {!isSidebarCollapsed && <span>Página Inicial</span>}
        </button>

        {/* New Chat Button (Gemini Style Subtle) */}
        <button
          onClick={onNewChat}
          title="Conversar com $Agent IA"
          className={`w-full py-2.5 rounded-2xl bg-background/60 border border-border/80 hover:border-primary/40 text-foreground hover:text-foreground font-semibold text-xs tracking-wide flex items-center gap-2 hover:bg-elevated/50 transition shadow-sm ${
            isSidebarCollapsed ? 'justify-center px-0' : 'px-4'
          }`}
        >
          <Plus className="w-4 h-4 text-primary shrink-0" />
          {!isSidebarCollapsed && <span>Nova conversa</span>}
        </button>

        {/* Active Current Chat */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-2 text-[11px] font-mono-tech text-faint uppercase tracking-wider">
            Chat com IA
          </div>
        )}

        {activeSession && (
          <button
            title={activeSession.title}
            onClick={() => onSelectSession(activeSession.id)}
            className={`w-full text-left rounded-xl text-xs flex items-center transition group ${
              activeMainView === 'chat'
                ? 'bg-elevated text-primary font-medium border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-elevated/50'
            } ${isSidebarCollapsed ? 'justify-center p-3' : 'p-3 gap-3'}`}
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-primary" />
            {!isSidebarCollapsed && (
              <div className="truncate flex-1">
                <span className="truncate block font-medium text-foreground">{activeSession.title}</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">{activeSession.timestamp}</span>
              </div>
            )}
          </button>
        )}

        {/* Past Chats Collapsible Section */}
        {pastSessions.length > 0 && !isSidebarCollapsed && (
          <div className="pt-2 border-t border-border/60 flex flex-col gap-1">
            <button
              onClick={onToggleShowPastChats}
              className="w-full px-3 py-1.5 rounded-xl text-left flex items-center justify-between text-xs text-muted-foreground hover:text-foreground hover:bg-elevated/40 transition font-medium"
            >
              <div className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-faint" />
                <span>Chats anteriores ({pastSessions.length})</span>
              </div>
              {showPastChats ? <ChevronUp className="w-3.5 h-3.5 text-faint" /> : <ChevronDown className="w-3.5 h-3.5 text-faint" />}
            </button>

            {/* Past Chats Dropdown */}
            {showPastChats && (
              <div className="flex flex-col gap-1 pl-2 pt-1 animate-in fade-in duration-150">
                {pastSessions.map((session) => (
                  <button
                    key={session.id}
                    title={session.title}
                    onClick={() => onSelectSession(session.id)}
                    className="w-full text-left rounded-xl p-2.5 text-xs flex items-center gap-2.5 text-muted-foreground hover:text-foreground hover:bg-elevated/50 transition group"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-faint group-hover:text-foreground shrink-0" />
                    <div className="truncate flex-1">
                      <span className="truncate block font-medium text-foreground">{session.title}</span>
                      <span className="text-[10px] text-faint block">{session.timestamp}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Bottom User Account Popover Trigger */}
      <div className="p-3 border-t border-border/80 relative">
        <button
          onClick={onToggleProfilePopover}
          title={`Meu Perfil: ${userProfile.name}`}
          className={`w-full rounded-2xl bg-background/80 border border-border/80 hover:border-primary/40 text-left flex items-center transition group ${
            isSidebarCollapsed ? 'justify-center p-2.5' : 'p-3 justify-between gap-3'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-9 h-9 rounded-xl object-cover border border-primary/40 shrink-0"
              onError={handleImageError}
            />
            {!isSidebarCollapsed && (
              <div className="truncate">
                <span className="text-xs font-bold text-foreground block truncate">{userProfile.name}</span>
                <span className="text-[10px] text-primary font-medium block">
                  VIP • Saldo: R$ {(userProfile.walletBalance || 42.50).toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <SlidersHorizontal className="w-4 h-4 text-faint group-hover:text-primary transition shrink-0" />
          )}
        </button>

        {/* Linear-Style User Popover */}
        <UserProfilePopover
          isOpen={isProfilePopoverOpen}
          onClose={onCloseProfilePopover}
          userProfile={userProfile}
          onOpenPreferences={onOpenPreferences}
          onOpenThemeModal={onOpenThemeModal}
        />
      </div>
    </aside>
  );
}
