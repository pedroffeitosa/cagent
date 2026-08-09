import React from 'react';
import { useTheme, ThemeMode, AccentColor } from './ThemeProvider';
import { Sun, Moon, Laptop, Palette, X, Check } from 'lucide-react';
import { Button } from './ui/button';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeCustomizerModal({ isOpen, onClose }: ThemeCustomizerModalProps) {
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();

  if (!isOpen) return null;

  const modeOptions: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'light', label: 'Claro', icon: <Sun className="w-4 h-4" /> },
    { mode: 'dark', label: 'Escuro', icon: <Moon className="w-4 h-4" /> },
    { mode: 'system', label: 'Automático', icon: <Laptop className="w-4 h-4" /> },
  ];

  const colorOptions: { color: AccentColor; label: string; bgClass: string }[] = [
    { color: 'emerald', label: 'Esmeralda', bgClass: 'bg-emerald-500' },
    { color: 'gold', label: 'Ouro Fintech', bgClass: 'bg-amber-400' },
    { color: 'cyan', label: 'Ciano Tech', bgClass: 'bg-cyan-400' },
    { color: 'purple', label: 'Roxo Royal', bgClass: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-base text-foreground">Aparência & Tema (shadcn)</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector (Light / Dark / System) */}
        <div>
          <label className="text-foreground font-semibold block mb-2">Modo Visual</label>
          <div className="grid grid-cols-3 gap-2">
            {modeOptions.map(({ mode, label, icon }) => {
              const isActive = themeMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setThemeMode(mode)}
                  className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-md'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-slate-700'
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color Picker */}
        <div>
          <label className="text-foreground font-semibold block mb-2">Cor de Destaque Preferida</label>
          <div className="grid grid-cols-2 gap-2">
            {colorOptions.map(({ color, label, bgClass }) => {
              const isActive = accentColor === color;
              return (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`p-3 rounded-2xl flex items-center gap-3 border transition text-left ${
                    isActive
                      ? 'border-primary bg-primary/10 font-bold text-foreground'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${bgClass} shrink-0 flex items-center justify-center`}>
                    {isActive && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                  </span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={onClose} className="w-full mt-2">
          Salvar Preferências
        </Button>
      </div>
    </div>
  );
}
