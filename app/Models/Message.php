<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'messages';

    protected $fillable = ['exam_file_id', 'sender_id', 'is_gaia', 'content', 'responded'];

    public function exam_file()
    {
        return $this->belongsTo(ExamFile::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
