export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  image: string
}

export const SAMPLE_POSTS: BlogPost[] = [
  {
    slug: 'closet-organization-tips-2025',
    title: 'Top 10 Closet Organization Tips for 2025',
    excerpt:
      'Discover the latest trends and techniques to keep your closet clutter-free and stylish this year.',
    content: 'Full content would go here...',
    date: '2025-01-15',
    author: 'Sarah Jenkins',
    image: '/blog/organization-tips.jpg',
  },
  {
    slug: 'small-closet-solutions',
    title: 'How to Maximize Space in a Small Reach-In Closet',
    excerpt:
      "Don't let a small closet cramp your style. Learn how to double your storage space with these clever hacks.",
    content: 'Full content would go here...',
    date: '2025-02-01',
    author: 'Michael Chen',
    image: '/blog/small-closet.jpg',
  },
  {
    slug: 'custom-closet-roi',
    title: 'Do Custom Closets Increase Home Value?',
    excerpt:
      'We analyze the return on investment for custom storage solutions and how they impact resale value.',
    content: 'Full content would go here...',
    date: '2025-02-10',
    author: 'Jessica Rivera',
    image: '/blog/roi.jpg',
  },
]

export function getAllPosts(): BlogPost[] {
  return SAMPLE_POSTS
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return SAMPLE_POSTS.find(p => p.slug === slug)
}
