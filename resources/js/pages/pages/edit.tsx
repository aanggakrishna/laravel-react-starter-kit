import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

interface Page {
  id: number;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
}

interface Props {
  page: Page;
}

export default function EditPage({ page }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    title: page.title,
    content: page.content,
    meta_title: page.meta_title || '',
    meta_description: page.meta_description || '',
    is_published: page.is_published,
  });

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Pages', href: '/pages' },
    { title: 'Edit', href: '#' },
  ];

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('pages.update', page.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit ${page.title}`} />
      
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Page</CardTitle>
            <CardDescription>
              Update the page details.
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
              
              {/* Content - TinyMCE Editor */}
              <div>
                <Label htmlFor="content">Content</Label>
                <div className="mt-1">
                  <Editor
                    apiKey="7mc5buumpes7f0nqjvoj7czrxrw66ttw2efj3gk7knusfncu" // Ganti dengan API key TinyMCE Anda
                    value={data.content}
                    onEditorChange={(content) => setData('content', content)}
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                  />
                </div>
                <InputError message={errors.content} />
              </div>
              
              {/* Meta Title */}
              <div>
                <Label htmlFor="meta_title">Meta Title (SEO)</Label>
                <Input
                  id="meta_title"
                  type="text"
                  value={data.meta_title}
                  onChange={(e) => setData('meta_title', e.target.value)}
                  className="mt-1 block w-full"
                  placeholder="Optional: Custom meta title for SEO"
                />
                <InputError message={errors.meta_title} />
              </div>
              
              {/* Meta Description */}
              <div>
                <Label htmlFor="meta_description">Meta Description (SEO)</Label>
                <Textarea
                  id="meta_description"
                  value={data.meta_description}
                  onChange={(e) => setData('meta_description', e.target.value)}
                  className="mt-1 block w-full"
                  placeholder="Optional: Brief description for search engines"
                  rows={3}
                />
                <InputError message={errors.meta_description} />
              </div>
              
              {/* Published Status */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_published"
                  checked={data.is_published}
                  onCheckedChange={(checked) => setData('is_published', checked as boolean)}
                />
                <Label htmlFor="is_published">Published</Label>
              </div>
            </CardContent>
            
            <div className="flex justify-end gap-4 p-6 border-t">
              <Button type="button" variant="outline" asChild>
                <a href={route('pages.index')}>Cancel</a>
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : 'Update Page'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}