export interface VisaDossierData {
  id?: number;
  dossierReference?: string;
  registrationId?: number | null;
  civilite?: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  paysResidence?: string;
  villeResidence?: string;
  nationalite?: string;
  profession?: string;
  situationMatrimoniale?: string;
  nombreEnfants?: string;
  telephone: string;
  email: string;
  adresseResidence?: string;
  consulatDestinataire?: string;
  consulatVille?: string;
  objetDemande?: string;
  motifDemande?: string;
  montantFrais?: number | string;
  devise?: string;
  lienPaiement?: string;
  statutEmail?: string;
  dateEnvoi?: string;
}

/**
 * Modèle de données par défaut (Exemple Jeanne Marie demandé par l'utilisateur)
 */
export const DEFAULT_JEANNE_MARIE_DOSSIER: VisaDossierData = {
  civilite: "Madame",
  nom: "Marie",
  prenom: "Jeanne",
  dateNaissance: "1988-04-15",
  lieuNaissance: "Yaoundé",
  paysResidence: "Cameroun",
  villeResidence: "Yaoundé",
  nationalite: "Camerounaise",
  profession: "Chargée clientèle / Commerciale",
  situationMatrimoniale: "Célibataire",
  nombreEnfants: "01",
  telephone: "+237 691 29 32 95",
  email: "jeannemarie88@gmail.com",
  adresseResidence: "Quartier Odza, Yaoundé",
  consulatDestinataire: "Consulat Général / Ambassade de France",
  consulatVille: "Yaoundé",
  objetDemande: "Demande de visa de court séjour",
  motifDemande: "Visite touristique, découverte culturelle et démarches de mobilité",
  montantFrais: 164000,
  devise: "XAF",
  lienPaiement: "https://getpay-kappa.vercel.app/pay/frais-de-mise-a-disp-d2rhp",
};

/**
 * Génère le contenu textuel pur de la lettre administrative (Image 2)
 */
export function generateVisaLetterText(data: VisaDossierData, dateStr?: string): string {
  const dateFormatted =
    dateStr ||
    new Date().toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const civilite = data.civilite || "Madame";
  const fullName = `${data.prenom} ${data.nom}`.trim();
  const consulat = data.consulatDestinataire || "Consulat/Ambassade de France";
  const consulatVille = data.consulatVille || data.villeResidence || "Yaoundé";

  return `
${civilite} ${fullName}
${data.adresseResidence || "Adresse de résidence"}
${data.villeResidence || "Ville"} (${data.paysResidence || "Pays"})
N° Téléphone : ${data.telephone}
Email : ${data.email}

                                              ${consulat} de ${consulatVille}
                                              (Lieu de résidence)
                                              Adresse consulaire
                                              ${consulatVille}

                                              Date : ${dateFormatted}

Objet : ${data.objetDemande || "Demande de visa de court séjour"}

Madame, Monsieur,

Je, soussigné(e), ${fullName}, de nationalité ${data.nationalite || "Camerounaise"}, né(e) le ${data.dateNaissance || "N/A"} à ${data.lieuNaissance || "N/A"}, souhaite obtenir un visa de court séjour afin de pouvoir me rendre en France.

Je sollicite un tel visa au motif que : ${data.motifDemande || "Séjour touristique et découverte culturelle"}.

Conformément aux dispositions du Code de l'entrée et du séjour des étrangers et du droit d'asile, vous trouverez ci-joint les pièces justificatives requises dans une telle situation, notamment le formulaire CERFA n° 12160*01.

En espérant que vous donnerez une suite favorable à ma présente demande et restant à votre disposition pour vous fournir de plus amples renseignements,

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

                                              Signature :
                                              ${fullName}

Pièces jointes : Formulaire CERFA n° 12160*01, justificatifs d'identité et de nationalité, tout autre document lié à votre demande de visa.
`.trim();
}
