import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

const AUTH_PORTAL_ORIGIN = "https://manus.im";

function firstForwardedValue(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.split(",")[0]?.trim() || undefined;
}

export function getPublicRequestOrigin(req: Request): string | undefined {
  const host = firstForwardedValue(req.headers["x-forwarded-host"]) ?? req.get("host");
  if (!host) return undefined;

  const protocol = firstForwardedValue(req.headers["x-forwarded-proto"]) ?? req.protocol;
  return `${protocol}://${host}`;
}

function getSafeReturnPath(value: string | undefined): string {
  return value?.startsWith("/verwaltung/") ? value : "/";
}

export function createOAuthLoginUrl(origin: string, returnPath: string): string {
  const redirectUri = `${origin}/api/oauth/callback?returnTo=${encodeURIComponent(returnPath)}`;
  const url = new URL("/app-auth", AUTH_PORTAL_ORIGIN);
  url.searchParams.set("appId", ENV.appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", Buffer.from(redirectUri).toString("base64"));
  url.searchParams.set("type", "signIn");
  return url.toString();
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/login", (req: Request, res: Response) => {
    const origin = getPublicRequestOrigin(req);
    if (!origin) {
      res.status(400).json({ error: "host is required" });
      return;
    }

    const returnPath = getSafeReturnPath(getQueryParam(req, "returnTo"));
    res.redirect(302, createOAuthLoginUrl(origin, returnPath));
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, getSafeReturnPath(getQueryParam(req, "returnTo")));
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
