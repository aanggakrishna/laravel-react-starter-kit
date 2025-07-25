import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

export default function Index({ categories }: { categories: any[] }) {
    return (
        <AppLayout>
            <Head title="Categories" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Categories</h1>
                        <Link href={route('categories.create')}>
                            <Button>Create New Category</Button>
                        </Link>
                    </div>
                    
                    <div className="space-y-6">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <Card key={category.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle>
                                                    <Link 
                                                        href={route('categories.show', category.id)}
                                                        className="hover:underline"
                                                    >
                                                        {category.name}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription>
                                                    Slug: {category.slug}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent>
                                        {category.description ? (
                                            <p>{category.description}</p>
                                        ) : (
                                            <p className="text-muted-foreground">No description available</p>
                                        )}
                                    </CardContent>
                                    
                                    <CardFooter className="flex justify-end space-x-2">
                                        <Link href={route('categories.edit', category.id)}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Link href={route('categories.show', category.id)}>
                                            <Button size="sm">View</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="py-10 text-center">
                                    <p className="text-muted-foreground">No categories found. Create your first category!</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}