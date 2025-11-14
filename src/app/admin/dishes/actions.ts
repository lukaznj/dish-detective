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

export async function deleteDish(dishId: string): Promise<ActionResponse> {
  try {
    const conn = await dbConnect();
    // Needed because we use a custom connection
    const DishModel = conn.model("Dish", Dish.schema);

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

