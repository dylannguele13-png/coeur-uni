"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import jsPDF from "jspdf";

export interface MemberCardData {
  nom: string;
  prenom?: string;
  dateNaissance: string;
  pays: string;
  profession: string;
  matricule: string;
  photoUrl?: string; // Photo de profil téléversée
  validite?: string;
}

interface MemberCardProps {
  data: MemberCardData;
  onGenerated?: (dataUrl: string) => void;
  className?: string;
}

// Drapeaux officiels dessinés en pur canvas vectoriel pour une netteté absolue
function drawCountryFlag(
  ctx: CanvasRenderingContext2D,
  countryName: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const norm = (countryName || "").toLowerCase().trim();
  ctx.save();

  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 3;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  const r = 3;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.clip();

  if (norm.includes("gabon")) {
    const stripeH = h / 3;
    ctx.fillStyle = "#009e60";
    ctx.fillRect(x, y, w, stripeH);
    ctx.fillStyle = "#fcd116";
    ctx.fillRect(x, y + stripeH, w, stripeH);
    ctx.fillStyle = "#3a75c4";
    ctx.fillRect(x, y + stripeH * 2, w, stripeH);
  } else if (norm.includes("cameroun") || norm.includes("cameroon")) {
    const stripeW = w / 3;
    ctx.fillStyle = "#007a5e";
    ctx.fillRect(x, y, stripeW, h);
    ctx.fillStyle = "#ce1126";
    ctx.fillRect(x + stripeW, y, stripeW, h);
    ctx.fillStyle = "#fcd116";
    ctx.fillRect(x + stripeW * 2, y, stripeW, h);
    drawStar(ctx, x + stripeW + stripeW / 2, y + h / 2, 5, stripeW * 0.28, stripeW * 0.12, "#fcd116");
  } else if (norm.includes("ivoire") || norm.includes("ivory")) {
    const stripeW = w / 3;
    ctx.fillStyle = "#f77f00";
    ctx.fillRect(x, y, stripeW, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + stripeW, y, stripeW, h);
    ctx.fillStyle = "#009e60";
    ctx.fillRect(x + stripeW * 2, y, stripeW, h);
  } else if (norm.includes("senegal")) {
    const stripeW = w / 3;
    ctx.fillStyle = "#00853f";
    ctx.fillRect(x, y, stripeW, h);
    ctx.fillStyle = "#fdef42";
    ctx.fillRect(x + stripeW, y, stripeW, h);
    ctx.fillStyle = "#e31b23";
    ctx.fillRect(x + stripeW * 2, y, stripeW, h);
    drawStar(ctx, x + stripeW + stripeW / 2, y + h / 2, 5, stripeW * 0.28, stripeW * 0.12, "#00853f");
  } else if (norm.includes("france")) {
    const stripeW = w / 3;
    ctx.fillStyle = "#0055a5";
    ctx.fillRect(x, y, stripeW, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + stripeW, y, stripeW, h);
    ctx.fillStyle = "#ef4135";
    ctx.fillRect(x + stripeW * 2, y, stripeW, h);
  } else if (norm.includes("belgique") || norm.includes("belgium")) {
    const stripeW = w / 3;
    ctx.fillStyle = "#2d2926";
    ctx.fillRect(x, y, stripeW, h);
    ctx.fillStyle = "#fdd116";
    ctx.fillRect(x + stripeW, y, stripeW, h);
    ctx.fillStyle = "#ed2939";
    ctx.fillRect(x + stripeW * 2, y, stripeW, h);
  } else if (norm.includes("congo")) {
    ctx.fillStyle = "#007fff";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#ce1021";
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h * 0.25);
    ctx.lineTo(x + w * 0.25, y + h);
    ctx.closePath();
    ctx.fill();
    drawStar(ctx, x + w * 0.2, y + h * 0.3, 5, h * 0.22, h * 0.1, "#fcd116");
  } else {
    const stripeH = h / 3;
    ctx.fillStyle = "#009e60";
    ctx.fillRect(x, y, w, stripeH);
    ctx.fillStyle = "#fcd116";
    ctx.fillRect(x, y + stripeH, w, stripeH);
    ctx.fillStyle = "#3a75c4";
    ctx.fillRect(x, y + stripeH * 2, w, stripeH);
  }

  ctx.restore();
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.stroke();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  color: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// Dessiner le ruban swallowtail de prestige aux couleurs Cœur Uni
function drawPrestigeRibbon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string
) {
  ctx.save();
  const notch = 22;

  // Dégradé royal bordeaux / carmin
  const grad = ctx.createLinearGradient(x, y, x + w, y);
  grad.addColorStop(0, "#7a1713");
  grad.addColorStop(0.5, "#9e251f");
  grad.addColorStop(1, "#7a1713");

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - notch, y + h / 2);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + notch, y + h / 2);
  ctx.closePath();
  ctx.fill();

  // Liseré doré supérieur et inférieur
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(x + notch, y + 2);
  ctx.lineTo(x + w - notch, y + 2);
  ctx.moveTo(x + notch, y + h - 2);
  ctx.lineTo(x + w - notch, y + h - 2);
  ctx.stroke();

  // Texte au centre
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px 'Georgia', 'Playfair Display', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "3px";
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);

  ctx.restore();
}

