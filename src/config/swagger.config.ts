//Configuration for Swagger to generate API documentation
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../../swagger.json" with { type: "json" };


export default function swaggerSetup(app: Application): void {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
}