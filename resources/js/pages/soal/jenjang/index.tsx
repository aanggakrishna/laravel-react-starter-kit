import { Head, Link } from '@inertiajs/react';
import { PermissionGate } from '@/components/permission-gate';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface Jenjang {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

export default function Index({ jenjangs }: { jenjangs: Jenjang[] }) {
    return (
        <AppLayout>
            <Head title="Jenjang" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Jenjang</h1>
                        <Link href={route('jenjangs.create')}>
                            <Button>Tambah Jenjang Baru</Button>
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jenjangs.length > 0 ? (
                            jenjangs.map((jenjang) => (
                                <Card key={jenjang.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>
                                                    <Link 
                                                        href={route('jenjangs.show', jenjang.id)}
                                                        className="hover:underline"
                                                    >
                                                        {jenjang.nama}
                                                    </Link>
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Link href={route('jenjangs.edit', jenjang.id)}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Link href={route('jenjangs.show', jenjang.id)}>
                                            <Button size="sm">Lihat</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <Card className="col-span-full">
                                <CardContent className="py-10 text-center">
                                    <p className="text-muted-foreground">Belum ada jenjang. Buat jenjang pertama Anda!</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}