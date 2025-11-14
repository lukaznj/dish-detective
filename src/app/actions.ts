"use server";

import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

export async function getUserRole() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { role: null, error: "Unauthorized" };
    }

    await dbConnect();

    // Find or create user
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $setOnInsert: {
          clerkId: userId,
          role: "student",
        },
      },
      { upsert: true, new: true, runValidators: false },
    ).lean();

    return { role: user.role, error: null };
  } catch (error) {
    console.error("Error fetching user role:", error);
    return { role: null, error: "Failed to fetch user role" };
  }
}

