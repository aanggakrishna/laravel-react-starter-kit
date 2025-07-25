import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import axios from 'axios';

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

export default function CreditIndex({ packages }: { packages: CreditPackage[] }) {
    const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { data, setData } = useForm({
        payment_method: 'credit_card',
    });

    const handlePurchase = (pkg: CreditPackage) => {
        setSelectedPackage(pkg);
        setIsDialogOpen(true);
        setError(null);
    };

    const handleSubmit = async () => {
        if (!selectedPackage) return;
        
        setIsProcessing(true);
        setError(null);
        
        try {
            // Panggil endpoint untuk membuat transaksi Duitku
            const response = await axios.post(route('credits.duitku.create', selectedPackage.id), {
                payment_method: data.payment_method,
            });
            
            // Jika berhasil, gunakan checkout.process untuk memunculkan popup Duitku
            if (response.data.success && response.data.reference) {
                // Simpan referensi untuk digunakan nanti jika diperlukan
                localStorage.setItem('duitku_reference', response.data.reference);
                
                // Gunakan checkout.process untuk memunculkan popup Duitku
                // Tambahkan logging lebih detail
                console.log('Response from Duitku:', response.data);
                console.log('Window checkout available:', !!window.checkout);
                
                // Dan di dalam handleSubmit, sebelum memanggil checkout.process
                if (window.checkout) {
                    console.log('Calling checkout.process with reference:', response.data.reference);
                    window.checkout.process(response.data.reference, {
                        successEvent: function(result) {
                            console.log('Payment Success', result);
                            // Redirect ke halaman usage dengan status sukses
                            window.location.href = route('usage.index') + '?status=success&message=Pembayaran berhasil&reference=' + response.data.reference;
                        },
                        pendingEvent: function(result) {
                            console.log('Payment Pending', result);
                            window.location.href = route('usage.index') + '?status=pending&message=Pembayaran sedang diproses&reference=' + response.data.reference;
                        },
                        errorEvent: function(result) {
                            console.log('Payment Error', result);
                            window.location.href = route('usage.index') + '?status=failed&message=Pembayaran gagal&reference=' + response.data.reference;
                        },
                        closeEvent: function(result) {
                            console.log('Customer closed popup', result);
                            setIsProcessing(false);
                            setIsDialogOpen(false);
                        }
                    });
                } else {
                    console.error('Duitku checkout not available');
                    // Redirect ke halaman sukses atau refresh halaman
                    window.location.href = route('duitku.return') + '?status=success';
                }
            } else {
                setError(response.data.message || 'Gagal membuat transaksi. Silakan coba lagi.');
            }
        } catch (err) {
            console.error('Error creating transaction:', err);
            setError('Gagal membuat transaksi. Silakan coba lagi.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Tambahkan script Duitku
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://app-sandbox.duitku.com/lib/js/duitku.js'; // Ganti dengan URL production saat siap live
        script.async = true;
        script.onload = () => {
            console.log('Duitku script loaded');
        };
        script.onerror = () => {
            console.error('Failed to load Duitku script');
        };
        document.body.appendChild(script);
        
        return () => {
            // Pastikan script dihapus saat komponen unmount
            const existingScript = document.querySelector('script[src="https://app-sandbox.duitku.com/lib/js/duitku.js"]');
            if (existingScript && existingScript.parentNode) {
                existingScript.parentNode.removeChild(existingScript);
            }
        };
    }, []);

    // Tambahkan deklarasi tipe untuk window.checkout
    declare global {
        interface Window {
            checkout: {
                process: (reference: string, options: any) => void;
            };
        }
    }

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Credits', href: '/credits' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buy Credits" />
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Buy Credits</h1>
                    <p className="text-muted-foreground">Choose a credit package to enhance your experience</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>{pkg.name}</CardTitle>
                                <CardDescription>{pkg.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 mb-4">
                                    <CreditCard className="h-5 w-5" />
                                    <span className="text-xl font-bold">{pkg.credits} Credits</span>
                                </div>
                                
                                {pkg.premium_days > 0 && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <Crown className="h-5 w-5 text-amber-500" />
                                        <span>{pkg.premium_days} days of Premium</span>
                                    </div>
                                )}
                                
                                <div className="text-2xl font-bold">
                                    Rp {parseFloat(pkg.price).toLocaleString('id-ID')}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full" 
                                    onClick={() => handlePurchase(pkg)}
                                >
                                    Purchase
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Your Purchase</DialogTitle>
                        <DialogDescription>
                            You are about to purchase {selectedPackage?.credits} credits for Rp {selectedPackage ? parseFloat(selectedPackage.price).toLocaleString('id-ID') : 0}
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Select Payment Method</h3>
                            <RadioGroup 
                                value={data.payment_method} 
                                onValueChange={(value) => setData('payment_method', value)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="credit_card" id="credit_card" />
                                    <Label htmlFor="credit_card">Credit Card</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                                    <Label htmlFor="bank_transfer">Bank Transfer</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="e_wallet" id="e_wallet" />
                                    <Label htmlFor="e_wallet">E-Wallet</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        {error && (
                            <div className="text-red-500 text-sm mt-2">{error}</div>
                        )}
                    </div>
                    
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : 'Confirm Purchase'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}