import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { FileText, ArrowLeft } from 'lucide-react';

interface PromptDetail {
  id: number;
  soal: string;
  pilihan: Record<string, string> | null;
  jawaban: string;
  jawaban_benar: string | null;
  penjelasan: string | null;
  keterangan_tambahan: string | null;
}

// Modifikasi interface Prompt untuk menambahkan hash_id
interface Prompt {
  id: number;
  hash_id: string; // Tambahkan hash_id
  jenjang: { nama: string };
  tipe_soal: { nama: string };
  jumlah_soal: number;
  perintah: string | null;
  status: string;
  result_length: number | null;
  cost_usd: string | null;
  cost_idr: string | null;
  model: string | null;
  created_at: string;
  details: PromptDetail[];
}

// Modifikasi tombol download untuk menggunakan hash_id
{prompt.status === 'completed' && (
  <Link href={route('prompts.download-word', prompt.hash_id)}>
    <Button>
      <FileText className="h-4 w-4 mr-1" />
      Download Word
    </Button>
  </Link>
)}

interface ShowProps {
  prompt: Prompt;
}

export default function Show({ prompt }: ShowProps) {
  return (
    <AppLayout>
      <Head title={`Soal ${prompt.jenjang.nama} - ${prompt.tipe_soal.nama}`} />
      
      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Link href={route('prompts.index')}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Kembali
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold ml-4">
                Soal {prompt.jenjang.nama} - {prompt.tipe_soal.nama}
              </h1>
            </div>
            
            {prompt.status === 'completed' && (
              <Link href={route('prompts.download-word', prompt.id)}>
                <Button>
                  <FileText className="h-4 w-4 mr-1" />
                  Download Word
                </Button>
              </Link>
            )}
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informasi Soal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Jenjang</p>
                  <p>{prompt.jenjang.nama}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Tipe Soal</p>
                  <p>{prompt.tipe_soal.nama}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Jumlah Soal</p>
                  <p>{prompt.jumlah_soal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge
                    variant={prompt.status === 'completed' ? 'success' : 
                           prompt.status === 'failed' ? 'destructive' : 'outline'}
                  >
                    {prompt.status === 'completed' ? 'Selesai' : 
                     prompt.status === 'failed' ? 'Gagal' : 'Menunggu'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Tanggal Dibuat</p>
                  <p>{format(new Date(prompt.created_at), 'dd MMM yyyy HH:mm')}</p>
                </div>
                {prompt.model && (
                  <div>
                    <p className="text-sm font-medium">Model AI</p>
                    <p>{prompt.model}</p>
                  </div>
                )}
                {prompt.result_length && (
                  <div>
                    <p className="text-sm font-medium">Panjang Hasil</p>
                    <p>{prompt.result_length} token</p>
                  </div>
                )}
                {prompt.cost_usd && (
                  <div>
                    <p className="text-sm font-medium">Biaya</p>
                    <p>${prompt.cost_usd} (Rp {prompt.cost_idr})</p>
                  </div>
                )}
              </div>
              
              {prompt.perintah && (
                <div className="mt-4">
                  <p className="text-sm font-medium">Perintah Tambahan</p>
                  <p className="whitespace-pre-line">{prompt.perintah}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {prompt.status === 'completed' && prompt.details.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Daftar Soal</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {prompt.details.map((detail, index) => (
                    <AccordionItem key={detail.id} value={`item-${index}`}>
                      <AccordionTrigger>
                        Soal {index + 1}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium">Pertanyaan:</p>
                            <div className="mt-1" dangerouslySetInnerHTML={{ __html: detail.soal }} />
                          </div>
                          
                          {detail.pilihan && (
                            <div>
                              <p className="font-medium">Pilihan:</p>
                              <div className="mt-1 space-y-1">
                                {Object.entries(detail.pilihan).map(([key, value]) => (
                                  <div key={key} className="flex">
                                    <span className="font-medium mr-2">{key}.</span>
                                    <div dangerouslySetInnerHTML={{ __html: value }} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <p className="font-medium">Jawaban:</p>
                            {detail.jawaban_benar ? (
                              <p className="mt-1">{detail.jawaban_benar}</p>
                            ) : (
                              <div className="mt-1" dangerouslySetInnerHTML={{ __html: detail.jawaban }} />
                            )}
                          </div>
                          
                          {detail.penjelasan && (
                            <div>
                              <p className="font-medium">Pembahasan:</p>
                              <div className="mt-1" dangerouslySetInnerHTML={{ __html: detail.penjelasan }} />
                            </div>
                          )}
                          
                          {detail.keterangan_tambahan && (
                            <div>
                              <p className="font-medium">Keterangan Tambahan:</p>
                              <div className="mt-1" dangerouslySetInnerHTML={{ __html: detail.keterangan_tambahan }} />
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}