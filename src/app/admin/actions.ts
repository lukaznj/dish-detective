"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getCurrentUserFirstName() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, firstName: null, error: "Not authenticated" };
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return {
      success: true,
      firstName: user.firstName || "",
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user first name:", error);
    return {
      success: false,
      firstName: null,
      error: "Failed to fetch user information",
    };
  }
}
