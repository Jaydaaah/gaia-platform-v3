<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Trait\canDoToast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RateUsController extends Controller
{
    use canDoToast;

    public function create()
    {
        $user = User::find(Auth::id());
        return Inertia::render('RateUs/RateUsPage', ['has_rating' => !!$user->rating]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:0|max:5',
            'feedback' => 'required|string|min:3|max:1200'
        ]);
        $user = User::find(Auth::id());

        abort_if(!!$user->rating, "You already have a response");

        $rating = $request->input('rating', 0);
        $feedback = $request->input('feedback', '');


        $result = $user->rating()->create([
            'rating' => $rating,
            'feedback' => $feedback
        ]);

        if ($result) {
            return $this->sendToast('success', "Response Submitted. Thank you for Rating us...");
        } else {
            return $this->sendToast('error', "Something went wrong while creating response.");
        }
    }
}
