<?php

namespace App\Trait;

trait canDoToast
{
    protected function sendToast(int $requestId, string $type, string $message)
    {
        if (!in_array($type, ["default", "error", "success", "info", "warning"])) {
            throw new \InvalidArgumentException("Invalid status type.");
        }

        return back()->with('toast', [
            'requestId' => $requestId,
            'type' => $type,
            'message' => $message,
        ]);
    }
}
