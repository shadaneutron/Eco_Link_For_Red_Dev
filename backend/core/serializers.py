from rest_framework import serializers
from django.contrib.auth import authenticate
from core.models import User, WasteListing, Auction, Bid, Transaction, Shipment, DigitalProductPassport
import re

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'full_name',
            'email',
            'role',
            'company_name',
            'phone',
            'is_active',
            'created_at'
        ]
        read_only_fields = ['id', 'is_active', 'created_at']


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=6, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=User.Role.choices, required=True)
    company_name = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    phone = serializers.CharField(max_length=50, required=False, allow_blank=True, default='')

    def validate_email(self, value):
        email_clean = value.strip().lower()
        if User.objects.filter(email__iexact=email_clean).exists():
            raise serializers.ValidationError("A user with this email address already exists.")
        return email_clean

    def validate(self, data):
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})

        valid_roles = [choice[0] for choice in User.Role.choices]
        if data.get('role') not in valid_roles:
            raise serializers.ValidationError({"role": f"Invalid role. Must be one of: {', '.join(valid_roles)}"})

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            company_name=validated_data.get('company_name', ''),
            phone=validated_data.get('phone', '')
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            raise serializers.ValidationError("Both email and password are required.")

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("Account is deactivated.")

        data['user'] = user
        return data


from core.ai.labels import map_ai_material_to_category

