import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface Jenjang {
  id: number;
  nama: string;
}

interface TipeSoal {
  id: number;
  nama: string;
}

interface CreateProps {
  jenjangs: Jenjang[];
  tipeSoals: TipeSoal[];
}

export default function Create({ jenjangs, tipeSoals }: CreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    jenjang_id: '',
    tipe_soal_id: '',
    jumlah_soal: '5',
    perintah: '',
    is_public: false, // Tambahkan field is_public
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('prompts.store'));
  };

  return (
    <AppLayout>
      <Head title="Buat Soal AI" />
      
      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Buat Soal AI</CardTitle>
              <CardDescription>
                Buat soal baru menggunakan AI. Soal akan dibuat berdasarkan jenjang, tipe soal, dan perintah yang Anda berikan.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jenjang_id">Jenjang</Label>
                  <Select 
                    value={data.jenjang_id} 
                    onValueChange={(value) => setData('jenjang_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenjang" />
                    </SelectTrigger>
                    <SelectContent>
                      {jenjangs.map((jenjang) => (
                        <SelectItem key={jenjang.id} value={jenjang.id.toString()}>
                          {jenjang.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jenjang_id && <p className="text-sm text-red-500">{errors.jenjang_id}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tipe_soal_id">Tipe Soal</Label>
                  <Select 
                    value={data.tipe_soal_id} 
                    onValueChange={(value) => setData('tipe_soal_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe soal" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipeSoals.map((tipeSoal) => (
                        <SelectItem key={tipeSoal.id} value={tipeSoal.id.toString()}>
                          {tipeSoal.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tipe_soal_id && <p className="text-sm text-red-500">{errors.tipe_soal_id}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jumlah_soal">Jumlah Soal</Label>
                  <Input
                    id="jumlah_soal"
                    type="number"
                    min="1"
                    max="20"
                    value={data.jumlah_soal}
                    onChange={(e) => setData('jumlah_soal', e.target.value)}
                  />
                  {errors.jumlah_soal && <p className="text-sm text-red-500">{errors.jumlah_soal}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="perintah">Perintah Tambahan</Label>
                  <Textarea
                    id="perintah"
                    placeholder="Tambahkan detail spesifik untuk soal yang ingin dibuat, misalnya: tentang Teorema Pythagoras, dengan tingkat kesulitan sedang, dll."
                    value={data.perintah}
                    onChange={(e) => setData('perintah', e.target.value)}
                    rows={5}
                  />
                  {errors.perintah && <p className="text-sm text-red-500">{errors.perintah}</p>}
                </div>
                
                {/* Tambahkan checkbox untuk is_public */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_public" 
                    checked={data.is_public} 
                    onCheckedChange={(checked) => setData('is_public', checked as boolean)}
                  />
                  <div>
                    <Label htmlFor="is_public" className="font-medium">Jadikan soal publik</Label>
                    <p className="text-sm text-gray-500">
                      Soal publik dapat dilihat oleh pengguna lain dan hanya menggunakan setengah kredit (dibulatkan ke atas).
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Memproses...' : 'Buat Soal'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}