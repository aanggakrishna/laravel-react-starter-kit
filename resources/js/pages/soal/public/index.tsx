import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Eye, Filter, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import Pagination from '@/components/pagination';

interface Jenjang {
  id: number;
  nama: string;
  badge_color: string;
}

interface TipeSoal {
  id: number;
  nama: string;
}

interface User {
  id: number;
  name: string;
}

interface Prompt {
  id: number;
  hash_id: string;
  jenjang: Jenjang;
  tipe_soal: TipeSoal;
  jumlah_soal: number;
  perintah: string;
  view_count: number;
  created_at: string;
  user: User;
}

interface PublicIndexProps {
  prompts: {
    data: Prompt[];
    current_page: number;
    last_page: number;
  };
  jenjangs: Jenjang[];
  tipeSoals: TipeSoal[];
  filters: {
    jenjang?: string;
    tipe_soal?: string;
  };
}

export default function PublicIndex({ prompts, jenjangs, tipeSoals, filters }: PublicIndexProps) {
  const [jenjangFilter, setJenjangFilter] = useState<string>(filters.jenjang || 'all');
  const [tipeSoalFilter, setTipeSoalFilter] = useState<string>(filters.tipe_soal || 'all');
  
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
  
  // Fungsi untuk menerapkan filter
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (jenjangFilter && jenjangFilter !== 'all') {
      params.append('jenjang', jenjangFilter);
    }
    
    if (tipeSoalFilter && tipeSoalFilter !== 'all') {
      params.append('tipe_soal', tipeSoalFilter);
    }
    
    window.location.href = `${route('soal.public')}?${params.toString()}`;
  };
  
  // Reset filter
  const resetFilters = () => {
    setJenjangFilter('all');
    setTipeSoalFilter('all');
    window.location.href = route('soal.public');
  };
  
  return (
    <PublicLayout title="Bank Soal Publik" description="Kumpulan soal yang dibagikan untuk umum">
      <div className="bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Bank Soal Publik</h1>
              <p className="text-gray-500 mt-1">Kumpulan soal yang dibagikan untuk umum</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={jenjangFilter} onValueChange={setJenjangFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Pilih Jenjang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenjang</SelectItem>
                    {jenjangs.map((jenjang) => (
                      <SelectItem key={jenjang.id} value={jenjang.nama}>
                        {jenjang.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={tipeSoalFilter} onValueChange={setTipeSoalFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Pilih Tipe Soal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {tipeSoals.map((tipeSoal) => (
                      <SelectItem key={tipeSoal.id} value={tipeSoal.nama}>
                        {tipeSoal.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={applyFilters} className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                
                {(jenjangFilter !== 'all' || tipeSoalFilter !== 'all') && (
                  <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Grid layout untuk soal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.data.length > 0 ? (
              prompts.data.map((prompt) => (
                <Link key={prompt.id} href={route('soal.public.show', prompt.hash_id)}>
                  <Card className="h-full hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant={getBadgeVariant(prompt.jenjang.nama) as any} className="mb-2">
                          {prompt.jenjang.nama}
                        </Badge>
                        <Badge variant="outline">{prompt.tipe_soal.nama}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg line-clamp-2 text-blue-600">
                        {prompt.perintah || `Soal ${prompt.tipe_soal.nama} - ${prompt.jenjang.nama}`}
                      </h3>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-500 line-clamp-3">
                        {prompt.perintah || `Kumpulan ${prompt.jumlah_soal} soal ${prompt.tipe_soal.nama} untuk jenjang ${prompt.jenjang.nama}`}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {prompt.user.name}
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="font-medium">{prompt.jumlah_soal}</span> Soal
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {prompt.view_count}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Belum ada soal publik yang tersedia.</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {prompts.last_page > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination links={prompts.links} />
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}