import type { Metadata } from "next";
import Link from "next/link";
import FinalisationForm from "./FinalisationForm";

export const metadata: Metadata = {
  title: "Finalisation de Mise en Contact | Cœur Uni - Agence Matrimoniale de Prestige",
  description:
    "Effectuez le bilan de vos échanges et préparez les prochaines étapes avec votre correspondant(e). Vos réponses permettent à l'Agence Matrimoniale Cœur Uni d'améliorer continuellement la qualité de ses services et de faciliter votre future rencontre.",
  keywords: [
    "Finalisation mise en relation",
    "Suivi correspondants",
    "Bilan de rencontre Cœur Uni",
    "Rencontre sérieuse",
    "Agence matrimoniale de prestige",
    "Voyage de rencontre amoureuse",
    "Mariage et concrétisation",
  ],
  openGraph: {
    title: "Finalisation de Mise en Relation | Cœur Uni",
    description:
      "Partagez le bilan de vos échanges avec votre correspondant(e). L'agence Cœur Uni vous accompagne pas à pas vers la concrétisation de votre histoire d'amour.",
    url: "https://coeur-uni.vercel.app/finalisation-contact",
    siteName: "Cœur Uni",
    images: [
      {
        url: "/og-finalisation.jpg",
        width: 1200,
        height: 675,
        type: "image/jpeg",
        alt: "Cœur Uni - Finalisation de Mise en Relation",
      },
      {
        url: "/logo-wa.jpg",
        width: 400,
        height: 400,
        type: "image/jpeg",
        alt: "Logo Cœur Uni",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finalisation de Mise en Relation | Cœur Uni",
    description:
      "Bilan de vos échanges et préparation de votre rencontre amoureuse avec l'Agence Matrimoniale Cœur Uni.",
    images: ["/og-finalisation.jpg"],
  },
};

export default function FinalisationPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff8f2_0%,_#f1d8bb_40%,_#e8c0a5_100%)] text-[#3f1f0f] py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Bar Navigation */}
      <header className="mx-auto max-w-4xl mb-8 flex items-center justify-between border-b border-[#d8b095]/60 pb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.jpg"
            alt="Cœur Uni Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-[#d8b095] shadow-sm object-cover transition group-hover:scale-105"
          />
          <div>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#a92d27] block">
              Cœur Uni
            </span>
            <span className="text-[10px] sm:text-xs text-[#8b4f3e] tracking-wider uppercase block">
              Agence Matrimoniale de Prestige
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="hidden sm:inline-block text-xs font-semibold text-[#8b4f3e] hover:text-[#a92d27] transition"
          >
            Fiche d'inscription
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[#8b4f3e] bg-white/80 px-4 py-2 text-xs font-semibold text-[#4f2b20] shadow-sm backdrop-blur-sm transition hover:bg-[#fff2e5]"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      {/* Main Finalisation Form */}
      <FinalisationForm />

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-[#8b4f3e] pb-6 border-t border-[#d8b095]/40 pt-6">
        <p className="font-semibold text-[#a92d27]">
          © {new Date().getFullYear()} Agence Matrimoniale Cœurs Unis. Tous droits réservés.
        </p>
        <p className="mt-1 opacity-80 max-w-xl mx-auto">
          Les informations communiquées dans ce bilan permettent à l'Agence Cœur Uni d'assurer un suivi sur-mesure et d'améliorer continuellement la qualité de ses services dans la plus absolue confidentialité.
        </p>
      </footer>
    </main>
  );
}
