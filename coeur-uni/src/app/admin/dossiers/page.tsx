"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FileText,
  Mail,
  Send,
  Save,
  Printer,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import {
  VisaDossierData,
  DEFAULT_JEANNE_MARIE_DOSSIER,
} from "@/lib/visaLetter";
import VisaLetterCanvas from "@/components/visa/VisaLetterCanvas";

export default function AdminDossiersPage() {
  const [activeAdmin, setActiveAdmin] = useState("samyneil4@gmail.com");
  const [formData, setFormData] = useState<VisaDossierData>(
    DEFAULT_JEANNE_MARIE_DOSSIER
  );
  const [activeTab, setActiveTab] = useState<"letter" | "email">("letter");
  const [lettreImageDataUrl, setLettreImageDataUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Données dynamiques de la base de données via Prisma
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [existingDossiers, setExistingDossiers] = useState<any[]>([]);

  const fetchDatabaseData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dossiers");
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.registrations || []);
        setExistingDossiers(json.dossiers || []);
      }
    } catch (err) {
      console.error("Erreur chargement données:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/admin/login";
    } catch (err) {
      window.location.href = "/admin/login";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Charger les données de test Jeanne Marie
  const handleLoadJeanneMarie = () => {
    setFormData(DEFAULT_JEANNE_MARIE_DOSSIER);
    setMessage({
      type: "success",
      text: "Données de test 'Jeanne Marie' chargées avec succès !",
    });
    setTimeout(() => setMessage(null), 4000);
  };

  // Importer directement une inscription depuis la BD (Prisma)
  const handleSelectRegistration = (regId: string) => {
    const selected = registrations.find((r) => String(r.id) === regId);
    if (!selected) return;

    setFormData((prev) => ({
      ...prev,
      registrationId: selected.id,
      nom: selected.nom || "",
      prenom: selected.prenom || "",
      dateNaissance: selected.dateNaissance || selected.date_naissance || "",
      lieuNaissance: selected.lieuNaissance || selected.lieu_naissance || "",
      paysResidence: selected.paysResidence || selected.pays_residence || "Cameroun",
      villeResidence: selected.ville || selected.ville_residence || "Yaoundé",
      nationalite: selected.nationalite || "Camerounaise",
      profession: selected.profession || "",
      situationMatrimoniale:
        selected.situationMatrimoniale || selected.situation_matrimoniale || "Célibataire",
      nombreEnfants: selected.nombreEnfants || selected.nombre_enfants || "0",
      telephone: selected.telephone || "",
      email: selected.email || "",
      adresseResidence: selected.adresseResidence || selected.adresse_residence || "",
      consulatDestinataire: "Consulat Général / Ambassade de France",
      consulatVille: selected.ville || "Yaoundé",
    }));

    setMessage({
      type: "success",
      text: `Dossier pré-rempli depuis l'inscription de ${selected.prenom} ${selected.nom} (Prisma BD) !`,
    });
    setTimeout(() => setMessage(null), 4000);
  };

  // Sauvegarder dans la base PostgreSQL via Prisma
  const handleSaveToDb = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dossiers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, createdBy: activeAdmin }),
      });
      const data = await res.json();
      if (data.success) {
        const ref = data.dossier.dossierReference || data.dossier.dossier_reference;
        setMessage({
          type: "success",
          text: `Dossier sauvegardé dans PostgreSQL via Prisma (Réf: ${ref}) !`,
        });
        fetchDatabaseData();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur de sauvegarde",
        });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Erreur réseau" });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Envoyer le mail au client via Cabinet BK (Gmail SMTP)
  const handleSendEmail = async () => {
    if (!formData.email) {
      alert("Veuillez renseigner l'adresse e-mail du client.");
      return;
    }

    const confirmSend = window.confirm(
      `Confirmez-vous l'envoi du dossier de visa par e-mail à ${formData.prenom} ${formData.nom} (${formData.email}) depuis cabinetbk.immigration@gmail.com avec la lettre consulaire en image attachée ?`
    );
    if (!confirmSend) return;

    try {
      setSendingEmail(true);
      setMessage(null);

      const res = await fetch("/api/admin/dossiers/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          lettreImageDataUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: `🎉 ${data.message} Une notification a également été transmise à ${data.notifiedAdmins?.join(", ")}.`,
        });
        fetchDatabaseData();
      } else {
        setMessage({
          type: "error",
          text: `Erreur d'envoi : ${data.error}`,
        });
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: `Erreur réseau ou délai dépassé : ${err?.message}`,
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      {/* Barre d'en-tête administrateur */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            {/* Logo Cabinet BK officiel */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white p-1 shadow-lg border border-slate-700/80 shrink-0">
              <Image
                src="/logo-cabinet-bk.jpeg"
                alt="Logo Cabinet BK"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                CABINET BK IMMIGRATION
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                  Prisma ORM & PostgreSQL Connecté
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Génération de demandes consulaires (Image 2) & Facturation d'accompagnement GetPay
              </p>
            </div>
          </div>

          {/* Sélection Admin connecté & Déconnexion */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                <ShieldCheck size={12} className="text-emerald-400" />
                Administrateur :
              </div>
              <select
                value={activeAdmin}
                onChange={(e) => setActiveAdmin(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="samyneil4@gmail.com">samyneil4@gmail.com</option>
                <option value="axeltafem650@gmail.com">axeltafem650@gmail.com</option>
              </select>
            </div>

            <button
              onClick={handleLoadJeanneMarie}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition"
              title="Charger l'exemple de test Jeanne Marie"
            >
              <UserCheck size={14} />
              Exemple Jeanne Marie
            </button>

            <button
              onClick={fetchDatabaseData}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition"
              title="Actualiser la base de données"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 transition"
              title="Se déconnecter"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bannière de notification */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
          <div
            className={`p-4 rounded-xl flex items-center gap-3 border shadow-md ${message.type === "success"
              ? "bg-emerald-950/80 border-emerald-600/50 text-emerald-200"
              : "bg-red-950/80 border-red-600/50 text-red-200"
              }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="shrink-0 text-emerald-400" size={20} />
            ) : (
              <AlertCircle className="shrink-0 text-red-400" size={20} />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        </div>
      )}

      {/* Conteneur principal 2 colonnes */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLONNE GAUCHE (5 colonnes) : Formulaire de paramétrage client */}
        <section className="lg:col-span-5 space-y-6">
          {/* Sélecteur d'importation depuis la BD (Prisma) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Importer un profil client depuis la base PostgreSQL</span>
              <span className="text-blue-400 font-normal">
                {registrations.length} profil(s) en BD
              </span>
            </label>
            <select
              onChange={(e) => handleSelectRegistration(e.target.value)}
              defaultValue=""
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Sélectionner un inscrit Cœurs Unis --
              </option>
              {registrations.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.nom} {reg.prenom} ({reg.ville || "N/A"} - {reg.email})
                </option>
              ))}
            </select>
          </div>

          {/* Formulaire complet */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Briefcase size={18} className="text-blue-400" />
              1. Informations du Demandeur
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Civilité</label>
                <select
                  name="civilite"
                  value={formData.civilite || "Madame"}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Madame">Madame</option>
                  <option value="Monsieur">Monsieur</option>
                  <option value="Mademoiselle">Mademoiselle</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nombre d'enfants</label>
                <input
                  type="text"
                  name="nombreEnfants"
                  value={formData.nombreEnfants || ""}
                  onChange={handleInputChange}
                  placeholder="01"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Prénom(s)</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-semibold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Date de naissance</label>
                <input
                  type="date"
                  name="dateNaissance"
                  value={formData.dateNaissance || ""}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Lieu de naissance</label>
                <input
                  type="text"
                  name="lieuNaissance"
                  value={formData.lieuNaissance || ""}
                  onChange={handleInputChange}
                  placeholder="Yaoundé"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Pays de résidence</label>
                <input
                  type="text"
                  name="paysResidence"
                  value={formData.paysResidence || ""}
                  onChange={handleInputChange}
                  placeholder="Cameroun"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Ville de résidence</label>
                <input
                  type="text"
                  name="villeResidence"
                  value={formData.villeResidence || ""}
                  onChange={handleInputChange}
                  placeholder="Yaoundé"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Nationalité</label>
                <input
                  type="text"
                  name="nationalite"
                  value={formData.nationalite || ""}
                  onChange={handleInputChange}
                  placeholder="Camerounaise"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Profession / Activité</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession || ""}
                  onChange={handleInputChange}
                  placeholder="Commerciale / Chargée clientèle"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 pt-2">
              <MapPin size={18} className="text-blue-400" />
              2. Coordonnées de Contact
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Téléphone / WhatsApp</label>
                <input
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="+237 691 29 32 95"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Adresse E-mail (Destinataire)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="client@gmail.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-300 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Adresse de résidence</label>
                <input
                  type="text"
                  name="adresseResidence"
                  value={formData.adresseResidence || ""}
                  onChange={handleInputChange}
                  placeholder="Quartier Odza, Yaoundé"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 pt-2">
              <DollarSign size={18} className="text-blue-400" />
              3. Paramètres Consulat & Frais GetPay
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Consulat / Ambassade</label>
                <input
                  type="text"
                  name="consulatDestinataire"
                  value={formData.consulatDestinataire || ""}
                  onChange={handleInputChange}
                  placeholder="Consulat/Ambassade de France"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Ville du Consulat</label>
                <input
                  type="text"
                  name="consulatVille"
                  value={formData.consulatVille || ""}
                  onChange={handleInputChange}
                  placeholder="Yaoundé"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Montant des frais</label>
                <input
                  type="number"
                  name="montantFrais"
                  value={formData.montantFrais || 164000}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-emerald-400 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Devise</label>
                <select
                  name="devise"
                  value={formData.devise || "XAF"}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="XAF">XAF (FCFA Afrique Centrale)</option>
                  <option value="XOF">XOF (FCFA Afrique de l'Ouest)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Lien de paiement GetPay</label>
                <input
                  type="text"
                  name="lienPaiement"
                  value={
                    formData.lienPaiement ||
                    "https://getpay-kappa.vercel.app/pay/frais-de-mise-a-disp-d2rhp"
                  }
                  onChange={handleInputChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-blue-300 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Motif invoqué pour le visa</label>
                <textarea
                  name="motifDemande"
                  rows={2}
                  value={formData.motifDemande || ""}
                  onChange={handleInputChange}
                  placeholder="Séjour touristique, découverte culturelle et démarches de mobilité"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Boutons d'actions principaux */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={sendingEmail}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-sm transition disabled:opacity-50"
              >
                <Send size={16} className={sendingEmail ? "animate-bounce" : ""} />
                {sendingEmail ? "Expédition en cours..." : "🚀 Envoyer l'E-mail au Client"}
              </button>

              <button
                type="button"
                onClick={handleSaveToDb}
                disabled={loading}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-sm transition"
              >
                <Save size={16} />
                Sauvegarder BD
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-3 rounded-xl border border-slate-700 flex items-center justify-center text-sm transition"
                title="Imprimer / Exporter la lettre"
              >
                <Printer size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* COLONNE DROITE (7 colonnes) : Prévisualisation & Téléchargement direct */}
        <section className="lg:col-span-7 space-y-4">
          {/* Onglets de sélection du mode d'affichage */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("letter")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === "letter"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
              >
                <FileText size={16} />
                Lettre Consulaire
              </button>

              <button
                onClick={() => setActiveTab("email")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${activeTab === "email"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
              >
                <Mail size={16} />
                Aperçu E-mail Transactionnel
              </button>
            </div>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Mise à jour en temps réel
            </span>
          </div>

          {/* Rendu Onglet 1 : Lettre administrative avec Logo officiel du Cabinet BK & Téléchargements direct */}
          <div className={activeTab === "letter" ? "block space-y-4" : "hidden"}>
            <VisaLetterCanvas
              data={formData}
              onGenerated={setLettreImageDataUrl}
            />
          </div>

          {/* Rendu Onglet 2 : E-mail Client avec Logo Cabinet BK, Lettre en Image & Bouton GetPay */}
          {activeTab === "email" && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-2xl space-y-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                <div>
                  <span className="text-slate-500">De :</span> Cabinet BK Immigration &lt;cabinetbk.immigration@gmail.com&gt;
                </div>
                <div>
                  <span className="text-slate-500">À :</span> {formData.email || "client@email.com"}
                </div>
                <div>
                  <span className="text-slate-500">Objet :</span> 📁 Dossier Visa France - Formalités & Lettre Consulaire | {formData.prenom} {formData.nom}
                </div>
                {lettreImageDataUrl && (
                  <div className="text-emerald-400 flex items-center gap-1.5 pt-1 border-t border-slate-800 text-[11px]">
                    <CheckCircle2 size={13} />
                    <span>Pièce jointe & image intégrée : lettre-demande-visa-{(formData.dossierReference || "REF")}.png (Haute Définition)</span>
                  </div>
                )}
              </div>

              {/* Aperçu conteneur de l'email */}
              <div className="bg-white rounded-xl text-slate-900 p-6 shadow-inner max-h-[780px] overflow-y-auto">
                {/* Logo Cabinet BK dans l'aperçu du mail */}
                <div className="border-b border-slate-200 pb-4 mb-4 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <Image
                      src="/logo-cabinet-bk.jpeg"
                      alt="Logo Cabinet BK"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-base font-bold text-slate-950 m-0">
                    CABINET BK À L'IMMIGRATION FRANÇAISE
                  </h3>
                  <p className="text-xs text-blue-800 uppercase tracking-wider font-semibold mt-1">
                    « Votre projet, notre accompagnement »
                  </p>
                  <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-mono font-bold text-slate-700">
                    RÉFÉRENCE : {formData.dossierReference || "BK-VISA-REF"}
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                  <strong>{formData.civilite || "Madame"} {formData.prenom} {formData.nom}</strong>,<br />
                  Nous avons le plaisir de vous transmettre le projet officiel de votre demande de visa de court séjour pour la France, finalisé et mis en conformité par nos juristes et consultants en mobilité internationale.
                </p>

                {/* Insertion visuelle de la lettre en image haute définition */}
                {lettreImageDataUrl ? (
                  <div className="my-5 p-4 bg-slate-50 border-2 border-dashed border-blue-200 rounded-xl text-center shadow-md">
                    <div className="text-xs font-bold text-blue-900 mb-2 flex items-center justify-center gap-1.5">
                      <FileText size={15} />
                      <span>Lettre Consulaire Officielle jointe au courriel (Image HD) :</span>
                    </div>
                    <div className="relative max-w-[500px] mx-auto rounded-lg overflow-hidden border border-stone-300 shadow-md">
                      <img
                        src={lettreImageDataUrl}
                        alt="Lettre consulaire officielle en image"
                        className="w-full h-auto block"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2.5 italic">
                      📎 Cette lettre sera reçue par le client directement intégrée dans le corps de l'e-mail et en pièce jointe PNG haute résolution.
                    </p>
                  </div>
                ) : (
                  <div className="my-4 border border-stone-300 rounded-lg p-4 bg-stone-50 shadow-sm text-xs leading-relaxed text-stone-800">
                    <div className="font-bold text-stone-900 mb-2">
                      Objet : {formData.objetDemande || "Demande de visa de court séjour"}
                    </div>
                    <p className="mb-2">
                      Je, soussigné(e), <strong>{formData.prenom} {formData.nom}</strong>, né(e) le {formData.dateNaissance} à {formData.lieuNaissance}, sollicite l'octroi d'un visa de court séjour pour la France.
                    </p>
                    <p className="italic text-stone-600">
                      [Corps de lettre complet et annexes CERFA inclus dans le courriel officiel...]
                    </p>
                  </div>
                )}

                {/* Boîte d'action et bouton GetPay */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center my-6">
                  <h4 className="text-base font-bold text-blue-900 m-0 mb-1">
                    Frais d'accompagnement & autorisation de dossier
                  </h4>
                  <p className="text-xs text-slate-600 m-0 mb-3">
                    Pour valider le traitement prioritaire et le dépôt de votre dossier consulaire :
                  </p>
                  <div className="text-2xl font-extrabold text-blue-900 mb-4">
                    {Number(formData.montantFrais || 164000).toLocaleString("fr-FR")} {formData.devise || "XAF"}
                  </div>
                  <a
                    href={formData.lienPaiement}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg text-sm shadow-md transition"
                  >
                    <span>Payer mes frais de dossier en ligne</span>
                    <ExternalLink size={15} />
                  </a>
                  <div className="text-[11px] text-slate-500 mt-3">
                    🔒 Paiement sécurisé via GetPay (Orange Money, MTN MoMo, Wave, Carte bancaire).
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 text-center text-xs text-slate-500">
                  Cabinet BK Immigration • cabinetbk.immigration@gmail.com
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION HISTORIQUE DES DOSSIERS VIA PRISMA (12 colonnes) */}
        <section className="lg:col-span-12 mt-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-blue-400" />
                Dossiers de Visa Enregistrés dans PostgreSQL (Prisma ORM : {existingDossiers.length})
              </h3>
              <button
                onClick={fetchDatabaseData}
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} />
                Actualiser la liste
              </button>
            </div>

            {existingDossiers.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                Aucun dossier enregistré pour l'instant. Utilisez le formulaire pour enregistrer ou expédier un dossier.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Réf Dossier</th>
                      <th className="py-3 px-4">Candidat</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Montant Frais</th>
                      <th className="py-3 px-4">Statut E-mail</th>
                      <th className="py-3 px-4">Dernier Envoi</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {existingDossiers.map((dos) => {
                      const ref = dos.dossierReference || dos.dossier_reference;
                      const montant = dos.montantFrais || dos.montant_frais;
                      const statut = dos.statutEmail || dos.statut_email;
                      const dateEnvoi = dos.dateEnvoi || dos.date_envoi;
                      const ville = dos.villeResidence || dos.ville_residence;
                      const pays = dos.paysResidence || dos.pays_residence;

                      return (
                        <tr key={dos.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-mono font-semibold text-blue-400">
                            {ref}
                          </td>
                          <td className="py-3 px-4 font-medium text-white">
                            {dos.prenom} {dos.nom}
                            <div className="text-[11px] text-slate-500">
                              {ville || "N/A"}, {pays || "N/A"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-slate-200">{dos.email}</div>
                            <div className="text-slate-500 text-[11px]">{dos.telephone}</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-emerald-400">
                            {Number(montant).toLocaleString("fr-FR")} {dos.devise}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statut === "ENVOYE"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                }`}
                            >
                              {statut === "ENVOYE" ? "✓ ENVOYÉ" : "EN ATTENTE"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {dateEnvoi
                              ? new Date(dateEnvoi).toLocaleString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                              : "-"}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setFormData({
                                  id: dos.id,
                                  dossierReference: ref,
                                  registrationId: dos.registrationId || dos.registration_id,
                                  nom: dos.nom,
                                  prenom: dos.prenom,
                                  dateNaissance: dos.dateNaissance || dos.date_naissance,
                                  lieuNaissance: dos.lieuNaissance || dos.lieu_naissance,
                                  paysResidence: pays,
                                  villeResidence: ville,
                                  nationalite: dos.nationalite,
                                  profession: dos.profession,
                                  situationMatrimoniale:
                                    dos.situationMatrimoniale || dos.situation_matrimoniale,
                                  nombreEnfants: dos.nombreEnfants || dos.nombre_enfants,
                                  telephone: dos.telephone,
                                  email: dos.email,
                                  adresseResidence:
                                    dos.adresseResidence || dos.adresse_residence,
                                  consulatDestinataire:
                                    dos.consulatDestinataire || dos.consulat_destinataire,
                                  consulatVille: dos.consulatVille || dos.consulat_ville,
                                  objetDemande: dos.objetDemande || dos.objet_demande,
                                  motifDemande: dos.motifDemande || dos.motif_demande,
                                  montantFrais: montant,
                                  devise: dos.devise,
                                  lienPaiement: dos.lienPaiement || dos.lien_paiement,
                                  statutEmail: statut,
                                });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className="text-blue-400 hover:text-blue-300 font-medium text-xs underline"
                            >
                              Charger
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
