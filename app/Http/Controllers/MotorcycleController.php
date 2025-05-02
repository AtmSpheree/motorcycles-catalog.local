<?php

namespace App\Http\Controllers;

use App\Http\Requests\MotorcycleRequest;
use App\Http\Resources\MotorcycleResource;
use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MotorcycleController extends Controller
{
    public function index(Request $request) {
        $motorcycles = Motorcycle::get();
        return response()->json(['data' => MotorcycleResource::collection($motorcycles)]);
    }

    public function store(MotorcycleRequest $request) {
        $user = Auth::user();
        if ($user->role) {
            $motorcycle = new Motorcycle($request->all());
            $motorcycle->save();
            return response()->json(['data' => new MotorcycleResource($motorcycle)], 201);
        }
        return response()->json(['message' => 'Forbidden.'], 403);
    }

    public function update(MotorcycleRequest $request, $motorcycle_id) {
        $user = Auth::user();
        if ($user->role) {
            $motorcycle = Motorcycle::where('id', $motorcycle_id);
            if ($motorcycle->first()) {
                $motorcycle->update(['name' => $request->input('name')]);
                return response()->json(['data' => new MotorcycleResource($motorcycle->first())]);
            }
            return response()->json(['message' => 'Not found.'], 404);
        }
        return response()->json(['message' => 'Forbidden.'], 403);
    }

    public function destroy(Request $request, $motorcycle_id) {
        $user = Auth::user();
        if ($user->role) {
            $motorcycle = Motorcycle::where('id', $motorcycle_id);
            if ($motorcycle->first()) {
                if (count($motorcycle->first()->posts) > 0) {
                    return response()->json(['message' => 'There are posts with this motorcycle.'], 403);
                }
                $motorcycle->delete();
                return response()->noContent();
            }
            return response()->json(['message' => 'Not found.'], 404);
        }
        return response()->json(['message' => 'Forbidden.'], 403);
    }
}
