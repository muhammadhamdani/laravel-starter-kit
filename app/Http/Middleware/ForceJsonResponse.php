<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceJsonResponse
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('api/*')) {
            $token = $request->cookie('sessionToken');

            if ($token) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }

            $request->headers->set('Accept', 'application/json');

            if (!$request->headers->has('Content-Type')) {
                $request->headers->set('Content-Type', 'application/json');
            }
        }

        return $next($request);
    }
}
