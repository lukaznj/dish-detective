"use server";

import Dish from "../../../models/Dish";
import dbConnect from "../../../utils/dbConnect";
import { Types } from "mongoose";

type DishInput = {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  allergens: string[];
};

type ActionResponse = {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string>;
};

export async function createDish(
  input: DishInput,
): Promise<ActionResponse> {
  try {
    const conn = await dbConnect();
    // Needed because we use a custom connection
    const DishModel = conn.model("Dish", Dish.schema);

    // Validate input
    const errors: Record<string, string> = {};

    if (!input.name || input.name.trim().length === 0) {
      errors.name = "Name is required";
    }

    if (!input.description || input.description.trim().length === 0) {
      errors.description = "Description is required";
    }

    if (!input.category || input.category.trim().length === 0) {
      errors.category = "Category is required";
    }

    if (!input.imageUrl || input.imageUrl.trim().length === 0) {
      errors.imageUrl = "Image URL is required";
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Validation failed",
        errors,
      };
    }

    const dish = await DishModel.create({
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      imageUrl: input.imageUrl.trim(),
      allergens: input.allergens || [],
    });

    return {
      success: true,
      message: "Dish created successfully",
      data: {
        id: (dish._id as Types.ObjectId).toString(),
        name: dish.name,
        category: dish.category,
      },
    };
  } catch (error: any) {
    console.error("Error creating dish:", error);

    // Handle duplicate name error
    if (error.code === 11000) {
      return {
        success: false,
        message: "A dish with this name already exists",
        errors: { name: "This name is already taken" },
      };
    }

    // Mongoose validation
    if (error.name === "ValidationError") {
      const errors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return {
        success: false,
        message: "Validation failed",
        errors,
      };
    }

    return {
      success: false,
      message: "Failed to create dish. Please try again.",
    };
  }
}

export async function deleteDish(dishId: string): Promise<ActionResponse> {
  try {
    const conn = await dbConnect();
    // Needed because we use a custom connection
    const DishModel = conn.model("Dish", Dish.schema);

    // Check if passed id even exists
    if (!dishId || dishId.trim().length === 0) {
      return {
        success: false,
        message: "Dish ID is required",
        errors: { id: "Invalid dish ID" },
      };
    }

    // Validate id
    if (!conn.Types.ObjectId.isValid(dishId)) {
      return {
        success: false,
        message: "Invalid dish ID format",
        errors: { id: "Invalid ObjectId format" },
      };
    }

    const deletedDish = await DishModel.findByIdAndDelete(dishId);

    if (!deletedDish) {
      return {
        success: false,
        message: "Dish not found",
      };
    }

    return {
      success: true,
      message: "Dish deleted successfully",
      data: {
        id: (deletedDish._id as Types.ObjectId).toString(),
        name: deletedDish.name,
      },
    };
  } catch (error: any) {
    console.error("Error deleting dish:", error);

    return {
      success: false,
      message: "Failed to delete dish. Please try again.",
    };
  }
}

export async function getAllDishes(): Promise<ActionResponse> {
  try {
    const conn = await dbConnect();
    // Needed because we use a custom connection
    const DishModel = conn.model("Dish", Dish.schema);

    const dishes = await DishModel.find({})
      .sort({ name: 1 }) // Sort while we still have MongoDB objects to be more efficient
      .lean() // Returns plain JavaScript objects
      .exec();

    // Convert _id to string for JSON serialization
    const serializedDishes = dishes.map((dish) => ({
      ...dish,
      _id: dish._id.toString(),
      createdAt: dish.createdAt.toISOString(),
      updatedAt: dish.updatedAt.toISOString(),
    }));

    return {
      success: true,
      message: `Retrieved ${dishes.length} dishes`,
      data: serializedDishes,
    };
  } catch (error: any) {
    console.error("Error retrieving dishes:", error);

    return {
      success: false,
      message: "Failed to retrieve dishes. Please try again.",
    };
  }
}

export async function updateDish(
  dishId: string,
  input: Partial<DishInput>,
): Promise<ActionResponse> {
  try {
    const conn = await dbConnect();
    // Needed because we use a custom connection
    const DishModel = conn.model("Dish", Dish.schema);

    // Check if passed id even exists
    if (!dishId || dishId.trim().length === 0) {
      return {
        success: false,
        message: "Dish ID is required",
        errors: { id: "Invalid dish ID" },
      };
    }

    // Validate id
    if (!conn.Types.ObjectId.isValid(dishId)) {
      return {
        success: false,
        message: "Invalid dish ID format",
        errors: { id: "Invalid ObjectId format" },
      };
    }

    // Validate input fields if provided
    const errors: Record<string, string> = {};

    if (input.name !== undefined && input.name.trim().length === 0) {
      errors.name = "Name cannot be empty";
    }

    if (
      input.description !== undefined &&
      input.description.trim().length === 0
    ) {
      errors.description = "Description cannot be empty";
    }

    if (input.category !== undefined && input.category.trim().length === 0) {
      errors.category = "Category cannot be empty";
    }

    if (input.imageUrl !== undefined && input.imageUrl.trim().length === 0) {
      errors.imageUrl = "Image URL cannot be empty";
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Validation failed",
        errors,
      };
    }

    // Update only whats provided
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.description !== undefined)
      updateData.description = input.description.trim();
    if (input.category !== undefined)
      updateData.category = input.category.trim();
    if (input.imageUrl !== undefined)
      updateData.imageUrl = input.imageUrl.trim();
    if (input.allergens !== undefined) updateData.allergens = input.allergens;

    const updatedDish = await DishModel.findByIdAndUpdate(dishId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDish) {
      return {
        success: false,
        message: "Dish not found",
      };
    }

    return {
      success: true,
      message: "Dish updated successfully",
      data: {
        id: (updatedDish._id as Types.ObjectId).toString(),
        name: updatedDish.name,
        category: updatedDish.category,
      },
    };
  } catch (error: any) {
    console.error("Error updating dish:", error);

    // Handle duplicate name error
    if (error.code === 11000) {
      return {
        success: false,
        message: "A dish with this name already exists",
        errors: { name: "This name is already taken" },
      };
    }

    if (error.name === "ValidationError") {
      const errors: Record<string, string> = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });

      return {
        success: false,
        message: "Validation failed",
        errors,
      };
    }

    return {
      success: false,
      message: "Failed to update dish. Please try again.",
    };
  }
}
