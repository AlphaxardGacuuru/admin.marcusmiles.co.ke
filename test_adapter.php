<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$c = new \Google\Client();
$c->setAuthConfig(storage_path('app/google/pragmatic-ratio-204512-88ea6f1391c8.json'));
$c->addScope(\Google\Service\Drive::DRIVE);
$s = new \Google\Service\Drive($c);
$a = new \Masbug\Flysystem\GoogleDriveAdapter($s, '', ['sharedFolderId' => env('GOOGLE_DRIVE_FOLDER_ID')]); 
$f = new \League\Flysystem\Filesystem($a); 
$f->createDirectory('real_test_folder_1'); 
echo "Done\n";
