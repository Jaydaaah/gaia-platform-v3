<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamFileSharedAccepted extends Model
{
    protected $table = 'exam_file_shared_accepted';
    protected $fillable = ['exam_file_id', 'user_id'];

    public function examFile()
    {
        return $this->belongsTo(ExamFile::class, 'exam_file_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
