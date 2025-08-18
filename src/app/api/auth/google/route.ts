import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: "postmessage",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.json(
        { error: "Failed to exchange authorization code", details: tokenData },
        { status: 400 }
      );
    }

    if (!tokenData.id_token) {
      console.error("No ID token in response:", tokenData);
      return NextResponse.json(
        { error: "No ID token received from Google" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id_token: tokenData.id_token,
      access_token: tokenData.access_token,
    });
  } catch (error) {
    console.error("Error in Google auth API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
