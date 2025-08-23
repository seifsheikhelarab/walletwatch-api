//Configuration for Swagger to generate API documentation
//Needs Update
import dotenv from "dotenv";
dotenv.config();

import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../../swagger.json" with { type: "json" };


export default function swaggerSetup(app: Application) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}