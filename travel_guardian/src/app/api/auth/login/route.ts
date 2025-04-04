import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    

    const { identifier, password } = body; // Using 'identifier' instead of 'username'
    const user = await loginUser(identifier, password);

    return NextResponse.json({ message: "Login successful", user });
  } catch (error: any) {
    
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}