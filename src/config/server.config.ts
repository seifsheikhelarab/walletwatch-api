import express from "express";
import { router } from "../routes.ts";

export default function serverSetup() {
  const app = express();
  app.use(express.json())
  return app;
};