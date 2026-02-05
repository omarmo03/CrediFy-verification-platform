import type { Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
};

const JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret);
const COOKIE_NAME = "auth-session";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export class GoogleAuthService {
  async createSession(user: User): Promise<string | null> {
    const payload: SessionPayload = {
      userId: user.id,
      email: user.email || "",
      name: user.name || "",
    };

    try {
      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1y")
        .sign(JWT_SECRET);
      return token;
    } catch (error) {
      console.error("Failed to create session:", error);
      return null;
    }
  }

  async verifySession(token: string): Promise<SessionPayload | null> {
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      return verified.payload as SessionPayload;
    } catch {
      return null;
    }
  }

  async authenticateRequest(req: Request): Promise<User | null> {
    const cookies = req.headers.cookie || "";
    const cookieObj = Object.fromEntries(
      cookies.split("; ").map((c) => c.split("="))
    );
    const token = cookieObj[COOKIE_NAME];

    if (!token) {
      return null;
    }

    const payload = await this.verifySession(token);
    if (!payload) {
      return null;
    }

    const user = await db.getUserById(payload.userId);
    return user || null;
  }

  setSessionCookie(res: Response, token: string): void {
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ONE_YEAR_MS / 1000}`
    );
  }

  clearSessionCookie(res: Response): void {
    res.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
    );
  }
}

export const googleAuth = new GoogleAuthService();
