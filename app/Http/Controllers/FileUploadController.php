<?php

namespace App\Http\Controllers;

use App\Instructions\GAIAInstruct;
use App\Models\ExamContext;
use App\Models\ExamFile;
use App\Models\Folder;
use App\Trait\canDoToast;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Smalot\PdfParser\Parser;

ini_set('memory_limit', '512M');

class FileUploadController extends Controller
{
    use canDoToast;

    public function download(int $exam_id)
    {
        $examFile = ExamFile::findOrFail($exam_id);
        $path = storage_path('app/private/' . $examFile->context->path);

        return response()->file($path);
    }

    public function store(Request $request)
    {
        $request->validate([
            'folder_id' => 'nullable|exists:folders,id',
            'upload' => 'required|file|mimes:pdf,docx,txt|max:102400'
        ]);

        $folder_id = $request->input('folder_id');
        $file = $request->file('upload');

        abort_if(!$file, 403);

        $pdfText = '';
        $instruction = '';

        if ($file->getClientOriginalExtension() === 'pdf') {
            $parser = new Parser();
            $pdf = $parser->parseFile($file->getPathname());
            $pdfText = $pdf->getText();

            $pdfText = mb_convert_encoding($pdfText, 'UTF-8', 'UTF-8');
            $pdfText = preg_replace('/[^\PC\s]/u', '', $pdfText);

            $instruction = GAIAInstruct::CONVERSION_INSTRUCTION;
            $prompt = str_replace('[Insert PDF text here]', $pdfText, $instruction);

            $model = Gemini::generativeModel('models/gemini-1.5-flash');
            $response = $model->generateContent($prompt);
            $instruction = $response->text();
        }

        $upload_path = $file->store('pdfs');

        abort_if(!$pdfText, 400);

        $examContext = ExamContext::create([
            'content' => $pdfText,
            'instruction' => $instruction,
            'extension' => $file->getClientOriginalExtension(),
            'filename' => $file->getClientOriginalName(),
            'path' => $upload_path
        ]);

        $examContext->save();

        return redirect()->route('file-upload.show', [
            'file_upload' => $examContext->id, // Use correct parameter name
            'folder_id' => $folder_id // Add as a query parameter
        ]);
    }

    public function show(int $file_upload, Request $request)
    {
        $request->validate([
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $examContext = ExamContext::findOrFail($file_upload);

        $folder_id = $request->input('folder_id');

        return Inertia::render('Dashboard/UploadPage/UploadPage', [
            'folder_id' => $folder_id,
            'filename' => $examContext->filename,
            'context' => $examContext,
        ]);
    }

    public function update(int $exam_context_id, Request $request)
    {
        $request->validate([
            'folder_id' => 'nullable|exists:folders,id',
            'name' => 'required|min:3|max:100',
            'bot_name' => 'required|min:3|max:16',
            'voice' => 'required|string',
            'subject' => 'required|min:3|max:120',
            'description' => 'required|min:3|max:1000'
        ]);

        $examContext = ExamContext::findOrFail($exam_context_id);

        $name = $request->input('name');
        $bot_name = $request->input('bot_name');
        $voice = $request->input('voice');
        $subject = $request->input('subject');
        $description = $request->input('description');
        $user_id = Auth::id();
        $folder_id = $request->input('folder_id');

        $examFile = ExamFile::create([
            'name' => $name,
            'subject' => $subject,
            'description' => $description,
            'owner_id' => $user_id
        ]);

        $examFile->exam_bot()->create([
            'name' => $bot_name,
            'voice_uri' => $voice,
        ]);

        $examContext->exam_file_id = $examFile->id;

        if ($folder_id) {
            $folder = Folder::findOrFail($folder_id);
            $folder->exam_files()->attach($examFile->id);
        }

        $examContext->save();

        return redirect()->to(route('dashboard.index'))->with('toast', $this->withToast('success', 'Successfully uploaded file'));
    }

    public function destroy(int $exam_context_id)
    {
        $examContext = ExamContext::find($exam_context_id);

        if ($examContext) {
            $examContext->delete();
        }

        return redirect()->to(route('dashboard.index'))->with('toast', $this->withToast('warning', 'Operation Cancelled'));
    }
}
