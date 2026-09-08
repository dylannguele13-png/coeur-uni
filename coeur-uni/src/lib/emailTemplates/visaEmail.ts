import { VisaDossierData } from "../visaLetter";

export function generateVisaEmailHtml(data: VisaDossierData, hasCidLogo: boolean = true): string {
  const fullName = `${data.prenom} ${data.nom}`.trim();
  const civilite = data.civilite || "Madame / Monsieur";
  const dateFormatted = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const consulat = data.consulatDestinataire || "Consulat / Ambassade de France";
  const consulatVille = data.consulatVille || data.villeResidence || "Yaoundé";
  const montantDisplay = Number(data.montantFrais || 164000).toLocaleString("fr-FR");
  const devise = data.devise || "XAF";
  const paymentUrl =
    data.lienPaiement ||
    "https://getpay-kappa.vercel.app/pay/frais-de-mise-a-disp-d2rhp";

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dossier de Visa - Cabinet BK Immigration</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 30px 10px;
    }
    .container {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
      color: #ffffff;
      padding: 36px 24px;
      text-align: center;
    }
    .logo-container {
      margin-bottom: 14px;
      display: inline-block;
      background: #ffffff;
      padding: 8px 16px;
      border-radius: 16px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    .header h1 {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 0;
      font-size: 13px;
      color: #93c5fd;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .badge-ref {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      color: #ffffff;
      margin-top: 14px;
      font-family: monospace;
    }
    .content {
      padding: 32px 26px;
    }
    .intro {
      font-size: 15px;
      line-height: 1.6;
      color: #334155;
      margin-bottom: 25px;
    }
    /* Style fidèle à la lettre administrative (Image 2) */
    .letter-paper {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-left: 4px solid #1e3a8a;
      border-radius: 8px;
      padding: 24px;
      margin: 25px 0;
      font-family: 'Times New Roman', Times, serif;
      color: #1c1917;
      font-size: 14px;
      line-height: 1.6;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .letter-header-grid {
      width: 100%;
      margin-bottom: 20px;
      border-collapse: collapse;
    }
    .letter-header-left {
      width: 50%;
      vertical-align: top;
      font-size: 13px;
      line-height: 1.5;
    }
    .letter-header-right {
      width: 50%;
      vertical-align: top;
      text-align: right;
      font-size: 13px;
      line-height: 1.5;
    }
    .letter-object {
      font-weight: bold;
      margin: 18px 0 14px;
      font-size: 14px;
    }
    .letter-body p {
      margin: 0 0 14px;
      text-align: justify;
    }
    .letter-signature {
      text-align: right;
      margin-top: 25px;
      font-weight: bold;
    }
    .letter-attachments {
      margin-top: 25px;
      font-size: 12px;
      color: #57534e;
      border-top: 1px dashed #d6d3d1;
      padding-top: 10px;
      font-style: italic;
    }
    /* Section de paiement & Action Call-to-action */
    .action-box {
      background: #eff6ff;
      border: 2px solid #bfdbfe;
      border-radius: 14px;
      padding: 26px;
      text-align: center;
      margin: 30px 0;
    }
    .action-box h3 {
      margin: 0 0 8px;
      color: #1e3a8a;
      font-size: 18px;
      font-weight: 800;
    }
    .action-box p {
      margin: 0 0 16px;
      font-size: 14px;
      color: #475569;
    }
    .price-tag {
      font-size: 30px;
      font-weight: 800;
      color: #1e3a8a;
      margin-bottom: 18px;
    }
    .btn-payment {
      display: inline-block;
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      color: #ffffff !important;
      font-size: 16px;
      font-weight: 700;
      text-decoration: none;
      padding: 16px 34px;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(29, 78, 216, 0.4);
      letter-spacing: 0.3px;
    }
    .payment-notice {
      margin-top: 14px;
      font-size: 12px;
      color: #64748b;
    }
    .steps-list {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 25px 0;
    }
    .steps-list h4 {
      margin: 0 0 10px;
      color: #0f172a;
      font-size: 15px;
    }
    .steps-list ol {
      margin: 0;
      padding-left: 20px;
      color: #334155;
      font-size: 13px;
      line-height: 1.6;
    }
    .footer {
      background: #0f172a;
      color: #94a3b8;
      padding: 26px;
      text-align: center;
      font-size: 12px;
      border-top: 1px solid #1e293b;
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- En-tête avec Logo Officiel du Cabinet BK -->
      <div class="header">
        <div class="logo-container">
          ${
            hasCidLogo
              ? `<img src="cid:logo@cabinetbk" alt="Cabinet BK à l'Immigration Française" style="max-height: 95px; width: auto; display: block; margin: 0 auto;" />`
              : `<div style="font-weight: bold; color: #1e3a8a; font-size: 16px;">CABINET BK IMMIGRATION</div>`
          }
        </div>
        <h1>CABINET BK À L'IMMIGRATION FRANÇAISE</h1>
        <p>« Votre projet, notre accompagnement »</p>
        <div class="badge-ref">RÉFÉRENCE DOSSIER : ${data.dossierReference || "BK-VISA-" + Date.now().toString().slice(-6)}</div>
      </div>

      <!-- Corps principal -->
      <div class="content">
        <div class="intro">
          <strong>${civilite} ${fullName}</strong>,<br><br>
          Nous avons le plaisir de vous transmettre le projet officiel de votre demande de visa de court séjour pour la France, finalisé et mis en conformité par nos juristes et consultants en mobilité internationale.
        </div>

        <!-- Lettre officielle générée selon Image 2 -->
        <div class="letter-paper">
          <table class="letter-header-grid">
            <tr>
              <td class="letter-header-left">
                <strong>${civilite} ${fullName}</strong><br>
                ${data.adresseResidence || "Quartier de résidence"}<br>
                ${data.villeResidence || "Yaoundé"} (${data.paysResidence || "Cameroun"})<br>
                N° Tél : ${data.telephone}<br>
                Email : ${data.email}
              </td>
              <td class="letter-header-right">
                <strong>${consulat}</strong><br>
                (Lieu de résidence : ${consulatVille})<br>
                Service des Visas & Formalités Consulaires<br>
                ${consulatVille}<br><br>
                <em>Date : ${dateFormatted}</em>
              </td>
            </tr>
          </table>

          <div class="letter-object">
            Objet : ${data.objetDemande || "Demande de visa de court séjour"}
          </div>

          <div class="letter-body">
            <p><strong>Madame, Monsieur,</strong></p>
            <p>
              Je, soussigné(e), <strong>${fullName}</strong>, de nationalité <strong>${data.nationalite || "Camerounaise"}</strong>, né(e) le <strong>${data.dateNaissance || "N/A"}</strong> à <strong>${data.lieuNaissance || "N/A"}</strong>, souhaite obtenir un visa de court séjour afin de pouvoir me rendre en France.
            </p>
            <p>
              Je sollicite un tel visa au motif que : <em>${data.motifDemande || "Séjour touristique et découverte culturelle"}</em>.
            </p>
            <p>
              Conformément aux dispositions du Code de l'entrée et du séjour des étrangers et du droit d'asile, vous trouverez ci-joint les pièces justificatives requises dans une telle situation, notamment le formulaire CERFA n° 12160*01.
            </p>
            <p>
              En espérant que vous donnerez une suite favorable à ma présente demande et restant à votre disposition pour vous fournir de plus amples renseignements,
            </p>
            <p>
              Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
            </p>
          </div>

          <div class="letter-signature">
            Signature :<br>
            <span style="font-size: 18px; font-family: cursive; color: #1e3a8a;">${fullName}</span>
          </div>

          <div class="letter-attachments">
            <strong>Pièces jointes :</strong> Formulaire CERFA n° 12160*01, justificatifs d'identité et de nationalité, tout autre document lié à votre demande de visa.
          </div>
        </div>

        <!-- Prochaines étapes -->
        <div class="steps-list">
          <h4>📌 Prochaines étapes de votre accompagnement :</h4>
          <ol>
            <li>Règlement des frais de constitution et formalités du dossier d'autorisation.</li>
            <li>Prise de rendez-vous prioritaire et vérification intégrale des pièces justificatives.</li>
            <li>Dépôt physique et suivi personnalisé jusqu'à délivrance de votre visa.</li>
          </ol>
        </div>

        <!-- Bloc d'action / Paiement GetPay -->
        <div class="action-box">
          <h3>Frais d'accompagnement & autorisation de dossier</h3>
          <p>Pour déclencher le traitement prioritaire et la finalisation de votre dossier, veuillez procéder au règlement des frais ci-dessous :</p>
          <div class="price-tag">${montantDisplay} ${devise}</div>
          <div>
            <a href="${paymentUrl}" target="_blank" class="btn-payment">
              Payer mes frais de dossier en ligne →
            </a>
          </div>
          <div class="payment-notice">
            🔒 Règlement 100% sécurisé via GetPay (Orange Money, MTN MoMo, Wave, Carte bancaire).
          </div>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
          Pour toute question relative à votre dossier, vous pouvez répondre directement à cet e-mail ou contacter votre conseiller dédié du Cabinet BK.
        </p>
      </div>

      <!-- Pied de page -->
      <div class="footer">
        <p style="margin: 0 0 6px; font-weight: 700; color: #f8fafc; font-size: 13px;">CABINET BK À L'IMMIGRATION FRANÇAISE</p>
        <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8;">Conseil personnalisé • Constitution de dossier • Suivi de votre demande • Assistance au voyage</p>
        <p style="margin: 0 0 10px;">Contact officiel : <a href="mailto:cabinetbk.immigration@gmail.com">cabinetbk.immigration@gmail.com</a></p>
        <p style="margin: 0; font-size: 11px; opacity: 0.7;">Ce courriel électronique est confidentiel et s'adresse exclusivement à son destinataire légitime.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
