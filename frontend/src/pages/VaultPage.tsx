import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Belonging, CampusBuilding } from '../types';
import {
  Shield,
  PlusCircle,
  Trash2,
  AlertTriangle,
  Lock,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react';

export const VaultPage: React.FC = () => {
  const [belongings, setBelongings] = useState<Belonging[]>([]);
  const [buildings, setBuildings] = useState<CampusBuilding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Belonging Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [distinctiveMarks, setDistinctiveMarks] = useState('');
  const [estimatedValue, setEstimatedValue] = useState<number | ''>('');
  const [imageUrl, setImageUrl] = useState('');

  // 1-Click Report Lost Dialog
  const [reportingBelonging, setReportingBelonging] = useState<Belonging | null>(null);
  const [reportLocation, setReportLocation] = useState('');
  const [reportBuildingId, setReportBuildingId] = useState<number | undefined>(undefined);
  const [reporting, setReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadBelongings();
    api.getCampusBuildings().then(setBuildings).catch(() => {});
  }, []);

  const loadBelongings = async () => {
    setLoading(true);
    try {
      const data = await api.getBelongings();
      setBelongings(data);
    } catch (e) {
      console.error('Failed to load belongings', e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBelonging = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addBelonging({
        name,
        category,
        brand,
        color,
        serialNumber,
        distinctiveMarks,
        estimatedValue: estimatedValue ? Number(estimatedValue) : undefined,
        imageUrl,
      });

      setShowAddModal(false);
      resetForm();
      loadBelongings();
    } catch (e) {
      alert('Failed to add belonging to vault.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to remove this item from your private vault?')) return;
    try {
      await api.deleteBelonging(id);
      loadBelongings();
    } catch (e) {
      alert('Failed to delete item.');
    }
  };

  const handle1ClickReportLost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingBelonging) return;
    setReporting(true);
    try {
      await api.reportBelongingAsLost(reportingBelonging.id, reportLocation, reportBuildingId);
      setReportSuccess(`'${reportingBelonging.name}' has been published as a lost item with encrypted Item DNA!`);
      setTimeout(() => {
        setReportingBelonging(null);
        setReportSuccess(null);
      }, 2000);
    } catch (e) {
      alert('Failed to create lost report from belonging.');
    } finally {
      setReporting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Electronics');
    setBrand('');
    setColor('');
    setSerialNumber('');
    setDistinctiveMarks('');
    setEstimatedValue('');
    setImageUrl('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Lock className="w-3 h-3 text-indigo-400" />
              <span>Zero-Disclosure Private Vault</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Belongings Vault</h1>
          <p className="text-xs text-slate-400 mt-1">
            Pre-register serial numbers and unique traits for your campus gadgets. If misplaced, file a verified lost report in 1-click!
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Belonging to Vault</span>
        </button>
      </div>

      {/* Belongings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-3xl bg-slate-900/50 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : belongings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-white/10 text-slate-400">
          <Shield className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-white">Your Belongings Vault is empty</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Safeguard your laptop, student ID, headphones, or calculator now. If you ever lose them on campus, you can report them instantly with pre-verified Item DNA!
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
          >
            Add Your First Belonging
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {belongings.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl bg-slate-900/90 border border-white/10 p-5 shadow-xl flex flex-col justify-between hover:border-indigo-500/30 transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-indigo-300 border border-white/5">
                    {b.category}
                  </span>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Remove from vault"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {b.imageUrl ? (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-white/5 mb-3 bg-slate-950">
                    <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-24 rounded-xl bg-slate-950/60 border border-white/5 mb-3 flex items-center justify-center text-slate-600">
                    <Shield className="w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition" />
                  </div>
                )}

                <h3 className="font-bold text-sm text-white">{b.name}</h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-400 pt-2 border-t border-white/5">
                  {b.brand && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Brand</span>
                      <span className="text-slate-300 font-medium">{b.brand}</span>
                    </div>
                  )}
                  {b.color && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Color</span>
                      <span className="text-slate-300 font-medium">{b.color}</span>
                    </div>
                  )}
                  {b.serialNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Serial Hash</span>
                      <span className="font-mono text-[11px] text-indigo-400">Encrypted</span>
                    </div>
                  )}
                  {b.distinctiveMarks && (
                    <div className="pt-1">
                      <span className="text-slate-500 block text-[10px] uppercase">Distinctive Marks</span>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{b.distinctiveMarks}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 1-Click Convert to Lost Report */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => setReportingBelonging(b)}
                  className="w-full py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Misplaced on Campus? 1-Click Report Lost</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Belonging Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span>Add Item to Private Belongings Vault</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBelonging} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="ID cards">ID cards</option>
                    <option value="Wallets">Wallets</option>
                    <option value="Documents">Important Documents</option>
                    <option value="Bags">Bags / Backpacks</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Keys">Keys</option>
                    <option value="Jewellery">Jewellery & Watches</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Sony, Apple, Fossil"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Silver, Matte Black"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Serial Number (Encrypted)</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="e.g. S01-998841"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Distinctive Marks / Scratches</label>
                <textarea
                  rows={2}
                  value={distinctiveMarks}
                  onChange={(e) => setDistinctiveMarks(e.target.value)}
                  placeholder="e.g. Small scratch on left headband, neon green sticker..."
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Item Photograph</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Belonging to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-Click Report Lost Dialog */}
      {reportingBelonging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl text-white">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Report '{reportingBelonging.name}' as Lost</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Where did you last have this belonging on the CGC campus?
            </p>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{reportSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handle1ClickReportLost} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Campus Building</label>
                  <select
                    value={reportBuildingId || ''}
                    onChange={(e) => setReportBuildingId(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Campus Building...</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Location Details *</label>
                  <input
                    type="text"
                    required
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    placeholder="e.g. Block 2 - Computer Science & Engineering (Lab 3)"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setReportingBelonging(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reporting}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30"
                  >
                    {reporting ? 'Publishing Report...' : 'Publish Lost Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
