<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamBot extends Model
{
    protected $table = 'exam_bots';

    protected $fillable = ['name', 'exam_file_id'];

    public function exam_file()
    {
        return $this->belongsTo(ExamFile::class);
    }
}
