import { User } from '../models/user.model.js';
import { logger } from '../config/logger.config.js';
interface OAuthProfile {
    id: string;
    displayName: string;
    name?: {
        givenName?: string;
        familyName?: string;
    };
    emails?: Array<{ value: string }>;
}

class OAuthService {
    constructor() {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
            throw new Error('Missing required Google OAuth environment variables');
        }
    }


    async findOrCreateUser(profile: OAuthProfile, provider: 'google') {
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
                name: `${profile.name!.givenName || ''} ${profile.name!.familyName || ''}`,
                email: profile.emails![0].value,
            };

            user = await User.create(userData);
            return user;
        } catch (error) {
            logger.error(`Error finding/creating user: ${error}`);
            throw error;
        }
    }
}

export const oauthService = new OAuthService();
