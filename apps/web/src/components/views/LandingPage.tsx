import React, { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Wallet,
  Ticket,
  SlidersHorizontal,
  Swords,
  Share2,
  PlugZap,
  ShieldCheck,
  ArrowRight,
  Bot,
  Check,
  Store,
  Smartphone,
  Gift,
  Coins,
  MessageSquare,
  ExternalLink,
  FileText,
  Bell,
} from 'lucide-react';
import { Button } from '../ui/button';
import { MOCK_USER_PROFILES, MOCK_STORE_PRODUCTS, MOCK_STORE_CONFIG } from '@cagent/shared';
import { handleImageError } from '../../utils/imageFallback';

interface LandingPageProps {
  onEnter: () => void;
}

const DOCS_URL = 'https://dcagent.vercel.app';

const FEATURES = [
  {
    icon: Bot,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    title: 'Busca Contextual por IA',
    description: 'O agente entende a intenção do cliente e reordena a vitrine com base em tamanho, estilo e orçamento — sem filtros manuais.',
  },
  {
    icon: Swords,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    title: 'Batalha Swords',
    description: 'Comparador de produtos lado a lado com veredito agêntico explicando qual item é ideal para aquele cliente específico.',
  },
  {
    icon: Coins,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    title: 'Cashback & Carteira',
    description: 'Saldo de cashback unificado, aplicado automaticamente em cada compra e visível na carteira do cliente.',
  },
  {
    icon: Ticket,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    title: 'Cupons Inteligentes',
    description: 'Cupons ativados por contexto (perfil, time do coração, primeira compra) sem precisar caçar código de desconto.',
  },
  {
    icon: SlidersHorizontal,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    title: 'Filtros Personalizados',
    description: 'Cada cliente carrega seu próprio perfil de tamanho, cores e restrições entre lojas — sem repetir cadastro.',
  },
  {
    icon: Share2,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    title: 'Compartilhamento Agêntico',
    description: 'Recomendações personalizadas viram link ou QR Code para enviar no WhatsApp em um toque.',
  },
  {
    icon: Smartphone,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    title: 'App Mobile White-Label',
    description: 'O mesmo motor do $Agent embarcado num app nativo iOS/Android (React Native + Expo), pronto para publicar com a marca da sua loja.',
  },
];

const STEPS = [
  {
    number: '01',
    icon: PlugZap,
    title: 'Conecte sua loja',
    description: 'Fork & Connect: substitua os adaptadores de catálogo e checkout pelos seus, sem infraestrutura nova.',
  },
  {
    number: '02',
    icon: Smartphone,
    title: 'Cliente entra com contexto',
    description: 'O cliente acessa o canal web ou mobile já com perfil, tamanho, preferências e saldo carregados.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'IA personaliza tudo',
    description: 'Vitrine, cupons, cashback e comparador se ajustam em tempo real para aquele cliente — em qualquer loja da rede.',
  },
];

const demoPersona = MOCK_USER_PROFILES[0];
const demoProducts = MOCK_STORE_PRODUCTS.slice(0, 2);
const activeCoupons = MOCK_STORE_CONFIG.activeCoupons;

const PARTNER_STORES = [
  { name: 'Deco Sports & Performance', cashback: '5%', current: true },
  { name: 'Nike Brasil Official', cashback: '5%', current: false },
  { name: 'Centauro Esportes', cashback: '5%', current: false },
  { name: 'Max Titanium Supplements', cashback: '7%', current: false },
];

type SlideColor = 'emerald' | 'amber' | 'cyan' | 'purple' | 'indigo';

