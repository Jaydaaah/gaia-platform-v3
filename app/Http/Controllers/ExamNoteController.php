<?php

namespace App\Http\Controllers;

use App\Models\ExamNotes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExamNoteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'exam_id' => 'required|exists:exam_files,id',
            'content' => 'required|string',
        ]);

        $owner_id = Auth::id();
        $exam_id = $request->input('exam_id');
        $content = $request->input('content');

        ExamNotes::updateOrCreate(
            [
                'exam_file_id' => $exam_id,
                'owner_id' => $owner_id
            ],
            [
                'content' => $content
            ]
        );
    }
}
