<?php

namespace App\Trait;

use Illuminate\Support\Str;

trait canDoToast
{
    protected function sendToast(string $type, string $message)
    {
        if (!in_array($type, ["default", "error", "success", "info", "warning"])) {
            throw new \InvalidArgumentException("Invalid status type.");
        }

        return back()->with('toast', [
            'requestId' => Str::uuid(),
            'type' => $type,
            'message' => $message,
        ]);
    }

    protected function withToast(string $type, string $message)
    {
        if (!in_array($type, ["default", "error", "success", "info", "warning"])) {
            throw new \InvalidArgumentException("Invalid status type.");
        }

        return [
            'requestId' => Str::uuid(),
            'type' => $type,
            'message' => $message,
        ];
    }
}
