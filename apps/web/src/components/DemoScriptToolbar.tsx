import React, { useState } from 'react';
import { 
  Play, 
  UserCheck, 
  Search, 
  Swords, 
  Zap, 
  QrCode, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export interface DemoStep {
  id: number;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ElementType;
  timeRange: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    label: '1. Perfil Pedro',
    shortLabel: '1. Perfil',
    description: 'Perfil VIP carregado: Tamanho M, Calçado 41, Fluminense FC e orçamento R$ 450.',
    icon: UserCheck,
    timeRange: '0m00s - 0m30s',
  },
  {
    id: 2,
    label: '2. Busca Chuteira',
    shortLabel: '2. Busca',
    description: 'Busca semântica agêntica: "Chuteira para grama sintética no Rio de Janeiro".',
    icon: Search,
    timeRange: '0m30s - 1m15s',
  },
  {
    id: 3,
    label: '3. Batalha Swords',
    shortLabel: '3. Swords',
    description: 'Comparativo de atributos Nike Mercurial vs Adidas Predator com Veredito por IA.',
    icon: Swords,
    timeRange: '1m15s - 2m00s',
  },
  {
    id: 4,
    label: '4. Checkout 1-Clique',
    shortLabel: '4. Checkout',
    description: 'Checkout instantâneo com cupom DECO10 ativado e cashback em tempo real.',
    icon: Zap,
    timeRange: '2m00s - 2m30s',
  },
  {
    id: 5,
    label: '5. QR Code Mobile',
    shortLabel: '5. Mobile',
    description: 'QR Code Expo gerado para continuidade de compra no aplicativo de celular.',
    icon: QrCode,
    timeRange: '2m30s - 3m00s',
  },
];

interface DemoScriptToolbarProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  onResetDemo?: () => void;
}

export function DemoScriptToolbar({
  currentStep,
  onSelectStep,
  onResetDemo,
}: DemoScriptToolbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeStepObj = DEMO_STEPS.find((s) => s.id === currentStep) || DEMO_STEPS[0];

  const handleNextStep = () => {
    const nextId = currentStep >= 5 ? 1 : currentStep + 1;
    onSelectStep(nextId);
  };

  if (isCollapsed) {
    return (
      <div className="bg-slate-900 border-b border-emerald-500/30 px-4 py-1.5 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono-tech font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Pitch Mode (Etapa {currentStep}/5: {activeStepObj.shortLabel})
          </span>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 transition"
        >
          <span>Expandir Tour</span>
          <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/95 border-b border-emerald-500/30 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 z-30 shrink-0 shadow-lg backdrop-blur-md">
      
      {/* Left: Pitch Mode Indicator & Active Step Description */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono-tech font-extrabold text-emerald-400 uppercase tracking-wider">
            Demo Script
          </span>
        </div>

        <div className="hidden xl:block text-xs text-slate-300 truncate max-w-sm">
          <span className="font-semibold text-emerald-300 font-mono-tech">{activeStepObj.timeRange}</span>
          <span className="mx-1 text-slate-600">•</span>
          <span className="text-slate-300">{activeStepObj.description}</span>
        </div>
      </div>

      {/* Center: 5 Interactive Step Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar max-w-full py-0.5">
        {DEMO_STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              title={`${step.label} (${step.timeRange}): ${step.description}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shrink-0 border ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="hidden sm:inline font-mono-tech text-[11px]">{step.label}</span>
              <span className="sm:hidden font-mono-tech text-[11px]">{step.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Step Action Buttons (Next + Reset + Collapse) */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {onResetDemo && (
          <button
            onClick={onResetDemo}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition border border-slate-800"
            title="Reiniciar Tour para Etapa 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={handleNextStep}
          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-500/20"
          title="Avançar para a próxima etapa do Pitch"
        >
          <span>Avançar ({currentStep}/5)</span>
          <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
        </button>

        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Minimizar barra de topo"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
