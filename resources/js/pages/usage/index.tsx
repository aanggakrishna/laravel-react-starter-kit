import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Crown, Clock, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface UserData {
    credits: number;
    is_premium: boolean;
    premium_expires_at: string | null;
}

interface Transaction {
    id: number;
    user_id: number;
    credit_package_id: number | null;
    transaction_type: string;
    amount: number;
    description: string | null;
    payment_method: string | null;
    payment_status: string | null;
    transaction_id: string | null;
    created_at: string;
    updated_at: string;
    credit_package: {
        id: number;
        name: string;
        price: string;
    } | null;
}

interface UsageProps {
    user: UserData;
    transactions: {
        data: Transaction[];
        // Pagination props
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: any[];
    };
    payment?: {
        status?: 'success' | 'failed' | 'pending';
        message?: string;
        reference?: string;
    };
}

export default function Usage({ user, transactions, payment }: UsageProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Usage', href: '/usage' },
    ];

    // Fungsi untuk mendapatkan ikon status pembayaran
    const getPaymentStatusIcon = (status?: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'pending':
            default:
                return <AlertCircle className="h-5 w-5 text-amber-500" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usage & Credits" />
            
            <div className="p-6">
                {/* Tampilkan notifikasi status pembayaran jika ada */}
                {payment?.status && (
                    <Alert className={`mb-6 ${payment.status === 'success' ? 'bg-green-50' : payment.status === 'failed' ? 'bg-red-50' : 'bg-amber-50'}`}>
                        <div className="flex items-center gap-2">
                            {getPaymentStatusIcon(payment.status)}
                            <AlertTitle>
                                {payment.status === 'success' ? 'Pembayaran Berhasil' : 
                                 payment.status === 'failed' ? 'Pembayaran Gagal' : 'Pembayaran Tertunda'}
                            </AlertTitle>
                        </div>
                        <AlertDescription>
                            {payment.message || 'Status pembayaran telah diperbarui.'}
                        </AlertDescription>
                    </Alert>
                )}
                
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Usage & Credits</h1>
                    <p className="text-muted-foreground">Manage your credits and view your usage history</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Credits Balance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{user.credits}</div>
                            <div className="mt-2">
                                <Button size="sm" asChild>
                                    <a href={route('credits.index')}>
                                        <Plus className="mr-1 h-4 w-4" />
                                        Buy More
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Crown className="h-5 w-5 text-amber-500" />
                                Premium Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-2">
                                {user.is_premium ? (
                                    <Badge variant="premium" className="mb-2">
                                        Premium
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="mb-2">
                                        Free
                                    </Badge>
                                )}
                            </div>
                            
                            {user.is_premium && user.premium_expires_at && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    Expires: {format(new Date(user.premium_expires_at), 'dd MMM yyyy')}
                                </div>
                            )}
                            
                            {!user.is_premium && (
                                <div className="mt-2">
                                    <Button size="sm" asChild>
                                        <a href={route('credits.index')}>
                                            Upgrade to Premium
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4">Date</th>
                                        <th className="text-left p-4">Description</th>
                                        <th className="text-left p-4">Type</th>
                                        <th className="text-right p-4">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.data.map((transaction) => (
                                        <tr key={transaction.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                {format(new Date(transaction.created_at), 'dd MMM yyyy HH:mm')}
                                            </td>
                                            <td className="p-4">{transaction.description}</td>
                                            <td className="p-4">
                                                <Badge variant={transaction.transaction_type === 'purchase' ? 'default' : 'outline'}>
                                                    {transaction.transaction_type}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right font-medium">
                                                <div className="flex items-center justify-end gap-1">
                                                    {transaction.amount > 0 ? (
                                                        <ArrowUp className="h-3 w-3 text-green-500" />
                                                    ) : (
                                                        <ArrowDown className="h-3 w-3 text-red-500" />
                                                    )}
                                                    {Math.abs(transaction.amount)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    
                                    {transactions.data.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                                No transactions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination can be added here */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}