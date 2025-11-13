import mongoose, { Schema, Document, Model } from "mongoose";

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IRestaurant extends Document {
  name: string;
  address: string;
  imageUrl: string;
  workingHours: string[];
  location: Location;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    workingHours: {
      type: [String],
      required: [true, "Working hours are required"],
      validate: {
        validator: function (arr: string[]) {
          return arr.length > 0;
        },
        message: "Working hours must contain at least one entry",
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (arr: number[]) {
            return arr.length === 2;
          },
          message: "Coordinates must contain exactly [longitude, latitude]",
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

const Restaurant: Model<IRestaurant> = mongoose.model<IRestaurant>(
  "Restaurant",
  restaurantSchema,
);

export default Restaurant;
