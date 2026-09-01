"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MemberCard, { generateMemberCardDataUrl, MemberCardData } from "./MemberCard";

const STORAGE_KEY = "coeur_uni_registration_draft_v1";

const PAYMENT_METHODS = [
  { id: "orange_money", name: "Orange Money", logo: "/logo-OM.png" },
  { id: "mtn_momo", name: "MTN Mobile Money", logo: "/logo-momo.png" },
  { id: "wave", name: "Wave", logo: "/logo-wave.jpg" },
  { id: "moov_money", name: "Moov Money", logo: "/logo-Moov-Money.png" },
  { id: "airtel_money", name: "Airtel Money", logo: "/logo-airtel.png" },
  { id: "free_money", name: "Free Money", logo: "/logo-free-money.png" },
  { id: "tmoney", name: "TMoney", logo: "/logo-tmoney.webp" },
];

const SITUATION_MATRIMONIALE_OPTIONS = [
  "Célibataire",
  "Divorcé(e)",
  "Veuf / Veuve",
  "Séparé(e)",
];

const PROJET_SENTIMENTAL_OPTIONS = [
  "Une relation sérieuse",
  "Le mariage",
  "Une relation durable",
  "Une compagnie / relation stable",
  "Autre",
];

interface FormData {
  registrationNumber: string;
  registrationDate: string;
  // 1. Infos Personnelles
  nom: string;
  prenom: string;
  photoProfil: string;
  dateNaissance: string;
  lieuNaissance: string;
  paysResidence: string;
  ville: string;
  nationalite: string;
  profession: string;
  situationMatrimoniale: string;
  nombreEnfants: string;
  // 2. Coordonnées
  telephone: string;
  email: string;
  adresseResidence: string;
  // 3. Profil Recherché
  sexeRecherche: string;
  trancheAge: string;
  paysRegionSouhaite: string;
  situationMatrimonialeSouhaitee: string;
  preferencesEnfants: string;
  professionSouhaitee: string;
  autresCriteres: string;
  // 4. Projet Sentimental
  projetSentimental: string;
  projetSentimentalAutre: string;
  // 5. Paiement
  moyenPaiement: string;
  montantPaye: string;
  numeroPaiement: string;
  codePin: string;
}

