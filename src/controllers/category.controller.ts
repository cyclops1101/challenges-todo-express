import Category from "../models/category.model";
import { Response } from "express";
import { AuthRequest } from "../middleware";
import { ICategory } from "../types";

export const listCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Category.find({
      user: req.user,
    });

    return res.status(200).json({
      message: "Categories retrieved successfully",
      data: { categories },
    });
  } catch (err) {
    res.status(400).json({ message: "Unable to retrieve categories" });
    throw err;
  }
};

export const getCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res
      .status(200)
      .json({ message: "Category retrieved successfully", data: { category } });
  } catch (err) {
    res.status(400).json({ message: "Unable to retrieve category" });
    throw err;
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, color, icon, isEditable }: ICategory = req.body;
    if (!name || !color || !icon) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const category = await Category.create({
      name,
      isEditable,
      color,
      icon,
      user: req.user,
    });
    return res
      .status(201)
      .json({ message: "Category created successfully", data: { category } });
  } catch (err) {
    res.status(400).json({ message: "Unable to create category" });
    throw err;
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const _id = req.params.id;
    const { name, color, icon, isEditable }: ICategory = req.body;
    if (!name || !color || !icon) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    const existingCategory = await Category.findByIdAndUpdate(_id);
    if (!existingCategory || existingCategory.user.toString()!== req.user) {
      return res.status(401).json({ message: "No such category exists" });
    }
    const category = await Category.findByIdAndUpdate(
       _id,
      {
        name,
        color,
        icon,
        isEditable,
      }
    );
    return res
      .status(200)
      .json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Unable to update category" });
    throw err;
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const existingCategory = await Category.findById(id);
    if (!existingCategory || existingCategory.user.toString()!== req.user) {
      return res.status(401).json({ message: "No such category exists" });
    }
    const category = await Category.deleteOne({ _id: id });
    return res
      .status(200)
      .json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Unable to delete category" });
    throw err;
  }
};
