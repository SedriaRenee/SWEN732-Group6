import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    // loginUser handles authentication + session creation
    const res = await loginUser(identifier, password);
    if ("error" in res) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }
    return NextResponse.json({ message: "Login successful", user: res });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
