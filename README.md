# Shield of Athena – Website Rebuild  
**Morgan Stanley Montréal Hackathon 2025**

This project was built in 4 days during the Morgan Stanley Montréal Hackathon. Our team redesigned the website for Shield of Athena, a nonprofit supporting women, children, and ethnocultural communities through education, intervention, and prevention services.

---

## Overview

Our objective was to deliver a modern, accessible, multilingual, and easy-to-maintain website that better represents the organization’s mission.

Key principles:
- Clear and intuitive navigation  
- Mobile-first and accessible (WCAG AA)  
- Support 8 languages
- Maintainability for non-technical staff   


Below are example before / after comparisons that highlight the design improvements we delivered. 

| View | Before | After |
|---|---:|---:|
| Homepage | ![Before - Homepage](frontend/public/images/home_before.png) | ![After - Homepage](frontend/public/images/home_after.png) |
| Programs and Services | ![Before - Programs](frontend/public/images/programs_before.png) | ![After - Programs](frontend/public/images/programs_after.png) |
| Mobile (responsive) | ![Before - Mobile](frontend/public/images/mobile_before.png) | ![After - Mobile](frontend/public/images/mobile_after.png) |

---

## Tech Stack

- **Backend** : NestJS v11, TypeScript
- **Frontend** : Angular v20, TypeScript
- **Runtime** : Node.js (recommandé v22.x ou v20.19.0 pour compatibilité avec Angular CLI)
- **Tests** : Jest (backend), Karma/Jasmine (frontend)
  
---

## Installation & Local Setup

Note: The Angular CLI used in this project requires Node >= v20.19 or v22.12+.

```bash
cd backend
npm install
npm run start:dev
```

The frontend should be started in its own terminal so it can run alongside the backend.

```bash
cd frontend
npm install
npm run start
```

## Useful quick commands

Install dependencies for both projects:

```bash
# from repo root
cd backend && npm install && cd ../frontend && npm install && cd ..
```

Start both services using the included helper (installs deps if missing, then starts backend + frontend):

```bash
# from repo root
node setup-and-start.js
```

Start backend only (dev + watch):

```bash
cd backend
npm run start:dev
```

Start frontend only (use npx to avoid requiring a global Angular CLI):

```bash
cd frontend
npx ng serve
# or if you have the Angular CLI installed globally: npm run start
```

Start both in parallel without the helper (alternative using concurrently):

```bash
# install concurrently once (global or in the repo root as a dev dep)
npm install -g concurrently
# then from repo root
npx concurrently "cd backend && npm run start:dev" "cd frontend && npx ng serve"
```

Backend (NestJS)

```bash
cd backend
npm install                # install backend deps
npm run start:dev          # start in watch/dev mode (http://localhost:3000)
npm run build              # production build (outputs to dist/)
npm run test               # run unit tests (Jest)
npm run test:e2e           # run e2e tests
npm run format             # run Prettier formatting for backend TS files
npm run lint               # eslint and autofix
```

Frontend (Angular)

```bash
cd frontend
npm install                # install frontend deps
npm run start              # ng serve (dev server on http://localhost:4200)
npm run build              # production build (dist/)
npm run test               # run frontend unit tests (Karma/Jasmine)
npm run format             # run Prettier formatting for frontend files
```

