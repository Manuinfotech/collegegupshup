import { cookies } from 'next/headers';
import { Metadata } from 'next';
import { CollegeCard } from '@/components/colleges/college-card';
import { CollegeFilters } from '@/components/colleges/college-filters';
import { CollegeSort } from '@/components/colleges/college-sort';
import { CollegePagination } from '@/components/colleges/college-pagination';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { GOALS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'All Colleges in India',
  description: 'Browse and discover top colleges in India. Compare fees, placements, rankings and reviews.',
};

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const cookieStore = await cookies();
  const cookieCity = cookieStore.get('selected_city')?.value;

  const resolvedParams = await searchParams;
  const urlCity = typeof resolvedParams.city === 'string' ? resolvedParams.city : '';
  const urlState = typeof resolvedParams.state === 'string' ? resolvedParams.state : '';
  
  const selectedCity = urlCity === 'all' ? '' : (urlCity || cookieCity || '');
  const selectedState = urlState === 'all' ? '' : urlState;
  const selectedGoal = typeof resolvedParams.goal === 'string' ? resolvedParams.goal : '';
  const selectedOwnership = typeof resolvedParams.ownership === 'string' ? resolvedParams.ownership : '';
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'relevance';
  
  const currentPage = parseInt(typeof resolvedParams.page === 'string' ? resolvedParams.page : '1', 10);
  const pageSize = 12;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const matchedGoal = selectedGoal ? GOALS.find((g) => g.slug === selectedGoal) : null;
  const goalText = matchedGoal ? matchedGoal.name : (selectedGoal ? selectedGoal.toUpperCase() : 'All');
  
  let locationText = '';
  if (selectedCity) {
    locationText = selectedCity.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  } else if (selectedState) {
    locationText = selectedState.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  let pageTitle = 'All Colleges in India';
  if (locationText) {
    pageTitle = `${goalText === 'All' ? 'Colleges' : goalText + ' Colleges'} in ${locationText}`;
  } else {
    pageTitle = goalText === 'All' ? 'All Colleges in India' : `Top ${goalText} Colleges in India`;
  }

  const supabase = await createServerSupabaseClient();

  // If city or state filter is applied, get their IDs first
  let cityIdFilters: string[] = [];
  let stateIdFilters: string[] = [];

  if (selectedCity) {
    const { data: cityData } = await supabase.from('cities').select('id').ilike('name', selectedCity);
    if (cityData && cityData.length > 0) cityIdFilters = cityData.map(c => c.id);
  }
  if (selectedState) {
    const { data: stateData } = await supabase.from('states').select('id').ilike('name', selectedState);
    if (stateData && stateData.length > 0) stateIdFilters = stateData.map(s => s.id);
  }

  // Build the query
  let query = supabase
    .from('colleges')
    .select('*, cities(name), states(name)', { count: 'exact' })
    .eq('status', 'published')
    .eq('is_active', true);

  if (selectedCity && cityIdFilters.length > 0) query = query.in('city_id', cityIdFilters);
  else if (selectedCity && cityIdFilters.length === 0) query = query.eq('city_id', '00000000-0000-0000-0000-000000000000'); // Force empty result if city not found
  
  if (selectedState && stateIdFilters.length > 0) query = query.in('state_id', stateIdFilters);
  else if (selectedState && stateIdFilters.length === 0) query = query.eq('state_id', '00000000-0000-0000-0000-000000000000'); // Force empty result if state not found
  if (selectedOwnership) query = query.eq('ownership_type', selectedOwnership as any);
  if (selectedGoal) {
    const goalSlug = selectedGoal.toLowerCase();
    const searchTerms = [selectedGoal];
    
    // Add common variations for courses to match DB
    if (goalSlug === 'mba') searchTerms.push('MBA', 'PGDM/MBA', 'MBA/PGDM', 'PGDM');
    if (goalSlug === 'engineering') searchTerms.push('Engineering', 'B.Tech', 'M.Tech', 'BE', 'B.E.');
    if (goalSlug === 'medical') searchTerms.push('Medical', 'MBBS', 'BDS', 'MD');
    if (goalSlug === 'law') searchTerms.push('Law', 'LLB', 'LLM', 'BA LLB');
    
    const matchedGoal = GOALS.find((g) => g.slug === goalSlug);
    if (matchedGoal) searchTerms.push(matchedGoal.name, matchedGoal.name.toUpperCase());
    
    query = query.overlaps('parent_courses', searchTerms);
  }

  // Sorting
  switch (sort) {
    case 'rating':
      query = query.order('average_rating', { ascending: false });
      break;
    case 'fees_low':
      // Simplified: we order by average_rating for now if there is no explicit fee min column
      query = query.order('name', { ascending: true });
      break;
    case 'fees_high':
      query = query.order('name', { ascending: false });
      break;
    case 'relevance':
    default:
      query = query.order('is_featured', { ascending: false }).order('average_rating', { ascending: false });
      break;
  }

  // Pagination
  query = query.range(from, to);

  const { data: colleges, count } = await query;
  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Colleges</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <CollegeFilters />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {count === 0 
                  ? 'No colleges found' 
                  : `Showing ${from + 1}-${Math.min(to + 1, count || 0)} of ${count} colleges`}
              </p>
            </div>
            <CollegeSort />
          </div>

          {/* College Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {colleges && colleges.length > 0 ? (
              colleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={{
                    id: college.id,
                    name: college.name,
                    slug: college.slug,
                    logo_url: college.logo_url,
                    cover_image_url: college.cover_image_url,
                    short_description: college.short_description,
                    city_name: college.cities?.name || '',
                    state_name: college.states?.name || '',
                    ownership_type: college.ownership_type,
                    established_year: college.established_year,
                    is_featured: college.is_featured,
                    is_verified: college.is_verified,
                    average_rating: college.average_rating || 0,
                    review_count: college.review_count || 0,
                    fees_range: null,
                    highest_package: null,
                    average_package: null,
                  }}
                />
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <Building2 className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900">No colleges found</h3>
                <p className="text-slate-500 mt-2 max-w-md">
                  We couldn't find any colleges matching your current filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <CollegePagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
