/**
 * Share Buttons Component
 * Social sharing buttons for article amplification
 */

'use client';

import React from 'react';
import { Facebook, Twitter, Linkedin, Mail, Link as LinkIcon } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description: _description }: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareUrls.facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareUrls.twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: shareUrls.linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
    {
      name: 'Email',
      icon: Mail,
      url: shareUrls.email,
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        {shareButtons.map((button) => (
          <a
            key={button.name}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors ${button.color}`}
            aria-label={`Share on ${button.name}`}
          >
            <button.icon className="w-5 h-5" />
            <span className="hidden sm:inline">{button.name}</span>
          </a>
        ))}

        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          aria-label="Copy link"
        >
          <LinkIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}
