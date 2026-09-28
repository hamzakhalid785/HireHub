from django.urls import path

from .views import (
    RegisterView,
    MeView,
    SkillListCreateView,
    JobSeekerProfileView,
    EducationListCreateView,
    EducationDetailView,
    ExperienceListCreateView,
    ExperienceDetailView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("me/", MeView.as_view()),
    path("skills/", SkillListCreateView.as_view()),
    path("profile/", JobSeekerProfileView.as_view()),

    path(
        "education/",
        EducationListCreateView.as_view(),
    ),
    path(
        "education/<int:pk>/",
        EducationDetailView.as_view(),
    ),

    path(
        "experience/",
        ExperienceListCreateView.as_view(),
    ),
    path(
        "experience/<int:pk>/",
        ExperienceDetailView.as_view(),
    ),
]