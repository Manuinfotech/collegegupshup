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
import { ThemeToggle } from '@/components/theme-toggle';

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
    <div className="flex h-screen bg-[#FDFDFD] dark:bg-black font-sans overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-[#FDFDFD] dark:bg-black transition-all duration-300 ease-in-out relative z-30 border-r border-gray-200/60 dark:border-gray-800',
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
            className={cn("flex h-8 w-8 text-gray-400 hover:text-gray-900 rounded transition-colors shrink-0", collapsed ? "mx-auto" : "ml-auto")}
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
                        'flex items-center rounded-md py-2 text-[14px] font-medium transition-all duration-200 group relative',
                        collapsed ? 'justify-center px-0' : 'gap-3 px-3',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4 shrink-0 transition-all', isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600')} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                      {!collapsed && item.isNew && (
                        <span className="ml-auto bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">NEW</span>
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
                    'flex items-center rounded-md py-2 text-[14px] font-medium transition-all duration-200 group relative',
                    collapsed ? 'justify-center px-0' : 'gap-3 px-3',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon className={cn('h-4 w-4 shrink-0 transition-all', isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600')} />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                  {!collapsed && item.isNew && (
                    <span className="ml-auto bg-indigo-100 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded-sm">NEW</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
        
        <div className="p-4 mt-auto border-t border-gray-100">

          
          <div className="flex items-center justify-between group p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                {userProfile?.full_name ? userProfile.full_name.substring(0, 1).toUpperCase() : (variant === 'admin' ? 'A' : 'U')}
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0 truncate">
                  <span className="text-[13px] font-semibold text-gray-900 truncate">
                    {userProfile?.full_name || 'Admin User'}
                  </span>
                  <span className="text-[11px] text-gray-500 truncate">
                    {userProfile?.email || 'admin@collegegupshup.com'}
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors shrink-0" title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#FDFDFD] dark:bg-black relative">
        {/* Top Navbar */}
        <header className="h-[72px] bg-[#FDFDFD] dark:bg-black border-b border-gray-200/60 dark:border-gray-800 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="hidden lg:flex flex-1" />
          
          <div className="flex items-center gap-3 ml-auto">
            <div 
              className="hidden md:flex items-center bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-full px-4 py-1.5 transition-all cursor-pointer w-64"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <div className="text-[13px] text-gray-500 font-medium flex-1">Search...</div>
              <div className="flex items-center gap-0.5">
                <kbd className="font-sans text-[10px] text-gray-400 font-medium">⌘</kbd>
                <kbd className="font-sans text-[10px] text-gray-400 font-medium">K</kbd>
              </div>
            </div>
            <ThemeToggle />
            
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
      <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
    </div>
  );
}
