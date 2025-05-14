<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRating extends Model
{
    protected $table = 'user_ratings';

    protected $fillable = ['user_id', 'rating', 'feedback'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
