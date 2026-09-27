import Link from 'next/link';
import { Suspense } from 'react';
import { Search, Menu, User, Heart, BarChart3, Sparkles, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { GOALS } from '@/lib/constants';
import { CitySelector } from './city-selector';
import { SearchButton } from './search-button';

const navigation = [
  { name: 'Rankings', href: '/rankings' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Blog', href: '/blog' },
];



import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function Header() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cg_logo.webp" alt="College Gupshup Logo" className="h-14 w-auto object-contain" />
          </Link>

          {/* City Selector */}
          <div className="hidden md:block border-l pl-6 py-1">
            <Suspense fallback={
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#bce600] hover:bg-indigo-50/80">
                <MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />
                Select City
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            }>
              <CitySelector />
            </Suspense>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Colleges Mega Menu */}
          <div className="relative group">
            <Link href="/colleges" className="flex items-center px-3.5 py-2 text-sm font-semibold text-gray-900 hover:text-[#bce600] rounded-lg hover:bg-indigo-50/80 transition-all duration-200">
              Colleges <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-all" />
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 grid grid-cols-3 gap-6 relative before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" /> By Goal
                  </h3>
                  <ul className="space-y-2">
                    {GOALS.slice(0, 6).map(g => (
                      <li key={g.slug}>
                        <Link href={`/colleges?goal=${g.slug}`} className="text-sm text-gray-600 hover:text-[#bce600] block py-1">
                          {g.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" /> By State
                  </h3>
                  <ul className="space-y-2">
                    <li><Link href="/colleges?state=maharashtra" className="text-sm text-gray-600 hover:text-[#bce600] block py-1">Maharashtra</Link></li>
                    <li><Link href="/colleges?state=delhi" className="text-sm text-gray-600 hover:text-[#bce600] block py-1">Delhi NCR</Link></li>
                    <li><Link href="/colleges?state=karnataka" className="text-sm text-gray-600 hover:text-[#bce600] block py-1">Karnataka</Link></li>
                    <li><Link href="/colleges?state=tamil-nadu" className="text-sm text-gray-600 hover:text-[#bce600] block py-1">Tamil Nadu</Link></li>
                    <li><Link href="/colleges?state=uttar-pradesh" className="text-sm text-gray-600 hover:text-[#bce600] block py-1">Uttar Pradesh</Link></li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg p-5 flex flex-col justify-center">
                  <h3 className="font-semibold text-indigo-900 mb-2">Featured Institutions</h3>
                  <p className="text-xs text-indigo-700/80 mb-5 leading-relaxed">Discover top-ranked colleges across India with world-class facilities.</p>
                  <Link href="/colleges">
                    <Button size="sm" className="w-full shadow-md">Explore All</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Mega Menu */}
          <div className="relative group">
            <Link href="/courses" className="flex items-center px-3.5 py-2 text-sm font-semibold text-gray-900 hover:text-[#bce600] rounded-lg hover:bg-indigo-50/80 transition-all duration-200">
              Courses <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-all" />
            </Link>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[520px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 gap-6 relative before:absolute before:-top-2 before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Top UG Courses</h3>
                  <ul className="space-y-2">
                    <li><Link href="/colleges?goal=btech" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">B.Tech</Link></li>
                    <li><Link href="/colleges?goal=bba" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">BBA</Link></li>
                    <li><Link href="/colleges?goal=mbbs" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">MBBS</Link></li>
                    <li><Link href="/colleges?goal=bcom" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">B.Com</Link></li>
                    <li><Link href="/colleges?goal=bca" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">BCA</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">Top PG & Online Courses</h3>
                  <ul className="space-y-2">
                    <li><Link href="/colleges?goal=mba" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">MBA / PGDM</Link></li>
                    <li>
                      <Link href="/colleges?goal=online-mba" className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 flex items-center justify-between py-1 cursor-pointer">
                        <span>Online MBA</span>
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Trending</span>
                      </Link>
                    </li>
                    <li><Link href="/colleges?goal=mtech" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">M.Tech</Link></li>
                    <li><Link href="/colleges?goal=md" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">MD / MS</Link></li>
                    <li><Link href="/colleges?goal=mca" className="text-sm text-gray-600 hover:text-[#bce600] block py-1 cursor-pointer">MCA</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Links */}
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3.5 py-2 text-sm font-semibold text-gray-900 hover:text-[#bce600] rounded-lg hover:bg-indigo-50/80 transition-all duration-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <SearchButton />
          <Link href="/compare" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#bce600] hover:bg-indigo-50/80">
              <BarChart3 className="h-[18px] w-[18px]" />
            </Button>
          </Link>
          <Link href="/saved" className="hidden sm:block">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#bce600] hover:bg-indigo-50/80">
              <Heart className="h-[18px] w-[18px]" />
            </Button>
          </Link>
          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 ml-1">
                <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 ml-1">
                <User className="h-3.5 w-3.5 mr-1.5" />
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center size-8 rounded-lg hover:bg-indigo-50/80 transition-colors ml-1">
              <Menu className="h-5 w-5 text-gray-600" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-1 mt-8">
                {/* Mobile City Selector */}
                <Suspense fallback={
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Select City</p>
                  </div>
                }>
                  <CitySelector mobile />
                </Suspense>

                <Link href="/colleges" className="text-base font-medium text-gray-700 hover:text-[#bce600] px-3 py-2.5 rounded-lg hover:bg-indigo-50/80 transition-all">
                  Colleges
                </Link>
                <Link href="/courses" className="text-base font-medium text-gray-700 hover:text-[#bce600] px-3 py-2.5 rounded-lg hover:bg-indigo-50/80 transition-all">
                  Courses
                </Link>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-gray-700 hover:text-[#bce600] px-3 py-2.5 rounded-lg hover:bg-indigo-50/80 transition-all"
                  >
                    {item.name}
                  </Link>
                ))}
                <hr className="my-3 border-gray-100" />
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">Explore by Goal</p>
                {GOALS.map((goal) => (
                  <Link
                    key={goal.slug}
                    href={`/colleges?goal=${goal.slug}`}
                    className="text-sm text-gray-500 hover:text-[#bce600] px-3 py-1.5 rounded-lg hover:bg-indigo-50/80 transition-all"
                  >
                    {goal.name} Colleges
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Secondary Menu (Courses) */}
      <div className="hidden md:flex items-center justify-center gap-8 bg-slate-50 border-t border-slate-100 h-10 px-4 overflow-x-auto text-sm font-medium text-slate-600 shadow-inner">
        <span className="text-indigo-600 font-bold uppercase tracking-wider text-[11px] mr-2 bg-indigo-100 px-2 py-1 rounded">Top Courses:</span>
        <Link href="/colleges?goal=mba" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer">MBA/PGDM</Link>
        <Link href="/colleges?goal=online-mba" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 font-semibold text-indigo-600">
          Online MBA <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">Hot</span>
        </Link>
        <Link href="/colleges?goal=btech" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer">B.Tech</Link>
        <Link href="/colleges?goal=mca" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer">MCA</Link>
        <Link href="/colleges?goal=bba" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer">BBA</Link>
        <Link href="/colleges?goal=mbbs" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer">MBBS</Link>
        <Link href="/colleges?goal=bcom" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer">B.Com</Link>
        <Link href="/colleges?goal=mtech" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer">M.Tech</Link>
        <Link href="/colleges?goal=md" className="hover:text-[#bce600] transition-colors whitespace-nowrap cursor-pointer">MD/MS</Link>
        <Link href="/courses" className="hover:text-[#bce600] transition-colors whitespace-nowrap text-indigo-500 font-semibold ml-4 flex items-center">
          View All <ChevronDown className="h-3 w-3 ml-1 -rotate-90" />
        </Link>
      </div>
    </header>
  );
}
