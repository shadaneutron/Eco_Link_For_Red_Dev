# ECO LINK
## Database & Backend Technical Report
### Phase 3 — Engineering & Production Sprint

---

## 1. System Architecture

The Eco Link platform is implemented as a decoupled, multi-tier web application architecture. The system relies on a React 19 single-page application (SPA) frontend, a Django REST Framework (DRF) web server, and a PostgreSQL relational database as the **Single Source of Truth** for all domain state.

### 1.1 Architectural Layers & Component Mapping

```text
React Frontend (frontend/src/)
        ↓ HTTP / REST (Axios API Client)
Frontend API / Service Layer (frontend/src/services/api.ts)
        ↓ JWT Bearer Authentication
Django REST API (backend/core/urls.py & views.py)
        ↓ Serializer Validation & Role Permission Guards
Business Logic / Views / Serializers (backend/core/serializers.py & views.py)
        ↓ Atomic Database Transactions (db_transaction.atomic())
Django ORM (backend/core/models.py)
        ↓ SQL
PostgreSQL Database
```

### 1.2 Repository Directory Layout

The physical code structure directly maps to these architectural layers:

* **Frontend Application (`frontend/src/`)**:
  * `frontend/src/components/authentication/`: JWT Login, Role selection, and Protected Route wrappers.
  * `frontend/src/components/factory/`: Factory waste management, listing creation, and bid evaluation interfaces.
  * `frontend/src/components/recycler/`: Recycler waste catalog, sealed bidding console, and receipt confirmation views.
  * `frontend/src/components/logistics/`: Logistics manifest dispatch, waybill tracking, and fleet management screens.
  * `frontend/src/components/admin/`: System-wide audit overview, user management, and DPP registry.
  * `frontend/src/services/api.ts`: Centralized Axios HTTP client with JWT interceptor.
  * `frontend/src/context/AuthContext.tsx`: Global React authentication state and role persistence.

* **Backend Engine (`backend/core/`)**:
  * `backend/config/`: Django project settings (`settings.py`), root URL routing (`urls.py`), and WSGI/ASGI handlers.
  * `backend/core/models.py`: PostgreSQL domain models (`User`, `WasteListing`, `Auction`, `Bid`, `Transaction`, `Shipment`, `DigitalProductPassport`).
  * `backend/core/views.py`: REST API endpoints, state transition guards, and atomic business transaction handlers.
  * `backend/core/serializers.py`: Serializer definitions, validation logic, and role-based anonymity filters.
  * `backend/core/permissions.py`: DRF custom permission classes (`IsFactory`, `IsRecycler`, `IsLogistics`, `IsAdminUser`).
  * `backend/core/urls.py`: REST API endpoint routing table.

* **Domain Sub-Modules (`backend/core/`)**:
  * `backend/core/ai/`: Image classification module powered by a PyTorch EfficientNet-B0 neural network architecture.
  * `backend/core/dpp/`: Digital Product Passport generator (`generator.py`) and ReportLab PDF compilation service (`services.py`).
  * `backend/core/recommendations/`: Deterministic rule-based scoring engine (`engine.py`, `scoring.py`, `insights.py`).

---

## 2. Database Architecture

The persistence layer is structured using PostgreSQL managed via the Django Object-Relational Mapping (ORM) layer. All business state resides strictly in PostgreSQL database records.

### 2.1 Persistence Principles

1. **Single Source of Truth**: Data displayed across all four stakeholder interfaces (Factory, Recycler, Logistics, Admin) is fetched directly from backend database records. No local storage or in-memory arrays serve as authoritative state.
2. **Atomic Transaction Guarantees**: Critical state-altering workflows—such as bid acceptance and delivery confirmation—are wrapped in explicit atomic database blocks (`django.db.transaction.atomic()`). If any stage fails, all database modifications in that block are rolled back.
3. **Foreign Key Integrity**: Referential integrity is enforced at the database level using foreign keys (`ForeignKey`) and unique one-to-one constraints (`OneToOneField`) with explicit `on_delete` behaviors (`CASCADE` or `SET_NULL`).

---

## 3. Actual Database ERD

The database schema consists of seven core entities defined in `backend/core/models.py` and applied via Django migrations.

### 3.1 Entity Summary Table

