<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'lastname' => $this->lastname,
            'firstname' => $this->firstname,
            'patronymic' => $this->patronymic,
            'email' => $this->email,
            'image' => $this->image === null ? $this->image : env('APP_URL') . Storage::url('avatars/' . $this->image),
            'role' => $this->role == 1 ? 'admin' : 'user'
        ];
    }
}
