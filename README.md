# 🥇 TeleSport Olympics

Cette application Angular permet de visualiser les performances des pays aux Jeux Olympiques.
Elle affiche les participations, le nombre d’athlètes et de médailles, ainsi que des graphiques interactifs (via ngx-charts).

## 🚀 Installation & lancement

### 1. Cloner le projet

`bash
    git clone [<url-du-repo>](https://github.com/ThomasLebel/telesport-olympics.git)
    cd telesport-olympics
`

### 2. Installer les dépendances

`bash
    npm install
`

### 3. Lancer l’application en mode développement

`bash
ng serve

`
Puis ouvrir http://localhost:4200 dans le navigateur.

### 4. Build pour la production

`bash
ng build

`

## 🛠️ Fonctionnement du code

- **Gestion des données**

  - Les données olympiques sont fournies via un Observable (olympics$).
  - Sur la page d'accueil, l'app calcule :

    - Le nombre total de JOs
    - Le nombre de pays
    - Les données du graphique circulaire avec le nombre de médailles reçues par pays

  - Lorsqu’un pays est sélectionné, l’app calcule :
    - Le nombre total de médailles,
    - Le nombre total d’athlètes,
    - Les données du graphique en ligne avec le nombre de médailles reçues par année du pays sélectionné

- **Gestion des erreurs**
  Si l'utilisateur essaie d'accéder à une route inexistante ou à un pays qui n'est pas présent dans les données, il est redirigé vers une page d'erreur.

- **Composants réutilisables**

  - Un composant Loader est utilisé pour l’affichage lors du chargement des données.
  - Les graphiques sont générés avec ngx-charts.

## 📂 Structure principale

`bash
src/app/
├─ pages/               # Pages principales (Details, NotFound…)
├─ shared/components/   # Composants réutilisables (Loader…)
├─ app-routing.module.ts # Configuration des routes
└─ app.component.ts      # Composant racine
`

## ✅ Technologies utilisées

    * Angular 18
    * RxJS
    * ngx-charts
    * TypeScript
