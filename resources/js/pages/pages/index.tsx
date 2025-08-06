import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { format } from 'date-fns';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/pagination';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  created_at: string;
  user: {
    name: string;
  };
}

interface PaginatedData {
  data: Page[];
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  per_page: number;
}

interface Props {
  pages: PaginatedData;
  filters: {
    search?: string;
    sort?: string;
    direction?: string;
  };
}

export default function PagesIndex({ pages, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [sort, setSort] = useState(filters.sort || 'created_at');
  const [direction, setDirection] = useState<'asc' | 'desc'>(filters.direction as 'asc' | 'desc' || 'desc');

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pages', href: '/pages' },
  ];

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      route('pages.index'),
      { search, sort, direction },
      { preserveState: true }
    );
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value);
    router.get(
      route('pages.index'),
      { search, sort: value, direction },
      { preserveState: true }
    );
  };

  // Handle direction change
  const handleDirectionChange = (value: 'asc' | 'desc') => {
    setDirection(value);
    router.get(
      route('pages.index'),
      { search, sort, direction: value },
      { preserveState: true }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this page?')) {
      router.delete(route('pages.destroy', id));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pages" />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Pages</h1>
            <p className="text-muted-foreground">Manage your website pages</p>
          </div>
          
          <Button asChild>
            <Link href={route('pages.create')}>
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search pages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Pages List */}
        <div className="space-y-4">
          {pages.data.length > 0 ? (
            pages.data.map((page: Page) => (
              <Card key={page.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>
                        <Link 
                          href={route('pages.show', page.slug)}
                          className="hover:underline"
                          target="_blank"
                        >
                          {page.title}
                        </Link>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        By {page.user.name} • {format(new Date(page.created_at), 'PPP')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={page.is_published ? 'default' : 'outline'}>
                        {page.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={route('pages.show', page.slug)} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={route('pages.edit', page.id)}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDelete(page.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="line-clamp-3">
                    {page.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No pages found.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {pages.last_page > 1 && (
          <div className="mt-6">
            <Pagination links={pages.links} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}