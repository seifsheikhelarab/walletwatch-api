import dotenv from "dotenv";
dotenv.config();

import databaseSetup from "./config/mongodb.config.ts";
import middlewareSetup from "./config/middleware.config.ts";
import passportSetup from "./config/passport.config.ts";
import swaggerSetup from "./config/swagger.config.ts";
import schedulerSetup from "./config/scheduler.config.ts";
import { logger, loggerSetup } from "./config/logger.config.ts";
import serverSetup from "./config/server.config.ts";
import { router } from "./routes.ts";


// Core configurations
const app = serverSetup();
databaseSetup();
passportSetup(app);
middlewareSetup(app);
swaggerSetup(app);
schedulerSetup();
loggerSetup(app);

app.use("/", router);
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Start server
const port = process.env.PORT || 4650;
app.listen(port, () => logger.info(`App Started on http://localhost:${port}`));