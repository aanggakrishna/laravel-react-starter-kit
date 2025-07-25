import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

type CreateCreditPackageForm = {
    name: string;
    description: string;
    credits: number;
    price: number;
    premium_days: number;
    is_active: boolean;
};

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<CreateCreditPackageForm>({
        name: '',
        description: '',
        credits: 0,
        price: 0,
        premium_days: 0,
        is_active: true,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.credits.store'));
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin', href: '/admin' },
        { title: 'Credit Packages', href: '/admin/credits' },
        { title: 'Create', href: '/admin/credits/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Credit Package" />
            
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Credit Package</CardTitle>
                            <CardDescription>
                                Fill in the details to create a new credit package for users.
                            </CardDescription>
                        </CardHeader>
                        
                        <form onSubmit={submit}>
                            <CardContent className="space-y-6">
                                {/* Name */}
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                
                                {/* Description */}
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <div className="mt-1">
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        />
                                    </div>
                                    <InputError message={errors.description} />
                                </div>
                                
                                {/* Credits */}
                                <div>
                                    <Label htmlFor="credits">Credits</Label>
                                    <Input
                                        id="credits"
                                        type="number"
                                        min="1"
                                        value={data.credits}
                                        onChange={(e) => setData('credits', Number(e.target.value))}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.credits} />
                                </div>
                                
                                {/* Price */}
                                <div>
                                    <Label htmlFor="price">Price (Rp)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', Number(e.target.value))}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </div>
                                
                                {/* Premium Days */}
                                <div>
                                    <Label htmlFor="premium_days">Premium Days</Label>
                                    <Input
                                        id="premium_days"
                                        type="number"
                                        min="0"
                                        value={data.premium_days}
                                        onChange={(e) => setData('premium_days', Number(e.target.value))}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.premium_days} />
                                </div>
                                
                                {/* Is Active */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="is_active"
                                        checked={data.is_active}
                                        onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                    />
                                    <label 
                                        htmlFor="is_active"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Active
                                    </label>
                                </div>
                            </CardContent>
                            
                            <CardFooter className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Package
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}