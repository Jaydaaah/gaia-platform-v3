<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
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
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

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
        ];
    }

    public function folders()
    {
        return $this->hasMany(Folder::class, 'owner_id');
    }

    public function owned_exam()
    {
        return $this->hasMany(ExamFile::class, 'owner_id');
    }

    public function exam_files()
    {
        return $this->belongsToMany(ExamFile::class, 'users_exam_files');
    }

    public function notes()
    {
        return $this->hasMany(ExamNotes::class, 'owner_id');
    }

    public function accepted()
    {
        return $this->hasMany(ExamFileSharedAccepted::class, 'user_id');
    }

    public function rating()
    {
        return $this->hasOne(UserRating::class, 'user_id');
    }
}
