import bcrypt from "bcrypt";
import { Request, Response } from "express";
import _ from "lodash";
import { User, validateUser } from "../models/User";

// register a new user
const registerUser = async (req: Request, res: Response) => {
  // Validate the user data
  const result = validateUser(req.body);
  if (!result.success) {
    return res
      .status(400)
      .send({ message: "Validation failed", errors: result.error.format() });
  }

  try {
    // make sure the user doesn't already exist
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send({ message: "User already registered" });
    }

    // hash and salt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create the new user
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();

    // generate a token
    const token = user.generateAuthToken();

    // send the user data and token
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["_id", "name", "email"]));
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).send("Internal Server Error");
  }
};

export { registerUser };
