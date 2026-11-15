import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { CampusBuilding, UrgencyLevel } from '../types';
import {
  PlusCircle,
  ShieldCheck,
  Lock,
  MapPin,
  Calendar,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ReportLostPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<CampusBuilding[]>([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [dateLost, setDateLost] = useState(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState('');
  const [buildingId, setBuildingId] = useState<number | undefined>(undefined);
  const [campusZone, setCampusZone] = useState('Zone A - Academic Core');
  const [urgency, setUrgency] = useState<UrgencyLevel>('MEDIUM');
  const [isCritical, setIsCritical] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // Item DNA Private Details
  const [distinctiveMarks, setDistinctiveMarks] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [secretNotes, setSecretNotes] = useState('');
  const [privatePhotoUrl, setPrivatePhotoUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getCampusBuildings().then(setBuildings).catch(() => {});
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isPrivate: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isPrivate) {
          setPrivatePhotoUrl(reader.result as string);
        } else {
          setImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBuildingChange = (bId: string) => {
    if (!bId) {
      setBuildingId(undefined);
      return;
    }
    const idNum = parseInt(bId, 10);
    setBuildingId(idNum);
    const b = buildings.find(item => item.id === idNum);
    if (b) {
      setLocationName(b.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.createItem({
        title,
        type: 'LOST',
        category,
        description,
        brand,
        color,
        dateLostOrFound: dateLost,
        locationName: locationName || 'CGC Campus',
        buildingId,
        campusZone,
        urgency,
        isCritical,
        imageUrl,
        distinctiveMarks,
        serialNumber,
        secretNotes,
        privatePhotoUrl,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/smartmatch');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
            Lost Report
          </span>
          <span className="text-xs text-slate-400">Step 1 of 2: Listing & Ownership Proof</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Report a Lost Belonging</h1>
        <p className="text-xs text-slate-400 mt-1">
          Provide accurate details to activate the SmartMatch engine and protect ownership with encrypted Item DNA.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <div className="font-bold">Report successfully filed!</div>
            <p className="text-[11px] text-emerald-300 mt-0.5">Redirecting to SmartMatch to check existing found candidates...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Item Basic Specifications */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Item Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Item Title / Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apple MacBook Air M2 13-inch (Space Grey)"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="ID cards">ID cards (Critical)</option>
                <option value="Wallets">Wallets (Critical)</option>
                <option value="Documents">Important Documents</option>
                <option value="Bags">Bags / Backpacks</option>
                <option value="Books">Books & Notebooks</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories & Eyewear</option>
                <option value="Keys">Keys</option>
                <option value="Jewellery">Jewellery & Watches</option>
                <option value="Bottles">Bottles</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand (If Any)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Dell, Titan, Casio..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Space Grey, Midnight Blue, Silver..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date Lost</label>
              <input
                type="date"
                value={dateLost}
                onChange={(e) => setDateLost(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible aspects: protective case, scratches, contents..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location & Campus Building Selection */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Campus Location</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Building</label>
              <select
                value={buildingId || ''}
                onChange={(e) => handleBuildingChange(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select a Campus Building...</option>
                {buildings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Specific Location Description *</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Block 2 - Computer Science & Engineering (Lab 3)"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Zone</label>
              <select
                value={campusZone}
                onChange={(e) => setCampusZone(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Zone A - Academic Core">Zone A - Academic Core (Blocks 1, 2, 3)</option>
                <option value="Zone B - Hostels & Residences">Zone B - Hostels & Residences</option>
                <option value="Zone C - Sports & Food Court">Zone C - Sports & Food Court</option>
                <option value="Zone D - Entrance & Parking">Zone D - Entrance & Parking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Urgency Level</label>
              <select
                value={urgency}
                onChange={(e) => {
                  setUrgency(e.target.value as UrgencyLevel);
                  setIsCritical(e.target.value === 'CRITICAL');
                }}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="LOW">Low (Casual item)</option>
                <option value="MEDIUM">Medium (Standard Belonging)</option>
                <option value="HIGH">High (Important item)</option>
                <option value="CRITICAL">Critical (Laptop, Student ID, Wallet, Passport)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Public Item Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, false)}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Item DNA Private Ownership Verification */}
        <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              3. Item DNA — Private Ownership Verification
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Register secret identifying details below. These are cryptographically hashed and concealed from all users. When another student finds a matching item, these secrets will verify your genuine ownership without leaking answers!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Serial Number / IMEI (Encrypted SHA-256)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. C02G9988MD6T"
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Only a masked hint (e.g. C02G***) will be recorded.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Distinctive Secret Marks / Stickers
              </label>
              <input
                type="text"
                value={distinctiveMarks}
                onChange={(e) => setDistinctiveMarks(e.target.value)}
                placeholder="e.g. Cyberpunk sticker on lid, hairline scratch above port"
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Private Verification Notes (Zero Disclosure)
              </label>
              <textarea
                rows={2}
                value={secretNotes}
                onChange={(e) => setSecretNotes(e.target.value)}
                placeholder="e.g. Unique files on desktop, specific keychain attachment, student lock code..."
                className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Private Proof Image (Receipt / Serial sticker photo)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/30 file:text-indigo-200 hover:file:bg-indigo-600/50"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Registering Report...' : 'Publish Lost Report & Activate SmartMatch'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
