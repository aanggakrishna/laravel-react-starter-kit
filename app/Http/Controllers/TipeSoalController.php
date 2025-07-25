<?php

namespace App\Http\Controllers;

use App\Models\TipeSoal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipeSoalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tipeSoals = TipeSoal::all();
        return Inertia::render('soal/tipe-soal/index', [
            'tipeSoals' => $tipeSoals
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('soal/tipe-soal/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:tipe_soals,nama',
        ]);

        TipeSoal::create([
            'nama' => $request->nama,
        ]);

        return redirect()->route('tipe-soals.index')
            ->with('success', 'Tipe Soal created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tipeSoal = TipeSoal::findOrFail($id);
        return Inertia::render('soal/tipe-soal/show', [
            'tipeSoal' => $tipeSoal
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $tipeSoal = TipeSoal::findOrFail($id);
        return Inertia::render('soal/tipe-soal/edit', [
            'tipeSoal' => $tipeSoal
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tipeSoal = TipeSoal::findOrFail($id);

        $request->validate([
            'nama' => 'required|string|max:255|unique:tipe_soals,nama,' . $tipeSoal->id,
        ]);

        $tipeSoal->update([
            'nama' => $request->nama,
        ]);

        return redirect()->route('tipe-soals.index')
            ->with('success', 'Tipe Soal updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tipeSoal = TipeSoal::findOrFail($id);
        $tipeSoal->delete();

        return redirect()->route('tipe-soals.index')
            ->with('success', 'Tipe Soal deleted successfully.');
    }
}