import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createDish } from "./actions";
import { put } from "@vercel/blob";

// Mock Vercel Blob
jest.mock("@vercel/blob", () => ({
  put: jest.fn(),
}));

describe("Create Dish Server Actions", () => {
  let mongoServer: MongoMemoryServer;

  // Setup: Start in-memory MongoDB before all tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Set the test URI as an environment variable
    process.env.MONGODB_TEST_URI = uri;
  });

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

  it("should create a dish with image upload", async () => {
    // Mock the Vercel Blob upload
    const mockBlobUrl = "https://blob.vercel-storage.com/test-image.jpg";
    (put as jest.Mock).mockResolvedValue({ url: mockBlobUrl });

    // Create FormData
    const formData = new FormData();
    formData.append("name", "Test Pizza");
    formData.append("description", "Delicious test pizza");
    formData.append("category", "Pizza");
    formData.append("allergens", "gluten,dairy");

    // Create a mock file
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    formData.append("image", mockFile);

    const result = await createDish(formData);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.id).toBeDefined();
    expect(result.data.imageUrl).toBe(mockBlobUrl);
    expect(put).toHaveBeenCalledWith(
      expect.stringContaining("dishes/"),
      mockFile,
      { access: "public" },
    );
  });

  it("should create a dish with small image file", async () => {
    // Mock successful upload
    const mockBlobUrl = "https://blob.vercel-storage.com/small-image.jpg";
    (put as jest.Mock).mockResolvedValue({ url: mockBlobUrl });

    const formData = new FormData();
    formData.append("name", "Simple Salad");
    formData.append("description", "Fresh green salad");
    formData.append("category", "Salads");
    formData.append("allergens", "");

    // Provide a small image with content
    const mockFile = new File(["small content"], "small.jpg", {
      type: "image/jpeg",
    });
    formData.append("image", mockFile);

    const result = await createDish(formData);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data.id).toBeDefined();
    expect(result.data.imageUrl).toBe(mockBlobUrl);
    expect(put).toHaveBeenCalledWith(
      expect.stringContaining("dishes/"),
      mockFile,
      { access: "public" },
    );
  });

  it("should handle allergens correctly", async () => {
    const mockBlobUrl = "https://blob.vercel-storage.com/peanut-sandwich.jpg";
    (put as jest.Mock).mockResolvedValue({ url: mockBlobUrl });

    const formData = new FormData();
    formData.append("name", "Peanut Butter Sandwich");
    formData.append("description", "Classic PB sandwich");
    formData.append("category", "Sandwiches");
    formData.append("allergens", "peanuts, gluten, soy");

    const mockFile = new File(["test"], "sandwich.jpg", { type: "image/jpeg" });
    formData.append("image", mockFile);

    const result = await createDish(formData);

    expect(result.success).toBe(true);

    // Verify allergens were parsed correctly
    const conn = await mongoose.connection;
    const DishModel = conn.model("Dish");
    const dish = await DishModel.findById(result.data.id);

    expect(dish.allergens).toHaveLength(3);
    expect(dish.allergens).toContain("peanuts");
    expect(dish.allergens).toContain("gluten");
    expect(dish.allergens).toContain("soy");
  });

  it("should fail with missing required fields", async () => {
    const formData = new FormData();
    formData.append("name", "Incomplete Dish");
    // Missing description and category

    const result = await createDish(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Missing required fields");
    expect(result.errors).toBeDefined();
    expect(result.errors?.description).toBeDefined();
    expect(result.errors?.category).toBeDefined();
  });

  it("should handle duplicate dish names", async () => {
    const mockBlobUrl = "https://blob.vercel-storage.com/pizza.jpg";
    (put as jest.Mock).mockResolvedValue({ url: mockBlobUrl });

    // Create first dish
    const formData1 = new FormData();
    formData1.append("name", "Unique Pizza");
    formData1.append("description", "First pizza");
    formData1.append("category", "Pizza");
    const mockFile1 = new File(["test"], "pizza1.jpg", { type: "image/jpeg" });
    formData1.append("image", mockFile1);

    const result1 = await createDish(formData1);
    expect(result1.success).toBe(true);

    // Try to create duplicate
    const formData2 = new FormData();
    formData2.append("name", "Unique Pizza");
    formData2.append("description", "Second pizza");
    formData2.append("category", "Pizza");
    const mockFile2 = new File(["test"], "pizza2.jpg", { type: "image/jpeg" });
    formData2.append("image", mockFile2);

    const result2 = await createDish(formData2);

    expect(result2.success).toBe(false);
    expect(result2.message).toBe("A dish with this name already exists");
    expect(result2.errors?.name).toBe("This name is already taken");
  });

  it("should handle image upload failure", async () => {
    // Mock failed upload
    (put as jest.Mock).mockRejectedValue(new Error("Upload failed"));

    const formData = new FormData();
    formData.append("name", "Test Dish");
    formData.append("description", "Test description");
    formData.append("category", "Test");

    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    formData.append("image", mockFile);

    const result = await createDish(formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Failed to upload image");
    expect(result.errors?.image).toBe("Image upload failed");
  });

  it("should trim whitespace from inputs", async () => {
    const mockBlobUrl = "https://blob.vercel-storage.com/spaced-pizza.jpg";
    (put as jest.Mock).mockResolvedValue({ url: mockBlobUrl });

    const formData = new FormData();
    formData.append("name", "  Spaced Pizza  ");
    formData.append("description", "  Spaced description  ");
    formData.append("category", "  Spaced Category  ");
    formData.append("allergens", " dairy , gluten , eggs ");
    const mockFile = new File(["test"], "pizza.jpg", { type: "image/jpeg" });
    formData.append("image", mockFile);

    const result = await createDish(formData);

    expect(result.success).toBe(true);

    const conn = await mongoose.connection;
    const DishModel = conn.model("Dish");
    const dish = await DishModel.findById(result.data.id);

    expect(dish.name).toBe("Spaced Pizza");
    expect(dish.description).toBe("Spaced description");
    expect(dish.category).toBe("Spaced Category");
    expect(dish.allergens).toEqual(["dairy", "gluten", "eggs"]);
  });
});
