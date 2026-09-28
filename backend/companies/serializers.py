from rest_framework import serializers

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    recruiters = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "slug",
            "logo",
            "website",
            "description",
            "industry",
            "location",
            "size",
            "recruiters",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "recruiters",
            "created_at",
            "updated_at",
        ]