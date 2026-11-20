# Cahier des charges et plan de réalisation

## Plateforme universitaire de mise en relation pour l'aide académique

**Version :** 1.1\
**Date :** 1er novembre 2026\
**Type de document :** Cahier des charges fonctionnel et technique,
architecture et plan d'exécution\
**Objectif :** Construire un MVP fonctionnel en 7 jours, puis le
renforcer avant sa mise en production.

------------------------------------------------------------------------

# 1. Résumé du projet

La plateforme permet aux étudiants d'un établissement d'obtenir une aide
académique rémunérée auprès d'autres étudiants inscrits sur la
plateforme.

Un étudiant peut être à la fois **demandeur d'aide et étudiant aidant**,
avec un seul compte. Il n'existe donc pas deux catégories de comptes
mutuellement exclusives.

Les étudiants qui ont besoin d'aide publient une demande en
sélectionnant un module dans un catalogue prédéfini par
l'administration. Tous les aidants validés peuvent consulter les
demandes ouvertes de l'établissement et choisir celles qui les
intéressent.

L'aidant peut accepter une demande ou faire une contre-proposition,
notamment concernant le mode d'assistance et le tarif. Le demandeur doit
accepter les conditions finales avant de payer.

Le demandeur paie la totalité du montant à la plateforme. **La totalité
des fonds collectés est reçue par le compte de paiement de la plateforme
administrée par l'école/l'administrateur.** La plateforme comptabilise
30 % de commission et 70 % dus à l'aidant. L'aidant ne reçoit pas
directement le paiement du demandeur : il consulte uniquement ses
montants dus et l'état de leurs reversements. Les reversements sont
organisés chaque semaine et exécutés par l'administrateur.

## 1.1 Objectifs

-   Faciliter l'entraide académique entre étudiants.
-   Permettre aux étudiants de proposer des séances d'accompagnement
    rémunérées.
-   Donner accès à un catalogue officiel de filières et de modules.
-   Simplifier la publication, la consultation et l'acceptation des
    demandes.
-   Assurer un processus de paiement fiable et traçable.
-   Comptabiliser automatiquement la commission de la plateforme (30 %)
    et la part due à l'aidant (70 %).
-   Permettre à l'administration de gérer les étudiants, les contenus,
    les paiements et les reversements.

## 1.2 Périmètre du MVP

Le MVP doit permettre de réaliser un parcours complet :

1.  Un étudiant crée un compte et complète son profil.
2.  Un étudiant publie une demande avec un module prédéfini.
3.  Tous les aidants validés peuvent voir cette demande.
4.  Un aidant répond à la demande ou propose des conditions différentes.
5.  Le demandeur accepte ou refuse la proposition.
6.  Après accord, le demandeur paie la totalité du montant.
7.  Le paiement est vérifié et enregistré.
8.  Les deux étudiants reçoivent une notification de paiement confirmé.
9.  La séance est réalisée puis validée ou signalée.
10. La part due à l'aidant est comptabilisée.
11. L'administrateur effectue les reversements hebdomadaires et
    enregistre leur preuve.

Le chat instantané, les appels vidéo intégrés, les applications mobiles
natives et les recommandations intelligentes ne sont pas requis pour le
MVP.

------------------------------------------------------------------------

# 2. Décisions métier non négociables

Ces règles doivent être respectées dans le code, la base de données, les
interfaces et les tests.

  -----------------------------------------------------------------------
  Code                                Règle
  ----------------------------------- -----------------------------------
  RG-01                               Un utilisateur étudiant possède un
                                      seul compte.

  RG-02                               Tout étudiant peut demander de
                                      l'aide.

  RG-03                               Un étudiant dont le profil aidant
                                      est validé peut également aider les
                                      autres.

  RG-04                               Un aidant peut lui-même publier une
                                      demande d'aide.

  RG-05                               Les modules proposés aux demandeurs
                                      proviennent exclusivement du
                                      catalogue administré.

  RG-06                               Aucun champ libre ne permet de
                                      créer un nouveau nom de module.

  RG-07                               Les demandes ouvertes sont visibles
                                      par tous les aidants validés de
                                      l'établissement, sans restriction
                                      de filière.

  RG-08                               Un aidant n'a pas à déclarer ses
                                      compétences ou ses modules
                                      maîtrisés.

  RG-09                               Un aidant choisit librement les
                                      demandes auxquelles il souhaite
                                      répondre.

  RG-10                               L'aidant peut accepter une demande
                                      ou proposer un autre mode et/ou un
                                      autre tarif.

  RG-11                               Le demandeur doit accepter la
                                      proposition finale avant de payer.

  RG-12                               Une demande ne peut avoir qu'une
                                      seule réservation active confirmée.

  RG-13                               Aucun paiement n'est exigé avant
                                      l'accord des deux étudiants.

  RG-14                               Le demandeur paie 100 % du prix
                                      convenu à la plateforme.

  RG-15                               La totalité du paiement est
                                      encaissée sur le compte de la
                                      plateforme, et non directement par
                                      l'aidant.

  RG-16                               La plateforme conserve une
                                      commission de 30 % du montant de la
                                      séance, selon la base de calcul
                                      contractuellement définie.

  RG-17                               Les 70 % restants constituent le
                                      montant dû à l'aidant.

  RG-18                               L'aidant voit ses montants dus, en
                                      attente, disponibles et déjà
                                      versés, mais ne gère pas les fonds
                                      collectés par la plateforme.

  RG-19                               L'administrateur voit les paiements
                                      reçus, commissions, dettes envers
                                      les aidants et reversements.

  RG-20                               Les reversements aux aidants sont
                                      organisés chaque semaine et
                                      exécutés par l'administration.

  RG-21                               Les notifications de paiement sont
                                      envoyées aux deux étudiants
                                      uniquement après vérification
                                      effective du paiement.

  RG-22                               Chaque opération financière est
                                      historisée et ne peut être
                                      supprimée ou modifiée
                                      silencieusement.

  RG-23                               Un webhook de paiement reçu
                                      plusieurs fois ne doit pas créer
                                      plusieurs crédits.

  RG-24                               Les séances annulées, contestées et
                                      remboursées suivent un processus
                                      contrôlé.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 3. Utilisateurs et autorisations

## 3.1 Étudiant

Tout étudiant authentifié peut :

-   Consulter et modifier son profil.
-   Consulter le catalogue des filières, niveaux et modules.
-   Publier une demande d'aide.
-   Consulter ses demandes.
-   Recevoir et accepter/refuser les propositions.
-   Payer une réservation.
-   Consulter ses réservations, paiements et notifications.
-   Signaler un problème.
-   Évaluer un aidant après une séance terminée.

## 3.2 Étudiant aidant

