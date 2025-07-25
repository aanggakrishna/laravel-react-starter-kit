import { Head, Link } from '@inertiajs/react';
import { PermissionGate } from '@/components/permission-gate';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface TipeSoal {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

export default function Index({ tipeSoals }: { tipeSoals: TipeSoal[] }) {
    return (
        <AppLayout>
            <Head title="Tipe Soal" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Tipe Soal</h1>
                        <Link href={route('tipe-soals.create')}>
                            <Button>Tambah Tipe Soal Baru</Button>
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tipeSoals.length > 0 ? (
                            tipeSoals.map((tipeSoal) => (
                                <Card key={tipeSoal.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>
                                                    <Link 
                                                        href={route('tipe-soals.show', tipeSoal.id)}
                                                        className="hover:underline"
                                                    >
                                                        {tipeSoal.nama}
                                                    </Link>
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Link href={route('tipe-soals.edit', tipeSoal.id)}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Link href={route('tipe-soals.show', tipeSoal.id)}>
                                            <Button size="sm">Lihat</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <Card className="col-span-full">
                                <CardContent className="py-10 text-center">
                                    <p className="text-muted-foreground">Belum ada tipe soal. Buat tipe soal pertama Anda!</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}