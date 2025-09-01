import express from "express";
import sessionSetup from "./session.config.ts";

export default function serverSetup() {
  const app = express();
  app.use(express.json())
  sessionSetup(app);
  return app;
};