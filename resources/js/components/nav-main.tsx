import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: (NavItem | NavGroup)[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    // Jika item adalah NavGroup
                    if ('items' in item) {
                        return (
                            <SidebarMenuItem key={item.title} className="flex flex-col items-start">
                                <div className="mb-2 text-sm font-medium">{item.title}</div>
                                <div className="space-y-1 pl-2">
                                    {item.items.map((subItem) => (
                                        <SidebarMenuButton 
                                            key={subItem.title}
                                            asChild 
                                            isActive={page.url.startsWith(subItem.href)} 
                                            tooltip={{ children: subItem.title }}
                                        >
                                            <Link href={subItem.href} prefetch>
                                                {subItem.icon && <subItem.icon />}
                                                <span>{subItem.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    ))}
                                </div>
                            </SidebarMenuItem>
                        );
                    }
                    
                    // Jika item adalah NavItem biasa
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
