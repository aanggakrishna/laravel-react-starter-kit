<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    // Tambahkan kolom baru ke $fillable
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'avatar',
        'credits',
        'is_premium',
        'premium_expires_at',
    ];
    
    
    
    // Tambahkan relasi ke credit_transactions
    public function creditTransactions()
    {
        return $this->hasMany(CreditTransaction::class);
    }
    
    // Tambahkan method untuk mengecek status premium
    public function isPremium(): bool
    {
        return $this->is_premium && $this->premium_expires_at > now();
    }
    
    // Tambahkan method untuk menambah kredit
    public function addCredits(int $amount, string $description = null, string $type = 'admin_adjustment'): void
    {
        $this->credits += $amount;
        $this->save();
        
        // Catat transaksi
        $this->creditTransactions()->create([
            'transaction_type' => $type,
            'amount' => $amount,
            'description' => $description,
        ]);
    }
    
    // Tambahkan method untuk menggunakan kredit
    public function useCredits(int $amount, string $description = null): bool
    {
        if ($this->credits < $amount) {
            return false;
        }
        
        $this->credits -= $amount;
        $this->save();
        
        // Catat transaksi
        $this->creditTransactions()->create([
            'transaction_type' => 'usage',
            'amount' => -$amount,
            'description' => $description,
        ]);
        
        return true;
    }
    
    // Tambahkan method untuk mengaktifkan premium
    public function activatePremium(int $days): void
    {
        $this->is_premium = true;
        
        // Jika sudah premium, tambahkan hari ke tanggal kedaluwarsa yang ada
        if ($this->premium_expires_at && $this->premium_expires_at > now()) {
            $this->premium_expires_at = $this->premium_expires_at->addDays($days);
        } else {
            $this->premium_expires_at = now()->addDays($days);
        }
        
        $this->save();
    }
    
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'premium_expires_at' => 'datetime',
            'is_premium' => 'boolean',
        ];
    }
    
    /**
     * Get the posts for the user.
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * Get the pages for the user.
     */
    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }

    /**
     * The roles that belong to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Check if the user has a specific role.
     *
     * @param string|Role $role
     * @return bool
     */
    public function hasRole($role): bool
    {
        if (is_string($role)) {
            return $this->roles()->where('slug', $role)->exists();
        }

        return $this->roles()->where('id', $role->id)->exists();
    }

    /**
     * Check if the user has any of the given roles.
     *
     * @param array $roles
     * @return bool
     */
    public function hasAnyRole(array $roles): bool
    {
        foreach ($roles as $role) {
            if ($this->hasRole($role)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the user has all of the given roles.
     *
     * @param array $roles
     * @return bool
     */
    public function hasAllRoles(array $roles): bool
    {
        foreach ($roles as $role) {
            if (!$this->hasRole($role)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if the user has a specific permission through their roles.
     *
     * @param string|Permission $permission
     * @return bool
     */
    public function hasPermission($permission): bool
    {
        foreach ($this->roles as $role) {
            if ($role->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Assign a role to the user.
     *
     * @param string|Role $role
     * @return $this
     */
    public function assignRole($role)
    {
        $roleId = is_string($role) 
            ? Role::where('slug', $role)->firstOrFail()->id 
            : $role->id;

        $this->roles()->syncWithoutDetaching($roleId);

        return $this;
    }
}
