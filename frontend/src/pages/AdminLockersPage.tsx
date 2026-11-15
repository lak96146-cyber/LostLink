import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { LockerRecord, LockerStatus, ItemResponse } from '../types';
import {
  Box,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin
} from 'lucide-react';

export const AdminLockersPage: React.FC = () => {
  const [lockers, setLockers] = useState<LockerRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Assign modal state
  const [assigningLocker, setAssigningLocker] = useState<LockerRecord | null>(null);
  const [itemIdInput, setItemIdInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadLockers();
  }, []);

  const loadLockers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getLockers();
      setLockers(data || []);
    } catch (err: any) {
      console.error('Failed to load lockers', err);
      setError(err.message || 'Unable to retrieve smart locker records.');
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (lockerId: number) => {
    if (!window.confirm('Release this locker compartment and reset it to AVAILABLE?')) return;
    try {
      const updated = await api.releaseLocker(lockerId);
      setLockers(prev => prev.map(l => l.id === updated.id ? updated : l));
      setSuccessMessage(`Locker compartment released and available for intake.`);
    } catch (err: any) {
      console.error('Failed to release locker', err);
      setError(err.message || 'Failed to release locker.');
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningLocker || !itemIdInput.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const itemId = parseInt(itemIdInput, 10);
      const updated = await api.assignLocker(assigningLocker.id, itemId, notesInput);
      setLockers(prev => prev.map(l => l.id === updated.id ? updated : l));
      setSuccessMessage(`Compartment ${assigningLocker.lockerReference} assigned to Item #${itemId}.`);
      setAssigningLocker(null);
      setItemIdInput('');
      setNotesInput('');
    } catch (err: any) {
      console.error('Failed to assign item to locker', err);
      setError(err.message || 'Assignment failed. Check that item ID exists.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: LockerStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Unlock className="w-3.5 h-3.5" />
            Available
          </span>
        );
      case 'OCCUPIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Lock className="w-3.5 h-3.5" />
            Occupied
          </span>
        );
      case 'AWAITING_COLLECTION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Awaiting Collection
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-white/5">
            {status}
          </span>
        );
    }
  };

  const totalLockers = lockers.length;
  const availableLockers = lockers.filter(l => l.status === 'AVAILABLE').length;
  const occupiedLockers = lockers.filter(l => l.status === 'OCCUPIED' || l.status === 'AWAITING_COLLECTION').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              SMART LOST LOCKERS
            </span>
            <span className="text-xs text-slate-400">Automated Physical Storage</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Smart Locker Management</h1>
        </div>

        <button
          onClick={loadLockers}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Refresh Hardware Status</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Locker Capacity KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">Total Compartments</span>
          <span className="text-2xl font-extrabold text-white font-mono">{totalLockers}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Ground Floor Security Pod</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">Available Compartments</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">{availableLockers}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Ready for high-value intake</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-xs text-slate-400 block mb-1">Occupied / In Custody</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">{occupiedLockers}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Secure physical retention</span>
        </div>
      </div>

      {/* Compartment Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Querying locker hardware state...</p>
        </div>
      ) : lockers.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs">
          No locker compartments found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lockers.map((locker) => (
            <div
              key={locker.id}
              className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4 hover:border-indigo-500/30 transition shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-indigo-300">
                    <Box className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">{locker.lockerReference}</h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{locker.physicalLocation}</span>
                    </p>
                  </div>
                </div>

                <div>{getStatusBadge(locker.status)}</div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/40 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Assigned Item</span>
                  <span className="font-semibold text-slate-200">
                    {locker.itemId ? `Item #${locker.itemId}` : 'Vacant'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-mono">Intake Date</span>
                  <span className="text-slate-300">
                    {locker.intakeDate ? new Date(locker.intakeDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {locker.notes && (
                <p className="text-xs text-slate-400 italic bg-slate-950/20 p-2 rounded-lg">
                  "{locker.notes}"
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                {locker.status === 'AVAILABLE' ? (
                  <button
                    onClick={() => setAssigningLocker(locker)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Assign Found Item</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRelease(locker.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-semibold transition"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Release Compartment</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Item Modal */}
      {assigningLocker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                Assign to {assigningLocker.lockerReference}
              </h3>
              <button
                onClick={() => setAssigningLocker(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Found Item Database ID
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2"
                  value={itemIdInput}
                  onChange={(e) => setItemIdInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Intake Custody Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Stored in bottom locker. Physical tag #492 applied."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setAssigningLocker(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {submitting ? 'Locking...' : 'Lock In Compartment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
