"use client";

import { useEffect, useRef, useState } from "react";

const PROFILES = [
  {
    name: "Pierre Castaud",
    country: "France",
    city: "Paris",
    age: "52 ans",
    profession: "Chirurgien neurologue",
    matrimonial: "Divorcé avec une fille de 09 ans",
    image: "/pierre-castaud.jpg",
  },
  {
    name: "Jules Amiens",
    country: "France",
    city: "Lyon",
    age: "49 ans",
    profession: "Avocat",
    matrimonial: "Célibataire",
    image: "/jules-amiens.jpg",
  },
  {
    name: "Duclair Félix",
    country: "Belgique",
    city: "Liège",
    age: "58 ans",
    profession: "PDG d'agence de construction",
    matrimonial: "Célibataire avec 2 enfants",
    image: "/duclair-felix.jpg",
  },
  {
    name: "Steve Jobs",
    country: "USA",
    city: "New York",
    age: "50 ans",
    profession: "Greffier",
    matrimonial: "Célibataire",
    image: "/steve-jobs.jpg",
  },
  {
    name: "Christophe Dubois",
    country: "Belgique",
    city: "Bruxelles",
    age: "51 ans",
    profession: "Douanier",
    matrimonial: "",
    image: "/christophe-dubois.jpg",
  },
  {
    name: "Jules Verne",
    country: "France",
    city: "Toulouse",
    age: "48 ans",
    profession: "Pilote",
    matrimonial: "",
    image: "/jules-verne.jpg",
  },
  {
    name: "Stéphane Pierre",
    country: "France",
    city: "Saint Etienne",
    age: "52 ans",
    profession: "Policier",
    matrimonial: "",
    image: "/stephane-pierre.jpg",
  },
  {
    name: "Clément Antoine",
    country: "France",
    city: "Lyon",
    age: "52 ans",
    profession: "Ingénieur civil",
    matrimonial: "Célibataire",
    image: "/clement-antoine.jpg",
  },
  {
    name: "Damien Jules",
    country: "France",
    city: "Saint Etienne",
    age: "53 ans",
    profession: "Ingénieur en génie industriel",
    matrimonial: "Célibataire avec une fille",
    image: "/damien-jules.jpg",
  },
  {
    name: "Sylvain Ekotto",
    country: "USA",
    city: "Chicago (Illinois)",
    age: "52 ans",
    profession: "Responsable d'entreprises",
    matrimonial: "Célibataire avec une fille",
    image: "/sylvain-ekotto.jpg",
  },
  {
    name: "Christophe Delahaye",
    country: "France",
    city: "Nantes",
    age: "58 ans",
    profession: "PDG de boulangeries",
    matrimonial: "",
    image: "/christophe-delahaye.jpg",
  },
  {
    name: "Steven Spielberg",
    country: "USA",
    city: "Chicago (Origine: France/USA)",
    age: "54 ans",
    profession: "Comptable",
    matrimonial: "",
    image: "/steven-spielberg.jpg",
  },
  {
    name: "Mark Ferran",
    country: "Suisse",
    city: "Genève (Nationalité: Espagnole)",
    age: "48 ans",
    profession: "Douanier",
    matrimonial: "Un enfant",
    image: "/mark-ferran.jpg",
  },
  {
    name: "John Karl",
    country: "USA",
    city: "New York",
    age: "48 ans",
    profession: "Policier",
    matrimonial: "Sans enfants",
    image: "/john-karl.jpg",
  },
];

