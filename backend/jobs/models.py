from django.conf import settings
from django.db import models
from django.utils.text import slugify

from companies.models import Company
from users.models import Skill


class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full Time"
        PART_TIME = "PART_TIME", "Part Time"
        CONTRACT = "CONTRACT", "Contract"
        INTERNSHIP = "INTERNSHIP", "Internship"
        FREELANCE = "FREELANCE", "Freelance"

    class WorkMode(models.TextChoices):
        ONSITE = "ONSITE", "Onsite"
        REMOTE = "REMOTE", "Remote"
        HYBRID = "HYBRID", "Hybrid"

    class ExperienceLevel(models.TextChoices):
        ENTRY = "ENTRY", "Entry Level"
        JUNIOR = "JUNIOR", "Junior"
        MID = "MID", "Mid Level"
        SENIOR = "SENIOR", "Senior"
        LEAD = "LEAD", "Lead"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        CLOSED = "CLOSED", "Closed"

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="jobs",
    )

    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posted_jobs",
    )

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=230, unique=True, blank=True)

    description = models.TextField()
    responsibilities = models.TextField(blank=True)
    requirements = models.TextField(blank=True)

    salary_min = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
    )
    salary_max = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
    )
    salary_currency = models.CharField(
        max_length=10,
        default="PKR",
    )

    location = models.CharField(max_length=150, blank=True)

    job_type = models.CharField(
        max_length=20,
        choices=JobType.choices,
        default=JobType.FULL_TIME,
    )

    work_mode = models.CharField(
        max_length=20,
        choices=WorkMode.choices,
        default=WorkMode.ONSITE,
    )

    experience_level = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.ENTRY,
    )

    skills = models.ManyToManyField(
        Skill,
        blank=True,
        related_name="jobs",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
    )

    deadline = models.DateField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
