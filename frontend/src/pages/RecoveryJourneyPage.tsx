import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../api';
import { SafeReturnHandover, Claim } from '../types';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Copy,
  MapPin,
  Calendar,
  Lock,
  KeyRound,
  FileCheck2,
  RefreshCw,
  Printer,
  Sparkles
} from 'lucide-react';

export const RecoveryJourneyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const claimIdParam = searchParams.get('claimId');

  const [claimId, setClaimId] = useState<number | null>(claimIdParam ? parseInt(claimIdParam, 10) : null);
  const [handover, setHandover] = useState<SafeReturnHandover | null>(null);
  const [claimsList, setClaimsList] = useState<Claim[]>([]);
  const [inputCode, setInputCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadApprovedClaims();
  }, []);

  useEffect(() => {
    if (claimId) {
      loadHandoverData(claimId);
    }
  }, [claimId]);

  const loadApprovedClaims = async () => {
    try {
      const claims = await api.getMyClaims();
      const eligible = claims.filter(c =>
        c.status === 'APPROVED' || c.status === 'HANDOVER_SCHEDULED' || c.status === 'COMPLETED'
      );
      setClaimsList(eligible);
      if (!claimId && eligible.length > 0) {
        setClaimId(eligible[0].id);
      }
    } catch (e) {
      console.error('Failed to load eligible claims', e);
    }
  };

  const loadHandoverData = async (cId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHandoverByClaim(cId);
      setHandover(data);
      if (data.status === 'COMPLETED' || data.status === 'VERIFIED') {
        triggerConfetti();
      }
    } catch (err: any) {
      console.error('Failed to load handover data', err);
      setError(err.message || 'SafeReturn handover record not yet generated for this claim.');
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#8b5cf6', '#3b82f6']
    });
  };

  const handleVerifyHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimId || !inputCode.trim()) return;

    setVerifying(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const updated = await api.verifyHandover(claimId, inputCode.trim());
      setHandover(updated);
      setSuccessMessage('Handover successfully verified! The item is officially marked as RECOVERED.');
      triggerConfetti();
    } catch (err: any) {
      console.error('Verification failed', err);
      setError(err.message || 'Handover verification code is invalid or has expired.');
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCompleted = handover?.status === 'COMPLETED' || handover?.status === 'VERIFIED';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          to="/claims"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Claims</span>
        </Link>

        {claimsList.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Select Claim:</span>
            <select
              value={claimId || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setClaimId(val);
                navigate(`/recovery-journey?claimId=${val}`);
              }}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {claimsList.map(c => (
                <option key={c.id} value={c.id}>
                  Claim #{c.id} — {c.foundItem?.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>SafeReturn One-Time Handover Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isCompleted ? 'Item Recovery Verified' : 'SafeReturn Handover Pass'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              {isCompleted
                ? 'Your recovery handover has been digitally verified. A permanent tamper-evident receipt has been registered on the campus audit ledger.'
                : 'Present this cryptographic QR code or 6-digit OTP code at the designated campus recovery hub to confirm physical custody.'}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
                RECOVERED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                <Lock className="w-4 h-4" />
                HANDOVER SCHEDULED
              </span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Generating your SafeReturn cryptographic pass...</p>
        </div>
      ) : error && !handover ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-semibold text-rose-300">SafeReturn Pass Not Ready</h3>
          <p className="text-xs text-rose-200/80 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => claimId && loadHandoverData(claimId)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Retrieval</span>
          </button>
        </div>
      ) : handover ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: QR Code & Handover Pass */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-xl text-center space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-indigo-400" />
              <span>Digital Campus QR Pass</span>
            </div>

            {/* QR Image Box */}
            <div className="relative p-3 bg-white rounded-2xl shadow-inner border border-slate-300 flex items-center justify-center">
              {handover.qrCodeBase64 ? (
                <img
                  src={`data:image/png;base64,${handover.qrCodeBase64}`}
                  alt="SafeReturn QR Code"
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-slate-600 font-mono text-xs">
                  QR GENERATING...
                </div>
              )}
            </div>

            {/* 6-digit OTP Code display */}
            <div className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-3.5 space-y-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                6-Digit Verification Code (OTP)
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl font-mono font-extrabold text-indigo-300 tracking-widest">
                  {handover.handoverCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(handover.handoverCode)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Copy Code"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              {copied && <span className="text-[10px] text-emerald-400 block">Copied to clipboard!</span>}
            </div>

            <p className="text-[11px] text-slate-500 max-w-xs">
              Show this QR code to the campus custodian or security desk at CGC Jhanjeri.
            </p>
          </div>

          {/* Right Column: Handover Details & Verification Form */}
          <div className="md:col-span-7 space-y-6">
            {/* Location & Schedule Card */}
            <div className="rounded-3xl bg-slate-900 border border-white/10 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Designated Pick-Up Point</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-slate-500 font-medium block">Campus Location</span>
                  <span className="text-slate-200 font-semibold text-sm">
                    {handover.handoverLocation || 'Campus Security Main Gate, Block 1'}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-slate-500 font-medium block">Associated Claim</span>
                  <span className="text-slate-200 font-mono font-semibold text-sm">
                    CLAIM #{handover.claimId}
                  </span>
                </div>
              </div>

              {handover.notes && (
                <div className="text-xs bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-2xl text-slate-300">
                  <strong className="text-indigo-300 font-medium block mb-1">Pick-up Instructions:</strong>
                  {handover.notes}
                </div>
              )}
            </div>

            {/* Handover Verification Form / Action */}
            {!isCompleted ? (
              <div className="rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Confirm Physical Handover</h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter the 6-digit OTP code or scan token provided during the physical item transfer to lock in the recovery.
                </p>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyHandover} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Verification Code or Scanned Token
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HANDOVER-948123 or raw token"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {verifying ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Cryptographic Handover...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm & Complete Handover</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Tamper-Evident Digital Receipt */
              <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <FileCheck2 className="w-5 h-5" />
                    <span className="text-sm font-bold">Tamper-Evident Recovery Receipt</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    VERIFIED ON-CHAIN
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Receipt ID:</span>
                    <span className="text-slate-200 font-bold">{handover.digitalReceiptId || `RCP-${handover.id}-CGC-2026`}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Claim ID:</span>
                    <span className="text-slate-200">#{handover.claimId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Handover Code:</span>
                    <span className="text-indigo-400 font-bold">{handover.handoverCode}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Completed Timestamp:</span>
                    <span className="text-slate-200">
                      {handover.completedTime ? new Date(handover.completedTime).toLocaleString() : new Date().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-400 font-bold">RECOVERED & CLOSED</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>

                  <Link
                    to="/overview"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    <span>Return to Overview</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <p className="text-xs">No active handover pass selected.</p>
        </div>
      )}
    </div>
  );
};
