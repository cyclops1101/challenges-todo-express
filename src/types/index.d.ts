export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface IColor {
  name: string;
  code: string;
  id: string;
}

export interface IIcon {
  name: string;
  symbol: string;
  id: string;
}

export interface ICategory {
  name: string;
  isEditable: boolean;
  color: IColor;
  icon: IIcon;
  user: string;
}

export interface ITask {
  _id: string;
  name: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  isEditable: boolean;
  category: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}
