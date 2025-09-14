import dotenv from "dotenv";
dotenv.config({ quiet: true });

import databaseSetup from "./config/mongodb.config.js";
import middlewareSetup from "./config/middleware.config.js";
import passportSetup from "./config/passport.config.js";
import swaggerSetup from "./config/swagger.config.js";
import schedulerSetup from "./config/scheduler.config.js";
import { logger, loggerSetup } from "./config/logger.config.js";
import serverSetup from "./config/server.config.js";
import { router } from "./routes.js";
import { Response } from "express";


// Core configurations
const app = serverSetup();
databaseSetup();
passportSetup(app);
middlewareSetup(app);
swaggerSetup(app);
schedulerSetup();
loggerSetup(app);

app.use("/", router);
app.use((res:Response) => res.status(404).json({ error: "Not Found" }));

// Start server
const port = process.env.PORT || 4650;
app.listen(port, () => logger.info(`App Started on http://localhost:${port}`));