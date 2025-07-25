import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

export default function Show({ post }: { post: any }) {
    return (
        <AppLayout>
            <Head title={post.title} />
            
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href={route('posts.index')}>
                            <Button variant="outline" size="sm">← Back to Posts</Button>
                        </Link>
                    </div>
                    
                    <Card>
                        {post.header_image && (
                            <div className="w-full h-64 overflow-hidden rounded-t-xl">
                                <img 
                                    src={`/storage/${post.header_image}`} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        
                        <CardHeader>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold">{post.title}</h1>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>By {post.user.name}</span>
                                    <span>•</span>
                                    <span>{format(new Date(post.created_at), 'PPP')}</span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">{post.category.name}</Badge>
                                    {post.tags.map((tag: any) => (
                                        <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <div className="prose prose-sm sm:prose lg:prose-lg mx-auto dark:prose-invert">
                                {/* Render content - in a real app, you might want to use a rich text renderer here */}
                                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}