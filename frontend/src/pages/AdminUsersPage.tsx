import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { UserSummary } from '../types';
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle2,
  Filter,
  GraduationCap,
  Award
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminUsers();
      setUsers(data || []);
    } catch (err: any) {
      console.error('Failed to load users', err);
      setError(err.message || 'Unable to retrieve user directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user: UserSummary) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!window.confirm(`Set status of ${user.fullName} to ${nextStatus}?`)) return;

    try {
      const updated = await api.updateUserStatus(user.id, nextStatus);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      setActionSuccess(`Account for ${user.fullName} updated to ${nextStatus}.`);
    } catch (err: any) {
      console.error('Failed to update status', err);
      setError(err.message || 'Failed to update user status.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    const name = u.fullName?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    const dept = u.department?.toLowerCase() || '';
    const sid = u.studentId?.toLowerCase() || '';
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      dept.includes(searchQuery.toLowerCase()) ||
      sid.includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              CAMPUS COMMUNITY DIRECTORY
            </span>
            <span className="text-xs text-slate-400">Account Access & Trust Metrics</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User Directory & Trust Control</h1>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['ALL', 'ROLE_STUDENT', 'ROLE_ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                filterRole === r
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'ROLE_STUDENT' ? 'Students' : 'Guardians/Admins'}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading campus users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs">
          No users match the search query.
        </div>
      ) : (
        <div className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-white/5 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Student ID / Dept</th>
                  <th className="py-3.5 px-4">Trust Score</th>
                  <th className="py-3.5 px-4">Points</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-xs text-indigo-300 shrink-0">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.fullName} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            u.fullName.charAt(0)
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{u.fullName}</span>
                          <span className="text-[11px] text-slate-500">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        }`}
                      >
                        {u.role === 'ROLE_ADMIN' ? 'ADMIN / GUARDIAN' : 'STUDENT'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 font-mono block">{u.studentId || 'N/A'}</span>
                      <span className="text-[11px] text-slate-500">{u.department || 'CGC Jhanjeri'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-400 font-mono">{u.trustScore}%</span>
                        <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, u.trustScore)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                      {u.goodSamaritanPoints}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'ROLE_ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                            u.status === 'ACTIVE'
                              ? 'bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border-white/10 hover:border-rose-500/30'
                              : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span>Suspend</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