class WasteListingSerializer(serializers.ModelSerializer):
    factory_name = serializers.SerializerMethodField()
    category = serializers.CharField(source='material_type', read_only=True)

    def get_factory_name(self, obj):
        return "Verified Industrial Generator"

    class Meta:
        model = WasteListing
        fields = [
            'id',
            'factory',
            'factory_name',
            'title',
            'material_type',
            'category',
            'quantity',
            'unit',
            'condition',
            'location',
            'description',
            'images',
            'ai_material_type',
            'ai_confidence',
            'ai_ewc_code',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'factory', 'factory_name', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            # For Recyclers, remove the factory User ID to prevent user enumeration
            if request.user.role == 'recycler':
                data.pop('factory', None)
        return data

    def validate_title(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("Waste title cannot be empty or whitespace.")
        return value.strip()

    def validate_material_type(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("Material type cannot be empty or whitespace.")
        return value.strip()

    def validate_unit(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("Unit cannot be empty or whitespace.")
        return value.strip()

    def validate_condition(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("Condition cannot be empty or whitespace.")
        return value.strip()

    def validate_location(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("Location / Governorate cannot be empty or whitespace.")
        return value.strip()

    def validate_description(self, value):
        if not value or not str(value).strip():
            raise serializers.ValidationError("Description cannot be empty or whitespace.")
        return value.strip()

    def validate_quantity(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Quantity must be a valid positive number greater than zero.")
        return value

    def validate_images(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Images must be provided as a list.")
        return value

    def validate(self, attrs):
        ai_mat = attrs.get('ai_material_type') or self.initial_data.get('ai_material_type') or self.initial_data.get('aiMaterialType')
        user_mat = attrs.get('material_type') or self.initial_data.get('category') or self.initial_data.get('materialType')
        source_val = ai_mat or user_mat
        if source_val:
            attrs['material_type'] = map_ai_material_to_category(source_val)
            if ai_mat and not attrs.get('ai_material_type'):
                attrs['ai_material_type'] = ai_mat
        elif not attrs.get('material_type'):
            attrs['material_type'] = 'General Industrial Waste'
        return attrs


class PublicWasteListingSerializer(serializers.ModelSerializer):
    """
    Dedicated serializer for anonymous marketplace browsing.
    Excludes all factory identity information (factory ID, factory name, company details).
    """
    category = serializers.CharField(source='material_type', read_only=True)

    class Meta:
        model = WasteListing
        fields = [
            'id',
            'title',
            'material_type',
            'category',
            'quantity',
            'unit',
            'condition',
            'location',
            'description',
            'images',
            'ai_material_type',
            'ai_confidence',
            'ai_ewc_code',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = fields



class PublicAuctionSerializer(serializers.ModelSerializer):
    listing = PublicWasteListingSerializer(read_only=True)
    highest_bid = serializers.SerializerMethodField()
    bids_count = serializers.SerializerMethodField()

    class Meta:
        model = Auction
        fields = [
            'id',
            'listing',
            'status',
            'start_date',
            'end_date',
            'created_at',
            'highest_bid',
            'bids_count'
        ]
        read_only_fields = fields

    def get_highest_bid(self, obj):
        highest = obj.bids.order_by('-amount').first()
        return str(highest.amount) if highest else None

    def get_bids_count(self, obj):
        return obj.bids.count()


class AuctionSerializer(serializers.ModelSerializer):
    listing = WasteListingSerializer(read_only=True)
    highest_bid = serializers.SerializerMethodField()
    bids_count = serializers.SerializerMethodField()

    class Meta:
        model = Auction
        fields = [
            'id',
            'listing',
            'status',
            'start_date',
            'end_date',
            'created_at',
            'highest_bid',
            'bids_count'
        ]
        read_only_fields = ['id', 'listing', 'start_date', 'created_at', 'highest_bid', 'bids_count']

    def get_highest_bid(self, obj):
        highest = obj.bids.order_by('-amount').first()
        return str(highest.amount) if highest else None

    def get_bids_count(self, obj):
        return obj.bids.count()


class CreateBidSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, required=True)

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Bid amount must be greater than zero.")
        return value


class PublicBidSerializer(serializers.ModelSerializer):
    """
    Serializer for Recycler viewing their own bids.
    Contains anonymous listing details and does NOT expose factory identity.
    """
    auction_id = serializers.ReadOnlyField(source='auction.id')
    auction_status = serializers.ReadOnlyField(source='auction.status')
    listing = PublicWasteListingSerializer(source='auction.listing', read_only=True)

    class Meta:
        model = Bid
        fields = [
            'id',
            'auction_id',
            'auction_status',
            'listing',
            'amount',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = fields


class FactoryBidSerializer(serializers.ModelSerializer):
    """
    Serializer for Factory viewing bids for its own auction.
    Identities are masked until the bid is accepted to enforce marketplace anonymity.
    """
    recycler_id = serializers.ReadOnlyField(source='recycler.id')
    recycler_name = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()

    def get_recycler_name(self, obj):
        return "Verified Recycler" if obj.status != 'accepted' else obj.recycler.full_name

    def get_company_name(self, obj):
        return "Verified Recycler" if obj.status != 'accepted' else obj.recycler.company_name

    def get_phone(self, obj):
        return "Hidden until accepted" if obj.status != 'accepted' else obj.recycler.phone

    class Meta:
        model = Bid
        fields = [
            'id',
            'auction',
            'recycler_id',
            'recycler_name',
            'company_name',
            'phone',
            'amount',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = fields


class TransactionSerializer(serializers.ModelSerializer):
    listing = PublicWasteListingSerializer(source='auction.listing', read_only=True)
    factory_name = serializers.SerializerMethodField()
    recycler_name = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id',
            'auction',
            'bid',
            'listing',
            'factory',
            'factory_name',
            'recycler',
            'recycler_name',
            'amount',
            'platform_commission',
            'factory_amount',
            'status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = fields

    def get_factory_name(self, obj):
        if obj.factory and obj.factory.company_name:
            return obj.factory.company_name
        return "Factory Partner"

    def get_recycler_name(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            # When Recycler views their own transaction, show their company name
            if user == obj.recycler or getattr(user, 'role', None) == User.Role.RECYCLER:
                if obj.recycler and obj.recycler.company_name:
                    return obj.recycler.company_name
        # For Factory users or outside roles, return neutral protected label
        return "Verified Recycling Partner"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            # For Factory users, remove the recycler User ID to prevent user enumeration
            if user == instance.factory or getattr(user, 'role', None) == User.Role.FACTORY:
                data['recycler'] = None
        return data


class ShipmentSerializer(serializers.ModelSerializer):
    listing_title = serializers.ReadOnlyField(source='listing.title')
    listing_material_type = serializers.ReadOnlyField(source='listing.material_type')
    listing_quantity = serializers.ReadOnlyField(source='listing.quantity')
    listing_unit = serializers.ReadOnlyField(source='listing.unit')
    factory_name = serializers.ReadOnlyField(source='factory.company_name')
    recycler_name = serializers.SerializerMethodField()
    logistics_name = serializers.ReadOnlyField(source='logistics_company.company_name')

    class Meta:
        model = Shipment
        fields = [
            'id',
            'transaction',
            'listing',
            'listing_title',
            'listing_material_type',
            'listing_quantity',
            'listing_unit',
            'factory',
            'factory_name',
            'recycler',
            'recycler_name',
            'logistics_company',
            'logistics_name',
            'pickup_location',
            'destination',
            'driver_name',
            'vehicle',
            'tracking_number',
            'status',
            'pickup_date',
            'estimated_arrival',
            'delivered_at',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'transaction', 'listing', 'factory', 'recycler', 'created_at', 'updated_at']

    def get_recycler_name(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user == obj.factory or getattr(user, 'role', None) == User.Role.FACTORY:
                return "Verified Recycling Partner"
            if obj.recycler and obj.recycler.company_name:
                return obj.recycler.company_name
        return "Verified Recycling Partner"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            if user == instance.factory or getattr(user, 'role', None) == User.Role.FACTORY:
                data['recycler'] = None
        return data



class DigitalProductPassportSerializer(serializers.ModelSerializer):
    """
    Serializer for DigitalProductPassport.
    Exposes operational and material data without factory/recycler identity.
    Adds computed fields from related Shipment/Transaction.
    """
    shipment_id = serializers.ReadOnlyField(source='shipment.id')
    shipment_tracking = serializers.ReadOnlyField(source='shipment.tracking_number')
    shipment_current_status = serializers.ReadOnlyField(source='shipment.status')
    # Neutral role labels — no real identity
    waste_generator_role = serializers.SerializerMethodField()
    recycler_role = serializers.SerializerMethodField()

    class Meta:
        model = DigitalProductPassport
        fields = [
            'id',
            'dpp_id',
            'shipment_id',
            'shipment_tracking',
            'shipment_current_status',
            'material_type',
            'quantity',
            'unit',
            'condition',
            'ai_classification',
            'ai_confidence',
            'origin_governorate',
            'destination_governorate',
            'waste_generator_role',
            'recycler_role',
            'transaction_id_ref',
            'deal_amount',
            'deal_date',
            'tracking_number',
            'logistics_partner',
            'pickup_date',
            'delivery_date',
            'shipment_status',
            'carbon_info',
            'recycling_notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = fields

    def get_waste_generator_role(self, obj):
        return 'Verified Industrial Generator'

    def get_recycler_role(self, obj):
        return 'Verified Recycling Partner'
class RecommendationSerializer(serializers.Serializer):
    listing = WasteListingSerializer()
    match_score = serializers.FloatField()
    insights = serializers.ListField(child=serializers.CharField())
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Enforce anonymity in recommendations
        if 'listing' in data and 'factory_name' in data['listing']:
            data['listing']['factory_name'] = "Verified Industrial Generator"
        return data
