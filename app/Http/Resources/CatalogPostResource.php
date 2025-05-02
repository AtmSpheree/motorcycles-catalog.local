<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CatalogPostResource extends JsonResource
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
            'description' => $this->description,
            'motorcycle' => new MotorcycleResource($this->motorcycle),
            'brand' => $this->brand,
            'model' => $this->model,
            'volume' => $this->volume,
            'power' => $this->power,
            'specifications' => $this->specifications,
            'date' => date('d-m-Y', strtotime($this->created_at)),
            'images' => ImageResource::collection($this->images)
        ];
    }
}
