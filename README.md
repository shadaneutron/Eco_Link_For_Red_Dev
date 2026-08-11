# Eco Link Enterprise — B2B Circular Economy Platform

An AI-powered, enterprise-grade B2B Circular Economy Platform that seamlessly connects industrial waste generators (**Factories**), certified **Recyclers**, and **Logistics** fleet operators into a unified, audit-ready digital ecosystem compliant with Egyptian Environmental Law No. 202.

---

## 🌟 Executive Summary & Enterprise Architecture

Eco Link transforms fragmented industrial waste management into a centralized, transparent, and database-backed digital marketplace.

### Architectural Principles
* **Single Source of Truth**: All operational state (Listings, Auctions, Bids, Escrow Transactions, Logistics Manifests, Manifest Signatures, and Regulatory Compliance Logs) strictly persist in PostgreSQL / Django REST Framework.
* **Role-Gated Security**: Strict backend API authorization controls role-based UI views and data exposure.
* **Anonymity & Regulatory Protection**: Recycler identity remains anonymous to Factories during live competitive bidding to prevent price collusions. Real identities are revealed only upon verified auction award and escrow creation.
* **Atomic State Engine**: Multi-stage workflows (Bid Acceptance → Transaction Creation → Shipment Initialization) execute within atomic database transactions (`db_transaction.atomic()`).

```
                    ┌─────────────────────────┐
                    │     FACTORY PORTAL      │
                    │ Upload & Publish Waste  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   RECYCLER MARKETPLACE  │
                    │ Anonymous Bidding Engine│
                    └────────────┬────────────┘
                                 │
                                 ▼ (Accept Bid - Atomic DB Tx)
      ┌──────────────────────────┴──────────────────────────┐
      ▼                                                     ▼
┌───────────────────────────┐             ┌───────────────────────────┐
│     ESCROW TRANSACTION    │             │    LOGISTICS MANIFEST     │
│   Status: Escrow Held     │             │  Status: Pickup Pending   │
└─────────────┬─────────────┘             └─────────────┬─────────────┘
              │                                         │
              │                                         ▼ (In Transit / Delivered)
              │                           ┌───────────────────────────┐
              │                           │   RECYCLER CONFIRMATION   │
              │                           │   Digital Manifest Sign   │
              │                           └─────────────┬─────────────┘
              │                                         │
              ▼                                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       ESCROW COMPLETED & CLOSED                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```text
