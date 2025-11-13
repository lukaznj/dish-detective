"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "@/utils/dbConnect";
import User, { UserRole } from "@/models/User";

interface CreateEmployeeAccountParams {
  name: string;
  lastName: string;
  username: string;
  password: string;
  role: UserRole;
  restaurantId: string;
}

export async function createWorkerManagerAccount({
  name,
  lastName,
  username,
  password,
  role,
  restaurantId,
}: CreateEmployeeAccountParams) {
  try {
    // Verify the current user is an admin
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();
    const currentUser = await User.findOne({ clerkId: userId }).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        error: "Only admins can create employee accounts",
      };
    }

    // Validate role is manager or worker
    if (role !== "manager" && role !== "worker") {
      return { success: false, error: "Role must be either manager or worker" };
    }

    // Create user in Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.createUser({
      username,
      password,
      firstName: name,
      lastName: lastName,
      skipPasswordRequirement: false,
    });

    // Create user in MongoDB with the Clerk ID
    const mongoUser = await User.create({
      clerkId: clerkUser.id,
      role,
      restaurantId,
    });

    return {
      success: true,
      message: "Employee account created successfully",
      user: {
        id: mongoUser._id,
        clerkId: clerkUser.id,
        username,
        name,
        lastName,
        role,
        restaurantId,
      },
    };
  } catch (error: any) {
    console.error("Error creating employee account:", error);

    // Handle specific errors
    if (error.errors?.[0]?.code === "form_identifier_exists") {
      return { success: false, error: "Username already exists" };
    }

    if (error.name === "ValidationError") {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Failed to create employee account" };
  }
}
