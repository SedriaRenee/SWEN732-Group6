import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
   

    const { email, username, password, firstName, lastName } = body;
    const user = await registerUser(email, username, password, firstName, lastName);

    
    return NextResponse.json({ message: "Signup successful", user }, { status: 201 });

  } catch (error: any) {
    
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
