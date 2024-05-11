import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/User";

// login a user
const authController = async (req: Request, res: Response) => {
  // validate the user data
  const result = validateUser(req.body);
  if (!result.success) {
    return res
      .status(400)
      .send({ message: "Validation failed", errors: result.error.format() });
  }

  try {
    // check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // check if the password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // generate a token
    const token = user.generateAuthToken();

    res.header("x-auth-token", token).send({ message: `Welcome ${user.name}` });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).send("Internal Server Error");
  }
};

// validateUser data
function validateUser(body: { email: string; password: string }) {
  const schema = z.object({
    email: z.string().min(5).max(255).email(),
    password: z.string().min(5).max(255),
  });
  return schema.safeParse(body);
}

export default authController;
