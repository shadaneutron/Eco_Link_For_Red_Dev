from rest_framework import serializers
from core.models import DigitalProductPassport

class DPPListSerializer(serializers.ModelSerializer):
    document_id = serializers.CharField(source='dpp_id', read_only=True)
    shipment_id = serializers.IntegerField(source='shipment.id', read_only=True)
    tracking_number = serializers.CharField(source='shipment.tracking_number', read_only=True)
    status = serializers.CharField(source='shipment_status', read_only=True)
    document_type = serializers.SerializerMethodField()
    generated_at = serializers.DateTimeField(source='updated_at', read_only=True)

    class Meta:
        model = DigitalProductPassport
        fields = [
            'id',
            'document_id',
            'dpp_id',
            'shipment_id',
            'tracking_number',
            'document_type',
            'material_type',
            'quantity',
            'unit',
            'status',
            'generated_at',
            'created_at',
        ]

    def get_document_type(self, obj):
        if obj.shipment and obj.shipment.status in ['Confirmed', 'Delivered']:
            return "Digital Product Passport & Recycling Certificate"
        return "Digital Product Passport"
