<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Good>
 */
class GoodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        static $number = 1;
        
        $goods = [
            "Concrete",
            "Steel",
            "Bricks",
            "Wood/Lumber",
            "Glass",
            "Stone",
            "Ceramic Tiles",
            "Paints and Finishes",
            "Rebar",
            "Wood Veneer",
            "Glass Panels",
            "Decorative Wall Panels",
            "Mirrors",
            "Ceramic and Porcelain Tiles",
            "Laminates",
            "Natural Stone Slabs",
            "Metal Accents",
            "Textured Paints and Finishes",
        ];

        return [
            "code" => 'G' . str_pad($number++, 3, '0', STR_PAD_LEFT),
            "name" => $this->faker->randomElement($goods) . ' ' . $number, // append string to ensure diversity in name visually, though not required unique
            "markup" => rand(20, 30),
            "notification_quantity" => 1,
            "created_by" => User::where("account_type", "staff")
                ->get()
                ->random()
                ->id,
        ];
    }
}
