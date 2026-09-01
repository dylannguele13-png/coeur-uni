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
  photoUrl?: string; // Base64 or image URL
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

  ctx.shadowColor = "rgba(0,0,0,0.12)";
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
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
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

function drawRibbonBanner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  text: string
) {
  ctx.save();
  const notch = 20;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - notch, y + h / 2);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + notch, y + h / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 23px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "2px";
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);

  ctx.restore();
}

function drawHeartsLogo(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = "#f06292";
  ctx.beginPath();
  ctx.arc(-18, -32, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e53935";
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.bezierCurveTo(-15, -18, -38, -18, -38, 0);
  ctx.bezierCurveTo(-38, 16, -15, 28, 0, 42);
  ctx.bezierCurveTo(15, 28, 38, 16, 38, 0);
  ctx.bezierCurveTo(38, -18, 15, -18, 15, 0);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#e91e63";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(15, -10);
  ctx.bezierCurveTo(15, -28, 42, -28, 42, -10);
  ctx.bezierCurveTo(42, 8, 15, 22, 0, 36);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(-18, -2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8, 2, 4.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

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

  const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, r);
  grad.addColorStop(0, "#ffe082");
  grad.addColorStop(0.5, "#ffd54f");
  grad.addColorStop(1, "#c59218");
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = "#b78103";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r - 9, 0, Math.PI * 2);
  ctx.strokeStyle = "#8c5b00";
  ctx.lineWidth = 1;
  ctx.stroke();

  drawStar(ctx, cx - 14, cy - 18, 5, 4, 1.8, "#372200");
  drawStar(ctx, cx, cy - 20, 5, 5, 2.2, "#372200");
  drawStar(ctx, cx + 14, cy - 18, 5, 4, 1.8, "#372200");

  ctx.fillStyle = "#261600";
  ctx.font = "bold 11px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("MEMBRE", cx, cy - 2);
  ctx.fillText("OFFICIEL", cx, cy + 12);

  ctx.restore();
}

function drawOfficialStamp(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.strokeStyle = "#d81b60";
  ctx.fillStyle = "#d81b60";
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r - 6, 0, Math.PI * 2);
  ctx.lineWidth = 1.2;
  ctx.stroke();

  const textTop = "AGENCE MATRIMONIALE";
  const textBottom = "COEURS UNIS";

  ctx.font = "bold 9px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

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

  ctx.fillText("★", cx - r + 9, cy);
  ctx.fillText("★", cx + r - 9, cy);

  drawHeartsLogo(ctx, cx, cy - 3, 0.45);

  ctx.restore();
}

function drawSignature(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1.8;
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

function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, code: string) {
  ctx.save();
  ctx.fillStyle = "#000000";

  let curX = x;
  const hash = (code + "COEURUNIOFFICIEL2026").split("").map((c) => c.charCodeAt(0));
  let idx = 0;

  while (curX < x + w - 10) {
    const val = hash[idx % hash.length];
    const barW = (val % 3) + 1.5;
    const spaceW = ((val >> 2) % 3) + 1.5;

    ctx.fillRect(curX, y, barW, h);
    curX += barW + spaceW;
    idx++;
  }

  ctx.restore();
}

function drawCircleIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  iconType: "user" | "calendar" | "globe" | "briefcase"
) {
  ctx.save();

  ctx.fillStyle = "#f48fb1";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

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
 * Fonction autonome de rendu de carte sur canvas (utilisable sans composant React)
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

  // 1. Fond blanc / blush
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, "#ffffff");
  bgGrad.addColorStop(0.4, "#fff9fb");
  bgGrad.addColorStop(1, "#fff2f5");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Bordure extérieure
  const cardBorderRadius = 32;
  ctx.save();
  ctx.strokeStyle = "#c2185b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(2, 2, W - 4, H - 4, cardBorderRadius);
  ctx.stroke();
  ctx.restore();

  // Clip général
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, cardBorderRadius);
  ctx.clip();

  // 3. Bandeau inférieur
  const bottomBarH = 42;
  ctx.fillStyle = "#c2185b";
  ctx.fillRect(0, H - bottomBarH, W, bottomBarH);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "3px";
  ctx.fillText("❤   DISCRÉTION – RESPECT – CONFIANCE – AMOUR   ❤", W / 2, H - bottomBarH / 2);

  // 4. PHOTO
  const photoX = 32;
  const photoY = 32;
  const photoW = 380;
  const photoH = 475;
  const photoR = 24;

  let imgElement: HTMLImageElement | undefined;
  if (data.photoUrl) {
    try {
      imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(undefined as any);
        img.src = data.photoUrl!;
      });
    } catch {
      imgElement = undefined;
    }
  }

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoR);
  ctx.clip();

  if (imgElement && imgElement.width > 0) {
    const imgRatio = imgElement.width / imgElement.height;
    const targetRatio = photoW / photoH;
    let sWidth = imgElement.width;
    let sHeight = imgElement.height;
    let sx = 0;
    let sy = 0;

    if (imgRatio > targetRatio) {
      sWidth = imgElement.height * targetRatio;
      sx = (imgElement.width - sWidth) / 2;
    } else {
      sHeight = imgElement.width / targetRatio;
      sy = (imgElement.height - sHeight) / 2;
    }

    ctx.drawImage(imgElement, sx, sy, sWidth, sHeight, photoX, photoY, photoW, photoH);
  } else {
    const pGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
    pGrad.addColorStop(0, "#fce4ec");
    pGrad.addColorStop(1, "#f8bbd0");
    ctx.fillStyle = pGrad;
    ctx.fillRect(photoX, photoY, photoW, photoH);

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(photoX + photoW / 2, photoY + photoH * 0.4, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(photoX + photoW / 2, photoY + photoH * 0.95, 120, Math.PI * 1.15, Math.PI * 1.85);
    ctx.fill();
  }
  ctx.restore();

  ctx.strokeStyle = "#f8bbd0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoR);
  ctx.stroke();

  // 5. CARTOUCHE MATRICULE
  const matX = photoX;
  const matY = photoY + photoH + 18;
  const matW = photoW;
  const matH = 68;

  ctx.fillStyle = "#fce4ec";
  ctx.strokeStyle = "#f48fb1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(matX, matY, matW, matH, 18);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#1f2937";
  ctx.font = "bold 13px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "2px";
  ctx.fillText("MATRICULE", matX + matW / 2, matY + 22);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 23px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText(data.matricule || "CU-2026-0808", matX + matW / 2, matY + 50);

  // 6. CODE-BARRES
  const barX = photoX + 15;
  const barY = matY + matH + 12;
  const barW = photoW - 30;
  const barH = 50;
  drawBarcode(ctx, barX, barY, barW, barH, data.matricule || "CU-2026-0808");

  // 7. EN-TÊTE DROIT
  const headerX = 455;
  drawHeartsLogo(ctx, headerX + 50, 80, 1.4);

  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 23px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.letterSpacing = "4px";
  ctx.fillText("AGENCE MATRIMONIALE", headerX + 130, 65);

  ctx.fillStyle = "#c2185b";
  ctx.font = "900 50px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("COEURS UNIS", headerX + 130, 115);

  ctx.fillStyle = "#880e4f";
  ctx.font = "italic 16px Georgia, serif";
  ctx.letterSpacing = "0.5px";
  ctx.fillText("— Réunir les cœurs, unir les destins. —", headerX + 185, 142);

  // 8. RUBAN CENTRAL
  const ribbonX = 550;
  const ribbonY = 168;
  const ribbonW = 595;
  const ribbonH = 50;
  drawRibbonBanner(ctx, ribbonX, ribbonY, ribbonW, ribbonH, "#c2185b", "CARTE DE MEMBRE");

  // 9. LIGNES D'INFORMATIONS
  const fieldsX = 465;
  const fieldsStartY = 270;
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

    drawCircleIcon(ctx, iconCenterX, iconCenterY, 19, row.type);

    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 16px 'Montserrat', 'Inter', Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.letterSpacing = "0.5px";
    ctx.fillText(row.label, fieldsX + 55, rowY);

    const valueX = fieldsX + 200;
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 23px 'Montserrat', 'Inter', Arial, sans-serif";
    ctx.fillText(row.value, valueX, rowY);

    if (row.isCountry) {
      const valWidth = ctx.measureText(row.value).width;
      drawCountryFlag(ctx, data.pays || "Gabon", valueX + valWidth + 18, rowY - 18, 48, 30);
    }

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(fieldsX + 180, rowY + 12);
    ctx.lineTo(W - 45, rowY + 12);
    ctx.stroke();
  });

  // 10. BAS DE CARTE
  const sealX = 495;
  const sealY = 578;
  drawGoldSeal(ctx, sealX, sealY, 52);

  const valX = 665;
  const valY = 555;
  ctx.fillStyle = "#c2185b";
  ctx.font = "bold 13px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "1px";
  ctx.fillText("VALIDITÉ", valX, valY);

  const validiteStr = data.validite || "2026 / 2027";
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 23px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.fillText(validiteStr, valX, valY + 30);

  ctx.strokeStyle = "#c2185b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(valX - 65, valY + 38);
  ctx.lineTo(valX + 65, valY + 38);
  ctx.stroke();

  const sigX = 855;
  const sigY = 535;
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 14px 'Montserrat', 'Inter', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("La Direction", sigX, sigY);

  drawSignature(ctx, sigX - 60, sigY + 5);

  const stampX = 1045;
  const stampY = 575;
  drawOfficialStamp(ctx, stampX, stampY, 58);

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
    a.download = `carte-membre-${data.matricule || "coeurs-unis"}.png`;
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
    pdf.save(`carte-membre-${data.matricule || "coeurs-unis"}.pdf`);
  };

  const getWhatsAppLink = () => {
    const nomComplet = (data.nom + (data.prenom ? " " + data.prenom : "")).trim();
    const message = `Bonjour Agence Cœurs Unis, je viens de finaliser mon inscription officielle.\n\nVoici les détails de ma Carte de Membre :\n- Nom complet : ${nomComplet}\n- Matricule : ${data.matricule || "CU-2026"}\n- Date de naissance : ${data.dateNaissance || "N/A"}\n- Pays : ${data.pays || "N/A"}\n- Profession : ${data.profession || "N/A"}\n- Validité : ${data.validite || "2026 / 2027"}\n\nMerci de bien vouloir valider mon adhésion et m'intégrer dans le registre officiel de l'agence.`;
    return `https://wa.me/237692778775?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-[#f48fb1] shadow-[0_20px_50px_rgba(194,24,91,0.18)] bg-white transition-all duration-300 hover:shadow-[0_25px_60px_rgba(194,24,91,0.25)]">
        {isRendering && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c2185b] border-t-transparent"></div>
              <span className="text-xs font-semibold text-[#c2185b]">
                Génération de votre Carte de Membre...
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

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
        <button
          type="button"
          onClick={downloadPNG}
          className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#c2185b] to-[#ad1457] px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg cursor-pointer"
        >
          <span>📥</span>
          <span>Télécharger Image (HD)</span>
        </button>

        <button
          type="button"
          onClick={downloadPDF}
          className="flex-1 min-w-[170px] inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#c2185b] bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#c2185b] shadow-sm transition hover:bg-[#fce4ec] hover:scale-[1.02] cursor-pointer"
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
