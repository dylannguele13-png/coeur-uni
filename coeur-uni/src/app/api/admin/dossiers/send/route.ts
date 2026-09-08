import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { prisma } from "@/lib/prisma";
import { query } from "@/lib/db";
import { generateVisaEmailHtml } from "@/lib/emailTemplates/visaEmail";
import { generateVisaLetterText, VisaDossierData } from "@/lib/visaLetter";

export async function POST(req: Request) {
  try {
    const data: VisaDossierData = await req.json();

    const {
      nom,
      prenom,
      email,
      telephone,
      dossierReference,
      montantFrais,
      devise,
      lienPaiement,
    } = data;

    if (!nom || !prenom || !email) {
      return NextResponse.json(
        { error: "Les informations essentielles (Nom, Prénom, Email) sont requises pour l'envoi." },
        { status: 400 }
      );
    }

    // Identifiants SMTP du Cabinet BK (configurés dans .env ou fallback directs)
    const host = process.env.SMTP_CABINET_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_CABINET_PORT || "465", 10);
    const user = process.env.SMTP_CABINET_USER || "cabinetbk.immigration@gmail.com";
    const pass = process.env.SMTP_CABINET_PASS || "gtjc gjtn fzpj tjmr";
    const fromAddress =
      process.env.SMTP_CABINET_FROM || `Cabinet BK Immigration <${user}>`;

    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const ref = dossierReference || `BK-VISA-${Date.now().toString().slice(-6)}`;
    const fullData: VisaDossierData = {
      ...data,
      dossierReference: ref,
    };

    // Chercher le logo officiel du Cabinet BK pour l'attachement CID
    const logoBkPath = path.join(process.cwd(), "public", "logo-cabinet-bk-.png");
    const hasLogoBk = fs.existsSync(logoBkPath);
    const attachments = hasLogoBk
      ? [
          {
            filename: "logo-cabinet-bk.png",
            path: logoBkPath,
            cid: "logo@cabinetbk",
          },
        ]
      : [];

    // Génération du contenu HTML et texte
    const emailHtml = generateVisaEmailHtml(fullData, hasLogoBk);
    const emailText = generateVisaLetterText(fullData);

    const subject = `📁 Dossier Visa France - Formalités & Lettre Consulaire | ${prenom} ${nom} (${ref})`;

    // 1. Envoi au client
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      text: emailText,
      html: emailHtml,
      attachments,
    });

    // 2. Envoi d'une copie aux administrateurs (samyneil4@gmail.com, axeltafem650@gmail.com)
    const adminEmailsRaw =
      process.env.ADMIN_EMAILS || "samyneil4@gmail.com, axeltafem650@gmail.com";
    const adminRecipients = adminEmailsRaw
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (adminRecipients.length > 0) {
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: adminRecipients,
          subject: `🔔 [COPIE ADMIN] Envoi Dossier Visa à ${prenom} ${nom} (${email}) - ${ref}`,
          text: emailText,
          html: emailHtml,
        });
      } catch (adminErr) {
        console.warn("Notice: Erreur lors de l'envoi de la copie admin:", adminErr);
      }
    }

    // 3. Mettre à jour ou insérer le dossier dans PostgreSQL via Prisma
    try {
      await prisma.visaDossier.upsert({
        where: { dossierReference: ref },
        update: {
          statutEmail: "ENVOYE",
          emailEnvoyeA: email,
          dateEnvoi: new Date(),
          updatedAt: new Date(),
        },
        create: {
          dossierReference: ref,
          nom,
          prenom,
          dateNaissance: data.dateNaissance || "",
          lieuNaissance: data.lieuNaissance || "",
          paysResidence: data.paysResidence || "",
          villeResidence: data.villeResidence || "",
          nationalite: data.nationalite || "",
          profession: data.profession || "",
          situationMatrimoniale: data.situationMatrimoniale || "Célibataire",
          nombreEnfants: data.nombreEnfants || "0",
          telephone: telephone || "",
          email,
          adresseResidence: data.adresseResidence || "",
          consulatDestinataire:
            data.consulatDestinataire || "Consulat Général / Ambassade de France",
          consulatVille: data.consulatVille || "Yaoundé",
          objetDemande: data.objetDemande || "Demande de visa de court séjour",
          motifDemande:
            data.motifDemande || "Visite touristique et découverte culturelle",
          montantFrais: montantFrais ? parseFloat(String(montantFrais)) : 164000,
          devise: devise || "XAF",
          lienPaiement:
            lienPaiement ||
            "https://getpay-kappa.vercel.app/pay/frais-de-mise-a-disp-d2rhp",
          statutEmail: "ENVOYE",
          emailEnvoyeA: email,
          dateEnvoi: new Date(),
        },
      });
    } catch (dbErr) {
      console.warn("Notice: Prisma update notice on send:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `E-mail envoyé avec succès à ${email} depuis ${user} !`,
      dossierReference: ref,
      sentTo: email,
      notifiedAdmins: adminRecipients,
    });
  } catch (error: any) {
    console.error("POST /api/admin/dossiers/send error:", error);
    return NextResponse.json(
      {
        error: `Échec de l'envoi de l'e-mail : ${error?.message || "Erreur inconnue"}`,
      },
      { status: 500 }
    );
  }
}
