import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/pagination';
import { Suspense } from 'react';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
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

interface PaginatedData {
  data: Post[];
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
}

interface Props {
  posts: PaginatedData;
  categories: Category[];
  tags: Tag[];
  filters?: {
    category?: string;
    tag?: string;
    search?: string;
  };
}

export default function BlogIndex({ posts, categories, tags, filters = {} }: Props) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('blog.index'),
      { search, category: filters.category, tag: filters.tag },
      { preserveState: true }
    );
  };

  return (
    <>
      <Head title="Blog - BikinSoal.com">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <meta name="description" content="Blog BikinSoal.com - Artikel dan tips seputar pendidikan dan pembuatan soal" />
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
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Blog</h1>
              <p className="text-gray-600">Artikel dan tips seputar pendidikan dan pembuatan soal</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="relative">
                    
                    <button 
                      type="submit" 
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      aria-label="Cari artikel"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                    </button>
                    
                    
                    <Link 
                      href="/blog" 
                      className="text-sm font-medium text-blue-600 transition-colors"
                      aria-current="page"
                    >
                      Blog
                    </Link>
                    <Input
                      type="search"
                      placeholder="Cari artikel..."
                      className="pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </form>

                {/* Active Filters */}
                {(filters.category || filters.tag) && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {filters.category && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Kategori: {filters.category}
                        <Link href={route('blog.index', { search: filters.search, tag: filters.tag })}>
                          <span className="ml-1 cursor-pointer">×</span>
                        </Link>
                      </Badge>
                    )}
                    {filters.tag && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Tag: {filters.tag}
                        <Link href={route('blog.index', { search: filters.search, category: filters.category })}>
                          <span className="ml-1 cursor-pointer">×</span>
                        </Link>
                      </Badge>
                    )}
                  </div>
                )}

                {/* Blog Posts */}
                
                <Suspense fallback={<div className="py-12 text-center">Memuat artikel...</div>}>
                  {/* Blog Posts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.data.length > 0 ? (
                      posts.data.map((post) => (
                        <Card key={post.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                          
                          {post.thumbnail && (
                            <div className="aspect-video overflow-hidden">
                              <img 
                                src={`storage/${post.thumbnail}`} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                <Link href={route('blog.index', { category: post.category.slug })}>
                                  {post.category.name}
                                </Link>
                              </Badge>
                            </div>
                            <CardTitle className="line-clamp-2">
                              <Link 
                                href={route('blog.show', post.slug)}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {post.title}
                              </Link>
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {new Date(post.published_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })} • {post.user.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <p className="text-gray-600 line-clamp-3">
                              {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Link 
                              href={route('blog.show', post.slug)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                            >
                              Baca selengkapnya
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">Tidak ada artikel yang ditemukan.</p>
                      </div>
                    )}
                  </div>
                </Suspense>

                {/* Pagination */}
                {posts.data.length > 0 && (
                  <div className="mt-8">
                    <Pagination links={posts.links} />
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

// Tambahkan setelah judul halaman
<nav className="flex mb-6" aria-label="Breadcrumb">
  <ol className="inline-flex items-center space-x-1 md:space-x-3">
    <li className="inline-flex items-center">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
        Beranda
      </Link>
    </li>
    <li aria-current="page">
      <div className="flex items-center">
        <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
        </svg>
        <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Blog</span>
      </div>
    </li>
  </ol>
</nav>