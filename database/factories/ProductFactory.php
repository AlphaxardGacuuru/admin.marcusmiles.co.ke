<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        static $number = 1;

        $products = [
            "Custom Wardrobe",
            "Kitchen Cabinets",
            "Executive Desk",
            "Glass Partition",
            "Granite Countertop",
            "Wooden Dining Table",
            "TV Stand",
            "Bookshelf",
            "Bathroom Vanity",
            "Solid Wood Door",
            "Aluminium Window Frame",
            "Decorative Wooden Panel",
            "Wall Mirror Set",
            "Coffee Table",
            "Conference Table"
        ];

        return [
            "code" => 'P' . str_pad($number++, 3, '0', STR_PAD_LEFT),
            "name" => $this->faker->unique()->randomElement($products),
            "price" => $this->faker->randomFloat(2, 50, 5000), // value between $50.00 and $5000.00
            "created_by" => User::where("account_type", "staff")->inRandomOrder()->first()->id ?? 1,
        ];
    }
}
