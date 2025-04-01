<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Folder extends Model
{
    use SoftDeletes;
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

    public function getFolderHierarchy(): array
    {
        $folders = [];
        $currentFolder = $this;

        while ($currentFolder) {
            array_unshift($folders, $currentFolder);
            $currentFolder = $currentFolder->parent_folder;
        }

        return $folders;
    }
}
