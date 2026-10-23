"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import jsPDF from "jspdf";
import { VisaDossierData } from "@/lib/visaLetter";
import { Download, FileText, Image as ImageIcon } from "lucide-react";

interface VisaLetterCanvasProps {
  data: VisaDossierData;
  onGenerated?: (dataUrl: string) => void;
  className?: string;
}

/**
 * Cache mémoire du logo du Cabinet BK pour un rendu ultra rapide et sans latence
 */
let cachedLogoImage: HTMLImageElement | null = null;
let logoLoadingPromise: Promise<HTMLImageElement | null> | null = null;

function loadLogoImage(): Promise<HTMLImageElement | null> {
  if (cachedLogoImage) {
    return Promise.resolve(cachedLogoImage);
  }
  if (logoLoadingPromise) {
    return logoLoadingPromise;
  }

  logoLoadingPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      cachedLogoImage = img;
      resolve(img);
    };
    img.onerror = () => {
      const fallback = new Image();
      fallback.crossOrigin = "anonymous";
      fallback.onload = () => {
        cachedLogoImage = fallback;
        resolve(fallback);
      };
      fallback.onerror = () => resolve(null);
      fallback.src = "/logo-cabinet-bk-.png";
    };
    img.src = "/logo-cabinet-bk.jpeg";
  });

  return logoLoadingPromise;
}

/**
 * Découpe et retourne les lignes sans dépasser maxWidth, gère les retours à la ligne \n
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  align: CanvasTextAlign = "left"
): number {
  if (!text) return startY;
  const originalAlign = ctx.textAlign;
  ctx.textAlign = align;

  let currentY = startY;
  const paragraphs = text.split("\n");

  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/);
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line ? `${line} ${words[n]}` : words[n];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) {
      ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    }
  }

  ctx.textAlign = originalAlign;
  return currentY;
}

/**
 * Formate une date ISO YYYY-MM-DD en date française littérale
 */
function formatBirthDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, y, m, d] = match;
    const months = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    const monthName = months[parseInt(m, 10) - 1] || m;
    return `${parseInt(d, 10)} ${monthName} ${y}`;
  }
  return dateStr;
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
  const prevDataUrlRef = useRef<string>("");
  const renderIdRef = useRef<number>(0);

  useEffect(() => {
    onGeneratedRef.current = onGenerated;
  }, [onGenerated]);

  // Valeurs nettoyées et dynamiques
  const prenom = (data.prenom || "").trim();
  const nom = (data.nom || "").trim();
  const fullName = `${prenom} ${nom}`.trim() || "Demandeur";
  const civilite = data.civilite || "Madame";
  const consulat = (data.consulatDestinataire || "").trim() || "Consulat Général / Ambassade de France";
  const consulatVille = (data.consulatVille || data.villeResidence || "").trim() || "Yaoundé";
  const ref = data.dossierReference || "BK-VISA-DEMANDE";

  const dateFormatted = useMemo(() => {
    return new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Token d'exécution pour annuler tout rendu concurrent précédent
    const currentRenderId = ++renderIdRef.current;

    setIsRendering(true);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Précharger le logo sans bloquer
    const logoImg = await loadLogoImage();

    // Si un rendu plus récent a déjà été initié entre-temps, on abandonne immédiatement ce rendu obsolète
    if (currentRenderId !== renderIdRef.current) {
      return;
    }

    // Dimensions standard A4 haute résolution (1240 x 1754 px)
    const W = 1240;
    const H = 1754;
    canvas.width = W;
    canvas.height = H;

    // 1. Réinitialisation complète du fond (blanc immaculé)
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    // Marges et largeur utile
    const marginX = 90;
    const contentWidth = W - marginX * 2;

    // 2. Liseré supérieur bleu marine Cabinet BK
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, 8);

    // 3. En-tête officiel Cabinet BK
    const headerY = 50;
    let textStartX = marginX;

    if (logoImg && logoImg.naturalWidth > 0) {
      ctx.drawImage(logoImg, marginX, headerY, 95, 95);
      textStartX = marginX + 115;
    }

    // Titre et mentions du Cabinet BK
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 22px Arial, Helvetica, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("CABINET BK À L'IMMIGRATION FRANÇAISE", textStartX, headerY + 28);

    ctx.fillStyle = "#475569";
    ctx.font = "italic 14px Arial, Helvetica, sans-serif";
    ctx.fillText("« Votre projet, notre accompagnement »", textStartX, headerY + 52);

    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 12px Arial, Helvetica, sans-serif";
    ctx.fillText(
      "Dossier de Mobilité Consulaire • Accompagnement Visa France",
      textStartX,
      headerY + 74
    );

    // Badge de référence du dossier à droite
    const badgeW = 280;
    const badgeH = 65;
    const badgeX = W - marginX - badgeW;
    const badgeY = headerY + 12;

    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
    } else {
      ctx.rect(badgeX, badgeY, badgeW, badgeH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 11px Arial, Helvetica, sans-serif";
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

    // 4. Coordonnées du demandeur (Colonne Gauche) et du Consulat (Colonne Droite)
    const infoY = headerY + 155;
    const colWidth = contentWidth * 0.48; // Largeur maximale stricte pour éviter tout chevauchement
    let leftY = infoY;

    // --- Colonne Gauche : Demandeur ---
    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 17px 'Times New Roman', Georgia, serif";
    ctx.fillText(`${civilite} ${fullName}`, marginX, leftY);
    leftY += 26;

    ctx.fillStyle = "#333333";
    ctx.font = "15px 'Times New Roman', Georgia, serif";

    if (data.adresseResidence && data.adresseResidence.trim()) {
      leftY = wrapText(ctx, data.adresseResidence.trim(), marginX, leftY, colWidth, 22, "left");
    }

    const villeEtPays = [data.villeResidence, data.paysResidence]
      .filter((s) => s && s.trim())
      .join(", ");
    if (villeEtPays) {
      ctx.fillText(villeEtPays, marginX, leftY);
      leftY += 22;
    }

    if (data.telephone && data.telephone.trim()) {
      ctx.fillText(`N° Téléphone : ${data.telephone.trim()}`, marginX, leftY);
      leftY += 22;
    }

    if (data.email && data.email.trim()) {
      ctx.fillText(`Email : ${data.email.trim()}`, marginX, leftY);
      leftY += 22;
    }

    // --- Colonne Droite : Consulat Destinataire ---
    const rightColX = W - marginX;
    let rightY = infoY;
    ctx.textAlign = "right";

    ctx.fillStyle = "#000000";
    ctx.font = "bold 17px 'Times New Roman', Georgia, serif";

    // Formuler le titre consulaire proprement sans doublon
    let consulatTitre = consulat;
    if (consulatVille && !consulat.toLowerCase().includes(consulatVille.toLowerCase())) {
      consulatTitre = `${consulat} à ${consulatVille}`;
    }
    ctx.fillText(consulatTitre, rightColX, rightY);
    rightY += 26;

    ctx.fillStyle = "#333333";
    ctx.font = "15px 'Times New Roman', Georgia, serif";
    ctx.fillText("Service des Visas & Formalités Consulaires", rightColX, rightY);
    rightY += 24;

    if (consulatVille) {
      ctx.fillText(consulatVille, rightColX, rightY);
      rightY += 24;
    }

    ctx.fillStyle = "#000000";
    ctx.font = "bold 15px 'Times New Roman', Georgia, serif";
    ctx.fillText(`Date : ${dateFormatted}`, rightColX, rightY + 12);
    rightY += 36;

    // 5. Objet du courrier (placé sous la colonne la plus longue pour éviter toute superposition)
    const objetY = Math.max(leftY, rightY) + 30;
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

    // 6. Corps de la lettre officielle conforme au modèle consulaire
    let bodyY = objetY + 50;
    const bodyLineHeight = 27;

    ctx.font = "bold 16px 'Times New Roman', Georgia, serif";
    ctx.fillText("Madame, Monsieur,", marginX, bodyY);
    bodyY += 36;

    ctx.font = "16px 'Times New Roman', Georgia, serif";

    // Paragraphe 1 : Identité & demande
    const nationalite = (data.nationalite || "").trim() || "Camerounaise";
    const dateNaiss = formatBirthDate(data.dateNaissance);
    const lieu = (data.lieuNaissance || "").trim();
    const lieuNaiss = lieu ? ` à ${lieu}` : "";
    const p1 = `Je, soussigné(e), ${fullName}, de nationalité ${nationalite}, né(e) le ${dateNaiss}${lieuNaiss}, souhaite obtenir un visa de court séjour afin de pouvoir me rendre en France.`;
    bodyY = wrapText(ctx, p1, marginX, bodyY, contentWidth, bodyLineHeight) + 14;

    // Paragraphe 2 : Motif
    const motif = (data.motifDemande || "").trim() || "Visite touristique, découverte culturelle et démarches de mobilité";
    const p2 = `Je sollicite un tel visa au motif que : ${motif}.`;
    bodyY = wrapText(ctx, p2, marginX, bodyY, contentWidth, bodyLineHeight) + 14;

    // Paragraphe 3 : Référence légale CERFA
    const p3 =
      "Conformément aux dispositions du Code de l'entrée et du séjour des étrangers et du droit d'asile, vous trouverez ci-joint les pièces justificatives requises dans une telle situation, notamment le formulaire CERFA n° 12160*01 dûment complété.";
    bodyY = wrapText(ctx, p3, marginX, bodyY, contentWidth, bodyLineHeight) + 14;

    // Paragraphe 4 : Disponibilité
    const p4 =
      "En espérant que vous donnerez une suite favorable à ma présente demande et restant à votre entière disposition pour vous fournir de plus amples renseignements ou justificatifs complémentaires lors de mon entretien,";
    bodyY = wrapText(ctx, p4, marginX, bodyY, contentWidth, bodyLineHeight) + 14;

    // Paragraphe 5 : Formule de politesse
    const p5 =
      "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.";
    bodyY = wrapText(ctx, p5, marginX, bodyY, contentWidth, bodyLineHeight) + 36;

    // 7. Bloc Signature
    const sigX = W - marginX - 40;
    ctx.textAlign = "right";
    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px 'Times New Roman', Georgia, serif";
    ctx.fillText("Signature :", sigX, bodyY);

    // Signature stylisée du demandeur
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "italic bold 32px 'Brush Script MT', 'Segoe Script', cursive, Georgia";
    ctx.fillText(fullName, sigX, bodyY + 44);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px Arial, Helvetica, sans-serif";
    ctx.fillText(fullName.toUpperCase(), sigX, bodyY + 68);

    // 8. Cachet officiel de vérification Cabinet BK (En bas à gauche)
    const stampX = marginX + 60;
    const stampY = bodyY + 25;
    ctx.save();
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(stampX - 50, stampY - 20, 210, 64, 6);
    } else {
      ctx.rect(stampX - 50, stampY - 20, 210, 64);
    }
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "bold 10px Arial, Helvetica, sans-serif";
    ctx.fillText("CABINET BK IMMIGRATION", stampX + 55, stampY);
    ctx.font = "bold 9px Arial, Helvetica, sans-serif";
    ctx.fillStyle = "#059669";
    ctx.fillText("✓ DOSSIER VÉRIFIÉ & CONFORME", stampX + 55, stampY + 16);
    ctx.font = "8px 'Courier New', monospace";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`DATE : ${dateFormatted}`, stampX + 55, stampY + 32);
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

    // Export en Data URL (seulement si le contenu a changé pour éviter les boucles infinies)
    const url = canvas.toDataURL("image/png", 0.98);
    if (url !== prevDataUrlRef.current) {
      prevDataUrlRef.current = url;
      setDataUrl(url);
      if (onGeneratedRef.current) {
        onGeneratedRef.current(url);
      }
    }

    setIsRendering(false);
  }, [
    data.nom,
    data.prenom,
    data.civilite,
    data.dateNaissance,
    data.lieuNaissance,
    data.paysResidence,
    data.villeResidence,
    data.nationalite,
    data.telephone,
    data.email,
    data.adresseResidence,
    data.consulatDestinataire,
    data.consulatVille,
    data.objetDemande,
    data.motifDemande,
    ref,
    dateFormatted,
    fullName,
    civilite,
    consulat,
    consulatVille,
  ]);

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
      {/* Barre d'outils de téléchargement */}
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

      {/* Conteneur de la lettre Canvas A4 */}
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
