import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.json({
    success: true,
    message: "Déconnexion réussie.",
  });

  response.cookies.set({
    name: "bk_admin_session",
    value: "",
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
