import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decrypt } from './lib/session'
import { homeRoute, loginRoute, publicRoutes } from './constants'


/*** Middleware Function
 * 
 * Handles all traffic to Travel Guardian
 * Loads session from cookie if available
 * 
 * If valid session, pass request through
 * If no session, redirect to login page
 * 
 */
export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
  
  // Decrypt session from cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie);

  // Redirect to login if user is not authenticated
  if (!isPublicRoute && !session?.userId) {
    return NextResponse.redirect(new URL(loginRoute, req.nextUrl))
  }
 
  // Redict to home if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId
  ) {
    return NextResponse.redirect(new URL(homeRoute, req.nextUrl))
  }
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}