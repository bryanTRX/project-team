#!/bin/bash

echo "🚀 Installation des dépendances pour le projet Angular + NestJS"

# --- Backend ---
if [ -f "backend/package.json" ]; then
  echo -e "\n📦 Installation des packages backend..."
  cd backend
  npm install
  cd ..
else
  echo -e "\n⚠️ Aucun package.json trouvé dans backend/"
fi

# --- Frontend ---
if [ -f "frontend/package.json" ]; then
  echo -e "\n📦 Installation des packages frontend..."
  cd frontend
  npm install
  cd ..
else
  echo -e "\n⚠️ Aucun package.json trouvé dans frontend/"
fi

echo -e "\n✅ Installation terminée !"
echo "Pour lancer le projet :"
echo "  - Backend : cd backend && npm run start:dev"
echo "  - Frontend : cd frontend && ng serve"
