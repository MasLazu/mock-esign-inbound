<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EsignForwardController extends Controller
{
    public function forward(Request $request)
    {
        // Validate required fields (file, esign_url, application_code, application_secret)
        $validated = $request->validate([
            'file' => 'required|file|max:5120|mimes:pdf,jpeg,png',
            'esign_url' => 'required|string',
            'application_code' => 'required|string',
            'application_secret' => 'required|string',
        ]);

        $file = $request->file('file');
        $formData = [
            [
                'name' => 'File',
                'contents' => fopen($file->getRealPath(), 'r'),
                'filename' => $file->getClientOriginalName(),
                'headers' => [
                    'Content-Type' => $file->getMimeType(),
                ],
            ],
            ['name' => 'DocumentDate', 'contents' => now()->toIso8601String()],
            ['name' => 'Name', 'contents' => $file->getClientOriginalName()],
            ['name' => 'AdministratorId', 'contents' => '6314e175-1981-4663-9ab9-325e4de9e8e5'],
            ['name' => 'AdministratorRoleCode', 'contents' => 'document-administrator'],
            ['name' => 'DocumentCategoryId', 'contents' => '0196eb52-568f-73c3-8324-2e9588751be8'],
        ];

        $response = Http::withHeaders([
            'X-Application-Code' => $validated['application_code'],
            'X-Webhook-Secret' => $validated['application_secret'],
        ])->attach(
            'File',
            fopen($file->getRealPath(), 'r'),
            $file->getClientOriginalName()
        )->asMultipart()->post($validated['esign_url'], [
            'DocumentDate' => now()->toIso8601String(),
            'Name' => $file->getClientOriginalName(),
            'AdministratorId' => '6314e175-1981-4663-9ab9-325e4de9e8e5',
            'AdministratorRoleCode' => 'document-administrator',
            'DocumentCategoryId' => '0196eb52-568f-73c3-8324-2e9588751be8',
        ]);

        return response()->json([
            'success' => $response->successful(),
            'data' => $response->json(),
            'status' => $response->status(),
        ], $response->status());
    }
}
