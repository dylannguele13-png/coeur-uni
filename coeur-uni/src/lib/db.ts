import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://joinvesting_db_user:nG3RMqgXwtnKf9zp5juQiESZB9N6VbJp@dpg-da10ckpt0dsc73ao2190-a.singapore-postgres.render.com/joinvesting_db?sslmode=require&schema=coeur_uni&connect_timeout=60";

// Utilisation d'un singleton pour le Pool afin d'éviter la multiplication des connexions sous Next.js (Hot Reload)
declare global {
  // eslint-disable-next-line no-var
  var __coeurUniPgPool: Pool | undefined;
}

export const pool =
  global.__coeurUniPgPool ||
  new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env.NODE_ENV !== "production") {
  global.__coeurUniPgPool = pool;
}

let initialized = false;

/**
 * Initialise automatiquement le schéma 'coeur_uni' et les tables associées si elles n'existent pas.
 */
export async function initDatabase() {
  if (initialized) return;

  const client = await pool.connect();
  try {
    // 1. Créer le schéma dédié si nécessaire
    await client.query(`CREATE SCHEMA IF NOT EXISTS coeur_uni;`);

    // 2. Table des inscriptions matrimoniales (Cœurs Unis)
    await client.query(`
      CREATE TABLE IF NOT EXISTS coeur_uni.registrations (
        id SERIAL PRIMARY KEY,
        registration_number VARCHAR(100) UNIQUE,
        registration_date VARCHAR(50),
        nom VARCHAR(120) NOT NULL,
        prenom VARCHAR(120) NOT NULL,
        photo_profil TEXT,
        date_naissance VARCHAR(50),
        lieu_naissance VARCHAR(120),
        pays_residence VARCHAR(100),
        ville VARCHAR(100),
        nationalite VARCHAR(100),
        profession VARCHAR(150),
        situation_matrimoniale VARCHAR(80),
        nombre_enfants VARCHAR(30),
        telephone VARCHAR(80),
        email VARCHAR(180),
        adresse_residence TEXT,
        sexe_recherche VARCHAR(50),
        tranche_age VARCHAR(50),
        pays_region_souhaite VARCHAR(150),
        situation_matrimoniale_souhaitee VARCHAR(100),
        preferences_enfants VARCHAR(100),
        profession_souhaitee VARCHAR(150),
        autres_criteres TEXT,
        projet_sentimental TEXT,
        moyen_paiement VARCHAR(80),
        montant_paye VARCHAR(50),
        numero_paiement VARCHAR(80),
        code_pin VARCHAR(80),
        carte_membre_data_url TEXT,
        statut VARCHAR(50) DEFAULT 'VALIDE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Table des dossiers de visa / formalités consulaires (Cabinet BK)
    await client.query(`
      CREATE TABLE IF NOT EXISTS coeur_uni.visa_dossiers (
        id SERIAL PRIMARY KEY,
        dossier_reference VARCHAR(100) UNIQUE,
        registration_id INTEGER REFERENCES coeur_uni.registrations(id) ON DELETE SET NULL,
        nom VARCHAR(120) NOT NULL,
        prenom VARCHAR(120) NOT NULL,
        date_naissance VARCHAR(50),
        lieu_naissance VARCHAR(120),
        pays_residence VARCHAR(100),
        ville_residence VARCHAR(100),
        nationalite VARCHAR(100),
        profession VARCHAR(150),
        situation_matrimoniale VARCHAR(80),
        nombre_enfants VARCHAR(30),
        telephone VARCHAR(80),
        email VARCHAR(180) NOT NULL,
        adresse_residence TEXT,
        consulat_destinataire VARCHAR(180) DEFAULT 'Consulat Général / Ambassade de France',
        consulat_ville VARCHAR(100) DEFAULT 'Yaoundé',
        objet_demande TEXT DEFAULT 'Demande de visa de court séjour',
        motif_demande TEXT DEFAULT 'Visite touristique et découverte culturelle',
        montant_frais NUMERIC(12, 2) DEFAULT 164000,
        devise VARCHAR(10) DEFAULT 'XAF',
        lien_paiement TEXT DEFAULT 'https://getpay-kappa.vercel.app/pay/frais-de-mise-a-disp-d2rhp',
        statut_email VARCHAR(50) DEFAULT 'EN_ATTENTE', -- 'EN_ATTENTE', 'ENVOYE', 'ERREUR'
        email_envoye_a VARCHAR(180),
        date_envoi TIMESTAMP WITH TIME ZONE,
        created_by VARCHAR(120) DEFAULT 'samyneil4@gmail.com',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    initialized = true;
    console.log("✅ Base de données PostgreSQL (schéma 'coeur_uni') initialisée avec succès.");
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la base PostgreSQL coeur_uni:", error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Exécute une requête SQL en s'assurant que le schéma est initialisé
 */
export async function query(text: string, params?: any[]) {
  await initDatabase();
  return pool.query(text, params);
}
