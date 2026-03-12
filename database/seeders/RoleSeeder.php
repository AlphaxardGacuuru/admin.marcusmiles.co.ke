<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = collect([
            "Super Admin",
            "Admin",
            "Clients Manager",
            "Goods Manager",
            "Service Providers Manager",
            "Projects Manager",
            "Suppliers Manager",
            "Invoices Manager",
            "Payments Manager",
            "Credit Notes Manager",
            "Deductions Manager",
        ]);

        $roles->each(function ($role) {
            Role::firstOrCreate(
                ["name" => $role],
                ["guard_name" => "web"]
            );
        });

        $users = User::whereIn('email', [
            'alphaxardgacuuru47@gmail.com',
            'brian@marcusmiles.co.ke'
        ])
            ->get();

        $users->each(fn($user) => $user->syncRoles(['Super Admin']));
    }
}
