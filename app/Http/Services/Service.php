<?php

namespace App\Http\Services;

use Carbon\Carbon;

class Service
{
    public $id;

    public function __construct()
    {
        // Current User ID
        $auth = auth('sanctum')->user();

        $this->id = $auth ? $auth->id : 0;
    }

    /**
     * Generate a reusable code for a given model
     *
     * @param string $model
     * @param int $padLength
     * @return string
     */
    protected function generateUniqueCode($model, $padLength = 3)
    {
        $currentYear = Carbon::now()->format('y');
        $newNumber = $model::count() + 1;
        $code = str_pad($newNumber, $padLength, '0', STR_PAD_LEFT);

        return $currentYear . $code;
    }
}
