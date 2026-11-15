import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { CampusBuilding, UrgencyLevel } from '../types';
import {
  PlusCircle,
  Award,
  Archive,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const ReportFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<CampusBuilding[]>([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState('');
  const [buildingId, setBuildingId] = useState<number | undefined>(undefined);
  const [campusZone, setCampusZone] = useState('Zone A - Academic Core');
  const [urgency, setUrgency] = useState<UrgencyLevel>('MEDIUM');
  const [imageUrl, setImageUrl] = useState('');
  const [depositInLocker, setDepositInLocker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getCampusBuildings().then(setBuildings).catch(() => {});
  }, []);

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
        type: 'FOUND',
        category,
        description,
        brand,
        color,
        dateLostOrFound: dateFound,
        locationName: locationName || 'CGC Campus',
        buildingId,
        campusZone,
        urgency,
        imageUrl,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/smartmatch');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit found report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Found Item Report
          </span>
          <span className="text-xs text-slate-400">Earn +25 Good Samaritan Points</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Report a Found Belonging</h1>
        <p className="text-xs text-slate-400 mt-1">
          Help reunite an item with its owner at CGC Jhanjeri. Your submission is instantly matched with active lost reports.
        </p>
      </div>

      {/* Samaritan Reward Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">Good Samaritan Contribution</div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Filing this report grants you +25 community points and increments your verified campus trust score!
            </p>
          </div>
        </div>
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
            <div className="font-bold">Found report submitted (+25 Samaritan points awarded)!</div>
            <p className="text-[11px] text-emerald-300 mt-0.5">Redirecting to SmartMatch to check potential lost owners...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">1. Item Details</h3>

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
                placeholder="e.g. Space Grey MacBook in Navy Protective Sleeve"
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
                <option value="ID cards">ID cards</option>
                <option value="Wallets">Wallets</option>
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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brand (If Apparent)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Dell, Casio..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Silver, Black, Navy..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Date Found</label>
              <input
                type="date"
                value={dateFound}
                onChange={(e) => setDateFound(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Do Not Expose Private Secrets)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe general appearance and where you spotted it..."
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Tip: Keep secret identifying details (like exact serial numbers or secret engravings) private so the claimant can verify them!
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Campus Location & Smart Locker Intake */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Found Location & Storage</h3>

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
              <label className="block text-xs font-semibold text-slate-300 mb-1">Exact Place Found *</label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Block 2 - Computer Science & Engineering (Ground Floor)"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Photo of Found Item</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
              />
            </div>

            {/* Smart Lost Locker Checkbox */}
            <div className="sm:col-span-2 pt-2 border-t border-white/5">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 cursor-pointer hover:border-indigo-500/30 transition">
                <input
                  type="checkbox"
                  checked={depositInLocker}
                  onChange={(e) => setDepositInLocker(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-white/20"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Archive className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Handing over to Block 1 Security Desk / Smart Lost Locker</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Check this if you plan to deposit the item with campus guardians at the Central Security Vault (Block 1 Ground Floor).
                  </p>
                </div>
              </label>
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
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Submitting...' : 'Report Found Item & Claim +25 Pts'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
