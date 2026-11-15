import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import { SmartMatch, ItemResponse } from '../types';
import { ItemModal } from '../components/ItemModal';
import {
  Sparkles,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Compass
} from 'lucide-react';

export const SmartMatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [matches, setMatches] = useState<SmartMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFoundItem, setSelectedFoundItem] = useState<ItemResponse | null>(null);

  const targetItemId = searchParams.get('item');

  useEffect(() => {
    loadMatches();
  }, [targetItemId]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      if (targetItemId) {
        const res = await api.getMatchesForItem(parseInt(targetItemId, 10));
        setMatches(res);
      } else {
        const res = await api.getHighConfidenceMatches();
        setMatches(res);
      }
    } catch (e) {
      console.error('Error fetching matches', e);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceBadge = (confidence: string, score: number) => {
    if (confidence === 'STRONG_MATCH' || score >= 75) {
      return (
        <span className="px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strong Match ({score}%)</span>
        </span>
      );
    }
    if (confidence === 'POSSIBLE_MATCH' || score >= 50) {
      return (
        <span className="px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span>Possible Match ({score}%)</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-white/10">
        Weak Match ({score}%)
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>SmartMatch Intelligence Engine</span>
          </span>
          <span className="text-xs text-slate-400">7-Factor Weighted Comparison</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Active Campus Matches</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          The SmartMatch engine continually calculates cross-correlations between lost and found reports using title tokens (25%), category (20%), description (15%), GPS proximity (15%), date gap (10%), color (10%), and brand (5%).
        </p>
      </div>

      {/* Notice Banner: Zero Auto Approval */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 flex items-start gap-3 shadow-lg">
        <HelpCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Guardians Verification Policy:</strong> SmartMatch scores indicate correlation likelihood for administrative prioritization. Claims are never automatically approved without verified Item DNA testimony or security review.
        </div>
      </div>

      {/* Matches List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-900/50 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-white/10 text-slate-400">
          <Sparkles className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-white">No active matches found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            When new lost or found reports matching item characteristics are submitted, they will appear here with detailed scoring breakdowns.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match) => (
            <div
              key={match.id}
              className="rounded-3xl bg-slate-900/90 border border-white/10 p-6 shadow-2xl space-y-6 hover:border-indigo-500/30 transition"
            >
              {/* Header: Score & Confidence */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black text-white font-mono">
                    {match.overallScore}%
                  </div>
                  <div>
                    {getConfidenceBadge(match.confidenceClassification, match.overallScore)}
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Distance: ~{Math.round(match.distanceMeters || 0)}m • Gap: {match.daysDifference || 0} days
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/campusverse"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View on Campus Radar</span>
                  </Link>
                  {match.foundItem && (
                    <button
                      onClick={() => setSelectedFoundItem(match.foundItem)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Initiate Claim</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Side-by-Side Comparison: Lost Item vs Found Item */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lost Item Card */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                      LOST REPORT #{match.lostItemId}
                    </span>
                    <span className="text-[10px] text-slate-400">{match.lostItem?.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{match.lostItem?.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {match.lostItem?.description}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{match.lostItem?.locationName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{match.lostItem?.dateLostOrFound}</span>
                    </div>
                  </div>
                </div>

                {/* Found Item Card */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      FOUND REPORT #{match.foundItemId}
                    </span>
                    <span className="text-[10px] text-slate-400">{match.foundItem?.category}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{match.foundItem?.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {match.foundItem?.description}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{match.foundItem?.locationName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{match.foundItem?.dateLostOrFound}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Factor Weighted Breakdown Bars */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Algorithmic Score Breakdown (100% Total)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500">Name (25%)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{match.nameScore}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500">Category (20%)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{match.categoryScore}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500">Description (15%)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{match.descriptionScore}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500">Location (15%)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{match.locationScore}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500">Date (10%)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{match.dateScore}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500">Color (10%)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{match.colorScore}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-500">Brand (5%)</div>
                    <div className="text-sm font-bold text-white mt-0.5">{match.brandScore}</div>
                  </div>
                </div>
              </div>

              {/* Match Reasons List */}
              {match.matchReasons && match.matchReasons.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Match Explanation & Evidence
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {match.matchReasons.map((reason, rIdx) => (
                      <li key={rIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Claim Initiation Modal */}
      <ItemModal
        item={selectedFoundItem}
        onClose={() => setSelectedFoundItem(null)}
        onClaimSuccess={() => {
          loadMatches();
        }}
      />
    </div>
  );
};
