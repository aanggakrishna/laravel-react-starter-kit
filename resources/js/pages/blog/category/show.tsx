import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

export default function Show({ category }: { category: any }) {
    return (
        <AppLayout>
            <Head title={`Category: ${category.name}`} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </Button>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                                    <CardDescription>Slug: {category.slug}</CardDescription>
                                </div>
                                <Link href={route('categories.edit', category.id)}>
                                    <Button>Edit Category</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium">Description</h3>
                                {category.description ? (
                                    <p className="mt-2">{category.description}</p>
                                ) : (
                                    <p className="mt-2 text-muted-foreground">No description available</p>
                                )}
                            </div>
                            
                            {category.posts && category.posts.length > 0 ? (
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Posts in this category</h3>
                                    <div className="space-y-4">
                                        {category.posts.map((post: any) => (
                                            <Card key={post.id}>
                                                <CardHeader>
                                                    <CardTitle>
                                                        <Link 
                                                            href={route('posts.show', post.slug)}
                                                            className="hover:underline"
                                                        >
                                                            {post.title}
                                                        </Link>
                                                    </CardTitle>
                                                    <CardDescription>
                                                        By {post.user.name}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="line-clamp-2">{post.content.substring(0, 150)}...</p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Badge variant={post.is_published ? 'default' : 'outline'}>
                                                        {post.is_published ? 'Published' : 'Draft'}
                                                    </Badge>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Posts in this category</h3>
                                    <p className="text-muted-foreground">No posts found in this category.</p>
                                </div>
                            )}
                        </CardContent>
                        
                        <CardFooter className="flex justify-between">
                            <Link href={route('categories.index')}>
                                <Button variant="outline">Back to Categories</Button>
                            </Link>
                            <Link 
                                href={route('categories.destroy', category.id)} 
                                method="delete" 
                                as="button"
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                onClick={(e) => {
                                    if (!confirm('Are you sure you want to delete this category?')) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                Delete Category
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}