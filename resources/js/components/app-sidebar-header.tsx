import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Crown } from 'lucide-react';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    const { auth } = usePage<SharedData>().props;
    const isPremium = auth.user.is_premium && new Date(auth.user.premium_expires_at) > new Date();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="ml-auto flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-sm font-medium">{auth.user.credits}</span>
                </div>
                {isPremium && (
                    <Badge variant="premium" className="flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        <span>Premium</span>
                    </Badge>
                )}
            </div>
        </header>
    );
}
