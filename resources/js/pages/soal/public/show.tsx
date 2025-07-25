import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ArrowLeft, Eye, User, Calendar, Download, Play, Share2, Trophy, Users, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface PromptDetail {
  id: number;
  soal: string;
  pilihan: Record<string, string> | null;
  jawaban: string;
  jawaban_benar: string | null;
  penjelasan: string | null;
  keterangan_tambahan: string | null;
}

interface Prompt {
  id: number;
  hash_id: string;
  jenjang: { nama: string };
  tipe_soal: { nama: string };
  jumlah_soal: number;
  perintah: string | null;
  status: string;
  view_count: number;
  created_at: string;
  details: PromptDetail[];
  user: { name: string };
  waktu_pengerjaan: number;
}

interface TopUser {
  name: string;
  nilai: number;
}

interface PublicShowProps {
  prompt: Prompt;
  auth: {
    user: any;
  };
  shortlink: {
    code: string;
    url: string;
    click_count: number;
  };
  stats: {
    topUsers: TopUser[];
    totalUsers: number;
  };
}

export default function PublicShow({ prompt, auth, shortlink, stats }: PublicShowProps) {
  const [isCopied, setIsCopied] = useState(false);
  
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
  
  const isLoggedIn = auth.user !== null;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortlink.url);
    setIsCopied(true);
    toast({
      title: "Link berhasil disalin!",
      description: "Link telah disalin ke clipboard.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  return (
    <PublicLayout title={`Soal ${prompt.jenjang.nama} - ${prompt.tipe_soal.nama}`} description={prompt.perintah || `Soal ${prompt.tipe_soal.nama} untuk jenjang ${prompt.jenjang.nama}`}>
      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <Link href={route('soal.public')}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
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
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {prompt.user.name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {format(new Date(prompt.created_at), 'dd MMM yyyy')}
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {prompt.view_count} kali dilihat
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {prompt.perintah && (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Perintah:</h3>
                        <div className="bg-gray-50 p-4 rounded-md">{prompt.perintah}</div>
                      </div>
                    )}
                    
                    <h3 className="font-medium">Daftar Soal:</h3>
                    <div className="space-y-6">
                      {prompt.details.map((detail, index) => (
                        <div key={detail.id} className="p-4 border rounded-lg bg-white">
                          <div className="mb-4">
                            <h3 className="font-medium text-lg mb-2">Soal {index + 1}</h3>
                            <div className="bg-gray-50 p-4 rounded-md">{detail.soal}</div>
                          </div>
                          
                          {detail.pilihan && (
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">Pilihan:</h4>
                              <div className="space-y-2">
                                {Object.entries(detail.pilihan).map(([key, value]) => (
                                  <div key={key} className="flex gap-2 p-2 hover:bg-gray-50 rounded-md">
                                    <div className="font-medium">{key}.</div>
                                    <div>{value}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Action Buttons */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Aksi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Link href={route('soal.kerjakan', prompt.hash_id)} className="w-full">
                      <Button className="w-full" size="lg">
                        <Play className="h-4 w-4 mr-2" />
                        Kerjakan Soal
                      </Button>
                    </Link>
                    
                    <Button variant="outline" className="w-full" onClick={copyToClipboard}>
                      <Share2 className="h-4 w-4 mr-2" />
                      {isCopied ? 'Tersalin!' : 'Bagikan'}
                    </Button>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      <div className="flex items-center justify-between">
                        <span>Short URL:</span>
                        <a href={shortlink.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                          {shortlink.url.split('/').pop()}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <div className="mt-1">
                        <span>{shortlink.click_count} klik</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Top Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                      Top 5 Nilai Terbaik
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.topUsers.length > 0 ? (
                      <div className="space-y-2">
                        {stats.topUsers.map((user, index) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                            <div className="flex items-center">
                              <span className="font-medium mr-2">{index + 1}.</span>
                              <span>{user.name}</span>
                            </div>
                            <Badge variant={index === 0 ? 'default' : 'outline'}>
                              {user.nilai}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Belum ada yang mengerjakan
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistik</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Total Pengerjaan</span>
                        </div>
                        <Badge variant="outline">{stats.totalUsers}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-purple-500" />
                          <span>Total Dilihat</span>
                        </div>
                        <Badge variant="outline">{prompt.view_count}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}