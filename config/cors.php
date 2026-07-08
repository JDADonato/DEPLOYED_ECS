<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Restricts allowed origins to the production domain instead of wildcards.
    | The APP_URL environment variable is used as the default allowed origin
    | so it works correctly across local, staging, and production environments.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_filter([
        env('APP_URL', 'http://127.0.0.1:8080'),
    ]),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
