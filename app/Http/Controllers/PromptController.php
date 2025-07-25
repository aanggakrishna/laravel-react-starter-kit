<?php

namespace App\Http\Controllers;

use App\Models\Jenjang;
use App\Models\Prompt;
use App\Models\PromptDetail;
use App\Models\TipeSoal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt; // Tambahkan import ini
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class PromptController extends Controller
{
    public function index()
    {
        $prompts = Prompt::with(['jenjang', 'tipeSoal'])
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('soal/prompt/index', [
            'prompts' => $prompts
        ]);
    }

    public function create()
    {
        $jenjangs = Jenjang::all();
        $tipeSoals = TipeSoal::all();

        return Inertia::render('soal/prompt/create', [
            'jenjangs' => $jenjangs,
            'tipeSoals' => $tipeSoals,
        ]);
    }

    // Modifikasi method store untuk mengurangi kredit setelah soal berhasil dibuat
    public function store(Request $request)
    {
        $request->validate([
            'jenjang_id' => 'required|exists:jenjangs,id',
            'tipe_soal_id' => 'required|exists:tipe_soals,id',
            'jumlah_soal' => 'required|integer|min:1|max:20',
            'perintah' => 'nullable|string',
            'is_public' => 'boolean', // Tambahkan validasi is_public
        ]);
    
        // Hitung jumlah kredit yang dibutuhkan
        $isPublic = $request->is_public ?? false;
        $creditNeeded = $isPublic ? ceil($request->jumlah_soal / 2) : $request->jumlah_soal;
    
        // Cek apakah user memiliki kredit yang cukup
        $user = auth()->user();
        if ($user->credits < $creditNeeded) {
            return redirect()->route('prompts.index')
                ->with('error', 'Kredit tidak mencukupi. Anda membutuhkan ' . $creditNeeded . ' kredit untuk membuat soal ini.');
        }
    
        $jenjang = Jenjang::find($request->jenjang_id);
        $tipeSoal = TipeSoal::find($request->tipe_soal_id);
    
        // Buat prompt
        $prompt = Prompt::create([
            'user_id' => auth()->id(),
            'jenjang_id' => $request->jenjang_id,
            'tipe_soal_id' => $request->tipe_soal_id,
            'jumlah_soal' => $request->jumlah_soal,
            'perintah' => $request->perintah,
            'status' => 'pending',
            'is_public' => $isPublic, // Tambahkan is_public
        ]);
    
        // Buat prompt text
        $promptText = $this->generatePromptText(
            $request->jumlah_soal,
            $tipeSoal->nama,
            $jenjang->nama,
            $request->perintah
        );
    
        // Panggil OpenAI API
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openai.api_key'),
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant that generates educational questions.'],
                    ['role' => 'user', 'content' => $promptText],
                ],
                'temperature' => 0.7,
            ]);
    
            $responseData = $response->json();
    
            if (isset($responseData['error'])) {
                throw new \Exception($responseData['error']['message']);
            }
    
            $content = $responseData['choices'][0]['message']['content'];
            $usage = $responseData['usage'];
            $model = $responseData['model'];
    
            // Hitung biaya
            $costUsd = $this->calculateCost($usage['total_tokens'], $model);
            $costIdr = $costUsd * 16000; // 1 USD = 16000 IDR
    
            // Parse JSON dari respons
            $jsonContent = json_decode($content, true);
    
            // Update prompt dengan hasil
            $prompt->update([
                'result_json' => $jsonContent,
                'result_length' => $usage['total_tokens'],
                'cost_usd' => $costUsd,
                'cost_idr' => $costIdr,
                'model' => $model,
                'status' => 'completed',
            ]);
    
            // Simpan detail soal
            foreach ($jsonContent as $item) {
                // Cek apakah tipe soal adalah pilihan ganda (case insensitive)
                $isPilihanGanda = stripos($tipeSoal->nama, 'pilihan ganda') !== false;
                
                PromptDetail::create([
                    'prompt_id' => $prompt->id,
                    'soal' => $item['pertanyaan'],
                    'pilihan' => $isPilihanGanda && isset($item['pilihan']) ? $item['pilihan'] : null,
                    'jawaban' => $item['jawaban'],
                    'jawaban_benar' => $isPilihanGanda && isset($item['jawaban']) ? $item['jawaban'] : null,
                    'penjelasan' => $item['pembahasan'] ?? null,
                    'keterangan_tambahan' => $item['keterangan'] ?? null,
                ]);
            }
    
            // Kurangi kredit pengguna sesuai jumlah soal yang dibuat
            $user->useCredits(
                $creditNeeded, 
                'Pembuatan ' . $request->jumlah_soal . ' soal ' . $tipeSoal->nama . ' untuk jenjang ' . $jenjang->nama . 
                ($isPublic ? ' (Publik - 50% kredit)' : '')
            );
    
            return redirect()->route('prompts.show', $prompt->hash_id)
                ->with('success', 'Soal berhasil dibuat dan ' . $creditNeeded . ' kredit telah digunakan!' . 
                    ($isPublic ? ' Soal ini bersifat publik.' : ''));
    
        } catch (\Exception $e) {
            $prompt->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
    
            return redirect()->route('prompts.index')
                ->with('error', 'Gagal membuat soal: ' . $e->getMessage());
        }
    }
    
    // Modifikasi method show untuk menggunakan hash_id
    public function show(string $hashId)
    {
        try {
            $id = Crypt::decryptString($hashId);
            $prompt = Prompt::with(['jenjang', 'tipeSoal', 'details'])
                ->where('user_id', auth()->id())
                ->findOrFail($id);
    
            return Inertia::render('soal/prompt/show', [
                'prompt' => $prompt
            ]);
        } catch (\Exception $e) {
            return redirect()->route('prompts.index')
                ->with('error', 'Soal tidak ditemukan');
        }
    }
    
    // Modifikasi method downloadWord untuk menggunakan hash_id
    public function downloadWord(string $hashId)
    {
        try {
            $id = Crypt::decryptString($hashId);
            $prompt = Prompt::with(['jenjang', 'tipeSoal', 'details'])
                ->where('user_id', auth()->id())
                ->findOrFail($id);
    
            // Buat dokumen Word menggunakan PhpWord
            $phpWord = new \PhpOffice\PhpWord\PhpWord();
            $section = $phpWord->addSection();
            
            // Tambahkan judul
            $section->addText(
                "Soal {$prompt->jenjang->nama} - {$prompt->tipeSoal->nama}",
                ['bold' => true, 'size' => 16]
            );
            $section->addTextBreak();
            
            // Tambahkan informasi soal
            $section->addText("Jenjang: {$prompt->jenjang->nama}");
            $section->addText("Tipe Soal: {$prompt->tipeSoal->nama}");
            $section->addText("Jumlah Soal: {$prompt->jumlah_soal}");
            if ($prompt->perintah) {
                $section->addText("Perintah Tambahan: {$prompt->perintah}");
            }
            $section->addTextBreak();
            
            // Tambahkan soal-soal
            foreach ($prompt->details as $index => $detail) {
                $section->addText("Soal " . ($index + 1), ['bold' => true]);
                $section->addText($detail->soal);
                
                // Jika ada pilihan
                if ($detail->pilihan) {
                    foreach ($detail->pilihan as $key => $value) {
                        $section->addText("{$key}. {$value}");
                    }
                }
                
                $section->addText("Jawaban: " . ($detail->jawaban_benar ?? $detail->jawaban), ['bold' => true]);
                
                if ($detail->penjelasan) {
                    $section->addText("Pembahasan: {$detail->penjelasan}");
                }
                
                if ($detail->keterangan_tambahan) {
                    $section->addText("Keterangan: {$detail->keterangan_tambahan}");
                }
                
                $section->addTextBreak();
            }
            
            // Simpan file ke storage
            $fileName = "soal_{$prompt->jenjang->nama}_{$prompt->tipeSoal->nama}_{$id}.docx";
            $filePath = storage_path("app/public/documents/{$fileName}");
            
            // Pastikan direktori ada
            if (!file_exists(dirname($filePath))) {
                mkdir(dirname($filePath), 0755, true);
            }
            
            // Simpan file
            $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
            $objWriter->save($filePath);
            
            return response()->download($filePath, $fileName);
        } catch (\Exception $e) {
            return redirect()->route('prompts.index')
                ->with('error', 'Soal tidak ditemukan');
        }
    }

    private function generatePromptText(int $jumlahSoal, string $tipeSoal, string $jenjang, ?string $perintahTambahan): string
    {
        $promptText = "Buatkan saya {$jumlahSoal} soal {$tipeSoal} untuk jenjang {$jenjang} jika pilihan ganda buatlah pilihan yang variatif dan susah dibedakan";
        
        if ($perintahTambahan) {
            $promptText .= " {$perintahTambahan}";
        }
        
        $promptText .= ". \n\nFormat hasil harus berupa JSON dengan struktur array, misalnya untuk tipe_soal pilihan ganda: \n\n[
  {
    \"no\": 1,
    \"pertanyaan\": \"Siapa tokoh utama dalam cerita tersebut?\",
    \"pilihan\": {
      \"A\": \"Budi\",
      \"B\": \"Siti\",
      \"C\": \"Ibu\",
      \"D\": \"Ayah\"
    },
    \"jawaban\": \"A\",
    \"pembahasan\": \"Jawaban adalah A. Budi karena budi adalah tokoh utama\",
    \"keterangan\":\"terdapat pada text bahwa budi adalah ....\"
  },
  {
    \"no\": 2,
    \"pertanyaan\": \"Apa kegiatan yang dilakukan tokoh tersebut?\",
    ...
  },
]\n\nJawaban hanya output JSON valid tanpa penjelasan tambahan. pastikan kunci jawaban benar. jika matematika/rumus dapat menggunakan format LaTeX";

        return $promptText;
    }

    private function calculateCost(int $tokens, string $model): float
    {
        // Harga per 1000 token (sesuaikan dengan harga terbaru OpenAI)
        $rates = [
            'gpt-3.5-turbo' => 0.002, // $0.002 per 1K tokens
            'gpt-4' => 0.06, // $0.06 per 1K tokens
        ];

        $rate = $rates[$model] ?? 0.002;
        return ($tokens / 1000) * $rate;
    }
    


