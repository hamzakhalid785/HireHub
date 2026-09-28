from django.db.models import Q
from django.utils import timezone

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Job
from .serializers import JobSerializer
from users.permissions import IsRecruiter


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        queryset = (
            Job.objects
            .select_related("company", "posted_by")
            .prefetch_related("skills")
        )

        if (
            self.request.user.is_authenticated
            and self.request.user.role == "RECRUITER"
        ):
            return queryset.filter(
                posted_by=self.request.user
            )

        queryset = queryset.filter(
            status=Job.Status.PUBLISHED
        )

        search = self.request.query_params.get("search")
        location = self.request.query_params.get("location")
        job_type = self.request.query_params.get("job_type")
        work_mode = self.request.query_params.get("work_mode")
        experience = self.request.query_params.get(
            "experience_level"
        )

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(company__name__icontains=search)
            )

        if location:
            queryset = queryset.filter(
                location__icontains=location
            )

        if job_type:
            queryset = queryset.filter(job_type=job_type)

        if work_mode:
            queryset = queryset.filter(work_mode=work_mode)

        if experience:
            queryset = queryset.filter(
                experience_level=experience
            )

        return queryset

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsRecruiter()]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer

    def get_queryset(self):
        return (
            Job.objects
            .select_related("company", "posted_by")
            .prefetch_related("skills")
        )

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.IsAuthenticated()]

        return [IsRecruiter()]

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)

        if request.method != "GET":
            if obj.posted_by != request.user:
                raise PermissionDenied(
                    "You can only manage your own jobs."
                )
