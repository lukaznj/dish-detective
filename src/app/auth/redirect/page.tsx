import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

export default async function RedirectAfterSignIn() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  await dbConnect();

  // Find or create user with atomic upsert
  const user = await User.findOneAndUpdate(
    { id: userId },
    { $setOnInsert: { id: userId, role: "student" } },
    { upsert: true, new: true }
  ).lean();


  switch (user.role) {
    case "admin":
      redirect("/admin");
    case "manager":
      redirect("/manager");
    case "worker":
      redirect("/worker");
    case "student":
    default:
      redirect("/student");
  }
}

