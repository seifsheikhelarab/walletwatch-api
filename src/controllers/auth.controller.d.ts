declare module "express-session" {
  interface SessionData {
    userId: string;
    isAuthenticated?: boolean;
  }
}