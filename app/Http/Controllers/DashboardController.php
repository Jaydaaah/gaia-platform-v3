<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use App\Models\User;
use App\Trait\canDoToast;
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
            'parent_id' => null,
            'folder_name' => null,
            'folders' => Inertia::defer(
                fn() => $user ? $user
                    ->folders()
                    ->whereNull('parent_id')
                    ->orderBy('name', 'asc')
                    ->get() : []
            ),
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
            'parent_id' => $folder->id,
            'folder_name' => $folder->name,
            'folders' => Inertia::defer(
                fn() => $folder
                    ->subfolders()
                    ->where('owner_id', $user->id)
                    ->orderBy('name', 'asc')
                    ->get()
            ),
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

        $created_folder = Folder::create([
            'name' => $name,
            'parent_id' => $parent_id,
            'owner_id' => $owner_id
        ]);

        return $this->sendToast($created_folder->id, 'success', 'Successfully created folder');
    }

    public function destroy(int $folder_id)
    {
        $folder = Folder::findOrFail($folder_id);
        $user = User::find(Auth::id());

        abort_unless($folder->owner_id == $user->id, 403);

        $folder->delete();

        return $this->sendToast($folder->id, 'warning', 'Successfully deleted target folder');
    }
}
