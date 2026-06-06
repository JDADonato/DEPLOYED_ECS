<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$pgCount = \Illuminate\Support\Facades\DB::connection('pgsql')->table('bookings')->count();
$mysqlCount = \Illuminate\Support\Facades\DB::connection('mysql')->table('bookings')->count();

$pgUsers = \Illuminate\Support\Facades\DB::connection('pgsql')->table('users')->count();
$mysqlUsers = \Illuminate\Support\Facades\DB::connection('mysql')->table('users')->count();

echo "Postgres Bookings: $pgCount\n";
echo "MySQL Bookings: $mysqlCount\n";
echo "Postgres Users: $pgUsers\n";
echo "MySQL Users: $mysqlUsers\n";
