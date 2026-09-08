import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET || "coeur_uni_admin_super_secret_jwt_2026";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface AdminSessionPayload {
  email: string;
  name?: string;
  picture?: string;
  role: "ADMIN";
}

export const AUTHORIZED_ADMIN_EMAILS = [
  "samyneil4@gmail.com",
  "axeltafem650@gmail.com",
];

export function isAuthorizedAdminEmail(email: string): boolean {
  if (!email) return false;
  return AUTHORIZED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/**
 * Signe un JWT sécurisé pour la session administrateur
 */
export async function signAdminJwt(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Vérifie le JWT de session administrateur
 */
export async function verifyAdminJwt(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (!payload.email || typeof payload.email !== "string") return null;

    return {
      email: payload.email,
      name: payload.name as string | undefined,
      picture: payload.picture as string | undefined,
      role: "ADMIN",
    };
  } catch (err) {
    return null;
  }
}