Un étudiant peut activer son espace aidant après avoir complété les
informations requises et obtenu la validation administrative.

Il peut :

-   Consulter toutes les demandes ouvertes de l'établissement.
-   Filtrer les demandes par filière, niveau, module, date, mode et
    budget.
-   Consulter le détail d'une demande.
-   Accepter la demande ou soumettre une contre-proposition.
-   Proposer un tarif et un mode d'assistance.
-   Consulter les séances qui lui sont attribuées.
-   Confirmer la réalisation d'une séance.
-   Signaler un problème.
-   Consulter ses revenus générés, sa commission déduite, son montant
    dû, son montant disponible et les reversements reçus.
-   Consulter l'historique de ses reversements.

**Limitation :** l'aidant ne peut pas modifier son solde, effectuer un
transfert depuis le portefeuille de la plateforme ou valider lui-même un
reversement.

Un aidant conserve toutes les fonctionnalités d'un demandeur.

## 3.3 Administrateur

L'administrateur peut :

-   Gérer les comptes et profils étudiants.
-   Valider, suspendre ou réactiver les profils aidants.
-   Gérer les filières, niveaux et modules.
-   Activer/désactiver un module.
-   Consulter toutes les demandes et réservations.
-   Consulter les paiements et références du prestataire.
-   Voir les montants encaissés par la plateforme.
-   Voir les commissions de 30 %.
-   Voir les montants dus aux aidants.
-   Préparer les lots de reversements hebdomadaires.
-   Enregistrer et valider les reversements exécutés.
-   Ajouter une référence et une preuve de virement.
-   Gérer les remboursements et litiges.
-   Consulter les journaux d'audit et statistiques.

L'accès administrateur doit être accordé côté serveur, jamais par une
simple valeur de rôle modifiable dans le navigateur.

------------------------------------------------------------------------

# 4. Parcours utilisateurs

## 4.1 Publication d'une demande par un étudiant

1.  L'étudiant se connecte.
2.  Il ouvre « Demander de l'aide ».
3.  Il sélectionne sa filière, son niveau et un module disponible.
4.  Il décrit précisément sa difficulté.
5.  Il choisit le mode souhaité : en ligne ou présentiel.
6.  Il indique une date et une heure souhaitées, ou une plage de
    disponibilités si cette option est retenue.
7.  Il indique la durée souhaitée.
8.  Il indique éventuellement son budget ou consulte les tarifs des
    aidants.
9.  Il publie la demande.
10. La demande apparaît dans le catalogue de toutes les demandes
    ouvertes des aidants validés.

Le nom du module doit être sélectionné dans une liste issue de la base
de données. Il ne doit pas être saisi librement.

## 4.2 Réponse d'un aidant

1.  L'aidant ouvre son espace.
2.  Il consulte les demandes disponibles.
3.  Il filtre les demandes s'il le souhaite.
4.  Il ouvre une demande.
5.  Il consulte le module, le niveau, la description, le mode souhaité,
    la date, la durée et le budget éventuel.
6.  Il choisit :
    -   accepter les conditions proposées ;
    -   proposer un autre mode ;
    -   proposer un autre tarif ;
    -   proposer un autre créneau, si cette option est activée ;
    -   refuser/ignorer la demande.
7.  Le demandeur reçoit une notification de la proposition.

Un aidant ne doit pas être obligé de déclarer des compétences pour
accéder aux demandes.

## 4.3 Contre-proposition

Une contre-proposition doit être explicite et structurée :

-   Mode proposé : `online` ou `in_person`.
-   Tarif horaire proposé, en FCFA.
-   Durée proposée, si elle diffère.
-   Date/heure proposée, si elle diffère.
-   Message facultatif.
-   Date d'expiration.

Le demandeur peut accepter ou refuser la proposition.

Si le demandeur accepte, les conditions finales sont figées dans la
réservation. Si le demandeur refuse ou si la proposition expire, la
demande peut redevenir disponible pour les autres aidants, selon les
règles de disponibilité.

## 4.4 Paiement

1.  Le demandeur consulte le récapitulatif de la réservation.
2.  Il voit le mode, le créneau, la durée et le prix total.
3.  Il confirme vouloir payer.
4.  Le backend crée une tentative de paiement auprès du prestataire.
5.  Le demandeur effectue le paiement.
6.  Le prestataire transmet une confirmation serveur (webhook) ou
    l'administrateur vérifie le paiement si le mode manuel est utilisé.
7.  Le backend vérifie la référence, le montant, la devise et le statut.
8.  Une transaction financière est enregistrée une seule fois.
9.  Les 30 % de commission et 70 % dus à l'aidant sont comptabilisés.
10. Les deux étudiants reçoivent une notification de paiement confirmé.
11. La réservation passe au statut confirmé.

Ne jamais considérer le paiement comme réussi uniquement parce que le
navigateur est redirigé vers une page de succès.

## 4.5 Réalisation de la séance

1.  Les deux étudiants voient les informations de la séance confirmée.
2.  La séance se déroule en ligne ou en présentiel.
3.  Chaque étudiant peut confirmer que la séance a eu lieu.
4.  Si les confirmations concordent, la séance est marquée terminée.
5.  Le montant dû à l'aidant passe du solde en attente au solde
    disponible.
6.  En cas de désaccord, la séance passe en litige et l'administrateur
    intervient.

