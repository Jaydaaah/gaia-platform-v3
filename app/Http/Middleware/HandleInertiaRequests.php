<?php

namespace App\Http\Middleware;

use App\Models\ExamFile;
use App\Models\TakenTest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $test_link = array();
        if (env('SHOW_PRETEST', false)) {
            $test_link['pretest'] = env('PRETEST_LINK');
        }
        if (env('SHOW_POSTTEST', false)) {
            $test_link['posttest'] = env('POSTTEST_LINK');
        }
        if (env('SHOW_FEEDBACK', false)) {
            $test_link['feedback'] = env('FEEDBACK_LINK');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'toast' => session('toast'),
            'shared_to_you' => Inertia::defer(
                fn() => ExamFile::whereHas('shareable', function ($query) {
                    $query->where('users.id', Auth::id());
                })
                    ->where(function ($query) {
                        $query->whereDoesntHave('folders')
                            ->orWhereHas('folders', function ($q) {
                                $q->where('owner_id', '!=', Auth::id());
                            });
                    })
                    ->whereDoesntHave('accepted', function ($query) {
                        $query->where('user_id', Auth::id());
                    })
                    ->get()
            ),
            'test_link' => $test_link
        ];
    }
}
