import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { z } from "zod";
import { IUser } from "../entities/IUser";

// userSchema
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

// generateAuthToken
userSchema.methods.generateAuthToken = function (): string {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    process.env.JWT_PRIVATE_KEY as string,
    { expiresIn: "1h" }
  );
  return token;
};

// User model
const User = mongoose.model<IUser>("User", userSchema);

// validateUser
function validateUser(user: IUser) {
  const schema = z.object({
    name: z.string().min(3).max(50),
    email: z.string().min(5).max(255).email(),
    password: z.string().min(5).max(255),
  });
  return schema.safeParse(user);
}

export { User, validateUser };
