import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { type SharedData } from '@/types';

interface PublicLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export default function PublicLayout({ children, title, description }: PublicLayoutProps) {
  const { auth } = usePage<SharedData>().props;

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <img src="/logo_v1_wobg.png" alt="BikinSoal Logo" className="h-10 w-10" />
            </Link>
            <span className="text-xl font-bold text-blue-600">BikinSoal</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Beranda</Link>
            <Link href="/blog" className="text-sm font-medium hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/soal" className="text-sm font-medium hover:text-blue-600 transition-colors">Soal</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            {auth.user ? (
              <Link
                href={route('dashboard')}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Dashboard
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Head title={title}>
          {description && <meta name="description" content={description} />}
        </Head>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <img src="/logo_v1_wobg.png" alt="BikinSoal Logo" className="h-8 w-8" />
              <span className="text-lg font-semibold text-blue-600">BikinSoal</span>
            </div>
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BikinSoal. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}