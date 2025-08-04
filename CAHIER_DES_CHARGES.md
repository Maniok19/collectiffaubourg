# Cahier des charges — Site Web du Collectif du Faubourg

## 1. Présentation générale

### **Objectif du site**
**Mettre en valeur les activités artistiques du Collectif du Faubourg** : spectacles, événements jeunes publics, projets ponctuels, avec un espace d'information pratique (**agenda, contact**).

### **Public visé**
**Spectateurs, programmateurs, structures culturelles, écoles, familles.**

---

## 2. Arborescence & Contenu

### **Menu principal (Header)**
- **Titre/logo en haut à gauche** : "Le Collectif du Faubourg" *(modulable dans le back-office)*

### **Navigation (6 onglets)**
1. **Le Faubourg** *(Présentation du collectif)*
2. **Spectacles**
3. **Jeune Public**
4. **Ensemble**
5. **Agenda**
6. **Contact**

---

## 3. Pages détaillées

### **1. Le Faubourg**
- **Texte de présentation**
- **Possibilité d'ajouter photos/vidéos**

### **2. Spectacles**
- **Page d'accueil** :
  - **Grille de photos cliquables** (une par spectacle)
  - **En dessous de chaque photo : titre du spectacle**
  - **Disposition type grille responsive** (3 par ligne desktop / 1-2 mobile)
- **Page détail d’un spectacle** *(template unique réutilisable)* :
  - **Galerie photos**
  - **Teaser vidéo** (YouTube/Vimeo intégré)
  - **Texte de description**
  - **Liens SoundCloud** (lecteurs intégrés)
  - **Agenda spécifique lié au spectacle**

### **3. Jeune Public**
- **Liste de spectacles pour enfants**
- **Possibilité de scinder par âges ou thématiques**
- **Chaque projet redirige vers une fiche spectacle** (même template)

### **4. Ensemble**
- **Mise en avant des événements ponctuels** (résidences, ateliers, performances hors spectacles)
- **Affichage par articles visuels** (affiches, mini-galeries, descriptions)
- **Option d'ajouter un lien externe ou un PDF**

### **5. Agenda**
- **Calendrier dynamique** (intégration type FullCalendar ou Google Calendar)
- **Modifiable via back-office**
- **Possibilité de filtrer par spectacle / jeune public / événement ponctuel**

### **6. Contact**
- **Affichage simple** :
  - **Téléphone**
  - **Email**
  - **Réseaux sociaux** (icônes)
  - **Formulaire de contact** (facultatif)

---

## 4. Design

### **Identité visuelle**
- **Style artistique et épuré**
- **Palette** : tons neutres (blanc/noir/gris) + accent coloré pour chaque section
- **Police lisible, moderne**, avec style créatif pour les titres

#### **Suggestions :**
- **Design "affiche de théâtre"** : typographie expressive
- **Animation légère au survol des images**
- **Responsive (mobile-first)**

---

## 5. Fonctionnalités back-office (admin)

- **Accessible via identifiant sécurisé** (CMS simplifié ou framework sur mesure)
- **Fonctions principales** :
  - **Modifier le titre/logo**
  - **Gérer l’agenda** (ajouter/modifier/supprimer événements)
  - **Ajouter / modifier / supprimer fiches spectacles**
  - **Ajouter des articles dans la section Ensemble**
  - **Ajouter du contenu dans Jeune Public**

---

## 6. Ressources nécessaires

**Fournies par le collectif** :
- **Textes de présentation**
- **Photos des spectacles**
- **Vidéos teaser** (liens YouTube ou fichiers)
- **Liens SoundCloud**
- **Affiches / visuels événementiels**
- **Agenda prévisionnel**

---

## 7. Technologies recommandées

### **Front-end**
- **HTML5 / CSS3 / JS**

### **Back-end**
- **Python Flask**
- **Admin sécurisé pour les mises à jour**

### **Autres**
- **Intégration de** :
  - **YouTube/Vimeo**
  - **SoundCloud**
  - **FullCalendar**
  - **Design responsive**