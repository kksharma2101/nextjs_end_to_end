import { JWT } from '@auth/core/jwt';
import { getToken } from 'next-auth/jwt';
// import { getCsrfToken } from 'next-auth/react';
import { NextRequest, NextResponse } from 'next/server';
// export { default } from 'next-auth/middleware';

// import { NextRequest } from "next/server"

export { auth as middleware } from "@/auth"


export const config = {
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};


const middleware = async (request: NextRequest) => {

    const token = await getToken({ req: request })

    const url = request.nextUrl;

    // Redirect to dashboard if the user is already authenticated
    // and trying to access sign-in, sign-up, or home page
    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}
export default middleware;


// export const config = {
//     matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
// }

// const middleware = async (req: NextRequest) => {
//     // const token = await getToken({ req, secret: process.env.AUTH_SECRET });
//     const token = await getToken({ req: req });

//     const url = req.nextUrl;

//     // Redirect to dashboard if the user is already authenticated
//     // and trying to access sign-in, sign-up, or home page
//     if (
//         token &&
//         (url.pathname.startsWith('/sign-in') ||
//             url.pathname.startsWith('/sign-up') ||
//             url.pathname.startsWith('/verify') ||
//             url.pathname === '/')
//     ) {
//         return NextResponse.redirect(new URL('/dashboard', req.url));
//     }

//     if (!token && url.pathname.startsWith('/dashboard')) {
//         return NextResponse.redirect(new URL('/sign-in', req.url));
//     }

//     return NextResponse.next();
// }
// export default middleware;