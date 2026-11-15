import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Claim } from '../types';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Eye,
  ShieldCheck,
  User,
  Sparkles,
  Lock,
  ChevronRight,
  Filter
} from 'lucide-react';

export const AdminClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Review modal state
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAllClaims();
      setClaims(data || []);
    } catch (err: any) {
      console.error('Failed to load admin claims', err);
      setError(err.message || 'Unable to retrieve claims list.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (claim: Claim) => {
    setSelectedClaim(claim);
    setReviewNotes(claim.adminNotes || '');
    setActionSuccess(null);
  };

  const handleReviewSubmit = async (approve: boolean) => {
    if (!selectedClaim) return;
    setSubmittingReview(true);
    setError(null);

    try {
      const updated = await api.reviewClaim(selectedClaim.id, approve, reviewNotes);
      setClaims((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setActionSuccess(
        approve
          ? `Claim #${selectedClaim.id} APPROVED! SafeReturn handover pass generated.`
          : `Claim #${selectedClaim.id} REJECTED.`
      );
      setSelectedClaim(null);
    } catch (err: any) {
      console.error('Review failed', err);
      setError(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesStatus = filterStatus === 'ALL' || claim.status === filterStatus;
    const title = claim.foundItem?.title?.toLowerCase() || '';
    const claimant = claim.claimant?.fullName?.toLowerCase() || '';
    const email = claim.claimant?.email?.toLowerCase() || '';
    const matchesSearch =
      title.includes(searchQuery.toLowerCase()) ||
      claimant.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              GUARDIAN ADJUDICATION
            </span>
            <span className="text-xs text-slate-400">Item DNA Verification Queue</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Recovery Claims Queue</h1>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'PENDING_VERIFICATION', 'UNDER_ADMIN_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED'].map((st) => (
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
            placeholder="Search claimant, email or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Claims Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading recovery claims queue...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : filteredClaims.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs">
          No recovery claims match the selected criteria.
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-white/5 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Claim ID</th>
                  <th className="py-3.5 px-4">Target Item</th>
                  <th className="py-3.5 px-4">Claimant</th>
                  <th className="py-3.5 px-4">DNA Match</th>
                  <th className="py-3.5 px-4">Risk Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                      #{claim.id}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-800 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-500">
                          {claim.foundItem?.imageUrl ? (
                            <img
                              src={claim.foundItem.imageUrl}
                              alt={claim.foundItem.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            claim.foundItem?.title?.charAt(0) || 'I'
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">
                            {claim.foundItem?.title || 'Unknown Item'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {claim.foundItem?.category} • {claim.foundItem?.locationName}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <span className="font-medium text-slate-200 block">
                          {claim.claimant?.fullName}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {claim.claimant?.email} • Trust {claim.claimant?.trustScore}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                      {claim.verificationScore ? `${claim.verificationScore.toFixed(0)}%` : '0%'}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          claim.riskLevel === 'LOW'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : claim.riskLevel === 'MEDIUM'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {claim.riskLevel} RISK
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-slate-300">
                        {claim.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(claim)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-white/10 text-xs font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Adjudicate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">
                  ADJUDICATION CASE #{selectedClaim.id}
                </span>
                <h3 className="text-lg font-bold text-white">
                  Review Claim for {selectedClaim.foundItem?.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Verification Comparison Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <span className="text-slate-500 font-mono text-[10px] uppercase block">
                  Claimant Details
                </span>
                <p className="text-slate-200 font-semibold">{selectedClaim.claimant?.fullName}</p>
                <p className="text-slate-400">{selectedClaim.claimant?.email}</p>
                <p className="text-slate-400">Department: {selectedClaim.claimant?.department || 'N/A'}</p>
                <p className="text-emerald-400 font-semibold">
                  Community Trust Score: {selectedClaim.claimant?.trustScore}%
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                <span className="text-slate-500 font-mono text-[10px] uppercase block">
                  Item DNA & Evidence
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Automated Score:</span>
                  <span className="text-indigo-400 font-bold font-mono">
                    {selectedClaim.verificationScore ? `${selectedClaim.verificationScore.toFixed(0)}%` : '0%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Assessment:</span>
                  <span className="text-slate-200 font-semibold">{selectedClaim.riskLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Private DNA Hash:</span>
                  <span className="text-emerald-400 font-mono text-[10px]">
                    {selectedClaim.foundItem?.hasPrivateDna ? 'SHA-256 Registered' : 'Not Set'}
                  </span>
                </div>
              </div>
            </div>

            {/* Claimant Input Verification Answers */}
            <div className="space-y-3 bg-slate-950/40 p-4 rounded-2xl border border-white/5 text-xs">
              <span className="font-semibold text-slate-300 block">Submitted Ownership Evidence</span>

              <div>
                <span className="text-[11px] text-slate-500 block">Serial Number Match Attempt:</span>
                <p className="font-mono text-slate-200 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 mt-1">
                  {selectedClaim.serialNumberAttempt || 'None specified by claimant'}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block">Distinctive Markings / Secrets:</span>
                <p className="font-mono text-slate-200 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 mt-1">
                  {selectedClaim.distinctiveMarksAttempt || 'None specified by claimant'}
                </p>
              </div>

              {selectedClaim.claimDescription && (
                <div>
                  <span className="text-[11px] text-slate-500 block">Additional Ownership Statement:</span>
                  <p className="text-slate-300 italic bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 mt-1">
                    "{selectedClaim.claimDescription}"
                  </p>
                </div>
              )}
            </div>

            {/* Staff Adjudication Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Review Remarks / Handover Instructions
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Serial number matches manufacturer database. Approved for physical handover at Gate 1."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={submittingReview}
                onClick={() => handleReviewSubmit(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Claim</span>
              </button>

              <button
                type="button"
                disabled={submittingReview}
                onClick={() => handleReviewSubmit(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Authorize QR</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
