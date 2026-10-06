import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, token } = response.data;
      setAuth(user, token);
      
      toast.success('Sign In Successful');
      navigate(user.role === 'STUDENT' ? '/student' : '/admin');
    } catch (error: any) {
      const msg = error.response?.data?.error?.message || 'Login failed';
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
        <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
        <p className="text-gray-400 text-sm">Enter your placement portal credentials to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 bg-[#333333] bg-opacity-70 text-white rounded-lg px-4 border border-transparent focus:border-blue-500 focus:bg-[#454545] outline-none transition-all placeholder:text-gray-500"
            placeholder="admin@sspms.edu"
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
              placeholder="Enter your password"
              autoComplete="current-password"
              required
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

        <div className="flex justify-between items-center text-sm px-1 mt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900" />
            <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
          </label>
          <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
            Need help?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center text-lg"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-8 text-gray-500 text-sm text-center">
        Secured by SSPMS Placement Cell <br />
        <span className="text-gray-600 text-xs mt-2 inline-block">Authorized personnel only</span>
      </div>
    </div>
  );
}
