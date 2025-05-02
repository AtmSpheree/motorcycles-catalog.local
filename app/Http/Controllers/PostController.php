<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChangePostRequest;
use App\Http\Requests\ImageRequest;
use App\Http\Requests\PostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\CatalogPostResource;
use App\Http\Resources\PostResource;
use App\Models\Image;
use App\Models\Motorcycle;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function get_catalog(Request $request) {
        $posts = Post::where('status', 3)->get();
        return response()->json(['data' => CatalogPostResource::collection($posts)]);
    }

    public function get_own_posts(Request $request) {
        $user = Auth::user();
        $posts = Post::where('user_id', $user->id)->get();
        return response()->json(['data' => PostResource::collection($posts)]);
    }

    public function get_posts(Request $request) {
        $user = Auth::user();
        if ($user->role) {
            $posts = Post::all();
            return response()->json(['data' => PostResource::collection($posts)]);
        }
        return response()->json(['message' => 'Forbidden.'], 403);
    }

    public function store(PostRequest $request) {
        $user = Auth::user();
        $motorcycle = Motorcycle::where('name', $request->input('motorcycle'))->first();
        $post = new Post($request->all());
        $post->status = 0;
        $post->user_id = $user->id;
        $post->motorcycle_id = $motorcycle->id;
        $post->save();
        $images = $request->file('images');
        if ($images) {
            foreach ($images as $image) {
                $image_name = uniqid() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('images', $image_name, 'public');
                $img = new Image();
                $img->image = $image_name;
                $img->post_id = $post->id;
                $img->save();
            }
        }
        return response()->json(['data' => new PostResource($post)], 201);
    }

    public function destroy(Request $request, $post_id) {
        $user = Auth::user();
        $post = Post::where('id', $post_id);
        if ($post->first()) {
            if ($post->first()->user_id == $user->id) {
                $images = Image::where('post_id', $post->first()->id)->get();
                foreach ($images as $image) {
                    Storage::disk('public')->delete('images/' . $image->image);
                }
                $post->delete();
                return response()->noContent();
            }
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        return response()->json(['message' => 'Not found.'], 404);
    }

    public function update(UpdatePostRequest $request, $post_id) {
        $user = Auth::user();
        $post = Post::where('id', $post_id);
        if ($post->first()) {
            if ($post->first()->user_id == $user->id) {
                $post->update($request->only(['description', 'brand', 'model', 'volume', 'power', 'specifications']));
                if ($request->input('motorcycle')) {
                    $motorcycle = Motorcycle::where('name', $request->input('motorcycle'))->first();
                    $post->update(['motorcycle_id' => $motorcycle->id]);
                }
                if ($post->first()->status == 3) {
                    $post->update(['status' => 0]);
                }
                return response()->json(['data' => new PostResource($post->first())]);
            }
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        return response()->json(['message' => 'Not found.'], 404);
    }

    public function change_status(ChangePostRequest $request, $post_id) {
        $user = Auth::user();
        $post = Post::where('id', $post_id);
        if (!$post->first()) {
            return response()->json(['message' => 'Not found.'], 404);
        }
        if ($user->role) {
            $post->update(['status' => $request->input('status')]);
            return response()->json(['data' => new PostResource($post->first())]);
        }
        if ($post->first()->user_id == $user->id) {
            if (($request->input('status') == 0 or $request->input('status') == 1) and 
                    ($post->first()->status == 0 or $post->first()->status == 1)) {
                $post->update(['status' => $request->input('status')]);
                return response()->json(['data' => new PostResource($post->first())]);
            }
        }
        return response()->json(['message' => 'Forbidden.'], 403);
    }

    public function get_post(Request $request, $post_id) {
        $post = Post::where('id', $post_id)->first();
        if ($post) {
            if (Auth::guard('api')->check()) {
                $user = Auth::guard('api')->user();
                if ($post->status == 3 or $post->user_id == $user->id or $user->role) {
                    return response()->json(['data' => new PostResource($post)]);
                }
                return response()->json(['message' => 'This post is closed now.'], 403);
            }
            if ($post->status == 3) {
                return response()->json(['data' => new CatalogPostResource($post)]);
            }
            return response()->json(['message' => 'This post is closed for you.'], 401);
        }
        return response()->json(['message' => 'Not found.'], 404);
    }

    public function store_post_image(ImageRequest $request, $post_id) {
        $user = Auth::user();
        $post = Post::where('id', $post_id);
        if ($post->first()) {
            if ($post->first()->user_id == $user->id) {
                $images = Image::where('post_id', $post->first()->id)->get();
                if (count($images) == 5) {
                    return response()->json(['message' => 'The maximum number of images has been reached.'], 403);
                }
                $image = $request->file('image');
                $image_name = uniqid() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('images', $image_name, 'public');
                $img = new Image();
                $img->image = $image_name;
                $img->post_id = $post->first()->id;
                $img->save();
                if ($post->first()->status == 3) {
                    $post->update(['status' => 0]);
                }
                return response()->json(['data' => new PostResource($post->first())]);
            }
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        return response()->json(['message' => 'Not found.'], 404);
    }

    public function destroy_post_image(Request $request, $image_id) {
        $user = Auth::user();
        $image = Image::where('id', $image_id);
        if ($image->first()) {
            $post = Post::where('id', $image->first()->post_id)->first();
            if ($post->user_id == $user->id) {
                Storage::disk('public')->delete('images/' . $image->first()->image);
                $image->delete();
                return response()->noContent();
            }
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        return response()->json(['message' => 'Not found.'], 404);
    }
}
