import React, { useState } from 'react';
import { UserProfile } from '@cagent/shared';
import { SlidersHorizontal, Plus, Check, X, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { Button } from './ui/button';

interface CustomFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onApplyPresetFilter: (filterName: string, colors: string[]) => void;
}

export function CustomFiltersModal({
  isOpen,
  onClose,
  userProfile,
  onApplyPresetFilter,
}: CustomFiltersModalProps) {
  const [activeFilterId, setActiveFilterId] = useState<string>('fluminense');

  if (!isOpen) return null;

  const presetFilters = [
    {
      id: 'fluminense',
      name: '⚽ Torcedor Tricolor (Fluminense)',
      description: 'Priorizar roupas e acessórios nas cores Verde, Vermelho e Branco do Fluminense.',
      colors: ['Verde', 'Vermelho', 'Branco'],
      badge: 'Exemplo do Usuário',
    },
    {
      id: 'work-executive',
      name: '💼 Executive Workwear',
      description: 'Filtrar peças em alfaiataria elegante e tons sóbrios (Preto, Azul Marinho, Cinza).',
      colors: ['Preto', 'Azul Marinho', 'Cinza'],
    },
    {
      id: 'summer-resort',
      name: '☀️ Summer Resort & Linho',
      description: 'Priorizar vestidos leves, linho orgânico e tons claros (Bege, Branco).',
      colors: ['Bege', 'Branco'],
    },
  ];

  const handleSelectFilter = (id: string, name: string, colors: string[]) => {
    setActiveFilterId(id);
    onApplyPresetFilter(name, colors);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-base text-white">Meus Filtros Personalizados</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-400 leading-relaxed">
          Crie ou selecione filtros temáticos permanentes para guiar o atendimento do <strong>$Agent</strong> na loja.
        </p>

        {/* Filter Presets */}
        <div className="flex flex-col gap-3">
          {presetFilters.map((filter) => {
            const isActive = activeFilterId === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => handleSelectFilter(filter.id, filter.name, filter.colors)}
                className={`p-4 rounded-2xl border flex items-start justify-between text-left transition ${
                  isActive
                    ? 'bg-slate-900 border-emerald-500 text-white font-medium shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex flex-col gap-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-white">{filter.name}</span>
                    {filter.badge && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-tech">
                        {filter.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{filter.description}</p>
                  
                  {/* Color Chips */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-500 font-mono-tech">Cores:</span>
                    {filter.colors.map(c => (
                      <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  {isActive ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-800" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <Button onClick={onClose} className="w-full">
          Aplicar Filtro Personalizado
        </Button>

      </div>
    </div>
  );
}
