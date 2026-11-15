import React from 'react';
import { ItemResponse } from '../types';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Laptop,
  CreditCard,
  FileText,
  Briefcase,
  Book,
  Shirt,
  Watch,
  Key,
  HelpCircle
} from 'lucide-react';

interface ItemCardProps {
  item: ItemResponse;
  onViewDetails?: (item: ItemResponse) => void;
  onClaim?: (item: ItemResponse) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onViewDetails, onClaim }) => {
  const isLost = item.type === 'LOST';

  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('electronic') || c.includes('laptop') || c.includes('phone')) return Laptop;
    if (c.includes('id') || c.includes('card')) return CreditCard;
    if (c.includes('document')) return FileText;
    if (c.includes('bag') || c.includes('wallet')) return Briefcase;
    if (c.includes('book')) return Book;
    if (c.includes('cloth')) return Shirt;
    if (c.includes('jewel') || c.includes('watch')) return Watch;
    if (c.includes('key')) return Key;
    return HelpCircle;
  };

  const Icon = getCategoryIcon(item.category);

  return (
    <div className="group relative rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/15 hover:border-[#8FE0BE]/50 p-4 transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col justify-between">
      {/* Top Header: Type & Status Badges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase border ${
                isLost
                  ? 'bg-[#F17F68]/20 text-[#F17F68] border-[#F17F68]/35'
                  : 'bg-[#167D78]/30 text-[#8FE0BE] border-[#167D78]/50'
              }`}
            >
              {item.type}
            </span>

            {item.isCritical && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#E9B65A]/20 text-[#E9B65A] border border-[#E9B65A]/35">
                <AlertTriangle className="w-3 h-3 text-[#E9B65A]" />
                <span>Critical</span>
              </span>
            )}
          </div>

          {/* Item DNA Verification Secured Pill */}
          {item.hasPrivateDna && (
            <span
              title="Protected with Item DNA private ownership hash"
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#8FE0BE]/15 text-[#8FE0BE] border border-[#8FE0BE]/30"
            >
              <ShieldCheck className="w-3 h-3 text-[#8FE0BE]" />
              <span>DNA Secured</span>
            </span>
          )}
        </div>

        {/* Thumbnail / Category Graphic */}
        <div className="w-full h-36 rounded-xl bg-[#142B38] border border-[#EDE5D6]/10 flex items-center justify-center overflow-hidden mb-3.5 relative">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#EDE5D6]/50">
              <Icon className="w-10 h-10 text-[#8FE0BE]/60 group-hover:text-[#8FE0BE] transition" />
              <span className="text-[11px] font-semibold text-[#EDE5D6]/70">{item.category}</span>
            </div>
          )}

          {/* Status Label Overlay */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold tracking-wide uppercase bg-[#142B38]/90 text-[#F5F1E8] border border-[#EDE5D6]/15 backdrop-blur-md">
              {item.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-sm text-[#F5F1E8] line-clamp-1 group-hover:text-[#8FE0BE] transition">
          {item.title}
        </h3>
        <p className="text-xs text-[#EDE5D6]/70 line-clamp-2 mt-1 leading-relaxed">
          {item.description || 'No additional description provided.'}
        </p>

        {/* Location & Date Details */}
        <div className="mt-3.5 space-y-1.5 pt-3 border-t border-[#EDE5D6]/10 text-[11px] text-[#EDE5D6]/80">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#8FE0BE] flex-shrink-0" />
            <span className="truncate">{item.locationName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#E9B65A] flex-shrink-0" />
            <span>{item.dateLostOrFound || 'Recent'}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-[#EDE5D6]/15 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails && onViewDetails(item)}
          className="flex-1 py-1.5 px-3 rounded-xl bg-[#142B38] hover:bg-[#142B38]/80 text-[#EDE5D6] hover:text-[#F5F1E8] border border-[#EDE5D6]/15 text-xs font-semibold transition"
        >
          View Details
        </button>

        {!isLost && item.status === 'REPORTED' && onClaim && (
          <button
            onClick={() => onClaim(item)}
            className="flex-1 py-1.5 px-3 rounded-xl bg-[#167D78] hover:bg-[#126863] text-[#F5F1E8] text-xs font-bold transition shadow-md shadow-[#167D78]/25"
          >
            Claim Item
          </button>
        )}
      </div>
    </div>
  );
};
