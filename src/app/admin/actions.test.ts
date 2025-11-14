import { getCurrentUserFirstName } from "./actions";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  clerkClient: jest.fn(),
}));

describe("Admin Server Actions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getCurrentUserFirstName", () => {
    it("should return user first name successfully", async () => {
      const mockUserId = "clerk_user_123";
      const mockFirstName = "John";

      // Mock authentication
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Mock Clerk client
      const mockGetUser = jest.fn().mockResolvedValue({
        id: mockUserId,
        firstName: mockFirstName,
        lastName: "Doe",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getCurrentUserFirstName();

      expect(result.success).toBe(true);
      expect(result.firstName).toBe(mockFirstName);
      expect(result.error).toBeNull();
      expect(auth).toHaveBeenCalled();
      expect(clerkClient).toHaveBeenCalled();
      expect(mockGetUser).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty string when user has no first name", async () => {
      const mockUserId = "clerk_user_456";

      // Mock authentication
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Mock Clerk client with user without firstName
      const mockGetUser = jest.fn().mockResolvedValue({
        id: mockUserId,
        firstName: null,
        lastName: "Smith",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getCurrentUserFirstName();

      expect(result.success).toBe(true);
      expect(result.firstName).toBe("");
      expect(result.error).toBeNull();
    });

    it("should return error when user is not authenticated", async () => {
      // Mock unauthenticated user
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await getCurrentUserFirstName();

      expect(result.success).toBe(false);
      expect(result.firstName).toBeNull();
      expect(result.error).toBe("Not authenticated");
      expect(clerkClient).not.toHaveBeenCalled();
    });

    it("should handle Clerk API errors gracefully", async () => {
      const mockUserId = "clerk_user_789";

      // Mock authentication
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Mock Clerk client throwing an error
      const mockGetUser = jest
        .fn()
        .mockRejectedValue(new Error("Clerk API error: User not found"));

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getCurrentUserFirstName();

      expect(result.success).toBe(false);
      expect(result.firstName).toBeNull();
      expect(result.error).toBe("Failed to fetch user information");
    });

    it("should handle auth errors gracefully", async () => {
      // Mock auth throwing an error
      (auth as jest.Mock).mockRejectedValue(
        new Error("Authentication service unavailable"),
      );

      const result = await getCurrentUserFirstName();

      expect(result.success).toBe(false);
      expect(result.firstName).toBeNull();
      expect(result.error).toBe("Failed to fetch user information");
      expect(clerkClient).not.toHaveBeenCalled();
    });

    it("should handle clerkClient initialization errors", async () => {
      const mockUserId = "clerk_user_101";

      // Mock authentication
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Mock clerkClient throwing an error
      (clerkClient as jest.Mock).mockRejectedValue(
        new Error("Failed to initialize Clerk client"),
      );

      const result = await getCurrentUserFirstName();

      expect(result.success).toBe(false);
      expect(result.firstName).toBeNull();
      expect(result.error).toBe("Failed to fetch user information");
    });

    it("should handle users with special characters in first name", async () => {
      const mockUserId = "clerk_user_special";
      const mockFirstName = "François-René";

      // Mock authentication
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Mock Clerk client
      const mockGetUser = jest.fn().mockResolvedValue({
        id: mockUserId,
        firstName: mockFirstName,
        lastName: "Dupont",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getCurrentUserFirstName();

      expect(result.success).toBe(true);
      expect(result.firstName).toBe(mockFirstName);
      expect(result.error).toBeNull();
    });

    it("should handle very long first names", async () => {
      const mockUserId = "clerk_user_long";
      const mockFirstName = "A".repeat(100);

      // Mock authentication
      (auth as jest.Mock).mockResolvedValue({ userId: mockUserId });

      // Mock Clerk client
      const mockGetUser = jest.fn().mockResolvedValue({
        id: mockUserId,
        firstName: mockFirstName,
        lastName: "Test",
      });

      (clerkClient as jest.Mock).mockResolvedValue({
        users: {
          getUser: mockGetUser,
        },
      });

      const result = await getCurrentUserFirstName();

      expect(result.success).toBe(true);
      expect(result.firstName).toBe(mockFirstName);
      expect(result.firstName.length).toBe(100);
      expect(result.error).toBeNull();
    });
  });
});
