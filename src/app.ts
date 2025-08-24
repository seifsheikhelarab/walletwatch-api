import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { router } from "./routes.js";

import databaseSetup from "./config/database.config.js";
import middlewareSetup from "./config/middleware.config.js";
import sessionSetup from "./config/session.config.js";
import passportSetup from "./config/passport.config.js";
import swaggerSetup from "./config/swagger.config.js";
import schedulerSetup from "./config/scheduler.config.js";
import { logger } from "./config/logger.config.js";

export const app = express();

// Core configurations
databaseSetup();
sessionSetup(app);
passportSetup(app);
middlewareSetup(app);
swaggerSetup(app);
schedulerSetup();

// Routes
app.use("/api", router);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`App Started on http://localhost:${port}`));

export default app;