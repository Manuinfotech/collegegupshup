'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadLocalFile(formData: FormData) {
  const file = formData.get('file') as File;
  const folder = formData.get('folder') as string;
  
  if (!file || !file.size) {
    return { success: false, error: 'No file provided' };
  }
  
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Sanitize folder name to prevent path traversal
    const safeFolder = folder.replace(/[^a-z0-9_-]/gi, '') || 'misc';
    
    // Create the directory in public/uploads/
    const uploadDir = join(process.cwd(), 'public', 'uploads', safeFolder);
    await mkdir(uploadDir, { recursive: true });
    
    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${uniqueSuffix}-${originalName}`;
    
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    // Return the public URL
    const fileUrl = `/uploads/${safeFolder}/${filename}`;
    
    return { success: true, url: fileUrl };
  } catch (error) {
    console.error('File upload failed:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}
