import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../utils/logger.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongodbUri);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection failed", error);

    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.connection.close();

  logger.info("MongoDB connection closed");
};

export const isDatabaseConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};