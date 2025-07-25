import { SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    const isMobile = useIsMobile();
    
    if (variant === 'sidebar') {
        return (
            <SidebarInset 
                className={isMobile ? 'pb-16' : ''} 
                {...props}
            >
                {children}
            </SidebarInset>
        );
    }

    return (
        <main 
            className={`mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl ${isMobile ? 'pb-16' : ''}`} 
            {...props}
        >
            {children}
        </main>
    );
}
