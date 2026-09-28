from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "company",
        "posted_by",
        "job_type",
        "work_mode",
        "status",
        "deadline",
        "created_at",
    )
    list_filter = (
        "status",
        "job_type",
        "work_mode",
        "experience_level",
    )
    search_fields = (
        "title",
        "company__name",
        "location",
    )