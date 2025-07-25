<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of the blog posts for public view.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Get query parameters for filtering
        $category = $request->query('category');
        $tag = $request->query('tag');
        $search = $request->query('search');
        
        // Base query with eager loading
        $query = Post::with(['user', 'category', 'tags'])
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc');
        
        // Apply filters if provided
        if ($category) {
            $query->whereHas('category', function ($q) use ($category) {
                $q->where('slug', $category);
            });
        }
        
        if ($tag) {
            $query->whereHas('tags', function ($q) use ($tag) {
                $q->where('slug', $tag);
            });
        }
        
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }
        
        // Get paginated results
        $posts = $query->paginate(9);
        
        // Get categories and tags for sidebar
        $categories = Category::withCount(['posts' => function ($query) {
            $query->where('is_published', true)->whereNotNull('published_at');
        }])->having('posts_count', '>', 0)->get();
        
        $tags = Tag::withCount(['posts' => function ($query) {
            $query->where('is_published', true)->whereNotNull('published_at');
        }])->having('posts_count', '>', 0)->get();
        
        return Inertia::render('frontend/blog/index', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => [
                'category' => $category,
                'tag' => $tag,
                'search' => $search,
            ],
        ]);
    }

    /**
     * Display the specified blog post for public view.
     *
     * @param  string  $slug
     * @return \Inertia\Response
     */
    public function show($slug)
    {
        // Get the post with relationships
        $post = Post::with(['user', 'category', 'tags'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->firstOrFail();
        
        // Get related posts (same category or tags)
        $relatedPosts = Post::with(['user', 'category'])
            ->where('id', '!=', $post->id)
            ->where('is_published', true)
            ->whereNotNull('published_at')
            ->where(function ($query) use ($post) {
                $query->where('category_id', $post->category_id)
                      ->orWhereHas('tags', function ($q) use ($post) {
                          $q->whereIn('tags.id', $post->tags->pluck('id'));
                      });
            })
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();
        
        // Increment view count (optional, you can implement this if needed)
        // $post->increment('views');
        
        // Get categories and tags for sidebar
        $categories = Category::withCount(['posts' => function ($query) {
            $query->where('is_published', true)->whereNotNull('published_at');
        }])->having('posts_count', '>', 0)->get();
        
        $tags = Tag::withCount(['posts' => function ($query) {
            $query->where('is_published', true)->whereNotNull('published_at');
        }])->having('posts_count', '>', 0)->get();
        
        return Inertia::render('frontend/blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }
}