const COLOR_MAP: Record<SlideColor, { badge: string; text: string; dot: string }> = {
  emerald: { badge: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  amber: { badge: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-400', dot: 'bg-amber-400' },
  cyan: { badge: 'bg-cyan-500/20 border-cyan-500/40', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  purple: { badge: 'bg-purple-500/20 border-purple-500/40', text: 'text-purple-400', dot: 'bg-purple-400' },
  indigo: { badge: 'bg-indigo-500/20 border-indigo-500/40', text: 'text-indigo-400', dot: 'bg-indigo-400' },
};

const HERO_SLIDES: { id: string; label: string; icon: typeof Bot; color: SlideColor }[] = [
  { id: 'chat', label: 'Chat Agêntico', icon: Bot, color: 'emerald' },
  { id: 'cashback', label: 'Cashback Automático', icon: Coins, color: 'amber' },
  { id: 'coupons', label: 'Cupons Personalizados', icon: Ticket, color: 'cyan' },
  { id: 'filters', label: 'Filtros Personalizados', icon: SlidersHorizontal, color: 'purple' },
  { id: 'mobile', label: 'App Mobile White-Label', icon: Smartphone, color: 'indigo' },
  { id: 'network', label: 'Rede de Lojas Parceiras', icon: Store, color: 'emerald' },
];

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = (index: number) => {
    setActiveIndex(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3200);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const slide = HERO_SLIDES[activeIndex];
  const colors = COLOR_MAP[slide.color];

  return (
    <div className="relative">
      <div className="glass-panel rounded-3xl p-5 shadow-2xl shadow-emerald-500/5 min-h-[400px] flex flex-col">
        {/* Header: current feature badge */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80 shrink-0">
          <motion.div
            key={`icon-${slide.id}`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center ${colors.badge}`}
          >
            <slide.icon className={`w-3.5 h-3.5 ${colors.text}`} />
          </motion.div>
          <motion.span
            key={slide.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs font-semibold text-white"
          >
            {slide.label}
          </motion.span>
          <span className="ml-auto text-[10px] font-mono-tech text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ao vivo
          </span>
        </div>

        {/* Scene content */}
        <div className="flex-1 pt-4 relative">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
              {slide.id === 'chat' && (
                <div>
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-emerald-600 text-slate-950 text-xs font-medium p-3">
                      Procuro camisa do Fluminense e chuteira no meu tamanho
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="glass-card rounded-2xl rounded-tl-none p-3 text-xs text-slate-200 flex-1">
                      Encontrei 2 itens no seu perfil ({demoPersona.sizes.clothing} / {demoPersona.sizes.shoes}) com cupom aplicado.
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                        <span className="text-amber-400 font-bold flex items-center gap-1 text-[10px]">
                          <Gift className="w-3 h-3" /> Cupom VIPFLUMESH
                        </span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                          <Coins className="w-3 h-3" /> +R$ 36,40 cashback
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    {demoProducts.map((product) => (
                      <div key={product.id} className="glass-card rounded-2xl p-3 border border-emerald-500/30">
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-900 mb-2">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={handleImageError} />
                        </div>
                        <p className="text-[11px] font-semibold text-white truncate" title={product.name}>{product.name}</p>
                        <p className="text-xs font-heading font-bold text-emerald-400 mt-0.5">R$ {product.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {slide.id === 'cashback' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono-tech uppercase block">Saldo disponível</span>
                      <span className="font-heading font-extrabold text-3xl text-white">
                        R$ {(demoPersona.walletBalance || 0).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                      className="text-amber-400 font-bold text-sm flex items-center gap-1"
                    >
                      <Coins className="w-4 h-4" /> + R$ 17,45
                    </motion.span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '72%' }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>

                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-2">
                    {(demoPersona.purchaseHistory || []).slice(0, 2).map((tx) => (
                      <motion.div key={tx.id} variants={staggerItem} className="glass-card rounded-xl p-3 flex items-center justify-between text-xs">
                        <span className="text-slate-300 truncate pr-2">{tx.productName}</span>
                        <span className="text-emerald-400 font-mono-tech font-bold shrink-0">+ R$ {tx.cashbackEarned.toFixed(2).replace('.', ',')}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {slide.id === 'coupons' && (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-3">
                  {activeCoupons.map((coupon) => (
                    <motion.div key={coupon.code} variants={staggerItem} className="glass-card rounded-2xl p-3 flex items-center justify-between border border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                          <Ticket className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <span className="font-mono-tech font-bold text-white text-xs block">{coupon.code}</span>
                          <span className="text-[10px] text-slate-500 truncate block max-w-[160px]">{coupon.description}</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shrink-0 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Ativo
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {slide.id === 'filters' && (
                <div className="flex flex-col gap-4">
                  <p className="text-xs text-slate-400">Filtros permanentes de {demoPersona.name.split(' ')[0]}, aplicados em qualquer loja da rede:</p>
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-wrap gap-2">
                    {[
                      `Tamanho ${demoPersona.sizes.clothing}`,
                      `Calçado ${demoPersona.sizes.shoes}`,
                      ...demoPersona.stylePreferences.slice(0, 2),
                      `Até R$ ${demoPersona.maxBudget}`,
                    ].map((chip) => (
                      <motion.span
                        key={chip}
                        variants={staggerItem}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium"
                      >
                        {chip}
                      </motion.span>
                    ))}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400 shrink-0" />
                    Vitrine reordenada automaticamente com esses filtros — sem recadastro.
                  </motion.div>
                </div>
              )}

              {slide.id === 'mobile' && (
                <div className="flex flex-col gap-4">
                  <p className="text-xs text-slate-400">
                    O mesmo motor do $Agent nasce como o app oficial da sua loja — iOS &amp; Android:
                  </p>

                  <div className="flex items-center justify-center py-1">
                    {/* Phone mockup */}
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="w-36 rounded-[1.6rem] border-4 border-slate-800 bg-slate-950 p-1.5 shadow-2xl shadow-indigo-500/10"
                    >
                      <div className="rounded-xl overflow-hidden bg-slate-900">
                        <div className="h-7 bg-slate-800 flex items-center justify-center gap-1">
                          <span className="text-[9px] font-heading font-extrabold text-white tracking-tight">$SuaLoja</span>
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                          <motion.div
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-1 px-1.5 py-1.5"
                          >
                            <Bell className="w-2.5 h-2.5 text-indigo-300 shrink-0" />
                            <span className="text-[7px] text-indigo-200 leading-tight">Cupom liberado perto de você!</span>
                          </motion.div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="h-9 rounded-md bg-slate-800" />
                            <div className="h-9 rounded-md bg-slate-800" />
                          </div>
                          <div className="h-2 w-3/4 rounded bg-slate-800" />
                          <div className="h-2 w-1/2 rounded bg-slate-800" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex items-center justify-center gap-2">
                    {['iOS', 'Android'].map((platform) => (
                      <motion.span
                        key={platform}
                        variants={staggerItem}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[10px] font-semibold text-slate-200 flex items-center gap-1.5"
                      >
                        <Smartphone className="w-3 h-3 text-indigo-400" />
                        {platform}
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card rounded-xl p-3 flex items-center gap-2 text-xs text-indigo-300"
                  >
                    <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                    React Native (Expo) — pronto para virar o app exclusivo do lojista.
                  </motion.div>
                </div>
              )}

              {slide.id === 'network' && (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-2.5">
                  {PARTNER_STORES.map((store) => (
                    <motion.div
                      key={store.name}
                      variants={staggerItem}
                      className={`rounded-xl p-3 flex items-center justify-between border ${
                        store.current ? 'bg-emerald-950/30 border-emerald-500/40' : 'glass-card border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                          <Store className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                        <span className="text-xs text-slate-200 truncate">{store.name}</span>
                      </div>
                      <span className="text-[10px] font-mono-tech font-bold text-emerald-400 shrink-0">{store.cashback} cashback</span>
                    </motion.div>
                  ))}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[10px] text-slate-500 text-center pt-1"
                  >
                    Saldo e perfil sincronizados entre todas as lojas conectadas
                  </motion.span>
                </motion.div>
              )}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 pt-4 shrink-0">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => restartTimer(i)}
              title={s.label}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? `w-6 ${COLOR_MAP[s.color].dot}` : 'w-1.5 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Wallet Chip */}
      <div className="absolute -bottom-5 -left-5 glass-panel rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-emerald-500/30 shadow-xl hidden sm:flex">
        <Wallet className="w-4 h-4 text-emerald-400" />
        <div className="leading-tight">
          <span className="block text-[9px] text-slate-400 font-mono-tech">Saldo cashback</span>
          <span className="block text-xs font-bold text-white">R$ {(demoPersona.walletBalance || 0).toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
  );
}

const BRAND_NAMES = ['$Agent', '$SuaLoja'];

function TypingBrand() {
  const [nameIndex, setNameIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  useEffect(() => {
    const currentName = BRAND_NAMES[nameIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < currentName.length) {
        timeout = setTimeout(() => setText(currentName.slice(0, text.length + 1)), 110);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 1500);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 900);
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 55);
      } else {
        setNameIndex((prev) => (prev + 1) % BRAND_NAMES.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, nameIndex]);

  return (
    <span className="logo-agent-financial text-2xl tracking-tighter inline-flex items-center">
      {text}
      <span className="inline-block w-[2px] h-5 bg-emerald-400 ml-0.5 animate-pulse" aria-hidden="true" />
    </span>
  );
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-y-auto custom-scrollbar">
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* ------------------------------------------------------------- */}
        {/* NAVBAR */}
        {/* ------------------------------------------------------------- */}
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <TypingBrand />
            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
              <a href="#recursos" className="hover:text-white transition">Recursos</a>
              <a href="#como-funciona" className="hover:text-white transition">Como funciona</a>
              <a href="#lojistas" className="hover:text-white transition">Para Lojistas</a>
            </nav>
            <Button onClick={onEnter} size="sm" className="gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
              <span>Testar como funciona</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </header>

        {/* ------------------------------------------------------------- */}
        {/* HERO */}
        {/* ------------------------------------------------------------- */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-[11px] font-mono-tech text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Hackathon Agents for Commerce · Deco 2026
            </span>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl leading-[1.1] tracking-tight text-white">
              Um canal de vendas <span className="text-emerald-400">agêntico e personalizado</span>, pronto em minutos
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
              O <strong className="text-white">$Agent</strong> é um canal turnkey que qualquer lojista instala em minutos: vitrine reordenada por IA, cupons, cashback e filtros personalizados para cada cliente — sem cadastro repetido, sem infraestrutura complexa.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button onClick={onEnter} size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                <span>Testar como funciona</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <a href="#como-funciona">
                <Button variant="secondary" size="lg" className="gap-2">
                  <span>Ver como funciona</span>
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Fork &amp; Connect ready</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Web + Mobile (Expo)</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> BYOK multi-LLM</span>
            </div>
          </div>

          {/* Hero Visual: vitrine animada ciclando pelas funcionalidades */}
          <HeroShowcase />
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PROBLEMA -> SOLUÇÃO */}
        {/* ------------------------------------------------------------- */}
        <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-7 border border-slate-800">
            <span className="text-[11px] font-mono-tech text-red-400 uppercase tracking-wider">O problema</span>
            <h3 className="font-heading font-bold text-xl text-white mt-2">Personalização passiva e fragmentada</h3>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              O cliente ajusta filtro de tamanho, cor e preço toda vez que entra em uma loja nova. As lojas não compartilham contexto entre si — o resultado é busca genérica, abandono de carrinho e conversão perdida.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-7 border border-emerald-500/30 bg-emerald-950/10">
            <span className="text-[11px] font-mono-tech text-emerald-400 uppercase tracking-wider">A solução $Agent</span>
            <h3 className="font-heading font-bold text-xl text-white mt-2">Um canal contextual único, plug &amp; play</h3>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              O perfil, histórico e saldo de cashback do cliente atravessam qualquer loja conectada à rede. O lojista instala o canal, conecta o catálogo, e a vitrine já nasce personalizada — <strong className="text-white">vende mais e roda por menos</strong>.
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* RECURSOS */}
        {/* ------------------------------------------------------------- */}
        <section id="recursos" className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-heading font-extrabold text-3xl text-white">Tudo que um canal de vendas agêntico precisa</h2>
            <p className="text-sm text-slate-400 mt-3">Recursos prontos para uso, sem integração pesada para o piloto.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-slate-700 transition">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-white">{feature.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* COMO FUNCIONA */}
        {/* ------------------------------------------------------------- */}
        <section id="como-funciona" className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-heading font-extrabold text-3xl text-white">Como funciona</h2>
            <p className="text-sm text-slate-400 mt-3">Do fork ao primeiro cliente personalizado, em três passos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="glass-card rounded-3xl p-6 border border-slate-800 relative overflow-hidden">
                <span className="absolute -top-3 -right-2 font-heading font-extrabold text-6xl text-slate-800/60 select-none">
                  {step.number}
                </span>
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400 relative">
                  <step.icon className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-bold text-base text-white relative">{step.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed relative">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 pt-10 text-center">
            <p className="text-xs text-slate-500 max-w-sm">
              Quer o passo a passo completo, a arquitetura e os endpoints da API? Confira a documentação.
            </p>
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Ver Documentação</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Button>
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* PARA LOJISTAS */}
        {/* ------------------------------------------------------------- */}
        <section id="lojistas" className="max-w-6xl mx-auto px-6 py-16">
          <div className="glass-panel rounded-3xl p-8 md:p-10 border border-cyan-500/30 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-mono-tech text-[11px] mb-4">
                <Store className="w-3.5 h-3.5" />
                Para lojistas
              </span>
              <h3 className="font-heading font-bold text-2xl text-white">Instalação rápida, sem trocar sua stack</h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Fork do repositório, troque os adaptadores de catálogo em <code className="font-mono-tech text-emerald-400">packages/shared/src/mocks.ts</code> pelos seus dados reais e faça deploy em 1 clique. Sem autenticação nem banco de dados obrigatórios para validar o piloto.
              </p>
              <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                Mais que um canal de vendas: cada busca, filtro e compra aproxima você do seu cliente e vira dado de contexto — a base para, quando fizer sentido, escalar para um app mobile próprio e ainda mais robusto.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Open-source, licença MIT, white-label</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Deploy em 1 clique (Vercel + Serverless Functions)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>BYOK: Gemini, OpenAI ou Anthropic — sua escolha</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Pronto para virar app nativo iOS &amp; Android — $SuaLoja</span>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* CTA FINAL */}
        {/* ------------------------------------------------------------- */}
        <section className="max-w-4xl mx-auto px-6 pb-20 text-center flex flex-col items-center gap-5">
          <h2 className="font-heading font-extrabold text-3xl text-white">Veja o $Agent em ação agora</h2>
          <p className="text-sm text-slate-400 max-w-md">
            Navegue pela demo com o perfil de Pedro França e veja a vitrine, os cupons e o cashback se ajustarem em tempo real.
          </p>
          <Button onClick={onEnter} size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
            <span>Testar como funciona</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* FOOTER */}
        {/* ------------------------------------------------------------- */}
        <footer className="border-t border-slate-800/80">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="logo-agent-financial text-lg tracking-tighter">$Agent</span>
            <p className="text-[11px] text-slate-500 text-center sm:text-right">
              Desenvolvido para o Hackathon Agents for Commerce — Deco (2026). MVP em modo mock, sem autenticação ou banco de dados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
