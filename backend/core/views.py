from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction as db_transaction
from django.db import models as django_models
from django.utils import timezone
from django.conf import settings
import os
import uuid

from core.models import User, WasteListing, Auction, Bid, Transaction, Shipment, DigitalProductPassport
from core.serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    WasteListingSerializer,
    PublicWasteListingSerializer,
    AuctionSerializer,
    PublicAuctionSerializer,
    CreateBidSerializer,
    PublicBidSerializer,
    FactoryBidSerializer,
    TransactionSerializer,
    ShipmentSerializer,
    DigitalProductPassportSerializer
)
from core.dpp.generator import generate_dpp_json
from core.dpp.services import get_or_create_dpp_for_shipment, generate_dpp_pdf_bytes
from core.dpp.serializers import DPPListSerializer
from django.http import HttpResponse
from core.ai.labels import map_ai_material_to_category



class ImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get('image') or request.FILES.get('file')
        if not uploaded_file:
            return Response({"detail": "No image file provided."}, status=status.HTTP_400_BAD_REQUEST)

        allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp']
        ext = os.path.splitext(uploaded_file.name)[1].lower()
        if ext not in allowed_extensions:
            return Response(
                {"detail": f"Invalid image format '{ext}'. Allowed formats: JPG, JPEG, PNG, WebP."},
                status=status.HTTP_400_BAD_REQUEST
            )

        max_size = 5 * 1024 * 1024
        if uploaded_file.size > max_size:
            return Response(
                {"detail": "Image file size exceeds maximum limit of 5MB."},
                status=status.HTTP_400_BAD_REQUEST
            )

        uploads_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        unique_filename = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(uploads_dir, unique_filename)

        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        url = f"/media/uploads/{unique_filename}"
        return Response({"url": url, "filename": uploaded_file.name}, status=status.HTTP_201_CREATED)


class AIClassifyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from core.ai import classify_waste_image
        uploaded_file = request.FILES.get('image') or request.FILES.get('file')
        image_url = request.data.get('image_url')

        target_input = None

        if uploaded_file:
            allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp']
            ext = os.path.splitext(uploaded_file.name)[1].lower()
            if ext not in allowed_extensions:
                return Response(
                    {"detail": f"Invalid image format '{ext}'. Allowed formats: JPG, JPEG, PNG, WebP."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            target_input = uploaded_file
        elif image_url:
            if image_url.startswith('/media/'):
                rel_path = image_url.lstrip('/')
                full_path = os.path.join(settings.BASE_DIR, rel_path)
                if os.path.exists(full_path):
                    target_input = full_path

        if not target_input:
            return Response(
                {"detail": "Please provide an image file ('image') or a valid local image URL ('image_url')."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            result = classify_waste_image(target_input)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": f"AI classification failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )





def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Support both camelCase and snake_case keys from frontend payload
        data = request.data.copy()
        if 'fullName' in data and 'full_name' not in data:
            data['full_name'] = data['fullName']
        if 'confirmPassword' in data and 'confirm_password' not in data:
            data['confirm_password'] = data['confirmPassword']
        if 'companyName' in data and 'company_name' not in data:
            data['company_name'] = data['companyName']

        serializer = RegisterSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                "message": "User registered successfully",
                "tokens": tokens,
                "access": tokens['access'],
                "refresh": tokens['refresh'],
                "user": user_data
            }, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            user_data = UserSerializer(user).data
            return Response({
                "message": "Login successful",
                "tokens": tokens,
                "access": tokens['access'],
                "refresh": tokens['refresh'],
                "user": user_data
            }, status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            "user": serializer.data
        }, status=status.HTTP_200_OK)


class WasteListingListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Auto-ensure open auctions exist for all published listings
        published_listings = WasteListing.objects.filter(status=WasteListing.Status.PUBLISHED)
        for listing in published_listings:
            Auction.objects.get_or_create(listing=listing, defaults={'status': Auction.Status.OPEN})

        active_marketplace_qs = WasteListing.objects.filter(
            status=WasteListing.Status.PUBLISHED,
            auctions__status=Auction.Status.OPEN
        ).exclude(
            auctions__bids__status=Bid.Status.ACCEPTED
        ).exclude(
            auctions__transactions__isnull=False
        ).distinct().order_by('-created_at')

        if request.user.role == User.Role.RECYCLER:
            serializer = PublicWasteListingSerializer(active_marketplace_qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.user.role == User.Role.FACTORY:
            if request.query_params.get('scope') == 'all' or request.query_params.get('marketplace') == 'true':
                serializer = PublicWasteListingSerializer(active_marketplace_qs, many=True)
            else:
                queryset = WasteListing.objects.filter(factory=request.user).order_by('-created_at')
                serializer = WasteListingSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.user.role == User.Role.ADMIN:
            queryset = WasteListing.objects.all().order_by('-created_at')
            serializer = WasteListingSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = PublicWasteListingSerializer(active_marketplace_qs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request):
        if request.user.role not in [User.Role.FACTORY, User.Role.ADMIN]:
            return Response(
                {"detail": "Only Factory users can create waste listings."},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        if 'wasteName' in data and 'title' not in data:
            data['title'] = data['wasteName']
        elif 'waste_name' in data and 'title' not in data:
            data['title'] = data['waste_name']

        if 'category' in data and 'material_type' not in data:
            data['material_type'] = data['category']
        elif 'materialType' in data and 'material_type' not in data:
            data['material_type'] = data['materialType']

        # Enforce AI prediction mapping as backend source of truth for Category
        ai_mat = data.get('ai_material_type') or data.get('aiMaterialType')
        user_mat = data.get('category') or data.get('material_type') or data.get('materialType')
        source_val = ai_mat or user_mat
        if source_val:
            data['material_type'] = map_ai_material_to_category(source_val)
            if ai_mat and not data.get('ai_material_type'):
                data['ai_material_type'] = ai_mat

        if 'estQuantity' in data and 'quantity' not in data:
            data['quantity'] = data['estQuantity']
        elif 'est_quantity' in data and 'quantity' not in data:
            data['quantity'] = data['est_quantity']

        if 'factoryBranch' in data and 'location' not in data:
            data['location'] = data['factoryBranch']
        elif 'factory_branch' in data and 'location' not in data:
            data['location'] = data['factory_branch']

        serializer = WasteListingSerializer(data=data)
        if serializer.is_valid():
            listing = serializer.save(factory=request.user)
            if listing.status == WasteListing.Status.PUBLISHED:
                Auction.objects.get_or_create(listing=listing, defaults={'status': Auction.Status.OPEN})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class WasteListingDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return WasteListing.objects.get(pk=pk)
        except WasteListing.DoesNotExist:
            return None

    def get(self, request, pk):
        listing = self.get_object(pk)
        if not listing:
            return Response({"detail": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)

        if listing.status != WasteListing.Status.PUBLISHED and listing.factory != request.user and request.user.role != User.Role.ADMIN:
            return Response({"detail": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)

        if listing.factory == request.user or request.user.role == User.Role.ADMIN:
            serializer = WasteListingSerializer(listing)
        else:
            serializer = PublicWasteListingSerializer(listing)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def put(self, request, pk):
        listing = self.get_object(pk)
        if not listing:
            return Response({"detail": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)

        if listing.factory != request.user and request.user.role != User.Role.ADMIN:
            return Response(
                {"detail": "You do not have permission to update this listing."},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        if 'wasteName' in data and 'title' not in data:
            data['title'] = data['wasteName']
        if 'category' in data and 'material_type' not in data:
            data['material_type'] = data['category']
        if 'estQuantity' in data and 'quantity' not in data:
            data['quantity'] = data['estQuantity']
        if 'factoryBranch' in data and 'location' not in data:
            data['location'] = data['factoryBranch']

        serializer = WasteListingSerializer(listing, data=data, partial=True)
        if serializer.is_valid():
            updated_listing = serializer.save()
            if updated_listing.status == WasteListing.Status.PUBLISHED:
                Auction.objects.get_or_create(listing=updated_listing, defaults={'status': Auction.Status.OPEN})
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def system_status(request):
    """
    EcoLink backend status check endpoint.
    """
    return Response({
        "status": "online",
        "message": "EcoLink Backend API is up and running.",
        "version": "1.0.0",
        "environment": "development"
    })


class AuctionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Auto-ensure auctions exist for all published listings
        published_listings = WasteListing.objects.filter(status=WasteListing.Status.PUBLISHED)
        for listing in published_listings:
            Auction.objects.get_or_create(listing=listing, defaults={'status': Auction.Status.OPEN})

        open_auctions_qs = Auction.objects.filter(
            status=Auction.Status.OPEN,
            listing__status=WasteListing.Status.PUBLISHED
        ).exclude(
            bids__status=Bid.Status.ACCEPTED
        ).exclude(
            transactions__isnull=False
        ).distinct()

        if request.user.role == User.Role.RECYCLER or request.query_params.get('scope') == 'public':
            serializer = PublicAuctionSerializer(open_auctions_qs, many=True)
        elif request.user.role == User.Role.FACTORY and request.query_params.get('my_auctions') == 'true':
            auctions = Auction.objects.filter(listing__factory=request.user)
            serializer = AuctionSerializer(auctions, many=True)
        else:
            serializer = PublicAuctionSerializer(open_auctions_qs, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        if request.user.role not in [User.Role.FACTORY, User.Role.ADMIN]:
            return Response(
                {"detail": "Only Factory users can create auctions."},
                status=status.HTTP_403_FORBIDDEN
            )

        listing_id = request.data.get('listing_id') or request.data.get('listing')
        if not listing_id:
            return Response({"detail": "listing_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            listing = WasteListing.objects.get(pk=listing_id, factory=request.user)
        except WasteListing.DoesNotExist:
            return Response({"detail": "Listing not found or not owned by you."}, status=status.HTTP_404_NOT_FOUND)

        auction, created = Auction.objects.get_or_create(
            listing=listing,
            defaults={'status': Auction.Status.OPEN}
        )

        serializer = AuctionSerializer(auction)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)


class AuctionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            auction = Auction.objects.get(pk=pk)
        except Auction.DoesNotExist:
            return Response({"detail": "Auction not found."}, status=status.HTTP_404_NOT_FOUND)

        if auction.listing.factory == request.user or request.user.role == User.Role.ADMIN:
            serializer = AuctionSerializer(auction)
        else:
            if (
                auction.status != Auction.Status.OPEN or
                auction.listing.status != WasteListing.Status.PUBLISHED or
                auction.bids.filter(status=Bid.Status.ACCEPTED).exists() or
                auction.transactions.exists()
            ):
                return Response({"detail": "Auction not found or no longer available."}, status=status.HTTP_404_NOT_FOUND)
            serializer = PublicAuctionSerializer(auction)

        return Response(serializer.data, status=status.HTTP_200_OK)


class AuctionBidsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """GET /api/marketplace/auctions/{id}/bids/ - Factory views bids for their listing auction."""
        try:
            auction = Auction.objects.get(pk=pk)
        except Auction.DoesNotExist:
            return Response({"detail": "Auction not found."}, status=status.HTTP_404_NOT_FOUND)

        if auction.listing.factory != request.user and request.user.role != User.Role.ADMIN:
            return Response(
                {"detail": "Only the listing owner factory can view bids for this auction."},
                status=status.HTTP_403_FORBIDDEN
            )

        bids = auction.bids.all()
        serializer = FactoryBidSerializer(bids, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk):
        """POST /api/marketplace/auctions/{id}/bids/ - Recycler places a bid on an auction."""
        if request.user.role != User.Role.RECYCLER:
            return Response(
                {"detail": "Only Recycler accounts can submit bids."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            auction = Auction.objects.get(pk=pk)
        except Auction.DoesNotExist:
            return Response({"detail": "Auction not found."}, status=status.HTTP_404_NOT_FOUND)

        if auction.status != Auction.Status.OPEN or auction.listing.status != WasteListing.Status.PUBLISHED:
            return Response(
                {"detail": "Bidding is closed for this auction."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if auction.listing.factory == request.user:
            return Response(
                {"detail": "Factory owners cannot bid on their own listings."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CreateBidSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        amount = serializer.validated_data['amount']

        bid = Bid.objects.create(
            auction=auction,
            recycler=request.user,
            amount=amount,
            status=Bid.Status.PENDING
        )

        response_serializer = PublicBidSerializer(bid)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class MyBidsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """GET /api/marketplace/my-bids/ - Recycler retrieves their own bids."""
        if request.user.role != User.Role.RECYCLER:
            return Response([], status=status.HTTP_200_OK)

        bids = Bid.objects.filter(recycler=request.user)
        serializer = PublicBidSerializer(bids, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AcceptBidView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/marketplace/bids/{id}/accept/ - Factory accepts a bid and creates Escrow Transaction."""
        try:
            bid = Bid.objects.get(pk=pk)
        except Bid.DoesNotExist:
            return Response({"detail": "Bid not found."}, status=status.HTTP_404_NOT_FOUND)

        auction = bid.auction
        if auction.listing.factory != request.user and request.user.role != User.Role.ADMIN:
            return Response(
                {"detail": "Only the listing owner factory can accept bids."},
                status=status.HTTP_403_FORBIDDEN
            )

        with db_transaction.atomic():
            # 1. Accept the selected bid
            bid.status = Bid.Status.ACCEPTED
            bid.save()

            # 2. Reject competing pending bids
            Bid.objects.filter(auction=auction).exclude(pk=bid.pk).update(status=Bid.Status.REJECTED)

            # 3. Complete the auction
            auction.status = Auction.Status.COMPLETED
            auction.save()

            # 4. Update the listing status
            listing = auction.listing
            listing.status = WasteListing.Status.COMPLETED
            listing.save()

            # 5 & 6. Create exactly ONE Transaction for the accepted bid (status = Held)
            tx, created = Transaction.objects.get_or_create(
                bid=bid,
                defaults={
                    'auction': auction,
                    'factory': listing.factory,
                    'recycler': bid.recycler,
                    'amount': bid.amount,
                    'status': Transaction.Status.HELD
                }
            )

            # 7. Create exactly ONE Shipment associated with that Transaction (status = Pending)
            shipment, _ = Shipment.objects.get_or_create(
                transaction=tx,
                defaults={
                    'listing': listing,
                    'factory': listing.factory,
                    'recycler': bid.recycler,
                    'pickup_location': listing.location or 'Factory Facility',
                    'destination': bid.recycler.location if hasattr(bid.recycler, 'location') else 'Recycling Facility',
                    'status': Shipment.Status.PENDING,
                }
            )

            # 8. Create ONE Digital Product Passport for this deal
            DigitalProductPassport.objects.get_or_create(
                shipment=shipment,
                defaults={
                    'material_type': listing.material_type or '',
                    'quantity': listing.quantity,
                    'unit': listing.unit or 'Tons',
                    'condition': listing.condition or '',
                    'ai_classification': listing.ai_material_type or '',
                    'ai_confidence': listing.ai_confidence,
                    'origin_governorate': listing.location or '',
                    'destination_governorate': '',
                    'transaction_id_ref': tx.id,
                    'deal_amount': bid.amount,
                    'deal_date': tx.created_at,
                    'tracking_number': shipment.tracking_number,
                    'logistics_partner': 'Eco Link Logistics Partner',
                    'shipment_status': shipment.status,
                }
            )

        bid_serializer = FactoryBidSerializer(bid)
        tx_serializer = TransactionSerializer(tx)
        return Response({
            "detail": "Bid accepted successfully and escrow transaction created.",
            "bid": bid_serializer.data,
            "transaction": tx_serializer.data
        }, status=status.HTTP_200_OK)


class RejectBidView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/marketplace/bids/{id}/reject/ - Factory rejects a bid."""
        try:
            bid = Bid.objects.get(pk=pk)
        except Bid.DoesNotExist:
            return Response({"detail": "Bid not found."}, status=status.HTTP_404_NOT_FOUND)

        auction = bid.auction
        if auction.listing.factory != request.user and request.user.role != User.Role.ADMIN:
            return Response(
                {"detail": "Only the listing owner factory can reject bids."},
                status=status.HTTP_403_FORBIDDEN
            )

        if bid.status == Bid.Status.ACCEPTED:
            return Response(
                {"detail": "Accepted bids cannot be rejected."},
                status=status.HTTP_400_BAD_REQUEST
            )

        bid.status = Bid.Status.REJECTED
        bid.save()

        serializer = FactoryBidSerializer(bid)
        return Response({
            "detail": "Bid rejected successfully.",
            "bid": serializer.data
        }, status=status.HTTP_200_OK)


class TransactionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """GET /api/transactions/ - List transactions for current user."""
        user = request.user
        if user.role == User.Role.FACTORY:
            transactions = Transaction.objects.filter(factory=user)
        elif user.role == User.Role.RECYCLER:
            transactions = Transaction.objects.filter(recycler=user)
        elif user.role == User.Role.ADMIN:
            transactions = Transaction.objects.all()
        else:
            transactions = Transaction.objects.none()

        serializer = TransactionSerializer(transactions, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class TransactionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """GET /api/transactions/{id}/ - Retrieve transaction details."""
        try:
            tx = Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return Response({"detail": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if tx.factory != user and tx.recycler != user and user.role != User.Role.ADMIN:
            return Response({"detail": "You do not have permission to view this transaction."}, status=status.HTTP_403_FORBIDDEN)

        serializer = TransactionSerializer(tx, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class SimulatePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/transactions/{id}/simulate-payment/ - Simulate payment to escrow."""
        try:
            tx = Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return Response({"detail": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if tx.factory != user and tx.recycler != user and user.role != User.Role.ADMIN:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        if tx.status == Transaction.Status.PENDING:
            tx.status = Transaction.Status.HELD
            tx.save()

        serializer = TransactionSerializer(tx, context={'request': request})
        return Response({
            "detail": "Payment simulation processed. Funds are held in escrow.",
            "simulation": True,
            "transaction": serializer.data
        }, status=status.HTTP_200_OK)


class ReleaseEscrowView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/transactions/{id}/release/ - Release escrow funds."""
        try:
            tx = Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return Response({"detail": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if tx.factory != user and tx.recycler != user and user.role != User.Role.ADMIN:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        if tx.status in [Transaction.Status.HELD, Transaction.Status.PENDING]:
            tx.status = Transaction.Status.RELEASED
            tx.save()

        serializer = TransactionSerializer(tx, context={'request': request})
        return Response({
            "detail": "Escrow funds released successfully.",
            "transaction": serializer.data
        }, status=status.HTTP_200_OK)


class ShipmentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """GET /api/shipments/ - List shipments for current user/role."""
        user = request.user
        if user.role == User.Role.FACTORY:
            shipments = Shipment.objects.filter(factory=user)
        elif user.role == User.Role.RECYCLER:
            shipments = Shipment.objects.filter(recycler=user)
        elif user.role == User.Role.LOGISTICS:
            shipments = Shipment.objects.filter(django_models.Q(logistics_company=user) | django_models.Q(logistics_company__isnull=True))
        elif user.role == User.Role.ADMIN:
            shipments = Shipment.objects.all()
        else:
            shipments = Shipment.objects.none()

        serializer = ShipmentSerializer(shipments, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ShipmentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """GET /api/shipments/{id}/ - Retrieve shipment details."""
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({"detail": "Shipment not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user.role == User.Role.LOGISTICS:
            if shipment.logistics_company is not None and shipment.logistics_company != user:
                return Response({"detail": "You do not have permission to view this shipment."}, status=status.HTTP_403_FORBIDDEN)
        elif (
            shipment.factory != user and
            shipment.recycler != user and
            user.role != User.Role.ADMIN
        ):
            return Response({"detail": "You do not have permission to view this shipment."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ShipmentSerializer(shipment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssignDriverView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/shipments/{id}/assign/ - Assign driver and vehicle to shipment."""
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({"detail": "Shipment not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user.role not in [User.Role.LOGISTICS, User.Role.ADMIN]:
            return Response({"detail": "Only logistics providers can assign drivers."}, status=status.HTTP_403_FORBIDDEN)

        if shipment.logistics_company is not None and shipment.logistics_company != user and user.role != User.Role.ADMIN:
            return Response({"detail": "This shipment is assigned to another logistics provider."}, status=status.HTTP_403_FORBIDDEN)

        if shipment.status not in [Shipment.Status.PENDING, Shipment.Status.ASSIGNED]:
            return Response({"detail": f"Cannot assign driver when shipment status is '{shipment.status}'."}, status=status.HTTP_400_BAD_REQUEST)

        driver_name = request.data.get('driver_name', request.data.get('driver', ''))
        vehicle = request.data.get('vehicle', '')
        pickup_date = request.data.get('pickup_date', None)

        if driver_name:
            shipment.driver_name = driver_name
        if vehicle:
            shipment.vehicle = vehicle
        if pickup_date:
            shipment.pickup_date = pickup_date

        shipment.logistics_company = user
        shipment.status = Shipment.Status.ASSIGNED
        shipment.save()

        serializer = ShipmentSerializer(shipment, context={'request': request})
        return Response({
            "detail": "Driver and vehicle assigned successfully.",
            "shipment": serializer.data
        }, status=status.HTTP_200_OK)


class PickupShipmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/shipments/{id}/pickup/ - Update shipment pickup status."""
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({"detail": "Shipment not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if (shipment.logistics_company != user and user.role != User.Role.ADMIN) or user.role not in [User.Role.LOGISTICS, User.Role.ADMIN]:
            return Response({"detail": "Only the assigned logistics provider can update pickup status."}, status=status.HTTP_403_FORBIDDEN)

        target_status = request.data.get('status')
        if target_status == Shipment.Status.READY_FOR_PICKUP:
            if shipment.status not in [Shipment.Status.ASSIGNED, Shipment.Status.PENDING]:
                return Response({"detail": f"Cannot transition to Ready for Pickup from '{shipment.status}'."}, status=status.HTTP_400_BAD_REQUEST)
            shipment.status = Shipment.Status.READY_FOR_PICKUP
        elif target_status == Shipment.Status.PICKED_UP:
            if shipment.status not in [Shipment.Status.READY_FOR_PICKUP]:
                return Response({"detail": f"Cannot transition to Picked Up from '{shipment.status}'."}, status=status.HTTP_400_BAD_REQUEST)
            shipment.status = Shipment.Status.PICKED_UP
        else:
            if shipment.status in [Shipment.Status.ASSIGNED, Shipment.Status.PENDING]:
                shipment.status = Shipment.Status.READY_FOR_PICKUP
            elif shipment.status == Shipment.Status.READY_FOR_PICKUP:
                shipment.status = Shipment.Status.PICKED_UP
            else:
                return Response({"detail": f"Cannot execute pickup for shipment with status '{shipment.status}'."}, status=status.HTTP_400_BAD_REQUEST)

        shipment.save()
        serializer = ShipmentSerializer(shipment, context={'request': request})
        return Response({
            "detail": f"Shipment status updated to {shipment.status}.",
            "shipment": serializer.data
        }, status=status.HTTP_200_OK)


class TransitShipmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/shipments/{id}/transit/ - Mark shipment as In Transit."""
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({"detail": "Shipment not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if (shipment.logistics_company != user and user.role != User.Role.ADMIN) or user.role not in [User.Role.LOGISTICS, User.Role.ADMIN]:
            return Response({"detail": "Only the assigned logistics provider can mark shipment in transit."}, status=status.HTTP_403_FORBIDDEN)

        if shipment.status not in [Shipment.Status.PICKED_UP, Shipment.Status.READY_FOR_PICKUP]:
            return Response({"detail": f"Cannot transition to In Transit from '{shipment.status}'."}, status=status.HTTP_400_BAD_REQUEST)

        shipment.status = Shipment.Status.IN_TRANSIT
        shipment.save()

        serializer = ShipmentSerializer(shipment, context={'request': request})
        return Response({
            "detail": "Shipment is now In Transit.",
            "shipment": serializer.data
        }, status=status.HTTP_200_OK)


class DeliverShipmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/shipments/{id}/deliver/ - Mark shipment as Delivered."""
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({"detail": "Shipment not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if (shipment.logistics_company != user and user.role != User.Role.ADMIN) or user.role not in [User.Role.LOGISTICS, User.Role.ADMIN]:
            return Response({"detail": "Only the assigned logistics provider can mark shipment delivered."}, status=status.HTTP_403_FORBIDDEN)

        if shipment.status != Shipment.Status.IN_TRANSIT:
            return Response({"detail": f"Cannot transition to Delivered from '{shipment.status}'."}, status=status.HTTP_400_BAD_REQUEST)

        shipment.status = Shipment.Status.DELIVERED
        shipment.delivered_at = timezone.now()
        shipment.save()

        serializer = ShipmentSerializer(shipment, context={'request': request})
        return Response({
            "detail": "Shipment delivered successfully. Pending recycler receipt confirmation.",
            "shipment": serializer.data
        }, status=status.HTTP_200_OK)


class ConfirmShipmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """POST /api/shipments/{id}/confirm/ - Recycler confirms receipt of shipment, releasing escrow."""
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({"detail": "Shipment not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if shipment.recycler != user and user.role != User.Role.ADMIN:
            return Response({"detail": "Only the designated recycler can confirm receipt of this shipment."}, status=status.HTTP_403_FORBIDDEN)

        if shipment.status != Shipment.Status.DELIVERED:
            return Response({"detail": f"Receipt can only be confirmed after shipment is Delivered. Current status: '{shipment.status}'."}, status=status.HTTP_400_BAD_REQUEST)

        with db_transaction.atomic():
            # 1. Update Shipment status to Confirmed
            shipment.status = Shipment.Status.CONFIRMED
            shipment.save()

            # 2. Transition linked Transaction status from Held to Released -> Completed
            tx = shipment.transaction
            if tx and tx.status in [Transaction.Status.HELD, Transaction.Status.PENDING, Transaction.Status.RELEASED]:
                tx.status = Transaction.Status.COMPLETED
                tx.save()

            # 3. Sync the DPP with final shipment data
            try:
                dpp = shipment.dpp
                dpp.shipment_status = Shipment.Status.CONFIRMED
                dpp.delivery_date = shipment.delivered_at
                if shipment.logistics_company and shipment.logistics_company.company_name:
                    dpp.logistics_partner = shipment.logistics_company.company_name
                dpp.pickup_date = shipment.pickup_date
                dpp.save()
            except DigitalProductPassport.DoesNotExist:
                pass

        shipment_serializer = ShipmentSerializer(shipment, context={'request': request})
        tx_serializer = TransactionSerializer(tx, context={'request': request}) if tx else None

        return Response({
            "detail": "Receipt confirmed by recycler. Escrow funds released and transaction completed successfully.",
            "shipment": shipment_serializer.data,
            "transaction": tx_serializer.data if tx_serializer else None
        }, status=status.HTTP_200_OK)


class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.ADMIN and not request.user.is_superuser:
            return Response({"detail": "Platform Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        total_users = User.objects.count()
        factories_count = User.objects.filter(role=User.Role.FACTORY).count()
        recyclers_count = User.objects.filter(role=User.Role.RECYCLER).count()
        logistics_count = User.objects.filter(role=User.Role.LOGISTICS).count()

        active_listings = WasteListing.objects.filter(status=WasteListing.Status.PUBLISHED).count()
        active_auctions = Auction.objects.filter(status=Auction.Status.OPEN).count()
        transactions_count = Transaction.objects.count()
        active_shipments = Shipment.objects.filter(
            status__in=[
                Shipment.Status.PENDING,
                Shipment.Status.ASSIGNED,
                Shipment.Status.READY_FOR_PICKUP,
                Shipment.Status.PICKED_UP,
                Shipment.Status.IN_TRANSIT,
                Shipment.Status.DELIVERED
            ]
        ).count()
        completed_deals = Transaction.objects.filter(status=Transaction.Status.COMPLETED).count()

        commission_sum = Transaction.objects.filter(
            status=Transaction.Status.COMPLETED
        ).aggregate(total=django_models.Sum('platform_commission'))['total'] or 0

        return Response({
            'total_users': total_users,
            'factories_count': factories_count,
            'recyclers_count': recyclers_count,
            'logistics_count': logistics_count,
            'active_listings': active_listings,
            'active_auctions': active_auctions,
            'transactions_count': transactions_count,
            'active_shipments': active_shipments,
            'completed_deals': completed_deals,
            'platform_commission_total': str(commission_sum)
        }, status=status.HTTP_200_OK)


class AdminUsersListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.ADMIN and not request.user.is_superuser:
            return Response({"detail": "Platform Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.all().order_by('-created_at')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DPPListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """GET /api/dpp/ — List real Digital Product Passports for the current user's role."""
        user = request.user
        
        # 1. Sync / ensure DPP records exist for user's shipments
        if user.role == User.Role.FACTORY:
            shipments = Shipment.objects.filter(factory=user)
        elif user.role == User.Role.RECYCLER:
            shipments = Shipment.objects.filter(recycler=user)
        elif user.role == User.Role.LOGISTICS:
            shipments = Shipment.objects.filter(
                django_models.Q(logistics_company=user) | django_models.Q(logistics_company__isnull=True)
            )
        elif user.role == User.Role.ADMIN or user.is_superuser:
            shipments = Shipment.objects.all()
        else:
            shipments = Shipment.objects.none()

        for s in shipments:
            get_or_create_dpp_for_shipment(s)

        # 2. Fetch DPP records
        if user.role == User.Role.FACTORY:
            dpps = DigitalProductPassport.objects.filter(shipment__factory=user)
        elif user.role == User.Role.RECYCLER:
            dpps = DigitalProductPassport.objects.filter(shipment__recycler=user)
        elif user.role == User.Role.LOGISTICS:
            dpps = DigitalProductPassport.objects.filter(
                django_models.Q(shipment__logistics_company=user) | django_models.Q(shipment__logistics_company__isnull=True)
            )
        elif user.role == User.Role.ADMIN or user.is_superuser:
            dpps = DigitalProductPassport.objects.all()
        else:
            dpps = DigitalProductPassport.objects.none()

        dpps = dpps.select_related('shipment', 'shipment__listing').order_by('-updated_at')
        serializer = DPPListSerializer(dpps, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class DPPDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """GET /api/dpp/<id>/ — Retrieve a single DPP JSON representation."""
        try:
            dpp = DigitalProductPassport.objects.get(pk=pk)
        except DigitalProductPassport.DoesNotExist:
            return Response({"detail": "Digital Product Passport not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        shipment = dpp.shipment

        # Access control
        allowed = (
            user == shipment.factory
            or user == shipment.recycler
            or user == shipment.logistics_company
            or shipment.logistics_company is None
            or user.role == User.Role.ADMIN
            or user.is_superuser
        )
        if not allowed:
            return Response({"detail": "You do not have permission to view this passport."}, status=status.HTTP_403_FORBIDDEN)

        payload = generate_dpp_json(shipment)
        return Response(payload, status=status.HTTP_200_OK)


class ShipmentDPPDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """GET /api/shipments/<id>/dpp/ — Retrieve standardized DPP JSON payload for a shipment."""
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({"detail": "Shipment not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        allowed = (
            user == shipment.factory
            or user == shipment.recycler
            or user == shipment.logistics_company
            or shipment.logistics_company is None
            or user.role == User.Role.ADMIN
            or user.is_superuser
        )
        if not allowed:
            return Response({"detail": "You do not have permission to view this shipment's DPP."}, status=status.HTTP_403_FORBIDDEN)

        # Sync DPP
        get_or_create_dpp_for_shipment(shipment)
        payload = generate_dpp_json(shipment)
        return Response(payload, status=status.HTTP_200_OK)


class DPPPdfView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """GET /api/dpp/<id>/pdf/ — Stream downloadable PDF for a DPP."""
        try:
            dpp = DigitalProductPassport.objects.get(pk=pk)
            shipment = dpp.shipment
        except DigitalProductPassport.DoesNotExist:
            return Response({"detail": "Digital Product Passport not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        allowed = (
            user == shipment.factory
            or user == shipment.recycler
            or user == shipment.logistics_company
            or shipment.logistics_company is None
            or user.role == User.Role.ADMIN
            or user.is_superuser
        )
        if not allowed:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        payload = generate_dpp_json(shipment)
        pdf_bytes = generate_dpp_pdf_bytes(payload)

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        filename = f"{payload.get('document_id', 'DPP')}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class ShipmentDPPPdfView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        """GET /api/shipments/<id>/dpp/pdf/ — Stream downloadable PDF for a shipment's DPP."""
        try:
            shipment = Shipment.objects.get(pk=pk)
        except Shipment.DoesNotExist:
            return Response({"detail": "Shipment not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        allowed = (
            user == shipment.factory
            or user == shipment.recycler
            or user == shipment.logistics_company
            or shipment.logistics_company is None
            or user.role == User.Role.ADMIN
            or user.is_superuser
        )
        if not allowed:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        get_or_create_dpp_for_shipment(shipment)
        payload = generate_dpp_json(shipment)
        pdf_bytes = generate_dpp_pdf_bytes(payload)

        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        filename = f"{payload.get('document_id', 'DPP')}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


from core.recommendations.engine import get_recommendations_for_user
from core.serializers import RecommendationSerializer

class RecommendationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.RECYCLER:
            return Response(
                {"detail": "Only Recyclers can access personalized recommendations."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        recommendations = get_recommendations_for_user(request.user)
        serializer = RecommendationSerializer(recommendations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LogisticsReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != User.Role.LOGISTICS:
            return Response(
                {"detail": "Only Logistics users can access logistics reports."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        shipments = Shipment.objects.filter(
            django_models.Q(logistics_company=request.user) | django_models.Q(logistics_company__isnull=True)
        )
        
        assigned_shipments = shipments.filter(logistics_company=request.user)
        
        aggregates = assigned_shipments.aggregate(
            total_assigned=django_models.Count('id'),
            pending=django_models.Count('id', filter=django_models.Q(status=Shipment.Status.PENDING)),
            assigned=django_models.Count('id', filter=django_models.Q(status=Shipment.Status.ASSIGNED)),
            ready_for_pickup=django_models.Count('id', filter=django_models.Q(status=Shipment.Status.READY_FOR_PICKUP)),
            picked_up=django_models.Count('id', filter=django_models.Q(status=Shipment.Status.PICKED_UP)),
            in_transit=django_models.Count('id', filter=django_models.Q(status=Shipment.Status.IN_TRANSIT)),
            delivered=django_models.Count('id', filter=django_models.Q(status=Shipment.Status.DELIVERED)),
            confirmed=django_models.Count('id', filter=django_models.Q(status=Shipment.Status.CONFIRMED)),
        )
        
        unassigned_count = shipments.filter(logistics_company__isnull=True).count()
        
        data = {
            "total_assigned_shipments": aggregates['total_assigned'] or 0,
            "unassigned_available": unassigned_count,
            "pending": aggregates['pending'] or 0,
            "assigned": aggregates['assigned'] or 0,
            "ready_for_pickup": aggregates['ready_for_pickup'] or 0,
            "picked_up": aggregates['picked_up'] or 0,
            "in_transit": aggregates['in_transit'] or 0,
            "delivered": aggregates['delivered'] or 0,
            "confirmed_completed": aggregates['confirmed'] or 0,
        }
        
        return Response(data, status=status.HTTP_200_OK)
