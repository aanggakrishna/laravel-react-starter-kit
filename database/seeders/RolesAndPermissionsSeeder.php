<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Illuminate\Contracts\Cache\Repository::class]->forget('spatie.permission.cache');

        // Create permissions
        $permissions = [
            // Post permissions
            ['name' => 'View Posts', 'slug' => 'posts.view'],
            ['name' => 'Create Posts', 'slug' => 'posts.create'],
            ['name' => 'Edit Posts', 'slug' => 'posts.edit'],
            ['name' => 'Delete Posts', 'slug' => 'posts.delete'],
            ['name' => 'Publish Posts', 'slug' => 'posts.publish'],
            
            // Category permissions
            ['name' => 'View Categories', 'slug' => 'categories.view'],
            ['name' => 'Create Categories', 'slug' => 'categories.create'],
            ['name' => 'Edit Categories', 'slug' => 'categories.edit'],
            ['name' => 'Delete Categories', 'slug' => 'categories.delete'],
            
            // Tag permissions
            ['name' => 'View Tags', 'slug' => 'tags.view'],
            ['name' => 'Create Tags', 'slug' => 'tags.create'],
            ['name' => 'Edit Tags', 'slug' => 'tags.edit'],
            ['name' => 'Delete Tags', 'slug' => 'tags.delete'],
            
            // User permissions
            ['name' => 'View Users', 'slug' => 'users.view'],
            ['name' => 'Create Users', 'slug' => 'users.create'],
            ['name' => 'Edit Users', 'slug' => 'users.edit'],
            ['name' => 'Delete Users', 'slug' => 'users.delete'],
            
            // Role permissions
            ['name' => 'View Roles', 'slug' => 'roles.view'],
            ['name' => 'Create Roles', 'slug' => 'roles.create'],
            ['name' => 'Edit Roles', 'slug' => 'roles.edit'],
            ['name' => 'Delete Roles', 'slug' => 'roles.delete'],
            
            // Permission permissions
            ['name' => 'View Permissions', 'slug' => 'permissions.view'],
            ['name' => 'Create Permissions', 'slug' => 'permissions.create'],
            ['name' => 'Edit Permissions', 'slug' => 'permissions.edit'],
            ['name' => 'Delete Permissions', 'slug' => 'permissions.delete'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Create roles and assign permissions
        $roles = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'permissions' => Permission::all()->pluck('slug')->toArray(),
            ],
            [
                'name' => 'Editor',
                'slug' => 'editor',
                'permissions' => [
                    'posts.view', 'posts.create', 'posts.edit', 'posts.publish',
                    'categories.view', 'categories.create', 'categories.edit',
                    'tags.view', 'tags.create', 'tags.edit',
                ],
            ],
            [
                'name' => 'Author',
                'slug' => 'author',
                'permissions' => [
                    'posts.view', 'posts.create', 'posts.edit',
                    'categories.view',
                    'tags.view',
                ],
            ],
            [
                'name' => 'User',
                'slug' => 'user',
                'permissions' => [
                    'posts.view',
                    'categories.view',
                    'tags.view',
                ],
            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'];
            unset($roleData['permissions']);
            
            $role = Role::create($roleData);
            $role->givePermissionTo($permissions);
        }

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $admin->assignRole('admin');
    }
}
