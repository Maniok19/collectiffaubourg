# Collectif Faubourg – Site Web

Site vitrine (frontend statique) + petit backend Node.js (gestion des événements via `events.json`).  
Objectif : présenter les spectacles / projets (Souffle, Clochettes, Indika, etc.), diffuser l’agenda et permettre une mise à jour simple.

---

## 1. Structure du dépôt

```
frontend/          Pages HTML statiques + JS + CSS + médias
  index.html
  agenda.html
  admin.html       (interface d’admin pour les évènements, si activée)
  script.js
  styles.css
  public/          Images, PDF, GIF, favicon, documents
backend/
  server.js        Serveur Node/Express (API événements)
  events.json      Données des événements (format JSON)
  .env             Variables d'environnement (non commité en prod idéalement)
README.md
```

---

## 2. Fonctionnalités (actuelles ou prévues)

- Pages statiques thématiques (spectacles, agenda, contact)
- Fichiers médias organisés par projet
- Agenda dynamique (lecture depuis `events.json` via backend)
- (Optionnel) Interface d’admin (`admin.html`) pour ajouter / éditer des événements
- Ressources optimisées pour un hébergement simple (Nginx + Node ou tout statique + API)

---

## 3. Stack technique

| Partie      | Détails |
|-------------|---------|
| Frontend    | HTML5, CSS3, JavaScript vanilla |
| Backend     | Node.js + Express (fichier unique `server.js`) |
| Données     | Fichier JSON (`events.json`) |
| Déploiement | Linux (Debian/Ubuntu), PM2 ou Docker, Nginx reverse proxy |

---

## 4. Prérequis

- Node.js ≥ 18 LTS
- npm ≥ 9
- Git
- (Prod) Nginx ou équivalent reverse proxy
- (Optionnel) PM2 ou Docker

Vérifier les versions :
```bash
node -v
npm -v
```

---

## 5. Installation (développement)

```bash
git clone <URL_DU_DEPOT> collectiffaubourg
cd collectiffaubourg/backend
npm install
```

Créer (ou vérifier) le fichier `.env` :
```
# PORT=3000
# CORS_ORIGIN=https://www.monsite.fr   # si nécessaire
# ADMIN_TOKEN=changer_ce_token_securise
# ADMIN_PASSWORD=faubourg123
# SESSION_SECRET=a-long-random-string
# PORT=4000

```

Lancer le backend :
```bash
npm start
# ou si script non défini :
node server.js
```

Ouvrir le frontend :  
Option 1 : servir le dossier `frontend/` tel quel via un serveur statique (ex: Live Server VS Code).  
Option 2 : Configurer Express pour servir aussi le statique (ajouter `app.use(express.static('../frontend'))`).  

---

## 6. Fichier `events.json`

Format attendu (exemple) :
```json
[
  {
    "id": "evt-2025-01",
    "date": "2025-03-14",
    "heure": "20:30",
    "lieu": "Salle des Fêtes – Ville",
    "titre": "Souffle",
    "description": "Concert immersif",
  }
]
```

Bonnes pratiques :
- Garder des IDs stables
- Utiliser ISO 8601 pour les dates (`YYYY-MM-DD`)
- Valider avant commit (outil JSON lint)

---

## 7. Backend (API)

Endpoints (à confirmer selon `server.js` réel) :

| Méthode | Route         | Description                     | Auth |
|---------|---------------|---------------------------------|------|
| GET     | /api/events   | Liste des événements            | Non  |
| POST    | /api/events   | Ajoute un événement             | Oui  |
| DELETE  | /api/events/:id | Supprime un événement         | Oui  |

Auth simple possible via `ADMIN_TOKEN` (en-tête `Authorization: Bearer <token>`).  
TODO: Vérifier et ajuster selon le code réel.

---

## 8. Déploiement (Linux + Nginx + PM2)

1. Cloner et installer :
```bash
git clone <URL_DU_DEPOT> /var/www/collectiffaubourg
cd /var/www/collectiffaubourg/backend
npm ci
```

2. Config `.env` (non commité) :
```
# PORT=3000
# CORS_ORIGIN=https://www.monsite.fr   # si nécessaire
# ADMIN_TOKEN=changer_ce_token_securise
# ADMIN_PASSWORD=faubourg123
# SESSION_SECRET=a-long-random-string
# PORT=4000
```

3. PM2 :
```bash
npm install -g pm2
pm2 start server.js --name faubourg
pm2 save
pm2 startup
```

4. Nginx (exemple `/etc/nginx/sites-available/faubourg.conf`) :
```
server {
  server_name exemple.org www.exemple.org;
  root /var/www/collectiffaubourg/frontend;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location / {
    try_files $uri $uri/ =404;
  }
}
```
Activer :
```bash
sudo ln -s /etc/nginx/sites-available/faubourg.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. Certificat HTTPS (Let’s Encrypt) :
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d exemple.org -d www.exemple.org
```

---

## 9. Déploiement (Option Docker)

Créer un `Dockerfile` (exemple minimal) :
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/. .
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
```

Servir le frontend via Nginx ou un CDN, et l’API conteneurisée.

---

## 10. Sécurité & Maintenance

- Ne pas exposer `ADMIN_TOKEN`
- Sauvegarder régulièrement `events.json`
- Ajouter un contrôle de schéma (ex: `ajv`) pour valider les entrées
- Activer compression + cache statique (Nginx)
- Minifier images (optimisation Core Web Vitals)

---

## 11. Améliorations possibles

- Internationalisation (FR/EN)
- Passage à un petit CMS headless (Strapi / Directus) si le volume augmente
- Génération statique (Eleventy / Astro) avec build automatisé
- Tests automatisés (Jest) pour les endpoints
- Accessibilité (audit Lighthouse)

---

## 12. Scripts npm (à compléter)

Dans `package.json` (si absent) :
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "lint": "eslint ."
  }
}
```

---

## 13. Contribution

1. Créer une branche : `git checkout -b feature/agenda`
2. Commits clairs : `feat(agenda): ajout tri chronologique`
3. Pull request + revue

---

## 14. Licence

Ajouter fichier `LICENSE` (ex: MIT ou autre) si distribution publique.

---

## 15. Crédit

Collectif du Faubourg – Tous droits réservés.  
Logos, photos et documents : propriété de leurs auteurs, ne pas réutiliser sans autorisation.

---

## 16. Résumé express (TL;DR)

```bash
# Backend
cd backend
cp .env.example .env   # si fourni
npm install
npm start

# Frontend
Ouvrir frontend/index.html dans un serveur statique

# Prod
PM2 + Nginx (proxy /api vers Node)
```

---

Pour ajustements, fournir le contenu de `server.js` si vous voulez une section API