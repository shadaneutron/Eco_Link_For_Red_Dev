# Standalone Subscriptions Module (`src/components/subscription`)

This directory contains the complete, self-contained **Subscriptions Module** for EcoLink, designed without sidebars so it can be easily reused, exported, or downloaded as an independent component folder.

## Folder Contents
- `SubscriptionPlansPage.tsx`: Interactive Subscription Plans overview featuring:
  - Monthly vs. Annual billing toggle (20% discount).
  - 3 Tiers: **Starter** (0 EGP), **Professional** (1,499 EGP), **Enterprise ESG** (Custom).
  - Modular Service Add-ons (Industry Reports, Live Data API, Carbon Credit, Government Analytics).
  - Comprehensive feature comparison matrix.
- `UpgradeCheckoutPage.tsx`: Full-featured Upgrade & Checkout page featuring:
  - Order summary & VAT calculation.
  - Payment options (Credit Card, Bank Transfer, Vodafone Cash).
  - Promo code verification (`ECO2026`).
  - Company information summary.
  - Upgrade confirmation state.
- `index.ts`: Barrel export for all components and types.

## How to Export / Download
To download or copy this module:
1. Export or copy the `/src/components/subscription` directory.
2. Install `lucide-react` in your project if not already installed.
3. Import `SubscriptionPlansPage` or `UpgradeCheckoutPage` directly into any React + Tailwind CSS app.
