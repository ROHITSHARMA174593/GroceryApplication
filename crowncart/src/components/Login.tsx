'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error('Invalid email or password');
      }

      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Decorative Elements */}
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#00a63a]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
        className="w-full max-w-md bg-[#00a63a] rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white font-serif">
            Welcome Back
          </h2>
          <p className="text-emerald-100 mt-2 text-sm">Sign in to your CrownCart account</p>
        </div>

        {error && (
            <motion.div 
                initial={{opacity:0, y:-10}}
                animate={{opacity:1, y:0}}
                className="bg-red-500/20 border border-red-500/30 text-white text-sm p-3 rounded-lg mb-6 text-center"
            >
                {error}
            </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-emerald-200" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-black/10 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-emerald-200" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-black/10 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-emerald-200 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full bg-white text-[#00a63a] font-bold py-3.5 rounded-xl shadow-lg hover:shadow-black/20 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <>
                Sign In
                <ArrowRight className="w-5 h-5" />
                </>
            )}
          </motion.button>
        <div className="my-6 flex items-center gap-4">
            <div className="h-px bg-emerald-200 flex-1" />
            <span className="text-emerald-600 text-sm font-semibold">OR</span>
            <div className="h-px bg-emerald-200 flex-1" />
        </div>

        <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn("google", { callbackUrl: "/home" })}
            className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all flex items-center justify-center gap-3"
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    className="text-blue-500"
                />
                <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    className="text-green-500"
                />
                <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    className="text-yellow-500"
                />
                <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    className="text-red-500"
                />
            </svg>
            Continue with Google
        </motion.button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-emerald-100 text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="text-yellow-300 hover:text-yellow-200 font-semibold underline-offset-4 hover:underline transition-all">
                    Register
                </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
