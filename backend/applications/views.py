from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from .models import Application, SavedJob
from .serializers import (
    ApplicationSerializer,
    ApplicationStatusSerializer,
    SavedJobSerializer,
)
from users.permissions import IsJobSeeker, IsRecruiter
from notifications.models import Notification


class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == "RECRUITER":
            return (
                Application.objects
                .filter(job__posted_by=user)
                .select_related(
                    "job",
                    "job__company",
                    "applicant",
                )
            )

        return (
            Application.objects
            .filter(applicant=user)
            .select_related(
                "job",
                "job__company",
                "applicant",
            )
        )

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsJobSeeker()]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        job = serializer.validated_data["job"]

        if job.status != "PUBLISHED":
            raise ValidationError(
                "You can only apply to published jobs."
            )

        if (
            job.deadline
            and job.deadline < __import__("datetime").date.today()
        ):
            raise ValidationError(
                "The application deadline has passed."
            )

        application = serializer.save(
            applicant=self.request.user
        )

        Notification.objects.create(
            user=job.posted_by,
            title="New Job Application",
            message=(
                f"{self.request.user.username} applied "
                f"for {job.title}."
            ),
            notification_type=(
                Notification.NotificationType.APPLICATION
            ),
        )


class ApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "RECRUITER":
            return Application.objects.filter(
                job__posted_by=user
            )

        return Application.objects.filter(
            applicant=user
        )


class ApplicationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = ApplicationStatusSerializer
    permission_classes = [IsRecruiter]

    def get_queryset(self):
        return Application.objects.filter(
            job__posted_by=self.request.user
        )

    def perform_update(self, serializer):
        application = self.get_object()

        old_status = application.status

        application = serializer.save()

        if old_status != application.status:
            Notification.objects.create(
                user=application.applicant,
                title="Application Status Updated",
                message=(
                    f"Your application for "
                    f"{application.job.title} is now "
                    f"{application.get_status_display()}."
                ),
                notification_type=(
                    Notification.NotificationType.STATUS_UPDATE
                ),
            )


class SavedJobListCreateView(generics.ListCreateAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [IsJobSeeker]

    def get_queryset(self):
        return (
            SavedJob.objects
            .filter(user=self.request.user)
            .select_related("job", "job__company")
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavedJobDeleteView(generics.DestroyAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [IsJobSeeker]

    def get_queryset(self):
        return SavedJob.objects.filter(
            user=self.request.user
        )