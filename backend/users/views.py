from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Skill,
    JobSeekerProfile,
    Education,
    Experience,
)
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    SkillSerializer,
    JobSeekerProfileSerializer,
    EducationSerializer,
    ExperienceSerializer,
)
from .permissions import IsJobSeeker

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    def get(self, request):
        return Response(
            UserSerializer(request.user).data
        )


class SkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]

        return [permissions.IsAuthenticated()]


class JobSeekerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = JobSeekerProfileSerializer
    permission_classes = [IsJobSeeker]

    def get_object(self):
        profile, _ = JobSeekerProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile


class EducationListCreateView(generics.ListCreateAPIView):
    serializer_class = EducationSerializer
    permission_classes = [IsJobSeeker]

    def get_queryset(self):
        return Education.objects.filter(
            profile__user=self.request.user
        )

    def perform_create(self, serializer):
        profile, _ = JobSeekerProfile.objects.get_or_create(
            user=self.request.user
        )
        serializer.save(profile=profile)


class EducationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EducationSerializer
    permission_classes = [IsJobSeeker]

    def get_queryset(self):
        return Education.objects.filter(
            profile__user=self.request.user
        )


class ExperienceListCreateView(generics.ListCreateAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [IsJobSeeker]

    def get_queryset(self):
        return Experience.objects.filter(
            profile__user=self.request.user
        )

    def perform_create(self, serializer):
        profile, _ = JobSeekerProfile.objects.get_or_create(
            user=self.request.user
        )
        serializer.save(profile=profile)


class ExperienceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExperienceSerializer
    permission_classes = [IsJobSeeker]

    def get_queryset(self):
        return Experience.objects.filter(
            profile__user=self.request.user
        )
