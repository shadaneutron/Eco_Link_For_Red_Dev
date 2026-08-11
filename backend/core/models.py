from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        FACTORY = 'factory', 'Factory'
        RECYCLER = 'recycler', 'Recycler'
        LOGISTICS = 'logistics', 'Logistics'
        ADMIN = 'admin', 'Admin'

    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.FACTORY)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    supported_materials = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    def __str__(self):
        return f"{self.email} ({self.role})"


class WasteListing(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        COMPLETED = 'completed', 'Completed'

    factory = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='waste_listings'
    )
    title = models.CharField(max_length=255)
    material_type = models.CharField(max_length=100)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit = models.CharField(max_length=20, default='Tons')
    condition = models.CharField(max_length=50, default='sorted')
    location = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    images = models.JSONField(default=list, blank=True)
    ai_material_type = models.CharField(max_length=100, blank=True, null=True)
    ai_confidence = models.FloatField(blank=True, null=True)
    ai_ewc_code = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PUBLISHED
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.quantity} {self.unit} ({self.status})"


class Auction(models.Model):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        CLOSED = 'closed', 'Closed'
        COMPLETED = 'completed', 'Completed'
        CANCELLED = 'cancelled', 'Cancelled'

    listing = models.ForeignKey(
        WasteListing,
        on_delete=models.CASCADE,
        related_name='auctions'
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN
    )
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Auction #{self.id} for Listing #{self.listing_id} ({self.status})"


class Bid(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'

    auction = models.ForeignKey(
        Auction,
        on_delete=models.CASCADE,
        related_name='bids'
    )
    recycler = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bids'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Bid #{self.id} on Auction #{self.auction_id} by {self.recycler_id}: {self.amount} ({self.status})"


class Transaction(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        HELD = 'Held', 'Held'
        RELEASED = 'Released', 'Released'
        COMPLETED = 'Completed', 'Completed'
        CANCELLED = 'Cancelled', 'Cancelled'

    auction = models.ForeignKey(
        Auction,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    bid = models.OneToOneField(
        Bid,
        on_delete=models.CASCADE,
        related_name='transaction'
    )
    factory = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='factory_transactions'
    )
    recycler = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recycler_transactions'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    platform_commission = models.DecimalField(max_digits=12, decimal_places=2)
    factory_amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.HELD
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if self.amount:
            from decimal import Decimal
            if not self.platform_commission:
                self.platform_commission = (Decimal(str(self.amount)) * Decimal('0.05')).quantize(Decimal('0.01'))
            if not self.factory_amount:
                self.factory_amount = Decimal(str(self.amount)) - Decimal(str(self.platform_commission))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Transaction #{self.id} for Bid #{self.bid_id} - {self.amount} EGP ({self.status})"


class Shipment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending', 'Pending'
        ASSIGNED = 'Assigned', 'Assigned'
        READY_FOR_PICKUP = 'Ready for Pickup', 'Ready for Pickup'
        PICKED_UP = 'Picked Up', 'Picked Up'
        IN_TRANSIT = 'In Transit', 'In Transit'
        DELIVERED = 'Delivered', 'Delivered'
        CONFIRMED = 'Confirmed', 'Confirmed'

    transaction = models.OneToOneField(
        Transaction,
        on_delete=models.CASCADE,
        related_name='shipment'
    )
    listing = models.ForeignKey(
        WasteListing,
        on_delete=models.CASCADE,
        related_name='shipments'
    )
    factory = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='factory_shipments'
    )
    recycler = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='recycler_shipments'
    )
    logistics_company = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='logistics_shipments'
    )
    pickup_location = models.TextField(blank=True, default='')
    destination = models.TextField(blank=True, default='')
    driver_name = models.CharField(max_length=150, blank=True, default='')
    vehicle = models.CharField(max_length=150, blank=True, default='')
    tracking_number = models.CharField(max_length=60, unique=True)
    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING
    )
    pickup_date = models.DateTimeField(null=True, blank=True)
    estimated_arrival = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            import uuid
            self.tracking_number = f"TRK-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Shipment {self.tracking_number} ({self.status})"


import uuid as _uuid_module


class DigitalProductPassport(models.Model):
    """
    One DPP per completed shipment/deal.
    Created atomically when a bid is accepted (Transaction + Shipment + DPP).
    Updated when the Recycler confirms receipt.
    Does NOT expose factory/recycler identity — uses neutral role labels.
    """

    shipment = models.OneToOneField(
        Shipment,
        on_delete=models.CASCADE,
        related_name='dpp'
    )
    dpp_id = models.CharField(max_length=20, unique=True, editable=False)

    # Material & quantity (copied from WasteListing at creation time)
    material_type = models.CharField(max_length=100)
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    unit = models.CharField(max_length=20)
    condition = models.CharField(max_length=50, blank=True)
    ai_classification = models.CharField(max_length=100, blank=True)
    ai_confidence = models.FloatField(null=True, blank=True)

    # Origin/Destination — location text, NOT company name
    origin_governorate = models.CharField(max_length=255, blank=True)
    destination_governorate = models.CharField(max_length=255, blank=True)

    # Deal & financial info
    transaction_id_ref = models.IntegerField(null=True, blank=True)
    deal_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    deal_date = models.DateTimeField(null=True, blank=True)

    # Logistics info
    tracking_number = models.CharField(max_length=60, blank=True)
    logistics_partner = models.CharField(max_length=255, blank=True, default='Eco Link Logistics Partner')
    pickup_date = models.DateTimeField(null=True, blank=True)
    delivery_date = models.DateTimeField(null=True, blank=True)
    shipment_status = models.CharField(max_length=30, blank=True)

    # Sustainability / recycling notes
    carbon_info = models.TextField(blank=True, default='')
    recycling_notes = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.dpp_id:
            self.dpp_id = f"DPP-{_uuid_module.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.dpp_id} — {self.material_type} ({self.shipment_status})"
