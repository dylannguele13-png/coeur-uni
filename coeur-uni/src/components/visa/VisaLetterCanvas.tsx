"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import jsPDF from "jspdf";
import { VisaDossierData } from "@/lib/visaLetter";
import { Download, FileText, Image as ImageIcon, Check } from "lucide-react";

interface VisaLetterCanvasProps {
  data: VisaDossierData;
  onGenerated?: (dataUrl: string) => void;
  className?: string;
}

/**
 * Fonction utilitaire de retour à la ligne pour le texte Canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

export default function VisaLetterCanvas({
  data,
  onGenerated,
  className = "",
}: VisaLetterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [isRendering, setIsRendering] = useState<boolean>(true);
  const onGeneratedRef = useRef(onGenerated);

  useEffect(() => {
    onGeneratedRef.current = onGenerated;
  }, [onGenerated]);

  const fullName = `${data.prenom} ${data.nom}`.trim() || "Nom et prénom(s)";
  const civilite = data.civilite || "Madame";
  const consulat = data.consulatDestinataire || "Consulat/Ambassade de France";
  const consulatVille = data.consulatVille || data.villeResidence || "Yaoundé";
  const ref = data.dossierReference || `BK-VISA-${Date.now().toString().slice(-6)}`;
  const dateFormatted = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRendering(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions standard A4 haute résolution (1240 x 1754 px)
    const W = 1240;
    const H = 1754;
    canvas.width = W;
    canvas.height = H;

    // 1. Fond blanc pur
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Marge générale
    const marginX = 90;
    const contentWidth = W - marginX * 2;

    // 2. Bande supérieure d'élégance (Bleu marine Cabinet BK)
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, 8);

    // 3. Charger et dessiner le logo du Cabinet BK
    let logoLoaded = false;
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";

    await new Promise<void>((resolve) => {
      logoImg.onload = () => {
        logoLoaded = true;
        resolve();
      };
      logoImg.onerror = () => {
        const fallbackLogo = new Image();
        fallbackLogo.crossOrigin = "anonymous";
        fallbackLogo.onload = () => {
          logoImg.src = fallbackLogo.src;
          logoLoaded = true;
          resolve();
        };
        fallbackLogo.onerror = () => resolve();
        fallbackLogo.src = "/logo-cabinet-bk-.png";
      };
      logoImg.src = "/logo-cabinet-bk.jpeg";
    });

    const headerY = 50;
    if (logoLoaded && logoImg.width > 0) {
      ctx.drawImage(logoImg, marginX, headerY, 95, 95);
    }

    // Titre et coordonnées du cabinet dans l'en-tête
    const textStartX = logoLoaded ? marginX + 115 : marginX;
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 22px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("CABINET BK À L'IMMIGRATION FRANÇAISE", textStartX, headerY + 28);

    ctx.fillStyle = "#475569";
    ctx.font = "italic 14px Arial, sans-serif";
    ctx.fillText("« Votre projet, notre accompagnement »", textStartX, headerY + 52);

    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 12px Arial, sans-serif";
    ctx.fillText(
      "Dossier de Mobilité Consulaire • Accompagnement Visa France",
      textStartX,
      headerY + 74
    );

    // Badge de référence à droite
    const badgeW = 280;
    const badgeH = 65;
    const badgeX = W - marginX - badgeW;
    const badgeY = headerY + 12;

    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 11px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DOSSIER DE DEMANDE OFFICIELLE", badgeX + badgeW / 2, badgeY + 26);

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 13px 'Courier New', monospace";
    ctx.fillText(`RÉF : ${ref}`, badgeX + badgeW / 2, badgeY + 48);

    // Ligne de séparation sous l'en-tête
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marginX, headerY + 115);
    ctx.lineTo(W - marginX, headerY + 115);
    ctx.stroke();

    // 4. En-têtes du document (Demandeur à gauche / Consulat à droite)
    const infoY = headerY + 155;

    // Bloc demandeur (Gauche)
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 17px 'Times New Roman', Georgia, serif";
    ctx.fillText(`${civilite} ${fullName}`, marginX, infoY);

    ctx.fillStyle = "#333333";
    ctx.font = "15px 'Times New Roman', Georgia, serif";
    ctx.fillText(data.adresseResidence || "Adresse de résidence", marginX, infoY + 26);
    ctx.fillText(
      `${data.villeResidence || "Yaoundé"}, ${data.paysResidence || "Cameroun"}`,
      marginX,
      infoY + 50
    );
    ctx.fillText(`N° Téléphone : ${data.telephone || "N/A"}`, marginX, infoY + 74);
    ctx.fillText(`Email : ${data.email || "N/A"}`, marginX, infoY + 98);

    // Bloc Consulat (Droite)
    const rightColX = W - marginX;
    ctx.textAlign = "right";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 17px 'Times New Roman', Georgia, serif";
    ctx.fillText(`${consulat} de ${consulatVille}`, rightColX, infoY);

    ctx.fillStyle = "#555555";
    ctx.font = "italic 13px 'Times New Roman', Georgia, serif";
    ctx.fillText(`(Lieu de résidence : ${consulatVille})`, rightColX, infoY + 24);

    ctx.fillStyle = "#333333";
    ctx.font = "15px 'Times New Roman', Georgia, serif";
    ctx.fillText("Service des Visas & Formalités Consulaires", rightColX, infoY + 48);
    ctx.fillText(consulatVille, rightColX, infoY + 72);

    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px 'Times New Roman', Georgia, serif";
    ctx.fillText(`Date : ${dateFormatted}`, rightColX, infoY + 115);

    // 5. Objet de la demande
    const objetY = infoY + 165;
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 18px 'Times New Roman', Georgia, serif";
    const objetText = `Objet : ${data.objetDemande || "Demande de visa de court séjour"}`;
    ctx.fillText(objetText, marginX, objetY);

    // Soulignement de l'objet
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginX, objetY + 6);
    ctx.lineTo(marginX + ctx.measureText(objetText).width, objetY + 6);
    ctx.stroke();

    // 6. Corps de la lettre (Conforme à l'Image 2 et au CERFA)
    let bodyY = objetY + 55;
    const bodyLineHeight = 28;

    ctx.font = "bold 16px 'Times New Roman', Georgia, serif";
    ctx.fillText("Madame, Monsieur,", marginX, bodyY);
    bodyY += 40;

    ctx.font = "16px 'Times New Roman', Georgia, serif";

    // Paragraphe 1 : Identité & demande
    const p1 = `Je, soussigné(e), ${fullName}, de nationalité ${
      data.nationalite || "Camerounaise"
    }, né(e) le ${data.dateNaissance || "N/A"} à ${
      data.lieuNaissance || "N/A"
    }, souhaite obtenir un visa de court séjour afin de pouvoir me rendre en France.`;
    bodyY = wrapText(ctx, p1, marginX, bodyY, contentWidth, bodyLineHeight) + 16;

    // Paragraphe 2 : Motif
    const p2 = `Je sollicite un tel visa au motif que : ${
      data.motifDemande ||
      "Visite touristique, découverte culturelle et démarches de mobilité"
    }.`;
    bodyY = wrapText(ctx, p2, marginX, bodyY, contentWidth, bodyLineHeight) + 16;

    // Paragraphe 3 : Référence légale CERFA
    const p3 =
      "Conformément aux dispositions du Code de l'entrée et du séjour des étrangers et du droit d'asile, vous trouverez ci-joint les pièces justificatives requises dans une telle situation, notamment le formulaire CERFA n° 12160*01 dûment complété.";
    bodyY = wrapText(ctx, p3, marginX, bodyY, contentWidth, bodyLineHeight) + 16;

    // Paragraphe 4 : Disponibilité
    const p4 =
      "En espérant que vous donnerez une suite favorable à ma présente demande et restant à votre entière disposition pour vous fournir de plus amples renseignements ou justificatifs complémentaires lors de mon entretien,";
    bodyY = wrapText(ctx, p4, marginX, bodyY, contentWidth, bodyLineHeight) + 16;

    // Paragraphe 5 : Formule de politesse
    const p5 =
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.";
    bodyY = wrapText(ctx, p5, marginX, bodyY, contentWidth, bodyLineHeight) + 40;

    // 7. Bloc Signature
    const sigX = W - marginX - 40;
    ctx.textAlign = "right";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px 'Times New Roman', Georgia, serif";
    ctx.fillText("Signature :", sigX, bodyY);

    // Signature stylisée
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "italic bold 32px 'Brush Script MT', 'Segoe Script', cursive, Georgia";
    ctx.fillText(fullName, sigX, bodyY + 46);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText(fullName.toUpperCase(), sigX, bodyY + 72);

    // 8. Cachet officiel de vérification Cabinet BK (En bas à gauche)
    const stampX = marginX + 70;
    const stampY = bodyY + 30;
    ctx.save();
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(stampX - 60, stampY - 20, 200, 60, 6);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 10px Arial, sans-serif";
    ctx.fillText("CABINET BK IMMIGRATION", stampX + 40, stampY);
    ctx.font = "bold 9px Arial, sans-serif";
    ctx.fillStyle = "#059669";
    ctx.fillText("✓ DOSSIER VÉRIFIÉ & CONFORME", stampX + 40, stampY + 16);
    ctx.font = "8px 'Courier New', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`DATE : ${dateFormatted}`, stampX + 40, stampY + 30);
    ctx.restore();

    // 9. Pièces Jointes en bas de page
    const footerY = H - 110;
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marginX, footerY);
    ctx.lineTo(W - marginX, footerY);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 13px 'Times New Roman', Georgia, serif";
    ctx.fillText("Pièces jointes :", marginX, footerY + 26);

    ctx.fillStyle = "#475569";
    ctx.font = "italic 13px 'Times New Roman', Georgia, serif";
    const pjText =
      "Formulaire CERFA n° 12160*01, justificatifs d'identité et de nationalité (passeport), réservation d'hébergement, attestation d'assurance voyage, justificatifs de ressources, tout autre document requis.";
    wrapText(ctx, pjText, marginX + 105, footerY + 26, contentWidth - 105, 20);

    // Export en Data URL
    const url = canvas.toDataURL("image/png", 0.98);
    setDataUrl(url);
    if (onGeneratedRef.current) {
      onGeneratedRef.current(url);
    }
    setIsRendering(false);
  }, [data, fullName, civilite, consulat, consulatVille, ref, dateFormatted]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Télécharger l'image PNG haute définition
  const downloadPNG = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `lettre-demande-visa-${ref}-${fullName.replace(/\s+/g, "_")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Télécharger au format PDF A4 professionnel
  const downloadPDF = () => {
    if (!dataUrl) return;
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 210 x 297 mm
    pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
    pdf.save(`lettre-demande-visa-${ref}-${fullName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Barre d'outils de téléchargement en tête */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-400" />
          <span className="text-xs sm:text-sm font-bold text-white">
            Export officiel de la Lettre Consulaire
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={downloadPDF}
            disabled={isRendering || !dataUrl}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md transition hover:scale-105 cursor-pointer disabled:opacity-50"
            title="Télécharger la lettre au format PDF A4"
          >
            <Download size={14} />
            <span>Télécharger PDF (A4)</span>
          </button>

          <button
            type="button"
            onClick={downloadPNG}
            disabled={isRendering || !dataUrl}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition hover:scale-105 cursor-pointer disabled:opacity-50"
            title="Télécharger l'image PNG haute résolution"
          >
            <ImageIcon size={14} />
            <span>Télécharger Image (PNG)</span>
          </button>
        </div>
      </div>

      {/* Conteneur d'affichage de la lettre générée sur Canvas */}
      <div className="relative w-full max-w-[760px] overflow-hidden rounded-xl border border-stone-300 shadow-2xl bg-white select-none">
        {isRendering && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <span className="text-xs font-semibold text-slate-800">
                Génération de la lettre officielle haute définition...
              </span>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-auto block select-none"
          style={{ aspectRatio: "1240 / 1754" }}
        />
      </div>
    </div>
  );
}
