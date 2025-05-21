<?php

use App\Http\Controllers\EsignForwardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('esign/forward', [EsignForwardController::class, 'forward']);
