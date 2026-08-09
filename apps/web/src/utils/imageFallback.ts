import React from 'react';

export const DEFAULT_PRODUCT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=600&auto=format&fit=crop&q=80';

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_PRODUCT_FALLBACK_IMAGE
) => {
  const target = e.currentTarget;
  target.onerror = null; // Instantly prevent infinite triggering loop and flickering
  if (target.src !== fallbackSrc) {
    target.src = fallbackSrc;
  }
};
