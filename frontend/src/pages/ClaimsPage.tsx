import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Claim, ClaimStatus } from '../types';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';

export const ClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMyClaims();
      setClaims(data || []);
    } catch (err: any) {
      console.error('Failed to load claims', err);
      setError(err.message || 'Unable to retrieve claims history.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'UNDER_ADMIN_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Under Guardian Review
          </span>
        );
      case 'HANDOVER_SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <QrCode className="w-3.5 h-3.5" />
            Handover Scheduled
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Recovered & Closed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'PENDING_VERIFICATION':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" />
            Pending Verification
          </span>
        );
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Low Risk
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Medium Risk
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20">
            High Risk
          </span>
        );
      default:
        return null;
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesStatus = filterStatus === 'ALL' || claim.status === filterStatus;
    const itemTitle = claim.foundItem?.title?.toLowerCase() || '';
    const itemCat = claim.foundItem?.category?.toLowerCase() || '';
    const matchesSearch =
      itemTitle.includes(searchQuery.toLowerCase()) ||
      itemCat.includes(searchQuery.toLowerCase()) ||
      (claim.claimDescription && claim.claimDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>My Recovery Claims</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track verification progress, guardian reviews, and SafeReturn QR codes for your claimed items.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>Browse Found Items</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'PENDING_VERIFICATION', 'UNDER_ADMIN_REVIEW', 'APPROVED', 'COMPLETED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {st === 'ALL' ? 'All Claims' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Claims List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Loading your recovery claims...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-white/5">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No claims found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            {searchQuery || filterStatus !== 'ALL'
              ? 'No claims match your active filter criteria.'
              : 'You have not submitted any recovery claims yet. If you see an item in the directory that belongs to you, submit an ownership claim.'}
          </p>
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/30"
          >
            <span>Explore Found Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="group rounded-2xl bg-slate-900/80 border border-white/10 p-5 hover:border-indigo-500/30 transition shadow-lg hover:shadow-indigo-950/20"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Item Information */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {claim.foundItem?.imageUrl ? (
                      <img
                        src={claim.foundItem.imageUrl}
                        alt={claim.foundItem.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-slate-600">
                        {claim.foundItem?.title?.charAt(0) || 'L'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400">CLAIM #{claim.id}</span>
                      {getStatusBadge(claim.status)}
                      {getRiskBadge(claim.riskLevel)}
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                      {claim.foundItem?.title || 'Unknown Item'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>Category: <strong className="text-slate-300">{claim.foundItem?.category}</strong></span>
                      <span>Found at: <strong className="text-slate-300">{claim.foundItem?.locationName}</strong></span>
                      <span>Submitted: <strong className="text-slate-300">{new Date(claim.createdAt).toLocaleDateString()}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Verification Score & Handover Action */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:self-center border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                  {/* Score pill */}
                  <div className="flex items-center gap-3 bg-slate-950/60 border border-white/5 px-3.5 py-2 rounded-xl">
                    <div className="text-right">
                      <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-mono">DNA Match</span>
                      <span className="text-sm font-bold text-indigo-400">
                        {claim.verificationScore ? `${claim.verificationScore.toFixed(0)}%` : '0%'}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                  </div>

                  {/* Actions */}
                  {(claim.status === 'APPROVED' || claim.status === 'HANDOVER_SCHEDULED' || claim.status === 'COMPLETED') ? (
                    <Link
                      to={`/recovery-journey?claimId=${claim.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 whitespace-nowrap"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{claim.status === 'COMPLETED' ? 'View Digital Receipt' : 'Open SafeReturn QR'}</span>
                    </Link>
                  ) : (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-950/40 px-3 py-2 rounded-xl border border-white/5">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>QR unlocks upon admin approval</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible Details / Admin Notes */}
              {(claim.claimDescription || claim.adminNotes) && (
                <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {claim.claimDescription && (
                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-slate-500 block text-[11px] font-medium mb-1">Your Claim Statement:</span>
                      <p className="text-slate-300 italic">"{claim.claimDescription}"</p>
                    </div>
                  )}

                  {claim.adminNotes && (
                    <div className="bg-indigo-950/20 p-2.5 rounded-xl border border-indigo-500/20">
                      <span className="text-indigo-400 block text-[11px] font-medium mb-1 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        Guardian Staff Remarks:
                      </span>
                      <p className="text-slate-200">{claim.adminNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
