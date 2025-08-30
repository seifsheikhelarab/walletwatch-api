// Configuration for Passport.js to handle OAuth2.0 authentication

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.ts';
import { logger } from './logger.config.ts';
import { Application } from 'express';

export default function passportSetup(app: Application) {

    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await User.findById(id).select('-password');
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_REDIRECT_URI!,
        scope: ['profile', 'email']
    }, async (accessToken: string, refreshToken: string, profile: any, done: (error: Error | null, user?: any) => void) => {
        try {
            const user = await findOrCreateUser(profile, 'google');
            return done(null, user);
        } catch (error: any) {
            logger.error('Google OAuth error:', error);
            return done(error as Error, undefined);
        }
    }));
}

async function findOrCreateUser(profile: any, provider: 'google') {
    try {
        let user = await User.findOne({
            oauthProvider: provider,
            oauthId: profile.id
        });

        if (user) return user;

        if (profile.emails?.[0]?.value) {
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                user.oauth = provider;
                user.oauthId = profile.id;
                await user.save();
                return user;
            }
        }

        const userData = {
            oauth: provider,
            oauthId: profile.id,
            name: `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`,
            email: profile.emails?.[0]?.value,
        };

        user = await User.create(userData);
        return user;
    } catch (error) {
        logger.error(`Error finding/creating user: ${error}`);
        throw error;
    }
}

