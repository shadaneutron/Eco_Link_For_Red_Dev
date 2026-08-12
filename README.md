# Eco Link Enterprise — B2B Circular Economy Platform

[![Docker Build & Deploy CI/CD](https://github.com/shadaneutron/Eco_Link_For_Red_Dev/actions/workflows/docker-ci-cd.yml/badge.svg)](https://github.com/shadaneutron/Eco_Link_For_Red_Dev/actions/workflows/docker-ci-cd.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-h0neybee.online-006A6A?style=flat&logo=target)](https://h0neybee.online/)

An AI-powered, enterprise-grade B2B Circular Economy Platform that connects industrial waste generators (**Factories**), certified **Recyclers**, and **Logistics** fleet operators into a unified, audit-ready digital ecosystem fully compliant with **Egyptian Environmental Law No. 202**.

---

## 🌟 1. Project Overview

**Eco Link** digitalizes and automates industrial waste recovery, tracing, and bidding. Through automated image classification, role-gated escrow bidding, logistics tracking, and tamper-evident Digital Product Passports (DPP), the platform transforms complex regulatory compliance into a streamlined, secure transaction engine.

### Live Production Deployment
* **Web Portal (React UI)**: [https://h0neybee.online/](https://h0neybee.online/)
* **Backend API Checkpoint**: [https://h0neybee.online/api/status/](https://h0neybee.online/api/status/)
* **Django Admin Console**: [https://h0neybee.online/admin/](https://h0neybee.online/admin/)

---

## ⚠️ 2. Problem & Solution

### The Problem
Traditional B2B waste management in Egypt is highly fragmented, opaque, and prone to regulatory violations under **Egyptian Environmental Law No. 202** (which mandates strict manifesting, licensing, and reporting for industrial solid waste). Furthermore:
* Waste classification is manual and error-prone.
* Open bidding portals suffer from price-collusion and lack of trust.
* Paper waybills are easily falsified, exposing companies to massive compliance liabilities.
* CO2 offset reporting for corporate sustainability (ESG) is virtually non-existent.

### The Solution
**Eco Link** provides a fully integrated digital solution:
1. **AI-Driven Compliance**: Automatic waste classification using vision AI to pre-populate EWC codes and hazard profiles.
2. **Escrow Bidding Portals**: Fully anonymous sealed bidding ensuring compliance and preventing bidder collusion.
3. **Immutable Chain-of-Custody**: State-machine logistics waybills with digital signatures and validation.
4. **Digital Product Passports (DPP)**: Tamper-evident transaction certificates generating real-time ESG metrics (CO2 avoidance).

---

## ⚡ 3. Core Platform Features

* **Vision AI Classifier**: Upload waste photographs to instantly analyze material categories, assess hazards, and retrieve European Waste Catalogue (EWC) codes.
* **Anonymous Escrow Auctions**: Bidder identities remain redacted until a bid is officially accepted, transitioning funds to a secure platform escrow.
* **Logistics State Machine**: Fleet operators dispatch drivers and track manifests through a strict multi-state verification process (`Pending` → `Assigned` → `Ready for Pickup` → `Picked Up` → `In Transit` → `Delivered` → `Confirmed`).
* **Digital Product Passport (DPP)**: Immutable audit record linking generator, recycler, transporter, transaction details, and environmental impact metrics.
* **ESG Performance Analytics**: Real-time reporting showing total tons recycled, CO2 footprint avoided, and recycling efficiency indexes.

---

## 👥 4. User Roles & Visibility Rules

The platform enforces 4 strict role definitions to maintain data integrity and regulatory compliance:

| User Role | Dashboard Access | Core Capabilities & Data Visibility |
| :--- | :--- | :--- |
| **Factory** (`factory`) | `FactoryDashboard` | Creates and publishes waste listings; sets reserve pricing; views incoming **anonymous** bids (identities masked); accepts bids; tracks shipments. |
| **Recycler** (`recycler`) | `RecyclerDashboard` | Browses open auctions; places sealed competitive bids; views won auctions; inspects shipments; **signs electronic receipt** to release escrow funds. |
| **Logistics** (`logistics`) | `LogisticsDashboard` | Browses unassigned shipments; assigns drivers and vehicles; updates manifest tracking state (`In Transit` → `Delivered`). |
| **Admin** (`admin`) | `AdminDashboard` | Oversees platform-wide volume, total escrow value, system logs, user verification, and compliance audit reports. |

> [!IMPORTANT]
> **Anti-Collusion Anonymity**: During active auctions, Recycler company names are masked as `Bidder #{ID}` when viewed by the Factory and other bidders. Real identities are revealed on both ends only after the Factory clicks "Accept Bid" and the escrow transaction is atomically instantiated.

---

## 🤖 5. AI Vision & EWC Classification

Eco Link embeds a fine-tuned **EfficientNet-B0 PyTorch** vision model to classify industrial waste categories from uploaded photos.

```
Upload Image ──> PyTorch EfficientNet-B0 ──> Predicted Class ──> EWC Code Mapping ──> CO2 Avoidance Calculation
```

* **Model Architecture**: EfficientNet-B0 featuring MBConv residual blocks and Squeeze-and-Excitation (SE) optimization with a customized classification head for industrial waste types.
* **EWC Code Mapping**: Automatically links classifications to the **European Waste Catalogue (EWC)** scheme (e.g., `17 04 02` for Aluminum Scrap) mandated for export/compliance tracking.
* **Hazard Profiles**: Categorizes waste as *Hazardous* (e.g., Lead batteries, chemical residues) or *Non-Hazardous* (e.g., scrap metal, cardboard) as required by Egyptian Law No. 202.
* **CO2 Calculation Formula**:
  $$\text{CO2 Saved (kg)} = \text{Quantity (Tons)} \times \text{CO2 Avoidance Factor (kg/Ton)}$$
  *(e.g., Recycling aluminum avoids approximately 8,900 kg of CO2 per ton compared to primary extraction).*

---

## 🔄 6. End-to-End Business Workflow

```
[Factory: Create Listing] ──> [Auction Open] ──> [Recyclers: Place Bids]
                                                    │
                                                    ▼ (Factory Accepts Bid)
                                            [Atomic DB Transaction]
                                                    │
                      ┌─────────────────────────────┴─────────────────────────────┐
                      ▼                                                           ▼
         [Transaction: Escrow Held (5%)]                              [Shipment: Pending (TRK-XX)]
                      │                                                           │
                      │                                                           ▼
                      │                                                   [Logistics: Assign Driver]
                      │                                                           │
                      │                                                           ▼
                      │                                                   [Logistics: Deliver Waste]
                      │                                                           │
                      ▼                                                           ▼
         [Escrow Settled & Completed] <──────────────────────────────── [Recycler: Confirm Receipt]
```

1. **Listing & Auction**: Factory uploads waste details; the system creates a public `Auction`.
2. **Bidding**: Recyclers submit competitive sealed bids.
3. **Atomic Award**: Factory accepts the winning bid. The database runs `db_transaction.atomic()` to:
   * Reject competing bids.
   * Lock the winning bid and close the auction.
   * Generate an `Escrow Transaction` holding the funds (5% commission, 95% payout).
   * Instantiate a `Logistics Shipment` with a unique tracking number (`TRK-XXXXXXXX`).
   * Generate a draft `Digital Product Passport` (`DPP-XXXXXXXX`).
4. **Logistics Manifest**: Transporter assigns a driver and vehicle. The driver transitions states through transit.
5. **Confirmation & Settlement**: Upon arrival, the Recycler inspects the materials and clicks "Confirm Receipt" in their dashboard. The system atomically completes the shipment, releases the escrow funds, and locks the final DPP.

---

## 🗄️ 7. Database Schema & Entities

The relational database is implemented in **PostgreSQL** (and SQLite for development):

```
  +------------------+         1:N         +----------------------+
  |       User       |<--------------------|     WasteListing     |
  +------------------+                     +----------------------+
    |              |                                  |
    | 1:N          | 1:N                              | 1:N
    v              v                                  v
+--------+    +---------+       1:N                +--------------+
|  Bid   |    |Shipment |<-------------------------|   Auction    |
+--------+    +---------+                          +--------------+
    |              |                                  |
    | 1:1          | 1:1                              | 1:N
    v              v                                  v
+-------------+ +-----------------------+    +-----------------+
| Transaction | |DigitalProductPassport |    |   Transaction   |
+-------------+ +-----------------------+    +-----------------+
```

Detailed database schema representations, field parameters, and endpoint routes are located in the [Backend Engineering Documentation (`docs/backend-documentation.md`)](docs/backend-documentation.md).

---

## 🛠️ 8. Technology Stack

* **Frontend**: React 19, TypeScript, Vite, TailwindCSS (Vanilla component structure), Axios.
* **Backend**: Python 3.11, Django 5.0, Django REST Framework 3.14, SimpleJWT (JWT Auth).
* **AI Engine**: PyTorch (EfficientNet-B0 vision network, NumPy, Pillow).
* **Database**: PostgreSQL (Production), SQLite (Local Dev).
* **Proxy & Server**: Nginx (Frontend multi-stage router), Gunicorn (Backend WSGI server).
* **Deployment**: Docker, Docker Compose, Railway, GitHub Container Registry (GHCR).

---

## 🐳 9. Running Locally with Docker Compose

The repository is fully containerized. You can launch the entire ecosystem (Frontend React, Backend Django API, and PostgreSQL Database) with a single command.

### Running the Stack
1. Ensure Docker Desktop is running.
2. In the root directory, run:
   ```bash
   docker compose up --build -d
   ```
3. Docker Compose will automatically orchestrate the services:

| Container Name | Service Port | External URL | Mount Volume / Purpose |
| :--- | :--- | :--- | :--- |
| `ecolink_frontend` | `80:80` | [http://localhost/](http://localhost/) | Serves compiled React app and proxies `/api`, `/admin`, `/media` to backend via Nginx. |
| `ecolink_backend` | `8000:8000` | [http://localhost:8000/api/](http://localhost:8000/api/) | Django API engine. Mounts volumes for `static_volume` and `media_volume`. |
| `ecolink_db` | `5432:5432` | `localhost:5432` | PostgreSQL database. Mounts persistent database volume `postgres_data`. |

### Stopping the Stack
```bash
docker compose down
```

---

## 💻 10. Manual Environment Setup

If you prefer to run the components independently outside of Docker:

### Backend Setup (DRF)
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Create virtual environment and activate:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy environment example:
   ```bash
   cp .env.example .env
   ```
5. Run migrations and start:
   ```bash
   python manage.py migrate
   python manage.py runserver 8000
   ```

### Frontend Setup (React/Vite)
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```
   *Access UI at [http://localhost:5173/](http://localhost:5173/)*

---

## 🚀 11. CI/CD Pipeline & GitHub Actions

The platform uses GitHub Actions for continuous integration and package deployment:
* **Workflow File**: `.github/workflows/docker-ci-cd.yml`
* **Triggers**: Automated runs on every push or pull request to the `main` or `master` branches.
* **Pipeline Jobs**:
  1. Checks out code.
  2. Authenticates with **GitHub Container Registry (GHCR)** using `secrets.GITHUB_TOKEN`.
  3. Builds Docker images for the Frontend and Backend using their respective `Dockerfile`s.
  4. Automatically tags images (`latest` and short commit SHA) and pushes them to GHCR under the package scope of the repository.

---

## 📁 12. Repository Structure

```text
Eco_Link_For_Red_Dev/
├── .github/workflows/
│   └── docker-ci-cd.yml          # GitHub Actions CI/CD workflow
├── backend/                      # Django REST Framework Backend
│   ├── config/                   # Core Django configurations
│   ├── core/                     # API implementation models, views, and logic
│   │   ├── ai/                   # PyTorch models and weights
│   │   ├── dpp/                  # Digital Product Passport PDF generation logic
│   │   └── recommendations/      # Material scoring and matching engine
│   ├── Dockerfile                # Backend container script
│   ├── entrypoint.sh             # DB wait check and migration runner
│   ├── build.sh                  # Alternative buildpack script
│   ├── Procfile                  # Alternative Heroku/Railway runner
│   └── requirements.txt          # Python dependencies
├── frontend/                     # React 19 + TypeScript Frontend
│   ├── src/                      # Source components, contexts, and assets
│   ├── Dockerfile                # Frontend multi-stage build script
│   ├── nginx.conf                # Nginx proxy configuration
│   └── package.json              # Node dependencies
├── design/                       # UI design specs, Figma files, and branding
├── docs/                         # Platform architecture and technical drawings
│   ├── backend-documentation.md  # System design schema and API Reference
│   └── technical-report/         # Compiled technical compliance reports (PDF/MD)
├── docker-compose.yml            # Multi-service local orchestrator
├── DEPLOYMENT.md                 # Local operation guide in Arabic
└── README.md                     # Technical Overview (This document)
```

---

## 📚 13. Documentation & Technical Reports

* 📄 [**Backend Engineering Documentation (`docs/backend-documentation.md`)**](docs/backend-documentation.md): Comprehensive database layouts, API structures, permission setups, and JSON mock payloads.
* 📄 [**Phase 3 Technical Report PDF (`docs/technical-report/Eco_Link_Database_Backend_Technical_Report.pdf`)**](docs/technical-report/Eco_Link_Database_Backend_Technical_Report.pdf): Exhaustive ESG analysis and system sequence breakdowns.

---

## 📄 14. License & Copyright

Copyright © 2026 Eco Link Enterprise. All Rights Reserved. Proprietary software platform.
