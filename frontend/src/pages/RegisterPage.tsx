import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, Mail, Lock, Building, IdCard, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        ...formData,
        role: 'ROLE_STUDENT',
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#142B38] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="relative w-full max-w-lg">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#167D78] to-[#1C414B] border border-[#8FE0BE]/40 flex items-center justify-center shadow-lg shadow-[#167D78]/25 group-hover:scale-105 transition">
              <Compass className="w-6 h-6 text-[#8FE0BE]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#F5F1E8] font-sans">
              LOST<span className="text-[#8FE0BE]">LINK</span>
            </span>
          </Link>
          <p className="text-xs text-[#EDE5D6]/70">CGC Jhanjeri Student & Staff Registration</p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-[#1C414B] border border-[#EDE5D6]/20 shadow-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#F5F1E8] mb-1">Create your recovery account</h2>
          <p className="text-xs text-[#EDE5D6]/70 mb-6">Join the campus-wide honest return ecosystem</p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#F17F68]/20 border border-[#F17F68]/40 text-[#F17F68] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#EDE5D6] mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EDE5D6]/40" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-[#142B38] border border-[#EDE5D6]/20 rounded-xl pl-10 pr-4 py-2 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#EDE5D6] mb-1">Campus Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EDE5D6]/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@cgc.edu.in"
                    className="w-full bg-[#142B38] border border-[#EDE5D6]/20 rounded-xl pl-10 pr-3 py-2 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#EDE5D6] mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EDE5D6]/40" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full bg-[#142B38] border border-[#EDE5D6]/20 rounded-xl pl-10 pr-3 py-2 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#EDE5D6] mb-1">Student / Employee ID</label>
                <div className="relative">
                  <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EDE5D6]/40" />
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="e.g. 2104501"
                    className="w-full bg-[#142B38] border border-[#EDE5D6]/20 rounded-xl pl-10 pr-3 py-2 text-xs text-[#F5F1E8] placeholder-[#EDE5D6]/40 focus:outline-none focus:border-[#8FE0BE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#EDE5D6] mb-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-[#142B38] border border-[#EDE5D6]/20 rounded-xl px-3 py-2 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#8FE0BE]"
                >
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Mechanical Engineering">Mechanical</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Civil Engineering">Civil</option>
                  <option value="Management Studies">MBA / BBA</option>
                  <option value="Pharmacy">Pharmacy</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#167D78] hover:bg-[#126863] text-[#F5F1E8] text-xs font-bold transition shadow-lg shadow-[#167D78]/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#EDE5D6]/70">
            Already registered?{' '}
            <Link to="/login" className="text-[#8FE0BE] hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
