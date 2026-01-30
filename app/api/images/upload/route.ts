/**
 * Vercel Blob Upload API Route
 *
 * POST /api/images/upload
 *
 * Uploads an image to Vercel Blob Storage and returns the public URL.
 * This is a Server Action compatible route for client-side uploads.
 */

import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, isBlobConfigured } from '@/lib/storage';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  // Check if Blob storage is configured
  if (!isBlobConfigured()) {
    return NextResponse.json(
      {
        error: 'Vercel Blob storage is not configured',
        message: 'Please set BLOB_READ_WRITE_TOKEN environment variable',
      },
      { status: 500 }
    );
  }

  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string | null;

    // Validate file exists
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Upload to Blob storage
    const result = await uploadImage({
      file,
      folder: folder || 'uploads',
    });

    // Return the URL and metadata
    return NextResponse.json(
      {
        success: true,
        url: result.url,
        downloadUrl: result.downloadUrl,
        size: result.size,
        pathname: result.pathname,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to upload image';

    return NextResponse.json(
      {
        error: 'Upload failed',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS request for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
