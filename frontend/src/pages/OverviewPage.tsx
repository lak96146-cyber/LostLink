import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { ItemResponse, SmartMatch, AnalyticsData } from '../types';
import { ItemCard } from '../components/ItemCard';
import { ItemModal } from '../components/ItemModal';
import {
  Sparkles,
  Compass,
  PlusCircle,
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [recentItems, setRecentItems] = useState<ItemResponse[]>([]);
  const [topMatches, setTopMatches] = useState<SmartMatch[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const itemsRes = await api.getItems({ size: 6 });
      setRecentItems(itemsRes.content || []);

      const matchesRes = await api.getHighConfidenceMatches();
      setTopMatches(matchesRes || []);

      const analyticsRes = await api.getPublicAnalytics();
      setAnalytics(analyticsRes);
    } catch (e) {
      console.error('Error loading dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-[#1C414B] border border-[#EDE5D6]/20 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#167D78]/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#167D78]/30 text-[#8FE0BE] border border-[#167D78]/50 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8FE0BE] animate-pulse" />
              <span>CGC Jhanjeri Campus Live</span>
            </span>
            <span className="text-xs text-[#EDE5D6]/70">1.0 km Verified Perimeter</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F1E8] tracking-tight">
            Welcome, {user ? user.fullName.split(' ')[0] : 'Campus Explorer'}
          </h1>
          <p className="text-xs sm:text-sm text-[#EDE5D6]/80 mt-2 leading-relaxed">
            LostLink connects students and campus guardians with our intelligent matching engine, zero-knowledge Item DNA verification, and a geographically grounded 3D digital twin of CGC University.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/report-lost"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F17F68] hover:bg-[#F17F68]/90 text-[#142B38] text-xs font-bold transition shadow-lg shadow-[#F17F68]/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </Link>

            <Link
              to="/report-found"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#167D78] hover:bg-[#126863] text-[#F5F1E8] text-xs font-bold transition shadow-lg shadow-[#167D78]/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </Link>

            <Link
              to="/campusverse"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#142B38] hover:bg-[#142B38]/80 text-[#EDE5D6] border border-[#EDE5D6]/20 text-xs font-bold transition shadow-md"
            >
              <Compass className="w-4 h-4 text-[#8FE0BE]" />
              <span>Open CampusVerse 3D</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/15 shadow-md">
          <div className="flex items-center justify-between text-[#EDE5D6]/60 mb-2">
            <span className="text-xs font-semibold">Active Reports</span>
            <Layers className="w-4 h-4 text-[#8FE0BE]" />
          </div>
          <div className="text-2xl font-extrabold text-[#F5F1E8] font-mono">
            {analytics?.totalReports ?? 0}
          </div>
          <span className="text-[10px] text-[#EDE5D6]/60 block mt-1">
            {analytics?.lostReports ?? 0} Lost / {analytics?.foundReports ?? 0} Found
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/15 shadow-md">
          <div className="flex items-center justify-between text-[#EDE5D6]/60 mb-2">
            <span className="text-xs font-semibold">Items Reunited</span>
            <CheckCircle2 className="w-4 h-4 text-[#8FE0BE]" />
          </div>
          <div className="text-2xl font-extrabold text-[#8FE0BE] font-mono">
            {analytics?.recoveredItems ?? 0}
          </div>
          <span className="text-[10px] text-[#EDE5D6]/60 block mt-1">
            {analytics?.recoveryRatePercentage ? `${analytics.recoveryRatePercentage.toFixed(1)}% recovery rate` : 'Campus-wide recoveries'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/15 shadow-md">
          <div className="flex items-center justify-between text-[#EDE5D6]/60 mb-2">
            <span className="text-xs font-semibold">Smart Matches</span>
            <Sparkles className="w-4 h-4 text-[#E9B65A]" />
          </div>
          <div className="text-2xl font-extrabold text-[#E9B65A] font-mono">
            {analytics?.activeSmartMatches ?? 0}
          </div>
          <span className="text-[10px] text-[#EDE5D6]/60 block mt-1">7-factor algorithmic pairings</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/15 shadow-md">
          <div className="flex items-center justify-between text-[#EDE5D6]/60 mb-2">
            <span className="text-xs font-semibold">Campus Trust Score</span>
            <ShieldCheck className="w-4 h-4 text-[#8FE0BE]" />
          </div>
          <div className="text-2xl font-extrabold text-[#F5F1E8] font-mono">
            {user ? `${user.trustScore}%` : '98%'}
          </div>
          <span className="text-[10px] text-[#8FE0BE] font-bold block mt-1">
            {user?.goodSamaritanPoints ?? 0} Samaritan Points
          </span>
        </div>
      </div>

      {/* Top High-Confidence Matches Section */}
      {topMatches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E9B65A]" />
              <h2 className="text-base font-bold text-[#F5F1E8] tracking-tight">
                High-Confidence SmartMatches
              </h2>
            </div>
            <Link
              to="/smartmatch"
              className="text-xs text-[#8FE0BE] hover:underline font-bold flex items-center gap-1"
            >
              <span>View all matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topMatches.slice(0, 2).map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/15 hover:border-[#8FE0BE]/50 transition shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#EDE5D6]/60">MATCH #{m.id}</span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#167D78]/25 text-[#8FE0BE] border border-[#167D78]/40 text-xs font-bold">
                    <span>{m.overallScore.toFixed(0)}% MATCH</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-[#142B38] border border-[#EDE5D6]/10">
                    <span className="text-[10px] uppercase font-bold text-[#F17F68] block">Lost Item</span>
                    <span className="font-semibold text-[#F5F1E8] line-clamp-1">{m.lostItem.title}</span>
                    <span className="text-[10px] text-[#EDE5D6]/60 block">{m.lostItem.locationName}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#142B38] border border-[#EDE5D6]/10">
                    <span className="text-[10px] uppercase font-bold text-[#8FE0BE] block">Found Item</span>
                    <span className="font-semibold text-[#F5F1E8] line-clamp-1">{m.foundItem.title}</span>
                    <span className="text-[10px] text-[#EDE5D6]/60 block">{m.foundItem.locationName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EDE5D6]/10 text-xs">
                  <span className="text-[11px] text-[#EDE5D6]/70">{m.matchingAttributes?.[0] || 'High spatial similarity'}</span>
                  <Link
                    to="/smartmatch"
                    className="text-[#8FE0BE] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Campus Reports Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#8FE0BE]" />
            <h2 className="text-base font-bold text-[#F5F1E8] tracking-tight">Recent Campus Feed</h2>
          </div>
          <Link
            to="/discover"
            className="text-xs text-[#8FE0BE] hover:underline font-bold flex items-center gap-1"
          >
            <span>Explore full directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-[#EDE5D6]/60">
            <div className="w-8 h-8 border-2 border-[#8FE0BE] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs">Loading campus reports...</p>
          </div>
        ) : recentItems.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-[#1C414B] border border-[#EDE5D6]/15 text-[#EDE5D6]/60 text-xs">
            No campus recovery reports yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onViewDetails={(it) => setSelectedItem(it)}
              />
            ))}
          </div>
        )}
      </div>

      <ItemModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onClaimSuccess={loadDashboardData}
      />
    </div>
  );
};
