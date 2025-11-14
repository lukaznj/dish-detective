import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { getUserRole } from "./actions";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

describe("App Root Server Actions", () => {
  let mongoServer: MongoMemoryServer;

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

  // Clear database after each test
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    jest.clearAllMocks();
  });

  describe("getUserRole", () => {
    it("should return error when user is not authenticated", async () => {
      // Mock unauthenticated user
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await getUserRole();

      expect(result.role).toBeNull();
      expect(result.error).toBe("Unauthorized");
    });

    it("should create a new student user if user doesn't exist", async () => {
      // Mock authenticated user
      const mockUserId = "clerk_test_user_123";
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      const result = await getUserRole();

      expect(result.role).toBe("student");
      expect(result.error).toBeNull();

      // Verify user was created in database
      const user = await User.findOne({ clerkId: mockUserId });
      expect(user).toBeDefined();
      expect(user?.role).toBe("student");
      expect(user?.clerkId).toBe(mockUserId);
    });

    it("should return existing user role without creating duplicate", async () => {
      // Mock authenticated user
      const mockUserId = "clerk_existing_user_456";
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Create an existing admin user
      await User.create({
        clerkId: mockUserId,
        role: "admin",
      });

      const result = await getUserRole();

      expect(result.role).toBe("admin");
      expect(result.error).toBeNull();

      // Verify only one user exists
      const userCount = await User.countDocuments({ clerkId: mockUserId });
      expect(userCount).toBe(1);
    });

    it("should return existing worker role", async () => {
      // Mock authenticated user
      const mockUserId = "clerk_worker_789";
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Create an existing worker user
      await User.create({
        clerkId: mockUserId,
        role: "worker",
        restaurantId: "restaurant_123",
      });

      const result = await getUserRole();

      expect(result.role).toBe("worker");
      expect(result.error).toBeNull();
    });

    it("should return existing manager role", async () => {
      // Mock authenticated user
      const mockUserId = "clerk_manager_101";
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Create an existing manager user
      await User.create({
        clerkId: mockUserId,
        role: "manager",
        restaurantId: "restaurant_456",
      });

      const result = await getUserRole();

      expect(result.role).toBe("manager");
      expect(result.error).toBeNull();
    });

    it("should handle database errors gracefully", async () => {
      // Mock authenticated user
      (auth as jest.Mock).mockResolvedValue({ userId: "clerk_test_error" });

      // Mock database error by closing connection
      await mongoose.connection.close();

      const result = await getUserRole();

      expect(result.role).toBeNull();
      expect(result.error).toBe("Failed to fetch user role");

      // Reconnect for cleanup
      const uri = mongoServer.getUri();
      process.env.MONGODB_TEST_URI = uri;
      await mongoose.connect(uri);
    });

    it("should handle Clerk auth errors", async () => {
      // Mock auth throwing an error
      (auth as jest.Mock).mockRejectedValue(
        new Error("Clerk service unavailable"),
      );

      const result = await getUserRole();

      expect(result.role).toBeNull();
      expect(result.error).toBe("Failed to fetch user role");
    });

    it("should handle upsert correctly on concurrent requests", async () => {
      // Mock authenticated user
      const mockUserId = "clerk_concurrent_user";
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Simulate concurrent requests
      const [result1, result2, result3] = await Promise.all([
        getUserRole(),
        getUserRole(),
        getUserRole(),
      ]);

      // All should return student role
      expect(result1.role).toBe("student");
      expect(result2.role).toBe("student");
      expect(result3.role).toBe("student");

      // Verify only one user was created
      const userCount = await User.countDocuments({ clerkId: mockUserId });
      expect(userCount).toBe(1);
    });
  });
});
