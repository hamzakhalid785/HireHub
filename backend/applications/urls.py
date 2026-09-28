from django.urls import path

from .views import (
    ApplicationListCreateView,
    ApplicationDetailView,
    ApplicationStatusUpdateView,
    SavedJobListCreateView,
    SavedJobDeleteView,
)

urlpatterns = [
    path("", ApplicationListCreateView.as_view()),
    path("<int:pk>/", ApplicationDetailView.as_view()),
    path(
        "<int:pk>/status/",
        ApplicationStatusUpdateView.as_view(),
    ),

    path(
        "saved/",
        SavedJobListCreateView.as_view(),
    ),
    path(
        "saved/<int:pk>/",
        SavedJobDeleteView.as_view(),
    ),
]