// Tambahkan metode untuk menampilkan soal publik
public function publicIndex(Request $request)
{
    $query = Prompt::with(['jenjang', 'tipeSoal', 'user'])
        ->where('is_public', true)
        ->where('status', 'completed')
        ->orderBy('created_at', 'desc');
    
    // Filter berdasarkan jenjang jika ada
    if ($request->has('jenjang')) {
        $query->whereHas('jenjang', function ($q) use ($request) {
            $q->where('nama', $request->jenjang);
        });
    }
    
    // Filter berdasarkan tipe soal jika ada
    if ($request->has('tipe_soal')) {
        $query->whereHas('tipeSoal', function ($q) use ($request) {
            $q->where('nama', $request->tipe_soal);
        });
    }
    
    $prompts = $query->paginate(12);
    $jenjangs = Jenjang::all();
    $tipeSoals = TipeSoal::all();
    
    return Inertia::render('soal/public/index', [
        'prompts' => $prompts,
        'jenjangs' => $jenjangs,
        'tipeSoals' => $tipeSoals,
        'filters' => $request->only(['jenjang', 'tipe_soal']),
    ]);
}

// Tambahkan metode untuk menampilkan detail soal publik
public function publicShow(string $hashId)
{
    try {
        $prompt = Prompt::findByHashId($hashId);
        
        if (!$prompt || !$prompt->is_public || $prompt->status !== 'completed') {
            return redirect()->route('soal.public')
                ->with('error', 'Soal tidak ditemukan atau tidak tersedia untuk publik');
        }
        
        // Tambah view count
        $prompt->incrementViewCount();
        
        // Load relasi yang dibutuhkan
        $prompt->load(['jenjang', 'tipeSoal', 'details', 'user']);
        
        return Inertia::render('soal/public/show', [
            'prompt' => $prompt
        ]);
    } catch (\Exception $e) {
        return redirect()->route('soal.public')
            ->with('error', 'Soal tidak ditemukan');
    }
}
}