// Sceau doré d'excellence Cœur Uni
function drawGoldSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  const numPoints = 28;
  const outerR = r;
  const innerR = r - 5;

  ctx.beginPath();
  for (let i = 0; i < numPoints * 2; i++) {
    const radius = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / numPoints;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Dégradé or noble
  const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, r);
  grad.addColorStop(0, "#fff2b2");
  grad.addColorStop(0.3, "#e6bc42");
  grad.addColorStop(0.8, "#c99738");
  grad.addColorStop(1, "#946b19");
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = "#7a5410";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Cercles internes dorés
  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.strokeStyle = "#5a3a0a";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Étoiles dorées
  drawStar(ctx, cx - 14, cy - 18, 5, 4, 1.8, "#2e1808");
  drawStar(ctx, cx, cy - 20, 5, 5, 2.2, "#2e1808");
  drawStar(ctx, cx + 14, cy - 18, 5, 4, 1.8, "#2e1808");

  // Texte
  ctx.fillStyle = "#261205";
  ctx.font = "bold 11px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MEMBRE", cx, cy - 2);
  ctx.fillText("OFFICIEL", cx, cy + 12);

  ctx.restore();
}

// Tampon circulaire officiel Cœur Uni avec miniature du logo
function drawOfficialStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  logoImg?: HTMLImageElement
) {
  ctx.save();
  ctx.strokeStyle = "#8b1e19";
  ctx.fillStyle = "#8b1e19";
  ctx.lineWidth = 2.5;

  // Double cercle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Texte circulaire en arc
  const textTop = "AGENCE MATRIMONIALE";
  const textBottom = "CŒUR UNI";

  ctx.font = "bold 9px 'Montserrat', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Texte haut
  ctx.save();
  ctx.translate(cx, cy);
  const angleStep = Math.PI / (textTop.length + 3);
  const startAngle = -Math.PI / 2 - (angleStep * (textTop.length - 1)) / 2;
  for (let i = 0; i < textTop.length; i++) {
    const a = startAngle + i * angleStep;
    ctx.save();
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(textTop[i], 0, -(r - 11));
    ctx.restore();
  }
  ctx.restore();

  // Texte bas
  ctx.save();
  ctx.translate(cx, cy);
  const angleStepB = Math.PI / (textBottom.length + 5);
  const startAngleB = Math.PI / 2 - (angleStepB * (textBottom.length - 1)) / 2;
  for (let i = 0; i < textBottom.length; i++) {
    const a = startAngleB + i * angleStepB;
    ctx.save();
    ctx.rotate(a - Math.PI / 2);
    ctx.fillText(textBottom[i], 0, r - 11);
    ctx.restore();
  }
  ctx.restore();

  // Étoiles de séparation
  ctx.fillText("★", cx - r + 9, cy);
  ctx.fillText("★", cx + r - 9, cy);

  // Logo au centre du tampon
  if (logoImg && logoImg.width > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 20, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logoImg, cx - (r - 20), cy - (r - 20), (r - 20) * 2, (r - 20) * 2);
    ctx.restore();
  } else {
    // Coeur élégant bordeaux
    ctx.fillStyle = "#8b1e19";
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Signature manuscrite authentique
function drawSignature(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = "#1a0f0a";
  ctx.lineWidth = 1.9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(x, y + 15);
  ctx.bezierCurveTo(x + 5, y - 10, x + 25, y - 15, x + 35, y + 10);
  ctx.bezierCurveTo(x + 40, y + 22, x + 15, y + 25, x + 20, y);
  ctx.bezierCurveTo(x + 25, y - 18, x + 50, y - 5, x + 60, y + 15);
  ctx.bezierCurveTo(x + 70, y + 5, x + 85, y, x + 95, y + 10);
  ctx.bezierCurveTo(x + 105, y - 8, x + 115, y - 12, x + 125, y + 8);
  ctx.moveTo(x + 10, y + 10);
  ctx.lineTo(x + 140, y + 4);
  ctx.bezierCurveTo(x + 130, y + 18, x + 105, y + 22, x + 90, y + 20);
  ctx.stroke();

  ctx.restore();
}

// Code-barres haute fidélité
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, code: string) {
  ctx.save();
  ctx.fillStyle = "#1e1008";

  let curX = x;
  const hash = (code + "COEURUNIOFFICIEL2026PRESTIGE").split("").map((c) => c.charCodeAt(0));
  let idx = 0;

  while (curX < x + w - 10) {
    const val = hash[idx % hash.length];
    const barW = (val % 3) + 1.6;
    const spaceW = ((val >> 2) % 3) + 1.5;

    ctx.fillRect(curX, y, barW, h);
    curX += barW + spaceW;
    idx++;
  }

  ctx.restore();
}

