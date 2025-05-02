<?php

namespace App\Http\Controllers;

use App\Events\InviteUser;
use App\Models\ExamFile;
use App\Models\User;
use App\Trait\canDoToast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShareableController extends Controller
{
    use canDoToast;

    public function update(int $exam_file_id, Request $request)
    {
        $exam_file = ExamFile::findOrFail($exam_file_id);

        $user = Auth::user();

        abort_unless($user->id == $exam_file->owner_id, 403);

        $validated = $request->validate([
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        // Sync shareable users (replace with your actual relationship name if different)
        $syncResult = $exam_file->shareable()->sync($validated['user_ids'] ?? []);

        foreach ($syncResult['attached'] as $key => $user_id) {
            if ($user) {
                broadcast(new InviteUser($user_id));
            }
        }

        $this->sendToast('success', 'Notified added users');
    }
}
