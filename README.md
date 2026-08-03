# Eco Link

## Project Overview
Eco Link is an AI-powered B2B Circular Economy Platform connecting factories, recycling companies, and logistics providers. The platform streamlines waste byproduct management, matching waste-generating industries with certified recyclers, optimizing route dispatching for logistics providers, and ensuring absolute legal compliance.

---

## Features

### Current
- **React Frontend Structure**: A clean, modular TypeScript-based React framework.
- **Enterprise UI**: Beautiful, dashboard-oriented design pages built for enterprise scale.
- **User Flows**: Fully navigable interfaces showcasing dashboards, listings, bidding, and checkout.
- **Design System**: Harmonized typography, colors, layout structures, and styling tokens.
- **Initial Django Backend Architecture**: Skeleton configuration setup ready for app integration.

### Planned
- **Authentication**: Secure role-based login and authorization for factories, recyclers, and logisticians.
- **Marketplace Engine**: Automated matching algorithm and live bidding bidding pools.
- **AI Waste Classification**: Automated material assessment, grading, and validation using vision-based systems.
- **Shipment Management**: GPS route optimization, dispatch logs, and EEAA-compliant digital manifests.
- **ESG Reports**: Real-time carbon offset telemetry and sustainability verification.
- **Payment Integration**: Secure, robust transaction escrows and payment pipelines.

---

## Project Structure

- **frontend/**
  Contains the React application codebase, user interfaces, components, and pages.
- **backend/**
  Contains the Django backend architecture, configuration files, and starter modules.
- **design/**
  Contains Figma design files, wireframes, and design system assets.
- **docs/**
  Contains system documentation, legal compliance papers, and architecture drafts.
- **assets/**
  Contains media, logos, and branding images.

---

## Frontend Architecture

- **components**: Reusable presentation widgets (e.g., Header, HeroSection, ValuePropositions).
- **layouts**: Structural shell components defining navigation structures and sidebars.
- **pages**: Main views corresponding to target routes (e.g., RecyclerDashboard, UploadWastePage, SubscriptionPlansPage).
- **routes**: Declarative routing declarations mapping paths to view pages.
- **hooks**: Shared React custom hooks for lifecycle events and state triggers.
- **contexts**: Global React Context state providers (e.g., authentication, settings).
- **services**: API communication clients and asynchronous fetch wrappers.
- **styles**: Global stylesheets, vanilla CSS, and tailwind utilities configuration.
- **types**: Shared TypeScript interface declarations and domain types.
- **utils**: Generic helper functions, formatters, and utility logic.

---

## Backend Architecture

- **config**: Root project settings, middleware, database routing, and primary URL routes configuration.
- **apps**: Pluggable business apps managing modular domain logic.
- **authentication**: Token-based identity validation and role management.
- **factory**: Industry models, waste byproduct logs, and factory metadata.
- **recycler**: Bid calculations, recycler profiles, and auction logs.
- **logistics**: Fleet logs, GPS telemetry, and driver dispatch records.
- **marketplace**: Bidding catalog, offer logic, and auction controllers.
- **shipments**: Shipment manifests, GPS checkpoints, and manifest signing services.
- **reports**: Data aggregators for ESG metrics and carbon calculations.
- **subscriptions**: Billing plans, company licenses, and transaction logs.
- **users**: Custom User model definitions, user metadata, and profiles.
- **core**: Base application controllers, common utilities, and system status checks.

---

## Tech Stack

### Frontend
- **React** (v18+)
- **TypeScript**
- **Vite** (Build Tool)
- **TailwindCSS** (Styling Framework)
- **React Router** (Navigation)

### Backend
- **Django** (v5.x+)
- **Django REST Framework** (DRF)

### Design
- **Figma**

---

## Environment Setup

### Frontend
1. Navigate to the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch development server:
   ```bash
   npm run dev
   ```

### Backend
1. Navigate to the `backend/` directory.
2. Initialize virtual environment:
   ```bash
   python -m venv .venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```powershell
     .venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```
4. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```
5. Apply database migrations:
   ```bash
   python manage.py migrate
   ```
6. Run the server:
   ```bash
   python manage.py runserver
   ```

---

## How To Run

### Running the Frontend
1. Navigate to `frontend/`.
2. Run `npm install` (first-time setup).
3. Run `npm run dev`.
4. Open the displayed URL in your browser (typically `http://localhost:3000`).

### Running the Backend
1. Navigate to `backend/`.
2. Create and activate a virtual environment.
3. Install dependencies: `pip install -r requirements.txt`.
4. Apply migrations: `python manage.py migrate`.
5. Run the backend development server: `python manage.py runserver`.

*Note: The backend currently contains the initial project skeleton and config structure. Business apps and business logic are planned for future phases.*

---

## Development Status

- **Frontend**: UI implementation in progress. High-fidelity layouts, dashboards, and pages have been designed.
- **Backend**: Initial architecture completed. Main settings, CORS middleware, environment configurations, and the core app setup are ready. Business logic and REST APIs are planned for future implementation.

---

## License
All Rights Reserved.
