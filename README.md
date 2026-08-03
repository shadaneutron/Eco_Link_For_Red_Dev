<img width="1902" height="877" alt="image" src="https://github.com/user-attachments/assets/bf894cd6-812e-4844-9131-7d8c76aeee8d" /># Eco Link

An AI-powered B2B Circular Economy Platform that connects factories, recycling companies, and logistics providers through one unified digital ecosystem.

Eco Link helps industrial organizations manage waste more efficiently by providing a centralized marketplace, digital compliance tools, shipment tracking, and sustainability reporting.

---

# Project Overview

Industrial waste management is often fragmented, relying on manual communication, paper-based documentation, and disconnected stakeholders.

Eco Link addresses these challenges by providing a scalable platform that enables:

- Digital waste management
- AI-assisted material classification
- B2B marketplace and auctions
- Logistics coordination
- Regulatory compliance
- ESG & sustainability reporting

The project follows a modular architecture that allows each stakeholder to access a dedicated workspace while sharing the same platform and design system.

---

# Project Structure

```text
Eco_Link_For_Red_Dev/

├── frontend/          # React Frontend codebase
├── backend/           # Django Backend codebase
├── design/            # UI/UX Design Assets (Figma designs & PDFs)
├── docs/              # Project Documentation
├── assets/            # Logos, icons, and branding media
├── README.md          # Project guide
└── .gitignore         # Global Git ignore rules
```

---

# Frontend Structure

The current structure of the React frontend codebase is organized around component-driven modules:

```text
frontend/
│
├── src/
│   ├── components/
│   │     ├── authentication/  # Login screen and auth forms
│   │     ├── factory/         # Factory dashboard, waste upload, listings, and tracking
│   │     ├── recycler/        # Recycler dashboard, bidding page, catalog, and auctions
│   │     ├── logistics/       # Logistics fleet and dispatch dashboards
│   │     ├── subscription/    # Pricing plans, checkout pages, and upgrade flows
│   │     ├── onboarding/      # Walkthrough and user setup prompts
│   │     └── settings/        # Portal configurations and settings pages
│   ├── App.tsx                # Application shell and view routing manager
│   ├── index.css              # Global styles and tailwind system setup
│   ├── main.tsx               # Client entry mount point
│   └── types.ts               # Shared TypeScript interface models
│
└── package.json
```

*Note: Frontend page segmentation, custom hooks, services (API client integration), global context management, and routing setups are planned to be expanded as the implementation transitions from UI mockup to full API integration.*

---

# Backend Structure

The backend directory contains the configuration files and the base system setup:

```text
backend/
│
├── config/                  # Core settings, configurations, and URL entry points
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py / asgi.py
│
├── core/                    # Core module status validation and starter endpoints
│   ├── views.py             # System status health endpoints
│   ├── models.py
│   ├── apps.py
│   └── admin.py
│
├── manage.py                # Django CLI management entry point
├── requirements.txt         # Django dependency index
└── .env.example             # Template for backend settings
```

*Note: Pluggable Django business apps (`authentication`, `factory`, `recycler`, `logistics`, `marketplace`, `shipments`, `reports`, `subscriptions`, `users`) will be initialized in the `apps/` directory in the next integration phase.*

---

# Architecture

The project follows a modular architecture where each stakeholder has an independent workspace while sharing the same backend infrastructure.

### Factory Module

- **Dashboard**: Live telemetry of generated waste, bids, active shipments, and savings.
- **Waste Management**: Listing creation, material category assignment, and volume logs.
- **Marketplace**: Bidding status interface and listing catalogs.
- **Shipments**: Live shipping manifest tracking and EEAA status indicators.
- **Reports**: Analytics charts for monthly waste production and recycling yields.

### Recycler Module

- **Marketplace**: Recycled material catalog with auction grids and search filters.
- **Bidding System**: Live bid placing forms with historical pricing records.
- **Won Auctions**: Detailed logs of successful listings and pickup instructions.
- **Shipments**: Delivery manifests and recycler receiving confirmation forms.
- **Reports**: Carbon tracking offset charts and processing logs.

### Logistics Module

