<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$c = new \Google\Client();
$c->setAuthConfig(storage_path('app/google/pragmatic-ratio-204512-88ea6f1391c8.json'));
$c->addScope(\Google\Service\Drive::DRIVE);
$s = new \Google\Service\Drive($c);
$files = $s->files->listFiles(['fields' => 'files(*)', 'q' => "trashed = false"])->getFiles();

foreach($files as $f) {
    echo "Name: " . $f->name . " | ID: " . $f->id . " | Parents: " . json_encode($f->parents) . "\n";
}
