import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const dossiers = await prisma.visaDossier.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const registrations = await prisma.registration.findMany({
      select: {
        id: true,
        registrationNumber: true,
        nom: true,
        prenom: true,
        dateNaissance: true,
        lieuNaissance: true,
        paysResidence: true,
        ville: true,
        nationalite: true,
        profession: true,
        situationMatrimoniale: true,
        nombreEnfants: true,
        telephone: true,
        email: true,
        adresseResidence: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      dossiers,
      registrations,
    });
  } catch (error: any) {
    console.error("GET /api/admin/dossiers error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données", details: error?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      dossierReference,
      registrationId,
      nom,
      prenom,
      dateNaissance,
      lieuNaissance,
      paysResidence,
      villeResidence,
      nationalite,
      profession,
      situationMatrimoniale,
      nombreEnfants,
      telephone,
      email,
      adresseResidence,
      consulatDestinataire,
      consulatVille,
      objetDemande,
      motifDemande,
      montantFrais,
      devise,
      lienPaiement,
      createdBy,
    } = body;

    if (!nom || !prenom || !email) {
      return NextResponse.json(
        { error: "Les champs Nom, Prénom et Email sont obligatoires." },
        { status: 400 }
      );
    }

    const ref = dossierReference || `BK-VISA-${Date.now().toString().slice(-6)}`;

    const dossier = await prisma.visaDossier.upsert({
      where: { dossierReference: ref },
      update: {
        nom,
        prenom,
        dateNaissance: dateNaissance || "",
        lieuNaissance: lieuNaissance || "",
        paysResidence: paysResidence || "",
        villeResidence: villeResidence || "",
        nationalite: nationalite || "",
        profession: profession || "",
        situationMatrimoniale: situationMatrimoniale || "Célibataire",
        nombreEnfants: nombreEnfants || "0",
        telephone: telephone || "",
        email,
        adresseResidence: adresseResidence || "",
        consulatDestinataire:
          consulatDestinataire || "Consulat Général / Ambassade de France",
        consulatVille: consulatVille || "Yaoundé",
        objetDemande: objetDemande || "Demande de visa de court séjour",
        motifDemande:
          motifDemande || "Visite touristique et découverte culturelle",
        montantFrais: montantFrais ? parseFloat(montantFrais) : 164000,
        devise: devise || "XAF",
        lienPaiement:
          lienPaiement ||
          "https://getpay-kappa.vercel.app/pay/frais-de-mise-a-disp-d2rhp",
        updatedAt: new Date(),
      },
      create: {
        dossierReference: ref,
        registrationId: registrationId ? parseInt(registrationId, 10) : null,
        nom,
        prenom,
        dateNaissance: dateNaissance || "",
        lieuNaissance: lieuNaissance || "",
        paysResidence: paysResidence || "",
        villeResidence: villeResidence || "",
        nationalite: nationalite || "",
        profession: profession || "",
        situationMatrimoniale: situationMatrimoniale || "Célibataire",
        nombreEnfants: nombreEnfants || "0",
        telephone: telephone || "",
        email,
        adresseResidence: adresseResidence || "",
        consulatDestinataire:
          consulatDestinataire || "Consulat Général / Ambassade de France",
        consulatVille: consulatVille || "Yaoundé",
        objetDemande: objetDemande || "Demande de visa de court séjour",
        motifDemande:
          motifDemande || "Visite touristique et découverte culturelle",
        montantFrais: montantFrais ? parseFloat(montantFrais) : 164000,
        devise: devise || "XAF",
        lienPaiement:
          lienPaiement ||
          "https://getpay-kappa.vercel.app/pay/frais-de-mise-a-disp-d2rhp",
        createdBy: createdBy || "samyneil4@gmail.com",
      },
    });

    return NextResponse.json({
      success: true,
      dossier,
    });
  } catch (error: any) {
    console.error("POST /api/admin/dossiers error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du dossier", details: error?.message },
      { status: 500 }
    );
  }
}