- **Dashboard**: Fleet tracking, active manifests, and delivery statistics.
- **Assigned Shipments**: Manifest assignment records.
- **Shipment Tracking**: Status updates, checkpoint logs, and delivery signature forms.
- **Delivery Confirmation**: Waste delivery manifests signed digitally.
- **Reports**: Route fuel efficiency reports and delivery time metrics.

---

# Tech Stack

## Frontend

- **React** (v18+)
- **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling Framework)
- **React Router** (Navigation flows)

## Backend

- **Django** (v5.x+)
- **Django REST Framework** (API Layer)

## Design

- **Figma**

---

# Environment Setup

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Backend

```bash
cd backend

python -m venv .venv
```

Windows

```powershell
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
python manage.py migrate
```

Run server

```bash
python manage.py runserver
```

---

# How to Run

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

### Backend

```bash
cd backend

python -m venv .venv

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

> **Note**
>
> The backend currently contains the initial project architecture and environment setup. Business logic and REST API implementation are planned for future development.

---

# Screenshots

## Onboarding

<img width="1900" height="717" alt="image" src="https://github.com/user-attachments/assets/36908963-d0aa-4e88-b11e-d41e2e68ed7e" />
<img width="1457" height="841" alt="image" src="https://github.com/user-attachments/assets/fb3dc8fc-59ad-44c9-9583-1e8ed8ae7545" />
<img width="1030" height="785" alt="image" src="https://github.com/user-attachments/assets/6cfe2c8f-a043-463b-80c2-aa0ff69de69b" />

## Subscriptions
<img width="1122" height="877" alt="image" src="https://github.com/user-attachments/assets/2c85ff2c-1970-4010-95a7-8989d1e71253" />
<img width="727" height="681" alt="image" src="https://github.com/user-attachments/assets/dbd57f8c-84ad-4942-9087-995d236579db" />


## Login
<img width="1901" height="876" alt="image" src="https://github.com/user-attachments/assets/a357a2d8-d207-444b-82c2-17af133417de" />


---

## Factory Dashboard
<img width="1917" height="877" alt="image" src="https://github.com/user-attachments/assets/bb88b7bb-d7b9-4066-a152-93c5233d164b" />
<img width="1917" height="871" alt="image" src="https://github.com/user-attachments/assets/2ed78e90-aba1-429e-816d-2f2a04870a71" />


---

## Marketplace

<img width="1902" height="877" alt="image" src="https://github.com/user-attachments/assets/610298d3-3d2d-4ad5-890b-7bc37f1610d8" />


---

## Recycler Dashboard
<img width="1917" height="872" alt="image" src="https://github.com/user-attachments/assets/6988ddbf-23e7-4f9b-a30e-9493622803e6" />



---

## Logistics Dashboard

<img width="1916" height="783" alt="image" src="https://github.com/user-attachments/assets/1f305d8b-517e-467d-b289-f6c6b64b62d3" />


---

## Reports

<img width="1917" height="878" alt="image" src="https://github.com/user-attachments/assets/d64dbd80-8ce7-42c2-9763-27e3802aa22d" />


---

# Development Status

### Completed

- UI/UX Design
- Design System
- User Flow Diagrams
- Frontend Project Structure & UI Pages (Recycler, Factory, Logistics, Subscriptions, and Login views)
- Backend Initial Architecture (CORS settings, REST framework integration, SQLite config, Dotenv loader)
- React Project Setup
- Django Project Setup

### In Progress

- Frontend Mock State Management
- Backend Pluggable Apps Setup
- API Integration Planning

### Planned

- Authentication & Authorization
- AI Waste Classification
- Marketplace Engine
- Shipment Management
- ESG Reporting
- Payment Integration
- Carbon Credit Services

---

# Repository

This repository contains:

- Initial Frontend Structure
- Initial Backend Structure
- Design Assets
- Documentation
- Project Architecture
- Environment Configuration

---

# License

**All Rights Reserved**

Copyright © 2026 Eco Link.

This repository and its contents are proprietary.

No part of this project may be copied, modified, distributed, published, sublicensed, or used for commercial or non-commercial purposes without prior written permission from the project owners.
