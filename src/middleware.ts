import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard', '/forum(.*)']);
const isApiRoute = createRouteMatcher(['/(api|trpc)(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();

  }
  if (isApiRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Explicitly include API and tRPC routes
    '/(api|trpc)(.*)',
  ],
};