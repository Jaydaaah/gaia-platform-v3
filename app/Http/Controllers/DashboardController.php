<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = User::find(Auth::id());

        return Inertia::render('Dashboard/Dashboard', [
            'folders' => Inertia::defer(
                fn() => $user ? $user->folders()->whereNull('parent_id')->get() : []
            ),
        ]);
    }
}
