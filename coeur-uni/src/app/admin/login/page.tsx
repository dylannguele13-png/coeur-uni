"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { ShieldCheck, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Vérifier si un paramètre d'erreur est présent dans l'URL
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "unauthorized") {
      setError("Accès refusé. Seuls les administrateurs enregistrés peuvent accéder à cette section.");
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirection vers le tableau de bord
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl") || "/admin/dossiers";
        window.location.href = callbackUrl;
      } else {
        setError(data.error || "Échec de l'authentification.");
      }
    } catch (err: any) {
      setError(err?.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const initGoogleButton = () => {
    if (typeof window !== "undefined" && (window as any).google) {
      const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        "574016516249-be9dcljs5j3i17o3ffa8biqmqnhc2mn0.apps.googleusercontent.com";

      (window as any).google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      const btnContainer = document.getElementById("google-signin-btn");
      if (btnContainer) {
        (window as any).google.accounts.id.renderButton(btnContainer, {
          theme: "filled_blue",
          size: "large",
          shape: "pill",
          text: "signin_with",
          locale: "fr",
          width: 280,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleButton}
      />

      {/* Arrière-plan stylisé */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.25),rgba(255,255,255,0))] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Carte de connexion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center">
          {/* Logo Cabinet BK */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-white p-2 shadow-xl border border-slate-700/50">
              <Image
                src="/logo-cabinet-bk.jpeg"
                alt="Logo Cabinet BK à l'Immigration Française"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            CABINET BK IMMIGRATION
          </h1>
          <p className="text-xs text-blue-400 font-medium uppercase tracking-widest mb-6">
            Espace Administrateur Sécurisé
          </p>

          {/* Bannière d'erreur éventuelle */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs text-left flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Bouton de connexion Google */}
          <div className="flex flex-col items-center justify-center my-6 space-y-3">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-blue-400 font-medium py-3">
                <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                Vérification des accès en cours...
              </div>
            ) : (
              <div id="google-signin-btn" className="min-h-[44px] flex justify-center" />
            )}
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Cabinet BK Immigration & Mobilité Internationale • © 2026
        </div>
      </div>
    </div>
  );
}
