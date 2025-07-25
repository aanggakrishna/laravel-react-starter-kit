import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Calendar, User, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  header_image?: string;
  published_at: string;
  user: {
    name: string;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: {
    id: number;
    name: string;
    slug: string;
  }[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
}

interface Props {
  post: Post;
  relatedPosts: Post[];
  categories: Category[];
  tags: Tag[];
}

export default function BlogShow({ post, relatedPosts, categories, tags }: Props) {
  return (
    <>
      <Head>
        <title>{post.title} - Blog BikinSoal.com</title>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <meta name="description" content={post.content.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <meta name="keywords" content={`${post.category.name}, ${post.tags.map(tag => tag.name).join(', ')}, bikinsoal, pendidikan`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={route('blog.show', post.slug)} />
        {post.header_image && <meta property="og:image" content={post.header_image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:author" content={post.user.name} />
        <link rel="canonical" href={route('blog.show', post.slug)} />
      </Head>
      
      <div className="flex min-h-screen flex-col bg-white text-gray-900">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <img src="/logo_v1_wobg.png" alt="BikinSoal Logo" className="h-10 w-10" />
              <span className="text-xl font-bold text-blue-600">BikinSoal</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Beranda</Link>
              <Link href="/blog" className="text-sm font-medium text-blue-600 transition-colors">Blog</Link>
              <Link href="/soal" className="text-sm font-medium hover:text-blue-600 transition-colors">Soal</Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link
                href={route('login')}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href={route('register')}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Daftar
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-6">
              <Link 
                href={route('blog.index')} 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali ke Blog
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <article className="bg-white rounded-lg overflow-hidden">
                  {post.header_image && (
                    <div className="aspect-[21/9] overflow-hidden">
                      <img 
                        src={post.header_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-2 sm:p-6">
                    <div className="mb-4">
                      <Link 
                        href={route('blog.index', { category: post.category.slug })}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {post.category.name}
                      </Link>
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-8">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.published_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {post.user.name}
                      </div>
                    </div>
                    
                    <div 
                      className="prose prose-blue max-w-none mb-8"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    
                    {post.tags.length > 0 && (
                      <div className="flex items-center flex-wrap gap-2 mt-8 pt-6 border-t">
                        <Tag className="h-4 w-4 text-gray-500" />
                        {post.tags.map((tag) => (
                          <Link key={tag.id} href={route('blog.index', { tag: tag.slug })}>
                            <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">
                              {tag.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Artikel Terkait</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {relatedPosts.map((relatedPost) => (
                        <Card key={relatedPost.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg line-clamp-2">
                              <Link 
                                href={route('blog.show', relatedPost.slug)}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {relatedPost.title}
                              </Link>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 text-sm line-clamp-3">
                              {relatedPost.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Link 
                              href={route('blog.show', relatedPost.slug)}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              Baca selengkapnya
                            </Link>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Kategori</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex justify-between items-center">
                        <Link 
                          href={route('blog.index', { category: category.slug })}
                          className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          {category.name}
                        </Link>
                        <Badge variant="secondary">{category.posts_count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Tag</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link key={tag.id} href={route('blog.index', { tag: tag.slug })}>
                        <Badge variant="outline" className="hover:bg-blue-50 cursor-pointer">
                          {tag.name} ({tag.posts_count})
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <img src="/logo_v1_wobg.png" alt="BikinSoal Logo" className="h-10 w-10" />
                  <span className="text-xl font-bold text-white">BikinSoal</span>
                </div>
                <p className="text-sm text-gray-400">
                  Platform pembuatan soal online terbaik untuk guru dan pendidik.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Produk</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Fitur</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Harga</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Bank Soal</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Ujian Online</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Perusahaan</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Tentang Kami</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Blog</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Karir</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Kontak</a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Bantuan</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Pusat Bantuan</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">FAQ</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Kebijakan Privasi</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-white">Syarat & Ketentuan</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-gray-800 pt-8">
              <p className="text-center text-sm text-gray-400">
                &copy; {new Date().getFullYear()} BikinSoal.com. Hak Cipta Dilindungi.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// Tambahkan di dalam komponen BlogShow, sebelum return statement
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "datePublished": post.published_at,
  "author": {
    "@type": "Person",
    "name": post.user.name
  },
  "publisher": {
    "@type": "Organization",
    "name": "BikinSoal.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bikinsoal.com/logo_v1_wobg.png"
    }
  },
  "description": post.content.replace(/<[^>]*>/g, '').substring(0, 160),
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": route('blog.show', post.slug)
  }
};

// Tambahkan di dalam return statement, setelah tag Head
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
/>