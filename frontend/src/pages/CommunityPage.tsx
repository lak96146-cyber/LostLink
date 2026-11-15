import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { LeaderboardEntry, UserAchievement, AnalyticsData } from '../types';
import {
  Award,
  Trophy,
  Medal,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  TrendingUp,
  Heart,
  Flame,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      const [leaderboardData, achievementsData, analyticsData] = await Promise.all([
        api.getLeaderboard(),
        api.getMyAchievements().catch(() => []),
        api.getPublicAnalytics().catch(() => null)
      ]);
      setLeaderboard(leaderboardData || []);
      setAchievements(achievementsData || []);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load community page data', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-lg shadow-amber-400/30">
          🥇
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-md">
          🥈
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
          🥉
        </span>
      );
    }
    return (
      <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-mono font-bold text-xs border border-white/10">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Community Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/80 border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-3">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Campus Good Samaritan Network</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hall of Helpers & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Every found item turned in, verified claim, and honest recovery earns Good Samaritan Points and unlocks verified campus trust badges.
          </p>

          {/* Quick Metrics */}
          {analytics && (
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Items Reunited</span>
                <span className="text-lg font-extrabold text-emerald-400">{analytics.recoveredItems}</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-slate-400 block text-[11px]">Recovery Rate</span>
                <span className="text-lg font-extrabold text-indigo-400">{analytics.recoveryRatePercentage?.toFixed(1)}%</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-slate-400 block text-[11px]">Campus Guardians</span>
                <span className="text-lg font-extrabold text-purple-400">{analytics.totalUsers}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Hall of Helpers Leaderboard (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Hall of Helpers</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">UPDATED HOURLY</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-white/5 text-center text-slate-400 text-xs">
              No points awarded yet. Be the first to report or recover an item!
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-900 border border-white/10 divide-y divide-white/5 overflow-hidden shadow-xl">
              {leaderboard.map((helper) => (
                <div
                  key={helper.userId}
                  className="p-4 flex items-center justify-between hover:bg-slate-850/60 transition"
                >
                  <div className="flex items-center gap-3.5">
                    {getRankBadge(helper.rank)}

                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center font-bold text-sm text-indigo-300">
                      {helper.avatarUrl ? (
                        <img src={helper.avatarUrl} alt={helper.fullName} className="w-full h-full object-cover" />
                      ) : (
                        helper.fullName.charAt(0)
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{helper.fullName}</h4>
                      <p className="text-[11px] text-slate-400">{helper.department || 'CGC Jhanjeri'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Trust Score */}
                    <div className="hidden sm:block text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-mono">Trust</span>
                      <span className="text-xs font-bold text-emerald-400">{helper.trustScore}%</span>
                    </div>

                    {/* Points Pill */}
                    <div className="px-3.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-right">
                      <span className="text-sm font-extrabold text-amber-300 font-mono">
                        {helper.points}
                      </span>
                      <span className="text-[10px] text-amber-400/70 block uppercase font-medium">PTS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: User Badges & Achievements (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Your Campus Badges</h2>
            </div>
            <span className="text-xs text-indigo-400 font-semibold">{achievements.length} Earned</span>
          </div>

          <div className="space-y-3">
            {achievements.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-white/5 text-center text-slate-400 text-xs space-y-2">
                <Sparkles className="w-6 h-6 text-indigo-400 mx-auto" />
                <p className="font-semibold text-slate-300">No Badges Yet</p>
                <p className="text-slate-500">
                  Register your belongings, report items, and verify handovers to earn recognition badges!
                </p>
              </div>
            ) : (
              achievements.map((ach) => (
                <div
                  key={ach.id}
                  className="rounded-2xl bg-slate-900 border border-white/10 p-4 flex items-start gap-3.5 hover:border-indigo-500/30 transition shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
                    {ach.icon || '🎖️'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(ach.earnedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{ach.description}</p>
                  </div>
                </div>
              ))
            )}

            {/* Locked Badges Preview */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                Available to Unlock
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 opacity-60 flex items-center gap-2">
                  <span className="text-base">🛡️</span>
                  <div>
                    <span className="font-semibold text-slate-300 block text-[11px]">Campus Guardian</span>
                    <span className="text-[10px] text-slate-500">5 handovers verified</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 opacity-60 flex items-center gap-2">
                  <span className="text-base">🔐</span>
                  <div>
                    <span className="font-semibold text-slate-300 block text-[11px]">Vault Master</span>
                    <span className="text-[10px] text-slate-500">10 belongings secured</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