// Pastille d'icône ronde aux couleurs nobles de la marque (Bordeaux & Or)
function drawCircleIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  iconType: "user" | "calendar" | "globe" | "briefcase"
) {
  ctx.save();

  // Fond bordeaux noble avec liseré doré
  const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
  grad.addColorStop(0, "#a92d27");
  grad.addColorStop(1, "#741713");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#dfb15b";
  ctx.lineWidth = 1.4;
  ctx.stroke();

  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (iconType === "user") {
    ctx.beginPath();
    ctx.arc(cx, cy - 4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + 10, 8, Math.PI * 1.1, Math.PI * 1.9, false);
    ctx.fill();
  } else if (iconType === "calendar") {
    ctx.strokeRect(cx - 7, cy - 6, 14, 13);
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 8);
    ctx.lineTo(cx - 4, cy - 6);
    ctx.moveTo(cx + 4, cy - 8);
    ctx.lineTo(cx + 4, cy - 6);
    ctx.moveTo(cx - 7, cy - 2);
    ctx.lineTo(cx + 7, cy - 2);
    ctx.stroke();
    ctx.fillRect(cx - 4, cy + 1, 2, 2);
    ctx.fillRect(cx + 2, cy + 1, 2, 2);
  } else if (iconType === "globe") {
    ctx.beginPath();
    ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy, 3.5, 7.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 7.5, cy);
    ctx.lineTo(cx + 7.5, cy);
    ctx.stroke();
  } else if (iconType === "briefcase") {
    ctx.strokeRect(cx - 7.5, cy - 4, 15, 11);
    ctx.beginPath();
    ctx.moveTo(cx - 3.5, cy - 4);
    ctx.lineTo(cx - 3.5, cy - 7);
    ctx.lineTo(cx + 3.5, cy - 7);
    ctx.lineTo(cx + 3.5, cy - 4);
    ctx.stroke();
    ctx.fillRect(cx - 1.5, cy + 0.5, 3, 2);
  }

  ctx.restore();
}

