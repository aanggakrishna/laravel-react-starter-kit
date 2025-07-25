import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useRef } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';

type CreatePostForm = {
    title: string;
    content: string;
    category_id: string;
    tags: string[];
    thumbnail: File | null;
    header_image: File | null;
    is_published: boolean;
};

export default function Create({ categories, tags }: { categories: any[], tags: any[] }) {
    const editorRef = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm<CreatePostForm>({
        title: '',
        content: '',
        category_id: '',
        tags: [],
        thumbnail: null,
        header_image: null,
        is_published: false,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [headerImagePreview, setHeaderImagePreview] = useState<string | null>(null);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('thumbnail', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setThumbnailPreview(null);
        }
    };

    const handleHeaderImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('header_image', file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeaderImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setHeaderImagePreview(null);
        }
    };

    const handleTagChange = (tagId: string) => {
        const currentTags = [...data.tags];
        const tagIndex = currentTags.indexOf(tagId);
        
        if (tagIndex === -1) {
            currentTags.push(tagId);
        } else {
            currentTags.splice(tagIndex, 1);
        }
        
        setData('tags', currentTags);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('posts.store'));
    };

    return (
        <AppLayout>
            <Head title="Create Post" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Post</CardTitle>
                            <CardDescription>
                                Fill in the details to create a new blog post.
                            </CardDescription>
                        </CardHeader>
                        
                        <form onSubmit={submit}>
                            <CardContent className="space-y-6">
                                {/* Title */}
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                
                                {/* Content - WYSIWYG Editor */}
                                <div>
                                    <Label htmlFor="content">Content</Label>
                                    <div className="mt-1">
                                        <Editor
                                            id="content"
                                            apiKey="7mc5buumpes7f0nqjvoj7czrxrw66ttw2efj3gk7knusfncu" // Anda bisa mendapatkan API key gratis dari TinyMCE
                                            onInit={(_evt, editor) => editorRef.current = editor}
                                            value={data.content}
                                            onEditorChange={(content) => setData('content', content)}
                                            init={{
                                                height: 400,
                                                menubar: true,
                                                plugins: [
                                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                                ],
                                                toolbar: 'undo redo | blocks | ' +
                                                    'bold italic forecolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    'removeformat | image | help',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                // Konfigurasi upload gambar
                                                images_upload_url: '/api/upload-image', // Endpoint untuk upload gambar
                                                automatic_uploads: true,
                                                file_picker_types: 'image',
                                                // Tambahkan callback untuk upload gambar
                                                images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                                                    const formData = new FormData();
                                                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                                                    
                                                    const xhr = new XMLHttpRequest();
                                                    xhr.open('POST', '/api/upload-image');
                                                    
                                                    // Tambahkan CSRF token
                                                    const token = document.head.querySelector('meta[name="csrf-token"]');
                                                    if (token) {
                                                        xhr.setRequestHeader('X-CSRF-TOKEN', token.getAttribute('content'));
                                                    }
                                                    
                                                    xhr.onload = () => {
                                                        if (xhr.status !== 200) {
                                                            reject('HTTP Error: ' + xhr.status);
                                                            return;
                                                        }
                                                        
                                                        const json = JSON.parse(xhr.responseText);
                                                        if (!json || typeof json.location !== 'string') {
                                                            reject('Invalid JSON: ' + xhr.responseText);
                                                            return;
                                                        }
                                                        
                                                        resolve(json.location);
                                                    };
                                                    
                                                    xhr.onerror = () => {
                                                        reject('Image upload failed due to a XHR Transport error');
                                                    };
                                                    
                                                    xhr.upload.onprogress = (e) => {
                                                        progress(e.loaded / e.total * 100);
                                                    };
                                                    
                                                    xhr.send(formData);
                                                })
                                            }}
                                        />
                                    </div>
                                    <InputError message={errors.content} />
                                </div>
                                
                                {/* Category */}
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select 
                                        value={data.category_id} 
                                        onValueChange={(value) => setData('category_id', value)}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>
                                
                                {/* Tags */}
                                <div>
                                    <Label>Tags</Label>
                                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                        {tags.map((tag) => (
                                            <div key={tag.id} className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id={`tag-${tag.id}`}
                                                    checked={data.tags.includes(tag.id.toString())}
                                                    onCheckedChange={() => handleTagChange(tag.id.toString())}
                                                />
                                                <label 
                                                    htmlFor={`tag-${tag.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {tag.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.tags} />
                                </div>
                                
                                {/* Thumbnail */}
                                <div>
                                    <Label htmlFor="thumbnail">Thumbnail</Label>
                                    <Input
                                        id="thumbnail"
                                        type="file"
                                        onChange={handleThumbnailChange}
                                        className="mt-1 block w-full"
                                        accept="image/*"
                                    />
                                    <InputError message={errors.thumbnail} />
                                    
                                    {thumbnailPreview && (
                                        <div className="mt-2">
                                            <img 
                                                src={thumbnailPreview} 
                                                alt="Thumbnail preview" 
                                                className="max-w-xs rounded-md border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Header Image */}
                                <div>
                                    <Label htmlFor="header_image">Header Image</Label>
                                    <Input
                                        id="header_image"
                                        type="file"
                                        onChange={handleHeaderImageChange}
                                        className="mt-1 block w-full"
                                        accept="image/*"
                                    />
                                    <InputError message={errors.header_image} />
                                    
                                    {headerImagePreview && (
                                        <div className="mt-2">
                                            <img 
                                                src={headerImagePreview} 
                                                alt="Header image preview" 
                                                className="max-w-xs rounded-md border border-gray-200"
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                {/* Publish Status */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox 
                                        id="is_published"
                                        checked={data.is_published}
                                        onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                                    />
                                    <label 
                                        htmlFor="is_published"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Publish immediately
                                    </label>
                                </div>
                            </CardContent>
                            
                            <CardFooter className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => reset()}
                                    disabled={processing}
                                >
                                    Cancel
                                </Button>
                                
                                <Button type="submit" disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Post
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}