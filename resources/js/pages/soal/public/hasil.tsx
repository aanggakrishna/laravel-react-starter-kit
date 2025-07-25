import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, Download, Check, X, Clock, Award, Calendar } from 'lucide-react';

interface KerjaDetail {
  id: number;
  soal: string;
  pilihan: Record<string, string> | null;
  jawaban: string;
  jawaban_benar: string | null;
  penjelasan: string | null;
  keterangan_tambahan: string | null;
  jawaban_user: string | null;
  is_correct: boolean;
}

interface Prompt {
  id: number;
  hash_id: string;
  jenjang: { nama: string };
  tipe_soal: { nama: string };
  perintah: string | null;
  user: { name: string };
}

interface Kerja {
  id: number;
  waktu_mulai: string;
  waktu_selesai: string;
  nilai: number;
  details: KerjaDetail[];
}

interface HasilProps {
  prompt: Prompt;
  kerja: Kerja;
}

export default function Hasil({ prompt, kerja }: HasilProps) {
  // Fungsi untuk mendapatkan warna badge berdasarkan jenjang
  const getBadgeVariant = (jenjangNama: string) => {
    const colorMap: Record<string, string> = {
      'SD': 'green',
      'SMP': 'blue',
      'SMA': 'purple',
      'Perguruan Tinggi': 'orange',
      'Umum': 'slate'
    };
    
    return colorMap[jenjangNama] || 'slate';
  };
  
  // Fungsi untuk mendapatkan warna badge berdasarkan nilai
  const getNilaiBadgeVariant = (nilai: number) => {
    if (nilai >= 80) return 'success';
    if (nilai >= 60) return 'warning';
    return 'destructive';
  };
  
  // Hitung durasi pengerjaan
  const durasiPengerjaan = () => {
    const start = new Date(kerja.waktu_mulai);
    const end = new Date(kerja.waktu_selesai);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes} menit ${seconds} detik`;
  };
  
  return (
    <PublicLayout title={`Hasil Pengerjaan Soal ${prompt.jenjang.nama} - ${prompt.tipe_soal.nama}`} description={prompt.perintah || `Hasil pengerjaan soal ${prompt.tipe_soal.nama} untuk jenjang ${prompt.jenjang.nama}`}>
      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href={route('soal.public')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
            </Link>
            
            <Link href={route('soal.download', kerja.id)}>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download Word
              </Button>
            </Link>
          </div>
          
          {/* Card Hasil Penilaian */}
          <Card className="mb-6 border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-center text-blue-600">
                Hasil Penilaian
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-sm text-gray-500 mb-1">Nilai</div>
                  <div className="text-3xl font-bold text-blue-600">{kerja.nilai}</div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-sm text-gray-500 mb-1">Waktu Pengerjaan</div>
                  <div className="text-xl font-medium text-green-600">{durasiPengerjaan()}</div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm text-gray-500 mb-1">Tanggal Selesai</div>
                  <div className="text-xl font-medium text-purple-600">{format(new Date(kerja.waktu_selesai), 'dd MMM yyyy HH:mm')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Card Detail Soal */}
          <Card className="mb-6 border border-gray-200">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={getBadgeVariant(prompt.jenjang.nama) as any}>
                  {prompt.jenjang.nama}
                </Badge>
                <Badge variant="outline">{prompt.tipe_soal.nama}</Badge>
              </div>
              
              <CardTitle className="text-2xl text-blue-600">
                {prompt.perintah || `Review Jawaban - ${prompt.tipe_soal.nama} ${prompt.jenjang.nama}`}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-8">
                {kerja.details.map((detail, index) => (
                  <div key={detail.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-lg">Soal {index + 1}</h3>
                      {detail.is_correct ? (
                        <Badge variant="success" className="flex items-center">
                          <Check className="h-3 w-3 mr-1" /> Benar
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center">
                          <X className="h-3 w-3 mr-1" /> Salah
                        </Badge>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <div className="bg-gray-50 p-4 rounded-md">{detail.soal}</div>
                    </div>
                    
                    {detail.pilihan && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Pilihan Jawaban:</h4>
                        <div className="space-y-2">
                          {Object.entries(detail.pilihan).map(([key, value]) => {
                            const isUserAnswer = detail.jawaban_user === key;
                            const isCorrectAnswer = detail.jawaban_benar === key;
                            
                            let bgColor = '';
                            let borderColor = '';
                            
                            if (isUserAnswer && isCorrectAnswer) {
                              bgColor = 'bg-green-50';
                              borderColor = 'border-green-300';
                            } else if (isUserAnswer && !isCorrectAnswer) {
                              bgColor = 'bg-red-50';
                              borderColor = 'border-red-300';
                            } else if (isCorrectAnswer) {
                              bgColor = 'bg-green-50';
                              borderColor = 'border-green-200';
                            }
                            
                            return (
                              <div 
                                key={key} 
                                className={`flex items-start p-3 rounded-md border ${bgColor} ${borderColor}`}
                              >
                                <div className="flex-1">
                                  <span className="font-medium">{key}.</span> {value}
                                  {isUserAnswer && (
                                    <Badge variant={isCorrectAnswer ? "success" : "destructive"} className="ml-2">
                                      {isCorrectAnswer ? "Jawaban Anda (Benar)" : "Jawaban Anda (Salah)"}
                                    </Badge>
                                  )}
                                  {!isUserAnswer && isCorrectAnswer && (
                                    <Badge variant="success" className="ml-2">Jawaban Benar</Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {detail.penjelasan && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Pembahasan:</h4>
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">{detail.penjelasan}</div>
                      </div>
                    )}
                    
                    {detail.keterangan_tambahan && (
                      <div>
                        <h4 className="font-medium mb-2">Keterangan Tambahan:</h4>
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">{detail.keterangan_tambahan}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}