| Table Name (PostgreSQL) | Django Model | Primary Key | Key Foreign Keys | Status Choices / Key Attributes |
| :--- | :--- | :--- | :--- | :--- |
| `core_user` | `User` | `id` (AutoField) | None | `role` (`factory`, `recycler`, `logistics`, `admin`), `email`, `company_name` |
| `core_wastelisting` | `WasteListing` | `id` (AutoField) | `factory_id` → `core_user` | `status` (`draft`, `published`, `completed`), `material_type`, `quantity`, `ai_ewc_code` |
| `core_auction` | `Auction` | `id` (AutoField) | `listing_id` → `core_wastelisting` | `status` (`open`, `closed`, `completed`, `cancelled`), `start_date`, `end_date` |
| `core_bid` | `Bid` | `id` (AutoField) | `auction_id` → `core_auction`<br>`recycler_id` → `core_user` | `status` (`pending`, `accepted`, `rejected`), `amount` |
| `core_transaction` | `Transaction` | `id` (AutoField) | `bid_id` → `core_bid` (1:1)<br>`auction_id` → `core_auction`<br>`factory_id`, `recycler_id` → `core_user` | `status` (`Pending`, `Held`, `Released`, `Completed`, `Cancelled`), `amount`, `platform_commission`, `factory_amount` |
| `core_shipment` | `Shipment` | `id` (AutoField) | `transaction_id` → `core_transaction` (1:1)<br>`listing_id` → `core_wastelisting`<br>`factory_id`, `recycler_id`, `logistics_company_id` → `core_user` | `status` (`Pending`, `Assigned`, `Ready for Pickup`, `Picked Up`, `In Transit`, `Delivered`, `Confirmed`), `tracking_number`, `driver_name`, `vehicle` |
| `core_dpp` | `DigitalProductPassport` | `id` (AutoField) | `shipment_id` → `core_shipment` (1:1) | `dpp_id` (Unique), `shipment_status`, `ai_classification`, `ai_confidence`, `carbon_info` |

---

## 4. Database Relationship Explanation

This section documents every database relationship defined in `backend/core/models.py`.

