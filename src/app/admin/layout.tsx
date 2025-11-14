import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  await dbConnect();
  const user = await User.findOne({ clerkId: userId }).lean();
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
