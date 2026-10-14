import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', { fullName, email, password });
      const { user, token } = response.data;
      setAuth(user, token);
      toast.success('Account created! Welcome to SSPMS.');
      navigate('/student');
    } catch (error: any) {
      const msg = error.response?.data?.error?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden p-8 sm:p-12">
      <div className="flex flex-col items-start w-full mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md bg-blue-600 flex items-center justify-center">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SSPMS</h1>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Create Account</h2>
        <p className="text-gray-400 text-sm">Register to access the student placement portal.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full h-14 bg-[#333333] bg-opacity-70 text-white rounded-lg px-4 border border-transparent focus:border-blue-500 focus:bg-[#454545] outline-none transition-all placeholder:text-gray-500"
            placeholder="Aarav Sharma"
            autoComplete="name"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 bg-[#333333] bg-opacity-70 text-white rounded-lg px-4 border border-transparent focus:border-blue-500 focus:bg-[#454545] outline-none transition-all placeholder:text-gray-500"
            placeholder="student@college.edu"
            autoComplete="email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-[#333333] bg-opacity-70 text-white rounded-lg px-4 pr-12 border border-transparent focus:border-blue-500 focus:bg-[#454545] outline-none transition-all placeholder:text-gray-500"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center text-lg"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-500 text-sm">Already have an account? </span>
        <Link to="/login" className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
}
