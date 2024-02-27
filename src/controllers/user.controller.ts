import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { IUser } from "../types/index";

const getUserToken = (_id: string | Types.ObjectId) => {
  return jwt.sign({ sub: _id }, "secret", { expiresIn: "7d" });
};

export const listUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json({ message: "Users retrieved successfully", data: { users } });
  } catch (err) {
    res.status(400).json({ message: "Unable to retrieve users" });
    throw err;
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", data: { user } });
  } catch (err) {
    res.status(400).json({ message: "Unable to create user" });
    throw err;
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: IUser = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      data: {
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          token: getUserToken(existingUser._id),
        },
      },
    });
  } catch (err) {
    res.status(400).json({ message: "Unable to login user" });
    throw err;
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  // TODO: Implement logout functionality
  res.status(200).json({ message: "User logged out successfully" });
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = await User.updateOne(
      { email },
      {
        name,
        email,
      }
    );
    return res
      .status(200)
      .json({ message: "User updated successfully", data: { user } });
  } catch (err) {
    res.status(400).json({ message: "Unable to update user" });
    throw err;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    await User.deleteOne({ email });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Unable to delete user" });
    throw err;
  }
};
