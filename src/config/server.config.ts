import express from "express";
import sessionSetup from "./session.config.js";

export default function serverSetup() {
  const app = express();
  app.use(express.json())
  sessionSetup(app);
  return app;
};