<?php

namespace App\Trait;

trait canDoToast
{
    protected function sendToast(int $requestId, string $type, string $message)
    {
        if (!in_array($type, ['success', 'warning'])) {
            throw new \InvalidArgumentException("Invalid status type. Use 'success' or 'warning'.");
        }

        return back()->with('toast', [
            'requestId' => $requestId,
            'type' => $type,
            'message' => $message,
        ]);
    }
}
