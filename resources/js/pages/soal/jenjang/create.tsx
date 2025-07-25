import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type CreateJenjangForm = {
    nama: string;
};

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<CreateJenjangForm>({
        nama: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('jenjangs.store'));
    };

    return (
        <AppLayout>
            <Head title="Tambah Jenjang" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Jenjang Baru</CardTitle>
                            <CardDescription>
                                Isi detail untuk membuat jenjang baru.
                            </CardDescription>
                        </CardHeader>
                        
                        <form onSubmit={submit}>
                            <CardContent className="space-y-6">
                                {/* Nama */}
                                <div>
                                    <Label htmlFor="nama">Nama</Label>
                                    <Input
                                        id="nama"
                                        type="text"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.nama} />
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && (
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Simpan
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}