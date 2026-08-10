import React, { useState } from 'react';
import { UserProfile } from '@cagent/shared';
import { SlidersHorizontal, Filter, ArrowLeft, Check, Sparkles, Plus, Trophy } from 'lucide-react';
import { Button } from '../ui/button';

interface CustomFiltersViewProps {
  userProfile: UserProfile;
  onBackToChat: () => void;
  onApplyPresetFilter: (filterName: string, colors: string[]) => void;
}

export function CustomFiltersView({ userProfile, onBackToChat, onApplyPresetFilter }: CustomFiltersViewProps) {
  const [activeFilterId, setActiveFilterId] = useState<string>('fluminense');

  const presetFilters = [
    {
      id: 'fluminense',
      name: '⚽ Torcedor Tricolor (Fluminense)',
      description: 'Priorizar roupas e acessórios nas cores Verde, Vermelho e Branco do Fluminense.',
      colors: ['Verde', 'Vermelho', 'Branco'],
      badge: 'Exemplo do Usuário',
    },
    {
      id: 'corredor-rua',
      name: '🏃 Corredor de Rua',
      description: 'Priorizar tênis de corrida, amortecimento e acessórios de performance para asfalto e maratona.',
      colors: ['Preto', 'Azul Marinho', 'Amarelo'],
    },
    {
      id: 'academia-fit',
      name: '🏋️ Academia & Fit',
      description: 'Priorizar roupas de treino, streetwear esportivo e itens de recuperação para o dia a dia na academia.',
      colors: ['Preto', 'Cinza', 'Verde'],
    },
  ];

  const handleSelectFilter = (id: string, name: string, colors: string[]) => {
    setActiveFilterId(id);
    onApplyPresetFilter(name, colors);
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-5xl mx-auto w-full gap-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-200">
      
      {/* Top Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToChat}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            title="Voltar ao Chat"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-heading font-bold text-2xl text-white">Central de Filtros Personalizados &amp; Temáticos</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure filtros inteligentes permanentes que moldam as sugestões do $Agent</p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-tech font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Filtro Ativo: {presetFilters.find(f => f.id === activeFilterId)?.name}
        </span>
      </div>

      {/* Preset Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {presetFilters.map((filter) => {
          const isActive = activeFilterId === filter.id;
          return (
            <div
              key={filter.id}
              onClick={() => handleSelectFilter(filter.id, filter.name, filter.colors)}
              className={`glass-card rounded-3xl p-6 border flex flex-col justify-between gap-4 cursor-pointer transition ${
                isActive
                  ? 'bg-slate-900/90 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-base text-white">{filter.name}</h4>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                {filter.badge && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-tech w-fit">
                    {filter.badge}
                  </span>
                )}

                <p className="text-xs text-slate-400 leading-relaxed mt-1">{filter.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono-tech block mb-1.5 uppercase">Cores Priorizadas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {filter.colors.map(c => (
                    <span key={c} className="text-xs px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
