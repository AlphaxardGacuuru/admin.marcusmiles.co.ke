<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        static $number = 1;
        $currentYear = Carbon::now()->format('y');
        $newProjectNumber = Project::count() + $number++;
        $code = str_pad($newProjectNumber, 3, '0', STR_PAD_LEFT);

        // Project Types
        $types = ["bungalow", "maisonette"];

        return [
            "code" => $currentYear . $code,
            "name" => fake()->streetName(),
            "type" => $types[rand(0, 1)],
            "description" => fake()->realTextBetween($minNbChars = 160, $maxNbChars = 200, $indexSize = 2),
            "location" => fake()->city(),
            "client_id" => User::where("account_type", "client")->get()->random()->id,
            "created_by" => User::where("account_type", "staff")->get()->random()->id,
        ];
    }
}
