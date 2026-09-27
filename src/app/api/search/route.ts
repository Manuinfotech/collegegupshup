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

    const { data: goals } = await supabase
      .from('goals')
      .select('id, name, slug')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .limit(3);

    const { data: colleges } = await supabase
      .from('colleges')
      .select('id, name, slug, city_id, cities(name), states(name), logo_url, college_type, fees(tuition_fee)')
      .eq('is_active', true)
      .eq('status', 'published')
      .or(`name.ilike.%${q}%,short_description.ilike.%${q}%`)
      .limit(8);

    const { data: courses } = await supabase
      .from('courses')
      .select('id, name, slug, college_id, colleges(name)')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .limit(5);

    const results = [
      ...(goals || []).map((g: any) => ({ type: 'course', id: g.id, name: g.name, slug: g.slug, subtitle: 'Course / Stream' })),
      ...(colleges || []).map((c: any) => ({ 
        type: 'college', 
        id: c.id, 
        name: c.name, 
        slug: c.slug, 
        subtitle: `${c.cities?.name || ''}${c.states?.name ? `, ${c.states?.name}` : ''}`,
        logo_url: c.logo_url,
        college_type: c.college_type,
        fee: c.fees?.[0]?.tuition_fee
      })),
      ...(courses || []).map((c: any) => ({ type: 'course', id: c.id, name: c.name, slug: c.slug, subtitle: c.colleges?.name })),
    ];

    return NextResponse.json({ data: results });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
