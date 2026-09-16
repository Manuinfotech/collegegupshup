import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createServerSupabaseAdmin, createServerSupabaseClient } from '@/lib/supabase/server';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/svg+xml', 'svg'],
  ['application/pdf', 'pdf'],
]);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is super_admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const requestedBucket = formData.get('bucket');
    const requestedPath = formData.get('path');
    const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!bucket) {
      return NextResponse.json({ error: 'Storage is not configured' }, { status: 503 });
    }

    if (typeof requestedBucket === 'string' && requestedBucket !== bucket) {
      return NextResponse.json({ error: 'Invalid storage bucket' }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File must be between 1 byte and 5 MB' }, { status: 400 });
    }

    const extension = ALLOWED_FILE_TYPES.get(file.type);
    if (!extension) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const path = typeof requestedPath === 'string' ? requestedPath.trim() : '';
    if (path.includes('..') || !/^[a-zA-Z0-9/_-]{0,160}$/.test(path)) {
      return NextResponse.json({ error: 'Invalid upload path' }, { status: 400 });
    }

    const pathPrefix = [user.id, path.replace(/^\/+|\/+$/g, '')].filter(Boolean).join('/');
    const fileName = `${pathPrefix}/${randomUUID()}.${extension}`;
    const admin = createServerSupabaseAdmin();

    const { data, error } = await admin.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = admin.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl, path: data.path });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
