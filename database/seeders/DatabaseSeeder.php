<?php
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Branches;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $usersData = [
            ['name' => 'Pak Yusuf', 'email' => 'superadmin@idn.sch.id', 'role' => 'superadmin'],
            ['name' => 'Bu Rina', 'email' => 'admin@idn.sch.id', 'role' => 'admin'],
            ['name' => 'Pak Budi', 'email' => 'manager@idn.sch.id', 'role' => 'monitor'],
            ['name' => 'Bu Sari', 'email' => 'staff@idn.sch.id', 'role' => 'user'],
        ];

        foreach ($usersData as $data) {
            // 1. Buat user tanpa branch_id
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => $data['role'],
                'branch_id' => null,
            ]);

            // 2. Buat branch untuk user tersebut
            $branch = Branches::create([
                'name' => 'Cabang ' . $data['name'],
                'color' => '#'.substr(md5($data['email']), 0, 6), // bisa warna random
                'created_by' => $user->id,
            ]);

            // 3. Update user agar punya branch_id
            $user->update([
                'branch_id' => $branch->id,
            ]);
        }
    }
}
