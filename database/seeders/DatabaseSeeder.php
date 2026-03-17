<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            UserSeeder::class,
			StageSeeder::class,
			ProjectSeeder::class,
			GoodSeeder::class,
			IssueSeeder::class,
            ProductSeeder::class,
			ConfigurationSeeder::class,
			RoleSeeder::class,
			// InvoiceSeeder::class
        ]);
    }
}
