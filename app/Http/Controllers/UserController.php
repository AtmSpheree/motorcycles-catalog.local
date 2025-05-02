<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Http\Resources\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(Request $request) {
        $user = Auth::user();
        return response()->json(['data' => new ProfileResource($user)]);
    }

    public function update(UserRequest $request) {
        $user = Auth::user();
        $user->update($request->only(['firstname', 'lastname', 'patronymic', 'password']));
        $image = $request->file('image');
        if ($image) {
            if ($user->image !== null) {
                $image->storeAs('avatars', $user->image, 'public');
            } else {
                $image_name = uniqid() . '.' . $image->getClientOriginalExtension();
                $user->update(['image' => $image_name]);
                $image->storeAs('avatars', $image_name, 'public');
            }
        }
        return response()->json(['data' => new ProfileResource($user)]);
    }
}
