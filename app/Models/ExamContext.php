<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamContext extends Model
{
    protected $table = 'exam_contexts';

    protected $fillable = ['content', 'instruction', 'extension', 'filename', 'path', 'exam_file_id'];

    public function ExamFile()
    {
        return $this->belongsTo(ExamFile::class, 'exam_file_id');
    }
}
