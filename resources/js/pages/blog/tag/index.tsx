import { Head, Link } from '@inertiajs/react';
import { PermissionGate } from '@/components/permission-gate';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Tag {
  id: number;
  name: string;
  slug: string;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export default function Index({ tags }: { tags: Tag[] }) {
    return (
        <AppLayout>
            <Head title="Tags" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Tags</h1>
                        {/* <PermissionGate permission="tags.create"> */}
                            <Link href={route('tags.create')}>
                                <Button>Create New Tag</Button>
                            </Link>
                        {/* </PermissionGate> */}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tags.length > 0 ? (
                            tags.map((tag) => (
                                <Card key={tag.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>
                                                    <Link 
                                                        href={route('tags.show', tag.id)}
                                                        className="hover:underline"
                                                    >
                                                        {tag.name}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription>
                                                    Slug: {tag.slug}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary">
                                                {tag.posts_count} {tag.posts_count === 1 ? 'Post' : 'Posts'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardFooter className="flex justify-end space-x-2">
                                        <PermissionGate permission="tags.edit">
                                            <Link href={route('tags.edit', tag.id)}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                        </PermissionGate>
                                        <Link href={route('tags.show', tag.id)}>
                                            <Button size="sm">View</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <Card className="col-span-full">
                                <CardContent className="py-10 text-center">
                                    <p className="text-muted-foreground">No tags found. Create your first tag!</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}