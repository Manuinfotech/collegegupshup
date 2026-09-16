import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = { title: 'College Reviews' };

export default async function CollegeReviewsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: collegeUser } = await supabase.from('college_users').select('college_id').eq('user_id', user.id).single();
  const collegeId = collegeUser?.college_id;

  let reviews: any[] = [];
  if (collegeId) {
    const { data } = await supabase
      .from('reviews')
      .select('*, users(full_name)')
      .eq('college_id', collegeId)
      .order('created_at', { ascending: false });
    reviews = data || [];
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reviews</h1>
          <p className="text-slate-500 mt-1">Student reviews and ratings for your college.</p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="border-0 shadow-sm px-5 py-3 flex items-center gap-3">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{avgRating}</p>
              <p className="text-xs text-slate-500">{reviews.length} reviews</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? reviews.map((review) => (
          <Card key={review.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 ring-1 ring-indigo-200 flex items-center justify-center">
                    <span className="font-bold text-indigo-700 text-sm">
                      {review.users?.full_name?.charAt(0) || <User className="h-4 w-4" />}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{review.users?.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <Badge variant="outline" className={review.is_approved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>
              </div>
              {review.title && <h3 className="font-semibold text-slate-900 mb-2">{review.title}</h3>}
              {review.content && <p className="text-sm text-slate-600 leading-relaxed mb-4">{review.content}</p>}
              {(review.pros?.length > 0 || review.cons?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {review.pros?.length > 0 && (
                    <div className="bg-emerald-50/50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-emerald-700 mb-2 flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> Pros</p>
                      <ul className="space-y-1">
                        {review.pros.map((pro: string, i: number) => (
                          <li key={i} className="text-xs text-emerald-800">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons?.length > 0 && (
                    <div className="bg-rose-50/50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-rose-700 mb-2 flex items-center gap-1"><ThumbsDown className="h-3 w-3" /> Cons</p>
                      <ul className="space-y-1">
                        {review.cons.map((con: string, i: number) => (
                          <li key={i} className="text-xs text-rose-800">• {con}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )) : (
          <div className="p-12 text-center text-slate-500">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-900 mb-1">No reviews yet</p>
            <p className="text-sm">Student reviews will appear here once they start rating your college.</p>
          </div>
        )}
      </div>
    </div>
  );
}
