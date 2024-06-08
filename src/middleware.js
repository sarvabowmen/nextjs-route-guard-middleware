import { NextRequest, NextResponse } from 'next/server';
import { cookies } from "next/headers";

export async function middleware(request) {
  // http://worldtimeapi.org/api/timezone/Asia/Kolkata
  const responses = await fetch('http://worldtimeapi.org/api/timezone/America/Argentina/Salta', { cache: "force-cache" });
  // const pathname = request.nextUrl.pathname;
  const config1 = await responses.json();
  const canRoute = true; // Replace it with header of caching 
  console.log(JSON.stringify(request.nextUrl.pathname));

   // Set cookie only for certain routes
  if (request.nextUrl.pathname === '/login') {
    const response = NextResponse.next()
    // const headers = new Headers(request.headers);
    response.cookies.set("timezone", config1.timezone, {
      path: "/",
      httponly: true,
      samesite: "strict",
      secure: true,
    });
   // headers.set('Set-Cookie', `provider=A; httpOnly=true; Max-Age=604800; Path=/`); // Adjust attributes as needed


    return response;
  }
  const timezone = cookies().get("timezone");
  console.log(JSON.stringify(timezone));  
  // Check for user type and redirect if needed
  if (timezone && timezone.value.includes('America') && request.nextUrl.pathname !== "/A"){
    return NextResponse.redirect(new URL('/A', request.url));
  }
  if (timezone && timezone.value.includes('Kolkata') && request.nextUrl.pathname !== "/B"){
    return NextResponse.redirect(new URL('/B'));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [   /*
  * Match all request paths except for the ones starting with:
  * - api (API routes)
  * - _next/static (static files)
  * - _next/image (image optimization files)
  * - favicon.ico (favicon file)
  */
 '/((?!api|_next/static|_next/image|favicon.ico).*)',],
};