Write-Host "🚀 Installation des dépendances pour le projet Angular + NestJS" -ForegroundColor Cyan

# --- Backend ---
if (Test-Path "backend/package.json") {
    Write-Host "`n📦 Installation des packages backend..." -ForegroundColor Green
    Push-Location backend
    npm install
    Pop-Location
} else {
    Write-Host "⚠️ Aucun package.json trouvé dans backend/" -ForegroundColor Yellow
}

# --- Frontend ---
if (Test-Path "frontend/package.json") {
    Write-Host "`n📦 Installation des packages frontend..." -ForegroundColor Green
    Push-Location frontend
    npm install
    Pop-Location
} else {
    Write-Host "⚠️ Aucun package.json trouvé dans frontend/" -ForegroundColor Yellow
}

Write-Host "`n✅ Installation terminée !" -ForegroundColor Cyan
Write-Host "Pour lancer le projet :"
Write-Host "  - Backend : cd backend && npm run start:dev"
Write-Host "  - Frontend : cd frontend && ng serve"