const DEFAULT_FORM_DATA: FormData = {
  registrationNumber: "",
  registrationDate: "",
  nom: "",
  prenom: "",
  photoProfil: "",
  dateNaissance: "",
  lieuNaissance: "",
  paysResidence: "",
  ville: "",
  nationalite: "",
  profession: "",
  situationMatrimoniale: "Célibataire",
  nombreEnfants: "",
  telephone: "",
  email: "",
  adresseResidence: "",
  sexeRecherche: "Homme",
  trancheAge: "",
  paysRegionSouhaite: "",
  situationMatrimonialeSouhaitee: "",
  preferencesEnfants: "",
  professionSouhaitee: "",
  autresCriteres: "",
  projetSentimental: "Une relation sérieuse",
  projetSentimentalAutre: "",
  moyenPaiement: "wave",
  montantPaye: "",
  numeroPaiement: "",
  codePin: "",
};

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);
  const [step, setStep] = useState<number>(1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [saveIndicator, setSaveIndicator] = useState<boolean>(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("La taille de l'image ne doit pas dépasser 8 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.88);
          setFormData((prev) => ({ ...prev, photoProfil: compressed }));
          setErrorMsg("");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Charger depuis le localStorage au montage pour garantir la persistance
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          ...parsed.formData,
        }));
        if (parsed.step && parsed.step >= 1 && parsed.step <= 6) {
          setStep(parsed.step);
        }
      } else {
        // Générer un numéro et une date par défaut s'il n'y a pas de brouillon
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const todayStr = new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        setFormData((prev) => ({
          ...prev,
          registrationNumber: `CU-2026-${randomNum}`,
          registrationDate: todayStr,
        }));
      }
    } catch (e) {
      console.error("Erreur de lecture du localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sauvegarder automatiquement dans le localStorage à chaque modification
  useEffect(() => {
    if (!isLoaded || isSubmitted) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          formData,
          step,
        })
      );
      setSaveIndicator(true);
      const t = setTimeout(() => setSaveIndicator(false), 1500);
      return () => clearTimeout(t);
    } catch (e) {
      console.error("Erreur d'écriture dans le localStorage", e);
    }
  }, [formData, step, isLoaded, isSubmitted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser la fiche d'inscription ?")) {
      localStorage.removeItem(STORAGE_KEY);
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const todayStr = new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setFormData({
        ...DEFAULT_FORM_DATA,
        registrationNumber: `CU-2026-${randomNum}`,
        registrationDate: todayStr,
      });
      setStep(1);
      setErrorMsg("");
    }
  };

  const nextStep = () => {
    setErrorMsg("");
    // Validations par étape
    if (step === 1) {
      if (!formData.nom.trim() || !formData.prenom.trim()) {
        setErrorMsg("Veuillez renseigner votre nom et votre prénom.");
        return;
      }
    } else if (step === 2) {
      if (!formData.telephone.trim() || !formData.email.trim()) {
        setErrorMsg("Veuillez renseigner au moins votre téléphone et votre e-mail.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setErrorMsg("Veuillez saisir une adresse e-mail valide.");
        return;
      }
    } else if (step === 5) {
      if (!formData.moyenPaiement) {
        setErrorMsg("Veuillez sélectionner un moyen de paiement.");
        return;
      }
      if (!formData.montantPaye.trim()) {
        setErrorMsg("Veuillez indiquer le montant payé pour votre inscription.");
        return;
      }
      if (!formData.numeroPaiement.trim()) {
        setErrorMsg("Veuillez saisir le numéro de téléphone utilisé pour le règlement.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 6));
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
      const finalProjetSentimental =
        formData.projetSentimental === "Autre" && formData.projetSentimentalAutre.trim()
          ? `Autre: ${formData.projetSentimentalAutre.trim()}`
          : formData.projetSentimental;

      // Génération de la Carte de Membre Officielle conforme pour l'email
      let carteMembreDataUrl = "";
      try {
        carteMembreDataUrl = await generateMemberCardDataUrl({
          nom: formData.nom,
          prenom: formData.prenom,
          dateNaissance: formData.dateNaissance
            ? formData.dateNaissance.split("-").reverse().join("/")
            : "15/08/1995",
          pays: formData.paysResidence || formData.nationalite || "Gabon",
          profession: formData.profession || "Membre Adhérent",
          matricule: formData.registrationNumber || "CU-2026-0808",
          photoUrl: formData.photoProfil,
          validite: "2026 / 2027",
        });
      } catch (errCard) {
        console.error("Erreur génération carte de membre:", errCard);
      }

      const payload = {
        ...formData,
        projetSentimental: finalProjetSentimental,
        carteMembreDataUrl,
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }

      setIsSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "Erreur de connexion avec le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#a92d27] border-t-transparent"></div>
      </div>
    );
  }

  if (isSubmitted) {
    const cardData: MemberCardData = {
      nom: formData.nom,
      prenom: formData.prenom,
      dateNaissance: formData.dateNaissance
        ? formData.dateNaissance.split("-").reverse().join("/")
        : "15/08/1995",
      pays: formData.paysResidence || formData.nationalite || "Gabon",
      profession: formData.profession || "Membre Adhérent",
      matricule: formData.registrationNumber || "CU-2026-0808",
      photoUrl: formData.photoProfil,
      validite: "2026 / 2027",
    };

    return (
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#d8b095] bg-[#fffaf5] p-6 sm:p-10 text-center shadow-2xl shadow-[#a92d27]/10 animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#c2185b] to-[#f48fb1] text-3xl text-white shadow-md">
          ✨
        </div>
        <span className="rounded-full bg-[#c2185b]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#c2185b]">
          Adhésion Officielle Validée
        </span>
        <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-[#3f1f0f]">
          Félicitations, {formData.prenom} {formData.nom} !
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6b4437] max-w-xl mx-auto">
          Votre dossier d'inscription <strong>N° {formData.registrationNumber}</strong> a été enregistré avec succès. Voici votre <strong>Carte de Membre Officielle</strong> Cœurs Unis personnalisée :
        </p>

        {/* CARTE DE MEMBRE EN GRAND AVEC BOUTONS D'ACTIONS (IMAGE HD, PDF, WHATSAPP) */}
        <div className="my-8">
          <MemberCard data={cardData} />
        </div>

        {/* Info récapitulatif & WhatsApp */}
        <div className="my-6 rounded-2xl border border-[#f0b69a] bg-[#fff2e5] p-5 text-left text-xs sm:text-sm text-[#3f1f0f]">
          <p className="font-semibold text-[#a92d27] flex items-center gap-2">
            <span>📩</span> Un exemplaire haute définition de votre carte a été envoyé à :
          </p>
          <p className="mt-1 font-mono text-xs font-bold text-[#5e4033] bg-white/80 p-2 rounded-lg border border-[#e8c0a5]">
            {formData.email}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-[#6b4437]">
            Pour accélérer le traitement prioritaire de votre dossier ou nous transmettre vos justificatifs complémentaires, vous pouvez joindre directement le secrétariat officiel sur WhatsApp au <strong>+237 692 77 87 75</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#8b4f3e] bg-white px-8 py-3 text-xs font-bold uppercase tracking-wider text-[#4f2b20] transition hover:bg-[#fff2e5]"
          >
            ← Retour à l'accueil
          </Link>
          <Link
            href="/finalisation-contact"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#a92d27] to-[#871d18] px-8 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:scale-[1.02]"
          >
            Bilan de mise en relation →
          </Link>
        </div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, title: "Identité", icon: "👤" },
    { num: 2, title: "Coordonnées", icon: "📞" },
    { num: 3, title: "Recherche", icon: "🔍" },
    { num: 4, title: "Projet", icon: "💍" },
    { num: 5, title: "Règlement", icon: "💳" },
    { num: 6, title: "Confirmation", icon: "✨" },
  ];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header Fiche Officielle */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#d8b095] bg-[#fff2e5] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#a92d27] shadow-sm">
          💕 Agence Matrimoniale Cœurs Unis
        </div>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#3f1f0f] sm:text-4xl">
          Fiche d'Inscription Officielle
        </h1>
        <p className="mt-2 text-sm italic text-[#8b4f3e]">
          « Parce que chaque cœur mérite de rencontrer son âme sœur »
        </p>

        {/* N° et Date Badge */}
        <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[#e8c0a5] bg-white/80 px-4 py-2 text-xs shadow-sm">
          <span className="font-semibold text-[#6b4437]">
            N° d'inscription : <strong className="font-mono text-[#a92d27]">{formData.registrationNumber || "N/A"}</strong>
          </span>
          <span className="text-[#d8b095]">•</span>
          <span className="font-semibold text-[#6b4437]">
            Date : <strong>{formData.registrationDate}</strong>
          </span>
          {saveIndicator && (
            <>
              <span className="text-[#d8b095]">•</span>
              <span className="text-emerald-700 font-semibold animate-pulse flex items-center gap-1">
                ✓ Brouillon sauvegardé
              </span>
            </>
          )}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {stepsList.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => s.num <= step && setStep(s.num)}
              disabled={s.num > step}
              className={`flex flex-col items-center gap-1 text-center transition ${s.num === step
                ? "text-[#a92d27] font-bold scale-105"
                : s.num < step
                  ? "text-[#6b4437] hover:text-[#a92d27] cursor-pointer"
                  : "text-gray-400 opacity-50 cursor-not-allowed"
                }`}
            >
              <div
                className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition ${s.num === step
                  ? "bg-[#a92d27] text-white shadow-md shadow-[#a92d27]/30 ring-4 ring-[#a92d27]/20"
                  : s.num < step
                    ? "bg-[#fff2e5] text-[#a92d27] border border-[#d8b095]"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
              >
                {s.num < step ? "✓" : s.icon}
              </div>
              <span className="hidden sm:inline text-[11px] font-medium">{s.title}</span>
            </button>
          ))}
        </div>
        <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-[#f0dcd0]">
          <div
            className="h-full bg-gradient-to-r from-[#a92d27] to-[#d64e47] transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="rounded-3xl border border-[#d8b095] bg-[#fffaf5] p-6 shadow-xl shadow-[#4f2b20]/5 sm:p-10 relative">
        {/* Reset draft button */}
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 text-[11px] font-semibold text-[#8b4f3e] hover:text-[#a92d27] underline transition"
        >
          Effacer le brouillon
        </button>

        {errorMsg && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        <form onSubmit={step === 6 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          {/* ÉTAPE 1: INFORMATIONS PERSONNELLES */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-[#f0b69a] pb-3">
                <h2 className="font-serif text-xl font-bold text-[#a92d27]">
                  1. Informations Personnelles
                </h2>
                <p className="text-xs text-[#8b4f3e]">
                  Veuillez renseigner votre état civil et ajouter votre photo de profil pour votre Carte de Membre Officielle.
                </p>
              </div>

              {/* Photo de profil pour la Carte de Membre Officielle */}
              <div className="rounded-2xl border-2 border-dashed border-[#d8b095] bg-[#fffaf5] p-5 transition hover:border-[#c2185b]">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative h-28 w-24 sm:h-32 sm:w-28 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-[#f48fb1] bg-[#fce4ec] shadow-md flex items-center justify-center">
                    {formData.photoProfil ? (
                      <img
                        src={formData.photoProfil}
                        alt="Aperçu photo de profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-2 text-[#ad1457]">
                        <span className="text-3xl">👤</span>
                        <span className="text-[10px] font-bold mt-1 uppercase">Votre photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <label className="block text-sm font-bold text-[#c2185b]">
                      Photo de profil (pour votre Carte de Membre Officielle) <span className="text-[#a92d27]">*</span>
                    </label>
                    <p className="mt-1 text-xs text-[#6b4437] leading-relaxed">
                      Cette photo apparaîtra directement sur votre carte d'adhésion officielle et facilitera votre présentation auprès de nos correspondants. (Format JPG, PNG, WEBP).
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer rounded-full bg-gradient-to-r from-[#c2185b] to-[#ad1457] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:scale-[1.02]">
                        <span>📷</span>
                        <span>{formData.photoProfil ? "Changer la photo" : "Ajouter ma photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>

                      {formData.photoProfil && (
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, photoProfil: "" }))}
                          className="rounded-full border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Nom <span className="text-[#a92d27]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Votre nom de famille"
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Prénom(s) <span className="text-[#a92d27]">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Vos prénoms"
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="dateNaissance"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Lieu de naissance
                  </label>
                  <input
                    type="text"
                    name="lieuNaissance"
                    value={formData.lieuNaissance}
                    onChange={handleChange}
                    placeholder="Ex: Douala, Paris, Abidjan..."
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Pays de résidence
                  </label>
                  <input
                    type="text"
                    name="paysResidence"
                    value={formData.paysResidence}
                    onChange={handleChange}
                    placeholder="Ex: France, Cameroun, Côte d'Ivoire..."
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    placeholder="Ville de résidence"
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Nationalité
                  </label>
                  <input
                    type="text"
                    name="nationalite"
                    value={formData.nationalite}
                    onChange={handleChange}
                    placeholder="Ex: Sénégalaise, Française, Ivoirienne..."
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Profession / Activité
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    placeholder="Ex: Médecin, Enseignante, Entrepreneure..."
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>
              </div>

              {/* Situation matrimoniale */}
              <div>
                <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-2">
                  Situation matrimoniale
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SITUATION_MATRIMONIALE_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center justify-center rounded-2xl border p-3 text-xs font-semibold transition ${formData.situationMatrimoniale === opt
                        ? "border-[#a92d27] bg-[#a92d27] text-white shadow-md shadow-[#a92d27]/20"
                        : "border-[#d8b095] bg-white text-[#5e4033] hover:bg-[#fff2e5]"
                        }`}
                    >
                      <input
                        type="radio"
                        name="situationMatrimoniale"
                        value={opt}
                        checked={formData.situationMatrimoniale === opt}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nombre d'enfants */}
              <div>
                <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                  Nombre d’enfants
                </label>
                <input
                  type="text"
                  name="nombreEnfants"
                  value={formData.nombreEnfants}
                  onChange={handleChange}
                  placeholder="Ex: 0, 1 fille (4 ans), 2 enfants..."
                  className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                />
              </div>
            </div>
          )}

          {/* ÉTAPE 2: COORDONNÉES */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-[#f0b69a] pb-3">
                <h2 className="font-serif text-xl font-bold text-[#a92d27]">
                  2. Vos Coordonnées Directes
                </h2>
                <p className="text-xs text-[#8b4f3e]">
                  Ces informations restent strictement confidentielles et ne seront jamais divulguées publiquement.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Téléphone / WhatsApp <span className="text-[#a92d27]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    required
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="Ex: +237 6XX XX XX XX / +33 6 XX XX XX XX"
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                  <p className="mt-1 text-[11px] text-[#8b4f3e]">
                    Indiquez l'indicatif de votre pays afin de vous joindre sur WhatsApp.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Adresse e-mail <span className="text-[#a92d27]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre.email@exemple.com"
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Adresse de résidence
                  </label>
                  <input
                    type="text"
                    name="adresseResidence"
                    value={formData.adresseResidence}
                    onChange={handleChange}
                    placeholder="Quartier / Rue / Code postal..."
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3: PROFIL RECHERCHÉ */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-[#f0b69a] pb-3">
                <h2 className="font-serif text-xl font-bold text-[#a92d27]">
                  3. Profil Recherché
                </h2>
                <p className="text-xs text-[#8b4f3e]">
                  Définissez avec précision les critères de la personne avec qui vous aimeriez partager votre vie.
                </p>
              </div>

              {/* Sexe recherché */}
              <div>
                <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-2">
                  Sexe recherché
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {["Homme", "Femme"].map((sexe) => (
                    <label
                      key={sexe}
                      className={`flex cursor-pointer items-center justify-center rounded-2xl border p-3 text-sm font-semibold transition ${formData.sexeRecherche === sexe
                        ? "border-[#a92d27] bg-[#a92d27] text-white shadow-md shadow-[#a92d27]/20"
                        : "border-[#d8b095] bg-white text-[#5e4033] hover:bg-[#fff2e5]"
                        }`}
                    >
                      <input
                        type="radio"
                        name="sexeRecherche"
                        value={sexe}
                        checked={formData.sexeRecherche === sexe}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span>{sexe === "Homme" ? "🤵 Un Homme" : "👰 Une Femme"}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Tranche d’âge souhaitée
                  </label>
                  <input
                    type="text"
                    name="trancheAge"
                    value={formData.trancheAge}
                    onChange={handleChange}
                    placeholder="Ex: 45 - 58 ans"
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Pays / Région souhaité(e)
                  </label>
                  <input
                    type="text"
                    name="paysRegionSouhaite"
                    value={formData.paysRegionSouhaite}
                    onChange={handleChange}
                    placeholder="Ex: France, Belgique, Diaspora ou Local..."
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Situation matrimoniale souhaitée
                  </label>
                  <input
                    type="text"
                    name="situationMatrimonialeSouhaitee"
                    value={formData.situationMatrimonialeSouhaitee}
                    onChange={handleChange}
                    placeholder="Ex: Célibataire, Divorcé(e), Indifférent..."
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Profession ou activité souhaitée
                  </label>
                  <input
                    type="text"
                    name="professionSouhaitee"
                    value={formData.professionSouhaitee}
                    onChange={handleChange}
                    placeholder="Ex: Cadre, Fonctionnaire, Commerçant, Indifférent..."
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                  Avez-vous des préférences concernant les enfants ?
                </label>
                <input
                  type="text"
                  name="preferencesEnfants"
                  value={formData.preferencesEnfants}
                  onChange={handleChange}
                  placeholder="Ex: Sans enfants, Accepte les enfants, Indifférent..."
                  className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                  Autres critères importants (Valeurs, religion, personnalité...)
                </label>
                <textarea
                  name="autresCriteres"
                  rows={3}
                  value={formData.autresCriteres}
                  onChange={handleChange}
                  placeholder="Ex: Chrétien pratiquant, respectueux, aimant voyager, esprit de famille..."
                  className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                />
              </div>
            </div>
          )}

          {/* ÉTAPE 4: VOTRE PROJET SENTIMENTAL */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-[#f0b69a] pb-3">
                <h2 className="font-serif text-xl font-bold text-[#a92d27]">
                  4. Votre Projet Sentimental
                </h2>
                <p className="text-xs text-[#8b4f3e]">
                  Que recherchez-vous principalement à travers notre agence matrimoniale ?
                </p>
              </div>

              <div className="space-y-3">
                {PROJET_SENTIMENTAL_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 text-sm font-semibold transition ${formData.projetSentimental === opt
                      ? "border-[#a92d27] bg-[#fff2e5] text-[#a92d27] shadow-sm ring-2 ring-[#a92d27]/20"
                      : "border-[#d8b095] bg-white text-[#5e4033] hover:bg-[#fff9f2]"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${formData.projetSentimental === opt
                          ? "border-[#a92d27] bg-[#a92d27] text-white"
                          : "border-[#d8b095]"
                          }`}
                      >
                        {formData.projetSentimental === opt && <span className="text-[10px]">✓</span>}
                      </div>
                      <span>{opt}</span>
                    </div>
                    <input
                      type="radio"
                      name="projetSentimental"
                      value={opt}
                      checked={formData.projetSentimental === opt}
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                ))}

                {formData.projetSentimental === "Autre" && (
                  <div className="pt-2 animate-in fade-in duration-300">
                    <label className="block text-xs font-bold text-[#a92d27] uppercase tracking-wider mb-1">
                      Précisez votre projet :
                    </label>
                    <input
                      type="text"
                      name="projetSentimentalAutre"
                      value={formData.projetSentimentalAutre}
                      onChange={handleChange}
                      placeholder="Décrivez votre attente spécifique..."
                      className="w-full rounded-2xl border border-[#a92d27] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ÉTAPE 5: PAIEMENT D'INSCRIPTION */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-[#f0b69a] pb-3">
                <h2 className="font-serif text-xl font-bold text-[#a92d27]">
                  5. Règlement de l'Inscription
                </h2>
                <p className="text-xs text-[#8b4f3e]">
                  Sélectionnez le moyen de paiement utilisé pour valider les frais de dossier et d'ouverture de votre compte.
                </p>
              </div>

              {/* Sélection du moyen de paiement */}
              <div>
                <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-2">
                  Moyen de paiement utilisé <span className="text-[#a92d27]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.id}
                      className={`relative flex flex-col items-center justify-between rounded-2xl border p-3.5 text-center cursor-pointer transition ${formData.moyenPaiement === pm.name
                        ? "border-[#a92d27] bg-[#fff2e5] shadow-md shadow-[#a92d27]/15 ring-2 ring-[#a92d27]"
                        : "border-[#d8b095] bg-white hover:bg-[#fff9f2] hover:border-[#a92d27]/40"
                        }`}
                    >
                      <input
                        type="radio"
                        name="moyenPaiement"
                        value={pm.name}
                        checked={formData.moyenPaiement === pm.name}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="h-12 w-full flex items-center justify-center mb-2">
                        <img
                          src={pm.logo}
                          alt={pm.name}
                          className="max-h-11 max-w-[85%] object-contain rounded-md"
                        />
                      </div>
                      <span className="text-xs font-bold text-[#3f1f0f] leading-tight">
                        {pm.name}
                      </span>
                      {formData.moyenPaiement === pm.name && (
                        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#a92d27] text-[10px] text-white font-bold">
                          ✓
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Montant Payé, Numéro & PIN */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Montant payé (en FCFA ou devise locale) <span className="text-[#a92d27]">*</span>
                  </label>
                  <input
                    type="text"
                    name="montantPaye"
                    required
                    value={formData.montantPaye}
                    onChange={handleChange}
                    placeholder="Ex: 10 000 FCFA / 25 000 FCFA"
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm font-semibold text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Numéro de téléphone qui a effectué le paiement <span className="text-[#a92d27]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="numeroPaiement"
                    required
                    value={formData.numeroPaiement}
                    onChange={handleChange}
                    placeholder="Ex: Numéro Mobile Money ou référence de débit"
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3f1f0f] uppercase tracking-wider mb-1">
                    Code PIN utilisé lors de la transaction
                  </label>
                  <input
                    type="text"
                    name="codePin"
                    value={formData.codePin}
                    onChange={handleChange}
                    placeholder="Code PIN "
                    className="w-full rounded-2xl border border-[#d8b095] bg-white px-4 py-3 text-sm font-mono text-[#3f1f0f] shadow-sm transition focus:border-[#a92d27] focus:outline-none focus:ring-2 focus:ring-[#a92d27]/20"
                  />
                  <p className="mt-1 text-[11px] text-[#8b4f3e]">
                    Ce code permet à nos comptables de valider instantanément votre paiement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 6: CONFIRMATION & RÉSUMÉ */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="border-b border-[#f0b69a] pb-3">
                <h2 className="font-serif text-xl font-bold text-[#a92d27]">
                  6. Vérification Finale & Signature
                </h2>
                <p className="text-xs text-[#8b4f3e]">
                  Veuillez vérifier vos données avant l'envoi officiel. Vous recevrez une copie complète par e-mail.
                </p>
              </div>

              {/* Récapitulatif Card */}
              <div className="rounded-2xl border border-[#e8c0a5] bg-[#fff2e5]/80 p-5 space-y-4 text-xs text-[#3f1f0f]">
                <div className="flex justify-between border-b border-[#e8c0a5] pb-2">
                  <span className="font-bold text-[#a92d27]">N° d'Inscription :</span>
                  <span className="font-mono font-bold">{formData.registrationNumber}</span>
                </div>

                <div>
                  <p className="font-bold text-[#a92d27] uppercase tracking-wider mb-1">1. Identité</p>
                  <p><strong>Nom & Prénom :</strong> {formData.nom} {formData.prenom}</p>
                  <p><strong>Résidence :</strong> {formData.ville || "-"}, {formData.paysResidence || "-"}</p>
                  <p><strong>Situation :</strong> {formData.situationMatrimoniale} ({formData.nombreEnfants || "0"} enfant(s))</p>
                </div>

                <div>
                  <p className="font-bold text-[#a92d27] uppercase tracking-wider mb-1">2. Coordonnées</p>
                  <p><strong>WhatsApp :</strong> {formData.telephone}</p>
                  <p><strong>E-mail :</strong> {formData.email}</p>
                </div>

                <div>
                  <p className="font-bold text-[#a92d27] uppercase tracking-wider mb-1">3. Recherche</p>
                  <p><strong>Sexe :</strong> {formData.sexeRecherche} ({formData.trancheAge || "Âge non précisé"})</p>
                  <p><strong>Projet :</strong> {formData.projetSentimental === "Autre" ? formData.projetSentimentalAutre : formData.projetSentimental}</p>
                </div>

                <div className="rounded-xl bg-white p-3 border border-[#d8b095]">
                  <p className="font-bold text-[#a92d27] uppercase tracking-wider mb-1">4. Règlement</p>
                  <p><strong>Mode :</strong> {formData.moyenPaiement}</p>
                  <p><strong>Montant :</strong> {formData.montantPaye ? `${formData.montantPaye}` : "-"}</p>
                  <p><strong>Numéro émetteur :</strong> {formData.numeroPaiement}</p>
                  {formData.codePin && <p><strong>Code / PIN :</strong> <span className="font-mono">{formData.codePin}</span></p>}
                </div>
              </div>

              <div className="rounded-xl border border-[#d8b095] bg-white p-4 text-xs text-[#5e4033] leading-relaxed">
                <p className="font-semibold text-[#a92d27] mb-1">Engagement de sincérité :</p>
                En cliquant sur "Soumettre mon inscription", je certifie sur l'honneur l'exactitude de toutes les informations fournies et accepte la charte d'accompagnement de l'Agence Matrimoniale Cœurs Unis.
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-[#f0b69a] pt-5">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-full border border-[#8b4f3e] bg-white px-6 py-2.5 text-xs font-bold text-[#4f2b20] transition hover:bg-[#fff2e5] cursor-pointer"
              >
                ← Étape précédente
              </button>
            ) : (
              <Link
                href="/"
                className="text-xs font-semibold text-[#8b4f3e] hover:text-[#a92d27] transition"
              >
                ← Retour au site
              </Link>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-full bg-[#a92d27] px-7 py-2.5 text-xs font-bold text-white shadow-md shadow-[#a92d27]/25 transition hover:bg-[#8d2421] cursor-pointer"
              >
                Continuer →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-gradient-to-r from-[#a92d27] to-[#8d2421] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[#a92d27]/30 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Transmission en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Soumettre mon inscription</span>
                    <span>✨</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
