import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PaymentStatusProps {
    status: 'success' | 'failed' | 'pending';
    message: string;
}

export default function PaymentStatus({ status, message }: PaymentStatusProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Credits', href: '/credits' },
        { title: 'Payment Status', href: '#' },
    ];

    const getStatusIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle2 className="h-16 w-16 text-green-500" />;
            case 'failed':
                return <XCircle className="h-16 w-16 text-red-500" />;
            case 'pending':
            default:
                return <Clock className="h-16 w-16 text-amber-500" />;
        }
    };

    const getStatusTitle = () => {
        switch (status) {
            case 'success':
                return 'Payment Successful';
            case 'failed':
                return 'Payment Failed';
            case 'pending':
            default:
                return 'Payment Pending';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment Status" />
            
            <div className="p-6">
                <Card className="max-w-md mx-auto">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            {getStatusIcon()}
                        </div>
                        <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center mb-6">{message}</p>
                        
                        <div className="flex justify-center">
                            <Button asChild>
                                <Link href={route('credits.index')}>Back to Credits</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}