/**
 * Fonction de chargement d'image avec promesse
 */
function loadImage(src: string): Promise<HTMLImageElement | undefined> {
  return new Promise((resolve) => {
    if (!src) return resolve(undefined);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(undefined);
    img.src = src;
  });
}

/**
 * Rendu haute précision de la Carte de Membre respectant scrupuleusement l'identité visuelle de Cœur Uni
 */
export async function renderMemberCardCanvas(
  data: MemberCardData,
  canvas?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  const targetCanvas = canvas || document.createElement("canvas");
  const ctx = targetCanvas.getContext("2d");
  if (!ctx) throw new Error("Impossible d'obtenir le contexte Canvas 2D");

  const W = 1200;
  const H = 756;
  targetCanvas.width = W;
  targetCanvas.height = H;

  // Charger le logo officiel Cœur Uni et la photo de profil en parallèle
  const [logoImg, userPhoto] = await Promise.all([
    loadImage("/logo.jpg"),
    data.photoUrl ? loadImage(data.photoUrl) : Promise.resolve(undefined),
  ]);

  // 1. FOND PARCHEMIN NOBLE & CHALEUREUX (Identité Cœur Uni)
  const bgGrad = ctx.createRadialGradient(W * 0.7, H * 0.4, 80, W / 2, H / 2, W * 0.7);
  bgGrad.addColorStop(0, "#fffbf3");
  bgGrad.addColorStop(0.5, "#faf0e2");
  bgGrad.addColorStop(1, "#f3dfc5");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. DOUBLE BORDURE DE PRESTIGE (Bordeaux noble & Liseré d'or)
  const cardBorderRadius = 30;
  ctx.save();

  // Bordure bordeaux externe
  ctx.strokeStyle = "#8b1e19";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(3, 3, W - 6, H - 6, cardBorderRadius);
  ctx.stroke();

  // Liseré intérieur or antique
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(10, 10, W - 20, H - 20, cardBorderRadius - 6);
  ctx.stroke();

  // Ornements d'angle dorés traditionnels
  const corners = [
    { x: 18, y: 18 },
    { x: W - 18, y: 18 },
    { x: 18, y: H - 18 },
    { x: W - 18, y: H - 18 },
  ];
  ctx.fillStyle = "#c59218";
  corners.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();

  // Clip général respectant les angles de la carte
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, cardBorderRadius);
  ctx.clip();

  // 3. BANDEAU INFÉRIEUR BORDEAUX & OR AVEC LA VRAIE DEVISE
  const bottomBarH = 46;
  const bottomY = H - bottomBarH;

  const barGrad = ctx.createLinearGradient(0, bottomY, W, bottomY);
  barGrad.addColorStop(0, "#5a110d");
  barGrad.addColorStop(0.5, "#8b1e19");
  barGrad.addColorStop(1, "#5a110d");
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, bottomY, W, bottomBarH);

  // Ligne d'or séparatrice au-dessus du bandeau
  ctx.strokeStyle = "#dfb15b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, bottomY);
  ctx.lineTo(W, bottomY);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px 'Montserrat', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "3px";
  ctx.fillText(
    "❤   DEUX CŒURS, UNE DESTINÉE   •   DISCRÉTION – RESPECT – AMOUR   ❤",
    W / 2,
    bottomY + bottomBarH / 2
  );

  // 4. PHOTO DU MEMBRE (Gauche)
  const photoX = 36;
  const photoY = 36;
  const photoW = 370;
  const photoH = 465;
  const photoR = 22;

  ctx.save();
  // Cadre photo avec coins arrondis
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoR);
  ctx.clip();

  if (userPhoto && userPhoto.width > 0) {
    const imgRatio = userPhoto.width / userPhoto.height;
    const targetRatio = photoW / photoH;
    let sWidth = userPhoto.width;
    let sHeight = userPhoto.height;
    let sx = 0;
    let sy = 0;

    if (imgRatio > targetRatio) {
      sWidth = userPhoto.height * targetRatio;
      sx = (userPhoto.width - sWidth) / 2;
    } else {
      sHeight = userPhoto.width / targetRatio;
      sy = (userPhoto.height - sHeight) / 2;
    }

    ctx.drawImage(userPhoto, sx, sy, sWidth, sHeight, photoX, photoY, photoW, photoH);
  } else {
    // Fond par défaut aux teintes chaleureuses
    const pGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
    pGrad.addColorStop(0, "#f7ede2");
    pGrad.addColorStop(1, "#ecd4b8");
    ctx.fillStyle = pGrad;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    ctx.fillStyle = "#8b1e19";
    ctx.beginPath();
    ctx.arc(photoX + photoW / 2, photoY + photoH * 0.38, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(photoX + photoW / 2, photoY + photoH * 0.95, 115, Math.PI * 1.15, Math.PI * 1.85);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Montserrat', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PHOTO OFFICIELLE", photoX + photoW / 2, photoY + photoH * 0.62);
  }
  ctx.restore();

  // Double cadre photo Bordeaux & Or
  ctx.strokeStyle = "#8b1e19";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoR);
  ctx.stroke();

  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(photoX + 4, photoY + 4, photoW - 8, photoH - 8, photoR - 3);
  ctx.stroke();

  // 5. CARTOUCHE MATRICULE
  const matX = photoX;
  const matY = photoY + photoH + 16;
  const matW = photoW;
  const matH = 68;

  ctx.fillStyle = "#fff7ed";
  ctx.strokeStyle = "#c59218";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(matX, matY, matW, matH, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#8b1e19";
  ctx.font = "bold 12px 'Montserrat', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText("MATRICULE OFFICIEL", matX + matW / 2, matY + 22);

  ctx.fillStyle = "#261205";
  ctx.font = "bold 23px 'Montserrat', monospace, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText(data.matricule || "CU-2026-0808", matX + matW / 2, matY + 50);

  // 6. CODE-BARRES
  const barX = photoX + 15;
  const barY = matY + matH + 12;
  const barW = photoW - 30;
  const barH = 50;
  drawBarcode(ctx, barX, barY, barW, barH, data.matricule || "CU-2026-0808");

  // 7. EN-TÊTE DROIT (LOGO OFFICIEL CŒUR UNI & TITRE DE MARQUE)
  const headerX = 450;
  const logoDiameter = 135;

  if (logoImg && logoImg.width > 0) {
    // Dessiner le vrai logo officiel en haute résolution avec ombre et liseré doré
    ctx.save();
    ctx.shadowColor = "rgba(63, 31, 15, 0.25)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.arc(headerX + logoDiameter / 2, 28 + logoDiameter / 2, logoDiameter / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logoImg, headerX, 28, logoDiameter, logoDiameter);
    ctx.restore();

    // Liseré or noble autour du logo
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(headerX + logoDiameter / 2, 28 + logoDiameter / 2, logoDiameter / 2 + 1, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Textes de marque fidèles au logo Cœur Uni
  const titleLeftX = headerX + logoDiameter + 25;

  // "AGENCE MATRIMONIALE"
  ctx.fillStyle = "#3f1f0f";
  ctx.font = "bold 19px 'Montserrat', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.letterSpacing = "4px";
  ctx.fillText("AGENCE MATRIMONIALE", titleLeftX, 60);

  // "CŒUR UNI" en grand lettrage serif prestigieux bordeaux
  ctx.fillStyle = "#8b1e19";
  ctx.font = "900 52px 'Georgia', 'Playfair Display', serif";
  ctx.letterSpacing = "1.5px";
  ctx.fillText("CŒUR UNI", titleLeftX, 114);

  // Devise officielle : "Deux cœurs, une destinée"
  ctx.fillStyle = "#6b1410";
  ctx.font = "italic 20px 'Georgia', serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText("— Deux cœurs, une destinée —", titleLeftX + 15, 146);

  // 8. RUBAN CENTRAL "CARTE DE MEMBRE OFFICIELLE"
  const ribbonX = 540;
  const ribbonY = 175;
  const ribbonW = 605;
  const ribbonH = 50;
  drawPrestigeRibbon(ctx, ribbonX, ribbonY, ribbonW, ribbonH, "CARTE DE MEMBRE OFFICIELLE");

  // 9. LIGNES D'INFORMATIONS DU MEMBRE
  const fieldsX = 460;
  const fieldsStartY = 275;
  const fieldRowH = 65;

  const nomComplet = (
    data.nom + (data.prenom ? " " + data.prenom : "")
  ).trim().toUpperCase() || "ANDJE BEKALE";

  const rows = [
    {
      type: "user" as const,
      label: "NOM :",
      value: nomComplet,
      isCountry: false,
    },
    {
      type: "calendar" as const,
      label: "NÉE LE :",
      value: data.dateNaissance || "15/08/1995",
      isCountry: false,
    },
    {
      type: "globe" as const,
      label: "PAYS :",
      value: (data.pays || "GABON").toUpperCase(),
      isCountry: true,
    },
    {
      type: "briefcase" as const,
      label: "PROFESSION :",
      value: (data.profession || "COIFFEUSE").toUpperCase(),
      isCountry: false,
    },
  ];

  rows.forEach((row, i) => {
    const rowY = fieldsStartY + i * fieldRowH;
    const iconCenterX = fieldsX + 22;
    const iconCenterY = rowY - 6;

    // Pastille d'icône ronde noble
    drawCircleIcon(ctx, iconCenterX, iconCenterY, 19, row.type);

    // Label
    ctx.fillStyle = "#5c2a12";
    ctx.font = "bold 16px 'Montserrat', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.letterSpacing = "0.5px";
    ctx.fillText(row.label, fieldsX + 55, rowY);

    // Valeur en noir chaleureux / chocolat foncé
    const valueX = fieldsX + 200;
    ctx.fillStyle = "#1e0f08";
    ctx.font = "bold 23px 'Montserrat', 'Georgia', sans-serif";
    ctx.fillText(row.value, valueX, rowY);

    // Drapeau si pays
    if (row.isCountry) {
      const valWidth = ctx.measureText(row.value).width;
      drawCountryFlag(ctx, data.pays || "Gabon", valueX + valWidth + 18, rowY - 18, 48, 30);
    }

    // Ligne de soulignement fine or/terracotta
    ctx.strokeStyle = "#e8cca8";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fieldsX + 180, rowY + 12);
    ctx.lineTo(W - 45, rowY + 12);
    ctx.stroke();
  });

  // 10. BAS DE CARTE : SCEAU D'OR, VALIDITÉ, SIGNATURE & TAMPON CŒUR UNI
  // A) Sceau doré d'excellence
  const sealX = 495;
  const sealY = 580;
  drawGoldSeal(ctx, sealX, sealY, 52);

  // B) Validité
  const valX = 665;
  const valY = 556;
  ctx.fillStyle = "#8b1e19";
  ctx.font = "bold 13px 'Montserrat', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "1px";
  ctx.fillText("VALIDITÉ", valX, valY);

  const validiteStr = data.validite || "2026 / 2027";
  ctx.fillStyle = "#261205";
  ctx.font = "bold 23px 'Georgia', serif";
  ctx.fillText(validiteStr, valX, valY + 30);

  // Liseré or/bordeaux sous la validité
  ctx.strokeStyle = "#8b1e19";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(valX - 65, valY + 38);
  ctx.lineTo(valX + 65, valY + 38);
  ctx.stroke();

  // C) Signature "La Direction"
  const sigX = 855;
  const sigY = 536;
  ctx.fillStyle = "#3f1f0f";
  ctx.font = "bold 14px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.fillText("La Direction", sigX, sigY);

  drawSignature(ctx, sigX - 60, sigY + 5);

  // D) Cachet / Tampon rouge officiel Cœur Uni avec logo
  const stampX = 1045;
  const stampY = 576;
  drawOfficialStamp(ctx, stampX, stampY, 58, logoImg);

  ctx.restore();
  return targetCanvas;
}

/**
 * Génère l'image PNG (Data URL) de la carte
 */
export async function generateMemberCardDataUrl(data: MemberCardData): Promise<string> {
  const canvas = await renderMemberCardCanvas(data);
  return canvas.toDataURL("image/png", 0.98);
}

export default function MemberCard({ data, onGenerated, className = "" }: MemberCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [isRendering, setIsRendering] = useState<boolean>(true);

  const drawCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsRendering(true);
    try {
      await renderMemberCardCanvas(data, canvas);
      const url = canvas.toDataURL("image/png", 0.98);
      setDataUrl(url);
      if (onGenerated) {
        onGenerated(url);
      }
    } finally {
      setIsRendering(false);
    }
  }, [data, onGenerated]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  const downloadPNG = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `carte-membre-${data.matricule || "coeur-uni"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadPDF = () => {
    if (!dataUrl) return;
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [140, 90],
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, 140, 90);
    pdf.save(`carte-membre-${data.matricule || "coeur-uni"}.pdf`);
  };

  const getWhatsAppLink = () => {
    const nomComplet = (data.nom + (data.prenom ? " " + data.prenom : "")).trim();
    const message = `Bonjour Agence Cœur Uni, je viens de finaliser mon inscription officielle.\n\nVoici les détails de ma Carte de Membre :\n- Nom complet : ${nomComplet}\n- Matricule : ${data.matricule || "CU-2026"}\n- Date de naissance : ${data.dateNaissance || "N/A"}\n- Pays : ${data.pays || "N/A"}\n- Profession : ${data.profession || "N/A"}\n- Validité : ${data.validite || "2026 / 2027"}\n\nMerci de bien vouloir valider mon adhésion et m'intégrer dans le registre officiel de l'agence.`;
    return `https://wa.me/237692778775?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Conteneur d'affichage de la carte avec ombre de prestige noble */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-[#d4af37] shadow-[0_20px_50px_rgba(139,30,25,0.22)] bg-[#fffbf5] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(139,30,25,0.3)]">
        {isRendering && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#fffbf5]/85 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#8b1e19] border-t-[#d4af37]"></div>
              <span className="text-xs font-semibold text-[#8b1e19]">
                Génération de votre Carte Officielle Cœur Uni...
              </span>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="w-full h-auto block select-none"
          style={{ aspectRatio: "1200 / 756" }}
        />
      </div>

      {/* Boutons d'actions sous la carte aux couleurs prestigieuses */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
        <button
          type="button"
          onClick={downloadPNG}
          className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8b1e19] to-[#6b1410] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg cursor-pointer border border-[#d4af37]/40"
        >
          <span>📥</span>
          <span>Télécharger Image (HD)</span>
        </button>

        <button
          type="button"
          onClick={downloadPDF}
          className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#8b1e19] bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#8b1e19] shadow-sm transition hover:bg-[#fff7ed] hover:scale-[1.02] cursor-pointer"
        >
          <span>📄</span>
          <span>Télécharger PDF</span>
        </button>

        <a
          href={getWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:scale-[1.02] hover:bg-[#20bd5a] hover:shadow-lg cursor-pointer"
        >
          <span>💬</span>
          <span>Envoyer sur WhatsApp</span>
        </a>
      </div>

      <p className="mt-3 text-[11px] text-center text-[#8b4f3e] italic">
        Numéro officiel du service d'adhésion : <strong>+237 692 77 87 75</strong>
      </p>
    </div>
  );
}
