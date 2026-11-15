import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  ShieldAlert,
  Download,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  FileText
} from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);

  useEffect(() => {
    loadLogs(currentPage);
  }, [currentPage]);

  const loadLogs = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAuditLogs(page, 20);
      setLogs(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err: any) {
      console.error('Failed to load audit logs', err);
      setError(err.message || 'Unable to retrieve audit ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
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
      setExporting(false);
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('LOGIN')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">{action}</span>;
    }
    if (action.includes('CLAIM') || action.includes('SAFE_RETURN')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{action}</span>;
    }
    if (action.includes('DELETE') || action.includes('SUSPEND')) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">{action}</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{action}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              TAMPER-EVIDENT LEDGER
            </span>
            <span className="text-xs text-slate-400">{totalElements} Cryptographically Signed Entries</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Audit Trail</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadLogs(currentPage)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 transition"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCsv}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5 text-rose-400" />
            <span>{exporting ? 'Exporting...' : 'Export Audit CSV'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Reading security audit records...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs">
          No audit records found.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 border-b border-white/5 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Log ID</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Action</th>
                    <th className="py-3.5 px-4">User ID</th>
                    <th className="py-3.5 px-4">IP Address</th>
                    <th className="py-3.5 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 text-slate-500 font-bold">
                        #{log.id}
                      </td>

                      <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>

                      <td className="py-3 px-4">
                        {getActionBadge(log.action)}
                      </td>

                      <td className="py-3 px-4 text-indigo-300">
                        {log.userId ? `User #${log.userId}` : 'SYSTEM'}
                      </td>

                      <td className="py-3 px-4 text-slate-400">
                        {log.ipAddress || '127.0.0.1'}
                      </td>

                      <td className="py-3 px-4 text-slate-300 font-sans max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span>
              Page {currentPage + 1} of {totalPages} ({totalElements} total events)
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(p => p + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 disabled:opacity-40 transition"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
