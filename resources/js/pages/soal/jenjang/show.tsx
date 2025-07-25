import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';

interface Jenjang {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

export default function Show({ jenjang }: { jenjang: Jenjang }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('jenjangs.destroy', jenjang.id));
    };

    return (
        <AppLayout>
            <Head title={`Jenjang: ${jenjang.nama}`} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{jenjang.nama}</CardTitle>
                                    <CardDescription>
                                        Detail jenjang
                                    </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <Link href={route('jenjangs.edit', jenjang.id)}>
                                        <Button variant="outline">Edit</Button>
                                    </Link>
                                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Hapus</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Apakah Anda yakin ingin menghapus jenjang ini? Tindakan ini tidak dapat dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Hapus
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium">Nama</h3>
                                    <p>{jenjang.nama}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">Dibuat pada</h3>
                                    <p>{new Date(jenjang.created_at).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium">Diperbarui pada</h3>
                                    <p>{new Date(jenjang.updated_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={route('jenjangs.index')}>
                                <Button variant="outline">Kembali ke Daftar</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}