from django.contrib import admin

from .models import (
    User,
    Skill,
    JobSeekerProfile,
    Education,
    Experience,
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "email",
        "role",
        "is_staff",
        "is_active",
    )
    list_filter = (
        "role",
        "is_staff",
        "is_active",
    )
    search_fields = (
        "username",
        "email",
    )


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)


@admin.register(JobSeekerProfile)
class JobSeekerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "headline",
        "location",
        "experience_years",
    )
    search_fields = (
        "user__username",
        "user__email",
        "headline",
    )


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = (
        "institution",
        "degree",
        "profile",
        "start_date",
    )


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = (
        "company_name",
        "job_title",
        "profile",
        "start_date",
        "is_current",
    )
