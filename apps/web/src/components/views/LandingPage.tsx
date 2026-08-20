import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, animate, useScroll, useSpring, MotionConfig, type Variants } from 'framer-motion';
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
  TrendingUp,
  TrendingDown,
  Trophy,
  Sun,
  Moon,
  Menu,
  X,
  ArrowUp,
  Github,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../ThemeProvider';
import { MOCK_USER_PROFILES, MOCK_STORE_PRODUCTS, MOCK_STORE_CONFIG } from '@cagent/shared';
import { handleImageError } from '../../utils/imageFallback';

interface LandingPageProps {
  onEnter: () => void;
}

const DOCS_URL = 'https://dcagent.vercel.app';
const GITHUB_URL = 'https://github.com/pedroffeitosa/cagent';

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

const swordsProductA = MOCK_STORE_PRODUCTS.find((p) => p.id === 'prod-soc-04') ?? MOCK_STORE_PRODUCTS[3];
const swordsProductB = MOCK_STORE_PRODUCTS.find((p) => p.id === 'prod-fld-05') ?? MOCK_STORE_PRODUCTS[4];

interface SpectrumAttribute {
  label: string;
  /** Qualitative word for each rating, 1-5 — track[rating - 1]. */
  track: [string, string, string, string, string];
  /** Nike Tiempo's rating, 1-5. */
  a: number;
  /** Adidas Predator's rating, 1-5, on that same criterion. */
  b: number;
}

// Every attribute rates both cleats on the exact same yardstick (e.g. "how
// good is each one specifically on natural grass") so the two numbers are
// genuinely comparable — not two unrelated categorical facts.
const SWORDS_COMPARISON: SpectrumAttribute[] = [
  { label: 'Performance em campo natural', track: ['Muito limitada', 'Limitada', 'Moderada', 'Boa', 'Ideal'], a: 2, b: 3 },
  { label: 'Toque na bola', track: ['Muito básico', 'Básico', 'Médio', 'Bom', 'Excelente'], a: 4, b: 3 },
  { label: 'Tração no solo', track: ['Muito baixa', 'Baixa', 'Média', 'Alta', 'Muito alta'], a: 3, b: 5 },
  { label: 'Durabilidade', track: ['Muito baixa', 'Baixa', 'Média', 'Alta', 'Muito alta'], a: 3, b: 4 },
];

