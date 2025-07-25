<?php

namespace App\Http\Controllers;

use App\Models\Jenjang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JenjangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jenjangs = Jenjang::all();
        return Inertia::render('soal/jenjang/index', [
            'jenjangs' => $jenjangs
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('soal/jenjang/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:jenjangs,nama',
        ]);

        Jenjang::create([
            'nama' => $request->nama,
        ]);

        return redirect()->route('jenjangs.index')
            ->with('success', 'Jenjang created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $jenjang = Jenjang::findOrFail($id);
        return Inertia::render('soal/jenjang/show', [
            'jenjang' => $jenjang
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $jenjang = Jenjang::findOrFail($id);
        return Inertia::render('soal/jenjang/edit', [
            'jenjang' => $jenjang
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $jenjang = Jenjang::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255|unique:jenjangs,nama,' . $jenjang->id,
        ]);

        $jenjang->update([
            'nama' => $request->nama,
        ]);

        return redirect()->route('jenjangs.index')
            ->with('success', 'Jenjang updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $jenjang = Jenjang::findOrFail($id);
        $jenjang->delete();

        return redirect()->route('jenjangs.index')
            ->with('success', 'Jenjang deleted successfully.');
    }
}