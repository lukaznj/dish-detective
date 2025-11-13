import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login/student(.*)",
  "/login/employee(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/auth/redirect",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isStudentRoute = createRouteMatcher(["/student(.*)"]);
const isManagerRoute = createRouteMatcher(["/manager(.*)"]);
const isWorkerRoute = createRouteMatcher(["/worker(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all other routes
  const { userId } = await auth.protect();

  if (!userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  await dbConnect();

  // Find or create user with atomic upsert
  const user = await User.findOneAndUpdate(
    { clerkId: userId },
    { $setOnInsert: { clerkId: userId, role: "student" } },
    { upsert: true, new: true },
  ).lean();

  const userRole = user!.role;

  if (isAdminRoute(req) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isStudentRoute(req) && userRole !== "student") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isManagerRoute(req) && userRole !== "manager") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isWorkerRoute(req) && userRole !== "worker") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
