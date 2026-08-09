import React, { useRef, useEffect } from 'react';
import { UserProfile } from '@cagent/shared';
import { 
  Settings, 
  Bot, 
  Palette, 
  FileText, 
  ShieldCheck, 
  Github, 
  Globe, 
  LogOut, 
  Copy, 
  Check 
} from 'lucide-react';

interface UserProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onOpenPreferences: () => void;
  onOpenThemeModal: () => void;
}

export function UserProfilePopover({
  isOpen,
  onClose,
  userProfile,
  onOpenPreferences,
  onOpenThemeModal,
}: UserProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('ana.silva@deco.cx');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={popoverRef}
      className="absolute bottom-16 left-3 z-50 w-72 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl p-2.5 flex flex-col gap-1.5 text-xs animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header User Card (Linear Style) */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 truncate">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shrink-0"
          />
          <div className="truncate">
            <span className="font-heading font-bold text-sm text-white block truncate">
              {userProfile.name}
            </span>
            <span className="text-[11px] text-slate-400 block truncate font-mono-tech">
              ana.silva@deco.cx
            </span>
          </div>
        </div>

        <button 
          onClick={handleCopyEmail}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          title="Copiar e-mail"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Menu Actions (Linear Style) */}
      <div className="flex flex-col gap-0.5 py-1">
        <button
          onClick={() => {
            onClose();
            onOpenPreferences();
          }}
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Preferências de Contexto</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onOpenThemeModal();
          }}
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
        >
          <Palette className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Aparência & Temas</span>
        </button>

        <a
          href="https://github.com/pedroffeitosa/cagent"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
        >
          <Github className="w-4 h-4 text-slate-400" />
          <span className="font-medium">pedroffeitosa/cagent</span>
        </a>

        <a
          href="https://deco.cx"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
        >
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="font-medium">Comunidade Deco</span>
        </a>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 px-3 pb-1 flex items-center justify-between text-[10px] text-slate-500 font-mono-tech">
        <span>$Agent Commerce</span>
        <span>v1.0.0-hackathon</span>
      </div>
    </div>
  );
}