### 4.1 `User` → `WasteListing`
* **Relationship**: One-to-Many (1:N)
* **Foreign Key**: `WasteListing.factory` → `User` (`related_name='waste_listings'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: An industrial generator (`User` with `role='factory'`) creates and owns multiple waste listings. Deleting the user cascades to remove their listings.

### 4.2 `WasteListing` → `Auction`
* **Relationship**: One-to-Many (1:N)
* **Foreign Key**: `Auction.listing` → `WasteListing` (`related_name='auctions'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: A waste listing can have one or more bidding auction sessions. Deleting a waste listing deletes its associated auctions.

### 4.3 `Auction` → `Bid`
* **Relationship**: One-to-Many (1:N)
* **Foreign Key**: `Bid.auction` → `Auction` (`related_name='bids'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: An active auction collects multiple monetary bids from competing recyclers.

### 4.4 `User` (Recycler) → `Bid`
* **Relationship**: One-to-Many (1:N)
* **Foreign Key**: `Bid.recycler` → `User` (`related_name='bids'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: A recycler user places multiple bids across different listings.

### 4.5 `Bid` → `Transaction`
* **Relationship**: One-to-One (1:1)
* **Foreign Key**: `Transaction.bid` → `Bid` (`unique=True`, `related_name='transaction'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: When a bid is accepted by the factory, exactly one escrow transaction record is created for that bid.

### 4.6 `Auction` → `Transaction`
* **Relationship**: One-to-Many (1:N)
* **Foreign Key**: `Transaction.auction` → `Auction` (`related_name='transactions'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: Tracks which auction resulted in the financial transaction.

### 4.7 `User` (Factory & Recycler) → `Transaction`
* **Relationship**: One-to-Many (1:N)
* **Foreign Keys**: 
  * `Transaction.factory` → `User` (`related_name='factory_transactions'`)
  * `Transaction.recycler` → `User` (`related_name='recycler_transactions'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: Links escrow transactions directly to the selling factory and purchasing recycler.

### 4.8 `Transaction` → `Shipment`
* **Relationship**: One-to-One (1:1)
* **Foreign Key**: `Shipment.transaction` → `Transaction` (`unique=True`, `related_name='shipment'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: An escrow transaction generates exactly one shipment manifest for logistics tracking.

### 4.9 `User` (Logistics) → `Shipment`
* **Relationship**: One-to-Many (1:N)
* **Foreign Key**: `Shipment.logistics_company` → `User` (`null=True`, `blank=True`, `related_name='logistics_shipments'`)
* **Delete Behavior**: `on_delete=models.SET_NULL`
* **Business Meaning**: Assigns a shipment to a specific logistics fleet company. If the logistics company user account is removed, the shipment's logistics reference is set to null rather than deleting the transport record.

### 4.10 `Shipment` → `DigitalProductPassport`
* **Relationship**: One-to-One (1:1)
* **Foreign Key**: `DigitalProductPassport.shipment` → `Shipment` (`unique=True`, `related_name='dpp'`)
* **Delete Behavior**: `on_delete=models.CASCADE`
* **Business Meaning**: Each shipment manifest generates exactly one Digital Product Passport (DPP) compliance document.

---

## 5. How Data Moves Through the Database

This section details the database mutation sequence triggered during a complete lifecycle execution.

1. **Listing Creation & AI Classification**:
   * **API**: `POST /api/marketplace/listings/`
   * **Handler**: `WasteListingViewSet.create()`
   * **Database Mutation**: Inserts a row into `core_wastelisting` with `status='published'`. If published, automatically inserts a row into `core_auction` with `status='open'`.
2. **Anonymous Sealed Bidding**:
   * **API**: `POST /api/marketplace/auctions/<id>/bids/`
   * **Handler**: `BidViewSet.create()`
   * **Database Mutation**: Inserts a row into `core_bid` with `status='pending'`, referencing `auction_id` and `recycler_id`.
3. **Atomic Bid Acceptance**:
   * **API**: `POST /api/marketplace/bids/<id>/accept/`
   * **Handler**: `AcceptBidView.post()` (wrapped in `transaction.atomic()`)
   * **Database Mutation**:
     * Updates target `Bid.status` to `'accepted'`.
     * Updates competing `Bid.status` entries for that auction to `'rejected'`.
     * Updates `Auction.status` to `'closed'`.
     * Updates `WasteListing.status` to `'completed'`.
     * Inserts a row into `core_transaction` with `amount`, `platform_commission` (5%), `factory_amount` (95%), and `status='Held'`.
     * Inserts a row into `core_shipment` with `status='Pending'` and auto-generated `tracking_number` (format: `TRK-XXXXXXXX`).
     * Inserts a row into `core_dpp` with `dpp_id` (format: `DPP-XXXXXXXX`).
4. **Logistics Fleet Dispatch & Manifest Execution**:
   * **API**: `POST /api/shipments/<id>/assign/`, `/pickup/`, `/transit/`, `/deliver/`
   * **Handlers**: `AssignShipmentView`, `UpdateShipmentStatusView`
   * **Database Mutation**: Updates `core_shipment` attributes (`driver_name`, `vehicle`, `logistics_company_id`) and status transitions: `'Pending'` → `'Assigned'` → `'Ready for Pickup'` → `'Picked Up'` → `'In Transit'` → `'Delivered'`.
5. **Recycler Delivery Confirmation & Escrow Release**:
   * **API**: `POST /api/shipments/<id>/confirm/`
   * **Handler**: `ConfirmShipmentView.post()` (wrapped in `transaction.atomic()`)
   * **Database Mutation**:
     * Updates `Shipment.status` to `'Confirmed'`.
     * Updates linked `Transaction.status` to `'Completed'`.
     * Updates linked `DigitalProductPassport.shipment_status` to `'Confirmed'`.

---

## 6. Business Transaction Flow

The interaction between client requests, backend handlers, and database mutations is structured as follows:

```text
USER ACTION                 API ENDPOINT                         BACKEND HANDLER          DATABASE MUTATION
-------------------------------------------------------------------------------------------------------------------------
1. Submit Waste Listing  -> POST /api/marketplace/listings/   -> WasteListingViewSet   -> INSERT WasteListing (published)
                                                                                          INSERT Auction (open)
2. Submit Sealed Bid     -> POST /api/auctions/<id>/bids/    -> BidViewSet            -> INSERT Bid (pending)
3. Accept Winning Bid    -> POST /api/bids/<id>/accept/      -> AcceptBidView         -> BEGIN ATOMIC TX
                                                                                          UPDATE Bid (accepted/rejected)
                                                                                          UPDATE Auction (closed)
                                                                                          UPDATE Listing (completed)
                                                                                          INSERT Transaction (Held)
                                                                                          INSERT Shipment (Pending)
                                                                                          INSERT DPP (DPP-XXXX)
                                                                                          COMMIT TX
4. Assign Fleet Driver   -> POST /api/shipments/<id>/assign/  -> AssignShipmentView    -> UPDATE Shipment (Assigned)
5. Update Transit Status -> POST /api/shipments/<id>/deliver/ -> UpdateShipmentStatus  -> UPDATE Shipment (Delivered)
6. Confirm Receipt       -> POST /api/shipments/<id>/confirm/ -> ConfirmShipmentView   -> BEGIN ATOMIC TX
                                                                                          UPDATE Shipment (Confirmed)
                                                                                          UPDATE Transaction (Completed)
                                                                                          UPDATE DPP (Confirmed)
                                                                                          COMMIT TX
```

---

## 7. Shipment Database State Machine

The logistics manifest lifecycle strictly enforces authorized state transitions. Automated or out-of-order transitions are rejected by validation guards in `backend/core/views.py`.

```text
Current Status     Target Status      API Endpoint                        Authorized Role    Backend Handler
------------------------------------------------------------------------------------------------------------------------
(None)          -> Pending            POST /api/bids/<id>/accept/         Factory / Admin    AcceptBidView
Pending         -> Assigned           POST /api/shipments/<id>/assign/    Logistics / Admin  AssignShipmentView
Assigned        -> Ready for Pickup   POST /api/shipments/<id>/pickup/    Logistics / Admin  UpdateShipmentStatusView
Ready for Pickup-> Picked Up          POST /api/shipments/<id>/pickup/    Logistics / Admin  UpdateShipmentStatusView
Picked Up       -> In Transit         POST /api/shipments/<id>/transit/   Logistics / Admin  UpdateShipmentStatusView
In Transit      -> Delivered          POST /api/shipments/<id>/deliver/   Logistics / Admin  UpdateShipmentStatusView
Delivered       -> Confirmed          POST /api/shipments/<id>/confirm/   Recycler / Admin   ConfirmShipmentView
```

### 7.1 Lifecycle Rules

* **Logistics Authority Limit**: Logistics operators can advance shipments up to `Delivered`. Logistics operators **cannot** transition a shipment from `Delivered` to `Confirmed`.
* **Recycler Confirmation Rule**: Only the purchasing Recycler (or System Admin) can invoke `POST /api/shipments/<id>/confirm/` to transition the status from `Delivered` to `Confirmed`. This action triggers financial escrow settlement.

---

## 8. API Architecture Reference

All API endpoints are defined in `backend/core/urls.py` and handled by views in `backend/core/views.py`. Request payloads and responses use `application/json`.

### 8.1 Authentication Domain

* `POST /api/auth/register/`
  * **Auth**: Public (`AllowAny`)
  * **Role**: All Users
  * **Request Schema**: `{ "full_name": string, "email": string, "password": string, "confirm_password": string, "role": string ("factory"|"recycler"|"logistics"|"admin"), "company_name": string (optional), "phone": string (optional) }`
  * **Response Schema**: `{ "user": { "id": integer, "email": string, "role": string, ... }, "tokens": { "access": string, "refresh": string } }`
  * **DB Effect**: Inserts record into `core_user`.

* `POST /api/auth/login/`
  * **Auth**: Public (`AllowAny`)
  * **Role**: All Users
  * **Request Schema**: `{ "email": string, "password": string }`
  * **Response Schema**: `{ "user": { "id": integer, "email": string, "role": string, ... }, "tokens": { "access": string, "refresh": string } }`
  * **DB Effect**: Reads `core_user` and validates credentials.

* `GET /api/auth/me/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: All Users
  * **Response Schema**: `{ "id": integer, "email": string, "role": string, "company_name": string, "phone": string }`

### 8.2 Waste Listings Domain

* `GET /api/marketplace/listings/` (or `/api/listings/`)
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Factory, Recycler, Logistics, Admin
  * **Response Schema**: `Array<{ "id": integer, "title": string, "material_type": string, "quantity": number, "unit": string, "condition": string, "location": string, "ai_ewc_code": string, "status": string }>`
  * **Anonymity Rule**: For Recycler role requests, `factory` user ID is omitted from response objects.

* `POST /api/marketplace/listings/` (or `/api/listings/`)
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Factory, Admin
  * **Request Schema**: `{ "title": string, "material_type": string, "quantity": number, "unit": string, "condition": string, "location": string, "description": string (optional), "images": string (optional), "status": string ("published"|"draft") }`
  * **DB Effect**: Inserts `WasteListing` record; if status is `published`, inserts linked `Auction` record.

### 8.3 Auctions & Bids Domain

* `GET /api/marketplace/auctions/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: All Users
  * **Query Params**: `my_auctions=true` (Filters by requesting Factory)

* `POST /api/marketplace/auctions/<id>/bids/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Recycler
  * **Request Schema**: `{ "amount": number }`
  * **DB Effect**: Inserts `Bid` record (`status='pending'`).

* `POST /api/marketplace/bids/<id>/accept/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Factory (Listing Owner), Admin
  * **DB Effect**: Atomic transaction updating `Bid`, `Auction`, `WasteListing`, and creating `Transaction`, `Shipment`, and `DigitalProductPassport`.

### 8.4 Transactions & Escrow Domain

* `GET /api/transactions/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Factory, Recycler, Admin
  * **Response Schema**: `Array<{ "id": integer, "amount": number, "platform_commission": number, "factory_amount": number, "status": string }>`

* `POST /api/transactions/<id>/simulate-payment/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Recycler, Admin
  * **DB Effect**: Updates `Transaction.status` to `'Held'`.

### 8.5 Logistics & Shipments Domain

* `GET /api/shipments/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Factory, Recycler, Logistics, Admin
  * **Response Schema**: `Array<{ "id": integer, "tracking_number": string, "status": string, "driver_name": string, "vehicle": string, "pickup_location": string, "destination": string }>`

* `GET /api/shipments/<id>/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Factory, Recycler, Logistics, Admin
  * **Response Schema**: `{ "id": integer, "tracking_number": string, "status": string, ... }`

* `POST /api/shipments/<id>/assign/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Logistics, Admin
  * **Request Schema**: `{ "driver_name": string, "vehicle": string, "pickup_date": string (ISO 8601) }`
  * **DB Effect**: Updates `Shipment.status` to `'Assigned'`.

* `POST /api/shipments/<id>/confirm/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: Recycler, Admin
  * **DB Effect**: Atomic update transitioning `Shipment.status` to `'Confirmed'`, `Transaction.status` to `'Completed'`, and finalizing DPP.

### 8.6 AI & Media Upload Domain

* `POST /api/upload/image/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Request**: Multipart file upload (`image` field)
  * **Response Schema**: `{ "url": string, "filename": string }`

* `POST /api/ai/classify/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Request Schema**: `{ "image_url": string }`
  * **Response Schema**: `{ "predicted_class_index": integer, "detected_material": string, "category": string, "confidence": number, "confidence_percentage": number, "ewc_code": string, "hazard_level": string, "co2_factor": number, "all_probabilities": object }`

### 8.7 Digital Product Passport (DPP) Domain

* `GET /api/dpp/`
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Role**: All Users
  * **Response Schema**: `Array<{ "id": integer, "dpp_id": string, "shipment": integer, "material_type": string, "quantity": number, "unit": string, "shipment_status": string, "created_at": string }>`

* `GET /api/dpp/<id>/` (or `/api/shipments/<id>/dpp/`)
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Response Schema**: `{ "document_id": string, "issue_date": string, "waste_details": object, "chain_of_custody": object, "logistics": object, "environmental_impact": object }`

* `GET /api/dpp/<id>/pdf/` (or `/api/shipments/<id>/dpp/pdf/`)
  * **Auth**: Authenticated (`IsAuthenticated`)
  * **Response**: Binary PDF file (`application/pdf`)

---

## 9. API → Database Mapping Matrix

| API Path | HTTP Method | Django Backend View | Primary Target Entity | Mutation Operation |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register/` | POST | `RegisterView` | `User` | `CREATE` |
| `/api/auth/login/` | POST | `LoginView` | `User` | `READ` |
| `/api/marketplace/listings/` | POST | `WasteListingViewSet.create` | `WasteListing`, `Auction` | `CREATE` |
| `/api/marketplace/listings/<id>/` | PUT | `WasteListingViewSet.update` | `WasteListing` | `UPDATE` |
| `/api/marketplace/auctions/<id>/bids/` | POST | `BidViewSet.create` | `Bid` | `CREATE` |
| `/api/marketplace/bids/<id>/accept/` | POST | `AcceptBidView` | `Bid`, `Auction`, `WasteListing`, `Transaction`, `Shipment`, `DPP` | `UPDATE` & `CREATE` (Atomic) |
| `/api/marketplace/bids/<id>/reject/` | POST | `RejectBidView` | `Bid` | `UPDATE` |
| `/api/transactions/<id>/simulate-payment/`| POST | `SimulatePaymentView` | `Transaction` | `UPDATE` |
| `/api/transactions/<id>/release/` | POST | `ReleaseEscrowView` | `Transaction` | `UPDATE` |
| `/api/shipments/<id>/assign/` | POST | `AssignShipmentView` | `Shipment` | `UPDATE` |
| `/api/shipments/<id>/pickup/` | POST | `UpdateShipmentStatusView` | `Shipment` | `UPDATE` |
| `/api/shipments/<id>/transit/` | POST | `UpdateShipmentStatusView` | `Shipment` | `UPDATE` |
| `/api/shipments/<id>/deliver/` | POST | `UpdateShipmentStatusView` | `Shipment` | `UPDATE` |
| `/api/shipments/<id>/confirm/` | POST | `ConfirmShipmentView` | `Shipment`, `Transaction`, `DPP` | `UPDATE` (Atomic) |

---

## 10. Authentication & Role Architecture

Authentication is managed via JSON Web Tokens (SimpleJWT).

```text
User Login Request ➔ POST /api/auth/login/
        ↓
Validate Credentials against core_user table
        ↓
Generate SimpleJWT Access & Refresh Tokens (Embedding role claim)
        ↓
Frontend Stores Access Token in localStorage
        ↓
Subsequent Requests Attach HTTP Header: Authorization: Bearer <access_token>
        ↓
DRF Custom Permission Guard Checks User Role (IsFactory / IsRecycler / IsLogistics / IsAdminUser)
        ↓
Target View Handler Executes ➔ Database Operation
```

---

## 11. AI / DPP / Recommendation Sub-Module Integration

### 11.1 AI Classification Module (`backend/core/ai/`)
* **Neural Network Architecture**: PyTorch `EfficientNet-B0` architecture featuring MBConv residual blocks and Squeeze-and-Excitation (SE) optimization (`backend/core/ai/model.py`).
* **Workflow**: Image Upload (`/api/upload/image/`) → Image Tensor Preprocessing (`preprocessing.py`) → EfficientNet-B0 Inference (`inference.py`) → Returns predicted material class, confidence percentage, EWC code mapping (`labels.py`), hazard level, and CO2 avoidance factor.

### 11.2 Digital Product Passport Engine (`backend/core/dpp/`)
* **Generator (`generator.py`)**: Dynamically compiles live database attributes from `Shipment`, `WasteListing`, `Transaction`, and `User` models into a standardized compliance JSON structure.
* **PDF Service (`services.py`)**: Converts the standardized DPP JSON structure into a downloadable PDF document using ReportLab canvas generation.

### 11.3 Recommendation Engine (`backend/core/recommendations/`)
* **Engine Type**: **Deterministic Rule-Based Scoring Engine** (Not Machine Learning).
* **Scoring Rules**: Evaluates active listings against a requesting Recycler profile across 5 scoring parameters:
  1. Material Match (`score_material_match`): Checks supported materials array against listing material type.
  2. Location Proximity (`score_location`): Checks governorate match.
  3. Quantity Fit (`score_quantity_fit`): Compares listing volume against historical bid average.
  4. Material Condition Quality (`score_quality`): Evaluates material grade and AI confidence score.
  5. Historical Activity (`score_past_activity`): Checks prior bidding history for material category affinity.

---

## 12. Database as Single Source of Truth

The system architecture guarantees that PostgreSQL is the sole authoritative state holder.

```text
React Component Action
        ↓
Axios Service Request (frontend/src/services/api.ts)
        ↓
Django REST Controller (backend/core/views.py)
        ↓
PostgreSQL Database Mutation
        ↓
HTTP Response Payload
        ↓
Frontend Refetches Authoritative Entity via GET /api/shipments/<id>/
        ↓
React UI Component Re-renders with Server State
```

---

## 13. Technical Limitations

The following items reflect technical scope boundaries of the current repository codebase:

1. **Escrow Payment Gateway**: Payment collection is executed via simulated payment endpoints (`/api/transactions/<id>/simulate-payment/`). Direct integration with external banking payment gateways (e.g., Stripe, Paymob) is not implemented in the current codebase.
2. **Real-time Driver Telematics**: Vehicle location tracking relies on manual status updates by logistics operators (`Assigned` → `Picked Up` → `In Transit` → `Delivered`). Automated GPS hardware telematics streaming is not implemented in the current codebase.
3. **Automated AI Weighting Fine-tuning**: The PyTorch EfficientNet-B0 classifier runs inference using stationary model weights (`model_weights/`). Automated online model re-training from user feedback is not implemented in the current codebase.
