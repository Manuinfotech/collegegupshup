'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import type { UserRole } from '@/types/database';

function getRoleDashboard(role: UserRole | null | undefined): string {
  switch (role) {
    case 'super_admin':
      return '/admin';
    case 'college_admin':
      return '/dashboard';
    case 'student':
      return '/student';
    case 'manager':
      return '/manager';
    default:
      return '/student';
  }
}

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Fetch user role and redirect to their respective panel
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
      const destination = getRoleDashboard(userData?.role);
      router.push(destination);
      router.refresh();
      return;
    }

    router.push('/student');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-white selection:bg-indigo-500/30">
      {/* Left side - Graphic/Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-[#0A0A0A] to-purple-900/40 z-0" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[120px] z-0" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-purple-500/20 blur-[120px] z-0" />
        
        <Link href="/" className="relative z-10 flex items-center gap-3 group w-fit mt-8 lg:mt-12">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            College Gupshup
          </span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            Manage your institution with precision.
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            Access world-class analytics, lead generation, and student engagement tools all in one elite platform.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-medium">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center ring-1 ring-indigo-500/20">
                <Sparkles className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="font-medium">AI-powered insights</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-sm font-medium text-slate-500">
          <span>© 2026 College Gupshup</span>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 border-l border-white/5 bg-[#0A0A0A]/50 backdrop-blur-2xl">
        <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <Zap className="h-6 w-6 text-white fill-white" />
              </div>
            </Link>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h2>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl flex items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse" />
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-300">Email Address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-11" 
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                required 
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 h-11" 
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 group"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-white hover:text-indigo-400 transition-colors">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
