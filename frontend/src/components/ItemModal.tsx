import React, { useState } from 'react';
import { ItemResponse } from '../types';
import { api } from '../api';
import {
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  User,
  Tag,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ItemModalProps {
  item: ItemResponse | null;
  onClose: () => void;
  onClaimSuccess?: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ item, onClose, onClaimSuccess }) => {
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimDesc, setClaimDesc] = useState<string>('');
  const [serialAttempt, setSerialAttempt] = useState<string>('');
  const [distinctiveAttempt, setDistinctiveAttempt] = useState<string>('');
  const [proofImage, setProofImage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);

  if (!item) return null;

  const isLost = item.type === 'LOST';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.submitClaim({
        foundItemId: item.id,
        claimDescription: claimDesc,
        serialNumberAttempt: serialAttempt,
        distinctiveMarksAttempt: distinctiveAttempt,
        claimantProofImage: proofImage,
      });

      setClaimSuccessMsg('Ownership claim successfully submitted! Your claim has been routed to campus guardians for verification.');
      if (onClaimSuccess) onClaimSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#1C414B] border border-[#EDE5D6]/20 shadow-2xl p-6 text-[#F5F1E8] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#EDE5D6]/15">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-xl text-xs font-bold tracking-wider uppercase border ${
                isLost
                  ? 'bg-[#F17F68]/20 text-[#F17F68] border-[#F17F68]/35'
                  : 'bg-[#167D78]/25 text-[#8FE0BE] border-[#167D78]/45'
              }`}
            >
              {item.type} REPORT
            </span>
            {item.hasPrivateDna && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-[#8FE0BE]/15 text-[#8FE0BE] border border-[#8FE0BE]/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Item DNA Protected</span>
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#EDE5D6]/70 hover:text-white hover:bg-[#142B38] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-5">
          {/* Main Title & Details */}
          <div>
            <h2 className="text-xl font-bold text-[#F5F1E8]">{item.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#EDE5D6]/80 mt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#8FE0BE]" />
                <span>{item.locationName}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E9B65A]" />
                <span>{item.dateLostOrFound || 'Reported recently'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#8FE0BE]" />
                <span>{item.category}</span>
              </span>
            </div>
          </div>

          {/* Photograph if available */}
          {item.imageUrl && (
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-[#EDE5D6]/15 bg-[#142B38]">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#EDE5D6]/60 mb-1.5 font-mono">Description</h4>
            <p className="text-xs text-[#F5F1E8] leading-relaxed bg-[#142B38]/80 p-3.5 rounded-xl border border-[#EDE5D6]/10">
              {item.description || 'No detailed description supplied for this item.'}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#142B38] border border-[#EDE5D6]/10">
              <span className="text-[#EDE5D6]/50 block text-[10px] uppercase font-mono">Brand</span>
              <span className="font-semibold text-[#F5F1E8]">{item.brand || 'Unspecified'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#142B38] border border-[#EDE5D6]/10">
              <span className="text-[#EDE5D6]/50 block text-[10px] uppercase font-mono">Color</span>
              <span className="font-semibold text-[#F5F1E8]">{item.color || 'Unspecified'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#142B38] border border-[#EDE5D6]/10">
              <span className="text-[#EDE5D6]/50 block text-[10px] uppercase font-mono">Campus Zone</span>
              <span className="font-semibold text-[#F5F1E8]">{item.campusZone || 'CGC Core'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#142B38] border border-[#EDE5D6]/10">
              <span className="text-[#EDE5D6]/50 block text-[10px] uppercase font-mono">Status</span>
              <span className="font-semibold text-[#8FE0BE]">{item.status}</span>
            </div>
          </div>

          {/* Item DNA Verification Notice */}
          <div className="p-3.5 rounded-2xl bg-[#142B38] border border-[#167D78]/40 text-xs text-[#EDE5D6] flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#8FE0BE] flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#8FE0BE]">Item DNA Zero-Knowledge Verification</div>
              <p className="text-[11px] text-[#EDE5D6]/80 mt-1 leading-relaxed">
                Private ownership secrets (serial number hash, secret markings, personal notes) are safely encrypted and concealed from public view. Claimants must provide verifiable matching answers to substantiate ownership.
              </p>
            </div>
          </div>

          {/* Claim Section for Found Items */}
          {!isLost && item.status === 'REPORTED' && (
            <div className="pt-4 border-t border-[#EDE5D6]/15">
              {claimSuccessMsg ? (
                <div className="p-4 rounded-2xl bg-[#167D78]/25 border border-[#8FE0BE]/50 text-[#8FE0BE] text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#8FE0BE] flex-shrink-0" />
                  <span>{claimSuccessMsg}</span>
                </div>
              ) : isClaiming ? (
                <form onSubmit={handleSubmitClaim} className="space-y-3.5 bg-[#142B38] p-4 rounded-2xl border border-[#EDE5D6]/15">
                  <h4 className="text-sm font-bold text-[#F5F1E8] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8FE0BE]" />
                    <span>Submit Ownership Verification</span>
                  </h4>

                  {error && (
                    <div className="p-2.5 rounded-xl bg-[#F17F68]/20 border border-[#F17F68]/40 text-[#F17F68] text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-[#EDE5D6] mb-1">
                      Explain Why This Item Belongs to You
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={claimDesc}
                      onChange={(e) => setClaimDesc(e.target.value)}
                      placeholder="e.g. Lost my laptop yesterday after CS lab, sleeve has navy color..."
                      className="w-full bg-[#1C414B] border border-[#EDE5D6]/15 rounded-xl p-2.5 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#EDE5D6] mb-1">
                        Serial Number (If Known)
                      </label>
                      <input
                        type="text"
                        value={serialAttempt}
                        onChange={(e) => setSerialAttempt(e.target.value)}
                        placeholder="e.g. SN-C02G..."
                        className="w-full bg-[#1C414B] border border-[#EDE5D6]/15 rounded-xl p-2.5 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#EDE5D6] mb-1">
                        Distinctive Secret Marks / Stickers
                      </label>
                      <input
                        type="text"
                        value={distinctiveAttempt}
                        onChange={(e) => setDistinctiveAttempt(e.target.value)}
                        placeholder="e.g. Scratched corner, sticker details..."
                        className="w-full bg-[#1C414B] border border-[#EDE5D6]/15 rounded-xl p-2.5 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#EDE5D6] mb-1">
                      Proof of Ownership Photo (Receipt / Old Photo)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-[#EDE5D6]/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#167D78] file:text-[#F5F1E8] hover:file:bg-[#126863]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsClaiming(false)}
                      className="px-3 py-1.5 rounded-xl bg-[#1C414B] text-xs text-[#EDE5D6] hover:bg-[#1C414B]/80 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-1.5 rounded-xl bg-[#167D78] hover:bg-[#126863] text-xs font-bold text-[#F5F1E8] transition shadow-md shadow-[#167D78]/25 disabled:opacity-50"
                    >
                      {submitting ? 'Verifying DNA...' : 'Submit Claim for Review'}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsClaiming(true)}
                  className="w-full py-2.5 rounded-xl bg-[#167D78] hover:bg-[#126863] text-xs font-bold text-[#F5F1E8] transition shadow-lg shadow-[#167D78]/30 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#8FE0BE]" />
                  <span>I Am The Owner — Claim This Item</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
