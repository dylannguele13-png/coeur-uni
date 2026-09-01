import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      referenceDossier,
      dateSoumission,
      dejaEnContact,
      // Infos Correspondant
      correspondantNom,
      correspondantNationalite,
      correspondantProfession,
      correspondantAge,
      correspondantPaysOrigine,
      correspondantPaysResidence,
      // Infos Utilisateur
      nom,
      prenom,
      email,
      telephone,
      nationalite,
      profession,
      age,
      paysOrigine,
      paysResidence,
      // Évolution des échanges
      pointsCommuns,
      ceQuiMarque,
      niveauSatisfaction,
      satisfactionScore,
      // Projections d'avenir & Voyage
      projetAvenir,
      pretADeplacer,
      parleDuVoyage,
      commentairesVoyage,
      difficultesRencontrees,
      souhaitAccompagnement,
      remarquesAgence,
    } = data;

    // Validation minimale
    if (!nom || !email || !telephone) {
      return NextResponse.json(
        { error: "Veuillez renseigner au moins vos nom, e-mail et numéro de téléphone / WhatsApp." },
        { status: 400 }
      );
    }

    const smtpUser = (process.env.SMTP_USER || "samyneil4@gmail.com").trim();
    const smtpPass = (process.env.SMTP_PASS || "mjbd ulto pafl egry").replace(/\s+/g, "");
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const isGmail = smtpHost.includes("gmail");

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

    // Logo pour l'e-mail
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

    const isPositive =
      niveauSatisfaction === "très_satisfait" ||
      niveauSatisfaction === "satisfait" ||
      (typeof satisfactionScore === "number" && satisfactionScore >= 3);

    const emailHtmlAdmin = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5e0d1; margin: 0; padding: 20px; color: #3f1f0f; }
        .container { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(139, 45, 39, 0.12); border: 1px solid #d8b095; }
        .header { background: radial-gradient(circle at top, #a92d27 0%, #781c17 100%); color: #ffffff; text-align: center; padding: 35px 20px; }
        .header h1 { margin: 10px 0 5px; font-size: 24px; letter-spacing: 1px; font-family: Georgia, serif; }
        .header p { margin: 0; font-size: 13px; opacity: 0.95; font-style: italic; }
        .badge { display: inline-block; background: #fff2e5; color: #a92d27; font-weight: bold; font-size: 12px; padding: 6px 16px; border-radius: 50px; margin-top: 15px; border: 1px solid #d8b095; }
        .content { padding: 30px; }
        .section-title { font-size: 15px; font-weight: bold; color: #a92d27; border-bottom: 2px solid #f0b69a; padding-bottom: 6px; margin: 25px 0 15px; text-transform: uppercase; letter-spacing: 0.5px; font-family: Georgia, serif; }
        .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        .info-grid td { padding: 8px 12px; font-size: 13px; vertical-align: top; }
        .info-grid td.label { width: 38%; color: #6b4437; font-weight: bold; background: #fff8f2; border-radius: 6px 0 0 6px; }
        .info-grid td.value { width: 62%; color: #2a150a; background: #ffffff; font-weight: 500; }
        .highlight-box { background: #fff4eb; border: 1.5px solid #d8b095; border-radius: 12px; padding: 18px; margin-top: 15px; }
        .score-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; background: ${isPositive ? "#e8f5e9" : "#fff3e0"}; color: ${isPositive ? "#2e7d32" : "#e65100"}; }
        .footer { background: #fff2e5; text-align: center; padding: 20px; font-size: 12px; color: #6b4437; border-top: 1px solid #d8b095; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${hasLogo ? `<img src="cid:logo@coeursunis" alt="Cœurs Unis" style="max-height: 70px; margin: 0 auto 10px; border-radius: 10px;" />` : ""}
          <h1>Bilan de Mise en Relation</h1>
          <p>« Finalisation & Suivi des Correspondants Cœur Uni »</p>
          <div class="badge">Dossier N° : ${referenceDossier || "FC-" + Date.now().toString().slice(-6)} • Date : ${dateSoumission || new Date().toLocaleDateString("fr-FR")}</div>
        </div>

        <div class="content">
          <div class="section-title">1. Statut Actuel de la Mise en Contact</div>
          <table class="info-grid">
            <tr>
              <td class="label">Déjà en contact :</td>
              <td class="value"><strong>${dejaEnContact === "oui" ? "Oui, échanges en cours" : dejaEnContact === "en_attente" ? "En attente de démarrage" : "Non, pas encore"}</strong></td>
            </tr>
          </table>

          <div class="section-title">2. Informations sur le / la Correspondant(e)</div>
          <table class="info-grid">
            <tr><td class="label">Nom complet :</td><td class="value">${correspondantNom || "Non spécifié"}</td></tr>
            <tr><td class="label">Nationalité :</td><td class="value">${correspondantNationalite || "-"}</td></tr>
            <tr><td class="label">Profession :</td><td class="value">${correspondantProfession || "-"}</td></tr>
            <tr><td class="label">Âge :</td><td class="value">${correspondantAge ? `${correspondantAge} ans` : "-"}</td></tr>
            <tr><td class="label">Pays d'origine :</td><td class="value">${correspondantPaysOrigine || "-"}</td></tr>
            ${correspondantPaysResidence ? `<tr><td class="label">Pays de résidence :</td><td class="value">${correspondantPaysResidence}</td></tr>` : ""}
          </table>

          <div class="section-title">3. Informations sur l'Adhérent(e) (Formulaire)</div>
          <table class="info-grid">
            <tr><td class="label">Nom & Prénom(s) :</td><td class="value"><strong>${nom || "-"} ${prenom || ""}</strong></td></tr>
            <tr><td class="label">Téléphone / WhatsApp :</td><td class="value">${telephone || "-"}</td></tr>
            <tr><td class="label">Adresse e-mail :</td><td class="value">${email || "-"}</td></tr>
            <tr><td class="label">Nationalité :</td><td class="value">${nationalite || "-"}</td></tr>
            <tr><td class="label">Profession :</td><td class="value">${profession || "-"}</td></tr>
            <tr><td class="label">Âge :</td><td class="value">${age ? `${age} ans` : "-"}</td></tr>
            <tr><td class="label">Pays d'origine :</td><td class="value">${paysOrigine || "-"}</td></tr>
            ${paysResidence ? `<tr><td class="label">Pays de résidence :</td><td class="value">${paysResidence}</td></tr>` : ""}
          </table>

          <div class="section-title">4. Évolution & Qualité des Échanges</div>
          <table class="info-grid">
            <tr>
              <td class="label">Niveau de satisfaction :</td>
              <td class="value"><span class="score-pill">${niveauSatisfaction || "Satisfait"} (${satisfactionScore || 4}/5)</span></td>
            </tr>
            <tr>
              <td class="label">Points communs :</td>
              <td class="value">${pointsCommuns || "Non renseigné"}</td>
            </tr>
            <tr>
              <td class="label">Ce qui marque le plus :</td>
              <td class="value">${ceQuiMarque || "Non renseigné"}</td>
            </tr>
          </table>

          <div class="section-title">5. Projections d'Avenir & Projet de Voyage</div>
          <div class="highlight-box">
            <table class="info-grid" style="margin:0;">
              <tr>
                <td class="label" style="background:transparent;">Projet envisagé :</td>
                <td class="value" style="background:transparent; font-weight: bold; color: #a92d27;">${projetAvenir || "Approfondissement de la relation"}</td>
              </tr>
              <tr>
                <td class="label" style="background:transparent;">Prêt(e) à se déplacer :</td>
                <td class="value" style="background:transparent; font-weight: bold;">${pretADeplacer || "Non précisé"}</td>
              </tr>
              <tr>
                <td class="label" style="background:transparent;">Sujet du voyage abordé :</td>
                <td class="value" style="background:transparent;">${parleDuVoyage || "Non précisé"}</td>
              </tr>
              ${commentairesVoyage ? `<tr><td class="label" style="background:transparent;">Détails voyage/rencontre :</td><td class="value" style="background:transparent;">${commentairesVoyage}</td></tr>` : ""}
              ${difficultesRencontrees ? `<tr><td class="label" style="background:transparent; color:#c62828;">Points d'attention / freins :</td><td class="value" style="background:transparent; color:#c62828;">${difficultesRencontrees}</td></tr>` : ""}
              ${souhaitAccompagnement ? `<tr><td class="label" style="background:transparent;">Accompagnement souhaité :</td><td class="value" style="background:transparent;">${souhaitAccompagnement}</td></tr>` : ""}
            </table>
          </div>

          ${remarquesAgence ? `
          <div class="section-title">6. Remarques ou Suggestions pour l'Agence</div>
          <p style="background: #fff8f2; padding: 12px 16px; border-radius: 8px; font-size: 13px; font-style: italic; border-left: 3px solid #a92d27;">${remarquesAgence}</p>
          ` : ""}
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px; font-weight: bold; color: #a92d27;">Cœur Uni — Agence Matrimoniale de Prestige</p>
          <p style="margin: 0;">Ces informations confidentielles permettent d'optimiser l'accompagnement personnalisé de nos adhérents.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const emailHtmlUser = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5e0d1; margin: 0; padding: 20px; color: #3f1f0f; }
        .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(139, 45, 39, 0.12); border: 1px solid #d8b095; }
        .header { background: radial-gradient(circle at top, #a92d27 0%, #781c17 100%); color: #ffffff; text-align: center; padding: 35px 20px; }
        .header h1 { margin: 10px 0 5px; font-size: 24px; font-family: Georgia, serif; }
        .header p { margin: 0; font-size: 13px; opacity: 0.95; font-style: italic; }
        .content { padding: 30px; line-height: 1.6; }
        .message-box { background: #fff8f2; border: 1px solid #f0b69a; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .footer { background: #fff2e5; text-align: center; padding: 20px; font-size: 12px; color: #6b4437; border-top: 1px solid #d8b095; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          ${hasLogo ? `<img src="cid:logo@coeursunis" alt="Cœurs Unis" style="max-height: 70px; margin: 0 auto 10px; border-radius: 10px;" />` : ""}
          <h1>Confirmation de votre Bilan de Mise en Contact</h1>
          <p>« Merci de votre précieuse confiance »</p>
        </div>

        <div class="content">
          <p>Chère / Cher <strong>${prenom || nom}</strong>,</p>
          <p>Nous accusons bonne réception de votre bilan de mise en contact auprès de l'<strong>Agence Matrimoniale Cœur Uni</strong> (Dossier N° <strong>${referenceDossier || "FC-" + Date.now().toString().slice(-6)}</strong>).</p>

          <div class="message-box">
            <h3 style="margin-top: 0; color: #a92d27; font-family: Georgia, serif;">L'Amélioration Continue de Nos Services</h3>
            <p style="margin-bottom: 0; font-size: 14px;">
              Toutes les données et appréciations que vous venez de partager sont traitées dans la plus stricte confidentialité. Elles permettent à notre comité d'experts d'affiner l'accompagnement de votre couple, d'anticiper vos projets communs (rencontre, voyage, formalités) et d'élever sans cesse la qualité de nos prestations.
            </p>
          </div>

          <p>Notre équipe demeure à vos côtés à chaque étape de votre cheminement affectif pour que votre union s'épanouisse dans l'harmonie et la sérénité.</p>

          <p style="margin-top: 25px;">Avec nos sentiments dévoués,<br>
          <strong>La Direction de Cœur Uni</strong></p>
        </div>

        <div class="footer">
          <p style="margin: 0 0 6px; font-weight: bold; color: #a92d27;">Cœur Uni — Agence Matrimoniale de Prestige</p>
          <p style="margin: 0;">Service Accompagnement & Suivi Relationnel</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const rawAdminEmails = process.env.ADMIN_EMAIL || "samyneil4@gmail.com, axeltafem650@gmail.com";
    const adminRecipients = rawAdminEmails
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const fromAddress = process.env.SMTP_FROM || `Coeurs Unis <${smtpUser}>`;

    // 1. Envoyer le bilan aux administrateurs
    await transporter.sendMail({
      from: fromAddress,
      to: adminRecipients,
      subject: `💖 [Bilan Mise en Relation] ${nom} ${prenom || ""} & ${correspondantNom || "Correspondant(e)"} (${niveauSatisfaction || "Suivi"})`,
      html: emailHtmlAdmin,
      attachments,
    });

    // 2. Envoyer la confirmation à l'adhérent
    if (email) {
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: `✨ Cœur Uni — Confirmation de votre bilan de mise en relation (${referenceDossier || "Suivi relationnel"})`,
        html: emailHtmlUser,
        attachments,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Votre bilan de mise en contact a été transmis avec succès à l'agence !",
      referenceDossier,
    });
  } catch (error: any) {
    console.error("API Finalisation Error:", error);
    return NextResponse.json(
      {
        error: `Une erreur est survenue lors de l'enregistrement (${error?.message || "Erreur serveur"}). Veuillez vérifier votre connexion ou réessayer.`,
      },
      { status: 500 }
    );
  }
}
