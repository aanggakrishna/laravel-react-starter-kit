import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Trash2, Edit, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { PermissionGate } from '@/components/permission-gate';

interface Post {
    id: number;
    title: string;
    slug: string;
    created_at: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    posts: Post[];
}

export default function Show({ tag }: { tag: Tag }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        router.delete(route('tags.destroy', tag.id));
    };

    return (
        <AppLayout>
            <Head title={`Tag: ${tag.name}`} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button variant="ghost" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{tag.name}</CardTitle>
                                    <CardDescription>Slug: {tag.slug}</CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <PermissionGate permission="tags.edit">
                                        <Link href={route('tags.edit', tag.id)}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                    </PermissionGate>
                                    
                                    <PermissionGate permission="tags.delete">
                                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the tag
                                                        and remove it from all associated posts.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </PermissionGate>
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            <h3 className="text-lg font-medium mb-4">Posts with this tag ({tag.posts.length})</h3>
                            
                            {tag.posts.length > 0 ? (
                                <div className="space-y-4">
                                    {tag.posts.map((post) => (
                                        <Card key={post.id}>
                                            <CardHeader>
                                                <CardTitle>
                                                    <Link 
                                                        href={route('blog.show', post.slug)}
                                                        className="hover:underline"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No posts are using this tag yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}