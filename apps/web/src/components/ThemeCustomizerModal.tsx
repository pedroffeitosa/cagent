import React from 'react';
import { useTheme, ThemePreset } from './ThemeProvider';
import { Palette, X, Check, ShieldCheck, Sun, Moon, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCustomizerModal({ isOpen, onClose }: ThemeCustomizerModalProps) {
  const { themePreset, setThemePreset } = useTheme();

  if (!isOpen) return null;

  const presets: { id: ThemePreset; name: string; description: string; icon: React.ReactNode; isDefault?: boolean }[] = [
    {
      id: 'default',
      name: 'Deco Banking Dark (Padrão)',
      description: 'Estética clássica de fintech com fundo escuro profundo e acentos esmeralda.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      isDefault: true,
    },
    {
      id: 'light',
      name: 'Deco Light Minimalist',
      description: 'Interface clara, limpa e minimalista de alta visibilidade.',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'midnight',
      name: 'Midnight Cyber',
      description: 'Fundo azul noturno profundo com destaques em ciano tech.',
      icon: <Moon className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: 'royal',
      name: 'Royal Luxury',
      description: 'Fundo roxo nobre com destaques dourados para ocasiões premium.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-base text-foreground">Selecionar Tema do $Agent</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Presets List */}
        <div className="flex flex-col gap-3">
          {presets.map((preset) => {
            const isActive = themePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setThemePreset(preset.id)}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-4 text-left transition ${
                  isActive
                    ? 'border-primary bg-primary/10 text-foreground font-medium shadow-md'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-background border border-border shrink-0 mt-0.5">
                    {preset.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-foreground">{preset.name}</span>
                      {preset.isDefault && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-tech">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-border" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <Button onClick={onClose} className="w-full py-3">
          Aplicar Tema Escolhido
        </Button>
      </div>
    </div>
  );
}
