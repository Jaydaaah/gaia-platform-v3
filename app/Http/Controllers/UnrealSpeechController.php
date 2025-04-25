<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class UnrealSpeechController extends Controller
{
    public function synthesize(Request $request)
    {
        // Validate incoming request
        $validated = $request->validate([
            'text' => 'required|string',
            'voice_id' => 'nullable|string',
            'bitrate' => 'nullable|string',
            'speed' => 'nullable|string',
            'pitch' => 'nullable|string',
        ]);

        // Create a unique cache key based on the text and other parameters
        $cacheKey = 'unreal_speech_' . md5($validated['text'] . json_encode($validated));

        // Check if the audio URL is already cached
        if (Cache::has($cacheKey)) {
            return response()->json(['audioUrl' => Cache::get($cacheKey)]);
        }

        // Prepare payload for Unreal Speech API
        $payload = [
            'Text' => $validated['text'],
            'VoiceId' => $validated['voice_id'] ?? 'Scarlett',
            'Bitrate' => $validated['bitrate'] ?? '192k',
            'Speed' => $validated['speed'] ?? '0',
            'Pitch' => $validated['pitch'] ?? '1',
        ];

        try {
            // Make the request to Unreal Speech
            $response = Http::withHeaders([
                'accept' => 'application/json',
                'content-type' => 'application/json',
                'Authorization' => 'Bearer ' . env('UNREAL_SPEECH_API_KEY'),
            ])->post('https://api.v7.unrealspeech.com/speech', $payload);

            // Check for a valid response
            $audioUrl = $response->json()['AudioUrl'] ?? null;

            if (!$audioUrl) {
                return response()->json(['error' => 'Failed to generate audio URL'], 500);
            }

            // Cache the audio URL for 24 hours (or adjust cache duration as needed)
            Cache::put($cacheKey, $audioUrl, now()->addHours(24));

            return response()->json(['audioUrl' => $audioUrl]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }
}
