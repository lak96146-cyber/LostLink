import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  FileSearch,
  Compass,
  Shield,
  FileCheck2,
  QrCode,
  Users,
  Award,
  ShieldAlert,
  Archive,
  BarChart3,
  ScrollText,
  UserCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin } = useAuth();

  const studentLinks = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/discover', label: 'Discover', icon: Search },
    { to: '/report-lost', label: 'Report Lost', icon: PlusCircle, badge: 'Urgent', badgeType: 'coral' },
    { to: '/report-found', label: 'Report Found', icon: PlusCircle },
    { to: '/smartmatch', label: 'SmartMatch', icon: FileSearch, badge: 'AI Match', badgeType: 'mint' },
    { to: '/campusverse', label: 'CampusVerse 3D', icon: Compass, highlight: true },
    { to: '/vault', label: 'Belongings Vault', icon: Shield },
    { to: '/my-claims', label: 'My Claims', icon: FileCheck2 },
    { to: '/recovery', label: 'SafeReturn QR', icon: QrCode },
    { to: '/community', label: 'Community & Rewards', icon: Award },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard },
    { to: '/admin/claims', label: 'Claims Verification', icon: FileCheck2 },
    { to: '/admin/lockers', label: 'Lost Lockers', icon: Archive },
    { to: '/admin/users', label: 'User Directory', icon: UserCheck },
    { to: '/admin/audit-logs', label: 'Security Audit Logs', icon: ScrollText },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#142B38] border-r border-[#EDE5D6]/15 p-4 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EDE5D6]">Navigation</span>
          <button onClick={onClose} className="p-1 rounded-lg text-[#EDE5D6]/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1">
          {/* Student Hub */}
          <div>
            <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#EDE5D6]/50 px-3 mb-2 font-mono">
              Campus Recovery
            </div>
            <nav className="space-y-1">
              {studentLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => onClose()}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-[#167D78] text-[#F5F1E8] shadow-md shadow-[#167D78]/25'
                          : item.highlight
                          ? 'text-[#8FE0BE] hover:bg-[#1C414B] hover:text-[#F5F1E8]'
                          : 'text-[#EDE5D6]/80 hover:bg-[#1C414B] hover:text-[#F5F1E8]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        item.badgeType === 'coral'
                          ? 'bg-[#F17F68]/20 text-[#F17F68] border-[#F17F68]/30'
                          : 'bg-[#8FE0BE]/20 text-[#8FE0BE] border-[#8FE0BE]/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Admin Guardian Section */}
          {isAdmin && (
            <div>
              <div className="text-[10px] font-extrabold tracking-wider uppercase text-[#E9B65A] px-3 mb-2 flex items-center gap-1.5 font-mono">
                <ShieldAlert className="w-3.5 h-3.5 text-[#E9B65A]" />
                <span>Guardian Operations</span>
              </div>
              <nav className="space-y-1">
                {adminLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => onClose()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          isActive
                            ? 'bg-[#E9B65A] text-[#142B38] font-bold shadow-md shadow-[#E9B65A]/25'
                            : 'text-[#EDE5D6]/80 hover:bg-[#1C414B] hover:text-[#F5F1E8]'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Footer Info: Verified Campus Badge */}
        <div className="mt-auto pt-4 border-t border-[#EDE5D6]/15">
          <div className="p-3 rounded-2xl bg-[#1C414B] border border-[#EDE5D6]/15 text-[11px] text-[#EDE5D6]">
            <div className="flex items-center gap-1.5 font-bold text-[#F5F1E8]">
              <span className="w-2 h-2 rounded-full bg-[#8FE0BE] animate-pulse" />
              <span>CGC Jhanjeri Campus</span>
            </div>
            <p className="text-[10px] text-[#EDE5D6]/70 mt-1 leading-snug">
              1.0 km verified perimeter. Zero-knowledge Item DNA verification.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
