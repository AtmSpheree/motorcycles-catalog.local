<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->user),
            'description' => $this->description,
            'motorcycle' => new MotorcycleResource($this->motorcycle),
            'brand' => $this->brand,
            'model' => $this->model,
            'volume' => $this->volume,
            'power' => $this->power,
            'specifications' => $this->specifications,
            'date' => date('d-m-Y', strtotime($this->created_at)),
            'status' => $this->status,
            'images' => ImageResource::collection($this->images)
        ];
    }
}
