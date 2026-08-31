import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Fiche d'Inscription | Cœur Uni - Agence Matrimoniale de Prestige",
  description:
    "Remplissez votre fiche d'inscription officielle auprès de l'Agence Matrimoniale Cœur Uni. Rencontrez l'homme ou la femme de votre vie grâce à nos profils vérifiés et un accompagnement sur-mesure.",
  keywords: [
    "Inscription Cœur Uni",
    "Fiche d'inscription matrimoniale",
    "Rencontres sérieuses",
    "Agence matrimoniale Afrique",
    "Mariage et amour véritable",
    "Âme sœur",
    "Rencontre de prestige",
  ],
  openGraph: {
    title: "Rejoignez Cœur Uni | Fiche d'Inscription Officielle",
    description:
      "Parce que chaque cœur mérite de rencontrer son âme sœur. Remplissez votre fiche d'inscription en ligne et laissez notre comité d'accompagnement vous guider vers le grand amour.",
    url: "https://coeur-uni.vercel.app/register",
    siteName: "Cœur Uni",
    images: [
      {
        url: "/logo-og.jpg",
        width: 1200,
        height: 630,
        alt: "Agence Matrimoniale Cœur Uni - Inscription",
      },
      {
        url: "/logo-wa.jpg",
        width: 400,
        height: 400,
        alt: "Logo Cœur Uni",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rejoignez Cœur Uni | Fiche d'Inscription Officielle",
    description:
      "Remplissez votre fiche d'inscription en ligne et rencontrez l'homme ou la femme de votre vie avec Cœur Uni.",
    images: ["/logo-og.jpg"],
  },
};

export default function RegisterPage() {
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

        <Link
          href="/"
          className="rounded-full border border-[#8b4f3e] bg-white/80 px-4 py-2 text-xs font-semibold text-[#4f2b20] shadow-sm backdrop-blur-sm transition hover:bg-[#fff2e5]"
        >
          ← Retour à l'accueil
        </Link>
      </header>

      {/* Main Registration Form */}
      <RegisterForm />

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-[#8b4f3e] pb-6 border-t border-[#d8b095]/40 pt-6">
        <p className="font-semibold text-[#a92d27]">
          © {new Date().getFullYear()} Agence Matrimoniale Cœurs Unis. Tous droits réservés.
        </p>
        <p className="mt-1 opacity-80">
          Vos informations sont traitées avec la plus grande discrétion et protégées par notre engagement de confidentialité.
        </p>
      </footer>
    </main>
  );
}
