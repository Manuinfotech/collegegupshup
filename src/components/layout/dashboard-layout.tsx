'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Building2, BookOpen, IndianRupee, Users, Image as ImageIcon, Video,
  FileText, UserCheck, BarChart3, Settings, CreditCard, MessageSquare,
  TrendingUp, LogOut, ChevronLeft, Menu, Bell, Search, Zap, Heart, GitCompare, GraduationCap, DollarSign, Home, Trophy, ShieldCheck, Globe, MessageSquare as SlackIcon, Plus, MoreVertical, TerminalSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GlobalSearch } from '@/components/layout/global-search';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isNew?: boolean;
}

const collegeSidebarItems: SidebarItem[] = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { title: 'My Colleges', href: '/dashboard/colleges', icon: Building2 },
  { title: 'Admissions', href: '/dashboard/college/edit?tab=admissions', icon: GraduationCap },
  { title: 'Courses', href: '/dashboard/college/edit?tab=courses', icon: BookOpen },
  { title: 'Fees', href: '/dashboard/college/edit?tab=fees', icon: IndianRupee },
  { title: 'Scholarships', href: '/dashboard/college/edit?tab=scholarships', icon: Trophy },
  { title: 'Placements', href: '/dashboard/college/edit?tab=placements', icon: TrendingUp },
  { title: 'Hostel', href: '/dashboard/college/edit?tab=hostel', icon: Home },
  { title: 'Rankings', href: '/dashboard/college/edit?tab=rankings', icon: Trophy },
  { title: 'Faculty', href: '/dashboard/faculty', icon: Users },
  { title: 'Gallery', href: '/dashboard/gallery', icon: ImageIcon },
  { title: 'Videos', href: '/dashboard/videos', icon: Video },
  { title: 'Brochures', href: '/dashboard/brochures', icon: FileText },
  { title: 'Leads', href: '/dashboard/leads', icon: UserCheck, isNew: true },
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
  { title: 'Ads', href: '/admin/advertisements', icon: ImageIcon },
  { title: 'Leads', href: '/admin/leads', icon: UserCheck, isNew: true },
  { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { title: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

const studentSidebarItems: SidebarItem[] = [
  { title: 'Overview', href: '/student', icon: LayoutDashboard },
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
  const [searchOpen, setSearchOpen] = useState(false);
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
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-[#FDFDFD] transition-all duration-300 ease-in-out relative z-30 border-r border-gray-200/60',
          collapsed ? 'w-20' : 'w-[260px]'
        )}
      >
        <div className="flex h-[72px] items-center px-6">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-black text-white">
                <Zap className="h-4 w-4 fill-white text-white" />
              </div>
              <span className="font-bold text-[15px] tracking-tight text-gray-900">
                Gupshup <span className="font-normal text-gray-500">{variant === 'admin' ? 'Admin' : variant === 'student' ? 'Student' : 'College'}</span>
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-6 w-6 text-gray-400 hover:text-gray-900 ml-auto rounded transition-colors"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform duration-300', collapsed && 'rotate-180')} />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-2 px-4 min-h-0">
          <div className="mb-2">
            <div 
              className="flex items-center gap-2 bg-gray-100/50 hover:bg-gray-100 text-gray-500 rounded-md px-3 py-1.5 text-sm cursor-pointer transition-colors"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              {!collapsed && <span>Search</span>}
            </div>
          </div>
          <nav className="space-y-0.5 mt-4">
            {items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/dashboard' && item.href !== '/student' && pathname.startsWith(item.href));
              
              // Only top items, can group them later if needed
              if (item.title === 'Analytics') {
                return (
                  <div key="separator-analytics">
                    {!collapsed && <div className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-6 mb-2">Build</div>}
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-all duration-200 group relative',
                        isActive
                          ? 'bg-[#111111] text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4 shrink-0 transition-all', isActive ? 'text-[#D4FF00]' : 'text-gray-400 group-hover:text-gray-600')} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                      {!collapsed && item.isNew && (
                        <span className="ml-auto bg-[#D4FF00] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm">NEW</span>
                      )}
                    </Link>
                  </div>
                )
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-all duration-200 group relative',
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className={cn('h-4 w-4 shrink-0 transition-all', isActive ? 'text-[#D4FF00]' : 'text-gray-400 group-hover:text-gray-600')} />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                  {!collapsed && item.isNew && (
                    <span className="ml-auto bg-[#D4FF00] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm">NEW</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        
        <div className="p-4 mt-auto border-t border-gray-100">
          {!collapsed && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-500 tracking-wider">BALANCE</span>
                <span className="text-sm font-semibold text-rose-600">₹0.00</span>
              </div>
              <p className="text-[12px] text-gray-500 leading-tight mb-3">
                Requests fail once the balance cannot cover them.
              </p>
              <Button variant="outline" className="w-full rounded-full h-8 text-xs font-medium border-gray-200 text-gray-700 hover:bg-gray-50">
                <Plus className="h-3 w-3 mr-1" /> Top up
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-[#D4FF00] flex items-center justify-center text-black font-bold text-xs shrink-0">
                {userProfile?.full_name ? userProfile.full_name.substring(0, 1) : (variant === 'admin' ? 'SA' : 'CA')}
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0 truncate">
                  <span className="text-[13px] font-medium text-gray-900 truncate">
                    {userProfile?.email || 'Loading...'}
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <MoreVertical className="h-4 w-4 text-gray-400 group-hover:text-gray-600 shrink-0" />
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#FDFDFD] relative">
        {/* Top Navbar */}
        <header className="h-[72px] bg-[#FDFDFD] border-b border-gray-200/60 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="hidden lg:flex flex-1" />
          
          <div className="flex items-center gap-3 ml-auto">
            <div 
              className="hidden md:flex items-center bg-gray-50/80 border border-gray-200 hover:border-gray-300 rounded-full px-4 py-1.5 transition-all cursor-pointer w-64"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <div className="text-[13px] text-gray-500 font-medium flex-1">Search docs...</div>
              <div className="flex items-center gap-0.5">
                <kbd className="font-sans text-[10px] text-gray-400">⌘</kbd>
                <kbd className="font-sans text-[10px] text-gray-400">K</kbd>
              </div>
            </div>

            <Button variant="outline" className="hidden sm:inline-flex items-center h-8 rounded-full border-gray-200 text-[13px] text-gray-700 font-medium hover:bg-gray-50 px-4">
              <Zap className="h-3.5 w-3.5 mr-2" /> Ask us anything
            </Button>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hidden sm:flex">
              <SlackIcon className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-1 border border-gray-200 rounded-full px-3 py-1 h-8 cursor-pointer hover:bg-gray-50">
              <span className="text-[14px]">🇮🇳</span>
              <span className="text-[13px] font-medium text-gray-700 ml-1">INR</span>
              <ChevronLeft className="h-3 w-3 text-gray-400 -rotate-90 ml-1" />
            </div>
            
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            </Button>
            
            <Button className="h-8 rounded-full bg-[#D4FF00] hover:bg-[#c2eb00] text-black text-[13px] font-bold px-5 shadow-none">
              <Zap className="h-3.5 w-3.5 mr-1.5 fill-black" /> Get Help
            </Button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}
