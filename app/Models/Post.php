<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'brand',
        'model',
        'volume',
        'power',
        'specifications'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function motorcycle() {
        return $this->belongsTo(Motorcycle::class);
    }

    public function images() {
        return $this->hasMany(Image::class);
    }
}
