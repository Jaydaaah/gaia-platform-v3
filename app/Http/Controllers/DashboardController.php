<?php

namespace App\Http\Controllers;

use App\Models\ExamFile;
use App\Models\ExamFileSharedAccepted;
use App\Models\Folder;
use App\Models\User;
use App\Trait\canDoToast;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use canDoToast;

    public function index()
    {
        $user = User::find(Auth::id());

        return Inertia::render('Dashboard/Dashboard', [
            'hierarchy' => [],
            'folder_id' => null,
            'folder_name' => null,
            'folders' => Inertia::defer(
                fn() => $user ? $user
                    ->folders()
                    ->whereNull('parent_id')
                    ->orderBy('name', 'asc')
                    ->get() : []
            ),
            'files' => Inertia::defer(
                fn() => ExamFile::where(function ($query) use ($user) {
                    $query->where('owner_id', $user->id)
                        ->orWhere(function ($subQuery) use ($user) {
                            $subQuery->where('owner_id', '!=', $user->id)
                                ->whereHas('accepted', function ($q) use ($user) {
                                    $q->where('user_id', $user->id);
                                });
                        });
                })
                    ->where(function ($query) use ($user) {
                        $query->whereDoesntHave('folders')
                            ->orWhereHas('folders', function ($q) use ($user) {
                                $q->where('owner_id', '!=', $user->id);
                            });
                    })
                    ->orderBy('name', 'asc')
                    ->get() ?? []
            ),
            'parent_id' => null
            // 'shared_to_you' => Inertia::defer(
            //     fn() => ExamFile::whereHas('shareable', function ($query) {
            //         $query->where('users.id', Auth::id());
            //     })
            //         ->where(function ($query) {
            //             $query->whereDoesntHave('folders')
            //                 ->orWhereHas('folders', function ($q) {
            //                     $q->where('owner_id', '!=', Auth::id());
            //                 });
            //         })
            //         ->whereDoesntHave('accepted', function ($query) {
            //             $query->where('user_id', Auth::id());
            //         })
            //         ->get()
            // )
        ]);
    }

    public function show(int $folder_id)
    {
        $folder = Folder::findOrFail($folder_id);
        $user = User::find(Auth::id());

        return Inertia::render('Dashboard/Dashboard', [
            'hierarchy' => Inertia::defer(
                fn() => $folder->getFolderHierarchy()
            ),
            'folder_id' => $folder->id,
            'folder_name' => $folder->name,
            'folders' => Inertia::defer(
                fn() => $folder
                    ->subfolders()
                    ->where('owner_id', $user->id)
                    ->orderBy('name', 'asc')
                    ->get()
            ),
            'files' => Inertia::defer(
                fn() => $folder->exam_files()
                    ->orderBy('name', 'asc')
                    ->get() ?? []
            ),
            'parent_id' => $folder->parent_id
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'parent_id' => 'nullable|exists:folders,id',
            'name' => [
                'required',
                'min:2',
                'max:120',
                Rule::unique('folders')->where(function ($query) use ($request) {
                    return $query->where('parent_id', $request->parent_id);
                })->ignore($request->id),
            ],
        ]);

        $parent_id = $request->input('parent_id');
        $name = $request->input('name');
        $owner_id = Auth::id();

        Folder::create([
            'name' => $name,
            'parent_id' => $parent_id,
            'owner_id' => $owner_id
        ]);

        return $this->sendToast('success', 'Successfully created folder');
    }

    public function update(int $dashboard, Request $request)
    {
        $request->validate([
            'type' => 'required|in:folder,examfile',
            'origin_folder_id' => 'nullable|exists:folders,id',
            'target_folder_id' => 'nullable|exists:folders,id'
        ]);

        $user = User::find(Auth::id());
        $origin_folder_id = $request->input('origin_folder_id');
        $target_folder_id = $request->input('target_folder_id');

        $type = $request->input('type');

        if ($type == 'folder') {
            $folder = Folder::findOrFail($dashboard);

            abort_unless($folder->owner_id == $user->id, 403);

            $folder->parent_id = $target_folder_id;
            $folder->save();

            return $this->sendToast('warning', 'Successfully deleted target folder');
        } else if ($type == 'examfile') {
            try {
                $examFile = ExamFile::findOrFail($dashboard);

                abort_unless($examFile->owner_id == $user->id || $examFile->shareable->contains($user->id), 403);

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
        }
    }

    public function destroy(int $dashboard, Request $request)
    {
        $request->validate([
            'type' => 'required|in:folder,examfile'
        ]);

        $user = User::find(Auth::id());

        $type = $request->input('type');

        if ($type == 'folder') {
            $folder = Folder::findOrFail($dashboard);

            abort_unless($folder->owner_id == $user->id, 403);
            $folder->delete();
            return $this->sendToast('warning', 'Successfully deleted target folder');
        } else if ($type == 'examfile') {
            $examFile = ExamFile::with('shareable')->findOrFail($dashboard);
            if ($examFile->owner_id == $user->id) {
                $examFile->delete();
                return $this->sendToast('warning', 'Successfully deleted target file');
            } else {
                $examFile->shareable()->detach($user->id);
                ExamFileSharedAccepted::where('user_id', $user->id)->where('exam_file_id', $dashboard)->delete();
                return $this->sendToast('warning', 'Removed from your account');
            }
        }

        return $this->sendToast('error', 'No type deleted');
    }
}
