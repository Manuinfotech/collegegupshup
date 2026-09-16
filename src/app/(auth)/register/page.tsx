'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { completeCollegeSignup } from '@/lib/actions/college-signup';
import { ArrowRight, Zap, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';

function RegisterForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Auto-detect account type from URL query param
  const typeFromUrl = searchParams.get('type');
  const isCollegeOnly = typeFromUrl === 'college';
  const isStudentOnly = typeFromUrl === 'student';
  const [accountType, setAccountType] = useState<'student' | 'college'>(
    isCollegeOnly ? 'college' : 'student'
  );

  useEffect(() => {
    if (typeFromUrl === 'college') setAccountType('college');
    else if (typeFromUrl === 'student') setAccountType('student');
  }, [typeFromUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('full_name') as string;
    const collegeName = formData.get('college_name') as string;

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          account_type: accountType,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      // If college signup, create the college record and link user
      if (accountType === 'college' && collegeName) {
        const result = await completeCollegeSignup(collegeName);
        if (result.error) {
          setError(result.error);
          setLoading(false);
          return;
        }
        router.push('/dashboard');
      } else {
        router.push('/student');
      }
      router.refresh();
    } else {
      // Briefly show success, then redirect to homepage with verification popup
      setSuccess('Registration successful! Redirecting...');
      setLoading(false);
      setTimeout(() => {
        router.push('/?verified=pending');
      }, 1500);
    }
  }

  const showTabs = !isCollegeOnly && !isStudentOnly;

  return (
    <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="lg:hidden flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Zap className="h-6 w-6 text-white fill-white" />
          </div>
        </Link>
      </div>

      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          {isCollegeOnly ? 'Register Your College' : isStudentOnly ? 'Student Signup' : 'Create Account'}
        </h2>
        <p className="text-slate-400">
          {isCollegeOnly
            ? 'List your institution on College Gupshup'
            : 'Get started in seconds'}
        </p>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-xl flex items-center">
          <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-xl flex items-center">
          <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Account type selector — only shown when no type in URL */}
      {showTabs && (
        <div className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-xl h-12">
          <button
            type="button"
            onClick={() => setAccountType('student')}
            className={`rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
              accountType === 'student'
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student
          </button>
          <button
            type="button"
            onClick={() => setAccountType('college')}
            className={`rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
              accountType === 'college'
                ? 'bg-white text-black shadow-sm'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            College
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* College name — only for college signups */}
        {accountType === 'college' && (
          <div className="space-y-1.5">
            <Label htmlFor="college_name" className="text-slate-300">College / Institution Name</Label>
            <Input
              id="college_name"
              name="college_name"
              placeholder="e.g. Delhi Public School of Engineering"
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 h-11"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="full_name" className="text-slate-300">
            {accountType === 'college' ? 'Admin Name' : 'Full Name'}
          </Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder={accountType === 'college' ? 'Admin Full Name' : 'John Doe'}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-slate-300">
            {accountType === 'college' ? 'Work Email' : 'Email Address'}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={accountType === 'college' ? 'admin@college.edu' : 'you@example.com'}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 h-11"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-slate-300">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            minLength={6}
            required
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50 h-11"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full mt-4 group">
          {loading
            ? 'Creating Account...'
            : accountType === 'college'
            ? 'Register Institution'
            : 'Continue as Student'}
          {!loading && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />}
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-white/5">
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-white hover:text-indigo-400 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-[#0A0A0A] text-white selection:bg-indigo-500/30">
      
      {/* Left side - Graphic/Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12 border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0A0A0A] to-[#0A0A0A] z-0" />
        
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
            Join the premier education network.
          </h1>
          <p className="text-slate-400 text-lg">
            Whether you&apos;re a student looking for the right path, or a college looking for the right students—everything starts here.
          </p>
        </div>
        
        <div className="relative z-10 flex items-center gap-4 text-sm font-medium text-slate-500">
          <span>© 2026 College Gupshup</span>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <Suspense fallback={
          <div className="w-full max-w-[420px] flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          </div>
        }>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
