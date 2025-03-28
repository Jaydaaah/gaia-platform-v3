<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamFile extends Model
{
    protected $table = 'exam_files';

    protected $fillable = ['name'];

    public function folders()
    {
        return $this->belongsToMany(Folder::class, 'folder_exam_files');
    }

    public function shareable()
    {
        return $this->belongsToMany(User::class, 'users_exam_files');
    }
}
