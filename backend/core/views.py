from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
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
