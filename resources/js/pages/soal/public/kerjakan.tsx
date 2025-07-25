import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface PromptDetail {
  id: number;
  soal: string;
  pilihan: Record<string, string> | null;
}

interface Prompt {
  id: number;
  hash_id: string;
  jenjang: { nama: string };
  tipe_soal: { nama: string };
  perintah: string | null;
  jumlah_soal: number;
  waktu_pengerjaan: number;
  details: PromptDetail[];
  user: { name: string };
}

interface KerjakanProps {
  prompt: Prompt;
  kerja_id: number;
  is_authenticated: boolean;
}

export default function Kerjakan({ prompt, kerja_id, is_authenticated }: KerjakanProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({}); 
  const [timeLeft, setTimeLeft] = useState<number>(prompt.waktu_pengerjaan * 60); // Waktu dalam detik
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Format waktu tersisa
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
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
  
  // Fungsi untuk menyimpan jawaban
  const saveAnswer = async (promptDetailId: number, answer: string) => {
    try {
      if (is_authenticated) {
        await axios.post(route('soal.save-answer'), {
          kerja_id,
          prompt_detail_id: promptDetailId,
          jawaban: answer,
        });
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };
  
  // Fungsi untuk menangani perubahan jawaban
  const handleAnswerChange = (promptDetailId: number, answer: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [promptDetailId]: answer };
      saveAnswer(promptDetailId, answer);
      return newAnswers;
    });
  };
  
  // Fungsi untuk submit jawaban
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await axios.post(route('soal.submit'), {
        kerja_id,
      });
      
      // Redirect ke halaman hasil
      router.visit(route('soal.hasil', { kerja_id }));
    } catch (error) {
      console.error('Error submitting answers:', error);
      setIsSubmitting(false);
    }
  };
  
  // Timer untuk waktu pengerjaan
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Cek apakah semua soal sudah dijawab
  const allAnswered = prompt.details.every(detail => answers[detail.id]);
  
  return (
    <PublicLayout title={`Kerjakan Soal ${prompt.jenjang.nama} - ${prompt.tipe_soal.nama}`} description={prompt.perintah || `Soal ${prompt.tipe_soal.nama} untuk jenjang ${prompt.jenjang.nama}`}>
      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href={route('soal.public')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
            </Link>
            
            <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-md">
              <Clock className="h-4 w-4 mr-2 text-yellow-600" />
              <span className="font-medium text-yellow-600">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <Card className="mb-6 border border-gray-200">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={getBadgeVariant(prompt.jenjang.nama) as any}>
                  {prompt.jenjang.nama}
                </Badge>
                <Badge variant="outline">{prompt.tipe_soal.nama}</Badge>
              </div>
              
              <CardTitle className="text-2xl text-blue-600">
                {prompt.perintah || `Soal ${prompt.tipe_soal.nama} - ${prompt.jenjang.nama}`}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-8">
                {prompt.details.map((detail, index) => (
                  <div key={detail.id} className="p-4 border rounded-lg bg-white">
                    <div className="mb-4">
                      <h3 className="font-medium text-lg mb-2">Soal {index + 1}</h3>
                      <div className="bg-gray-50 p-4 rounded-md">{detail.soal}</div>
                    </div>
                    
                    {detail.pilihan && (
                      <div>
                        <h4 className="font-medium mb-2">Pilihan Jawaban:</h4>
                        <div className="space-y-2">
                          {Object.entries(detail.pilihan).map(([key, value]) => (
                            <div 
                              key={key} 
                              className={`flex items-start space-x-2 p-3 rounded-md cursor-pointer transition-colors ${answers[detail.id] === key ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
                              onClick={() => handleAnswerChange(detail.id, key)}
                            >
                              <div className="flex-1">
                                <span className="font-medium">{key}.</span> {value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleSubmit} 
                  disabled={!is_authenticated && !allAnswered || isSubmitting}
                  className="px-8"
                >
                  {isSubmitting ? 'Memproses...' : 'Selesai'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}