const IMPACT_STATS = [
  { icon: TrendingUp, target: 35, prefix: '+', suffix: '%', label: 'Conversão Search-to-Cart', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { icon: TrendingDown, target: 60, prefix: '-', suffix: '%', label: 'Custo de atendimento', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { icon: ShieldCheck, target: 100, prefix: '', suffix: '%', label: 'Disponibilidade (fallback local)', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
];

const BACKGROUND_ORBS = [
  {
    id: 'emerald',
    color: 'bg-emerald-500/10',
    size: 'w-[32rem] h-[32rem]',
    style: { top: '-10rem', left: '-10rem' },
    animate: { x: [0, 40, -15, 0], y: [0, -25, 20, 0] },
    duration: 26,
  },
  {
    id: 'cyan',
    color: 'bg-cyan-500/10',
    size: 'w-[30rem] h-[30rem]',
    style: { top: '8rem', right: '-12rem' },
    animate: { x: [0, -30, 15, 0], y: [0, 25, -15, 0] },
    duration: 30,
  },
  {
    id: 'purple',
    color: 'bg-purple-500/10',
    size: 'w-[26rem] h-[26rem]',
    style: { bottom: '-8rem', left: '10%' },
    animate: { x: [0, 25, -20, 0], y: [0, -15, 10, 0] },
    duration: 24,
  },
  {
    id: 'amber',
    color: 'bg-amber-500/10',
    size: 'w-[22rem] h-[22rem]',
    style: { bottom: '10%', right: '5%' },
    animate: { x: [0, -20, 15, 0], y: [0, 15, -10, 0] },
    duration: 32,
  },
];

const FAQ_ITEMS = [
  {
    question: 'Preciso trocar minha stack de e-commerce atual?',
    answer:
      'Não. É Fork & Connect: você troca só os adaptadores de catálogo e checkout em packages/shared pelos seus, mantendo o backend que já usa hoje.',
  },
  {
    question: 'Os dados do cliente passam por algum serviço de terceiro?',
    answer:
      'O modelo é BYOK — você usa sua própria chave (Anthropic, OpenAI ou Gemini) e o motor roda no seu deploy. Hoje o MVP funciona em modo mock, sem autenticação nem banco de dados; ao conectar catálogo real, o dado continua trafegando só entre seu deploy e o provedor de LLM que você escolheu.',
  },
  {
    question: 'Quanto custa colocar no ar?',
    answer:
      'O deploy 1-clique roda na Vercel, cujo plano gratuito cobre um piloto tranquilamente. O único custo variável é a chamada ao LLM — como é BYOK, você escolhe o provedor e paga direto a ele, sem markup.',
  },
  {
    question: 'É open-source de verdade?',
    answer:
      'Sim, licença MIT, repositório público no GitHub. Fork livre, sem taxa de licenciamento.',
  },
  {
    question: 'A vitrine que eu vejo na demo é meu catálogo real?',
    answer:
      'Não ainda — o MVP roda com dados mock (packages/shared/src/mocks.ts) para validar o piloto rápido. Trocar pelo catálogo e checkout reais é o passo seguinte do Fork & Connect.',
  },
  {
    question: 'Preciso de um time de dev pra integrar?',
    answer:
      'Para subir a demo, não — é 1 clique. Para plugar catálogo e checkout reais, um dev front/back consegue trocar os adaptadores em poucas horas, sem infraestrutura nova.',
  },
];

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

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const revealStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}

function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isAutoAdvancing = !isPaused && !prefersReducedMotion;

  const restartTimer = (index: number) => {
    setActiveIndex(index);
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isAutoAdvancing) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3200);
  };

  useEffect(() => {
    if (!isAutoAdvancing) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoAdvancing]);

  const slide = HERO_SLIDES[activeIndex];
  const colors = COLOR_MAP[slide.color];

  return (
    <div className="relative z-10" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className="glass-panel rounded-3xl p-5 shadow-2xl shadow-emerald-500/5 min-h-[400px] flex flex-col">
        {/* Header: current feature badge */}
        <div className="flex items-center gap-2 pb-3 border-b border-border/80 shrink-0">
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
            className="text-xs font-semibold text-foreground"
          >
            {slide.label}
          </motion.span>
          <span className="ml-auto text-[10px] font-mono-tech text-muted-foreground flex items-center gap-1.5">
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
                    <div className="glass-card rounded-2xl rounded-tl-none p-3 text-xs text-foreground flex-1">
                      Encontrei 2 itens no seu perfil ({demoPersona.sizes.clothing} / {demoPersona.sizes.shoes}) com cupom aplicado.
                      <div className="mt-2 pt-2 border-t border-border flex items-center gap-2 flex-wrap">
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
                        <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-2">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={handleImageError} />
                        </div>
                        <p className="text-[11px] font-semibold text-foreground truncate" title={product.name}>{product.name}</p>
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
                      <span className="text-[10px] text-muted-foreground font-mono-tech uppercase block">Saldo disponível</span>
                      <span className="font-heading font-extrabold text-3xl text-foreground">
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

                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
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
                        <span className="text-foreground truncate pr-2">{tx.productName}</span>
                        <span className="text-emerald-400 font-mono-tech font-bold shrink-0">+ R$ {tx.cashbackEarned.toFixed(2).replace('.', ',')}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {slide.id === 'coupons' && (
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-3">
                  {activeCoupons.map((coupon) => (
                    <motion.div key={coupon.code} variants={staggerItem} className="glass-card rounded-2xl p-3 flex items-center justify-between border border-border">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                          <Ticket className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <span className="font-mono-tech font-bold text-foreground text-xs block">{coupon.code}</span>
                          <span className="text-[10px] text-muted-foreground truncate block max-w-[160px]">{coupon.description}</span>
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
                  <p className="text-xs text-muted-foreground">Filtros permanentes de {demoPersona.name.split(' ')[0]}, aplicados em qualquer loja da rede:</p>
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
                        className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 [.theme-light_&]:text-purple-700 text-xs font-medium"
                      >
                        {chip}
                      </motion.span>
                    ))}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass-card rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300 [.theme-light_&]:text-emerald-700"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400 shrink-0" />
                    Vitrine reordenada automaticamente com esses filtros — sem recadastro.
                  </motion.div>
                </div>
              )}

              {slide.id === 'mobile' && (
                <div className="flex flex-col gap-4">
                  <p className="text-xs text-muted-foreground">
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
                        className="px-3 py-1.5 rounded-xl bg-muted border border-border text-[10px] font-semibold text-foreground flex items-center gap-1.5"
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
                    className="glass-card rounded-xl p-3 flex items-center gap-2 text-xs text-indigo-300 [.theme-light_&]:text-indigo-700"
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
                        store.current ? 'bg-emerald-950/30 border-emerald-500/40' : 'glass-card border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                          <Store className="w-3.5 h-3.5 text-foreground" />
                        </div>
                        <span className="text-xs text-foreground truncate">{store.name}</span>
                      </div>
                      <span className="text-[10px] font-mono-tech font-bold text-emerald-400 shrink-0">{store.cashback} cashback</span>
                    </motion.div>
                  ))}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[10px] text-muted-foreground text-center pt-1"
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
                i === activeIndex ? `w-6 ${COLOR_MAP[s.color].dot}` : 'w-1.5 bg-border hover:bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Wallet Chip */}
      <div className="absolute -bottom-5 -left-5 glass-panel rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-emerald-500/30 shadow-xl hidden sm:flex">
        <Wallet className="w-4 h-4 text-emerald-400" />
        <div className="leading-tight">
          <span className="block text-[9px] text-muted-foreground font-mono-tech">Saldo cashback</span>
          <span className="block text-xs font-bold text-foreground">R$ {(demoPersona.walletBalance || 0).toFixed(2).replace('.', ',')}</span>
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
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
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
  }, [text, phase, nameIndex, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <span className="logo-agent-financial text-2xl tracking-tighter inline-flex items-center">{BRAND_NAMES[0]}</span>;
  }

  return (
    <span className="logo-agent-financial text-2xl tracking-tighter inline-flex items-center">
      {text}
      <span className="inline-block w-[2px] h-5 bg-emerald-400 ml-0.5 animate-pulse" aria-hidden="true" />
    </span>
  );
}

