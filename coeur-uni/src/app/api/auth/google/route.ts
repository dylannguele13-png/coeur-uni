import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { isAuthorizedAdminEmail, signAdminJwt } from "@/lib/auth";

const client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "574016516249-be9dcljs5j3i17o3ffa8biqmqnhc2mn0.apps.googleusercontent.com"
);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        { error: "Jeton d'authentification Google manquant." },
        { status: 400 }
      );
    }

    let payload: any;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          "574016516249-be9dcljs5j3i17o3ffa8biqmqnhc2mn0.apps.googleusercontent.com",
      });
      payload = ticket.getPayload();
    } catch (verifyError: any) {
      console.error("Google ID Token verification failed:", verifyError);
      return NextResponse.json(
        { error: "Jeton Google invalide ou expiré." },
        { status: 401 }
      );
    }

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Impossible de récupérer l'adresse e-mail associée." },
        { status: 400 }
      );
    }

    const email = payload.email.toLowerCase();

    // Vérification stricte des autorisations administrateurs
    if (!isAuthorizedAdminEmail(email)) {
      return NextResponse.json(
        {
          error: `Accès non autorisé : L'adresse ${email} n'a pas les droits administrateur requis (réservé à samyneil4@gmail.com et axeltafem650@gmail.com).`,
        },
        { status: 403 }
      );
    }

    // Création du jeton de session JWT
    const token = await signAdminJwt({
      email,
      name: payload.name || payload.given_name || "Admin Cabinet BK",
      picture: payload.picture || "",
      role: "ADMIN",
    });

    const response = NextResponse.json({
      success: true,
      message: `Connexion réussie pour ${email}`,
      user: {
        email,
        name: payload.name || payload.given_name,
        picture: payload.picture,
      },
    });

    // Définition du cookie de session sécurisé
    response.cookies.set({
      name: "bk_admin_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("POST /api/auth/google error:", error);
    return NextResponse.json(
      { error: `Erreur interne d'authentification : ${error?.message}` },
      { status: 500 }
    );
  }
}
