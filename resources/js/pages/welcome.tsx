import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, BookOpen, PenTool, Users, Award, ChevronRight } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="BikinSoal.com - Platform Pembuatan Soal Online">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta name="description" content="BikinSoal.com - Platform pembuatan soal online terbaik untuk guru dan pendidik" />
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
                    {/* Hero Section */}
                    <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
                                <div className="flex flex-col justify-center space-y-4">
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-blue-600">
                                            Buat Soal Ujian dengan Mudah dan Cepat
                                        </h1>
                                        <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                            Platform pembuatan soal online terbaik untuk guru dan pendidik. Buat, kelola, dan bagikan soal ujian dengan mudah.
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                        <Link href={route('register')}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                                Mulai Sekarang
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href="#fitur">
                                            <Button variant="outline">
                                                Pelajari Fitur
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex justify-center lg:justify-end">
                                    <img
                                        src="/logo_v1.png"
                                        alt="BikinSoal Hero"
                                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                                        width={500}
                                        height={310}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="fitur" className="py-20 bg-white">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
                                        Fitur Unggulan
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                        Solusi Lengkap untuk Pembuatan Soal
                                    </h2>
                                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                        BikinSoal.com menyediakan berbagai fitur untuk memudahkan pembuatan dan pengelolaan soal ujian
                                    </p>
                                </div>
                            </div>
                            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
                                <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                        <PenTool className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold">Pembuat Soal Intuitif</h3>
                                    <p className="text-sm text-gray-500">
                                        Editor soal yang mudah digunakan dengan dukungan berbagai jenis soal: pilihan ganda, esai, dan lainnya.
                                    </p>
                                </div>
                                <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold">Bank Soal</h3>
                                    <p className="text-sm text-gray-500">
                                        Simpan dan kelola ribuan soal dalam bank soal yang terorganisir berdasarkan kategori dan tingkat kesulitan.
                                    </p>
                                </div>
                                <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold">Kolaborasi Tim</h3>
                                    <p className="text-sm text-gray-500">
                                        Bekerja sama dengan rekan guru untuk membuat dan mengedit soal secara bersamaan.
                                    </p>
                                </div>
                                <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                                        <Award className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold">Analisis Hasil</h3>
                                    <p className="text-sm text-gray-500">
                                        Dapatkan wawasan mendalam tentang performa siswa dengan analisis hasil ujian yang komprehensif.
                                    </p>
                                </div>
                                <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold">Penilaian Otomatis</h3>
                                    <p className="text-sm text-gray-500">
                                        Hemat waktu dengan penilaian otomatis untuk soal pilihan ganda dan jawaban singkat.
                                    </p>
                                </div>
                                <div className="flex flex-col items-start gap-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                                    <div className="rounded-full bg-orange-100 p-2 text-orange-600">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-lg font-bold">Ekspor & Cetak</h3>
                                    <p className="text-sm text-gray-500">
                                        Ekspor soal dalam berbagai format (PDF, Word) dan cetak dengan mudah untuk ujian offline.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section className="py-20 bg-gray-50">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
                                        Paket Harga
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                                        Pilih Paket yang Sesuai Kebutuhan Anda
                                    </h2>
                                    <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                        Kami menawarkan berbagai paket dengan fitur yang berbeda untuk memenuhi kebutuhan Anda
                                    </p>
                                </div>
                            </div>
                            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
                                {/* Basic Plan */}
                                <Card className="flex flex-col border-2 border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Basic</CardTitle>
                                        <CardDescription>Untuk pengajar individu</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-3xl font-bold">Gratis</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>100 soal per bulan</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>5 ujian aktif</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Ekspor PDF</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Analisis dasar</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="outline">
                                            Mulai Gratis
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Pro Plan */}
                                <Card className="flex flex-col border-2 border-blue-600 shadow-lg relative">
                                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                                        Populer
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-xl">Pro</CardTitle>
                                        <CardDescription>Untuk pengajar profesional</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-3xl font-bold">Rp 99.000</span>
                                            <span className="text-sm text-gray-500">/bulan</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Soal tidak terbatas</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>50 ujian aktif</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Ekspor PDF & Word</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Analisis lanjutan</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Bank soal premium</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Dukungan prioritas</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                            Berlangganan Sekarang
                                        </Button>
                                    </CardFooter>
                                </Card>

                                {/* Enterprise Plan */}
                                <Card className="flex flex-col border-2 border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Enterprise</CardTitle>
                                        <CardDescription>Untuk institusi pendidikan</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-3xl font-bold">Rp 499.000</span>
                                            <span className="text-sm text-gray-500">/bulan</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Semua fitur Pro</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Ujian tidak terbatas</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Manajemen pengguna</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Integrasi API</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Pelatihan & onboarding</span>
                                            </li>
                                            <li className="flex items-center">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Dukungan 24/7</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button className="w-full" variant="outline">
                                            Hubungi Kami
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </section>
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