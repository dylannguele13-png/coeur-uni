export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 xl:px-10 xl:py-12">
      <section className="relative overflow-hidden rounded-[1.5rem] border border-[#d8b095] bg-white/95 px-4 py-6 shadow-[0_20px_60px_rgba(55,18,10,0.14)] sm:rounded-[2rem] sm:px-8 sm:py-8 lg:rounded-[2.5rem] lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#a92d27]/15 blur-3xl sm:-right-12 sm:top-10 sm:h-36 sm:w-36 lg:h-44 lg:w-44" />

        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <section className="space-y-6">
            <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full border border-[#d8b095] bg-[#fff2e5] p-4 shadow-sm shadow-[#8b4f3e]/10 sm:mx-0 sm:h-28 sm:w-28">
              <img src="/logo.svg" alt="Logo Cœur Uni" className="h-full w-full object-contain" />
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
            <p className="max-w-2xl text-sm leading-6 text-[#5e4033] sm:text-base">
              Découvrez trois profils hauts de gamme, avec un contact direct via WhatsApp pour chaque profil.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto pb-4">
            <div className="flex gap-5 snap-x snap-mandatory">
              <article className="snap-start min-w-[20rem] max-w-[20rem] rounded-[1.75rem] border border-[#d8b095] bg-white p-5 shadow-sm shadow-[#4f2b20]/5 sm:min-w-[22rem]">
                <div className="overflow-hidden rounded-[1.5rem] bg-[#fff4eb]">
                  <img src="/duclair-felix.jpg" alt="Duclair Félix" className="h-52 w-full object-cover" />
                </div>
                <div className="mt-5 space-y-3">
                  <h3 className="text-xl font-semibold text-[#3f1f0f]">Duclair Félix</h3>
                  <p className="text-sm text-[#5e4033]">Belgique · Liège</p>
                  <ul className="space-y-2 text-sm leading-6 text-[#5e4033]">
                    <li><strong>Âge :</strong> 58 ans</li>
                    <li><strong>Profession :</strong> PDG d’agence de construction</li>
                    <li><strong>Situation :</strong> Célibataire avec 2 enfants</li>
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

              <article className="snap-start min-w-[20rem] max-w-[20rem] rounded-[1.75rem] border border-[#d8b095] bg-white p-5 shadow-sm shadow-[#4f2b20]/5 sm:min-w-[22rem]">
                <div className="overflow-hidden rounded-[1.5rem] bg-[#fff4eb]">
                  <img src="/jules-amiens.jpg" alt="Jules Amiens" className="h-52 w-full object-cover" />
                </div>
                <div className="mt-5 space-y-3">
                  <h3 className="text-xl font-semibold text-[#3f1f0f]">Jules Amiens</h3>
                  <p className="text-sm text-[#5e4033]">France · Lyon</p>
                  <ul className="space-y-2 text-sm leading-6 text-[#5e4033]">
                    <li><strong>Âge :</strong> 49 ans</li>
                    <li><strong>Profession :</strong> Avocat</li>
                    <li><strong>Situation :</strong> Célibataire</li>
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

              <article className="snap-start min-w-[20rem] max-w-[20rem] rounded-[1.75rem] border border-[#d8b095] bg-white p-5 shadow-sm shadow-[#4f2b20]/5 sm:min-w-[22rem]">
                <div className="overflow-hidden rounded-[1.5rem] bg-[#fff4eb]">
                  <img src="/pierre-castaud.jpg" alt="Pierre Castaud" className="h-52 w-full object-cover" />
                </div>
                <div className="mt-5 space-y-3">
                  <h3 className="text-xl font-semibold text-[#3f1f0f]">Pierre Castaud</h3>
                  <p className="text-sm text-[#5e4033]">France · Paris</p>
                  <ul className="space-y-2 text-sm leading-6 text-[#5e4033]">
                    <li><strong>Âge :</strong> 52 ans</li>
                    <li><strong>Profession :</strong> Chirurgien neurologue</li>
                    <li><strong>Situation :</strong> Divorcé avec une fille de 09 ans</li>
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
            </div>
          </div>
        </div>
      </section>

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
