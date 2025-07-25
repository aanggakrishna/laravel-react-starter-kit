<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['user', 'category', 'tags']);
        
        // Apply search filter if provided
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }
        
        // Apply sorting
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        
        // Validate sort field to prevent SQL injection
        $allowedSortFields = ['created_at', 'title', 'is_published'];
        if (!in_array($sort, $allowedSortFields)) {
            $sort = 'created_at';
        }
        
        // Validate direction
        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }
        
        $query->orderBy($sort, $direction);
        
        // Get paginated results
        $posts = $query->paginate(10)->withQueryString();

        return Inertia::render('blog/index', [
            'posts' => $posts,
            'filters' => [
                'search' => $request->search,
                'sort' => $sort,
                'direction' => $direction,
            ]
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('blog/create', [
            'categories' => $categories,
            'tags' => $tags
        ]);
    }

    public function store(Request $request)
    {
        try {
            
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'thumbnail' => 'nullable|image|max:2048',
            'header_image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Generate slug
        $slug = Post::createUniqueSlug($request->title);

        // Handle file uploads
        $thumbnailPath = null;
        $headerImagePath = null;

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        if ($request->hasFile('header_image')) {
            $headerImagePath = $request->file('header_image')->store('headers', 'public');
        }

        // Create post
        $post = Post::create([
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'thumbnail' => $thumbnailPath,
            'header_image' => $headerImagePath,
            'is_published' => $request->has('is_published'),
            'published_at' => $request->has('is_published') ? now() : null,
        ]);

        // Attach tags
        if ($request->has('tags')) {
            $post->tags()->attach($request->tags);
        }
        return redirect()->route('posts.index')
            ->with('success', 'Post created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors($e->getMessage())->withInput();
        }
        
    }

    public function show($slug)
    {
        $post = Post::with(['user', 'category', 'tags'])
            ->where('slug', $slug)
            ->firstOrFail();
        return Inertia::render('blog/show', [
            'post' => $post
        ]);
    }

    public function edit($id)
    {
        $post = Post::with('tags')->findOrFail($id);
        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('blog/edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags
        ]);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'thumbnail' => 'nullable|image|max:2048',
            'header_image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Update slug if title changed
        $slug = $post->title !== $request->title 
            ? Post::createUniqueSlug($request->title) 
            : $post->slug;

        // Handle file uploads
        $thumbnailPath = $post->thumbnail;
        $headerImagePath = $post->header_image;

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($post->thumbnail) {
                Storage::disk('public')->delete($post->thumbnail);
            }
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        if ($request->hasFile('header_image')) {
            // Delete old header image if exists
            if ($post->header_image) {
                Storage::disk('public')->delete($post->header_image);
            }
            $headerImagePath = $request->file('header_image')->store('headers', 'public');
        }

        // Update post
        $post->update([
            'category_id' => $request->category_id,
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'thumbnail' => $thumbnailPath,
            'header_image' => $headerImagePath,
            'is_published' => $request->has('is_published'),
            'published_at' => $request->has('is_published') && !$post->published_at ? now() : $post->published_at,
        ]);

        // Sync tags
        $post->tags()->sync($request->tags ?? []);

        return redirect()->route('posts.index')
            ->with('success', 'Post updated successfully.');
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);

        // Delete images
        if ($post->thumbnail) {
            Storage::disk('public')->delete($post->thumbnail);
        }

        if ($post->header_image) {
            Storage::disk('public')->delete($post->header_image);
        }

        // Delete post
        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Post deleted successfully.');
    }
}