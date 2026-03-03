// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;

//  //   Only handle the root path "/"
//     if (pathname !== '/' ) return NextResponse.next();

//     // If we're already on /login, allow it (avoid loops)
//     if (pathname === '/login') return NextResponse.next();

    // If 'tel' param is missing or empty, redirect to /login
    const tel = searchParams.get('tel');
    if (!tel) {
        // simple redirect to /login
        // Optionally include redirect back to "/" after login:
        const loginUrl = new URL('/login', req.url);
        // store original path+search so you can return after login if needed
        loginUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    // tel exists -> continue
    return NextResponse.next();
}

// Apply middleware only to the root path
export const config = {
    matcher: '/', // only run for "/"
};