<?php

namespace App\Http\Controllers;

use App\Models\ExamFile;
use App\Models\ExamFileSharedAccepted;
use App\Models\Folder;
use App\Trait\canDoToast;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExamFileController extends Controller
{
    use canDoToast;


    public function accept(Request $request)
    {
        $request->validate([
            'exam_file_id' => 'required|exists:exam_files,id'
        ]);

        $exam_file_id = $request->input('exam_file_id');

        $examFile = ExamFile::with('shareable')->findOrFail($exam_file_id);

        $user = Auth::user();

        if (
            $examFile->owner_id == $user->id ||
            $examFile->shareable->contains('id', $user->id)
        ) {
            $examFile->accepted()->create([
                'user_id' => $user->id,
            ]);
            return $this->sendToast("success", "Successfully accepted file");
        } else {
            return $this->sendToast('error', 'You dont have the permission to accept this item');
        }
    }

    public function destroy(int $exam_file_id)
    {
        $user = Auth::user();

        $examFile = ExamFile::findOrFail($exam_file_id);
        if ($examFile->owner_id == $user->id) {
            $examFile->delete();
            return $this->sendToast('warning', 'Successfully deleted target file');
        } else if ($examFile->shareable->contains($user->id)) {
            $examFile->shareable()->detach($user->id);
            return $this->sendToast('warning', 'ExamFile removed from your account');
        }
    }

    public function move(int $exam_file_id, Request $request)
    {
        $examFile = ExamFile::with('shareable')->findOrFail($exam_file_id);

        $request->validate([
            'origin_folder_id' => 'nullable|exists:folders,id',
            'target_folder_id' => 'nullable|exists:folders,id'
        ]);

        $user = Auth::user();
        $origin_folder_id = $request->input('origin_folder_id');
        $target_folder_id = $request->input('target_folder_id');

        if (
            $examFile->owner_id == $user->id ||
            $examFile->shareable->contains('id', $user->id)
        ) {
            try {
                $origin_folder = Folder::find($origin_folder_id);
                $target_folder = Folder::find($target_folder_id);

                if ($origin_folder) {
                    $origin_folder->exam_files()->detach($examFile->id);
                }
                if ($target_folder) {
                    $target_folder->exam_files()->syncWithoutDetaching([$examFile->id]);
                }
                return $this->sendToast('success', 'Successfully move the exam file');
            } catch (Exception) {
                return $this->sendToast('error', 'Something went wrong. attempting to move file');
            }
        } else {
            return $this->sendToast('error', 'You dont have the permission to move this item');
        }
    }
}
