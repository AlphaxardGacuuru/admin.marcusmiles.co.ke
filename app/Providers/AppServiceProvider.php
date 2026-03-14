<?php

namespace App\Providers;

use Google\Client;
use Google\Service\Drive;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use Masbug\Flysystem\GoogleDriveAdapter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Storage::extend('google', function ($app, $config) {
            $client = new Client();
            $client->setAuthConfig(storage_path('app/google/pragmatic-ratio-204512-88ea6f1391c8.json'));
            $client->addScope(Drive::DRIVE);

            $service = new Drive($client);
            $options = ['sharedFolderId' => $config['folder'] ?? '/'];
            $adapter = new GoogleDriveAdapter($service, '', $options);

            $driver = new Filesystem($adapter);

            return new FilesystemAdapter($driver, $adapter);
        });
    }
}
