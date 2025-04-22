"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Define the Session type for better typing and consistency
export type Session = {
  userId: number;
  username: string;
  expiresAt: Date;
};

type SessionPayload = {
  userId: number;
  username: string;
  expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    if (!session) {
      return null;
    }
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session", error);
    return null;
  }
}

export async function createSession(userId: number, username: string) {
  console.log(`Creating session for ${username} with ID ${userId}`);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, username, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

// Server-side version of getSession (for API routes and middleware)
export async function getSession(req: NextRequest): Promise<Session | null> {
  const sessionCookie = req.cookies.get("session"); // Get session cookie from the request
  const sessionValue = sessionCookie?.value; // Extract the value from the cookie

  const payload = await decrypt(sessionValue);

  if (!sessionValue || !payload) {
    return null;
  }

  // Assert that payload has the correct structure
  const sessionPayload = payload as SessionPayload;

  return {
    userId: sessionPayload.userId,
    username: sessionPayload.username,
    expiresAt: new Date(sessionPayload.expiresAt),
  };
}

export async function updateSession() {
  const sessionCookie = (await cookies()).get("session"); // Get session cookie
  const sessionValue = sessionCookie?.value; // Extract the value from the cookie
  const payload = await decrypt(sessionValue);

  if (!sessionValue || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", sessionValue, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export async function getSessionFromCookies(): Promise<Session | null> {
  const cookieStore = await cookies(); // Await is required
  const sessionCookie = cookieStore.get("session")?.value;
  const payload = await decrypt(sessionCookie);

  if (!sessionCookie || !payload) {
    return null;
  }

  const sessionPayload = payload as SessionPayload;

  return {
    userId: sessionPayload.userId,
    username: sessionPayload.username,
    expiresAt: new Date(sessionPayload.expiresAt),
  };
}
