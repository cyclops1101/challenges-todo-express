import mongoose from "mongoose";

export async function connectToDB() {
  try {
    const connection = await mongoose.connect(
      `${process.env.DB_HOST}${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_APPNAME}`,
    );
    if (connection) {
      console.log("Database connected");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
