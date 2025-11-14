import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createEmployeeAccount } from "./actions";
import { auth, clerkClient } from "@clerk/nextjs/server";
import User from "@/models/User";
import Restaurant from "@/models/Restaurant";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  clerkClient: jest.fn(),
}));

describe("Create Employee Account Server Actions", () => {
  let mongoServer: MongoMemoryServer;
  let adminClerkId: string;
  let testRestaurantId: string;

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

  // Setup admin user and restaurant before each test
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

  describe("createEmployeeAccount", () => {
    it("should create a worker account successfully", async () => {
      const mockClerkUser = {
        id: "clerk_new_worker_123",
        username: "worker123",
        firstName: "John",
        lastName: "Worker",
      };

      // Mock Clerk client
      const mockCreateUser = jest.fn().mockResolvedValue(mockClerkUser);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      const result = await createEmployeeAccount({
        name: "John",
        lastName: "Worker",
        username: "worker123",
        password: "SecurePass123!",
        role: "worker",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe("Employee account created successfully");
      expect(result.user).toBeDefined();
      expect(result.user?.username).toBe("worker123");
      expect(result.user?.role).toBe("worker");

      // Verify user was created in Clerk
      expect(mockCreateUser).toHaveBeenCalledWith({
        username: "worker123",
        password: "SecurePass123!",
        firstName: "John",
        lastName: "Worker",
        skipPasswordRequirement: false,
      });

      // Verify user was created in MongoDB
      const mongoUser = await User.findOne({ clerkId: mockClerkUser.id });
      expect(mongoUser).toBeDefined();
      expect(mongoUser?.role).toBe("worker");
      expect(mongoUser?.restaurantId).toBe(testRestaurantId);
    });

    it("should create a manager account successfully", async () => {
      const mockClerkUser = {
        id: "clerk_new_manager_456",
        username: "manager456",
        firstName: "Jane",
        lastName: "Manager",
      };

      const mockCreateUser = jest.fn().mockResolvedValue(mockClerkUser);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      const result = await createEmployeeAccount({
        name: "Jane",
        lastName: "Manager",
        username: "manager456",
        password: "ManagerPass456!",
        role: "manager",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(true);
      expect(result.user?.role).toBe("manager");

      const mongoUser = await User.findOne({ clerkId: mockClerkUser.id });
      expect(mongoUser?.role).toBe("manager");
    });

    it("should return error when user is not authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "Password123!",
        role: "worker",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unauthorized");
    });

    it("should return error when user is not an admin", async () => {
      // Create a worker user
      const workerClerkId = "clerk_worker_trying";
      await User.create({
        clerkId: workerClerkId,
        role: "worker",
        restaurantId: testRestaurantId,
      });

      (auth as jest.Mock).mockResolvedValue({ userId: workerClerkId });

      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "Password123!",
        role: "worker",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Only admins can create employee accounts");
    });

    it("should reject invalid role (admin)", async () => {
      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "Password123!",
        role: "admin" as any,
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Role must be either manager or worker");
    });

    it("should reject invalid role (student)", async () => {
      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "Password123!",
        role: "student" as any,
        restaurantId: testRestaurantId,
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

      const mockCreateUser = jest.fn().mockRejectedValue(mockError);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "short",
        role: "worker",
        restaurantId: testRestaurantId,
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

      const mockCreateUser = jest.fn().mockRejectedValue(mockError);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "existinguser",
        password: "Password123!",
        role: "worker",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Korisničko ime već postoji");
    });

    it("should handle pwned password error from Clerk", async () => {
      const mockError = {
        clerkError: true,
        errors: [
          {
            code: "form_password_pwned",
            message: "Password has been compromised",
          },
        ],
      };

      const mockCreateUser = jest.fn().mockRejectedValue(mockError);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "password123",
        role: "worker",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Lozinka mora imati minimalno 8 znakova");
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

      const mockCreateUser = jest.fn().mockRejectedValue(mockError);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "Password123!",
        role: "worker",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Something went wrong in Clerk");
    });

    it("should handle MongoDB validation errors", async () => {
      const mockClerkUser = {
        id: "clerk_validation_error",
        username: "testuser",
        firstName: "Test",
        lastName: "User",
      };

      const mockCreateUser = jest.fn().mockResolvedValue(mockClerkUser);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      // Pass invalid restaurantId (empty string)
      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "Password123!",
        role: "worker",
        restaurantId: "", // Invalid
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle network errors gracefully", async () => {
      const mockCreateUser = jest.fn().mockRejectedValue(
        new Error("Network error")
      );
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      const result = await createEmployeeAccount({
        name: "Test",
        lastName: "User",
        username: "testuser",
        password: "Password123!",
        role: "worker",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Neuspješno kreiranje računa zaposlenika");
    });

    it("should create accounts with special characters in names", async () => {
      const mockClerkUser = {
        id: "clerk_special_chars",
        username: "francois",
        firstName: "François",
        lastName: "O'Brien",
      };

      const mockCreateUser = jest.fn().mockResolvedValue(mockClerkUser);
      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          createUser: mockCreateUser,
        },
      });

      const result = await createEmployeeAccount({
        name: "François",
        lastName: "O'Brien",
        username: "francois",
        password: "SecurePass123!",
        role: "worker",
        restaurantId: testRestaurantId,
      });

      expect(result.success).toBe(true);
      expect(result.user?.name).toBe("François");
      expect(result.user?.lastName).toBe("O'Brien");
    });
  });
});

