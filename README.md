# AF3M

AF3M est un projet Next.js portant sur (à compléter selon le scope réel du projet) la recherche et le développement autour de :
- Conception & optimisation, durée de vie et contrôle d’intégrité
- Matériaux & procédés d’élaboration, recyclage et cycle de vie
- Énergies renouvelables, économie d’énergie et supervision intelligente (IA)
- Matériaux bio-sourcés / éco-matériaux / éco-conception
- Hydrogène (production, stockage, transport, conversion)

Ce README décrit comment installer, configurer, développer et déployer le projet.

## Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation et lancement en local](#installation-et-lancement-en-local)
- [Configuration (variables d'environnement)](#configuration-variables-denvironnement)
- [Base de données](#base-de-données)
- [Structure du projet](#structure-du-projet)
- [Développement](#développement)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Sécurité & bonnes pratiques](#sécurité--bonnes-pratiques)
- [Contribuer](#contribuer)
- [Licence & contact](#licence--contact)

## Fonctionnalités
Liste non exhaustive :  
- Interface web construite avec Next.js (app router)
- Pages dynamiques et optimisées
- Intégration des polices optimisées via `next/font`
- Points d'entrée pour modules d'analyse/IA et surveillance d'équipements
- Structure prévue pour intégrer une base de données SQL

> Remarque : adapte cette section pour lister les fonctionnalités réelles (API exposées, endpoints, modules IA, tableaux de bord...).

## Stack technique
- Frontend : Next.js (App Router)
- Langage : JavaScript ou TypeScript (selon le projet)
- Hébergement recommandé : Vercel
- Base de données : SQL (Postgres / MySQL / SQLite — selon ta configuration)
- Outils : npm / pnpm / yarn, ESLint, Prettier (à ajouter si souhaité)

## Prérequis
- Node.js (version LTS recommandée, ex. 18+)
- npm ou yarn
- Accès à une base de données SQL (Postgres/MySQL) si utilisation en local
- Compte Vercel pour déploiement (optionnel)

## Installation et lancement en local
1. Cloner le dépôt
   git clone https://github.com/Ouss77/AF3M.git
2. Se placer dans le dossier du projet
   cd AF3M
3. Installer les dépendances
   npm install
   # ou
   yarn install
4. Créer un fichier d'environnement (voir ci-dessous)
5. Lancer le serveur de développement
   npm run dev
   # ou
   yarn dev
6. Ouvrir http://localhost:3000

## Configuration (variables d'environnement)
Crée un fichier `.env.local` (ne committe jamais tes secrets). Exemple `.env.example` :

```env
# .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/af3m_db
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=ton_secret_jwt_long
NEXT_PUBLIC_API_URL=http://localhost:3000/api
