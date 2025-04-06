<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamNotes extends Model
{
    protected $table = 'exam_notes';

    protected $fillable = ['content', 'exam_file_id', 'owner_id'];

    public function exam_file()
    {
        return $this->belongsTo(ExamFile::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
