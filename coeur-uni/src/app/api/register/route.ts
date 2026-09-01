import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      registrationNumber,
      registrationDate,
      nom,
      prenom,
      dateNaissance,
      lieuNaissance,
      paysResidence,
      ville,
      nationalite,
      profession,
      situationMatrimoniale,
      nombreEnfants,
      telephone,
      email,
      adresseResidence,
      sexeRecherche,
      trancheAge,
      paysRegionSouhaite,
      situationMatrimonialeSouhaitee,
      preferencesEnfants,
      professionSouhaitee,
      autresCriteres,
      projetSentimental,
      moyenPaiement,
      montantPaye,
      numeroPaiement,
      codePin,
    } = data;

    if (!nom || !prenom || !email || !telephone) {
      return NextResponse.json(
        { error: "Veuillez remplir au moins vos nom, prénom, e-mail et numéro de téléphone." },
        { status: 400 }
      );
    }

    const smtpUser = (process.env.SMTP_USER || "joinvesting.mail@gmail.com").trim();
    // Supprimer les espaces éventuels dans le mot de passe d'application Google (ex: "lrnr clxu soxx cpaq" -> "lrnrclxusoxxcpaq")
    const smtpPass = (process.env.SMTP_PASS || "lrnr clxu soxx cpaq").replace(/\s+/g, "");
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const isGmail = smtpHost.includes("gmail");

    // Configuration optimale du transporteur Nodemailer avec service Gmail ou host/port sécurisé
    const transporter = isGmail
      ? nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 15000,
          greetingTimeout: 15000,
          socketTimeout: 25000,
        })
      : nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || "587", 10),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 15000,
          greetingTimeout: 15000,
          socketTimeout: 25000,
        });

    // Chercher le logo pour l'attachement CID
    let logoPath = path.join(process.cwd(), "public", "logo.jpg");
    if (!fs.existsSync(logoPath)) {
      logoPath = path.join(process.cwd(), "src", "app", "media", "logo.jpeg");
    }

    const hasLogo = fs.existsSync(logoPath);
    const attachments = hasLogo
      ? [
          {
            filename: "logo.jpg",
            path: logoPath,
            cid: "logo@coeursunis",
          },
        ]
      : [];

    const emailHtml = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5e0d1; margin: 0; padding: 20px; color: #3f1f0f; }
        .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(139, 45, 39, 0.12); border: 1px solid #d8b095; }
        .header { background: radial-gradient(circle at top, #a92d27 0%, #781c17 100%); color: #ffffff; text-align: center; padding: 35px 20px; }
        .header h1 { margin: 10px 0 5px; font-size: 26px; letter-spacing: 1px; font-family: Georgia, serif; }
        .header p { margin: 0; font-size: 14px; opacity: 0.9; font-style: italic; }
        .badge { display: inline-block; background: #fff2e5; color: #a92d27; font-weight: bold; font-size: 12px; padding: 6px 16px; border-radius: 50px; margin-top: 15px; border: 1px solid #d8b095; }
        .content { padding: 30px; }
        .section-title { font-size: 16px; font-weight: bold; color: #a92d27; border-bottom: 2px solid #f0b69a; padding-bottom: 6px; margin: 25px 0 15px; text-transform: uppercase; letter-spacing: 0.5px; font-family: Georgia, serif; }
        .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .info-grid td { padding: 8px 12px; font-size: 13px; vertical-align: top; }
        .info-grid td.label { width: 40%; color: #6b4437; font-weight: bold; background: #fff8f2; border-radius: 6px 0 0 6px; }
        .info-grid td.value { width: 60%; color: #2a150a; background: #ffffff; font-weight: 500; }
        .payment-box { background: #fff4eb; border: 1.5px dashed #a92d27; border-radius: 12px; padding: 18px; margin-top: 15px; }
        .footer { background: #fff2e5; text-align: center; padding: 20px; font-size: 12px; color: #6b4437; border-top: 1px solid #d8b095; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${hasLogo ? `<img src="cid:logo@coeursunis" alt="Cœurs Unis" style="max-height: 80px; margin: 0 auto 10px; border-radius: 10px;" />` : ""}
          <h1>Agence Matrimoniale Cœurs Unis</h1>
          <p>« Parce que chaque cœur mérite de rencontrer son âme sœur »</p>
          <div class="badge">N° d'inscription : ${registrationNumber || "N/A"} • Date : ${registrationDate || new Date().toLocaleDateString("fr-FR")}</div>
        </div>

        <div class="content">
          <div class="section-title">1. Informations Personnelles</div>
          <table class="info-grid">
            <tr><td class="label">Nom & Prénom(s) :</td><td class="value">${nom || "-"} ${prenom || "-"}</td></tr>
            <tr><td class="label">Date de naissance :</td><td class="value">${dateNaissance || "-"}</td></tr>
            <tr><td class="label">Lieu de naissance :</td><td class="value">${lieuNaissance || "-"}</td></tr>
            <tr><td class="label">Pays & Ville de résidence :</td><td class="value">${paysResidence || "-"}, ${ville || "-"}</td></tr>
            <tr><td class="label">Nationalité :</td><td class="value">${nationalite || "-"}</td></tr>
            <tr><td class="label">Profession / Activité :</td><td class="value">${profession || "-"}</td></tr>
            <tr><td class="label">Situation matrimoniale :</td><td class="value">${situationMatrimoniale || "-"}</td></tr>
            <tr><td class="label">Nombre d'enfants :</td><td class="value">${nombreEnfants || "0"}</td></tr>
          </table>

          <div class="section-title">2. Coordonnées</div>
          <table class="info-grid">
            <tr><td class="label">Téléphone / WhatsApp :</td><td class="value">${telephone || "-"}</td></tr>
            <tr><td class="label">Adresse e-mail :</td><td class="value">${email || "-"}</td></tr>
            <tr><td class="label">Adresse de résidence :</td><td class="value">${adresseResidence || "-"}</td></tr>
          </table>

          <div class="section-title">3. Profil Recherché</div>
          <table class="info-grid">
            <tr><td class="label">Sexe recherché :</td><td class="value">${sexeRecherche || "-"}</td></tr>
            <tr><td class="label">Tranche d'âge souhaitée :</td><td class="value">${trancheAge || "-"}</td></tr>
            <tr><td class="label">Pays / Région souhaité(e) :</td><td class="value">${paysRegionSouhaite || "-"}</td></tr>
            <tr><td class="label">Situation matrimoniale souhaitée :</td><td class="value">${situationMatrimonialeSouhaitee || "-"}</td></tr>
            <tr><td class="label">Préférences pour les enfants :</td><td class="value">${preferencesEnfants || "-"}</td></tr>
            <tr><td class="label">Profession ou activité souhaitée :</td><td class="value">${professionSouhaitee || "-"}</td></tr>
            <tr><td class="label">Autres critères importants :</td><td class="value">${autresCriteres || "-"}</td></tr>
          </table>

          <div class="section-title">4. Projet Sentimental</div>
          <table class="info-grid">
            <tr><td class="label">Recherche principale :</td><td class="value">${projetSentimental || "-"}</td></tr>
          </table>

          <div class="section-title">5. Détails du Règlement d'Inscription</div>
          <div class="payment-box">
            <table class="info-grid" style="margin:0;">
              <tr><td class="label" style="background:transparent;">Moyen de paiement :</td><td class="value" style="background:transparent; font-weight: bold; color: #a92d27;">${moyenPaiement || "-"}</td></tr>
              <tr><td class="label" style="background:transparent;">Montant payé :</td><td class="value" style="background:transparent; font-weight: bold; color: #3f1f0f;">${montantPaye ? `${montantPaye}` : "-"}</td></tr>
              <tr><td class="label" style="background:transparent;">Numéro émetteur :</td><td class="value" style="background:transparent;">${numeroPaiement || "-"}</td></tr>
              <tr><td class="label" style="background:transparent;">Code PIN / Référence :</td><td class="value" style="background:transparent; font-family: monospace; font-size: 14px;">${codePin || "-"}</td></tr>
            </table>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px; font-weight: bold; color: #a92d27;">Cœurs Unis — Agence Matrimoniale d'Excellence</p>
          <p style="margin: 0;">Ce document constitue votre confirmation officielle d'inscription. Notre comité vous contactera sous 24h à 48h.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Liste des administrateurs destinataires (supporte plusieurs e-mails séparés par des virgules)
    const rawAdminEmails = process.env.ADMIN_EMAIL || "samyneil4@gmail.com, axeltafem650@gmail.com";
    const adminRecipients = rawAdminEmails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const fromAddress = process.env.SMTP_FROM || `Coeurs Unis <${smtpUser}>`;

    // 1. Envoyer la confirmation à l'utilisateur inscrit
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: `💕 Confirmation d'inscription - Fiche N° ${registrationNumber || "Cœurs Unis"}`,
      html: emailHtml,
      attachments,
    });

    // 2. Envoyer la fiche complète à tous les administrateurs configurés (ex: samyneil4@gmail.com, axeltafem650@gmail.com)
    await transporter.sendMail({
      from: fromAddress,
      to: adminRecipients,
      subject: `🔔 Nouvelle Inscription : ${nom} ${prenom} (${moyenPaiement || "Paiement"}) - N° ${registrationNumber}`,
      html: emailHtml,
      attachments,
    });

    return NextResponse.json({
      success: true,
      message: "Votre fiche d'inscription a été enregistrée et envoyée avec succès !",
      registrationNumber,
    });
  } catch (error: any) {
    console.error("API Register Error:", error);
    return NextResponse.json(
      {
        error: `Erreur d'envoi d'e-mail (${error?.message || "Délai d'attente dépassé"}). Veuillez vérifier la configuration SMTP ou réessayer.`,
      },
      { status: 500 }
    );
  }
}
