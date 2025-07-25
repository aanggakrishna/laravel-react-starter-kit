import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AppLogo from './app-logo';

const mainNavItems: (NavItem | NavGroup)[] = [
    {
        title: 'Dashboard',
        items: [{
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        ],
        icon: LayoutGrid,
    },

    {
        title: 'POST',
        items: [
            {
                title: 'Post',
                href: '/posts',
                icon: BookOpen,
            },
            {
                title: 'Kategori',
                href: '/categories',
                icon: BookOpen,
            },
            {
                title: 'Tag',
                href: '/tags',
                icon: BookOpen,
            },
        ]
    },
    {
        title: 'Tes',
        items: [
            {
                title: 'Riwayat Tes',
                href: '/soal-jawaban/riwayat',
                icon: BookOpen,
            },

        ]
    },
    {
        title: 'Soal',
        items: [
            {
                title: 'Soal',
                href: '/prompts',
                icon: BookOpen,
            },
            {
                title: 'Tipe Soal',
                href: '/tipe-soals',
                icon: BookOpen,
            },
            {
                title: 'Jenjang',
                href: '/jenjangs',
                icon: BookOpen,
            },
        ]
    },
    {
        title: 'Kuisioner / Survey',
        items: [
            {
                title: 'Kuisioner / Survey',
                href: '/soals',
                icon: BookOpen,
            },

        ]
    },
    {
        title: 'Setting',
        items: [
            {
                title: 'Package',
                href: '/admin/credits',
                icon: BookOpen,
            },

        ]
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
    const isMobile = useIsMobile();

    // Tampilan button bar untuk mobile
    if (isMobile) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 w-full items-center justify-around border-t border-sidebar-border bg-sidebar px-2">
                {mainNavItems.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className="flex flex-col items-center justify-center space-y-1 p-2 text-sidebar-foreground hover:text-sidebar-accent-foreground"
                    >
                        {item.icon && <item.icon className="h-6 w-6" />}
                        <span className="text-xs">{item.title}</span>
                    </Link>
                ))}
                {footerNavItems.map((item) => (
                    <a
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center space-y-1 p-2 text-sidebar-foreground hover:text-sidebar-accent-foreground"
                    >
                        {item.icon && <item.icon className="h-6 w-6" />}
                        <span className="text-xs">{item.title}</span>
                    </a>
                ))}
                <NavUser />
            </div>
        );
    }

    // Tampilan sidebar untuk desktop (tidak berubah)
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
