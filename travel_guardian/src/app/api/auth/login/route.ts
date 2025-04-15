import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { identifier, password } = body; // Using 'identifier' instead of 'username'
    const user = await loginUser(identifier, password);
    await createSession(user.id, user.username);
    return NextResponse.json({ message: "Login successful", user });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}