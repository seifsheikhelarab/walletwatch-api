//Configuration for Sessions and Session Stores

import { Request, Response, NextFunction } from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { Application } from "express";
import { logger } from "./logger.config.ts";

declare module "express-session" {
    interface SessionData {
        userId: string;
        isAuthenticated?: boolean;
    }
}


export default function sessionSetup(app: Application) {
    const store = MongoStore.create({
        mongoUrl: process.env.MONGO_URI!,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native',
        touchAfter: 24 * 3600
    });

    // Monitor session store
    store.on('error', (error) => {
        logger.error('Session store error:', error);
    });

    store.on('connected', () => {
        logger.info('Session store connected');
    });

    app.use(session({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: true,
        saveUninitialized: true,
        store: store,
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        },
        name: 'sessionId',
        rolling: true
    }));

    app.use((err: any, req: any, res: any, next: any) => {
        if (err.code === 'ECONNREFUSED') {
            logger.error('Session store connection failed');
            return res.status(500).json({ msg: 'Session service unavailable' });
        }
        next(err);
    });
}


export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.userId) {
        return next();
    } else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}