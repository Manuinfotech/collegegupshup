import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || q.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const supabase = await createServerSupabaseClient();

    const { data: colleges } = await supabase
      .from('colleges')
      .select('id, name, slug, city_id, cities(name)')
      .eq('is_active', true)
      .eq('status', 'published')
      .ilike('name', `%${q}%`)
      .limit(10);

    const { data: courses } = await supabase
      .from('courses')
      .select('id, name, slug, college_id, colleges(name)')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .limit(5);

    const results = [
      ...(colleges || []).map((c: any) => ({ type: 'college', id: c.id, name: c.name, slug: c.slug, subtitle: c.cities?.name })),
      ...(courses || []).map((c: any) => ({ type: 'course', id: c.id, name: c.name, slug: c.slug, subtitle: c.colleges?.name })),
    ];

    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
