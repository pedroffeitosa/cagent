import React, { useState } from 'react';
import { UserProfile, Product, Coupon } from '@cagent/shared';
import { Share2, Copy, Check, MessageCircle, QrCode, X, Sparkles, Gift } from 'lucide-react';
import { Button } from './ui/button';

interface ShareContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  queryTitle: string;
  recommendedProducts: Product[];
  activeCoupon: Coupon | null;
}

export function ShareContextModal({
  isOpen,
  onClose,
  userProfile,
  queryTitle,
  recommendedProducts,
  activeCoupon,
}: ShareContextModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const couponLabel = activeCoupon
    ? `${activeCoupon.code} (${activeCoupon.discountType === 'percentage' ? `${activeCoupon.discountValue}% OFF` : `R$ ${activeCoupon.discountValue.toFixed(2).replace('.', ',')} OFF`})`
    : null;
  const shareUrl = `https://cagent.deco.site/share?user=${encodeURIComponent(userProfile.name)}&q=${encodeURIComponent(queryTitle)}`;
  const whatsappMessage = `*Recomendação do $Agent Commerce* 🛍️✨\n\nConfira as sugestões de *${queryTitle}* recomendadas para *${userProfile.name}* no canal agêntico!\n\n${couponLabel ? `🎟️ Cupom Ativo: *${couponLabel}*\n` : ''}🔗 Acesse aqui: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border shadow-2xl flex flex-col gap-6 text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-bold text-base text-foreground">Compartilhar Busca Agêntica</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Preview Card */}
        <div className="p-4 rounded-2xl bg-background border border-primary/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground text-xs">$Agent Context Card</span>
            </div>
            {couponLabel && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono-tech">
                {couponLabel}
              </span>
            )}
          </div>

          <p className="text-foreground text-xs leading-relaxed">
            Recomendações de <strong>"{queryTitle}"</strong> criadas para <strong>{userProfile.name}</strong>.
          </p>

          <div className="flex items-center gap-2 pt-2 border-t border-border/80 text-[10px] text-muted-foreground">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Inclui cupom promocional ativo e pontos de cashback para amigos.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-primary/15"
          >
            <MessageCircle className="w-4 h-4 fill-primary-foreground" />
            <span>Compartilhar no WhatsApp</span>
          </button>

          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground font-mono-tech text-[11px] truncate focus:outline-none"
            />
            <Button onClick={handleCopyLink} variant="secondary" className="px-4">
              {copied ? <Check className="w-4 h-4 text-primary stroke-[3]" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* QR Code Section for Mobile App Sync */}
        <div className="p-4 rounded-2xl bg-card/60 border border-border/80 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
            <QrCode className="w-full h-full text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-foreground text-xs block">Abrir no App Mobile Expo</span>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
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
