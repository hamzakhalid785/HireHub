from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import (
    Skill,
    JobSeekerProfile,
    Education,
    Experience,
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "phone",
            "avatar",
        ]
        read_only_fields = ["id"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
            "role",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )

        if attrs["role"] not in [
            User.Role.JOB_SEEKER,
            User.Role.RECRUITER,
        ]:
            raise serializers.ValidationError(
                {"role": "Invalid role."}
            )

        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")

        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "slug"]
        read_only_fields = ["id", "slug"]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            "id",
            "institution",
            "degree",
            "field_of_study",
            "start_date",
            "end_date",
            "description",
        ]
        read_only_fields = ["id"]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            "id",
            "company_name",
            "job_title",
            "location",
            "start_date",
            "end_date",
            "is_current",
            "description",
        ]
        read_only_fields = ["id"]


class JobSeekerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    skill_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        source="skills",
        write_only=True,
        required=False,
    )
    education = EducationSerializer(many=True, read_only=True)
    experience = ExperienceSerializer(many=True, read_only=True)

    class Meta:
        model = JobSeekerProfile
        fields = [
            "id",
            "user",
            "headline",
            "bio",
            "location",
            "experience_years",
            "resume",
            "skills",
            "skill_ids",
            "education",
            "experience",
        ]
        read_only_fields = ["id", "user"]