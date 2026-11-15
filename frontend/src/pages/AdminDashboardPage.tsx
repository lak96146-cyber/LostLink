import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { AnalyticsData } from '../types';
import {
  ShieldAlert,
  Users,
  FileCheck2,
  Box,
  TrendingUp,
  Clock,
  Sparkles,
  Download,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [exportingItems, setExportingItems] = useState<boolean>(false);
  const [exportingAudit, setExportingAudit] = useState<boolean>(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error('Failed to load admin analytics', e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportItems = async () => {
    setExportingItems(true);
    try {
      const token = localStorage.getItem('lostlink_token');
      const response = await fetch('/api/export/items.csv', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lostlink_items_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Items export failed', e);
    } finally {
      setExportingItems(false);
    }
  };

  const handleExportAudit = async () => {
    setExportingAudit(true);
    try {
      const token = localStorage.getItem('lostlink_token');
      const response = await fetch('/api/export/audit-logs.csv', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lostlink_audit_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Audit export failed', e);
    } finally {
      setExportingAudit(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Guardian Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              CAMPUS GUARDIAN HQ
            </span>
            <span className="text-xs text-slate-400">Security & Custody Oversight</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Guardian Command Center</h1>
        </div>

        {/* Action buttons: Export CSV */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportItems}
            disabled={exportingItems}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{exportingItems ? 'Exporting...' : 'Export Items CSV'}</span>
          </button>

          <button
            onClick={handleExportAudit}
            disabled={exportingAudit}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>{exportingAudit ? 'Exporting...' : 'Export Audit Logs'}</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Claims</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-extrabold text-amber-300 font-mono">
            {analytics?.pendingClaims ?? 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Requires review</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Items Reunited</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-extrabold text-emerald-300 font-mono">
            {analytics?.recoveredItems ?? 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            {analytics?.recoveryRatePercentage ? `${analytics.recoveryRatePercentage.toFixed(1)}% recovery` : '0%'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Reports</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl font-extrabold text-white font-mono">
            {analytics?.totalReports ?? 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">
            {analytics?.lostReports ?? 0} Lost / {analytics?.foundReports ?? 0} Found
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Smart Matches</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl font-extrabold text-purple-300 font-mono">
            {analytics?.activeSmartMatches ?? 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Algorithm pairings</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Vault Items</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl font-extrabold text-blue-300 font-mono">
            {analytics?.totalBelongingsSecured ?? 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Pre-registered DNA</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Users Registered</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-extrabold text-white font-mono">
            {analytics?.totalUsers ?? 0}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Campus accounts</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          to="/admin/claims"
          className="group p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-indigo-500/50 transition shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
              Review Claims
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify claimant Item DNA secrets, distinctive markings, and approve handovers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-indigo-400 font-semibold">
            <span>Manage Claims</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/admin/lockers"
          className="group p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-emerald-500/50 transition shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
              Smart Lost Lockers
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Monitor physical compartment custody (LCK-B1-01 to 04) and assign recovered items.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Locker Compartments</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="group p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-purple-500/50 transition shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
              User Directory
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Inspect user trust scores, Good Samaritan points, and adjust account access status.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 font-semibold">
            <span>View All Users</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="group p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-rose-500/50 transition shadow-lg flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition">
              Security Audit Trail
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Tamper-evident system audit log of all logins, claim decisions, and handovers.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>Audit Ledger</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>

      {/* Hotspots and Category Distribution */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Campus Hotspots */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Campus Incident Hotspots</span>
            </h3>
            <div className="space-y-2.5">
              {analytics.hotspots && analytics.hotspots.length > 0 ? (
                analytics.hotspots.map((spot, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-200 block">{spot.locationName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {spot.latitude?.toFixed(4)}, {spot.longitude?.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {spot.reportCount} reports
                      </span>
                      <span className="text-[10px] font-bold uppercase text-rose-400">
                        {spot.intensity}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No high density incident hotspots reported.</p>
              )}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Reported Category Distribution</span>
            </h3>
            <div className="space-y-3">
              {analytics.categoryDistribution &&
                Object.entries(analytics.categoryDistribution).map(([category, count]) => {
                  const total = analytics.totalReports || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium">{category}</span>
                        <span className="text-slate-400 font-mono">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          style={{ width: `${Math.max(5, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
