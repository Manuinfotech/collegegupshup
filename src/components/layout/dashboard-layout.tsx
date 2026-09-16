'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Building2, BookOpen, IndianRupee, Users, Image, Video,
  FileText, UserCheck, BarChart3, Settings, CreditCard, MessageSquare,
  TrendingUp, LogOut, ChevronLeft, Menu, Bell, Search, Zap, Heart, GitCompare, GraduationCap, DollarSign, Home, Trophy, ShieldCheck, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const collegeSidebarItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'My Colleges', href: '/dashboard/colleges', icon: Building2 },
  { title: 'Admissions', href: '/dashboard/college/edit?tab=admissions', icon: GraduationCap },
  { title: 'Courses', href: '/dashboard/college/edit?tab=courses', icon: BookOpen },
  { title: 'Fees', href: '/dashboard/college/edit?tab=fees', icon: IndianRupee },
  { title: 'Scholarships', href: '/dashboard/college/edit?tab=scholarships', icon: Trophy },
  { title: 'Placements', href: '/dashboard/college/edit?tab=placements', icon: TrendingUp },
  { title: 'Hostel', href: '/dashboard/college/edit?tab=hostel', icon: Home },
  { title: 'Rankings', href: '/dashboard/college/edit?tab=rankings', icon: Trophy },
  { title: 'Faculty', href: '/dashboard/faculty', icon: Users },
  { title: 'Gallery', href: '/dashboard/gallery', icon: Image },
  { title: 'Videos', href: '/dashboard/videos', icon: Video },
  { title: 'Brochures', href: '/dashboard/brochures', icon: FileText },
  { title: 'Leads', href: '/dashboard/leads', icon: UserCheck },
  { title: 'Reviews', href: '/dashboard/reviews', icon: MessageSquare },
  { title: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { title: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const adminSidebarItems: SidebarItem[] = [
  { title: 'Overview', href: '/admin', icon: LayoutDashboard },
  { title: 'Colleges', href: '/admin/colleges', icon: Building2 },
  { title: 'Managers', href: '/admin/managers', icon: Users },
  { title: 'Users', href: '/admin/users', icon: Users },
  { title: 'Plans', href: '/admin/plans', icon: CreditCard },
  { title: 'Payments', href: '/admin/payments', icon: DollarSign },
  { title: 'Blogs', href: '/admin/blogs', icon: FileText },
  { title: 'SEO', href: '/admin/seo', icon: TrendingUp },
  { title: 'Ads', href: '/admin/advertisements', icon: Image },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { title: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

const studentSidebarItems: SidebarItem[] = [
  { title: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { title: 'Search Colleges', href: '/student/search', icon: Search },
  { title: 'Saved Colleges', href: '/student/saved', icon: Heart },
  { title: 'Applications', href: '/student/applications', icon: FileText },
  { title: 'Compare', href: '/student/compare', icon: GitCompare },
  { title: 'My Reviews', href: '/student/reviews', icon: MessageSquare },
  { title: 'Profile', href: '/student/profile', icon: GraduationCap },
  { title: 'Settings', href: '/student/settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  variant?: 'college' | 'admin' | 'manager' | 'student';
}

export function DashboardLayout({ children, variant = 'college' }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ full_name?: string; email?: string; role?: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('full_name, email, role').eq('id', user.id).single();
        if (data) {
          setUserProfile(data);
        } else {
          setUserProfile({ email: user.email });
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const items = variant === 'admin' ? adminSidebarItems : variant === 'student' ? studentSidebarItems : collegeSidebarItems;

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden selection:bg-indigo-500/30">
      {/* Sleek Dark Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-[#0A0A0A] text-slate-400 transition-all duration-500 ease-in-out relative z-30 border-r border-white/5',
          collapsed ? 'w-20' : 'w-[280px]'
        )}
      >
        <div className="flex h-[96px] pt-6 pb-2 items-center justify-between px-6">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-3 group mt-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-500">
                <Zap className="h-4 w-4 fill-white text-white" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Gupshup <span className="text-white/50">{variant === 'admin' ? 'Super Admin' : variant === 'student' ? 'Student' : 'College'}</span>
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 text-slate-500 hover:text-white hover:bg-white/10 ml-auto rounded-lg transition-colors"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform duration-500', collapsed && 'rotate-180')} />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-4 px-3 min-h-0">
          <nav className="space-y-1.5">
            {!collapsed && (
              <div className="px-4 text-[11px] font-bold text-slate-600 uppercase tracking-widest mb-4 mt-2">
                Menu
              </div>
            )}
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 group relative active:scale-[0.96]',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/5 border border-indigo-500/20 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                      : 'text-slate-400 border border-transparent hover:bg-white/5 hover:text-slate-100 hover:shadow-[0_0_15px_rgba(255,255,255,0.03)]'
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                  )}
                  <item.icon className={cn('h-[18px] w-[18px] shrink-0 transition-all duration-300 group-hover:scale-110', isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300')} />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-r from-white/5 to-transparent rounded-2xl p-1 mb-4 hidden lg:block">
            <div className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700" />
              {!collapsed && (
                <>
                  <p className="text-xs font-semibold text-white mb-1">Need help?</p>
                  <p className="text-[10px] text-slate-500 mb-3">Contact support 24/7</p>
                  <Button size="sm" className="w-full bg-white/10 hover:bg-white/20 text-white h-8 text-xs border-0 transition-colors">
                    Support
                  </Button>
                </>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 text-slate-500 hover:text-white hover:bg-white/10 justify-start rounded-xl transition-colors",
              collapsed ? "px-0 justify-center" : "px-3"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area - Floating Design */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-[#0A0A0A] pt-2 pr-2 pb-0 pl-0 transition-all duration-500">
        <div className="flex-1 flex flex-col min-h-0 bg-[#FAFAFA] rounded-none lg:rounded-tl-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.1)] ring-1 ring-black/5 relative">
          
          {/* Subtle Top Gradient for depth */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-100/80 to-transparent pointer-events-none" />

          {/* Top Bar - Invisible Glassmorphism */}
          <header className="h-[72px] bg-white/40 backdrop-blur-2xl border-b border-slate-200/50 flex items-center justify-between px-8 sticky top-0 z-20 transition-all">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden text-slate-500 hover:bg-white/50">
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden md:flex items-center bg-white/80 backdrop-blur-sm border border-slate-200/80 hover:border-slate-300 rounded-2xl px-4 py-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
                <Search className="h-4 w-4 text-slate-400 mr-2.5" />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="bg-transparent border-none outline-none text-sm w-72 text-slate-700 placeholder:text-slate-400 font-medium"
                />
                <div className="ml-2 flex items-center gap-1">
                  <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500">⌘</kbd>
                  <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500">K</kbd>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <Button asChild variant="outline" size="sm" className="hidden sm:flex h-9 border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-full px-4">
                <Link href="/" target="_blank">
                  <Globe className="h-4 w-4 mr-2" />
                  View Website
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100/80 hover:text-slate-700 rounded-full h-10 w-10 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </Button>
              
              <div className="h-8 w-px bg-slate-200" />
              
              <div className="relative">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-slate-100/80 p-1.5 rounded-full pr-4 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white uppercase">
                    {userProfile?.full_name ? userProfile.full_name.substring(0, 2) : (variant === 'admin' ? 'SA' : 'CA')}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="text-sm font-bold text-slate-800 leading-none mb-1">
                      {userProfile?.full_name || (variant === 'admin' ? 'Super Admin' : 'College Admin')}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 leading-none truncate max-w-[120px]">
                      {userProfile?.email || 'Loading...'}
                    </span>
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 mb-2">
                      <p className="text-sm font-semibold text-slate-800">{userProfile?.full_name || (variant === 'admin' ? 'Super Admin' : 'College Admin')}</p>
                      <p className="text-xs text-slate-500 truncate">{userProfile?.email}</p>
                    </div>
                    
                    <Link href="/dashboard/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                      Edit Profile
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                      Change Password
                    </Link>
                    
                    <div className="h-px bg-slate-100 my-2" />
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Scrollable Page Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 relative z-10 scroll-smooth">
            <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
