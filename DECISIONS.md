# Décisions MVP — Campus Tutor

Document de travail. Corrige librement ; je m’aligne dessus.

## Objectif business
Monétiser via la commission plateforme **30 %** sur chaque séance payée.
Les aidants reçoivent **70 %** via reversements hebdomadaires admin.

## Hypothèses retenues pour démarrer vite

| Sujet | Décision MVP |
|-------|----------------|
| Stack | Next.js App Router + TypeScript + Tailwind + shadcn + Supabase |
| Paiement | **Simulé** d’abord, puis prestataire réel (FedaPay/CinetPay…) |
| Devise | XOF (FCFA), montants entiers |
| Fuseau | Africa/Lome |
| Langue UI | Français |
| Nom temporaire | Campus Tutor (modifiable) |
| Vérification étudiant | Email + validation admin pour les aidants |
| Budget demande | Optionnel |
| Contre-proposition créneau | Activée |
| Validation séance | Confirmation des **2 parties** ; litige → admin |
| Import Excel catalogue | Après MVP |
| Chat / vidéo / mobile natif | Hors MVP |

## Bloquant côté toi
1. Créer un projet gratuit sur [supabase.com](https://supabase.com)
2. Me donner : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. (Optionnel) Nom réel de la plateforme + logo + catalogue école

## Ordre de build
1. Fondation (en cours)
2. Auth + profils
3. Catalogue admin
4. Demandes + propositions
5. Réservations + séances
6. Paiement simulé + ledger 30/70
7. Revenus aidant + reversements
8. Admin dashboard
9. Déploiement démo → paiement réel
