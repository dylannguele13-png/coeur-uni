"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "coeur_uni_finalisation_draft_v1";

interface FinalisationData {
  referenceDossier: string;
  dateSoumission: string;
  // Statut
  dejaEnContact: string; // "oui" | "non" | "en_attente"
  // Correspondant
  correspondantNom: string;
  correspondantNationalite: string;
  correspondantProfession: string;
  correspondantAge: string;
  correspondantPaysOrigine: string;
  correspondantPaysResidence: string;
  // Utilisateur
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  nationalite: string;
  profession: string;
  age: string;
  paysOrigine: string;
  paysResidence: string;
  // Échanges & Qualité
  pointsCommuns: string;
  ceQuiMarque: string;
  niveauSatisfaction: string; // "tres_satisfait" | "satisfait" | "moyen" | "peu_satisfait"
  satisfactionScore: number; // 1 to 5
  // Projections & Voyage (Conditionnel)
  projetAvenir: string;
  projetAvenirAutre: string;
  pretADeplacer: string; // "oui_absolument" | "oui_conditions" | "en_reflexion" | "non"
  parleDuVoyage: string; // "oui_deja_parle" | "prevu_prochainement" | "pas_encore"
  commentairesVoyage: string;
  difficultesRencontrees: string;
  souhaitAccompagnement: string;
  // Remarques finales
  remarquesAgence: string;
}

const DEFAULT_DATA: FinalisationData = {
  referenceDossier: "",
  dateSoumission: "",
  dejaEnContact: "oui",
  correspondantNom: "",
  correspondantNationalite: "",
  correspondantProfession: "",
  correspondantAge: "",
  correspondantPaysOrigine: "",
  correspondantPaysResidence: "",
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  nationalite: "",
  profession: "",
  age: "",
  paysOrigine: "",
  paysResidence: "",
  pointsCommuns: "",
  ceQuiMarque: "",
  niveauSatisfaction: "tres_satisfait",
  satisfactionScore: 5,
  projetAvenir: "Rencontre en personne prochainement",
  projetAvenirAutre: "",
  pretADeplacer: "oui_absolument",
  parleDuVoyage: "oui_deja_parle",
  commentairesVoyage: "",
  difficultesRencontrees: "",
  souhaitAccompagnement: "Conseils pour organiser le premier voyage",
  remarquesAgence: "",
};

const SUGGESTIONS_POINTS_COMMUNS = [
  "Valeurs morales & respect",
  "Vision de la famille & enfants",
  "Spiritualité / Foi chrétienne",
  "Goût pour les voyages & découvertes",
  "Ambition & projets professionnels",
  "Communication sincère & écoute",
  "Sens de l'humour & complicité",
  "Cuisine & moments conviviaux",
];

