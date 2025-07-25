<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Carbon\Carbon;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index()
    {
        $sitemap = $this->generateSitemap();
        
        return response($sitemap)
            ->header('Content-Type', 'text/xml');
    }
    
    private function generateSitemap()
    {
        $posts = Post::where('is_published', true)
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->get();
            
        $categories = Category::withCount(['posts' => function ($query) {
            $query->where('is_published', true)->whereNotNull('published_at');
        }])->having('posts_count', '>', 0)->get();
        
        $tags = Tag::withCount(['posts' => function ($query) {
            $query->where('is_published', true)->whereNotNull('published_at');
        }])->having('posts_count', '>', 0)->get();
        
        $baseUrl = config('app.url');
        $now = Carbon::now()->toAtomString();
        
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
        $xml .= ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        $xml .= ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9';
        $xml .= ' http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
        
        // Halaman Utama
        $xml .= $this->addUrl($baseUrl, $now, 'weekly', '1.0');
        
        // Halaman Blog
        $xml .= $this->addUrl("$baseUrl/blog", $now, 'daily', '0.9');
        
        // Halaman Kategori
        foreach ($categories as $category) {
            $xml .= $this->addUrl("$baseUrl/blog?category={$category->slug}", $now, 'weekly', '0.8');
        }
        
        // Halaman Tag
        foreach ($tags as $tag) {
            $xml .= $this->addUrl("$baseUrl/blog?tag={$tag->slug}", $now, 'weekly', '0.7');
        }
        
        // Artikel Blog
        foreach ($posts as $post) {
            $lastmod = $post->updated_at ? $post->updated_at->toAtomString() : $post->published_at->toAtomString();
            $xml .= $this->addUrl("$baseUrl/blog/{$post->slug}", $lastmod, 'monthly', '0.6');
        }
        
        // Halaman Auth yang Publik
        $xml .= $this->addUrl("$baseUrl/login", $now, 'monthly', '0.5');
        $xml .= $this->addUrl("$baseUrl/register", $now, 'monthly', '0.5');
        
        $xml .= '</urlset>';
        
        return $xml;
    }
    
    private function addUrl($loc, $lastmod, $changefreq, $priority)
    {
        return "\n    <url>\n        <loc>$loc</loc>\n        <lastmod>$lastmod</lastmod>\n        <changefreq>$changefreq</changefreq>\n        <priority>$priority</priority>\n    </url>";
    }
}