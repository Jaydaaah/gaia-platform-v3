<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    protected $table = 'folders';

    protected $fillable = ['name', 'owner_id', 'parent_id'];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function subfolders()
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }

    public function parent_folder()
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    public function exam_files()
    {
        return $this->belongsToMany(ExamFile::class, 'folder_exam_files');
    }
}
