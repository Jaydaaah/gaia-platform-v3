<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExamFile extends Model
{
    use SoftDeletes;

    protected $table = 'exam_files';

    protected $fillable = ['name', 'subject', 'description', 'owner_id'];

    public function context()
    {
        return $this->hasOne(ExamContext::class);
    }

    public function folders()
    {
        return $this->belongsToMany(Folder::class, 'folder_exam_files');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function shareable()
    {
        return $this->belongsToMany(User::class, 'users_exam_files');
    }
}
