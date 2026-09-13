import { isDatabaseConnected } from "../config/database.js";

export const getHealthStatus = () => {
  const databaseConnected = isDatabaseConnected();

  return {
    status: databaseConnected ? "healthy" : "degraded",
    database: databaseConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  };
};