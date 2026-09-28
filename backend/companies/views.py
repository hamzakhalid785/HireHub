from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Company
from .serializers import CompanySerializer
from users.permissions import IsRecruiter


class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsRecruiter()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        company = serializer.save()
        company.recruiters.add(self.request.user)


class CompanyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsRecruiter()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)

        if request.method != "GET":
            if request.user not in obj.recruiters.all():
                raise PermissionDenied(
                    "You are not authorized to manage this company."
                )
