import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    // loginUser handles authentication + session creation
    const { user, token } = await loginUser(identifier, password);

    return NextResponse.json({ message: "Login successful", user, token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}