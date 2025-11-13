import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
export default async function ManagerLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  await dbConnect();
  const user = await User.findOne({ clerkId: userId }).lean();
  if (!user || user.role !== "manager") {
    redirect("/");
  }
  return <>{children}</>;
}
