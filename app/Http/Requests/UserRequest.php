<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserRequest extends FormRequest
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
            'lastname' => 'string|min:2|regex:/^[A-ZА-ЯЁ][a-zа-яё]+$/u',
            'firstname' => 'string|min:2|regex:/^[A-ZА-ЯЁ][a-zа-яё]+$/u',
            'patronymic' => 'string|min:2|regex:/^[A-ZА-ЯЁ][a-zа-яё]+$/u',
            'password' => 'string|min:3|regex:/^(?=.*[A-ZА-ЯЁ])(?=.*[a-zа-яё])(?=.*\d).+$/u',
            'image' => 'image|mimes:png,jpg,jpeg|max:5120'
        ];
    }

    public function messages()
    {
        return [
            'password.regex' => 'Пароль должен содержать хотя бы одну заглавную букву, строчную букву и цифру.',
            'lastname.regex' => 'Фамилия должна быть в нижнем регистре, начинаться с заглавной буквы.',
            'firstname.regex' => 'Имя должно быть в нижнем регистре, начинаться с заглавной буквы.',
            'patronymic.regex' => 'Отчество должно быть в нижнем регистре, начинаться с заглавной буквы.'
        ];
    }

    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator) {
        throw new HttpResponseException(response()->json(['message' => 'Invalid fields', 'errors' => $validator->errors()], 422, 
        ['Content-Type' => 'application/json;charset=UTF-8', 'Charset' => 'utf-8'],
        JSON_UNESCAPED_UNICODE));
    }
}