const TESTIMONIES_DATA = [
  {
    id: 1,
    title: "Le début de notre bonheur",
    couple: "Marie & Pierre-Henri",
    location: "Paris, France",
    videoUrl: "/videos/temoignage-1.mp4",
    description: "Une rencontre évidente dès le premier appel WhatsApp. Notre mariage a célébré l'union de nos deux familles.",
    likes: 124,
    hearts: 89,
    comments: [
      { name: "Sylvie", avatar: "S", text: "Félicitations à vous deux !", date: "Il y a 3 jours" },
      { name: "Marc", avatar: "M", text: "Quelle magnifique histoire !", date: "Il y a 1 jour" },
      { name: "Carine", avatar: "C", text: "C'est tellement inspirant.", date: "Il y a 4 heures" }
    ]
  },
  {
    id: 2,
    title: "L'amour n'a pas de frontières",
    couple: "Sandrine & Marc",
    location: "Genève, Suisse",
    videoUrl: "/videos/temoignage-2.mp4",
    description: "Marc a fait le premier pas en m'appelant depuis Genève. L'accompagnement de l'agence a été notre fil conducteur.",
    likes: 95,
    hearts: 64,
    comments: [
      { name: "Alice", avatar: "A", text: "Tellement heureuse pour toi Sandrine !", date: "Il y a 2 jours" },
      { name: "Jules", avatar: "J", text: "Magnifique couple.", date: "Il y a 18 heures" }
    ]
  },
  {
    id: 3,
    title: "Une destinée partagée",
    couple: "Christiane & Sylvain",
    location: "Bruxelles, Belgique",
    videoUrl: "/videos/temoignage-3.mp4",
    description: "Nous partageons les mêmes valeurs culturelles. Cœur Uni a su lire dans nos âmes pour nous réunir.",
    likes: 78,
    hearts: 53,
    comments: [
      { name: "Paul", avatar: "P", text: "Que Dieu bénisse votre union !", date: "Il y a 5 jours" },
      { name: "Esther", avatar: "E", text: "Très beau couple.", date: "Il y a 2 jours" }
    ]
  },
  {
    id: 4,
    title: "Le grand amour à 50 ans",
    couple: "Jacqueline & Damien",
    location: "Lyon, France",
    videoUrl: "/videos/temoignage-4.mp4",
    description: "Je ne pensais plus refaire ma vie. Damien a su me redonner le sourire. Merci infiniment à l'équipe.",
    likes: 142,
    hearts: 110,
    comments: [
      { name: "Hélène", avatar: "H", text: "Il n'est jamais trop tard pour aimer !", date: "Il y a 1 semaine" },
      { name: "Antoine", avatar: "A", text: "Un grand merci à l'agence.", date: "Il y a 3 jours" }
    ]
  },
  {
    id: 5,
    title: "Rencontre sincère",
    couple: "Florence & Christophe",
    location: "Nantes, France",
    videoUrl: "/videos/temoignage-5.mp4",
    description: "Pas de faux-semblants, que de la sincérité. Nous construisons aujourd'hui notre avenir ensemble avec beaucoup de sérénité.",
    likes: 112,
    hearts: 76,
    comments: [
      { name: "Thomas", avatar: "T", text: "C'est beau la sincérité.", date: "Il y a 4 jours" },
      { name: "Laure", avatar: "L", text: "Longue vie à votre amour.", date: "Il y a 1 jour" }
    ]
  },
  {
    id: 6,
    title: "Une évidence immédiate",
    couple: "Nathalie & Steven",
    location: "Chicago, USA",
    videoUrl: "/videos/temoignage-6.mp4",
    description: "La distance entre la France et les USA s'est effacée face à notre complicité immédiate. Une nouvelle vie commence.",
    likes: 167,
    hearts: 135,
    comments: [
      { name: "Mathilde", avatar: "M", text: "Sublime !", date: "Il y a 2 jours" },
      { name: "Yann", avatar: "Y", text: "Le grand amour traverse les océans.", date: "Il y a 12 heures" }
    ]
  },
  {
    id: 7,
    title: "Des valeurs communes",
    couple: "Sophie & Jules",
    location: "Toulouse, France",
    videoUrl: "/videos/temoignage-7.mp4",
    description: "Partager la même vision de la famille et du respect était essentiel pour moi. Jules est l'homme que j'attendais.",
    likes: 88,
    hearts: 60,
    comments: [
      { name: "Chantal", avatar: "C", text: "Le respect mutuel est la base.", date: "Il y a 6 jours" },
      { name: "Gilles", avatar: "G", text: "Félicitations !", date: "Il y a 3 jours" }
    ]
  },
  {
    id: 8,
    title: "Une merveilleuse complicité",
    couple: "Audrey & Duclair",
    location: "Liège, Belgique",
    videoUrl: "/videos/temoignage-8.mp4",
    description: "Chaque moment passé ensemble confirme que nous étions faits l'un pour l'autre. Une rencontre extraordinaire.",
    likes: 104,
    hearts: 82,
    comments: [
      { name: "Benoît", avatar: "B", text: "Que du bonheur !", date: "Il y a 3 jours" },
      { name: "Valérie", avatar: "V", text: "Magnifique complicité.", date: "Il y a 1 jour" }
    ]
  },
  {
    id: 9,
    title: "Le choix du cœur",
    couple: "Amina & John",
    location: "New York, USA",
    videoUrl: "/videos/temoignage-9.mp4",
    description: "John a su comprendre ma culture et mes racines. Cœur Uni a fait un travail d'accompagnement formidable.",
    likes: 189,
    hearts: 156,
    comments: [
      { name: "Fatim", avatar: "F", text: "L'amour multiculturel, c'est magnifique.", date: "Il y a 5 jours" },
      { name: "David", avatar: "D", text: "Félicitations John.", date: "Il y a 2 jours" }
    ]
  }
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [testimonies, setTestimonies] = useState(TESTIMONIES_DATA);
  const [selectedTestimonyId, setSelectedTestimonyId] = useState<number | null>(null);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || selectedTestimonyId === null) return;
    const author = newCommentName.trim() || "Visiteur anonyme";
    const newComment = {
      name: author,
      avatar: author.charAt(0).toUpperCase(),
      text: newCommentText.trim(),
      date: "À l'instant"
    };

    setTestimonies((prev) =>
      prev.map((t) => {
        if (t.id === selectedTestimonyId) {
          return {
            ...t,
            comments: [...t.comments, newComment]
          };
        }
        return t;
      })
    );
    setNewCommentText("");
    setNewCommentName("");
  };

  const handleLike = (id: number) => {
    setTestimonies((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            likes: t.likes + 1,
            hearts: t.hearts + 1
          };
        }
        return t;
      })
    );
    // Trigger floating heart
    const idHeart = Date.now() + Math.random();
    const x = Math.random() * 80 - 40;
    setFloatingHearts((prev) => [...prev, { id: idHeart, x }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== idHeart));
    }, 2000);
  };

  const selectedTestimony = testimonies.find((t) => t.id === selectedTestimonyId);

  const scrollPrev = () => {
    const container = containerRef.current;
    if (!container) return;
    const article = container.querySelector("article");
    const step = article ? article.clientWidth + 20 : 340;

    if (container.scrollLeft <= 10) {
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    const container = containerRef.current;
    if (!container) return;
    const article = container.querySelector("article");
    const step = article ? article.clientWidth + 20 : 340;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft >= maxScrollLeft - 10) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isHovered = false;

    const handleMouseEnter = () => {
      isHovered = true;
    };
    const handleMouseLeave = () => {
      isHovered = false;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("touchstart", handleMouseEnter);
    container.addEventListener("touchend", handleMouseLeave);

    const intervalId = setInterval(() => {
      if (isHovered) return;

      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScrollLeft = scrollWidth - clientWidth;

      if (container.scrollLeft >= maxScrollLeft - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const article = container.querySelector("article");
        const step = article ? article.clientWidth + 20 : 340;
        container.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 4000);

    return () => {
      clearInterval(intervalId);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("touchstart", handleMouseEnter);
      container.removeEventListener("touchend", handleMouseLeave);
    };
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10 xl:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Cœur Uni",
            "url": "https://coeur-uni.com",
            "logo": "https://coeur-uni.com/logo.jpg",
            "description": "Agence matrimoniale de prestige qui unit l’amour, le respect et la culture africaine pour des rencontres authentiques et durables.",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "url": "https://wa.me/237683472130"
            }
          })
        }}
      />
      <section className="relative overflow-hidden rounded-[1.5rem] border border-[#d8b095] bg-white/95 px-4 py-6 shadow-[0_20px_60px_rgba(55,18,10,0.14)] sm:rounded-[2rem] sm:px-8 sm:py-8 lg:rounded-[2.5rem] lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#a92d27]/15 blur-3xl sm:-right-12 sm:top-10 sm:h-36 sm:w-36 lg:h-44 lg:w-44" />

        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <section className="space-y-6">
            <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full border border-[#d8b095] bg-[#fff2e5] p-4 shadow-sm shadow-[#8b4f3e]/10 sm:mx-0 sm:h-28 sm:w-28">
              <img src="/logo.jpg" alt="Logo Cœur Uni" className="h-full w-full object-contain" />
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#d8b095] bg-[#fff2e5] px-3 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-[#8b4f3e] shadow-sm shadow-[#8b4f3e]/10 sm:px-4 sm:text-xs">
              Agence matrimoniale
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.32em] text-[#8b4f3e]">Cœur Uni</p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[#3f1f0f] sm:text-5xl lg:text-6xl">
                Deux cœurs,
                <br /> une destinée.
              </h1>
            </div>

            <p className="max-w-2xl text-base leading-7 text-[#5e4033] sm:text-lg sm:leading-8">
              Une agence qui unit l’amour, le respect et la culture africaine pour créer des rencontres authentiques et durables.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#a92d27] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#a92d27]/20 transition hover:bg-[#8d2421] sm:w-auto"
              >
                Contactez-nous
              </a>
              <a
                href="#services"
                className="inline-flex w-full items-center justify-center rounded-full border border-[#8b4f3e] bg-white px-6 py-3 text-sm font-semibold text-[#4f2b20] transition hover:bg-[#fff4eb] sm:w-auto"
              >
                Nos services
              </a>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <article className="rounded-[1.25rem] border border-[#d8b095] bg-[#fff4eb] p-4 shadow-sm shadow-[#4f2b20]/5 sm:p-5 lg:p-6">
                <h2 className="text-lg font-semibold text-[#3f1f0f]">Rencontres choisies</h2>
                <p className="mt-3 text-sm leading-6 text-[#5e4033]">
                  Des profils sélectionnés selon vos valeurs, votre histoire et votre vision de l’avenir.
                </p>
              </article>
              <article className="rounded-[1.25rem] border border-[#d8b095] bg-[#fff4eb] p-4 shadow-sm shadow-[#4f2b20]/5 sm:p-5 lg:p-6">
                <h2 className="text-lg font-semibold text-[#3f1f0f]">Accompagnement humain</h2>
                <p className="mt-3 text-sm leading-6 text-[#5e4033]">
                  Un suivi personnalisé et discret pour chaque étape de votre rencontre.
                </p>
              </article>
              <article className="rounded-[1.25rem] border border-[#d8b095] bg-[#fff4eb] p-4 shadow-sm shadow-[#4f2b20]/5 sm:p-5 lg:p-6">
                <h2 className="text-lg font-semibold text-[#3f1f0f]">Culture & élégance</h2>
                <p className="mt-3 text-sm leading-6 text-[#5e4033]">
                  Une esthétique chaleureuse inspirée par l’Afrique pour valoriser chaque couple.
                </p>
              </article>
            </div>
          </section>

          <section className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[28rem] overflow-hidden rounded-[1.5rem] border border-[#d8b095] bg-[#fff4eb] p-4 shadow-[0_20px_60px_rgba(55,18,10,0.14)] sm:p-6 lg:rounded-[2.5rem] lg:p-8">
              <div className="absolute left-3 top-3 h-16 w-16 rounded-full bg-[#a92d27]/15 sm:h-20 sm:w-20" />
              <div className="absolute bottom-4 right-4 h-16 w-16 rounded-full bg-[#8b4f3e]/10 sm:h-20 sm:w-20" />
              <div className="flex min-h-[22rem] flex-col items-center justify-center gap-5 rounded-[1.25rem] border border-[#f4d6c6] bg-[#fff7f1] p-5 text-center sm:min-h-[24rem] sm:p-7 lg:min-h-[28rem]">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#a92d27]/15 text-4xl font-semibold text-[#a92d27] sm:h-24 sm:w-24">
                  ❤
                </div>
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#8b4f3e]">Identité visuelle</p>
                  <p className="text-base leading-7 text-[#5e4033]">
                    Un design harmonieux inspiré du logo, des motifs africains et des couleurs chaudes.
                  </p>
                </div>
                <div className="grid w-full gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4f2b20] sm:grid-cols-2">
                  <span className="rounded-full border border-[#a92d27] bg-white/90 px-3 py-2">Respect</span>
                  <span className="rounded-full border border-[#8b4f3e] bg-white/90 px-3 py-2">Destination</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section id="services" className="mt-10 grid gap-6 sm:mt-14 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="rounded-[1.5rem] border border-[#d8b095] bg-[#fff4eb] p-6 shadow-sm shadow-[#4f2b20]/10 sm:p-8 lg:rounded-[2rem]">
          <p className="text-sm uppercase tracking-[0.32em] text-[#8b4f3e]">Notre approche</p>
          <h2 className="mt-4 text-2xl font-semibold text-[#3f1f0f] sm:text-3xl">
            Un accompagnement unique pour trouver l’âme sœur.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5e4033]">
            Nous combinons l’écoute, l’expertise relationnelle et une sélection soignée des profils pour créer des rencontres sincères et durables.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.25rem] border border-[#d8b095] bg-white p-5 shadow-sm shadow-[#4f2b20]/5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b4f3e]">Authenticité</p>
            <p className="mt-3 text-sm leading-6 text-[#5e4033]">Des profils vérifiés et choisis avec soin pour des rencontres de qualité.</p>
          </div>
          <div className="rounded-[1.25rem] border border-[#d8b095] bg-white p-5 shadow-sm shadow-[#4f2b20]/5 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8b4f3e]">Discrétion</p>
            <p className="mt-3 text-sm leading-6 text-[#5e4033]">Un suivi personnalisé et confidentiel à chaque étape.</p>
          </div>
        </div>
      </section>

      <section id="profiles" className="mt-10 rounded-[1.5rem] border border-[#d8b095] bg-[#fff2e5] p-6 shadow-sm shadow-[#4f2b20]/10 sm:p-8 lg:p-10">
        <div className="max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#8b4f3e]">Profils sélectionnés</p>
              <h2 className="mt-4 text-2xl font-semibold text-[#3f1f0f] sm:text-3xl">
                Hommes sérieux disponibles maintenant.
              </h2>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <p className="max-w-2xl text-sm leading-6 text-[#5e4033] sm:text-base sm:text-right">
                Découvrez nos profils haut de gamme, avec un contact direct via WhatsApp pour chaque profil.
              </p>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#a92d27]/10 px-3 py-1 text-xs font-semibold text-[#a92d27] animate-pulse">
                <span>◀</span> Glissez ou utilisez les boutons pour défiler <span>▶</span>
              </span>
            </div>
          </div>

          <div className="relative mt-8 group">
            {/* Bouton Précédent */}
            <button
              onClick={scrollPrev}
              className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#d8b095] bg-white p-3 text-sm font-bold text-[#8b4f3e] shadow-md transition hover:bg-[#fff4eb] hover:scale-105 active:scale-95 md:group-hover:flex focus:outline-none"
              aria-label="Profil précédent"
            >
              ◀
            </button>

            {/* Conteneur défilant */}
            <div
              ref={containerRef}
              className="flex gap-5 snap-x snap-mandatory overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {PROFILES.map((profile, index) => (
                <article
                  key={index}
                  className="snap-start min-w-[20rem] max-w-[20rem] rounded-[1.75rem] border border-[#d8b095] bg-white p-5 shadow-sm shadow-[#4f2b20]/5 sm:min-w-[22rem]"
                >
                  <div className="overflow-hidden rounded-[1.5rem] bg-[#fff4eb]">
                    <img src={profile.image} alt={profile.name} className="h-52 w-full object-cover" />
                  </div>
                  <div className="mt-5 space-y-3">
                    <h3 className="text-xl font-semibold text-[#3f1f0f]">{profile.name}</h3>
                    <p className="text-sm text-[#5e4033]">
                      {profile.country} · {profile.city}
                    </p>
                    <ul className="space-y-2 text-sm leading-6 text-[#5e4033]">
                      <li>
                        <strong>Âge :</strong> {profile.age}
                      </li>
                      <li>
                        <strong>Profession :</strong> {profile.profession}
                      </li>
                      {profile.matrimonial && (
                        <li>
                          <strong>Situation :</strong> {profile.matrimonial}
                        </li>
                      )}
                    </ul>
                  </div>
                  <a
                    href="https://wa.me/237683472130"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#a92d27] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#a92d27]/20 transition hover:bg-[#8d2421]"
                  >
                    Voir sur WhatsApp
                  </a>
                </article>
              ))}
            </div>

            {/* Bouton Suivant */}
            <button
              onClick={scrollNext}
              className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#d8b095] bg-white p-3 text-sm font-bold text-[#8b4f3e] shadow-md transition hover:bg-[#fff4eb] hover:scale-105 active:scale-95 md:group-hover:flex focus:outline-none"
              aria-label="Profil suivant"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      {/* SECTION TÉMOIGNAGES VIDÉO */}
      <section id="testimonies" className="mt-10 rounded-[1.5rem] border border-[#d8b095] bg-[#fff2e5]/80 p-6 shadow-sm shadow-[#4f2b20]/10 sm:p-8 lg:p-10">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes floatUp {
            0% {
              transform: translate(0, 0) scale(0.6);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: translate(var(--x), -20px) scale(1.1);
            }
            100% {
              transform: translate(calc(var(--x) * 1.5), -140px) scale(0.8);
              opacity: 0;
            }
          }
          .animate-float-heart {
            animation: floatUp 1.8s ease-out forwards;
          }
        `}} />
        <div>
          <p className="text-sm uppercase tracking-[0.32em] text-[#8b4f3e]">Histoires de destinées</p>
          <h2 className="mt-4 text-2xl font-semibold text-[#3f1f0f] sm:text-3xl">
            Leurs plus belles évidences en vidéo.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5e4033]">
            Découvrez en vidéo les retours sincères et les moments d'émotion de nos couples unis. L'amour authentique raconté par celles et ceux qui l'ont trouvé.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonies.map((testimony) => (
            <article
              key={testimony.id}
              className="rounded-[1.75rem] border border-[#d8b095] bg-white p-5 shadow-sm shadow-[#4f2b20]/5 transition hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Conteneur vidéo miniature */}
                <div className="relative overflow-hidden rounded-[1.5rem] bg-black aspect-video group cursor-pointer" onClick={() => setSelectedTestimonyId(testimony.id)}>
                  <video
                    src={testimony.videoUrl}
                    preload="none"
                    className="h-full w-full object-cover opacity-80"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/45">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#a92d27] shadow-lg transition group-hover:scale-110">
                      ▶
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold text-white tracking-wide">
                    Témoignage
                  </span>
                </div>

                {/* Titre & Couple */}
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#a92d27]/10 px-3 py-1 text-xs font-semibold text-[#a92d27]">
                      {testimony.location}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#8b4f3e]">
                      <span>❤</span> {testimony.likes}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#3f1f0f] line-clamp-1">{testimony.title}</h3>
                  <p className="text-sm font-semibold text-[#8b4f3e]">{testimony.couple}</p>
                  <p className="text-sm leading-6 text-[#5e4033] line-clamp-2">
                    {testimony.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTestimonyId(testimony.id)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#8b4f3e] bg-white px-4 py-2.5 text-sm font-semibold text-[#4f2b20] transition hover:bg-[#fff4eb] cursor-pointer font-sans"
              >
                Voir et réagir
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* MODAL INTERACTIF POUR LES TÉMOIGNAGES */}
      {selectedTestimony && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-[#fffcf9] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:grid md:grid-cols-2 border border-[#d8b095]">
            
            {/* Colonne Gauche : Vidéo */}
            <div className="bg-black relative flex items-center justify-center aspect-video md:aspect-auto md:h-full">
              <video
                src={selectedTestimony.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
              <button 
                onClick={() => setSelectedTestimonyId(null)}
                className="absolute top-4 left-4 md:hidden w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Colonne Droite : Infos & Commentaires */}
            <div className="p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none md:h-[80vh]">
              {/* Header du témoignage */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="rounded-full bg-[#a92d27]/10 px-3 py-1 text-xs font-semibold text-[#a92d27]">
                      {selectedTestimony.location}
                    </span>
                    <h3 className="text-xl font-bold text-[#3f1f0f] mt-2 font-serif">{selectedTestimony.title}</h3>
                    <p className="text-sm font-semibold text-[#8b4f3e]">{selectedTestimony.couple}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTestimonyId(null)}
                    className="hidden md:flex p-2 hover:bg-[#fff0e5] rounded-full transition text-[#8b4f3e] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-[#5e4033] mt-3 bg-[#fff7f1] border border-[#f4d6c6] p-3 rounded-xl">
                  {selectedTestimony.description}
                </p>
              </div>

              {/* Zone commentaires et réactions */}
              <div className="mt-4 flex-grow flex flex-col justify-end">
                <div className="flex justify-between items-center pb-2 border-b border-[#f4d6c6] mb-3">
                  <span className="text-xs font-semibold text-[#8b4f3e] uppercase tracking-wider">
                    Commentaires ({selectedTestimony.comments.length})
                  </span>
                  
                  {/* Bouton Like avec animation de cœurs */}
                  <div className="relative">
                    <button
                      onClick={() => handleLike(selectedTestimony.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#a92d27] px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-[#8d2421] transition active:scale-95 cursor-pointer font-sans"
                    >
                      <span>❤</span> {selectedTestimony.likes} J'aime
                    </button>
                    {/* Cœurs flottants */}
                    {floatingHearts.map((heart) => (
                      <span
                        key={heart.id}
                        className="absolute bottom-6 left-1/2 text-lg text-[#a92d27] pointer-events-none animate-float-heart"
                        style={{
                          '--x': `${heart.x}px`,
                        } as React.CSSProperties}
                      >
                        ❤
                      </span>
                    ))}
                  </div>
                </div>

                {/* Liste des commentaires */}
                <div className="flex-1 overflow-y-auto space-y-3 max-h-[160px] md:max-h-[260px] pr-1">
                  {selectedTestimony.comments.map((c, i) => (
                    <div key={i} className="flex gap-2.5 items-start text-xs">
                      <div className="w-7 h-7 rounded-full bg-[#a92d27]/15 flex items-center justify-center text-[#a92d27] font-bold shrink-0 font-sans">
                        {c.avatar}
                      </div>
                      <div className="flex-1 bg-[#fffaf5] rounded-xl border border-[#f4d6c6] p-2.5">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[#3f1f0f]">{c.name}</span>
                          <span className="text-[9px] text-[#8b4f3e]">{c.date}</span>
                        </div>
                        <p className="text-[#5e4033] leading-relaxed font-sans">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulaire d'ajout de commentaire */}
                <form onSubmit={handleAddComment} className="mt-3 pt-3 border-t border-[#f4d6c6] space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Votre nom"
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      className="w-1/3 rounded-full border border-[#d8b095] bg-white px-3 py-1.5 text-xs text-[#3f1f0f] focus:outline-none focus:ring-1 focus:ring-[#a92d27] font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Ajouter un mot chaleureux..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      required
                      className="w-2/3 rounded-full border border-[#d8b095] bg-white px-4 py-1.5 text-xs text-[#3f1f0f] focus:outline-none focus:ring-1 focus:ring-[#a92d27] font-sans"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#a92d27] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#8d2421] cursor-pointer font-sans"
                    >
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      <section
        id="contact"
        className="mt-10 rounded-[1.5rem] border border-[#d8b095] bg-[#fff2e5]/95 p-6 text-center shadow-sm shadow-[#4f2b20]/10 sm:mt-14 sm:p-8 lg:mt-16 lg:rounded-[2rem] lg:p-10"
      >
        <p className="text-sm uppercase tracking-[0.32em] text-[#8b4f3e]">Prêt pour votre destin ?</p>
        <h2 className="mt-4 text-2xl font-semibold text-[#3f1f0f] sm:text-3xl">
          Contactez-nous et commencez votre histoire.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#5e4033]">
          Notre équipe est à votre écoute pour donner vie à votre rencontre et accompagner chaque moment avec bienveillance.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="https://wa.me/237683472130"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#a92d27] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#a92d27]/20 transition hover:bg-[#8d2421] sm:w-auto"
          >
            Écrire à l’agence
          </a>
          <a
            href="https://wa.me/237683472130"
            className="inline-flex w-full items-center justify-center rounded-full border border-[#8b4f3e] bg-white px-6 py-3 text-sm font-semibold text-[#4f2b20] transition hover:bg-[#fff4eb] sm:w-auto"
          >
            Appelez-nous
          </a>
        </div>
      </section>
    </main>
  );
}
