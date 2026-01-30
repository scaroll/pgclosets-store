/**
 * Vercel Blob Delete API Route
 *
 * DELETE /api/images/delete
 *
 * Deletes an image from Vercel Blob Storage by URL.
 */

import { NextRequest, NextResponse } from 'next/server';
import { deleteImage, isBlobConfigured } from '@/lib/storage';

export const runtime = 'edge';

export async function DELETE(request: NextRequest) {
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
    // Parse request body
    const body = await request.json();
    const { url } = body;

    // Validate URL exists
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Delete from Blob storage
    await deleteImage(url);

    return NextResponse.json(
      {
        success: true,
        message: 'Image deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete image';

    return NextResponse.json(
      {
        error: 'Delete failed',
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