La règle de validation exacte (confirmation des deux parties, délai de
contestation, traitement en l'absence de réponse) doit être définie
avant la production. Pour le MVP, une confirmation par les deux parties
et une intervention administrative en cas de désaccord constituent le
choix le plus prudent.

## 4.6 Reversement hebdomadaire

1.  L'administrateur consulte les montants disponibles par aidant.
2.  Le système prépare un lot hebdomadaire.
3.  L'administrateur vérifie les montants et les coordonnées de
    paiement.
4.  L'administrateur effectue les virements depuis le compte de la
    plateforme.
5.  Il enregistre la référence de chaque virement et, si possible, une
    preuve.
6.  Il marque le reversement comme payé après vérification.
7.  Le montant est déduit du solde dû.
8.  L'aidant reçoit une notification de reversement effectué.

Le système ne doit jamais marquer un retrait comme payé avant
confirmation réelle du transfert.

------------------------------------------------------------------------

# 5. Règles financières

## 5.1 Modèle économique

-   Le demandeur paie 100 % du montant convenu.
-   La totalité est encaissée par le compte de paiement de la
    plateforme.
-   La plateforme conserve 30 % de commission.
-   La plateforme doit 70 % à l'aidant.
-   Les reversements sont exécutés chaque semaine par l'administration.
-   L'aidant ne reçoit pas directement le paiement initial.

Exemple pour une séance de 5 000 FCFA :

  Élément                                Montant
  --------------------------------- ------------
  Paiement reçu par la plateforme     5 000 FCFA
  Commission de 30 %                  1 500 FCFA
  Montant dû à l'aidant (70 %)        3 500 FCFA

La commission est calculée côté serveur avec des montants entiers en
FCFA. Définir explicitement les règles d'arrondi et la base de calcul
contractuelle. Les frais du prestataire de paiement doivent être
comptabilisés séparément et ne doivent pas être confondus avec les 30 %
de commission.

## 5.2 Ce que voit l'aidant

L'aidant voit uniquement les informations relatives à ses propres
revenus :

-   Total généré.
-   Commission de la plateforme.
-   Montant dû en attente de validation de séance.
-   Montant disponible pour le prochain reversement.
-   Montant déjà reversé.
-   Historique des reversements.
-   Statut du prochain reversement.

L'aidant ne voit pas : - Le solde bancaire de la plateforme. - Les
paiements reçus des autres étudiants. - Les revenus des autres
aidants. - Les transactions internes de l'administration qui ne le
concernent pas.

## 5.3 Ce que voit l'administrateur

-   Total des paiements encaissés.
-   Paiements en attente, réussis, échoués et remboursés.
-   Commission totale de la plateforme.
-   Total dû aux aidants.
-   Montant en attente de validation des séances.
-   Montant disponible à reverser.
-   Reversements en attente, exécutés et échoués.
-   Frais du prestataire de paiement, séparément.
-   Écarts éventuels entre les encaissements et les écritures internes.

## 5.4 Modèle de portefeuille

Le portefeuille de l'aidant est un **relevé de créance interne**, pas un
compte bancaire et pas un compte de paiement détenu par l'aidant chez le
prestataire.

Champs/indicateurs recommandés :

-   `pending_balance` : part de l'aidant associée aux séances payées
    mais pas encore validées.
-   `available_balance` : part validée, due et non encore reversée.
-   `total_earned` : cumul des parts de l'aidant acquises.
-   `total_paid_out` : cumul des reversements confirmés.

Toutes les écritures financières doivent être enregistrées dans un
journal immuable. Ne pas permettre de modifier directement les soldes
depuis le client.

## 5.5 Gestion des remboursements et annulations

Prévoir : - Le statut de remboursement. - Le motif. - L'auteur de la
décision. - La date. - La référence du remboursement chez le
prestataire. - L'annulation ou l'ajustement des écritures de commission
et de dette envers l'aidant. - Une écriture inverse plutôt que la
suppression de l'écriture initiale.

Les règles de remboursement doivent être définies contractuellement et
affichées aux étudiants avant paiement.

------------------------------------------------------------------------

# 6. Catalogue prédéfini des filières, niveaux et modules

Cette fonctionnalité est obligatoire.

## 6.1 Structure du catalogue

L'administration gère :

-   Les filières.
-   Les niveaux/années d'étude.
-   Les modules associés à chaque filière et niveau.
-   Le code du module, si l'école en utilise.
-   La description facultative.
-   L'état actif/inactif.

Exemple fictif :

``` text
Filière : Informatique
  Niveau : Licence 1
    - Algorithmique
    - Mathématiques générales
    - Introduction à la programmation

  Niveau : Licence 2
    - Programmation orientée objet
    - Bases de données
    - Réseaux informatiques

  Niveau : Licence 3
    - Génie logiciel
    - Développement mobile
    - Sécurité informatique
```

Ces exemples ne doivent pas être considérés comme le catalogue réel de
l'école. L'administrateur devra importer ou saisir le catalogue
officiel.

## 6.2 Règles d'utilisation

-   Le demandeur choisit une filière dans une liste.
-   Il choisit son niveau parmi les niveaux autorisés.
-   Il choisit un module parmi ceux liés à cette filière et à ce niveau.
-   Le nom du module ne peut pas être saisi librement.
-   Un module désactivé ne peut plus être sélectionné pour une nouvelle
    demande.
-   Les anciennes demandes conservent le libellé du module au moment de
    leur création.
-   Seul l'administrateur peut créer, modifier, activer ou désactiver un
    module.
-   Une demande conserve l'identifiant du module et un instantané de son
    libellé pour préserver l'historique.

## 6.3 Import du catalogue

Pour faciliter le travail de l'administrateur, prévoir à terme un import
CSV ou Excel avec les colonnes :

`faculty_name, level_name, module_code, module_name, description`

L'import doit : - Vérifier les colonnes obligatoires. - Détecter les
doublons. - Signaler les filières/niveaux inconnus. - Afficher un aperçu
avant validation. - Produire un rapport des lignes importées et
rejetées.

L'import Excel peut être reporté après le MVP si le délai est trop
court.

------------------------------------------------------------------------

# 7. Fonctionnalités détaillées

## 7.1 Authentification et profil

-   Inscription.
-   Connexion/déconnexion.
-   Réinitialisation du mot de passe.
-   Vérification d'adresse e-mail.
-   Vérification d'appartenance à l'établissement selon le mécanisme
    choisi.
-   Profil étudiant : nom, prénom, e-mail, téléphone, identifiant
    étudiant, filière, niveau, photo.
-   État du compte : en attente, actif, suspendu.
-   Activation du profil aidant et validation administrative.

Un compte peut demander de l'aide sans être validé comme aidant. Pour
répondre aux demandes, son statut aidant doit être validé.

## 7.2 Demandes

-   Création.
-   Modification tant qu'aucun accord définitif n'est obtenu.
-   Annulation.
-   Liste des demandes.
-   Filtres.
-   Pagination.
-   Détail.
-   Historique.
-   Statut.

Champs : - Demandeur. - Filière. - Niveau. - Module prédéfini. -
Description. - Mode souhaité. - Date/heure ou disponibilités. - Durée
souhaitée. - Budget facultatif, si retenu. - Statut. - Date de
publication.

## 7.3 Propositions

-   Acceptation des conditions initiales.
-   Contre-proposition de mode.
-   Contre-proposition de tarif.
-   Contre-proposition de créneau.
-   Acceptation/refus par le demandeur.
-   Expiration.
-   Historique des propositions.

## 7.4 Réservations et séances

-   Création après accord.
-   Récapitulatif des conditions.
-   Paiement attendu.
-   Confirmation après paiement.
-   Séance à venir.
-   Confirmation de réalisation.
-   Contestation.
-   Annulation et remboursement selon politique.

## 7.5 Notifications

Notifications in-app minimales : - Nouvelle proposition. - Proposition
acceptée/refusée. - Demande expirée. - Paiement confirmé. - Séance à
venir. - Séance terminée. - Séance contestée. - Reversement préparé. -
Reversement effectué. - Reversement échoué.

Les notifications de paiement sont envoyées au demandeur et à l'aidant
uniquement après confirmation vérifiée.

Les notifications temps réel sont un confort d'interface ; elles ne
remplacent jamais la persistance en base de données.

## 7.6 Administration

-   Vue d'ensemble.
-   Gestion des étudiants.
-   Validation des aidants.
-   Gestion du catalogue.
-   Gestion des demandes.
-   Gestion des réservations.
-   Gestion des paiements.
-   Gestion des remboursements.
-   Gestion des reversements.
-   Journaux d'audit.
-   Statistiques.

------------------------------------------------------------------------

# 8. Architecture technique recommandée

## 8.1 Stack

  Couche             Technologie                    Usage
  ------------------ ------------------------------ -------------------------------
  Framework          Next.js App Router             Application web
  Langage            TypeScript                     Typage
  UI                 Tailwind CSS                   Styles
  Composants         shadcn/ui                      Interface
  Icônes             Lucide React                   Icônes
  Backend/BaaS       Supabase                       Services backend
  Base               PostgreSQL                     Données
  Auth               Supabase Auth                  Authentification
  Sécurité           PostgreSQL RLS                 Contrôle des accès
  Temps réel         Supabase Realtime              Notifications et mises à jour
  Stockage           Supabase Storage               Photos et justificatifs
  Formulaires        React Hook Form + Zod          Validation
  Graphiques         Recharts                       Statistiques
  Dates              date-fns                       Dates
  Notifications UI   Sonner                         Toasts
  Déploiement        Hébergeur compatible Next.js   Production

Utiliser `@supabase/ssr` pour gérer les sessions Supabase dans Next.js.
Ne pas exposer de clé secrète dans le navigateur.

## 8.2 Architecture générale

``` text
Navigateur
   |
   v
Next.js App Router
   |
   +-- Pages et composants
   |
   +-- Server Components
   |
   +-- Server Actions
   |
   +-- Route Handlers
          |
          v
Couche métier / accès aux données
   |
   +-- Authentification et autorisations
   +-- Catalogue
   +-- Demandes et propositions
   +-- Réservations
   +-- Paiements
   +-- Journal financier
   +-- Reversements
   +-- Notifications
          |
          v
Supabase
   |
   +-- PostgreSQL
   +-- Auth
   +-- RLS
   +-- Realtime
   +-- Storage
```

Les opérations sensibles sont exécutées côté serveur. Chaque Server
Action et Route Handler doit vérifier l'identité, le rôle, la propriété
de la ressource et les règles métier. Ne pas faire confiance aux
contrôles de l'interface.

## 8.3 Sécurité

-   RLS activé sur toutes les tables exposées.
-   L'étudiant ne modifie que son propre profil.
-   Un demandeur ne modifie que ses propres demandes.
-   Un aidant validé peut consulter les demandes ouvertes de
    l'établissement.
-   Un aidant ne peut consulter que ses propres revenus et reversements.
-   Un étudiant ne peut consulter que ses propres réservations et
    paiements.
-   L'administrateur a accès aux fonctions de gestion autorisées.
-   Les clés `service_role` et secrets du prestataire restent côté
    serveur.
-   Validation Zod côté serveur.
-   Limitation de fréquence sur les actions sensibles.
-   Webhooks signés et vérifiés.
-   Protection contre les doubles paiements et doubles reversements.
-   Journalisation des actions administratives.
-   Pas de suppression physique des écritures financières.

------------------------------------------------------------------------

# 9. Modèle de données PostgreSQL

Le schéma ci-dessous est une proposition initiale. Il doit être affiné
pendant la conception des migrations et des politiques RLS.

## 9.1 Tables principales

### `profiles`

-   `id` UUID, référence à `auth.users`.
-   `first_name`.
-   `last_name`.
-   `email`.
-   `phone`.
-   `student_number`.
-   `faculty_id`.
-   `level_id`.
-   `avatar_url`.
-   `account_status`.
-   `created_at`.
-   `updated_at`.

### `user_roles`

-   `id`.
-   `user_id`.
-   `role`: `student`, `admin`.
-   `created_at`.

Le rôle étudiant est commun au demandeur et à l'aidant. Le statut aidant
est géré séparément.

### `tutor_profiles`

-   `id`.
-   `user_id`.
-   `status`: `pending`, `approved`, `rejected`, `suspended`.
-   `payout_phone`.
-   `payout_provider`.
-   `approved_by`.
-   `approved_at`.
-   `created_at`.

Ne pas ajouter de liste obligatoire de compétences ou de modules
maîtrisés.

### `faculties`

-   `id`.
-   `name`.
-   `code`.
-   `is_active`.

### `levels`

-   `id`.
-   `name`.
-   `sort_order`.
-   `is_active`.

### `modules`

-   `id`.
-   `faculty_id`.
-   `level_id`.
-   `name`.
-   `code`.
-   `description`.
-   `is_active`.
-   `created_at`.
-   `updated_at`.

Ajouter une contrainte d'unicité adaptée, par exemple sur le code du
module dans sa filière et son niveau.

### `requests`

-   `id`.
-   `requester_id`.
-   `faculty_id`.
-   `level_id`.
-   `module_id`.
-   `module_name_snapshot`.
-   `description`.
-   `preferred_mode`: `online`, `in_person`.
-   `preferred_date`.
-   `preferred_duration_minutes`.
-   `budget_amount`, nullable.
-   `status`.
-   `created_at`.
-   `updated_at`.
-   `expires_at`.

### `proposals`

-   `id`.
-   `request_id`.
-   `tutor_id`.
-   `proposed_mode`.
-   `hourly_rate`.
-   `duration_minutes`.
-   `proposed_date`.
-   `message`.
-   `status`: `pending`, `accepted`, `rejected`, `expired`, `withdrawn`.
-   `expires_at`.
-   `created_at`.

### `bookings`

-   `id`.
-   `request_id`.
-   `proposal_id`.
-   `requester_id`.
-   `tutor_id`.
-   `mode`.
-   `hourly_rate`.
-   `duration_minutes`.
-   `total_amount`.
-   `currency`, par défaut `XOF`.
-   `platform_commission_rate`, par défaut `30`.
-   `platform_commission_amount`.
-   `tutor_due_amount`.
-   `scheduled_at`.
-   `status`.
-   `completed_at`.
-   `created_at`.

Les conditions et montants de la réservation doivent être figés au
moment de l'accord. Une modification ultérieure exige un processus
contrôlé.

### `payments`

-   `id`.
-   `booking_id`.
-   `provider`.
-   `provider_reference`.
-   `amount`.
-   `currency`.
-   `status`: `pending`, `paid`, `failed`, `refunded`,
    `partially_refunded`.
-   `paid_at`.
-   `raw_provider_reference` ou métadonnées minimales utiles.
-   `created_at`.

La référence prestataire doit être unique lorsque présente.

### `financial_ledger`

Journal financier immuable : - `id`. - `booking_id`, nullable selon le
type. - `payment_id`, nullable. - `user_id`, nullable. - `entry_type`. -
`account_type`: plateforme, dette_aidant, frais_prestataire,
remboursement. - `amount`. - `currency`. - `description`. -
`idempotency_key`. - `created_at`. - `created_by`.

Ne pas permettre au client d'insérer ou modifier librement des écritures
financières.

### `tutor_wallets`

-   `id`.
-   `tutor_id`.
-   `pending_balance`.
-   `available_balance`.
-   `total_earned`.
-   `total_paid_out`.
-   `updated_at`.

Les soldes sont des projections pratiques du journal financier. Le
journal reste la source de vérité.

### `withdrawal_batches`

-   `id`.
-   `period_start`.
-   `period_end`.
-   `status`: `draft`, `reviewed`, `processing`, `completed`,
    `cancelled`.
-   `created_by`.
-   `approved_by`.
-   `created_at`.
-   `completed_at`.

### `withdrawals`

-   `id`.
-   `batch_id`.
-   `tutor_id`.
-   `amount`.
-   `currency`.
-   `payout_provider`.
-   `payout_phone_snapshot`.
-   `provider_reference`.
-   `status`: `pending`, `processing`, `paid`, `failed`, `cancelled`.
-   `proof_url`.
-   `processed_by`.
-   `processed_at`.
-   `created_at`.

### `notifications`

-   `id`.
-   `user_id`.
-   `title`.
-   `message`.
-   `type`.
-   `related_entity_type`.
-   `related_entity_id`.
-   `read_at`.
-   `created_at`.

### `reviews`

-   `id`.
-   `booking_id`.
-   `reviewer_id`.
-   `reviewed_id`.
-   `rating`.
-   `comment`.
-   `created_at`.

Une réservation ne peut donner lieu qu'à une évaluation par utilisateur
évaluateur.

### `admin_audit_logs`

-   `id`.
-   `admin_id`.
-   `action`.
-   `entity_type`.
-   `entity_id`.
-   `metadata`.
-   `created_at`.

## 9.2 Contraintes essentielles

-   Utiliser UUID comme clés primaires.
-   Stocker les montants en entiers FCFA, jamais en float.
-   Utiliser `timestamptz` pour les dates.
-   Afficher les dates selon le fuseau `Africa/Lome`.
-   Ajouter des index sur les clés étrangères et les colonnes de
    recherche.
-   Utiliser des contraintes CHECK pour les montants positifs, taux et
    statuts.
-   Empêcher deux réservations actives concurrentes pour une même
    demande.
-   Prévoir des clés d'idempotence pour les paiements, webhooks et
    reversements.
-   Conserver les snapshots des données importantes pour l'historique.

------------------------------------------------------------------------

# 10. Gestion des statuts

Ne pas utiliser un seul statut pour une demande, une proposition, une
réservation et un paiement.

## Demande

-   `open`
-   `matched`
-   `closed`
-   `cancelled`
-   `expired`

## Proposition

-   `pending`
-   `accepted`
-   `rejected`
-   `expired`
-   `withdrawn`

## Réservation

-   `pending_payment`
-   `confirmed`
-   `in_progress`
-   `awaiting_completion`
-   `completed`
-   `disputed`
-   `cancelled`
-   `refunded`

## Paiement

-   `pending`
-   `paid`
-   `failed`
-   `refunded`
-   `partially_refunded`

## Reversement

-   `pending`
-   `processing`
-   `paid`
-   `failed`
-   `cancelled`

Les transitions doivent être validées côté serveur. Par exemple, une
réservation ne passe à `confirmed` que si le paiement est réellement
vérifié.

------------------------------------------------------------------------

# 11. Structure du projet Next.js

Organisation proposée :

``` text
campus-tutor/
├── public/
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   └── how-it-works/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── student/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── requests/
│   │   │   │   ├── bookings/
│   │   │   │   └── payments/
│   │   │   │
│   │   │   ├── tutor/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── requests/
│   │   │   │   ├── proposals/
│   │   │   │   ├── sessions/
│   │   │   │   ├── earnings/
│   │   │   │   └── settings/
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── students/
│   │   │       ├── tutors/
│   │   │       ├── faculties/
│   │   │       ├── levels/
│   │   │       ├── modules/
│   │   │       ├── requests/
│   │   │       ├── bookings/
│   │   │       ├── payments/
│   │   │       ├── finance/
│   │   │       ├── withdrawals/
│   │   │       └── settings/
│   │   │
│   │   └── api/
│   │       ├── payments/
│   │       │   ├── initiate/route.ts
│   │       │   └── webhook/route.ts
│   │       └── health/route.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── requests/
│   │   ├── proposals/
│   │   ├── bookings/
│   │   ├── finance/
│   │   └── notifications/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── profiles/
│   │   ├── catalog/
│   │   ├── requests/
│   │   ├── proposals/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── ledger/
│   │   ├── earnings/
│   │   ├── withdrawals/
│   │   └── notifications/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── auth/
│   │   ├── permissions/
│   │   ├── validations/
│   │   ├── finance/
│   │   └── utils/
│   │
│   └── types/
│       ├── database.ts
│       └── index.ts
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── functions/
│
├── .env.example
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
└── tsconfig.json
```

Les noms de routes peuvent être adaptés pendant le développement, mais
il faut conserver une séparation claire entre les interfaces, les
fonctionnalités métier et l'accès aux données.

------------------------------------------------------------------------

# 12. Écrans à concevoir

## 12.1 Site public

-   Accueil.
-   Présentation du fonctionnement.
-   Présentation des avantages.
-   Connexion.
-   Inscription.
-   Conditions d'utilisation.
-   Politique de confidentialité.
-   Politique d'annulation et de remboursement.

## 12.2 Espace étudiant

-   Tableau de bord.
-   Créer une demande.
-   Mes demandes.
-   Propositions reçues.
-   Réservations.
-   Paiements.
-   Notifications.
-   Profil.

## 12.3 Espace aidant

-   Tableau de bord.
-   Toutes les demandes ouvertes.
-   Détail d'une demande.
-   Mes propositions.
-   Mes séances.
-   Mes revenus dus.
-   Historique des reversements.
-   Coordonnées de reversement.
-   Notifications.
-   Profil.

## 12.4 Espace administrateur

-   Tableau de bord global.
-   Gestion des étudiants.
-   Validation des aidants.
-   Gestion des filières.
-   Gestion des niveaux.
-   Gestion des modules.
-   Gestion des demandes.
-   Gestion des réservations.
-   Gestion des paiements.
-   Comptabilité et commissions.
-   Lots de reversements hebdomadaires.
-   Gestion des remboursements et litiges.
-   Journaux d'audit.
-   Paramètres de la plateforme.

------------------------------------------------------------------------

# 13. Plan de réalisation de bout en bout

Le délai cible est de 7 jours pour le MVP. Il suppose un périmètre
strict, des décisions rapides et l'utilisation de composants existants.
La mise en production financière réelle peut nécessiter davantage de
temps, notamment pour l'ouverture du compte marchand, les validations du
prestataire et les tests de conformité.

## Phase 0 --- Préparation du projet

### Étape 0.1 : Valider le périmètre

-   Confirmer les fonctionnalités du MVP.
-   Confirmer les règles financières.
-   Confirmer le processus de validation des séances.
-   Définir les politiques d'annulation et de remboursement.
-   Identifier le responsable administratif du compte de paiement.

### Étape 0.2 : Rassembler les données de l'école

-   Liste officielle des filières.
-   Liste des niveaux.
-   Liste officielle des modules par filière et niveau.
-   Identifiants étudiants ou méthode de vérification.
-   Coordonnées institutionnelles.
-   Logo et identité visuelle.

### Étape 0.3 : Définir les paramètres

-   Nom de la plateforme.
-   Couleurs.
-   Devise : XOF.
-   Fuseau : Africa/Lome.
-   Commission : 30 %.
-   Part aidant : 70 %.
-   Jour de clôture des reversements hebdomadaires.
-   Seuil minimum éventuel de reversement.

**Livrable :** périmètre validé et informations de référence réunies.

## Phase 1 --- Conception UX/UI

### Étape 1.1 : Définir les parcours

-   Parcours demandeur.
-   Parcours aidant.
-   Parcours administrateur.
-   Parcours de paiement.
-   Parcours de reversement.

### Étape 1.2 : Créer les maquettes

-   Accueil.
-   Connexion/inscription.
-   Formulaire de demande.
-   Liste des demandes aidant.
-   Détail d'une demande et contre-proposition.
-   Espace étudiant.
-   Espace aidant et revenus.
-   Administration et catalogue.
-   Administration financière.

### Étape 1.3 : Définir les composants

-   Navigation.
-   Sidebar.
-   Cartes statistiques.
-   Tableaux.
-   Filtres.
-   Formulaires.
-   Modales de confirmation.
-   Notifications.
-   Badges de statut.

**Livrable :** maquettes desktop et mobile des parcours principaux.

## Phase 2 --- Initialisation technique

### Étape 2.1 : Créer le projet

``` bash
npx create-next-app@latest campus-tutor
cd campus-tutor
```

Choisir : - TypeScript : oui. - ESLint : oui. - Tailwind CSS : oui. -
Dossier `src/` : oui. - App Router : oui. - Alias `@/*` : oui.

### Étape 2.2 : Installer les dépendances

``` bash
npm install @supabase/supabase-js @supabase/ssr
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react recharts date-fns sonner
```

Initialiser shadcn/ui :

``` bash
npx shadcn@latest init
```

### Étape 2.3 : Créer le projet Supabase

-   Créer un projet PostgreSQL.
-   Récupérer l'URL et la clé publique.
-   Configurer les clés privées uniquement côté serveur.
-   Configurer les URL de redirection Auth.
-   Configurer les politiques de sécurité.

### Étape 2.4 : Préparer Git

-   Créer le dépôt.
-   Faire un premier commit.
-   Ajouter `.env.local` au `.gitignore`.
-   Créer `.env.example`.
-   Définir une stratégie de branches simple.

**Livrable :** application qui démarre et communique avec Supabase.

## Phase 3 --- Base de données et sécurité

### Étape 3.1 : Créer les migrations

Créer les tables dans un ordre cohérent : 1. profiles et user_roles. 2.
faculties, levels et modules. 3. tutor_profiles. 4. requests et
proposals. 5. bookings. 6. payments. 7. financial_ledger et
tutor_wallets. 8. withdrawal_batches et withdrawals. 9. notifications et
reviews. 10. admin_audit_logs.

### Étape 3.2 : Ajouter les relations

-   Clés étrangères.
-   Contraintes d'unicité.
-   Contraintes CHECK.
-   Index.
-   Suppression logique lorsque nécessaire.

### Étape 3.3 : Configurer RLS

Tester les accès avec : - Un étudiant demandeur. - Un aidant validé. -
Un aidant non validé. - Un administrateur.

### Étape 3.4 : Créer les données initiales

-   Filières.
-   Niveaux.
-   Modules.
-   Paramètres généraux.
-   Compte administrateur initial créé de façon sécurisée.

**Livrable :** base structurée, catalogue initial et politiques d'accès
testées.

## Phase 4 --- Authentification et profils

### Étape 4.1

-   Inscription.
-   Connexion.
-   Déconnexion.
-   Réinitialisation de mot de passe.
-   Vérification e-mail.

### Étape 4.2

-   Création du profil étudiant.
-   Choix de filière et niveau.
-   Vérification du compte.
-   Activation de la demande d'accès au rôle aidant.

### Étape 4.3

-   Validation administrative du profil aidant.
-   Gestion des suspensions.
-   Protection des routes.

**Livrable :** comptes et autorisations fonctionnels.

## Phase 5 --- Catalogue académique

### Étape 5.1

-   Écrans de gestion des filières.
-   Écrans de gestion des niveaux.
-   Écrans de gestion des modules.
-   Activation/désactivation.

### Étape 5.2

-   Formulaire de demande alimenté par le catalogue.
-   Filtrage dynamique filière → niveau → module.
-   Blocage des valeurs non présentes dans la base.
-   Validation serveur de l'identifiant du module.

**Livrable :** aucune création libre de module par les étudiants.

## Phase 6 --- Demandes et propositions

### Étape 6.1

-   Formulaire de publication.
-   Liste des demandes du demandeur.
-   Liste générale pour tous les aidants validés.
-   Filtres.
-   Détail.

### Étape 6.2

-   Acceptation par un aidant.
-   Contre-proposition.
-   Réponse du demandeur.
-   Expiration.
-   Verrouillage concurrent d'une demande.

### Étape 6.3

-   Notifications de proposition.
-   Historique des échanges structurés.

**Livrable :** mise en relation complète sans paiement.

## Phase 7 --- Réservations et séances

-   Création de réservation après accord.
-   Instantané des conditions finales.
-   Calcul du montant total.
-   Gestion du statut de réservation.
-   Annulation selon règles.
-   Confirmation de réalisation.
-   Contestation et intervention admin.

**Livrable :** cycle de réservation complet.

## Phase 8 --- Paiements et comptabilité

### Étape 8.1 : Mode de test

-   Créer un adaptateur de paiement.
-   Simuler les réponses du prestataire en environnement de test.
-   Tester succès, échec, attente et remboursement.
-   Vérifier les montants.

### Étape 8.2 : Intégration réelle

-   Choisir un prestataire compatible avec le Togo.
-   Vérifier l'ouverture d'un compte marchand au nom de l'entité
    exploitante.
-   Vérifier les conditions d'encaissement centralisé.
-   Vérifier les frais, plafonds, délais et procédures de reversement.
-   Intégrer l'API.
-   Vérifier les signatures de webhooks.

### Étape 8.3 : Comptabilisation

-   Enregistrer le paiement.
-   Calculer les 30 % et 70 %.
-   Écrire dans le journal financier.
-   Mettre à jour les soldes dérivés.
-   Envoyer les notifications aux deux étudiants.
-   Gérer l'idempotence.

**Livrable :** paiement vérifiable et répartition financière fiable.

## Phase 9 --- Revenus et reversements hebdomadaires

-   Écran des revenus aidant.
-   Historique des montants dus.
-   Solde en attente.
-   Solde disponible.
-   Création d'un lot hebdomadaire.
-   Contrôle administratif.
-   Enregistrement du transfert.
-   Référence et preuve.
-   Notification à l'aidant.
-   Gestion des échecs et reprises sans double paiement.

**Livrable :** reversement hebdomadaire contrôlé par l'administration.

## Phase 10 --- Administration

-   Tableau de bord.
-   Gestion des utilisateurs.
-   Validation des aidants.
-   Catalogue.
-   Demandes et réservations.
-   Paiements.
-   Commissions.
-   Dettes envers les aidants.
-   Reversements.
-   Litiges.
-   Journaux d'audit.

**Livrable :** administration complète du MVP.

## Phase 11 --- Tests et recette

### Tests fonctionnels

-   Inscription.
-   Connexion.
-   Création de demande.
-   Catalogue prédéfini.
-   Visibilité par tous les aidants.
-   Acceptation et contre-proposition.
-   Acceptation par le demandeur.
-   Paiement.
-   Notification aux deux étudiants.
-   Calcul de commission.
-   Validation de séance.
-   Reversement hebdomadaire.

### Tests de sécurité

-   Un étudiant ne consulte pas les données privées d'un autre.
-   Un aidant ne voit pas les revenus des autres aidants.
-   Un étudiant ne peut pas accéder à l'administration.
-   Un utilisateur ne peut pas modifier son rôle depuis le navigateur.
-   Un aidant non validé ne répond pas aux demandes.
-   Un webhook falsifié est rejeté.
-   Un paiement ne peut pas être crédité deux fois.
-   Un reversement ne peut pas être exécuté deux fois.

### Tests financiers

Pour un paiement de 5 000 FCFA : - Encaissement plateforme : 5 000. -
Commission : 1 500. - Dette aidant : 3 500. - Aucun montant crédité deux
fois. - Après séance validée : 3 500 disponibles. - Après reversement
confirmé : solde disponible diminué de 3 500 et total reversé augmenté
de 3 500.

**Livrable :** procès-verbal de recette et liste des anomalies
corrigées.

## Phase 12 --- Déploiement et lancement

-   Configurer les variables d'environnement.
-   Déployer Next.js.
-   Configurer le projet Supabase de production.
-   Appliquer les migrations.
-   Configurer les URL Auth.
-   Configurer le domaine.
-   Configurer les webhooks du prestataire.
-   Vérifier les logs.
-   Créer le compte administrateur.
-   Importer le catalogue officiel.
-   Effectuer des paiements de test.
-   Former l'administrateur.
-   Ouvrir progressivement aux étudiants.

**Livrable :** plateforme accessible et supervisée.

------------------------------------------------------------------------

# 14. Planning condensé sur 7 jours

  -----------------------------------------------------------------------
  Jour                    Priorité                Résultat attendu
  ----------------------- ----------------------- -----------------------
  J1                      Initialisation,         Application et comptes
                          maquettes, base et Auth opérationnels

  J2                      Profils, rôles,         Étudiants et modules
                          catalogue               prédéfinis

  J3                      Demandes et             Mise en relation
                          propositions            fonctionnelle

  J4                      Réservations et séances Parcours d'accord
                                                  complet

  J5                      Paiement simulé,        Comptabilité
                          commission, revenus     fonctionnelle en test

  J6                      Administration,         Pilotage global
                          reversements simulés,   
                          notifications           

  J7                      Tests, responsive et    MVP démontrable
                          déploiement de          
                          démonstration           
  -----------------------------------------------------------------------

**Important :** le délai de sept jours vise un MVP de démonstration avec
paiement simulé ou environnement sandbox. Le lancement avec de vrais
paiements et reversements dépendra aussi des délais du prestataire, des
validations administratives et des tests financiers. Ne pas sacrifier la
sécurité financière pour tenir artificiellement le délai.

------------------------------------------------------------------------

# 15. Variables d'environnement

Créer `.env.example` :

``` env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

PAYMENT_PROVIDER=
PAYMENT_API_URL=
PAYMENT_API_KEY=
PAYMENT_WEBHOOK_SECRET=
```

Ne jamais mettre les clés privées dans des variables `NEXT_PUBLIC_`. Ne
jamais committer `.env.local`.

------------------------------------------------------------------------

# 16. Stratégie de développement avec un outil de vibe coding

Le cahier des charges doit être fourni à l'outil comme contexte
principal du projet. Il ne faut pas lui demander de construire toute
l'application en une seule instruction.

## 16.1 Règles à imposer à l'outil

1.  Lire le cahier des charges avant toute modification.
2.  Respecter les règles métier et financières.
3.  Utiliser Next.js App Router et TypeScript.
4.  Utiliser Supabase PostgreSQL et RLS.
5.  Ne pas créer de backend Express séparé.
6.  Ne pas inventer de modules : utiliser le catalogue.
7.  Ne pas séparer les comptes demandeur et aidant.
8.  Ne pas donner à l'aidant accès aux fonds de la plateforme.
9.  Ne pas créditer un paiement sur la seule base du navigateur.
10. Ne pas exposer les secrets.
11. Ne pas faire confiance aux données envoyées par le client pour les
    montants.
12. Créer des migrations SQL versionnées.
13. Créer des composants réutilisables.
14. Tester chaque fonctionnalité avant de passer à la suivante.
15. Ne pas remplacer une fonctionnalité backend réelle par de simples
    données statiques sans le signaler.
16. Documenter les fonctionnalités simulées.
17. Ne pas supprimer ou réécrire une fonctionnalité existante sans
    examiner ses dépendances.
18. Faire des commits Git réguliers.

## 16.2 Prompt initial à fournir à l'outil

``` text
Tu es un architecte logiciel senior spécialisé en Next.js,
TypeScript, Supabase et conception de marketplaces.

Tu dois construire une plateforme universitaire de mise
en relation entre étudiants demandeurs d'aide et étudiants
aidants.

Lis intégralement le fichier de cahier des charges fourni
avant de commencer.

Respecte strictement :
- Les règles métier.
- Le modèle de compte étudiant unique.
- Le catalogue de modules prédéfinis.
- La visibilité de toutes les demandes par les aidants validés.
- Le processus de propositions et contre-propositions.
- L'accord obligatoire du demandeur avant paiement.
- L'encaissement de 100 % du paiement par la plateforme.
- La commission de 30 %.
- Les 70 % dus à l'aidant.
- Les reversements hebdomadaires effectués par
  l'administration.
- La confidentialité des montants et données financières.
- La sécurité Supabase RLS.

STACK :
Next.js App Router, TypeScript, Tailwind CSS,
shadcn/ui, Supabase PostgreSQL, Supabase Auth,
Supabase Realtime, React Hook Form et Zod.

Ne développe pas tout en une seule fois.

Commence par :
1. Analyser le cahier des charges.
2. Présenter l'architecture proposée.
3. Identifier les éventuelles ambiguïtés.
4. Établir la structure des dossiers.
5. Préparer les migrations de base de données.
6. Préparer les politiques RLS.
7. Présenter les tests nécessaires.

Attends la validation de cette première étape avant
de développer les interfaces et les fonctionnalités.

Utilise des données réelles provenant de Supabase
dès que le backend est disponible.

Toute fonctionnalité non encore connectée doit être
clairement identifiée comme simulation.
```

## 16.3 Ordre des prompts de développement

Développer ensuite dans cet ordre :

1.  « Initialise le projet et configure Supabase. »
2.  « Crée les migrations et les politiques RLS. »
3.  « Développe l'authentification et les profils. »
4.  « Développe l'administration du catalogue académique. »
5.  « Développe la publication et la consultation des demandes. »
6.  « Développe les propositions et contre-propositions. »
7.  « Développe les réservations et leur cycle de vie. »
8.  « Développe les paiements avec un prestataire simulé. »
9.  « Développe le journal financier et les commissions. »
10. « Développe les revenus aidants et les reversements hebdomadaires. »
11. « Développe les notifications. »
12. « Développe le tableau de bord administrateur. »
13. « Effectue les tests fonctionnels, de sécurité et financiers. »
14. « Prépare le déploiement. »

Après chaque étape, demander à l'outil : - Quels fichiers ont été créés
ou modifiés ? - Quelles migrations ont été ajoutées ? - Quelles règles
de sécurité sont actives ? - Quels tests ont été exécutés ? - Quelles
fonctionnalités sont encore simulées ?

------------------------------------------------------------------------

# 17. Critères de réussite du MVP

Le MVP est considéré comme prêt pour une démonstration lorsque :

-   Un étudiant peut créer un compte.
-   Un étudiant peut être demandeur et aidant avec le même compte.
-   L'administration peut valider un aidant.
-   L'administration peut gérer le catalogue.
-   Un demandeur ne peut sélectionner qu'un module prédéfini.
-   Tous les aidants validés voient les demandes ouvertes.
-   Un aidant peut répondre à une demande.
-   Le demandeur peut accepter ou refuser une contre-proposition.
-   Une seule réservation peut être confirmée pour une demande.
-   Le demandeur ne peut payer qu'après accord.
-   Le paiement est enregistré une seule fois.
-   Les deux étudiants reçoivent la notification de paiement.
-   Les 30 % et 70 % sont calculés correctement.
-   L'aidant voit uniquement ses montants dus.
-   L'administration voit l'ensemble des encaissements et obligations.
-   Les séances peuvent être validées ou contestées.
-   L'administration peut préparer et enregistrer les reversements
    hebdomadaires.
-   Les opérations financières sont historisées.
-   Les contrôles RLS et les tests d'accès sont concluants.

------------------------------------------------------------------------

# 18. Points à confirmer avant la production réelle

Les éléments suivants doivent être validés par l'établissement et/ou le
prestataire de paiement :

1.  Quelle entité juridique ou personne morale détient le compte
    marchand qui reçoit la totalité des paiements ?
2.  Le prestataire autorise-t-il explicitement l'encaissement centralisé
    pour ce modèle de marketplace ?
3.  Les frais de paiement sont-ils supportés par la plateforme ou
    intégrés au prix ?
4.  Quel jour de la semaine les reversements sont-ils exécutés ?
5.  Existe-t-il un seuil minimum de reversement ?
6.  Quel est le délai de validation d'une séance ?
7.  Quelle est la politique d'annulation et de remboursement ?
8.  Quel mécanisme prouve l'appartenance d'un étudiant à l'établissement
    ?
9.  Quelles coordonnées Mobile Money sont acceptées pour les
    reversements ?
10. Quelles obligations comptables, fiscales et réglementaires
    s'appliquent à l'activité ?

Ces points ne doivent pas être inventés par l'outil de vibe coding.

------------------------------------------------------------------------

# 19. Documentation officielle

-   Next.js : https://nextjs.org/docs
-   Next.js App Router : https://nextjs.org/docs/app
-   Supabase : https://supabase.com/docs
-   Supabase avec Next.js :
    https://supabase.com/docs/guides/auth/server-side/nextjs
-   Supabase Row Level Security :
    https://supabase.com/docs/guides/database/postgres/row-level-security
-   Supabase Realtime : https://supabase.com/docs/guides/realtime
-   shadcn/ui : https://ui.shadcn.com/docs
-   Tailwind CSS : https://tailwindcss.com/docs

------------------------------------------------------------------------

# Conclusion

La plateforme doit être développée comme une marketplace universitaire
avec une gestion financière centralisée.

Le principe essentiel est le suivant :

**Les étudiants créent les demandes et les propositions. La plateforme
organise la mise en relation, encaisse les paiements, comptabilise les
commissions et les montants dus. L'administration contrôle les fonds et
effectue les reversements hebdomadaires.**

Le catalogue académique est administré par l'école et les étudiants ne
peuvent sélectionner que des modules prédéfinis.

Un étudiant peut à tout moment être demandeur, aidant ou les deux.

Ce document constitue la référence fonctionnelle et technique du projet.
Toute décision de développement doit rester cohérente avec ces règles.
