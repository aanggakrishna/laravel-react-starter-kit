<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PageController extends Controller
{
    public function index(Request $request)
    {
        $query = Page::with(['user']);
        
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
        $pages = $query->paginate(10)->withQueryString();

        return Inertia::render('pages/index', [
            'pages' => $pages,
            'filters' => [
                'search' => $request->search,
                'sort' => $sort,
                'direction' => $direction,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('pages/create');
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            // Generate slug
            $slug = Page::createUniqueSlug($request->title);

            // Create page
            Page::create([
                'user_id' => auth()->id(),
                'title' => $request->title,
                'slug' => $slug,
                'content' => $request->content,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'is_published' => $request->has('is_published'),
                'published_at' => $request->has('is_published') ? now() : null,
            ]);

            return redirect()->route('pages.index')
                ->with('success', 'Page created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors($e->getMessage())->withInput();
        }
    }

    public function show($slug)
    {
        $page = Page::with(['user'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
            
        return Inertia::render('pages/show', [
            'page' => $page
        ]);
    }

    public function edit($id)
    {
        $page = Page::findOrFail($id);

        return Inertia::render('pages/edit', [
            'page' => $page
        ]);
    }

    public function update(Request $request, $id)
    {
        $page = Page::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Update slug if title changed
        $slug = $page->title !== $request->title 
            ? Page::createUniqueSlug($request->title) 
            : $page->slug;

        // Update page
        $page->update([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'is_published' => $request->has('is_published'),
            'published_at' => $request->has('is_published') && !$page->published_at ? now() : $page->published_at,
        ]);

        return redirect()->route('pages.index')
            ->with('success', 'Page updated successfully.');
    }

    public function destroy($id)
    {
        $page = Page::findOrFail($id);
        $page->delete();

        return redirect()->route('pages.index')
            ->with('success', 'Page deleted successfully.');
    }
}
