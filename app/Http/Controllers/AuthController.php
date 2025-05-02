<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request) {
        if (Auth::attempt($request->only(['email', 'password']))) {
            $user = Auth::user();
            $user->tokens()->delete();
            $token = $user->createToken('Api token')->plainTextToken;
            return response()->json(['token' => $token], 200);
        }
        return response()->json(['message' => 'Invalid fields', 'errors' => ['total' => ['Неверный e-mail или пароль']]], 422);
    }

    public function register(RegisterRequest $request) {
        $user = new User($request->all());
        $user->role = false;
        $image = $request->file('image');
        if ($image) {
            $image_name = uniqid() . '.' . $image->getClientOriginalExtension();
            $image->storeAs('avatars', $image_name, 'public');
            $user->image = $image_name;
        }
        $user->save();
        return response()->noContent(201);
    }

    public function logout(Request $request) {
        $user = Auth::user();
        $user->tokens()->delete();
        return response()->noContent(204);
    }
}
