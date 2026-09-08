"use client";

import React from "react";
import Image from "next/image";
import { VisaDossierData } from "@/lib/visaLetter";

interface VisaLetterPreviewProps {
  data: VisaDossierData;
  forPrint?: boolean;
}

export default function VisaLetterPreview({ data, forPrint = false }: VisaLetterPreviewProps) {
  const fullName = `${data.prenom} ${data.nom}`.trim() || "Nom et prénom(s)";
  const civilite = data.civilite || "Madame";
  const consulat = data.consulatDestinataire || "Consulat/Ambassade de France";
  const consulatVille = data.consulatVille || data.villeResidence || "Yaoundé";
  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={`bg-white text-stone-900 mx-auto shadow-lg border border-stone-200 transition-all ${forPrint
          ? "w-full p-0 shadow-none border-none"
          : "max-w-[760px] p-8 md:p-12 rounded-xl"
        }`}
      style={{
        fontFamily: "'Times New Roman', Times, Georgia, serif",
        lineHeight: 1.6,
      }}
    >
      {/* En-tête officiel Cabinet BK avec le nouveau logo personnalisé */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0 bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm p-1">
            <Image
              src="/logo-cabinet-bk.jpeg"
              alt="Cabinet BK Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-slate-950 uppercase font-sans">
              Cabinet BK à l'Immigration Française
            </div>
            <div className="text-xs text-slate-600 font-sans italic">
              « Votre projet, notre accompagnement »
            </div>
            <div className="text-[11px] text-blue-900 font-sans font-semibold tracking-wide uppercase mt-1">
              Conseil Personnalisé • Constitution de Dossier • Suivi de Demande
            </div>
          </div>
        </div>

        <div className="text-right hidden sm:block font-sans text-xs text-slate-500">
          <span className="inline-block px-3 py-1 bg-slate-100 rounded-md border border-slate-300 font-bold text-slate-800 tracking-wide uppercase">
            Demande Consulaire
          </span>
        </div>
      </div>

      {/* En-têtes Gauche (Demandeur) et Droite (Consulat) - Structure conforme Image 2 */}
      <div className="flex justify-between items-start mb-8 text-sm md:text-base">
        {/* En-tête demandeur (Gauche) */}
        <div className="w-1/2 pr-4 space-y-0.5">
          <p className="font-bold text-stone-950">
            {civilite} {fullName}
          </p>
          <p className="text-stone-700">{data.adresseResidence || "Adresse de résidence"}</p>
          <p className="text-stone-700">
            {data.villeResidence || "Yaoundé"}, {data.paysResidence || "Cameroun"}
          </p>
          <p className="text-stone-700">
            <span className="font-semibold">N° Téléphone :</span> {data.telephone || "N/A"}
          </p>
          <p className="text-stone-700">
            <span className="font-semibold">Email :</span> {data.email || "N/A"}
          </p>
        </div>

        {/* En-tête consulat (Droite) */}
        <div className="w-1/2 pl-4 text-right space-y-0.5">
          <p className="font-bold text-stone-950">
            {consulat} de {consulatVille}
          </p>
          <p className="text-stone-600 text-xs italic">(Lieu de résidence : {consulatVille})</p>
          <p className="text-stone-700">Service des Visas & Formalités Consulaires</p>
          <p className="text-stone-700">{consulatVille}</p>
          <div className="pt-3">
            <p className="font-semibold text-stone-900">Date : {today}</p>
          </div>
        </div>
      </div>

      {/* Objet du courrier */}
      <div className="my-6 border-b border-stone-200 pb-2">
        <p className="text-base md:text-lg font-bold text-stone-950">
          <span className="underline">Objet</span> : {data.objetDemande || "Demande de visa de court séjour"}
        </p>
      </div>

      {/* Corps du courrier (conforme modèle officiel de la requête) */}
      <div className="space-y-4 text-sm md:text-base text-justify text-stone-800">
        <p className="font-bold text-stone-950">Madame, Monsieur,</p>

        <p>
          Je, soussigné(e), <strong className="text-stone-950">{fullName}</strong>, de nationalité{" "}
          <strong className="text-stone-950">{data.nationalite || "Camerounaise"}</strong>, né(e) le{" "}
          <strong className="text-stone-950">{data.dateNaissance || "N/A"}</strong> à{" "}
          <strong className="text-stone-950">{data.lieuNaissance || "N/A"}</strong>, souhaite
          obtenir un visa de court séjour afin de pouvoir me rendre en France.
        </p>

        <p>
          Je sollicite un tel visa au motif que :{" "}
          <em className="text-stone-900 bg-stone-50 px-1 py-0.5 rounded border border-stone-200">
            {data.motifDemande || "Visite touristique, découverte culturelle et démarches administratives"}
          </em>
          .
        </p>

        <p>
          Conformément aux dispositions du Code de l'entrée et du séjour des étrangers et du droit d'asile, vous trouverez ci-joint les pièces justificatives requises dans une telle situation, notamment le formulaire CERFA n° 12160*01 dûment complété.
        </p>

        <p>
          En espérant que vous donnerez une suite favorable à ma présente demande et restant à votre entière disposition pour vous fournir de plus amples renseignements ou justificatifs complémentaires lors de mon entretien,
        </p>

        <p>
          Je vous prie d'agréer, <strong className="text-stone-950">Madame, Monsieur</strong>, l'expression de mes salutations distinguées.
        </p>
      </div>

      {/* Bloc Signature */}
      <div className="mt-8 flex justify-end">
        <div className="text-right w-64">
          <p className="font-bold text-stone-950 mb-4">Signature :</p>
          <div className="h-16 flex items-center justify-end">
            <span
              className="text-2xl text-blue-900 font-semibold"
              style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive" }}
            >
              {fullName}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider">{fullName}</p>
        </div>
      </div>

      {/* Pièces Jointes */}
      <div className="mt-8 pt-4 border-t border-stone-300 text-xs md:text-sm text-stone-600">
        <p>
          <strong className="text-stone-800">Pièces jointes :</strong> Formulaire CERFA n° 12160*01,
          justificatifs d'identité et de nationalité (passeport), réservation d'hébergement,
          attestation d'assurance voyage, justificatifs de ressources, tout autre document requis.
        </p>
      </div>
    </div>
  );
}
