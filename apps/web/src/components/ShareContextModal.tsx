import React, { useState } from 'react';
import { UserProfile, Product } from '@cagent/shared';
import { Share2, Copy, Check, MessageCircle, QrCode, X, Sparkles, Gift } from 'lucide-react';
import { Button } from './ui/button';

interface ShareContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  queryTitle: string;
  recommendedProducts: Product[];
}

export function ShareContextModal({
  isOpen,
  onClose,
  userProfile,
  queryTitle,
  recommendedProducts,
}: ShareContextModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `https://cagent.deco.site/share?user=${encodeURIComponent(userProfile.name)}&q=${encodeURIComponent(queryTitle)}`;
  const whatsappMessage = `*Recomendação do $Agent Commerce* 🛍️✨\n\nConfira as sugestões de *${queryTitle}* recomendadas para *${userProfile.name}* no canal agêntico!\n\n🎟️ Cupom Ativo: *DECO10* (10% OFF)\n🔗 Acesse aqui: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col gap-6 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-base text-white">Compartilhar Busca Agêntica</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Preview Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs">$Agent Context Card</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-tech">
              DECO10 • 10% OFF
            </span>
          </div>

          <p className="text-slate-200 text-xs leading-relaxed">
            Recomendações de <strong>"{queryTitle}"</strong> criadas para <strong>{userProfile.name}</strong>.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Inclui cupom promocional ativo e pontos de cashback para amigos.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-600/15"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Compartilhar no WhatsApp</span>
          </button>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono-tech text-[11px] truncate focus:outline-none"
            />
            <Button onClick={handleCopyLink} variant="secondary" className="px-4">
              {copied ? <Check className="w-4 h-4 text-emerald-400 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* QR Code Section for Mobile App Sync */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
            <QrCode className="w-full h-full text-slate-950" />
          </div>
          <div>
            <span className="font-bold text-white text-xs block">Abrir no App Mobile Expo</span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Escaneie este QR Code para abrir esta recomendação instantaneamente no celular.
            </p>
          </div>
        </div>

        <Button onClick={onClose} variant="secondary" className="w-full">
          Fechar
        </Button>

      </div>
    </div>
  );
}
