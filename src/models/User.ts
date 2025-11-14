import mongoose, { Schema, Document, Model } from "mongoose";

// Role type
export type UserRole = "student" | "admin" | "manager" | "worker";

// User document interface
export interface IUser extends Document {
  clerkId: string;
  restaurantId?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: [true, "Clerk ID is required"],
      unique: true,
      trim: true,
    },
    restaurantId: {
      type: String,
      trim: true,
      required: function (this: IUser) {
        return this.role === "manager" || this.role === "worker";
      },
      validate: {
        validator: function (this: IUser, value: string) {
          // If role is admin or student, restaurantId must NOT be provided
          if (this.role === "admin" || this.role === "student") {
            return !value; // Must be empty/null/undefined
          }
          // If role is manager or worker, restaurantId must be provided
          if (this.role === "manager" || this.role === "worker") {
            return !!value; // Must have a value
          }
          return true;
        },
        message: function (this: IUser) {
          if (this.role === "admin" || this.role === "student") {
            return "Admin and student users cannot have a restaurant ID";
          }
          return "Restaurant ID is required for managers and workers";
        },
      },
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["student", "admin", "manager", "worker"],
        message: "{VALUE} is not a valid role",
      },
    },
  },
  {
    timestamps: true,
  },
);

// Prevent errors in hot reloads
const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
