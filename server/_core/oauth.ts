import type { Express, Request, Response } from "express";
import * as db from "../db";
import { googleAuth } from "./googleAuth";
import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.REDIRECT_URI || "http://localhost:3000/api/oauth/callback";
const COOKIE_NAME = "auth-session";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Google OAuth login endpoint
  app.get("/api/oauth/login", (req: Request, res: Response) => {
    const state = Buffer.from(JSON.stringify({ timestamp: Date.now() })).toString("base64");
    const scope = "openid profile email";
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    
    googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", scope);
    googleAuthUrl.searchParams.set("state", state);

    res.redirect(googleAuthUrl.toString());
  });

  // Google OAuth callback
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      // Exchange code for token
      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      });

      const accessToken = tokenResponse.data.access_token;

      // Get user info
      const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id, name, email } = userInfoResponse.data;

      if (!id) {
        res.status(400).json({ error: "User ID missing from Google response" });
        return;
      }

      // Upsert user
      await db.upsertUser({
        openId: id,
        name: name || null,
        email: email || null,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });

      // Get user from database
      const user = await db.getUserByOpenId(id);
      if (!user) {
        res.status(500).json({ error: "Failed to create user session" });
        return;
      }

      // Create session token
      const sessionToken = await googleAuth.createSession(user);
      if (!sessionToken) {
        res.status(500).json({ error: "Failed to create session token" });
        return;
      }

      // Set cookie
      googleAuth.setSessionCookie(res, sessionToken);

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // Logout endpoint
  app.post("/api/oauth/logout", (req: Request, res: Response) => {
    googleAuth.clearSessionCookie(res);
    res.json({ success: true });
  });
}
