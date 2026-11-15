import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, ShieldCheck, UserCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#142B38] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient subtle elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#167D78]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#167D78] to-[#1C414B] border border-[#8FE0BE]/40 flex items-center justify-center shadow-xl shadow-[#167D78]/25 group-hover:scale-105 transition">
              <Compass className="w-7 h-7 text-[#8FE0BE]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#F5F1E8] font-sans">
              LOST<span className="text-[#8FE0BE]">LINK</span>
            </span>
          </Link>
          <p className="text-xs text-[#EDE5D6]/70">Find It. Verify It. Recover It.</p>
          <p className="text-[11px] text-[#8FE0BE] font-bold mt-1">CGC University Jhanjeri Campus Portal</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-[#1C414B] border border-[#EDE5D6]/20 shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#F5F1E8] mb-1">Sign in to your account</h2>
          <p className="text-xs text-[#EDE5D6]/70 mb-6">Enter your campus email and password</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#F17F68]/20 border border-[#F17F68]/40 text-[#F17F68] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#EDE5D6] mb-1.5">Campus Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EDE5D6]/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@cgc.edu.in"
                  className="w-full bg-[#142B38] border border-[#EDE5D6]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#EDE5D6] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EDE5D6]/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#142B38] border border-[#EDE5D6]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#167D78] hover:bg-[#126863] text-[#F5F1E8] text-xs font-bold transition shadow-lg shadow-[#167D78]/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Campus Server...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[#EDE5D6]/15">
            <span className="text-[11px] font-bold text-[#E9B65A] block uppercase font-mono mb-2.5">
              Quick 1-Click Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemoAccount('aarav.sharma@cgc.edu.in', 'Student@123')}
                className="p-2.5 rounded-xl bg-[#142B38] border border-[#EDE5D6]/15 hover:border-[#8FE0BE]/50 text-left transition"
              >
                <span className="block font-bold text-[#8FE0BE]">Aarav (Student)</span>
                <span className="text-[10px] text-[#EDE5D6]/60">MacBook Reporter</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('diya.patel@cgc.edu.in', 'Student@123')}
                className="p-2.5 rounded-xl bg-[#142B38] border border-[#EDE5D6]/15 hover:border-[#8FE0BE]/50 text-left transition"
              >
                <span className="block font-bold text-[#8FE0BE]">Diya (Student)</span>
                <span className="text-[10px] text-[#EDE5D6]/60">Finder & Vault</span>
              </button>

              <button
                type="button"
                onClick={() => fillDemoAccount('admin@cgc.edu.in', 'Admin@123')}
                className="col-span-2 p-2.5 rounded-xl bg-[#142B38] border border-[#E9B65A]/40 hover:border-[#E9B65A] text-left transition flex items-center justify-between"
              >
                <div>
                  <span className="block font-bold text-[#E9B65A]">Guardian Security Admin</span>
                  <span className="text-[10px] text-[#EDE5D6]/70">Admin HQ • Claims & Lockers</span>
                </div>
                <Sparkles className="w-4 h-4 text-[#E9B65A]" />
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-[#EDE5D6]/70">
            Don't have a campus account?{' '}
            <Link to="/register" className="text-[#8FE0BE] hover:underline font-bold">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
