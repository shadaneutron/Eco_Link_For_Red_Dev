from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import (
    RegisterView,
    LoginView,
    CurrentUserView,
    WasteListingListCreateView,
    WasteListingDetailView,
    AuctionListView,
    AuctionDetailView,
    AuctionBidsView,
    MyBidsListView,
    AcceptBidView,
    RejectBidView,
    TransactionListView,
    TransactionDetailView,
    SimulatePaymentView,
    ReleaseEscrowView,
    ShipmentListView,
    ShipmentDetailView,
    AssignDriverView,
    PickupShipmentView,
    TransitShipmentView,
    DeliverShipmentView,
    ConfirmShipmentView,
    AdminStatsView,
    AdminUsersListView,
    ImageUploadView,
    AIClassifyView,
    system_status,
    DPPListView,
    DPPDetailView,
    ShipmentDPPDetailView,
    DPPPdfView,
    ShipmentDPPPdfView,
    RecommendationListView,
    LogisticsReportView,
)

urlpatterns = [
    path('upload/image/', ImageUploadView.as_view(), name='image_upload'),
    path('ai/classify/', AIClassifyView.as_view(), name='ai_classify'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),

    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Platform Admin Routes
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('admin/users/', AdminUsersListView.as_view(), name='admin_users'),
    
    # Marketplace Listings
    path('marketplace/listings/', WasteListingListCreateView.as_view(), name='marketplace_listing_list_create'),
    path('marketplace/listings/<int:pk>/', WasteListingDetailView.as_view(), name='marketplace_listing_detail'),
    path('listings/', WasteListingListCreateView.as_view(), name='listing_list_create'),
    path('listings/<int:pk>/', WasteListingDetailView.as_view(), name='listing_detail'),

    # Marketplace Auctions & Bids
    path('marketplace/auctions/', AuctionListView.as_view(), name='marketplace_auction_list'),
    path('marketplace/auctions/<int:pk>/', AuctionDetailView.as_view(), name='marketplace_auction_detail'),
    path('marketplace/auctions/<int:pk>/bids/', AuctionBidsView.as_view(), name='marketplace_auction_bids'),
    path('marketplace/my-bids/', MyBidsListView.as_view(), name='marketplace_my_bids'),
    path('marketplace/bids/<int:pk>/accept/', AcceptBidView.as_view(), name='marketplace_bid_accept'),
    path('marketplace/bids/<int:pk>/reject/', RejectBidView.as_view(), name='marketplace_bid_reject'),

    # Transactions & Escrow Simulation
    path('transactions/', TransactionListView.as_view(), name='transaction_list'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction_detail'),
    path('transactions/<int:pk>/simulate-payment/', SimulatePaymentView.as_view(), name='transaction_simulate_payment'),
    path('transactions/<int:pk>/release/', ReleaseEscrowView.as_view(), name='transaction_release_escrow'),

    # Shipments & Logistics Workflow
    path('shipments/', ShipmentListView.as_view(), name='shipment_list'),
    path('shipments/<int:pk>/', ShipmentDetailView.as_view(), name='shipment_detail'),
    path('shipments/<int:pk>/assign/', AssignDriverView.as_view(), name='shipment_assign'),
    path('shipments/<int:pk>/pickup/', PickupShipmentView.as_view(), name='shipment_pickup'),
    path('shipments/<int:pk>/transit/', TransitShipmentView.as_view(), name='shipment_transit'),
    path('shipments/<int:pk>/deliver/', DeliverShipmentView.as_view(), name='shipment_deliver'),
    path('shipments/<int:pk>/confirm/', ConfirmShipmentView.as_view(), name='shipment_confirm'),

    path('status/', system_status, name='system_status'),

    # Digital Product Passport
    path('dpp/', DPPListView.as_view(), name='dpp_list'),
    path('dpp/<int:pk>/', DPPDetailView.as_view(), name='dpp_detail'),
    path('dpp/<int:pk>/pdf/', DPPPdfView.as_view(), name='dpp_pdf'),
    path('shipments/<int:pk>/dpp/', ShipmentDPPDetailView.as_view(), name='shipment_dpp_detail'),
    path('shipments/<int:pk>/dpp/pdf/', ShipmentDPPPdfView.as_view(), name='shipment_dpp_pdf'),

    # Recommendations
    path('recommendations/', RecommendationListView.as_view(), name='recommendation_list'),

    # Logistics Reports
    path('logistics/reports/', LogisticsReportView.as_view(), name='logistics-reports'),
]



