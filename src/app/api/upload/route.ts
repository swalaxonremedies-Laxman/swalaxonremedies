
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided.' });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ success: false, error: 'Invalid file type.' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name.toLowerCase().replace(/\s+/g, '-')}`;
  const directory = join(process.cwd(), 'public', 'uploads');
  const path = join(directory, filename);
  
  try {
    await writeFile(path, buffer);
    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save file.' });
  }
}
