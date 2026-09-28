from rest_framework import serializers

from .models import Application, SavedJob


class ApplicationSerializer(serializers.ModelSerializer):
    applicant = serializers.SerializerMethodField()
    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )
    company_name = serializers.CharField(
        source="job.company.name",
        read_only=True,
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "applicant",
            "resume",
            "cover_letter",
            "status",
            "applied_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "applicant",
            "status",
            "applied_at",
            "updated_at",
        ]

    def get_applicant(self, obj):
        return {
            "id": obj.applicant.id,
            "username": obj.applicant.username,
            "email": obj.applicant.email,
            "first_name": obj.applicant.first_name,
            "last_name": obj.applicant.last_name,
        }


class ApplicationStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ["status"]


class SavedJobSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(
        source="job.title",
        read_only=True,
    )
    company_name = serializers.CharField(
        source="job.company.name",
        read_only=True,
    )

    class Meta:
        model = SavedJob
        fields = [
            "id",
            "job",
            "job_title",
            "company_name",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]