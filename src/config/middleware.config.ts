//Configuration for various Middleware used
//Morgan is used for logging requests
//Method-override is used for DELETE, PUT, etc.

import { Application } from "express";
import express from "express";
import path from "path";
import morgan from "morgan";
import methodOverride from "method-override";

export default function middlewareSetup(app: Application) {

    app.use(morgan("dev"));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            const method = req.body._method;
            delete req.body._method;
            return method;
        }
    }));
}