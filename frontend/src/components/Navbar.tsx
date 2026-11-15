import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { NotificationItem } from '../types';
import {
  Compass,
  Bell,
  Search,
  PlusCircle,
  ShieldCheck,
  User,
  LogOut,
  CheckCircle,
  Menu,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
      const countRes = await api.getUnreadCount();
      setUnreadCount(countRes.unreadCount);
    } catch (e) {
      // Ignore background fetch error
    }
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#142B38]/95 backdrop-blur-xl border-b border-[#EDE5D6]/15 px-4 lg:px-6 flex items-center justify-between">
      {/* Brand & Left Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#EDE5D6]/70 hover:text-[#F5F1E8] hover:bg-[#1C414B] transition lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#167D78] to-[#1C414B] border border-[#8FE0BE]/40 flex items-center justify-center shadow-md shadow-[#167D78]/20 group-hover:scale-105 transition">
            <Compass className="w-5 h-5 text-[#8FE0BE]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#F5F1E8] font-sans">
                LOST<span className="text-[#8FE0BE]">LINK</span>
              </span>
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${
                isAdmin
                  ? 'bg-[#E9B65A]/20 text-[#E9B65A] border-[#E9B65A]/40'
                  : 'bg-[#167D78]/25 text-[#8FE0BE] border-[#167D78]/40'
              }`}>
                {isAdmin ? 'GUARDIAN' : 'CGC CAMPUS'}
              </span>
            </div>
            <p className="text-[10px] text-[#EDE5D6]/70 -mt-1 hidden sm:block">Find It. Verify It. Recover It.</p>
          </div>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EDE5D6]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, locations, categories..."
            className="w-full bg-[#1C414B]/80 border border-[#EDE5D6]/15 rounded-xl pl-9 pr-4 py-1.5 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]/80 focus:ring-1 focus:ring-[#8FE0BE]/40 transition"
          />
        </form>
      </div>

      {/* Right Actions & User Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Report Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/report-lost"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F17F68]/20 border border-[#F17F68]/40 text-[#F17F68] hover:bg-[#F17F68] hover:text-[#142B38] transition text-xs font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </Link>
          <Link
            to="/report-found"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#167D78]/25 border border-[#167D78]/50 text-[#8FE0BE] hover:bg-[#167D78] hover:text-[#F5F1E8] transition text-xs font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </Link>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#EDE5D6]/70 hover:text-[#F5F1E8] hover:bg-[#1C414B] border border-transparent hover:border-[#EDE5D6]/15 transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#F17F68] text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/20 shadow-2xl p-4 z-50 text-[#F5F1E8] animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#EDE5D6]/15">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#EDE5D6]">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F17F68]/20 text-[#F17F68] font-semibold border border-[#F17F68]/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-[#8FE0BE] hover:underline transition"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto mt-2 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#EDE5D6]/60 text-center py-6">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs transition ${
                        n.isRead
                          ? 'bg-[#142B38]/60 border-[#EDE5D6]/10 text-[#EDE5D6]/60'
                          : 'bg-[#167D78]/20 border-[#167D78]/40 text-[#F5F1E8]'
                      }`}
                    >
                      <div className="font-semibold text-[#F5F1E8] mb-0.5">{n.title}</div>
                      <p className="text-[11px] text-[#EDE5D6]/80 leading-snug">{n.message}</p>
                      {n.targetLink && (
                        <Link
                          to={n.targetLink}
                          onClick={() => setShowNotifications(false)}
                          className="inline-flex items-center gap-1 text-[11px] text-[#8FE0BE] hover:underline font-medium mt-1.5"
                        >
                          <span>View record</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-[#1C414B] border border-[#EDE5D6]/15 hover:border-[#8FE0BE]/40 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-[#167D78] border border-[#8FE0BE]/50 flex items-center justify-center text-xs font-bold text-[#F5F1E8]">
                {user.fullName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[#F5F1E8] leading-tight">{user.fullName}</div>
                <div className="text-[10px] text-[#E9B65A] font-mono font-bold">{user.goodSamaritanPoints} pts</div>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/20 shadow-2xl p-2 z-50 text-[#F5F1E8] animate-in fade-in duration-150">
                <div className="px-3 py-2 border-b border-[#EDE5D6]/15">
                  <div className="text-xs font-bold text-[#F5F1E8]">{user.fullName}</div>
                  <div className="text-[11px] text-[#EDE5D6]/70 truncate">{user.email}</div>
                  <div className="mt-1 text-[10px] text-[#E9B65A] font-medium">{user.department || 'CGC Jhanjeri'}</div>
                </div>

                <div className="py-1">
                  <Link
                    to="/vault"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#EDE5D6] hover:text-[#F5F1E8] hover:bg-[#142B38] transition"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#8FE0BE]" />
                    <span>My Belongings Vault</span>
                  </Link>
                  <Link
                    to="/my-claims"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#EDE5D6] hover:text-[#F5F1E8] hover:bg-[#142B38] transition"
                  >
                    <CheckCircle className="w-4 h-4 text-[#8FE0BE]" />
                    <span>My Claims & Recovery</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#E9B65A] hover:bg-[#E9B65A]/15 transition font-semibold"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Guardian Admin Panel</span>
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-[#EDE5D6]/15">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#F17F68] hover:bg-[#F17F68]/15 transition font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded-xl bg-[#167D78] hover:bg-[#126863] text-[#F5F1E8] text-xs font-bold transition shadow-md shadow-[#167D78]/25"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
