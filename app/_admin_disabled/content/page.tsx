import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  FileText,
  Edit,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter,
  Globe,
  Calendar,
  User
} from 'lucide-react';

const prisma = new PrismaClient();

async function getContent() {
  const [pages, blogPosts] = await Promise.all([
    prisma.page.findMany({
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.blogPost.findMany({
      orderBy: { updatedAt: 'desc' }
    })
  ]);

  return { pages, blogPosts };
}

function getStatusColor(status: string) {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default async function ContentPage() {
  const { pages, blogPosts } = await getContent();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">Manage pages and blog posts</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <a
              href="#pages"
              className="py-2 px-6 border-b-2 border-blue-500 font-medium text-blue-600"
            >
              Pages ({pages.length})
            </a>
            <a
              href="#blog"
              className="py-2 px-6 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Blog Posts ({blogPosts.length})
            </a>
          </nav>
        </div>

        {/* Pages Section */}
        <div id="pages" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Website Pages</h2>
            <Link
              href="/admin/content/pages/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Page
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Slug</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Updated</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {page.title}
                          </div>
                          {page.metaTitle && (
                            <div className="text-xs text-gray-500">
                              SEO: {page.metaTitle}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-3 h-3 mr-1" />
                        /{page.slug}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          page.status
                        )}`}
                      >
                        {page.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {format(new Date(page.updatedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/content/pages/${page.id}/edit`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blog Posts Section */}
        <div id="blog" className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Blog Posts</h2>
            <Link
              href="/admin/content/blog/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Blog Post
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          post.status
                        )}`}
                      >
                        {post.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Globe className="w-3 h-3" />
                      <span>/blog/{post.slug}</span>
                    </div>

                    {post.excerpt && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {post.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {post.publishedAt
                            ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                            : 'Not published'}
                        </span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span>{post.tags.length} tags</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/content/blog/${post.id}/edit`}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Pages</p>
          <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
          <p className="text-xs text-green-600 mt-1">
            {pages.filter(p => p.status === 'published').length} published
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Blog Posts</p>
          <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
          <p className="text-xs text-green-600 mt-1">
            {blogPosts.filter(p => p.status === 'published').length} published
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Draft Content</p>
          <p className="text-2xl font-bold text-gray-900">
            {pages.filter(p => p.status === 'draft').length +
             blogPosts.filter(p => p.status === 'draft').length}
          </p>
          <p className="text-xs text-gray-600 mt-1">Needs review</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Last Updated</p>
          <p className="text-lg font-bold text-gray-900">
            {pages.length > 0 && pages[0]
              ? format(new Date(pages[0].updatedAt), 'MMM d')
              : 'Never'}
          </p>
          <p className="text-xs text-gray-600 mt-1">Most recent change</p>
        </div>
      </div>
    </div>
  );
}