const NAV_LINKS = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#swords', label: 'Comparador' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#lojistas', label: 'Para Lojistas' },
  { href: '#faq', label: 'FAQ' },
];

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 300, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="absolute left-0 right-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 rounded-full"
    />
  );
}

function CursorGlow({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const node = glowRef.current;
      if (!node) return;
      node.style.left = `${e.clientX - rect.left}px`;
      node.style.top = `${e.clientY - rect.top}px`;
    };

    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, [containerRef]);

  return (
    <div
      ref={glowRef}
      className="absolute z-0 w-[36rem] h-[36rem] rounded-full pointer-events-none hidden lg:block transition-[left,top] duration-500 ease-out"
      style={{
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(16,185,129,0.16), transparent 70%)',
        mixBlendMode: 'screen',
      }}
    />
  );
}

function CountUpValue({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  return (
    <motion.span
      onViewportEnter={() => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        animate(0, target, {
          duration: 1.3,
          ease: 'easeOut',
          onUpdate: (v) => setDisplay(Math.round(v)),
        });
      }}
      viewport={{ once: true, amount: 0.6 }}
    >
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}

const RATING_SCALE = 5;

// One side's rating rendered as discrete sectors instead of a smooth fill —
// segments closest to the shared zero-line light up first, so the count of
// lit segments IS the rating (no need to eyeball a percentage width).
function SegmentedSide({ rating, color, growFrom }: { rating: number; color: 'emerald' | 'cyan'; growFrom: 'start' | 'end' }) {
  const fill = color === 'emerald' ? 'bg-emerald-400' : 'bg-cyan-400';
  return (
    <div className={`flex-1 flex items-center gap-1 ${growFrom === 'end' ? 'flex-row-reverse' : ''}`}>
      {Array.from({ length: RATING_SCALE }).map((_, i) => (
        <motion.span
          key={i}
          className={`h-2 flex-1 rounded-sm ${i < rating ? fill : 'bg-muted'}`}
          initial={{ scaleY: 0.3, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.25, delay: i * 0.05, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function AxisLabel({ rating, category, side, isWinner, color }: { rating: number; category: string; side: 'left' | 'right'; isWinner: boolean; color: 'emerald' | 'cyan' }) {
  const text = color === 'emerald' ? 'text-emerald-400' : 'text-cyan-400';
  return (
    <span className={`text-[11px] flex items-center gap-1.5 ${side === 'left' ? 'flex-row-reverse text-right' : 'text-left'}`}>
      <span className={`font-mono-tech font-bold ${isWinner ? text : 'text-muted-foreground'}`}>{rating}</span>
      <span className={isWinner ? 'font-semibold text-foreground' : 'text-muted-foreground'}>{category}</span>
    </span>
  );
}

function PerformanceComparison({
  productA,
  productB,
  attributes,
}: {
  productA: { shortLabel: string };
  productB: { shortLabel: string };
  attributes: SpectrumAttribute[];
}) {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card/40 p-5 sm:p-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <span className="text-[11px] font-mono-tech text-muted-foreground uppercase tracking-wider">
          Características de Performance
        </span>
        <div className="flex items-center gap-2.5 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            {productA.shortLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            {productB.shortLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {attributes.map((attr) => {
          const aWins = attr.a >= attr.b;

          return (
            <div key={attr.label}>
              <span className="text-xs font-semibold text-foreground block mb-3 text-center">{attr.label}</span>

              {/* Shared zero-line in the middle; each side lights up sectors
                  outward from it — left favors A, right favors B. */}
              <div className="flex items-stretch h-2 gap-1.5">
                <SegmentedSide rating={attr.a} color="emerald" growFrom="end" />
                <div className="w-px bg-border shrink-0" />
                <SegmentedSide rating={attr.b} color="cyan" growFrom="start" />
              </div>

              <div className="flex items-center justify-between mt-2.5">
                <AxisLabel rating={attr.a} category={attr.track[attr.a - 1]} side="left" isWinner={aWins} color="emerald" />
                <AxisLabel rating={attr.b} category={attr.track[attr.b - 1]} side="right" isWinner={!aWins} color="cyan" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { themePreset, setThemePreset } = useTheme();
  const isLight = themePreset === 'light';

  return (
    <button
      type="button"
      onClick={() => setThemePreset(isLight ? 'default' : 'light')}
      title={isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
      aria-label={isLight ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
      className="relative w-9 h-9 rounded-xl border border-border bg-card/60 flex items-center justify-center overflow-hidden text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-colors shrink-0"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-4 h-4" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="w-4 h-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 640);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, y: 12, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          title="Voltar ao topo"
          aria-label="Voltar ao topo"
          className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full border border-border bg-card/80 backdrop-blur-xl shadow-lg shadow-black/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-colors"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question} className="glass-card rounded-2xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-semibold text-foreground">{item.question}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-muted-foreground">
                <ChevronDown className="w-4 h-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function LandingPage({ onEnter }: LandingPageProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.href.slice(1))).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = () => setIsMobileMenuOpen(false);
  const heroRef = useRef<HTMLElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground">
        {/* Ambient Background: dot grid + grain + drifting color orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.4] [.theme-light_&]:opacity-[0.5]"
            style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              color: 'hsl(var(--muted-foreground))',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
              backgroundSize: '120px 120px',
            }}
          />
          {BACKGROUND_ORBS.map((orb) => (
            <motion.div
              key={orb.id}
              className={`absolute rounded-full blur-3xl ${orb.color} ${orb.size}`}
              style={orb.style}
              animate={orb.animate}
              transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
  
        <div className="relative">
          {/* ------------------------------------------------------------- */}
          {/* NAVBAR */}
          {/* ------------------------------------------------------------- */}
          <header className="sticky top-0 z-30 px-3 sm:px-6 pt-3">
            <div
              className={`relative overflow-hidden max-w-6xl mx-auto rounded-2xl border backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${
                isScrolled
                  ? 'bg-background/70 border-border shadow-lg shadow-black/10'
                  : 'bg-background/40 border-border/60 shadow-md shadow-black/5'
              }`}
            >
              <ScrollProgressBar />
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-5 h-14">
                <div className="w-28 shrink-0">
                  <TypingBrand />
                </div>
  
                <nav className="hidden md:flex items-center justify-center gap-1 text-xs font-medium text-muted-foreground">
                  {NAV_LINKS.map((link) => {
                    const isActive = activeSection === link.href.slice(1);
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className={`group relative px-3 py-2 transition-colors ${isActive ? 'text-foreground' : 'hover:text-foreground'}`}
                      >
                        {link.label}
                        <span
                          className={`absolute left-3 right-3 -bottom-0.5 h-px bg-emerald-400 transition-transform origin-left ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </a>
                    );
                  })}
                </nav>
  
                <div className="flex items-center justify-end gap-2.5">
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver código no GitHub"
                    aria-label="Ver código no GitHub"
                    className="hidden sm:flex w-9 h-9 rounded-xl border border-border bg-card/60 items-center justify-center text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-colors shrink-0"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                    className="md:hidden w-9 h-9 rounded-xl border border-border bg-card/60 flex items-center justify-center text-foreground shrink-0"
                  >
                    {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </button>
                </div>
              </div>
  
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="md:hidden overflow-hidden border-t border-border"
                  >
                    <nav className="px-3 py-3 flex flex-col gap-1 text-sm">
                      {NAV_LINKS.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={handleNavClick}
                          className="px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                      <Button onClick={onEnter} size="sm" className="mt-2 gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
                        <span>Testar como funciona</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                      <a
                        href={GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleNavClick}
                        className="sm:hidden mt-1 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        <span>Ver código no GitHub</span>
                      </a>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </header>
  
          {/* ------------------------------------------------------------- */}
          {/* HERO */}
          {/* ------------------------------------------------------------- */}
          <section ref={heroRef} className="relative overflow-hidden max-w-6xl mx-auto px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <CursorGlow containerRef={heroRef} />

            <div className="relative z-10 flex flex-col gap-6">
              <span className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-muted border border-emerald-500/30 text-[11px] font-mono-tech text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                Hackathon Agents for Commerce · Deco 2026
              </span>
  
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl leading-[1.1] tracking-tight text-foreground">
                Um canal de vendas <span className="text-emerald-400">agêntico e personalizado</span>, pronto em minutos
              </h1>
  
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                O <strong className="text-foreground">$Agent</strong> é um canal turnkey que qualquer lojista instala em minutos: vitrine reordenada por IA, cupons, cashback e filtros personalizados para cada cliente — sem cadastro repetido, sem infraestrutura complexa.
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
  
              <div className="flex flex-wrap items-center gap-6 pt-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Fork &amp; Connect ready</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Web + Mobile (Expo)</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> BYOK multi-LLM</span>
              </div>
            </div>
  
            {/* Hero Visual: vitrine animada ciclando pelas funcionalidades */}
            <HeroShowcase />
          </section>
  
          {/* ------------------------------------------------------------- */}
          {/* IMPACTO / ESTATÍSTICAS */}
          {/* ------------------------------------------------------------- */}
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={revealStagger}
            className="max-w-6xl mx-auto px-6 pb-16"
          >
            <div className="glass-panel rounded-3xl border border-border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/80">
              {IMPACT_STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeInUp} className="p-6 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-heading font-extrabold text-2xl text-foreground block leading-none">
                      <CountUpValue target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 block">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
  
          {/* ------------------------------------------------------------- */}
          {/* PROBLEMA -> SOLUÇÃO */}
          {/* ------------------------------------------------------------- */}
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={revealStagger}
            className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-7 border border-border">
              <span className="text-[11px] font-mono-tech text-red-400 uppercase tracking-wider">O problema</span>
              <h3 className="font-heading font-bold text-xl text-foreground mt-2">Personalização passiva e fragmentada</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                O cliente ajusta filtro de tamanho, cor e preço toda vez que entra em uma loja nova. As lojas não compartilham contexto entre si — o resultado é busca genérica, abandono de carrinho e conversão perdida.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp} className="glass-card rounded-3xl p-7 border border-emerald-500/30 bg-emerald-950/10">
              <span className="text-[11px] font-mono-tech text-emerald-400 uppercase tracking-wider">A solução $Agent</span>
              <h3 className="font-heading font-bold text-xl text-foreground mt-2">Um canal contextual único, plug &amp; play</h3>
              <p className="text-sm text-foreground mt-3 leading-relaxed">
                O perfil, histórico e saldo de cashback do cliente atravessam qualquer loja conectada à rede. O lojista instala o canal, conecta o catálogo, e a vitrine já nasce personalizada — <strong className="text-foreground">vende mais e roda por menos</strong>.
              </p>
            </motion.div>
          </motion.section>
  
          {/* ------------------------------------------------------------- */}
          {/* RECURSOS */}
          {/* ------------------------------------------------------------- */}
          <section id="recursos" className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="font-heading font-extrabold text-3xl text-foreground">Tudo que um canal de vendas agêntico precisa</h2>
              <p className="text-sm text-muted-foreground mt-3">Recursos prontos para uso, sem integração pesada para o piloto.</p>
            </div>
  
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={revealStagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className={`glass-card rounded-3xl p-6 border border-border hover:border-primary/40 transition-colors ${
                    index === FEATURES.length - 1 ? 'sm:col-span-2 lg:col-span-1 lg:col-start-2' : ''
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center mb-4 ${feature.color}`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </section>
  
          {/* ------------------------------------------------------------- */}
          {/* BATALHA SWORDS */}
          {/* ------------------------------------------------------------- */}
          <motion.section
            id="swords"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealStagger}
            className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono-tech text-purple-300 [.theme-light_&]:text-purple-700 mb-4">
                <Swords className="w-3.5 h-3.5" />
                Batalha Swords
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-foreground">Dois produtos, um veredito</h2>
              <p className="text-sm text-muted-foreground mt-3">O agente compara especificações técnicas e explica, em português claro, qual produto é ideal para aquele cliente.</p>
            </motion.div>
  
            <motion.div variants={fadeInUp} className="glass-panel rounded-3xl border border-purple-500/20 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                {[swordsProductA, swordsProductB].map((product, i) => (
                  <React.Fragment key={product.id}>
                    <div className="glass-card rounded-2xl p-4 border border-border flex flex-col">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={handleImageError}
                        />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-foreground leading-snug" title={product.name}>{product.name}</h4>
                      <p className="text-sm font-heading font-bold text-emerald-400 mt-1">R$ {product.price}</p>
                    </div>
                    {i === 0 && (
                      <div className="flex md:flex-col items-center justify-center gap-2 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/40 flex items-center justify-center">
                          <Swords className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="font-heading font-extrabold text-xs text-purple-400 [.theme-light_&]:text-purple-700">VS</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
  
              <PerformanceComparison
                productA={{ shortLabel: 'Nike Tiempo' }}
                productB={{ shortLabel: 'Adidas Predator' }}
                attributes={SWORDS_COMPARISON}
              />
  
              <div className="mt-6 rounded-2xl bg-purple-950/20 border border-purple-500/30 p-5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-purple-300 [.theme-light_&]:text-purple-700" />
                </div>
                <div>
                  <span className="text-[11px] font-mono-tech text-purple-300 [.theme-light_&]:text-purple-700 uppercase tracking-wider">Veredito agêntico</span>
                  <p className="text-sm text-foreground mt-1 leading-relaxed">
                    Para {demoPersona.name.split(' ')[0]}, que joga futebol society, a <strong className="text-foreground">{swordsProductA.name}</strong> vence: trava multidirecional baixa ideal para grama sintética, no tamanho {demoPersona.sizes.shoes} disponível em estoque.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>
  
          {/* ------------------------------------------------------------- */}
          {/* COMO FUNCIONA */}
          {/* ------------------------------------------------------------- */}
          <motion.section
            id="como-funciona"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealStagger}
            className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-xl mx-auto mb-12">
              <h2 className="font-heading font-extrabold text-3xl text-foreground">Como funciona</h2>
              <p className="text-sm text-muted-foreground mt-3">Do fork ao primeiro cliente personalizado, em três passos.</p>
            </motion.div>
  
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step, index) => (
                <motion.div key={step.number} variants={fadeInUp} className="glass-card rounded-3xl p-6 border border-border relative">
                  {index < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-[2.875rem] left-full w-6 h-px bg-gradient-to-r from-border to-transparent z-10" />
                  )}
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-base text-foreground">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
  
            <motion.div variants={fadeInUp} className="flex flex-col items-center gap-3 pt-10 text-center">
              <p className="text-xs text-muted-foreground max-w-sm">
                Quer o passo a passo completo, a arquitetura e os endpoints da API? Confira a documentação.
              </p>
              <a href={DOCS_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Ver Documentação</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </a>
            </motion.div>
          </motion.section>
  
          {/* ------------------------------------------------------------- */}
          {/* PARA LOJISTAS */}
          {/* ------------------------------------------------------------- */}
          <motion.section
            id="lojistas"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeInUp}
            className="max-w-6xl mx-auto px-6 py-16 scroll-mt-20"
          >
            <div className="glass-panel rounded-3xl p-8 md:p-10 border border-cyan-500/30 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-background via-card to-background">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-mono-tech text-[11px] mb-4">
                  <Store className="w-3.5 h-3.5" />
                  Para lojistas
                </span>
                <h3 className="font-heading font-bold text-2xl text-foreground">Instalação rápida, sem trocar sua stack</h3>
                <p className="text-sm text-foreground mt-3 leading-relaxed">
                  Fork do repositório, troque os adaptadores de catálogo em <code className="font-mono-tech text-emerald-400">packages/shared/src/mocks.ts</code> pelos seus dados reais e faça deploy em 1 clique. Sem autenticação nem banco de dados obrigatórios para validar o piloto.
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Mais que um canal de vendas: cada busca, filtro e compra aproxima você do seu cliente e vira dado de contexto — a base para, quando fizer sentido, escalar para um app mobile próprio e ainda mais robusto.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Open-source, licença MIT, white-label</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Deploy em 1 clique (Vercel + Serverless Functions)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>BYOK: Gemini, OpenAI ou Anthropic — sua escolha</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground">
                  <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Pronto para virar app nativo iOS &amp; Android — $SuaLoja</span>
                </div>
              </div>
            </div>
          </motion.section>
  
          {/* ------------------------------------------------------------- */}
          {/* FAQ */}
          {/* ------------------------------------------------------------- */}
          <motion.section
            id="faq"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={revealStagger}
            className="max-w-3xl mx-auto px-6 py-16 scroll-mt-20"
          >
            <motion.div variants={fadeInUp} className="text-center max-w-xl mx-auto mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono-tech text-cyan-400 mb-4">
                <HelpCircle className="w-3.5 h-3.5" />
                Perguntas frequentes
              </span>
              <h2 className="font-heading font-extrabold text-3xl text-foreground">Antes de instalar, tire suas dúvidas</h2>
              <p className="text-sm text-muted-foreground mt-3">O que lojistas costumam perguntar antes de rodar o piloto.</p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <FAQAccordion />
            </motion.div>
          </motion.section>

          {/* ------------------------------------------------------------- */}
          {/* CTA FINAL */}
          {/* ------------------------------------------------------------- */}
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto px-6 pb-20 text-center flex flex-col items-center gap-5"
          >
            <h2 className="font-heading font-extrabold text-3xl text-foreground">Veja o $Agent em ação agora</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Navegue pela demo com o perfil de Pedro França e veja a vitrine, os cupons e o cashback se ajustarem em tempo real.
            </p>
            <Button onClick={onEnter} size="lg" className="gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">
              <span>Testar como funciona</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.section>
  
          {/* ------------------------------------------------------------- */}
          {/* FOOTER */}
          {/* ------------------------------------------------------------- */}
          <footer className="border-t border-border/80">
            <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
                <span className="logo-agent-financial text-lg tracking-tighter">$Agent</span>
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[16rem]">
                  Canal de vendas agêntico e personalizado, pronto para qualquer lojista instalar.
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-mono-tech text-muted-foreground uppercase tracking-wider">Produto</span>
                {NAV_LINKS.map((link) => (
                  <a key={link.href} href={link.href} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors w-fit">
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-mono-tech text-muted-foreground uppercase tracking-wider">Recursos</span>
                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors w-fit">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Documentação</span>
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors w-fit">
                  <Github className="w-3.5 h-3.5" />
                  <span>Código-fonte</span>
                </a>
              </div>

              <div className="flex flex-col gap-2.5">
                <span className="text-[11px] font-mono-tech text-muted-foreground uppercase tracking-wider">Comece agora</span>
                <button type="button" onClick={onEnter} className="text-[11px] text-muted-foreground hover:text-foreground transition-colors w-fit text-left">
                  Testar como funciona
                </button>
              </div>
            </div>

            <div className="border-t border-border/60">
              <div className="max-w-6xl mx-auto px-6 py-5">
                <p className="text-[11px] text-muted-foreground text-center sm:text-left">
                  Desenvolvido para o Hackathon Agents for Commerce — Deco (2026). MVP em modo mock, sem autenticação ou banco de dados.
                </p>
              </div>
            </div>
          </footer>
        </div>
  
        <ScrollToTopButton />
      </div>
    </MotionConfig>
  );
}
