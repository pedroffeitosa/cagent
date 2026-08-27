import React from 'react';
import { Product } from '@cagent/shared';
import { SearchX } from 'lucide-react';
import { handleImageError } from '../../utils/imageFallback';

interface SearchSuggestionsProps {
  suggestions: Product[];
  highlightedIndex: number;
  onSelect: (product: Product) => void;
  onHover: (index: number) => void;
}

export function SearchSuggestions({ suggestions, highlightedIndex, onSelect, onHover }: SearchSuggestionsProps) {
  return (
    <div className="absolute top-full mt-2 left-0 right-0 rounded-xl bg-card border border-border shadow-2xl overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
      {suggestions.length === 0 ? (
        <div className="px-3 py-4 flex items-center gap-2 text-xs text-faint">
          <SearchX className="w-3.5 h-3.5 shrink-0" />
          <span>Nenhum produto encontrado</span>
        </div>
      ) : (
        <ul className="max-h-80 overflow-y-auto custom-scrollbar py-1">
          {suggestions.map((product, index) => (
            <li key={product.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(product)}
                onMouseEnter={() => onHover(index)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition ${
                  index === highlightedIndex ? 'bg-elevated' : 'hover:bg-elevated/60'
                }`}
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-background border border-border shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{product.category}</p>
                </div>
                <span className="text-xs font-heading font-bold text-foreground shrink-0">R$ {product.price}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
