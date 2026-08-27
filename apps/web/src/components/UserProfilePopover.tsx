import React, { useRef, useEffect } from 'react';
import { UserProfile } from '@cagent/shared';
import { 
  Settings, 
  Palette, 
  FileText, 
  ShieldCheck, 
  Globe, 
  Home, 
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
    navigator.clipboard.writeText('jppfeitosa@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={popoverRef}
      className="absolute bottom-16 left-3 z-50 w-72 bg-card/95 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-2.5 flex flex-col gap-1.5 text-xs animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header User Card (Linear Style) */}
      <div className="p-3 rounded-xl bg-background/60 border border-border/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 truncate">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-10 h-10 rounded-xl object-cover border border-primary/40 shrink-0"
          />
          <div className="truncate">
            <span className="font-heading font-bold text-sm text-foreground block truncate">
              {userProfile.name}
            </span>
            <span className="text-[11px] text-muted-foreground block truncate font-mono-tech">
              jppfeitosa@gmail.com
            </span>
          </div>
        </div>

        <button 
          onClick={handleCopyEmail}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-elevated transition shrink-0"
          title="Copiar e-mail"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Menu Actions (Linear App Style) */}
      <div className="flex flex-col gap-0.5 py-1 border-t border-b border-border/80 my-1">
        <button
          onClick={() => {
            onClose();
            onOpenPreferences();
          }}
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-foreground hover:text-foreground hover:bg-elevated/80 transition"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Preferências</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onOpenThemeModal();
          }}
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-foreground hover:text-foreground hover:bg-elevated/80 transition"
        >
          <Palette className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Aparência</span>
        </button>

        <button
          onClick={onClose}
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-foreground hover:text-foreground hover:bg-elevated/80 transition"
        >
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Termos de uso</span>
        </button>

        <button
          onClick={onClose}
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-foreground hover:text-foreground hover:bg-elevated/80 transition"
        >
          <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Política de privacidade</span>
        </button>

        <a
          href="https://deco.cx"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-foreground hover:text-foreground hover:bg-elevated/80 transition"
        >
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Comunidade $Agent</span>
        </a>

        <button
          onClick={onClose}
          className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-foreground hover:text-foreground hover:bg-elevated/80 transition"
        >
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">Página inicial</span>
        </button>
      </div>

      <button
        onClick={onClose}
        className="w-full px-3 py-2 rounded-xl text-left flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
      >
        <LogOut className="w-4 h-4 text-red-400" />
        <span className="font-medium">Sair</span>
      </button>

      {/* Footer Info */}
      <div className="pt-2 border-t border-border/80 px-3 pb-0.5 flex items-center justify-between text-[10px] text-faint font-mono-tech">
        <span>$Agent Commerce</span>
        <span>v4.193.3</span>
      </div>
    </div>
  );
}
