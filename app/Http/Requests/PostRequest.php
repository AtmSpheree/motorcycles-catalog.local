<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class PostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'description' => 'required|string',
            'motorcycle' => 'required|exists:motorcycles,name',
            'brand' => 'required|string',
            'model' => 'required|string',
            'volume' => 'required|integer|min:10',
            'power' => 'required|integer|min:10',
            'specifications' => 'required|string',
            'images' => 'array|min:1|max:5',
            'images.*' => 'required|image|extensions:png,jpg,jpeg|max:5120'
        ];
    }

    public function messages()
    {
        return [
            'validation.extensions' => '123'
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator) {
        throw new HttpResponseException(response()->json(['message' => 'Invalid fields', 'errors' => $validator->errors()], 422, 
        ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'],
        JSON_UNESCAPED_UNICODE));
    }
}
