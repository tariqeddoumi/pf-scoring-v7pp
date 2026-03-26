# PF Scoring Studio V7++

Application web Next.js + Prisma + PostgreSQL pour le scoring des Project Finance.

## Contenu du ZIP
- `app/` : interface web App Router
- `components/` : composants UI et formulaires
- `lib/` : moteur de scoring et helpers
- `prisma/schema.prisma` : modèle de données Prisma
- `prisma/seed.ts` : données de démonstration
- `sql/init_pf_scoring_v7pp.sql` : script SQL de création de la base

## Démarrage local
```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Déploiement Vercel
1. Créer un repo GitHub et pousser ce code.
2. Créer la base PostgreSQL.
3. Renseigner `DATABASE_URL` dans Vercel.
4. Déployer le projet.
5. Exécuter les migrations Prisma ou `prisma db push`.

## Ce que couvre cette V7++
- Dashboard portefeuille
- Création projet
- Nouvelle évaluation avec recalcul instantané
- Historique des évaluations
- Détail par domaine
- Page paramètres
- Page SQL pour visualiser le script d'initialisation

## Prochaines extensions recommandées
- Authentification et habilitations par profil
- Workflow de validation multi-niveaux
- Gestion documentaire
- Journal d'audit enrichi
- Paramétrage admin complet des grilles
- Import Excel / export PDF / génération comité
