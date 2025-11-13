"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";

type EmployeeData = {
  id: string;
  firstName: string;
  lastName: string;
  restaurantName: string;
  role: "manager" | "worker";
};

type ActionResponse = {
  success: boolean;
  message?: string;
  data?: EmployeeData[];
  error?: string;
};

export async function getAllEmployees(): Promise<ActionResponse> {
  try {
    // Verify the current user is an admin
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    await dbConnect();

    const currentUser = await User.findOne({ clerkId: userId }).lean();
    if (!currentUser || currentUser.role !== "admin") {
      return { success: false, error: "Only admins can view employee accounts" };
    }

    // Get all users with role of manager or worker
    const employees = await User.find({
      role: { $in: ["manager", "worker"] },
    }).lean();

    if (employees.length === 0) {
      return {
        success: true,
        message: "No employees found",
        data: [],
      };
    }

    const client = await clerkClient();

    // Fetch data for each employee
    const employeeDataPromises = employees.map(async (employee) => {
      try {
        // Get user details from Clerk
        const clerkUser = await client.users.getUser(employee.clerkId);

        // Get restaurant name from MongoDB
        const restaurant = await Restaurant.findById(employee.restaurantId).lean();

        return {
          id: String(employee._id),
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          restaurantName: restaurant?.name || "Unknown",
          role: employee.role as "manager" | "worker",
        };
      } catch (error) {
        console.error(`Error fetching data for employee ${employee.clerkId}:`, error);
        // Return partial data if there's an error
        return {
          id: String(employee._id),
          firstName: "Unknown",
          lastName: "Unknown",
          restaurantName: "Unknown",
          role: employee.role as "manager" | "worker",
        };
      }
    });

    const employeeData = await Promise.all(employeeDataPromises);

    return {
      success: true,
      message: `Retrieved ${employeeData.length} employees`,
      data: employeeData,
    };
  } catch (error: any) {
    console.error("Error retrieving employees:", error);
    return {
      success: false,
      error: "Failed to retrieve employee accounts",
    };
  }
}

