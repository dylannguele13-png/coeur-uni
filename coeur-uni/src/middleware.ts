import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminJwt, isAuthorizedAdminEmail } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // La page de connexion /admin/login reste toujours accessible sans authentification
  if (pathname === "/admin/login") {
    // Si l'administrateur a déjà une session valide, le rediriger vers le tableau de bord
    const token = req.cookies.get("bk_admin_session")?.value;
    if (token) {
      const session = await verifyAdminJwt(token);
      if (session && isAuthorizedAdminEmail(session.email)) {
        return NextResponse.redirect(new URL("/admin/dossiers", req.url));
      }
    }
    return NextResponse.next();
  }

  // Pour toutes les autres routes /admin (ex: /admin/dossiers, etc.)
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("bk_admin_session")?.value;

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = await verifyAdminJwt(token);

    if (!session || !isAuthorizedAdminEmail(session.email)) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("error", "unauthorized");
      const response = NextResponse.redirect(loginUrl);
      // Supprimer le cookie invalide
      response.cookies.delete("bk_admin_session");
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
