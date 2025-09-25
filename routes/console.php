<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Schedule queue worker to run every minute
Schedule::command('queue:work --once --timeout=60')
    ->everyMinute()
    ->withoutOverlapping()
    ->runInBackground();
