import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { updateEmployeeAccount, getEmployeeAccount } from "./actions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  clerkClient: jest.fn(),
}));

describe("Edit Employee Account Server Actions", () => {
  let mongoServer: MongoMemoryServer;
  let adminClerkId: string;
  let testRestaurantId: string;
  let testEmployeeId: string;
  let testEmployeeClerkId: string;

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

  // Setup admin user, restaurant, and employee before each test
  beforeEach(async () => {
    adminClerkId = "clerk_admin_test";
    await User.create({
      clerkId: adminClerkId,
      role: "admin",
    });

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
    testRestaurantId = String(restaurant._id);

    // Create test employee
    testEmployeeClerkId = "clerk_employee_test";
    const employee = await User.create({
      clerkId: testEmployeeClerkId,
      role: "worker",
      restaurantId: testRestaurantId,
    });
    testEmployeeId = String(employee._id);

    // Mock admin authentication by default
    (auth as jest.Mock).mockResolvedValue({ userId: adminClerkId });
  }, 10000); // 10 second timeout

  // Clear database after each test
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    jest.clearAllMocks();
  }, 10000); // 10 second timeout

  describe("getEmployeeAccount", () => {
    it("should fetch employee account successfully", async () => {
      // Mock Clerk client
      const mockGetUser = jest.fn().mockResolvedValue({
        id: testEmployeeClerkId,
        username: "testworker",
        firstName: "John",
        lastName: "Worker",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getEmployeeAccount(testEmployeeId);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe(testEmployeeId);
      expect(result.user?.clerkId).toBe(testEmployeeClerkId);
      expect(result.user?.name).toBe("John");
      expect(result.user?.lastName).toBe("Worker");
      expect(result.user?.username).toBe("testworker");
      expect(result.user?.role).toBe("worker");
      expect(result.user?.restaurantId).toBe(testRestaurantId);
    });

    it("should return error when user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await getEmployeeAccount(testEmployeeId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized");
    });

    it("should return error when user is not an admin", async () => {
      const workerClerkId = "clerk_worker_trying";
      await User.create({
        clerkId: workerClerkId,
        role: "worker",
        restaurantId: testRestaurantId,
      });

      (auth as jest.Mock).mockResolvedValue({ userId: workerClerkId });

      const result = await getEmployeeAccount(testEmployeeId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Only admins can view employee accounts");
    });

    it("should return error for invalid user ID", async () => {
      const result = await getEmployeeAccount("invalid_id");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid user ID");
    });

    it("should return error when user not found", async () => {
      const result = await getEmployeeAccount("507f1f77bcf86cd799439011");

      expect(result.success).toBe(false);
      expect(result.error).toBe("User not found");
    });

    it("should handle Clerk API errors", async () => {
      const mockGetUser = jest
        .fn()
        .mockRejectedValue(new Error("Clerk API error"));

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getEmployeeAccount(testEmployeeId);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Neuspješno dohvaćanje podataka o zaposleniku");
    });
  });

  describe("updateEmployeeAccount", () => {
    it("should update employee name successfully", async () => {
      const mockUpdateUser = jest.fn().mockResolvedValue({
        id: testEmployeeClerkId,
        firstName: "Jane",
        lastName: "Updated",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          updateUser: mockUpdateUser,
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        name: "Jane",
        lastName: "Updated",
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Employee account updated successfully");
      expect(mockUpdateUser).toHaveBeenCalledWith(testEmployeeClerkId, {
        firstName: "Jane",
        lastName: "Updated",
      });
    });

    it("should update employee username successfully", async () => {
      const mockUpdateUser = jest.fn().mockResolvedValue({
        id: testEmployeeClerkId,
        username: "newusername",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          updateUser: mockUpdateUser,
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        username: "newusername",
      });

      expect(result.success).toBe(true);
      expect(mockUpdateUser).toHaveBeenCalledWith(testEmployeeClerkId, {
        username: "newusername",
      });
    });

    it("should update employee password successfully", async () => {
      const mockUpdateUser = jest.fn().mockResolvedValue({
        id: testEmployeeClerkId,
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          updateUser: mockUpdateUser,
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        password: "NewSecurePass123!",
      });

      expect(result.success).toBe(true);
      expect(mockUpdateUser).toHaveBeenCalledWith(testEmployeeClerkId, {
        password: "NewSecurePass123!",
      });
    });

    it("should update employee role in MongoDB", async () => {
      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        role: "manager",
      });

      expect(result.success).toBe(true);
      expect(result.user?.role).toBe("manager");

      // Verify in database
      const updatedUser = await User.findById(testEmployeeId);
      expect(updatedUser?.role).toBe("manager");
    });

    it("should update restaurant assignment", async () => {
      // Create another restaurant
      const newRestaurant = await Restaurant.create({
        name: "New Restaurant",
        address: "456 New St",
        imageUrl: "https://example.com/new.jpg",
        workingHours: ["Mon-Sun: 10-8"],
        location: {
          type: "Point",
          coordinates: [-74.0, 40.7],
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        restaurantId: String(newRestaurant._id),
      });

      expect(result.success).toBe(true);
      expect(result.user?.restaurantId).toBe(String(newRestaurant._id));

      // Verify in database
      const updatedUser = await User.findById(testEmployeeId);
      expect(updatedUser?.restaurantId).toBe(String(newRestaurant._id));
    });

    it("should update both Clerk and MongoDB fields together", async () => {
      const mockUpdateUser = jest.fn().mockResolvedValue({
        id: testEmployeeClerkId,
        username: "combinedupdate",
        firstName: "Combined",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          updateUser: mockUpdateUser,
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        name: "Combined",
        username: "combinedupdate",
        role: "manager",
      });

      expect(result.success).toBe(true);
      expect(mockUpdateUser).toHaveBeenCalledWith(testEmployeeClerkId, {
        firstName: "Combined",
        username: "combinedupdate",
      });

      const updatedUser = await User.findById(testEmployeeId);
      expect(updatedUser?.role).toBe("manager");
    });

    it("should return error when user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        name: "Test",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized");
    });

    it("should return error when user is not an admin", async () => {
      const workerClerkId = "clerk_worker_trying";
      await User.create({
        clerkId: workerClerkId,
        role: "worker",
        restaurantId: testRestaurantId,
      });

      (auth as jest.Mock).mockResolvedValue({ userId: workerClerkId });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        name: "Test",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Only admins can update employee accounts");
    });

    it("should return error for invalid user ID", async () => {
      const result = await updateEmployeeAccount({
        userId: "invalid_id",
        name: "Test",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid user ID");
    });

    it("should return error when user not found", async () => {
      const result = await updateEmployeeAccount({
        userId: "507f1f77bcf86cd799439011",
        name: "Test",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("User not found");
    });

    it("should reject invalid role (admin)", async () => {
      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        role: "admin" as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Role must be either manager or worker");
    });

    it("should reject invalid role (student)", async () => {
      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        role: "student" as any,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Role must be either manager or worker");
    });

    it("should handle password too short error from Clerk", async () => {
      const mockError = {
        clerkError: true,
        errors: [
          {
            code: "form_password_length_too_short",
            message: "Password is too short",
          },
        ],
      };

      const mockUpdateUser = jest.fn().mockRejectedValue(mockError);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          updateUser: mockUpdateUser,
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        password: "short",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Lozinka mora imati minimalno 8 znakova");
    });

    it("should handle username already exists error from Clerk", async () => {
      const mockError = {
        clerkError: true,
        errors: [
          {
            code: "form_identifier_exists",
            message: "Username already exists",
          },
        ],
      };

      const mockUpdateUser = jest.fn().mockRejectedValue(mockError);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          updateUser: mockUpdateUser,
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        username: "existinguser",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Korisničko ime već postoji");
    });

    it("should handle generic Clerk errors", async () => {
      const mockError = {
        clerkError: true,
        errors: [
          {
            code: "unknown_error",
            longMessage: "Something went wrong in Clerk",
          },
        ],
      };

      const mockUpdateUser = jest.fn().mockRejectedValue(mockError);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          updateUser: mockUpdateUser,
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        name: "Test",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Something went wrong in Clerk");
    });

    it("should handle MongoDB validation errors", async () => {
      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        restaurantId: "", // Invalid - empty string
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should successfully update when no changes provided", async () => {
      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Employee account updated successfully");
    });

    it("should handle special characters in names", async () => {
      const mockUpdateUser = jest.fn().mockResolvedValue({
        id: testEmployeeClerkId,
        firstName: "François",
        lastName: "O'Brien",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          updateUser: mockUpdateUser,
        },
      });

      const result = await updateEmployeeAccount({
        userId: testEmployeeId,
        name: "François",
        lastName: "O'Brien",
      });

      expect(result.success).toBe(true);
    });
  });
});
