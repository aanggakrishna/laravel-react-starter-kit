import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import { Search } from 'lucide-react';
import { PermissionGate } from '../../components/permission-gate';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  created_at: string;
  user: {
    name: string;
  };
  category: {
    name: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
}

interface PaginatedData {
  data: Post[];
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
  posts: PaginatedData;
  filters?: {
    search?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
  };
}

export default function Index({ posts, filters = {} }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [sort, setSort] = useState(filters.sort || 'created_at');
  const [direction, setDirection] = useState(filters.direction || 'desc');
  
  // Debounced search function
  const debouncedSearch = debounce((value) => {
    router.get(
      route('posts.index'),
      { search: value, sort, direction },
      { preserveState: true, replace: true }
    );
  }, 300);

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search]);

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSort(value);
    router.get(
      route('posts.index'),
      { search, sort: value, direction },
      { preserveState: true }
    );
  };

  // Handle direction change
  const handleDirectionChange = (value: 'asc' | 'desc') => {
    setDirection(value);
    router.get(
      route('posts.index'),
      { search, sort, direction: value },
      { preserveState: true }
    );
  };

  return (
    <AppLayout>
      <Head title="Blog Posts" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Blog Posts</h1>
            <Link href={route('posts.create')}>
              <Button>Create New Post</Button>
            </Link>
          </div>
          
          {/* Filters and Search */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
              <Select value={direction} onValueChange={handleDirectionChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Results info */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {posts.from} to {posts.to} of {posts.total} posts
          </div>
          
          <div className="space-y-6">
            {posts.data.length > 0 ? (
              posts.data.map((post: Post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>
                          <Link 
                            href={route('posts.show', post.slug)}
                            className="hover:underline"
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription>
                          By {post.user.name} • {format(new Date(post.created_at), 'PPP')}
                        </CardDescription>
                      </div>
                      <Badge variant={post.is_published ? 'default' : 'outline'}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{post.category.name}</Badge>
                      {post.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                      ))}
                    </div>
                    
                    <p className="line-clamp-3">
                      {post.content.substring(0, 200)}...
                    </p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end space-x-2">
                    <Link href={route('posts.edit', post.id)}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Link href={route('posts.show', post.slug)}>
                      <Button size="sm">View</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">No posts found. Create your first post!</p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Pagination */}
          {posts.last_page > 1 && (
            <div className="mt-8">
              <Pagination links={posts.links} />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}