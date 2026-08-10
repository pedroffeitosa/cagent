import React, { useState } from 'react';
import { UserProfile, STYLE_TAXONOMY, AIProviderType } from '@cagent/shared';
import { 
  User, 
  Sliders, 
  Bot, 
  Palette, 
  ShieldCheck, 
  X, 
  Check, 
  Key, 
  Sparkles, 
  Coins 
} from 'lucide-react';
import { useTheme, ThemePreset } from './ThemeProvider';
import { Button } from './ui/button';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  aiProvider: AIProviderType;
  onProviderChange: (provider: AIProviderType) => void;
  customApiKey: string;
  onApiKeyChange: (key: string) => void;
}

type TabType = 'profile' | 'context' | 'byok' | 'appearance' | 'privacy';

export function PreferencesModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  aiProvider,
  onProviderChange,
  customApiKey,
  onApiKeyChange,
}: PreferencesModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const { themePreset, setThemePreset } = useTheme();

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveProfile(formData);
    onClose();
  };

  const navTabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Meu Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'context', label: 'Filtros Contextuais', icon: <Sliders className="w-4 h-4" /> },
    { id: 'byok', label: 'Conexão com Agentes (BYOK)', icon: <Bot className="w-4 h-4" /> },
    { id: 'appearance', label: 'Aparência', icon: <Palette className="w-4 h-4" /> },
    { id: 'privacy', label: 'Termos & Privacidade', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl h-[620px] rounded-3xl border border-slate-800 shadow-2xl flex overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Navigation Sidebar (Linear Settings Style) */}
        <div className="w-60 bg-slate-950/80 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
          <div>
            {/* Modal Title */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 px-2">
              <span className="font-heading font-bold text-sm text-white tracking-tight">Preferências</span>
            </div>

            {/* Navigation Item Tabs */}
            <div className="flex flex-col gap-1">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-left flex items-center gap-3 font-medium transition ${
                      isActive
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-2 pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono-tech">
            $Agent Platform • Linear UI
          </div>
        </div>

        {/* Right Tab Content Panel */}
        <div className="flex-1 flex flex-col justify-between bg-slate-900/60 p-6 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-6">
            
            {/* Close Button Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <h3 className="font-heading font-bold text-base text-white">
                {navTabs.find(t => t.id === activeTab)?.label}
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB 1: Meu Perfil */}
            {activeTab === 'profile' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-emerald-500/40"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white">{formData.name}</h4>
                    <p className="text-slate-400 text-xs mt-0.5 font-mono-tech">jppfeitosa@gmail.com</p>
                    <span className="inline-block mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-tech">
                      {formData.badge || 'Cliente VIP'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-slate-300 font-semibold">Nome de Exibição</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-slate-300 font-semibold">E-mail</label>
                  <input
                    type="email"
                    value="jppfeitosa@gmail.com"
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs opacity-70 cursor-not-allowed font-mono-tech"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Filtros Contextuais */}
            {activeTab === 'context' && (
              <div className="flex flex-col gap-5">
                <p className="text-slate-400 leading-relaxed">
                  Esses parâmetros são aplicados pelo <strong>$Agent</strong> em tempo real para cruzar seus tamanhos e limitações de orçamento com os produtos da loja.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-300 font-semibold">Tamanho de Roupa</label>
                    <select
                      value={formData.sizes.clothing}
                      onChange={(e) => setFormData({
                        ...formData,
                        sizes: { ...formData.sizes, clothing: e.target.value as any }
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {['PP', 'P', 'M', 'G', 'GG', '36', '38', '40', '42', '44'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-slate-300 font-semibold">Tamanho de Sapato</label>
                    <input
                      type="text"
                      value={formData.sizes.shoes}
                      onChange={(e) => setFormData({
                        ...formData,
                        sizes: { ...formData.sizes, shoes: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-300 font-semibold">Teto Máximo de Orçamento (R$)</label>
                  <input
                    type="number"
                    value={formData.maxBudget || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      maxBudget: e.target.value ? Number(e.target.value) : undefined
                    })}
                    placeholder="Ex: 450"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-300 font-semibold">Estilos Preferidos</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {STYLE_TAXONOMY.map((pref) => {
                      const isSelected = formData.stylePreferences.includes(pref);
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => {
                            const newPrefs = isSelected
                              ? formData.stylePreferences.filter(p => p !== pref)
                              : [...formData.stylePreferences, pref];
                            setFormData({ ...formData, stylePreferences: newPrefs });
                          }}
                          className={`px-3 py-1.5 rounded-xl border transition ${
                            isSelected
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {pref}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Conexão com Agentes (BYOK) */}
            {activeTab === 'byok' && (
              <div className="flex flex-col gap-5">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <Key className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">Bring Your Own Key (BYOK)</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Você pode usar a inteligência padrão da plataforma ou fornecer sua própria chave de API de IA.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-300 font-semibold">Provedor de IA Selecionado</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'gemini' as const, label: 'Google Gemini', desc: 'Padrão MVP' },
                      { id: 'openai' as const, label: 'OpenAI GPT-4', desc: 'Custom Key' },
                      { id: 'anthropic' as const, label: 'Anthropic Claude', desc: 'Custom Key' },
                    ].map((prov) => (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => onProviderChange(prov.id)}
                        className={`p-3 rounded-xl border flex flex-col text-left transition ${
                          aiProvider === prov.id
                            ? 'border-emerald-500 bg-emerald-500/10 font-bold text-white'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{prov.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono-tech mt-0.5">{prov.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-300 font-semibold">Chave de API Personalizada (Opcional)</label>
                  <input
                    type="password"
                    value={customApiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono-tech focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: Aparência */}
            {activeTab === 'appearance' && (
              <div className="flex flex-col gap-5">
                <p className="text-slate-400 leading-relaxed">
                  Escolha o tema e a estética visual de sua preferência para a plataforma.
                </p>

                <div className="flex flex-col gap-3">
                  {[
                    { id: 'default', name: 'Deco Banking Dark (Padrão)', desc: 'Estética clássica de banco/fintech com acentos esmeralda.' },
                    { id: 'light', name: 'Deco Light Minimalist', desc: 'Interface clara e minimalista de alta visibilidade.' },
                    { id: 'midnight', name: 'Midnight Cyber', desc: 'Fundo azul noturno profundo com acentos ciano neon.' },
                    { id: 'royal', name: 'Royal Luxury', desc: 'Fundo roxo nobre com acentos dourados.' },
                  ].map((preset) => {
                    const isActive = themePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setThemePreset(preset.id as ThemePreset)}
                        className={`p-4 rounded-2xl border flex items-center justify-between text-left transition ${
                          isActive
                            ? 'border-emerald-500 bg-emerald-500/10 text-white font-medium'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-white text-sm block">{preset.name}</span>
                          <span className="text-xs text-slate-400 mt-0.5 block">{preset.desc}</span>
                        </div>
                        {isActive && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: Termos & Privacidade */}
            {activeTab === 'privacy' && (
              <div className="flex flex-col gap-4 text-slate-300 leading-relaxed">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                  <span className="font-bold text-white text-sm">🔒 Proteção & Privacidade do Usuário</span>
                  <p className="text-slate-400 text-xs">
                    O <strong>$Agent</strong> opera sob o conceito de dados locais declarados. Seus tamanhos, limites de orçamento e preferências de estilo são mantidos no seu dispositivo para fornecer personalização em tempo real.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                  <span className="font-bold text-white text-sm">📜 Licença Open-Source Comercial (MIT)</span>
                  <p className="text-slate-400 text-xs">
                    Este projeto é 100% open-source sob a licença MIT, permitindo que lojistas e desenvolvedores reutilizem, modifiquem e expandam a plataforma livremente.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition font-medium"
            >
              Cancelar
            </button>
            <Button onClick={handleSave} className="px-6 py-2.5">
              Salvar Alterações
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