Eco_Link_For_Red_Dev/
├── frontend/                     # React 19 + TypeScript + Vite Enterprise UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── authentication/   # JWT Login, Role Selection, Protected Routes
│   │   │   ├── factory/          # Factory Dashboard, Waste Upload, Bidding Management, Tracking
│   │   │   ├── recycler/         # Recycler Catalog, Bidding Console, Won Auctions, Receipt Sign-off
│   │   │   ├── logistics/        # Logistics Fleet Management, Waybills, Driver Dispatch
│   │   │   ├── common/           # Shared Navbar, Role Navigation, Badges, Modals
│   │   │   └── landing/          # Public Enterprise Landing Page, Hero, Bento Grids
│   │   ├── context/              # AuthContext (JWT, User Role, Persistence)
│   │   ├── services/             # Centralized Axios API Client & Endpoints (`api.ts`)
│   │   ├── types.ts              # TypeScript Domain Interfaces
│   │   ├── App.tsx               # Primary Route Guard & Layout Switcher
│   │   └── main.tsx              # React Entry Point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                      # Django REST Framework Backend Engine
│   ├── config/                   # System Settings, CORS, JWT Config, URLs
│   ├── core/                     # Core Business Logic & Enterprise API Engine
│   │   ├── models.py             # Domain Models (User, WasteListing, Auction, Bid, Transaction, Shipment)
│   │   ├── views.py              # REST API Controllers & Atomic Business Operations
│   │   ├── serializers.py        # Role-Aware Data Serializers & Anonymity Filters
│   │   ├── permissions.py        # Custom Role Permission Guards (`IsFactory`, `IsRecycler`, `IsLogistics`)
│   │   ├── admin.py              # Django Enterprise Admin Panel Configuration
│   │   └── urls.py               # REST API Endpoint Routing
│   ├── manage.py
│   └── requirements.txt          # Python Dependencies
│
└── README.md                     # Technical Documentation & Operational Guide
```

---

## 👥 Organizational Roles & Visibility Rules

The platform enforces 4 strict organizational roles:

1. **Factory (`factory`)**: Industrial waste generators.
   * *Capabilities*: Upload waste listings, set reserve prices, publish auctions, view incoming anonymous bids, accept highest bids, track outgoing shipments in real time.
2. **Recycler (`recycler`)**: Licensed waste processors & recyclers.
   * *Capabilities*: Browse live waste auctions, submit competitive sealed bids, view won auctions, confirm material receipt upon delivery, trigger escrow completion.
3. **Logistics (`logistics`)**: EEAA-certified transport fleet operators.
   * *Capabilities*: View pending waste pickup assignments, assign vehicle/driver, transition manifest state (`assigned` → `in_transit` → `delivered`), log regulatory waybill tracking.
4. **Admin (`admin`)**: Platform compliance auditors & administrators.
   * *Capabilities*: Platform-wide monitoring, regulatory compliance auditing, user identity verification.

---

## 🔄 Core End-to-End Business Workflow

1. **Listing Creation & Auction Initialization**:
   * Factory submits material specifications (quantity, unit, condition, location, images).
   * Backend automatically initializes an `Auction` in `open` state linked to the `WasteListing`.
2. **Competitive Anonymous Bidding**:
   * Recyclers view published auctions and submit monetary bids (`amount`).
   * Factory sees bid amounts and timestamps, but Recycler corporate identities are **redacted** to maintain market integrity.
3. **Atomic Award & Escrow Creation**:
   * Factory accepts a bid via `/api/auctions/{id}/accept/`.
   * Backend opens an atomic transaction block:
     * Accepts target `Bid` & rejects competing bids.
     * Closes `Auction` & marks `WasteListing` as `sold`.
     * Instantiates `Transaction` (status: `escrow_held`).
     * Instantiates `Shipment` (status: `pending`).
4. **Logistics Dispatch & Manifest Execution**:
   * Logistics driver/operator picks up shipment, transitioning state to `assigned`, then `in_transit`, then `delivered`.
5. **Recycler Receipt Confirmation & Escrow Release**:
   * Recycler inspects delivered material and signs receipt via `/api/shipments/{id}/confirm/`.
   * Backend atomically transitions `Shipment` status to `confirmed` and `Transaction` status to `completed`.

---

## 🗄️ Database Schema & Models

* `User`: Extends AbstractUser with `role` (`factory`, `recycler`, `logistics`, `admin`), `company_name`, `phone`, and `address`.
* `WasteListing`: Stores waste metadata (`title`, `material_type`, `quantity`, `unit`, `condition`, `status`).
* `Auction`: Manages listing bidding lifecycle (`status`: `open`/`closed`, `start_time`, `end_time`).
* `Bid`: Records bidder offers (`amount`, `status`: `pending`/`accepted`/`rejected`).
* `Transaction`: Escrow record (`amount`, `status`: `escrow_held`/`completed`/`refunded`).
* `Shipment`: Manifest logistics tracking (`status`: `pending`/`assigned`/`in_transit`/`delivered`/`confirmed`, `tracking_number`, vehicle & driver details).
* `ComplianceLog`: Regulatory compliance audit trail (Law No. 202 manifest logging).

---

## 🔐 Authentication & Security

* **JWT (JSON Web Tokens)**: Access & Refresh tokens via `djangorestframework-simplejwt`.
* **Token Claims**: Role information embedded within JWT claims to enable instantaneous frontend route protection.
* **API Permission Classes**: Endpoints guarded by `IsAuthenticated` alongside custom role classes (`IsFactoryUser`, `IsRecyclerUser`, `IsLogisticsUser`).

---

## 🚀 Environment Setup & How to Run

### Prerequisites
* Python 3.10+
* Node.js 18+
* PostgreSQL (Production) or SQLite (Development)

---

### Backend Setup (Django REST Framework)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # macOS / Linux
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional, defaults to SQLite for dev):
   ```bash
   # Create .env from template
   copy .env.example .env
   ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver 8000
   ```
   *API will be live at `http://127.0.0.1:8000/api/`*

---

### Frontend Setup (React + Vite)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *App will be accessible at `http://localhost:5173/` (or port assigned by Vite)*

---

## 🧪 Verification & Build Commands

* **Backend Sanity Check**:
  ```bash
  cd backend
  python manage.py check
  ```
* **Frontend Production Build**:
  ```bash
  cd frontend
  npm run build
  ```

---

## 📚 Backend Documentation & Phase 3 Technical Report

Complete, production-grade technical documentation for the backend architecture, database schema, and REST API reference is available in:
* 📄 [**Backend Engineering Documentation (`docs/backend-documentation.md`)**](docs/backend-documentation.md)
* 📄 [**Phase 3 Technical Report PDF (`docs/technical-report/Eco_Link_Database_Backend_Technical_Report.pdf`)**](docs/technical-report/Eco_Link_Database_Backend_Technical_Report.pdf)
* 📝 [**Phase 3 Markdown Source Report (`docs/technical-report/source/report-source.md`)**](docs/technical-report/source/report-source.md)

### Technical SVG Diagrams
* 📐 [**System Architecture Diagram**](docs/technical-report/diagrams/system-architecture.svg)
* 🗄️ [**Entity Relationship Diagram (ERD)**](docs/technical-report/diagrams/database-erd.svg)
* 🔄 [**Core Transaction Data Flow Diagram**](docs/technical-report/diagrams/core-data-flow.svg)
* 🚚 [**Shipment State Machine Diagram**](docs/technical-report/diagrams/shipment-state-machine.svg)

---

## 📄 License & Intellectual Property

Copyright © 2026 Eco Link Enterprise. All Rights Reserved. Proprietary software platform.

