import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CollegeCard } from '@/components/colleges/college-card';
import { HeartCrack } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'My Wishlist | College Gupshup',
  description: 'Your saved colleges and wishlists.',
};

export default async function SavedCollegesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <HeartCrack className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-900 mb-4">You need to log in!</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">
          Create an account or log in to sync your wishlist across all your devices and keep track of your favorite colleges.
        </p>
        <Link href="/login">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            Log In to View Wishlist
          </Button>
        </Link>
      </div>
    );
  }

  const { data: favorites, error } = await supabase
    .from('saved_colleges')
    .select(`
      college_id,
      colleges (
        id,
        name,
        slug,
        logo_url,
        cover_image_url,
        short_description,
        city_id,
        state_id,
        cities (name),
        states (name),
        college_type
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Wishlist</h1>
        <p className="text-slate-500 mb-8">Keep track of the colleges you're interested in.</p>
        
        {(!favorites || favorites.length === 0) ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center shadow-sm">
            <HeartCrack className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No colleges saved yet</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              Start exploring colleges and click the heart icon to save them to your wishlist.
            </p>
            <Link href="/colleges">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Explore Colleges
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((fav: any) => {
              const college = fav.colleges;
              if (!college) return null;
              
              const formattedCollege = {
                ...college,
                city_name: college.cities?.name,
                state_name: college.states?.name,
                ownership_type: college.college_type,
                average_rating: 0,
                review_count: 0
              };
              
              return (
                <div key={fav.college_id} className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
                  <CollegeCard college={formattedCollege} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
