# Polyglot Path

Crée un site e-commerce moderne pour vendre des cours de langues en ligne (vidéos, abonnements, packs de cours individuels).

Structure du site :

Page d'accueil : hero section avec accroche claire, liste des langues proposées (cartes avec drapeau/icône), témoignages clients, section "comment ça marche" (3-4 étapes), call-to-action vers la boutique

Page boutique/catalogue : grille de cours filtrable par langue, niveau (débutant/intermédiaire/avancé) et format (vidéo, live, abonnement)

Page détail d'un cours : description, programme/sommaire, prix, avis, bouton d'achat, prérequis

Panier + tunnel de paiement (étapes claires : panier → infos → paiement)

Page compte utilisateur : mes cours achetés, suivi de progression, factures

Page "À propos" et page contact

Design :

Style épuré et moderne, palette de couleurs douces (à définir : ex. bleu/blanc ou vert/beige)

Typographie lisible, mise en page aérée

Responsive (mobile-first)

Icônes/illustrations liées à l'apprentissage des langues

Fonctionnalités attendues :

Authentification utilisateur (connexion/inscription)

Système de panier persistant

Filtres et recherche dans le catalogue

Espace "mes cours" avec accès aux contenus achetés

Newsletter / capture d'email sur la page d'accueil

Stack suggérée : React + Tailwind, avec Supabase pour l'authentification et la base de données (utilisateurs, cours, commandes).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a24956c1-d939-475f-9973-04a1435b885b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
