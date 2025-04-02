<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Smalot\PdfParser\Parser;

class FileUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'upload' => 'required|file|mimes:pdf,docx,txt|max:102400'
        ]);

        $file = $request->file('upload');

        abort_if(!$file, 403);

        $path = $request->file('upload')->store('uploads', 'local');

        $text = '';

        if ($file->getClientOriginalExtension() === 'pdf') {
            $parser = new Parser();
            $pdf = $parser->parseFile($file->getPathname());
            $text = $pdf->getText();
            dd([$text]);
        }

        return Inertia::render('Dashboard/UploadPage/UploadPage', ['path' => $path]);
    }
}
