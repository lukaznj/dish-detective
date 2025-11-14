import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getAllEmployees, deleteEmployee } from "./actions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  clerkClient: jest.fn(),
}));

describe("Accounts Server Actions", () => {
  let mongoServer: MongoMemoryServer;
  let adminUserId: string;
  let adminClerkId: string;

  // Setup: Start in-memory MongoDB before all tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Set the test URI as an environment variable
    process.env.MONGODB_TEST_URI = uri;
  }, 10000); // 10 second timeout for setup

  // Cleanup: Close connection and stop MongoDB after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
    delete process.env.MONGODB_TEST_URI;
  });

  // Setup admin user before each test
  beforeEach(async () => {
    adminClerkId = "clerk_admin_test";
    const adminUser = await User.create({
      clerkId: adminClerkId,
      role: "admin",
    });
    adminUserId = String(adminUser._id);

    // Mock admin authentication by default
    (auth as jest.Mock).mockResolvedValue({ userId: adminClerkId });
  });

  // Clear database after each test
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    jest.clearAllMocks();
  });

  describe("getAllEmployees", () => {
    it("should return empty array when no employees exist", async () => {
      const result = await getAllEmployees();

      expect(result.success).toBe(true);
      expect(result.message).toBe("No employees found");
      expect(result.data).toEqual([]);
    });

    it("should return all employees with their details", async () => {
      // Create test restaurant
      const restaurant = await Restaurant.create({
        name: "Test Restaurant",
        address: "123 Test St",
        imageUrl: "https://example.com/test.jpg",
        workingHours: ["Mon-Fri: 9-5"],
        location: {
          type: "Point",
          coordinates: [-73.935242, 40.73061],
        },
      });

      // Create test employees
      const worker = await User.create({
        clerkId: "clerk_worker_1",
        role: "worker",
        restaurantId: String(restaurant._id),
      });

      const manager = await User.create({
        clerkId: "clerk_manager_1",
        role: "manager",
        restaurantId: String(restaurant._id),
      });

      // Mock Clerk client
      const mockGetUser = jest
        .fn()
        .mockResolvedValueOnce({
          id: "clerk_worker_1",
          firstName: "John",
          lastName: "Worker",
        })
        .mockResolvedValueOnce({
          id: "clerk_manager_1",
          firstName: "Jane",
          lastName: "Manager",
        });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getAllEmployees();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0]).toMatchObject({
        id: String(worker._id),
        firstName: "John",
        lastName: "Worker",
        restaurantName: "Test Restaurant",
        role: "worker",
      });
      expect(result.data?.[1]).toMatchObject({
        id: String(manager._id),
        firstName: "Jane",
        lastName: "Manager",
        restaurantName: "Test Restaurant",
        role: "manager",
      });
    });

    it("should handle missing restaurant gracefully", async () => {
      // Create employee with non-existent restaurant
      await User.create({
        clerkId: "clerk_worker_orphan",
        role: "worker",
        restaurantId: "507f1f77bcf86cd799439011", // Non-existent ID
      });

      // Mock Clerk client
      const mockGetUser = jest.fn().mockResolvedValue({
        id: "clerk_worker_orphan",
        firstName: "Orphan",
        lastName: "Worker",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getAllEmployees();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0].restaurantName).toBe("Unknown");
    });

    it("should handle Clerk API errors for individual users", async () => {
      // Create test employee
      await User.create({
        clerkId: "clerk_error_user",
        role: "worker",
        restaurantId: "507f1f77bcf86cd799439011",
      });

      // Mock Clerk client throwing error
      const mockGetUser = jest
        .fn()
        .mockRejectedValue(new Error("Clerk user not found"));

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getAllEmployees();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data?.[0]).toMatchObject({
        firstName: "Unknown",
        lastName: "Unknown",
        restaurantName: "Unknown",
        role: "worker",
      });
    });

    it("should not return admin or student users", async () => {
      // Create various user types
      await User.create({
        clerkId: "clerk_student",
        role: "student",
      });

      await User.create({
        clerkId: "clerk_another_admin",
        role: "admin",
      });

      const result = await getAllEmployees();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it("should return error when user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await getAllEmployees();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized");
    });

    it("should return error when user is not an admin", async () => {
      // Create a worker user
      const workerUser = await User.create({
        clerkId: "clerk_worker_trying",
        role: "worker",
        restaurantId: "507f1f77bcf86cd799439011",
      });

      // Mock authentication as worker
      (auth as jest.Mock).mockResolvedValue({ userId: "clerk_worker_trying" });

      const result = await getAllEmployees();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Only admins can view employee accounts");
    });
  });

  describe("deleteEmployee", () => {
    it("should delete employee successfully", async () => {
      // Create test employee
      const employee = await User.create({
        clerkId: "clerk_to_delete",
        role: "worker",
        restaurantId: "507f1f77bcf86cd799439011",
      });

      // Mock Clerk client
      const mockDeleteUser = jest.fn().mockResolvedValue({ deleted: true });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          deleteUser: mockDeleteUser,
        },
      });

      const result = await deleteEmployee(String(employee._id));

      expect(result.success).toBe(true);
      expect(mockDeleteUser).toHaveBeenCalledWith("clerk_to_delete");

      // Verify user was deleted from database
      const deletedUser = await User.findById(employee._id);
      expect(deletedUser).toBeNull();
    });

    it("should return error when employee not found", async () => {
      const result = await deleteEmployee("507f1f77bcf86cd799439011");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Employee not found");
    });

    it("should prevent deletion of admin accounts", async () => {
      const result = await deleteEmployee(adminUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Can only delete manager or worker accounts");

      // Verify admin still exists
      const adminStillExists = await User.findById(adminUserId);
      expect(adminStillExists).toBeDefined();
    });

    it("should prevent deletion of student accounts", async () => {
      const student = await User.create({
        clerkId: "clerk_student",
        role: "student",
      });

      const result = await deleteEmployee(String(student._id));

      expect(result.success).toBe(false);
      expect(result.error).toBe("Can only delete manager or worker accounts");

      // Verify student still exists
      const studentStillExists = await User.findById(student._id);
      expect(studentStillExists).toBeDefined();
    });

    it("should handle Clerk deletion errors", async () => {
      // Create test employee
      const employee = await User.create({
        clerkId: "clerk_delete_error",
        role: "worker",
        restaurantId: "507f1f77bcf86cd799439011",
      });

      // Mock Clerk client throwing error
      const mockDeleteUser = jest
        .fn()
        .mockRejectedValue(new Error("Clerk API error"));

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          deleteUser: mockDeleteUser,
        },
      });

      const result = await deleteEmployee(String(employee._id));

      expect(result.success).toBe(false);
      expect(result.error).toBe(
        "Failed to delete employee from authentication service",
      );

      // Verify user was still deleted from MongoDB despite Clerk error
      const deletedUser = await User.findById(employee._id);
      expect(deletedUser).toBeNull();
    });

    it("should return error when user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await deleteEmployee("507f1f77bcf86cd799439011");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized");
    });

    it("should return error when user is not an admin", async () => {
      // Create a manager user
      await User.create({
        clerkId: "clerk_manager_trying",
        role: "manager",
        restaurantId: "507f1f77bcf86cd799439011",
      });

      // Mock authentication as manager
      (auth as jest.Mock).mockResolvedValue({ userId: "clerk_manager_trying" });

      const employee = await User.create({
        clerkId: "clerk_to_delete",
        role: "worker",
        restaurantId: "507f1f77bcf86cd799439011",
      });

      const result = await deleteEmployee(String(employee._id));

      expect(result.success).toBe(false);
      expect(result.error).toBe("Only admins can delete employee accounts");
    });
  });
});
