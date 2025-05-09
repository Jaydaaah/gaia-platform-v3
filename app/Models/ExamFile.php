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

    public function message()
    {
        return $this->hasMany(Message::class);
    }

    public function notes()
    {
        return $this->hasMany(ExamNotes::class, 'exam_file_id');
    }

    public function exam_bot()
    {
        return $this->hasOne(ExamBot::class, 'exam_file_id');
    }

    public function accepted()
    {
        return $this->hasMany(ExamFileSharedAccepted::class, 'exam_file_id');
    }
}
