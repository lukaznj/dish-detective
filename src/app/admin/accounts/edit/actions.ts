"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "@/utils/dbConnect";
import User, { UserRole } from "@/models/User";
import { Types } from "mongoose";

interface UpdateEmployeeAccountParams {
  userId: string; // MongoDB _id
  name?: string;
  lastName?: string;
  username?: string;
  password?: string;
  role?: UserRole;
  restaurantId?: string;
}

export async function updateEmployeeAccount({
  userId,
  name,
  lastName,
  username,
  password,
  role,
  restaurantId,
}: UpdateEmployeeAccountParams) {
  try {
    // Verify the current user is an admin
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();
    const currentUser = await User.findOne({ clerkId: currentUserId }).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        error: "Only admins can update employee accounts",
      };
    }

    // Validate userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return { success: false, error: "Invalid user ID" };
    }

    // Find the user to update in MongoDB
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return { success: false, error: "User not found" };
    }

    // Validate role if provided
    if (role && role !== "manager" && role !== "worker") {
      return { success: false, error: "Role must be either manager or worker" };
    }

    // Prepare Clerk update data
    const clerkUpdateData: any = {};
    if (name !== undefined) clerkUpdateData.firstName = name;
    if (lastName !== undefined) clerkUpdateData.lastName = lastName;
    if (username !== undefined) clerkUpdateData.username = username;
    if (password !== undefined) clerkUpdateData.password = password;

    // Update user in Clerk if there are any updates
    if (Object.keys(clerkUpdateData).length > 0) {
      try {
        const client = await clerkClient();
        await client.users.updateUser(userToUpdate.clerkId, clerkUpdateData);
      } catch (clerkError: any) {
        console.error("Clerk update error:", clerkError);

        // Handle Clerk-specific errors
        if (clerkError.clerkError || clerkError.errors) {
          // Check for password-related errors
          const passwordError = clerkError.errors?.find(
            (err: any) =>
              err.code === "form_password_pwned" ||
              err.code === "form_password_length_too_short" ||
              err.code === "form_password_not_strong_enough",
          );

          if (passwordError) {
            return {
              success: false,
              error: "Lozinka mora imati minimalno 8 znakova",
            };
          }

          // Check for username exists error
          const usernameError = clerkError.errors?.find(
            (err: any) => err.code === "form_identifier_exists",
          );

          if (usernameError) {
            return { success: false, error: "Korisničko ime već postoji" };
          }

          // Generic Clerk error
          return {
            success: false,
            error:
              clerkError.errors?.[0]?.longMessage ||
              "Greška prilikom ažuriranja računa u Clerk sustavu",
          };
        }

        return {
          success: false,
          error: "Greška prilikom ažuriranja Clerk korisnika",
        };
      }
    }

    // Prepare MongoDB update data
    const mongoUpdateData: any = {};
    if (role !== undefined) mongoUpdateData.role = role;
    if (restaurantId !== undefined) mongoUpdateData.restaurantId = restaurantId;

    // Update user in MongoDB if there are any updates
    if (Object.keys(mongoUpdateData).length > 0) {
      Object.assign(userToUpdate, mongoUpdateData);
      await userToUpdate.save();
    }

    return {
      success: true,
      message: "Employee account updated successfully",
      user: {
        id: String(userToUpdate._id),
        clerkId: userToUpdate.clerkId,
        role: userToUpdate.role,
        restaurantId: userToUpdate.restaurantId,
      },
    };
  } catch (error: any) {
    console.error("Error updating employee account:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Neuspješno ažuriranje računa zaposlenika",
    };
  }
}

export async function getEmployeeAccount(userId: string) {
  try {
    // Verify the current user is an admin
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();
    const currentUser = await User.findOne({ clerkId: currentUserId }).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return {
        success: false,
        error: "Only admins can view employee accounts",
      };
    }

    // Validate userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return { success: false, error: "Invalid user ID" };
    }

    // Find the user in MongoDB
    const mongoUser = await User.findById(userId).lean();
    if (!mongoUser) {
      return { success: false, error: "User not found" };
    }

    // Get user details from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(mongoUser.clerkId);

    return {
      success: true,
      user: {
        id: String(mongoUser._id),
        clerkId: mongoUser.clerkId,
        name: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        username: clerkUser.username || "",
        role: mongoUser.role,
        restaurantId: mongoUser.restaurantId || "",
      },
    };
  } catch (error: any) {
    console.error("Error fetching employee account:", error);
    return {
      success: false,
      error: "Neuspješno dohvaćanje podataka o zaposleniku",
    };
  }
}

