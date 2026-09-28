from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Company(models.Model):
    class Size(models.TextChoices):
        STARTUP = "STARTUP", "Startup"
        SMALL = "SMALL", "Small"
        MEDIUM = "MEDIUM", "Medium"
        LARGE = "LARGE", "Large"
        ENTERPRISE = "ENTERPRISE", "Enterprise"

    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=220, unique=True, blank=True)

    logo = models.ImageField(
        upload_to="company_logos/",
        blank=True,
        null=True,
    )
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    industry = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=150, blank=True)

    size = models.CharField(
        max_length=20,
        choices=Size.choices,
        blank=True,
    )

    recruiters = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="companies",
        blank=True,
        limit_choices_to={"role": "RECRUITER"},
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
