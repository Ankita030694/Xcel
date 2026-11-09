import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'Xcel-Brochure.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Xcel-Brochure.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Failed to serve brochure:', error);
    return new NextResponse('Brochure not found', { status: 404 });
  }
}

