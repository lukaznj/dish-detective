import mongoose, { Schema, Document, Model } from 'mongoose';

// Role type
export type UserRole = 'student' | 'admin' | 'manager' | 'worker';

// User document interface
export interface IUser extends Document {
  id: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
      trim: true
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['student', 'admin', 'manager', 'worker'],
        message: '{VALUE} is not a valid role'
      }
    }
  },
  {
    timestamps: true
  }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;