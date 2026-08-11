import uuid
from django.utils import timezone
from core.models import DigitalProductPassport, Shipment
from .generator import generate_dpp_json

def get_or_create_dpp_for_shipment(shipment):
    """
    Ensures that a Shipment has a linked DigitalProductPassport.
    Idempotent: syncs updated fields if DPP already exists.
    """
    try:
        dpp = shipment.dpp
    except Exception:
        dpp = None

    listing = shipment.listing
    tx = getattr(shipment, 'transaction', None)

    if not dpp:
        dpp_code = f"DPP-{uuid.uuid4().hex[:8].upper()}"
        dpp = DigitalProductPassport.objects.create(
            shipment=shipment,
            dpp_id=dpp_code,
            material_type=listing.material_type if listing else "Industrial Waste",
            quantity=listing.quantity if listing else 1.0,
            unit=listing.unit if listing else "Tons",
            condition=listing.condition if listing else "Sorted",
            ai_classification=listing.ai_material_type or "",
            ai_confidence=listing.ai_confidence,
            origin_governorate=shipment.pickup_location or (listing.location if listing else "Factory Origin"),
            destination_governorate=shipment.destination or "Recycling Facility",
            transaction_id_ref=tx.id if tx else None,
            deal_amount=tx.amount if tx else None,
            deal_date=tx.created_at if tx else shipment.created_at,
            tracking_number=shipment.tracking_number,
            logistics_partner=shipment.logistics_company.company_name if (shipment.logistics_company and shipment.logistics_company.company_name) else 'Eco Link Logistics Partner',
            pickup_date=shipment.pickup_date,
            delivery_date=shipment.delivered_at,
            shipment_status=shipment.status,
            carbon_info=f"Estimated carbon offset: {float(listing.quantity if listing else 1.0) * 1.25:.1f} t CO₂",
            recycling_notes="Verified per Eco Link sustainability & circularity standards."
        )
    else:
        # Sync latest shipment updates to DPP record
        dpp.shipment_status = shipment.status
        dpp.tracking_number = shipment.tracking_number
        if shipment.delivered_at:
            dpp.delivery_date = shipment.delivered_at
        if shipment.pickup_date:
            dpp.pickup_date = shipment.pickup_date
        if shipment.logistics_company and shipment.logistics_company.company_name:
            dpp.logistics_partner = shipment.logistics_company.company_name
        dpp.save()

    return dpp

def generate_dpp_pdf_bytes(dpp_payload):
    """
    Generates pure binary PDF-1.4 document bytes from a standardized DPP JSON payload.
    Zero external C/binary dependencies required.
    """
    doc_id = dpp_payload.get("document_id", "DPP-REPORT")
    doc_type = dpp_payload.get("document_type", "Digital Product Passport")
    gen_at = str(dpp_payload.get("generated_at", ""))

    shipment = dpp_payload.get("shipment", {})
    material = dpp_payload.get("material", {})
    origin = dpp_payload.get("origin", {})
    destination = dpp_payload.get("destination", {})
    transaction = dpp_payload.get("transaction", {})
    logistics = dpp_payload.get("logistics", {})
    circularity = dpp_payload.get("circularity", {})
    verification = dpp_payload.get("verification", {})

    lines = [
        "============================================================",
        "          ECO LINK - DIGITAL PRODUCT PASSPORT",
        "============================================================",
        f" Document ID   : {doc_id}",
        f" Document Type : {doc_type}",
        f" Generated At  : {gen_at}",
        "------------------------------------------------------------",
        " SHIPMENT INFORMATION",
        "------------------------------------------------------------",
        f" Tracking No   : {shipment.get('tracking_number', 'N/A')}",
        f" Status        : {shipment.get('status', 'N/A')}",
        f" Created At    : {shipment.get('created_at', 'N/A')}",
        f" Delivered At  : {shipment.get('delivered_at', 'N/A')}",
        f" Confirmed At  : {shipment.get('confirmed_at', 'N/A')}",
        "------------------------------------------------------------",
        " MATERIAL SPECIFICATIONS",
        "------------------------------------------------------------",
        f" Title         : {material.get('title', 'N/A')}",
        f" Type          : {material.get('material_type', 'N/A')}",
        f" Quantity      : {material.get('quantity', 0)} {material.get('unit', '')}",
        f" Condition     : {material.get('condition', 'N/A')}",
        f" AI Class      : {material.get('ai_classification', 'N/A')}",
        f" AI Confidence : {material.get('ai_confidence', 0)}",
        "------------------------------------------------------------",
        " LOGISTICS & ORIGIN / DESTINATION",
        "------------------------------------------------------------",
        f" Logistics Co. : {logistics.get('company', 'N/A')}",
        f" Driver        : {logistics.get('driver', 'N/A')}",
        f" Vehicle       : {logistics.get('vehicle', 'N/A')}",
        f" Origin        : {origin.get('location', 'N/A')}",
        f" Destination   : {destination.get('location', 'N/A')}",
        "------------------------------------------------------------",
        " FINANCIAL & CIRCULARITY SUMMARY",
        "------------------------------------------------------------",
        f" Deal Amount   : {transaction.get('amount', 0)} {transaction.get('currency', 'EGP')}",
        f" Tx Status     : {transaction.get('status', 'N/A')}",
        f" Recovery Est. : {circularity.get('material_recovery', 'N/A')}",
        f" Carbon Offset : {circularity.get('estimated_carbon_offset', 'N/A')}",
        "------------------------------------------------------------",
        " VERIFICATION STAMP",
        "------------------------------------------------------------",
        f" Identity Verified  : {verification.get('identity_verified', True)}",
        f" Delivery Confirmed : {verification.get('delivery_confirmed', False)}",
        "============================================================",
        " Official Eco Link Verified Document - Single Source of Truth",
        "============================================================",
    ]

    content_stream = "BT /F1 10 Tf 50 780 Td 14 TL\n"
    for line in lines:
        escaped = line.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        content_stream += f"({escaped}) Tj T*\n"
    content_stream += "ET\n"

    content_bytes = content_stream.encode('latin1', errors='replace')

    objects = []
    objects.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    objects.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    objects.append(b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n")
    objects.append(f"4 0 obj\n<< /Length {len(content_bytes)} >>\nstream\n".encode('ascii') + content_bytes + b"\nendstream\nendobj\n")
    objects.append(b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n")

    header = b"%PDF-1.4\n"
    body = b""
    xref_offsets = [0]

    current_offset = len(header)
    for obj in objects:
        xref_offsets.append(current_offset)
        body += obj
        current_offset += len(obj)

    xref_start = current_offset
    xref = f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode('ascii')
    for offset in xref_offsets[1:]:
        xref += f"{offset:010d} 00000 n \n".encode('ascii')

    trailer = f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_start}\n%%EOF\n".encode('ascii')

    return header + body + xref + trailer
