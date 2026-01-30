/**
 * Vercel Blob Storage Helpers
 *
 * Object storage for images and media using @vercel/blob.
 * Only URLs are stored in the database - never local files.
 */

import { put, del, list } from '@vercel/blob';

export interface UploadImageOptions {
  file: File;
  folder?: string;
}

export interface UploadImageResult {
  url: string;
  downloadUrl: string;
  size: number;
  uploadedAt: Date;
  pathname: string;
}

export interface ListImagesOptions {
  prefix?: string;
  limit?: number;
}

export interface ImageMetadata {
  url: string;
  size: number;
  uploadedAt: Date;
  pathname: string;
}

/**
 * Upload an image to Vercel Blob Storage
 *
 * @param options - Upload options including file and optional folder
 * @returns Object containing URL and metadata
 * @throws Error if BLOB_READ_WRITE_TOKEN is not configured
 */
export async function uploadImage(
  options: UploadImageOptions
): Promise<UploadImageResult> {
  const { file, folder = 'uploads' } = options;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Generate unique filename with folder prefix
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop() || 'jpg';
  const pathname = `${folder}/${timestamp}-${randomString}.${extension}`;

  try {
    const blob = await put(pathname, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      pathname: blob.pathname,
    };
  } catch (error) {
    // Handle token not configured
    if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      throw new Error(
        'Vercel Blob storage is not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.'
      );
    }
    throw error;
  }
}

/**
 * Delete an image from Vercel Blob Storage by URL
 *
 * @param url - The full URL of the image to delete
 * @throws Error if deletion fails
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  } catch (error) {
    // Log but don't throw - already deleted or doesn't exist
    console.warn(`Failed to delete image: ${url}`, error);
  }
}

/**
 * List all images with optional prefix filter
 *
 * @param options - Optional prefix filter and limit
 * @returns Array of image metadata
 */
export async function listImages(
  options: ListImagesOptions = {}
): Promise<ImageMetadata[]> {
  const { prefix, limit = 100 } = options;

  try {
    const result = await list({
      prefix,
      limit,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return result.blobs.map((blob) => ({
      url: blob.url,
      size: blob.size,
      uploadedAt: blob.uploadedAt,
      pathname: blob.pathname,
    }));
  } catch (error) {
    console.warn('Failed to list images', error);
    return [];
  }
}

/**
 * Extract the pathname from a full blob URL
 * Useful for storing a reference in your database
 *
 * @param url - The full URL
 * @returns The pathname (e.g., "uploads/1234567890-abc123.jpg")
 */
export function getPathnameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.slice(1); // Remove leading slash
  } catch {
    return url;
  }
}

/**
 * Validate that Vercel Blob is configured
 *
 * @returns true if configured, false otherwise
 */
export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
