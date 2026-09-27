import { NextResponse } from 'next/server';
import { generateCsvTemplate } from '@/lib/actions/admin-colleges';

export async function GET() {
  const csv = await generateCsvTemplate();

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="college-upload-template.csv"',
    },
  });
}
