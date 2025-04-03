<?php

namespace App\Http\Controllers;

use App\Models\ExamFile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{

    public function index() {}

    public function show(ExamFile $examFile)
    {
        return Inertia::render('Chat/ChatPage', ['exam_file' => $examFile]);
    }
}
