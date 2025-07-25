import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye, Clock, CheckCircle, XCircle, Share2, Copy, Check } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface KerjaDetail {
  id: number;
  is_correct: boolean;
}

interface Kerja {
  id: number;
  prompt: {
    id: number;
    hash_id: string;
    jenjang: { nama: string };
    tipe_soal: { nama: string };
    jumlah_soal: number;
    perintah: string | null; // Tambahkan properti perintah
  };
  nilai: number;
  waktu_mulai: string;
  waktu_selesai: string;
  details: KerjaDetail[];
}

interface RiwayatProps {
  kerjas: {
    data: Kerja[];
    current_page: number;
    last_page: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Riwayat Pengerjaan Soal',
    href: '/soal/riwayat',
  },
];

export default function Riwayat({ kerjas }: RiwayatProps) {
  // State untuk menyimpan status copied
  const [copied, setCopied] = useState<Record<number, boolean>>({});
  
  // Fungsi untuk menghitung durasi pengerjaan
  const hitungDurasi = (waktuMulai: string, waktuSelesai: string) => {
    const mulai = new Date(waktuMulai);
    const selesai = new Date(waktuSelesai);
    const durasiMilidetik = selesai.getTime() - mulai.getTime();
    
    // Konversi ke menit dan detik
    const menit = Math.floor(durasiMilidetik / 60000);
    const detik = Math.floor((durasiMilidetik % 60000) / 1000);
    
    return `${menit} menit ${detik} detik`;
  };
  
  // Fungsi untuk mendapatkan warna badge berdasarkan nilai
  const getBadgeVariant = (nilai: number) => {
    if (nilai >= 80) return 'success';
    if (nilai >= 60) return 'warning';
    return 'destructive';
  };
  
  // Fungsi untuk menyalin teks ke clipboard
  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [id]: true });
      setTimeout(() => {
        setCopied({ ...copied, [id]: false });
      }, 2000);
    });
  };
  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Riwayat Pengerjaan Soal" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Riwayat Pengerjaan Soal</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daftar Soal yang Telah Dikerjakan</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenjang</TableHead>
                    <TableHead>Tipe Soal</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Soal Benar</TableHead>
                    <TableHead>Soal Salah</TableHead>
                    <TableHead>Durasi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kerjas.data.length > 0 ? (
                    kerjas.data.map((kerja) => {
                      // Hitung jumlah soal benar dan salah
                      const soalBenar = kerja.details.filter(detail => detail.is_correct).length;
                      const soalSalah = kerja.details.length - soalBenar;
                      
                      // Buat URL untuk share
                      const fullUrl = `${window.location.origin}/soal/hasil/${kerja.id}`;
                      const shortUrl = `${window.location.origin}/s/${kerja.id}`;
                      
                      return (
                        <TableRow key={kerja.id}>
                          <TableCell>{kerja.prompt.jenjang.nama}</TableCell>
                          <TableCell>{kerja.prompt.tipe_soal.nama}</TableCell>
                          <TableCell>{kerja.prompt.perintah || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={getBadgeVariant(kerja.nilai)}>
                              {kerja.nilai}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {soalBenar}
                            </div>
                          </TableCell>
                          <TableCell className="text-red-600 font-medium">
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 mr-1" />
                              {soalSalah}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {hitungDurasi(kerja.waktu_mulai, kerja.waktu_selesai)}
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(kerja.waktu_mulai), 'dd MMM yyyy HH:mm')}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Link href={route('soal.hasil', kerja.id)}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Detail
                                </Button>
                              </Link>
                              
                              {/* Tambahkan tombol Share */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-1" />
                                    Share
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Bagikan Hasil Pengerjaan Soal</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Link:</p>
                                      <div className="flex">
                                        <Input 
                                          value={fullUrl} 
                                          readOnly 
                                          className="flex-1 mr-2" 
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <p className="text-sm font-medium">Shortlink:</p>
                                      <div className="flex">
                                        <Input 
                                          value={shortUrl} 
                                          readOnly 
                                          className="flex-1 mr-2" 
                                        />
                                        <Button 
                                          onClick={() => copyToClipboard(shortUrl, kerja.id)}
                                          size="sm"
                                        >
                                          {copied[kerja.id] ? (
                                            <>
                                              <Check className="h-4 w-4 mr-1" />
                                              Copied
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="h-4 w-4 mr-1" />
                                              Copy
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        Belum ada soal yang dikerjakan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}