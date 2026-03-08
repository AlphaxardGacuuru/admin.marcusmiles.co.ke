<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $alDoesntExist = User::where('email', 'alphaxardgacuuru47@gmail.com')
            ->doesntExist();

        $brianDoesntExist = User::where('email', 'brian@marcusmiles.co.ke')
            ->doesntExist();

        if ($alDoesntExist) {
            $user = User::factory()->al()->create();
        }

        if ($brianDoesntExist) {
            User::factory()->brian()->create();
        }

        User::factory()->count(10)->create();
        User::factory()->count(10)->create(["account_type" => "supplier"]);
        User::factory()->count(10)->create(["account_type" => "client"]);
        User::factory()->count(10)->create(["account_type" => "service provider"]);
        User::factory()->count(10)->create(["account_type" => "staff"]);
    }
}
