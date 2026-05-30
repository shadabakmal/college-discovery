import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();

    // 1. Verify the token with Google's servers
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ message: "Invalid Google token" }, { status: 400 });
    }

    // 2. Check if the user already exists in your database
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    // 3. If they don't exist, create a new account for them
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || "Google User",
          // Notice we don't save a password here!
        },
      });
    }

    // 4. Return success
    return NextResponse.json(
      { message: "Google login successful", user: { name: user.name, email: user.email } },
      { status: 200 }
    );

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}