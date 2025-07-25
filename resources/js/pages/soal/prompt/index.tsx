import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye, FileText, Plus } from 'lucide-react';

interface Prompt {
  id: number;
  jenjang: { nama: string };
  tipe_soal: { nama: string };
  jumlah_soal: number;
  status: string;
  created_at: string;
}

interface IndexProps {
  prompts: {
    data: Prompt[];
    current_page: number;
    last_page: number;
  };
}

export default function Index({ prompts }: IndexProps) {
  return (
    <AppLayout>
      <Head title="Soal AI" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Soal AI</h1>
            <Link href={route('prompts.create')}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat Soal Baru
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Daftar Soal</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenjang</TableHead>
                    <TableHead>Tipe Soal</TableHead>
                    <TableHead>Jumlah Soal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prompts.data.length > 0 ? (
                    prompts.data.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell>{prompt.jenjang.nama}</TableCell>
                        <TableCell>{prompt.tipe_soal.nama}</TableCell>
                        <TableCell>{prompt.jumlah_soal}</TableCell>
                        <TableCell>
                          <Badge
                            variant={prompt.status === 'completed' ? 'success' : 
                                   prompt.status === 'failed' ? 'destructive' : 'outline'}
                          >
                            {prompt.status === 'completed' ? 'Selesai' : 
                             prompt.status === 'failed' ? 'Gagal' : 'Menunggu'}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(prompt.created_at), 'dd MMM yyyy HH:mm')}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={route('prompts.show', prompt.hash_id)}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Lihat
                              </Button>
                            </Link>
                            {prompt.status === 'completed' && (
                              <Link href={route('prompts.download-word', prompt.id)}>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </Link>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Belum ada soal. Buat soal pertama Anda!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination can be added here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}