export default function FinalisationForm() {
  const [data, setData] = useState<FinalisationData>(DEFAULT_DATA);
  const [step, setStep] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [saveIndicator, setSaveIndicator] = useState<boolean>(false);

  // Charger les données sauvegardées du brouillon
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData((prev) => ({
          ...prev,
          ...parsed.data,
        }));
        if (parsed.step && parsed.step >= 1 && parsed.step <= 5) {
          setStep(parsed.step);
        }
      } else {
        // Initialiser un numéro de référence élégant
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        setData((prev) => ({
          ...prev,
          referenceDossier: `CU-REL-${randomNum}`,
          dateSoumission: new Date().toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
        }));
      }
    } catch {
      // Ignorer les erreurs de parsing
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarde automatique du brouillon
  useEffect(() => {
    if (!isLoaded || isSubmitted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step }));
      setSaveIndicator(true);
      const timer = setTimeout(() => setSaveIndicator(false), 2000);
      return () => clearTimeout(timer);
    } catch {
      // Ignorer
    }
  }, [data, step, isLoaded, isSubmitted]);

  const handleChange = (
    field: keyof FinalisationData,
    value: string | number
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrorMsg("");
  };

  const handleTogglePointCommun = (point: string) => {
    const currentPoints = data.pointsCommuns
      ? data.pointsCommuns.split(" • ").map((s) => s.trim())
      : [];
    let updatedPoints: string[];
    if (currentPoints.includes(point)) {
      updatedPoints = currentPoints.filter((p) => p !== point);
    } else {
      updatedPoints = [...currentPoints, point];
    }
    handleChange("pointsCommuns", updatedPoints.join(" • "));
  };

  // Positivité des réponses
  const isPositive =
    data.niveauSatisfaction === "tres_satisfait" ||
    data.niveauSatisfaction === "satisfait" ||
    data.satisfactionScore >= 4;

  const nextStep = () => {
    setErrorMsg("");

    // Validations par étape
    if (step === 1) {
      if (data.dejaEnContact === "non") {
        // L'utilisateur n'est pas encore en contact
        // On lui permet de continuer en adaptant ou en lui offrant un message
      } else {
        if (!data.correspondantNom.trim()) {
          setErrorMsg("Veuillez indiquer le nom de votre correspondant(e).");
          return;
        }
      }
    } else if (step === 2) {
      if (!data.nom.trim() || !data.prenom.trim()) {
        setErrorMsg("Veuillez renseigner vos nom et prénom.");
        return;
      }
      if (!data.telephone.trim() || !data.email.trim()) {
        setErrorMsg("Veuillez fournir votre numéro de téléphone et votre e-mail.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(data.email)) {
        setErrorMsg("Veuillez saisir une adresse e-mail valide.");
        return;
      }
    } else if (step === 3) {
      if (!data.ceQuiMarque.trim()) {
        setErrorMsg("Veuillez préciser brièvement ce qui vous marque le plus chez votre correspondant(e).");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const finalProjetAvenir =
        data.projetAvenir === "Autre" && data.projetAvenirAutre.trim()
          ? `Autre: ${data.projetAvenirAutre.trim()}`
          : data.projetAvenir;

      const payload = {
        ...data,
        projetAvenir: finalProjetAvenir,
        dateSoumission: new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const res = await fetch("/api/finalisation-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      setIsSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err?.message || "Erreur réseau lors de la soumission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // ÉCRAN DE SUCCÈS CHALEUREUX AVEC MESSAGE DE L'AGENCE
  // ----------------------------------------------------
  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#d8b095] bg-white/95 p-6 sm:p-10 shadow-2xl backdrop-blur-md text-[#3f1f0f] animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#a92d27] to-[#e87a5d] text-white shadow-lg shadow-[#a92d27]/25 text-3xl">
            ✨
          </div>

          <h2 className="mt-6 font-serif text-2xl sm:text-3xl font-bold text-[#a92d27]">
            Bilan de Mise en Contact Enregistré !
          </h2>

          <p className="mt-2 text-sm sm:text-base text-[#6b4437]">
            Merci infiniment, <strong>{data.prenom || data.nom}</strong>. Votre bilan pour votre correspondance avec <strong>{data.correspondantNom || "votre partenaire"}</strong> a été transmis avec succès à la direction de l'agence.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#d8b095] bg-[#fff8f2] px-5 py-2 text-xs font-semibold tracking-wider text-[#a92d27]">
            <span>RÉFÉRENCE DOSSIER :</span>
            <span className="font-mono text-sm font-bold">{data.referenceDossier || "CU-REL-SUIVI"}</span>
          </div>
        </div>

        {/* Message d'amélioration du service de l'agence */}
        <div className="mt-8 rounded-2xl border-2 border-dashed border-[#a92d27]/40 bg-gradient-to-br from-[#fff7f0] to-[#fdeee4] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="text-3xl sm:text-4xl text-[#a92d27]">💎</div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#a92d27]">
                L'Engagement d'Excellence de l'Agence Cœur Uni
              </h3>
              <p className="mt-2 text-sm sm:text-base text-[#4a2618] leading-relaxed">
                Les précieuses informations et appréciations que vous venez de confier sont essentielles. <strong>Elles permettent à nos conseillers d'améliorer continuellement la qualité de nos services</strong>, d'ajuster l'accompagnement relationnel personnalisé, et de faciliter sereinement vos futures démarches de rencontre et de voyage.
              </p>
              <p className="mt-3 text-xs sm:text-sm text-[#7e4b3c] italic">
                « Notre mission est d'unir les cœurs dans le respect, l'authenticité et la pérennité. Chaque détail compte pour transformer une étincelle en un amour d'une vie. »
              </p>
            </div>
          </div>
        </div>

        {/* Récapitulatif rapide */}
        <div className="mt-6 rounded-2xl border border-[#d8b095]/60 bg-[#fffbf7] p-5 text-xs sm:text-sm text-[#6b4437] space-y-2">
          <div className="flex justify-between border-b border-[#d8b095]/30 pb-2">
            <span className="font-semibold">Correspondant(e) :</span>
            <span className="text-[#3f1f0f] font-medium">{data.correspondantNom || "Non renseigné"}</span>
          </div>
          <div className="flex justify-between border-b border-[#d8b095]/30 pb-2">
            <span className="font-semibold">Appréciation globale :</span>
            <span className="text-[#a92d27] font-bold">
              {data.niveauSatisfaction === "tres_satisfait"
                ? "🌟 Très satisfait(e)"
                : data.niveauSatisfaction === "satisfait"
                  ? "✨ Satisfait(e)"
                  : "Échanges en cours d'évaluation"}
            </span>
          </div>
          {data.projetAvenir && (
            <div className="flex justify-between border-b border-[#d8b095]/30 pb-2">
              <span className="font-semibold">Projet envisagé :</span>
              <span className="text-[#3f1f0f] font-medium">{data.projetAvenir}</span>
            </div>
          )}
          <div className="flex justify-between pt-1">
            <span className="font-semibold">Notification :</span>
            <span className="text-[#2e7d32] font-semibold">Accusé de réception envoyé à {data.email}</span>
          </div>
        </div>

        {/* Actions de fin */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#a92d27] to-[#871d18] px-8 py-3.5 text-center text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
          >
            Retour à l'accueil Cœur Uni
          </Link>

          <a
            href="https://wa.me/?text=Je%20viens%20de%20finaliser%20mon%20bilan%20de%20mise%20en%20relation%20sur%20C%C5%93ur%20Uni%20!"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto rounded-full border border-[#8b4f3e] bg-white px-6 py-3.5 text-center text-sm font-semibold text-[#4f2b20] shadow-sm transition hover:bg-[#fff2e5]"
          >
            Contacter un conseiller WhatsApp
          </a>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ÉTAPES DU FORMULAIRE
  // ----------------------------------------------------
  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-[#d8b095] bg-white/90 p-5 sm:p-9 shadow-2xl backdrop-blur-md text-[#3f1f0f]">
      {/* En-tête du formulaire */}
      <div className="border-b border-[#d8b095]/60 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-[#a92d27]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#a92d27]">
            Suivi & Finalisation de Correspondance
          </span>
          <div className="flex items-center gap-2">
            {saveIndicator && (
              <span className="text-[11px] text-[#2e7d32] font-medium animate-pulse">
                ✓ Brouillon sauvegardé
              </span>
            )}
            <span className="font-mono text-xs font-semibold text-[#8b4f3e]">
              Dossier : {data.referenceDossier || "CU-REL"}
            </span>
          </div>
        </div>

        <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#a92d27]">
          Finalisation de Mise en Contact
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#6b4437]">
          Partagez le bilan de vos échanges avec votre correspondant(e). Vos réponses confidentielles permettent à notre agence d'optimiser l'accompagnement et de concrétiser vos projets de rencontre.
        </p>
      </div>

      {/* Stepper / Indicateur d'étapes */}
      <div className="my-6">
        <div className="flex items-center justify-between text-xs font-semibold text-[#8b4f3e] mb-2">
          <span>Étape {step} sur 5</span>
          <span>
            {step === 1 && "1. Votre Correspondant(e)"}
            {step === 2 && "2. Vos Coordonnées"}
            {step === 3 && "3. Qualité des Échanges"}
            {step === 4 && "4. Projections & Voyage"}
            {step === 5 && "5. Bilan & Clôture"}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1d8bb]/60">
          <div
            className="h-full bg-gradient-to-r from-[#e87a5d] to-[#a92d27] transition-all duration-500 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Message d'erreur */}
      {errorMsg && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-xs sm:text-sm text-red-700 shadow-sm flex items-center gap-2 animate-shake">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* FORMULAIRE INTERACTIF */}
      <form onSubmit={handleSubmit}>
        {/* ========================================================================= */}
        {/* ÉTAPE 1 : STATUT INITIAL & INFORMATIONS SUR LE/LA CORRESPONDANT(E)       */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            {/* Question 1: Êtes-vous déjà en contact ? */}
            <div className="rounded-2xl border border-[#d8b095]/70 bg-[#fff9f4] p-5 shadow-sm">
              <label className="block font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                1. Êtes-vous déjà en contact avec un correspondant ou une correspondante ?
              </label>
              <p className="mt-1 text-xs text-[#7e4b3c]">
                Sélectionnez le statut de vos communications actuelles.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    value: "oui",
                    label: "Oui, échanges en cours",
                    desc: "Nous discutons activement par messages, appels ou visio",
                    badge: "💬 En cours",
                  },
                  {
                    value: "en_attente",
                    label: "En attente d'un premier échange",
                    desc: "La mise en relation a été faite, nous allons débuter",
                    badge: "⏳ Initiation",
                  },
                  {
                    value: "non",
                    label: "Non, pas encore",
                    desc: "Je souhaite que l'agence m'attribue un profil",
                    badge: "🔍 Nouveau profil",
                  },
                ].map((item) => {
                  const isSelected = data.dejaEnContact === item.value;
                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() => handleChange("dejaEnContact", item.value)}
                      className={`relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${isSelected
                        ? "border-[#a92d27] bg-white shadow-md ring-2 ring-[#a92d27]/30"
                        : "border-[#d8b095] bg-white/70 hover:bg-white hover:border-[#a92d27]/60"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#a92d27]">{item.badge}</span>
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${isSelected
                            ? "border-[#a92d27] bg-[#a92d27]"
                            : "border-[#8b4f3e]"
                            }`}
                        >
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="mt-2 font-semibold text-sm text-[#3f1f0f]">{item.label}</div>
                      <div className="mt-1 text-[11px] text-[#6b4437]">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note si "Non" */}
            {data.dejaEnContact === "non" && (
              <div className="rounded-xl border border-[#d8b095] bg-[#fffbf7] p-4 text-xs sm:text-sm text-[#6b4437]">
                <strong className="text-[#a92d27]">Information Cœur Uni :</strong> Si vous n'avez pas encore de correspondant(e) attribué(e), vous pouvez indiquer ci-dessous le type de profil souhaité ou renseigner vos coordonnées pour qu'un conseiller de l'agence vous oriente vers une mise en relation d'exception.
              </div>
            )}

            {/* Questions sur le correspondant */}
            <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                {data.dejaEnContact === "oui"
                  ? "2. Informations sur votre correspondant(e) actuel(le)"
                  : "2. Informations ou profil du correspondant pressenti"}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Nom */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Nom complet de votre correspondant(e) *
                  </label>
                  <input
                    type="text"
                    required={data.dejaEnContact === "oui"}
                    value={data.correspondantNom}
                    onChange={(e) => handleChange("correspondantNom", e.target.value)}
                    placeholder="Ex: Donald..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Âge */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Son Âge (ou tranche d'âge)
                  </label>
                  <input
                    type="text"
                    value={data.correspondantAge}
                    onChange={(e) => handleChange("correspondantAge", e.target.value)}
                    placeholder="Ex: 52 ans"
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Nationalité */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Sa Nationalité
                  </label>
                  <input
                    type="text"
                    value={data.correspondantNationalite}
                    onChange={(e) => handleChange("correspondantNationalite", e.target.value)}
                    placeholder="Ex: Française, Belge, Canadienne..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Sa Profession / Activité
                  </label>
                  <input
                    type="text"
                    value={data.correspondantProfession}
                    onChange={(e) => handleChange("correspondantProfession", e.target.value)}
                    placeholder="Ex: Chirurgien, Chef d'entreprise, Ingénieur..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Pays d'origine */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Son Pays d'origine
                  </label>
                  <input
                    type="text"
                    value={data.correspondantPaysOrigine}
                    onChange={(e) => handleChange("correspondantPaysOrigine", e.target.value)}
                    placeholder="Ex: France, Suisse, Belgique..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Pays de résidence actuel */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Son Pays de résidence actuel (si différent)
                  </label>
                  <input
                    type="text"
                    value={data.correspondantPaysResidence}
                    onChange={(e) => handleChange("correspondantPaysResidence", e.target.value)}
                    placeholder="Ex: France (Paris), Canada (Montréal)..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ÉTAPE 2 : INFORMATIONS SUR L'UTILISATEUR QUI REMPLIT LE FORMULAIRE       */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                Vos Informations Personnelles (Adhérent(e) Cœur Uni)
              </h3>
              <p className="text-xs text-[#7e4b3c]">
                Renseignez vos coordonnées afin que nous puissions faire le lien avec votre fiche d'inscription et vous contacter pour le suivi.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Nom */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Votre Nom de famille *
                  </label>
                  <input
                    type="text"
                    required
                    value={data.nom}
                    onChange={(e) => handleChange("nom", e.target.value)}
                    placeholder="Ex: DUPONT..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Prénom */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Votre Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={data.prenom}
                    onChange={(e) => handleChange("prenom", e.target.value)}
                    placeholder="Ex: Marie-Claire, Axel..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Téléphone / WhatsApp actif *
                  </label>
                  <input
                    type="tel"
                    required
                    value={data.telephone}
                    onChange={(e) => handleChange("telephone", e.target.value)}
                    placeholder="Ex: +237 690 00 00 00 / +33 6 00 00 00 00"
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Adresse E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={data.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="Ex: votre-adresse@gmail.com"
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Âge */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Votre Âge
                  </label>
                  <input
                    type="text"
                    value={data.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="Ex: 38 ans"
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Nationalité */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Votre Nationalité
                  </label>
                  <input
                    type="text"
                    value={data.nationalite}
                    onChange={(e) => handleChange("nationalite", e.target.value)}
                    placeholder="Ex: Camerounaise, Ivoirienne, Sénégalaise..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Profession */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Votre Profession / Métier
                  </label>
                  <input
                    type="text"
                    value={data.profession}
                    onChange={(e) => handleChange("profession", e.target.value)}
                    placeholder="Ex: Comptable, Enseignante, Cadre de santé..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                {/* Pays d'origine */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                    Votre Pays d'origine
                  </label>
                  <input
                    type="text"
                    value={data.paysOrigine}
                    onChange={(e) => handleChange("paysOrigine", e.target.value)}
                    placeholder="Ex: Cameroun, Côte d'Ivoire, Gabon..."
                    className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] px-4 py-2.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ÉTAPE 3 : QUALITÉ & ÉVOLUTION DES ÉCHANGES                               */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            {/* Niveau de satisfaction */}
            <div className="rounded-2xl border border-[#d8b095]/70 bg-[#fff9f4] p-5 shadow-sm">
              <label className="block font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                À quel point êtes-vous satisfait(e) de vos échanges jusqu'à présent ?
              </label>
              <p className="mt-1 text-xs text-[#7e4b3c]">
                Votre évaluation guide notre équipe pour adapter nos conseils personnalisés.
              </p>

              {/* Badges de satisfaction */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
                {[
                  {
                    key: "tres_satisfait",
                    score: 5,
                    title: "Très satisfait(e)",
                    emoji: "💖",
                    desc: "Alchimie évidente & excellente entente",
                  },
                  {
                    key: "satisfait",
                    score: 4,
                    title: "Satisfait(e)",
                    emoji: "✨",
                    desc: "Échanges fluides & prometteurs",
                  },
                  {
                    key: "moyen",
                    score: 3,
                    title: "Moyennement",
                    emoji: "⚖️",
                    desc: "Encore en observation mutuelle",
                  },
                  {
                    key: "peu_satisfait",
                    score: 2,
                    title: "Peu satisfait(e)",
                    emoji: "🌧️",
                    desc: "Difficultés de communication",
                  },
                ].map((item) => {
                  const isSelected = data.niveauSatisfaction === item.key;
                  return (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => {
                        handleChange("niveauSatisfaction", item.key);
                        handleChange("satisfactionScore", item.score);
                      }}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${isSelected
                        ? "border-[#a92d27] bg-white shadow-lg ring-2 ring-[#a92d27]/40 scale-[1.02]"
                        : "border-[#d8b095] bg-white/70 hover:bg-white hover:border-[#a92d27]/60"
                        }`}
                    >
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="mt-2 font-bold text-sm text-[#3f1f0f]">{item.title}</span>
                      <span className="mt-1 text-[11px] text-[#7e4b3c]">{item.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Étoiles interactives */}
              <div className="mt-5 flex items-center justify-center gap-3 pt-4 border-t border-[#d8b095]/40">
                <span className="text-xs font-semibold text-[#6b4437]">Note d'appréciation :</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => {
                        handleChange("satisfactionScore", star);
                        if (star >= 4) handleChange("niveauSatisfaction", "tres_satisfait");
                        else if (star === 3) handleChange("niveauSatisfaction", "satisfait");
                        else handleChange("niveauSatisfaction", "moyen");
                      }}
                      className="text-2xl transition hover:scale-125 focus:outline-none"
                    >
                      {star <= data.satisfactionScore ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
                <span className="font-bold text-sm text-[#a92d27]">
                  {data.satisfactionScore} / 5
                </span>
              </div>
            </div>

            {/* Points Communs */}
            <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-4">
              <label className="block font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                Avez-vous des points communs avec votre correspondant(e) ?
              </label>
              <p className="text-xs text-[#7e4b3c]">
                Cliquez sur les affinités partagées ou décrivez-les dans l'encadré ci-dessous.
              </p>

              {/* Tags cliquables */}
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS_POINTS_COMMUNS.map((point) => {
                  const isChecked = data.pointsCommuns.includes(point);
                  return (
                    <button
                      type="button"
                      key={point}
                      onClick={() => handleTogglePointCommun(point)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${isChecked
                        ? "bg-[#a92d27] text-white shadow-sm ring-2 ring-[#a92d27]/20"
                        : "border border-[#d8b095] bg-[#fffaf5] text-[#6b4437] hover:bg-[#ffece0]"
                        }`}
                    >
                      {isChecked ? `✓ ${point}` : `+ ${point}`}
                    </button>
                  );
                })}
              </div>

              <div>
                <textarea
                  rows={3}
                  value={data.pointsCommuns}
                  onChange={(e) => handleChange("pointsCommuns", e.target.value)}
                  placeholder="Ex: Nous partageons les mêmes valeurs chrétiennes, l'amour du travail bien fait et le désir sincère de fonder un foyer stable..."
                  className="mt-2 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] p-3.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
                />
              </div>
            </div>

            {/* Qu'est-ce qui vous marque le plus ? */}
            <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-3">
              <label className="block font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                Qu'est-ce qui vous marque le plus chez votre partenaire ? *
              </label>
              <p className="text-xs text-[#7e4b3c]">
                Son attention, sa courtoisie, sa maturité, sa voix, son écoute bienveillante, sa franchise...
              </p>
              <textarea
                rows={3}
                required
                value={data.ceQuiMarque}
                onChange={(e) => handleChange("ceQuiMarque", e.target.value)}
                placeholder="Ex: Ce qui me touche profondément, c'est son respect, sa grande douceur et son sérieux lorsqu'il évoque ses projets d'avenir..."
                className="w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] p-3.5 text-sm text-[#3f1f0f] shadow-inner outline-none transition focus:border-[#a92d27] focus:bg-white focus:ring-2 focus:ring-[#a92d27]/20"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ÉTAPE 4 : PROJECTIONS D'AVENIR & VOYAGE (LOGIQUE DYNAMIQUE CONDITIONNELLE) */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            {/* Condition 1 : Réponse positive / Satisfaction favorable */}
            {isPositive ? (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#d8b095]/80 bg-gradient-to-br from-[#fff7f0] to-[#fdeee4] p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-[#a92d27] font-bold text-sm">
                    <span>🌹</span>
                    <span>Échanges Positifs & Harmonie Relevée</span>
                  </div>
                  <p className="mt-1 text-xs text-[#6b4437]">
                    Puisque vos échanges sont enrichissants, l'agence prépare les prochaines étapes concrètes de votre projet amoureux.
                  </p>
                </div>

                {/* Question : Qu'envisagez-vous jusqu'à présent avec votre partenaire ? */}
                <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-4">
                  <label className="block font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                    Qu'envisagez-vous jusqu'à présent avec votre partenaire ?
                  </label>
                  <p className="text-xs text-[#7e4b3c]">
                    Définissez la direction que prend votre relation.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {[
                      "Rencontre en personne prochainement",
                      "Le mariage et l'installation d'un foyer",
                      "Des fiançailles officielles",
                      "Poursuivre les échanges pour approfondir",
                      "Un voyage touristique à deux pour se découvrir",
                      "Autre",
                    ].map((opt) => {
                      const isSelected = data.projetAvenir === opt;
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleChange("projetAvenir", opt)}
                          className={`rounded-xl border p-3 text-left text-xs sm:text-sm font-medium transition ${isSelected
                            ? "border-[#a92d27] bg-[#fff2e5] text-[#a92d27] font-bold shadow-sm ring-1 ring-[#a92d27]"
                            : "border-[#d8b095] bg-[#fffaf5] text-[#3f1f0f] hover:bg-[#fff2e5]"
                            }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {data.projetAvenir === "Autre" && (
                    <input
                      type="text"
                      value={data.projetAvenirAutre}
                      onChange={(e) => handleChange("projetAvenirAutre", e.target.value)}
                      placeholder="Précisez votre projet..."
                      className="mt-2 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] p-3 text-sm text-[#3f1f0f] outline-none focus:border-[#a92d27]"
                    />
                  )}
                </div>

                {/* Question Voyage 1 : Serez-vous prête / prêt à vous déplacer pour rejoindre votre partenaire ? */}
                <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-4">
                  <label className="block font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                    Serez-vous prêt(e) à vous déplacer pour rejoindre votre partenaire ?
                  </label>
                  <p className="text-xs text-[#7e4b3c]">
                    (Voyage dans son pays de résidence ou rencontre dans un pays intermédiaire)
                  </p>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      {
                        key: "oui_absolument",
                        title: "Oui, absolument",
                        desc: "Dès que les modalités et l'organisation seront fixées",
                        icon: "✈️",
                      },
                      {
                        key: "oui_conditions",
                        title: "Oui, sous certaines conditions",
                        desc: "Avec l'accord préalable des familles ou préparation administrative",
                        icon: "📑",
                      },
                      {
                        key: "en_reflexion",
                        title: "En cours de réflexion",
                        desc: "Je préfère d'abord qu'il/elle vienne me rendre visite en premier",
                        icon: "🌍",
                      },
                      {
                        key: "non",
                        title: "Pas pour le moment",
                        desc: "Je souhaite que la rencontre se passe uniquement dans ma ville",
                        icon: "🏡",
                      },
                    ].map((item) => {
                      const isSelected = data.pretADeplacer === item.key;
                      return (
                        <button
                          type="button"
                          key={item.key}
                          onClick={() => handleChange("pretADeplacer", item.key)}
                          className={`rounded-xl border p-3.5 text-left transition ${isSelected
                            ? "border-[#a92d27] bg-[#fff2e5] shadow-sm ring-1 ring-[#a92d27]"
                            : "border-[#d8b095] bg-[#fffaf5] hover:bg-white"
                            }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-sm text-[#3f1f0f]">
                            <span>{item.icon}</span>
                            <span>{item.title}</span>
                          </div>
                          <div className="mt-1 text-xs text-[#7e4b3c]">{item.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Voyage 2 : En avez-vous déjà parlé avec votre partenaire ? */}
                <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-4">
                  <label className="block font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                    En avez-vous déjà parlé avec votre partenaire ? (Projet de voyage & rencontre physique)
                  </label>
                  <p className="text-xs text-[#7e4b3c]">
                    Le dialogue sur la première rencontre est un indicateur capital de solidité mutuelle.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {[
                      {
                        key: "oui_deja_parle",
                        title: "Oui, nous en avons parlé",
                        desc: "Nous sommes d'accord sur le principe",
                      },
                      {
                        key: "prevu_prochainement",
                        title: "C'est prévu d'en parler",
                        desc: "Nous allons l'aborder très bientôt",
                      },
                      {
                        key: "pas_encore",
                        title: "Pas encore abordé",
                        desc: "Nous préférons patienter un peu",
                      },
                    ].map((opt) => {
                      const isSelected = data.parleDuVoyage === opt.key;
                      return (
                        <button
                          type="button"
                          key={opt.key}
                          onClick={() => handleChange("parleDuVoyage", opt.key)}
                          className={`rounded-xl border p-3 text-left transition ${isSelected
                            ? "border-[#a92d27] bg-[#fff2e5] font-bold shadow-sm ring-1 ring-[#a92d27]"
                            : "border-[#d8b095] bg-[#fffaf5] hover:bg-white"
                            }`}
                        >
                          <div className="text-xs sm:text-sm font-semibold text-[#3f1f0f]">{opt.title}</div>
                          <div className="text-[11px] text-[#7e4b3c] mt-0.5">{opt.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437] mt-3">
                      Précisions éventuelles sur votre projet de voyage ou de rencontre :
                    </label>
                    <textarea
                      rows={2}
                      value={data.commentairesVoyage}
                      onChange={(e) => handleChange("commentairesVoyage", e.target.value)}
                      placeholder="Ex: Nous envisageons un séjour de 10 jours en décembre, ou une première rencontre à Paris..."
                      className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] p-3 text-sm text-[#3f1f0f] outline-none focus:border-[#a92d27]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Condition 2 : Satisfaction mitigée ou négative -> Écoute bienveillante & réorientation */
              <div className="space-y-6">
                <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-5 shadow-sm text-[#78350f]">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>🤝</span>
                    <span>L'Accompagnement et l'Écoute Bienveillante de l'Agence</span>
                  </div>
                  <p className="mt-1 text-xs">
                    Toutes les rencontres ne débouchent pas toujours sur une évidence immédiate, et cela fait partie normale du cheminement sentimental. Cœur Uni est là pour vous guider sans aucune pression.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-4">
                  <label className="block font-serif text-base sm:text-lg font-bold text-[#a92d27]">
                    Quelles sont les difficultés ou les freins rencontrés ?
                  </label>
                  <textarea
                    rows={3}
                    value={data.difficultesRencontrees}
                    onChange={(e) => handleChange("difficultesRencontrees", e.target.value)}
                    placeholder="Ex: Différence de rythme de communication, vision du couple différente, indisponibilité..."
                    className="w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] p-3 text-sm text-[#3f1f0f] outline-none focus:border-[#a92d27]"
                  />

                  <label className="block font-serif text-sm font-bold text-[#a92d27] mt-3">
                    Que souhaitez-vous que l'agence fasse pour vous ?
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      "M'aider à débloquer le dialogue avec ce correspondant",
                      "Me proposer un nouveau profil plus en accord avec mes attentes",
                      "Faire une pause momentanée dans les mises en relation",
                      "Bénéficier d'un entretien téléphonique avec un conseiller",
                    ].map((choix) => {
                      const isSelected = data.souhaitAccompagnement === choix;
                      return (
                        <button
                          type="button"
                          key={choix}
                          onClick={() => handleChange("souhaitAccompagnement", choix)}
                          className={`rounded-xl border p-3 text-left text-xs font-medium transition ${isSelected
                            ? "border-[#a92d27] bg-[#fff2e5] font-bold ring-1 ring-[#a92d27]"
                            : "border-[#d8b095] bg-[#fffaf5] hover:bg-white"
                            }`}
                        >
                          {choix}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* ÉTAPE 5 : RÉCAPITULATIF, REMARQUES & MESSAGE DE FIN DE L'AGENCE          */}
        {/* ========================================================================= */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in">
            {/* Grand Message de l'Agence */}
            <div className="rounded-2xl border-2 border-[#d8b095] bg-gradient-to-br from-[#fff7f0] via-[#fff1e5] to-[#fce4d4] p-6 shadow-md">
              <div className="flex items-start gap-3.5">
                <span className="text-3xl">🕊️</span>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#a92d27]">
                    L'Excellence & la Confidentialité Cœur Uni
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#4a2618] leading-relaxed">
                    Toutes les données recueillies dans ce bilan <strong>permettront d'améliorer continuellement les services de l'agence</strong>, de garantir un suivi relationnel de prestige, et de mettre en œuvre les meilleures conditions pour la réussite de votre future union.
                  </p>
                  <p className="mt-2 text-xs text-[#7e4b3c] italic">
                    « Vos retours nous permettent de parfaire notre sélection, d'éviter les malentendus et d'accélérer l'avènement d'un amour sincère et durable. »
                  </p>
                </div>
              </div>
            </div>

            {/* Récapitulatif visuel avant envoi */}
            <div className="rounded-2xl border border-[#d8b095]/70 bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-[#a92d27] border-b border-[#d8b095]/30 pb-2">
                Récapitulatif de votre Bilan de Mise en Relation
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs sm:text-sm">
                <div className="rounded-xl bg-[#fffaf5] p-3 border border-[#d8b095]/40">
                  <span className="text-[11px] font-bold text-[#8b4f3e] uppercase block">Votre Correspondant(e)</span>
                  <p className="mt-1 font-semibold text-[#3f1f0f]">{data.correspondantNom || "Non spécifié"}</p>
                  <p className="text-xs text-[#6b4437]">{data.correspondantNationalite} • {data.correspondantProfession}</p>
                </div>

                <div className="rounded-xl bg-[#fffaf5] p-3 border border-[#d8b095]/40">
                  <span className="text-[11px] font-bold text-[#8b4f3e] uppercase block">Vous (Adhérent(e))</span>
                  <p className="mt-1 font-semibold text-[#3f1f0f]">{data.nom} {data.prenom}</p>
                  <p className="text-xs text-[#6b4437]">{data.telephone} • {data.email}</p>
                </div>

                <div className="rounded-xl bg-[#fffaf5] p-3 border border-[#d8b095]/40">
                  <span className="text-[11px] font-bold text-[#8b4f3e] uppercase block">Satisfaction & Échanges</span>
                  <p className="mt-1 font-semibold text-[#a92d27]">
                    {data.niveauSatisfaction === "tres_satisfait" ? "Très satisfait(e) (5/5)" : "Satisfait(e)"}
                  </p>
                  <p className="text-xs text-[#6b4437] line-clamp-1">{data.ceQuiMarque}</p>
                </div>

                <div className="rounded-xl bg-[#fffaf5] p-3 border border-[#d8b095]/40">
                  <span className="text-[11px] font-bold text-[#8b4f3e] uppercase block">Projet & Voyage</span>
                  <p className="mt-1 font-semibold text-[#3f1f0f]">{data.projetAvenir}</p>
                  <p className="text-xs text-[#6b4437]">
                    Prêt(e) à voyager : {data.pretADeplacer === "oui_absolument" ? "Oui absolument" : "En réflexion"}
                  </p>
                </div>
              </div>

              {/* Remarques optionnelles */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6b4437]">
                  Un mot ou une suggestion pour la direction de l'agence ? (Optionnel)
                </label>
                <textarea
                  rows={2}
                  value={data.remarquesAgence}
                  onChange={(e) => handleChange("remarquesAgence", e.target.value)}
                  placeholder="Partagez vos impressions ou vos suggestions..."
                  className="mt-1.5 w-full rounded-xl border border-[#d8b095] bg-[#fffaf5] p-3 text-sm text-[#3f1f0f] outline-none focus:border-[#a92d27]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Boutons de Navigation & Soumission */}
        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-[#d8b095]/60 pt-5">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full border border-[#8b4f3e] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#4f2b20] transition hover:bg-[#fff2e5] disabled:opacity-50"
            >
              ← Étape Précédente
            </button>
          ) : (
            <Link
              href="/"
              className="w-full sm:w-auto rounded-full border border-[#8b4f3e]/40 bg-white/60 px-5 py-3 text-center text-xs font-semibold text-[#8b4f3e] transition hover:bg-white"
            >
              Retour à l'accueil
            </Link>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#a92d27] to-[#7f1914] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              Continuer vers l'étape suivante →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#a92d27] via-[#c2362f] to-[#7f1914] px-9 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl transition hover:scale-[1.03] hover:shadow-2xl disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Transmission en cours...</span>
                </>
              ) : (
                <>
                  <span>Valider & Transmettre mon Bilan</span>
                  <span>💌</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
