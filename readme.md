# 📘 Gestion des Entités – CRUD Angular

Ce projet gère plusieurs entités (owners, tenants, buildings, apartments, rentals, recoveries) avec une structure et un design cohérents.

---

## 📂 Structure des dossiers

Chaque entité possède son propre dossier dans `src/app/demo/admin-page/` :

```
src/app/demo/admin-page/<entity>/
│── <entity>.component.ts
│── <entity>.component.html
│── <entity>.component.scss
│── <entity>-detail.component.ts
│── <entity>-detail.component.html
│── <entity>-detail.component.scss
│── <entity>-new.component.ts
│── <entity>-new.component.html
│── <entity>-new.component.scss
│── <entity>.service.ts
```

Par exemple, pour `owners` :
```
src/app/demo/admin-page/owners/
│── owners.component.ts
│── owners.component.html
│── owners.component.scss
│── owners-detail.component.ts
│── owners-detail.component.html
│── owners-detail.component.scss
│── owners-new.component.ts
│── owners-new.component.html
│── owners-new.component.scss
│── owners.service.ts
```

---

## ⚡ Fonctionnalités CRUD (applicable à toutes les entités)

### 1. **Liste (`<entity>.component`)**
- Colonnes adaptées à l’entité (exemple pour owners : Nom, Email, Téléphone, Ville, Date d’inscription).  
- **Pas de colonne Actions** : clic sur une ligne (`<tr>`) ouvre la page détail.  
- **Améliorations UX** :  
  - Effet *hover* (fond gris clair).  
  - Curseur `pointer`.  
- **Header** : bouton “+ Nouveau <entity>” → redirige vers `<entity>-new`.  

### 2. **Ajout (`<entity>-new.component`)**
- Formulaire avec champs spécifiques à l’entité.  
- Inputs avec **design underline**.  
- Validation avec **messages d’erreur clairs**.  
- Boutons : **Annuler** et **Créer**.  
- Sauvegarde en `localStorage` via `<entity>.service.ts`.  

### 3. **Détail (`<entity>-detail.component`)**
- Affichage lecture seule par défaut.  
- Bouton **Modifier** → passe en mode **édition inline**.  
- En mode édition :  
  - **Enregistrer** → update dans `localStorage`.  
  - **Annuler** → retour lecture seule.  

### 4. **Service (`<entity>.service.ts`)**
CRUD basé sur `localStorage` :  
- `get<Entity>()`  
- `get<Entity>ById(id)`  
- `create<Entity>(data)`  
- `update<Entity>(data)`  
- `delete<Entity>(id)`  

---

## 🎨 Design & UX unifiés

- **Styles globaux** : `form-styles.scss`.  
- **Composants visuels** :  
  - `.page-header` : titre + actions.  
  - `.content-container` : carte avec fond blanc.  
  - `.form-card` : sections avec titres et icônes.  
- Inputs **underline** :  
  - Bordure uniquement en bas.  
  - Focus bleu (`blue-500`).  
- Responsive : grilles fluides (`grid-template-columns`).  
- Cohérence entre toutes les entités :  
  - Navigation au clic (pas de boutons *eye/edit/delete*).  
  - Inline edit dans les pages détail.  

---

## ✅ Exigences globales appliquées à toutes les entités

- Pas de boutons *Actions* → navigation directe par clic.  
- Inline edit dans les pages détail.  
- Inputs modernisés (underline + focus bleu).  
- Validation avec messages d’erreur.  
- CRUD complet en `localStorage`.  
- Design unifié et responsive.  

---

## 📦 Entités prises en charge

- **Owners (Propriétaires)**  
- **Tenants (Locataires)**  
- **Buildings (Bâtiments)**  
- **Apartments (Appartements)**  
- **Rentals (Locations)**  
- **Recoveries (Recouvrements)**  

⚡ Objectif : CRUD complet, ergonomique, moderne et homogène sur toutes les entités.
