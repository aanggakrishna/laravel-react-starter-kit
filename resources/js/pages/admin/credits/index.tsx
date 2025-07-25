import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, Edit, Trash2 } from 'lucide-react';

interface CreditPackage {
    id: number;
    name: string;
    description: string | null;
    credits: number;
    price: string;
    premium_days: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export default function AdminCreditIndex({ packages }: { packages: CreditPackage[] }) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin', href: '/admin' },
        { title: 'Credit Packages', href: '/admin/credits' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Credit Packages" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Manage Credit Packages</h1>
                        <p className="text-muted-foreground">Create and manage credit packages for users</p>
                    </div>
                    
                    <Button asChild>
                        <Link href={route('admin.credits.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Package
                        </Link>
                    </Button>
                </div>
                
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4">Name</th>
                                        <th className="text-left p-4">Credits</th>
                                        <th className="text-left p-4">Premium Days</th>
                                        <th className="text-right p-4">Price</th>
                                        <th className="text-center p-4">Status</th>
                                        <th className="text-right p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {packages.map((pkg) => (
                                        <tr key={pkg.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <div className="font-medium">{pkg.name}</div>
                                                {pkg.description && (
                                                    <div className="text-sm text-muted-foreground">{pkg.description}</div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1">
                                                    <CreditCard className="h-4 w-4" />
                                                    {pkg.credits}
                                                </div>
                                            </td>
                                            <td className="p-4">{pkg.premium_days}</td>
                                            <td className="p-4 text-right">
                                                Rp {parseFloat(pkg.price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="p-4 text-center">
                                                <Badge variant={pkg.is_active ? 'default' : 'outline'}>
                                                    {pkg.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={route('admin.credits.edit', pkg.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button size="sm" variant="destructive" asChild>
                                                        <Link 
                                                            href={route('admin.credits.destroy', pkg.id)} 
                                                            method="delete" 
                                                            as="button"
                                                            data={{ _method: 'DELETE' }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {packages.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No credit packages found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}