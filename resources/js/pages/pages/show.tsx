import { Head } from '@inertiajs/react';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  published_at: string;
  user: {
    name: string;
  };
}

interface Props {
  page: Page;
}

export default function ShowPage({ page }: Props) {
  return (
    <>
      <Head>
        <title>{page.meta_title || page.title}</title>
        {page.meta_description && (
          <meta name="description" content={page.meta_description} />
        )}
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <a href="/" className="text-xl font-bold text-blue-600">
                  BikinSoal.com
                </a>
                <nav className="hidden md:flex items-center gap-6">
                  <a href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</a>
                  <a href="/blog" className="text-sm font-medium hover:text-blue-600 transition-colors">Blog</a>
                  <a href="/soal" className="text-sm font-medium hover:text-blue-600 transition-colors">Soal</a>
                </nav>
              </div>
              
              <div className="flex items-center gap-4">
                <a
                  href={route('login')}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Masuk
                </a>
                <a
                  href={route('register')}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Daftar
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <article className="bg-white rounded-lg shadow-sm p-8">
                <header className="mb-8">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {page.title}
                  </h1>
                  <div className="text-sm text-gray-500">
                    Published by {page.user.name} on {new Date(page.published_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </header>
                
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </article>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <p>&copy; 2024 BikinSoal.com. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}