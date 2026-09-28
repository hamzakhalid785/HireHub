from rest_framework import serializers

from .models import Job
from users.models import Skill
from companies.models import Company
from companies.serializers import CompanySerializer


class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        source="company",
        write_only=True,
    )

    skills = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
    )

    posted_by = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            "id",
            "company",
            "company_id",
            "posted_by",
            "title",
            "slug",
            "description",
            "responsibilities",
            "requirements",
            "salary_min",
            "salary_max",
            "salary_currency",
            "location",
            "job_type",
            "work_mode",
            "experience_level",
            "skills",
            "status",
            "deadline",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "posted_by",
            "created_at",
            "updated_at",
        ]

    def get_posted_by(self, obj):
        return {
            "id": obj.posted_by.id,
            "username": obj.posted_by.username,
            "email": obj.posted_by.email,
        }

    def validate(self, attrs):
        salary_min = attrs.get("salary_min")
        salary_max = attrs.get("salary_max")

        if (
            salary_min is not None
            and salary_max is not None
            and salary_min > salary_max
        ):
            raise serializers.ValidationError(
                "Minimum salary cannot exceed maximum salary."
            )

        return attrs