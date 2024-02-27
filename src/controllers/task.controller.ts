import { Response } from "express";
import Task from "../models/task.model";
import { AuthRequest } from "../middleware";
import { ITask } from "../types";

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const tasks = await Task.find({ user: userId });

    return res
      .status(200)
      .json({ message: "Tasks retrieved successfully", data: { tasks } });
  } catch (err) {
    res.status(400).json({ message: "Unable to retrieve tasks" });
    throw err;
  }
};

export const getTasksByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;
    const userId = req.user;
    const tasks = await Task.find({ user: userId, category });
    return res
      .status(200)
      .json({ message: "Tasks retrieved successfully", data: { tasks } });
  } catch (err) {
    res.status(400).json({ message: "Unable to retrieve tasks" });
    throw err;
  }
};

export const getCompletedTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const tasks = await Task.find({ user: userId, isCompleted: true });
    return res
      .status(200)
      .json({ message: "Tasks retrieved successfully", data: { tasks } });
  } catch (err) {
    res.status(400).json({ message: "Unable to retrieve tasks" });
    throw err;
  }
};

export const getTodaysTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasks = await Task.find({
      user: userId,
      dueDate: today.toISOString(),
    });
    return res
      .status(200)
      .json({ message: "Tasks retrieved successfully", data: { tasks } });
  } catch (err) {
    res.status(400).json({ message: "Unable to retrieve tasks" });
    throw err;
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, dueDate, category, isEditable }: ITask =
      req.body;
    if (!name || !description || !dueDate || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    const dueDateZeroed = new Date(dueDate);
    dueDateZeroed.setHours(0, 0, 0, 0);
    const task = await Task.create({
      name,
      description,
      dueDate: dueDateZeroed.toISOString(),
      category,
      isEditable,
      user: req.user,
    });
    return res
      .status(201)
      .json({ message: "Task created successfully", data: { task } });
  } catch (err) {
    res.status(400).json({ message: "Unable to create task" });
    throw err;
  }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await Task.findByIdAndUpdate(
      { _id: req.params.id },
      {
        isCompleted,
      }
    );
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Unable to update task" });
    throw err;
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, dueDate, isCompleted, category }: ITask =
      req.body;
    if (!name || !description || !dueDate || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }
    const existingTask = await Task.findById(req.params.id);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!existingTask.isEditable) {
      return res.status(400).json({ message: "Task is not editable" });
    }

    const task = await Task.updateOne(
      { _id: req.params.id },
      {
        name,
        description,
        dueDate,
        isCompleted,
        category,
      }
    );
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Unable to update task" });
    throw err;
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete({ _id: req.params.id });
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Unable to delete task" });
    throw err;
  }
};
