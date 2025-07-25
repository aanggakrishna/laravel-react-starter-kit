<?php

namespace App\Http\Controllers;

use App\Models\Kerja;
use App\Models\KerjaDetail;
use App\Models\Prompt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KerjaController extends Controller
{
    public function start(Request $request, string $hashId)
    {
        $prompt = Prompt::findByHashId($hashId);
        
        if (!$prompt || !$prompt->is_public) {
            abort(404);
        }
        
        // Buat session ID untuk user anonim jika tidak login
        $sessionId = null;
        if (!Auth::check()) {
            $sessionId = $request->session()->get('kerja_session_id');
            if (!$sessionId) {
                $sessionId = Str::uuid();
                $request->session()->put('kerja_session_id', $sessionId);
            }
        }
        
        // Buat record kerja baru
        $kerja = Kerja::create([
            'user_id' => Auth::id(),
            'prompt_id' => $prompt->id,
            'session_id' => $sessionId,
            'waktu_mulai' => now(),
        ]);
        
        // Buat record kerja_details untuk setiap soal
        foreach ($prompt->details as $detail) {
            KerjaDetail::create([
                'kerja_id' => $kerja->id,
                'prompt_detail_id' => $detail->id,
            ]);
        }
        
        return Inertia::render('soal/public/kerjakan', [
            'prompt' => [
                'id' => $prompt->id,
                'hash_id' => $prompt->hash_id,
                'jenjang' => [
                    'nama' => $prompt->jenjang->nama,
                ],
                'tipe_soal' => [
                    'nama' => $prompt->tipeSoal->nama,
                ],
                'perintah' => $prompt->perintah,
                'jumlah_soal' => $prompt->jumlah_soal,
                'waktu_pengerjaan' => $prompt->waktu_pengerjaan,
                'user' => [
                    'name' => $prompt->user->name,
                ],
                'details' => $prompt->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'soal' => $detail->soal,
                        'pilihan' => $detail->pilihan,
                    ];
                }),
            ],
            'kerja_id' => $kerja->id,
            'is_authenticated' => Auth::check(),
        ]);
    }
    
    public function saveAnswer(Request $request)
    {
        $request->validate([
            'kerja_id' => 'required|exists:kerjas,id',
            'prompt_detail_id' => 'required|exists:prompt_details,id',
            'jawaban' => 'required|string',
        ]);
        
        $kerja = Kerja::findOrFail($request->kerja_id);
        $promptDetail = $kerja->prompt->details()->where('id', $request->prompt_detail_id)->firstOrFail();
        
        // Cek apakah user yang login adalah pemilik kerja ini atau session ID cocok
        if (Auth::check()) {
            if ($kerja->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            if ($kerja->session_id !== $request->session()->get('kerja_session_id')) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        
        // Update jawaban
        $kerjaDetail = KerjaDetail::where('kerja_id', $kerja->id)
            ->where('prompt_detail_id', $request->prompt_detail_id)
            ->firstOrFail();
            
        $kerjaDetail->update([
            'jawaban_user' => $request->jawaban,
            'is_correct' => $promptDetail->jawaban_benar === $request->jawaban,
        ]);
        
        return response()->json(['success' => true]);
    }
    
    public function submit(Request $request)
    {
        $request->validate([
            'kerja_id' => 'required|exists:kerjas,id',
        ]);
        
        $kerja = Kerja::with('details.promptDetail')->findOrFail($request->kerja_id);
        
        // Cek apakah user yang login adalah pemilik kerja ini atau session ID cocok
        if (Auth::check()) {
            if ($kerja->user_id !== Auth::id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            if ($kerja->session_id !== $request->session()->get('kerja_session_id')) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        
        // Hitung nilai
        $totalSoal = $kerja->details->count();
        $jawabanBenar = $kerja->details->where('is_correct', true)->count();
        $nilai = $totalSoal > 0 ? round(($jawabanBenar / $totalSoal) * 100) : 0;
        
        // Update kerja
        $kerja->update([
            'waktu_selesai' => now(),
            'nilai' => $nilai,
            'is_completed' => true,
        ]);
        
        // Ambil data lengkap untuk hasil
        $prompt = $kerja->prompt;
        $details = $prompt->details->map(function ($detail) use ($kerja) {
            $kerjaDetail = $kerja->details->where('prompt_detail_id', $detail->id)->first();
            
            return [
                'id' => $detail->id,
                'soal' => $detail->soal,
                'pilihan' => $detail->pilihan,
                'jawaban' => $detail->jawaban,
                'jawaban_benar' => $detail->jawaban_benar,
                'penjelasan' => $detail->penjelasan,
                'keterangan_tambahan' => $detail->keterangan_tambahan,
                'jawaban_user' => $kerjaDetail ? $kerjaDetail->jawaban_user : null,
                'is_correct' => $kerjaDetail ? $kerjaDetail->is_correct : false,
            ];
        });
        
        return Inertia::render('soal/public/hasil', [
            'prompt' => [
                'id' => $prompt->id,
                'hash_id' => $prompt->hash_id,
                'jenjang' => [
                    'nama' => $prompt->jenjang->nama,
                ],
                'tipe_soal' => [
                    'nama' => $prompt->tipeSoal->nama,
                ],
                'perintah' => $prompt->perintah,
                'user' => [
                    'name' => $prompt->user->name,
                ],
            ],
            'kerja' => [
                'id' => $kerja->id,
                'waktu_mulai' => $kerja->waktu_mulai,
                'waktu_selesai' => $kerja->waktu_selesai,
                'nilai' => $nilai,
                'details' => $details,
            ],
        ]);
    }
    
    public function downloadWord(string $kerjaId)
    {
        // Implementasi download word di sini
        // Gunakan library seperti PhpWord untuk membuat dokumen Word
    }
    
    public function hasil(string $kerjaId)
    {
        $kerja = Kerja::with(['details.promptDetail'])->findOrFail($kerjaId);
        $prompt = $kerja->prompt;
        
        if (!$prompt->is_public && !Auth::check()) {
            abort(403);
        }
        
        return Inertia::render('soal/public/hasil', [
            'prompt' => [
                'id' => $prompt->id,
                'hash_id' => $prompt->hash_id,
                'jenjang' => [
                    'nama' => $prompt->jenjang->nama,
                ],
                'tipe_soal' => [
                    'nama' => $prompt->tipeSoal->nama,
                ],
                'perintah' => $prompt->perintah,
                'user' => [
                    'name' => $prompt->user->name,
                ],
            ],
            'kerja' => [
                'id' => $kerja->id,
                'waktu_mulai' => $kerja->waktu_mulai,
                'waktu_selesai' => $kerja->waktu_selesai,
                'nilai' => $kerja->nilai,
                'details' => $kerja->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'soal' => $detail->promptDetail->soal,
                        'pilihan' => $detail->promptDetail->pilihan,
                        'jawaban' => $detail->promptDetail->jawaban,
                        'jawaban_benar' => $detail->promptDetail->jawaban_benar,
                        'penjelasan' => $detail->promptDetail->penjelasan,
                        'keterangan_tambahan' => $detail->promptDetail->keterangan_tambahan,
                        'jawaban_user' => $detail->jawaban_user,
                        'is_correct' => $detail->is_correct,
                    ];
                }),
            ],
        ]);
    }
    
    public function riwayat()
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            return redirect()->route('login');
        }
        
        $user = Auth::user();
        $query = Kerja::with(['prompt.jenjang', 'prompt.tipeSoal', 'details', 'user'])
            ->where('is_completed', true);
        
        // Jika user bukan superadmin (tidak memiliki role admin), batasi hanya melihat miliknya sendiri
        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }
        
        $kerjas = $query->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('soal/riwayat/index', [
            'kerjas' => $kerjas,
            'is_admin' => $user->hasRole('admin'),
        ]);
    }
}
