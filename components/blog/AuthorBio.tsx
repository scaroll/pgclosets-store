/**
 * Author Bio Component
 * Display author information and credibility
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@/lib/blog/types';
import { Linkedin, Twitter } from 'lucide-react';

interface AuthorBioProps {
  author: Author;
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Author Image */}
        <div className="flex-shrink-0">
          <Image
            src={author.image}
            alt={author.name}
            width={120}
            height={120}
            className="rounded-full"
          />
        </div>

        {/* Author Details */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{author.name}</h3>
          <p className="text-blue-600 font-medium mb-3">{author.role}</p>
          <p className="text-gray-700 leading-relaxed mb-4">{author.bio}</p>

          {/* Social Links */}
          {author.socialLinks && (
            <div className="flex gap-3">
              {author.socialLinks.linkedin && (
                <a
                  href={author.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  aria-label={`${author.name} on LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}

              {author.socialLinks.twitter && (
                <a
                  href={author.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  aria-label={`${author.name} on Twitter`}
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
