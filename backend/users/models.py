from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        JOB_SEEKER = "JOB_SEEKER", "Job Seeker"
        RECRUITER = "RECRUITER", "Recruiter"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.JOB_SEEKER,
    )

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    def __str__(self):
        return self.username


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        ordering = ["name"]
        
class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class JobSeekerProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="job_seeker_profile",
    )
    headline = models.CharField(max_length=200, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=150, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    resume = models.FileField(
        upload_to="resumes/",
        blank=True,
        null=True,
    )
    skills = models.ManyToManyField(
        Skill,
        blank=True,
        related_name="job_seekers",
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Education(models.Model):
    profile = models.ForeignKey(
        JobSeekerProfile,
        on_delete=models.CASCADE,
        related_name="education",
    )
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=150)
    field_of_study = models.CharField(max_length=150, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Experience(models.Model):
    profile = models.ForeignKey(
        JobSeekerProfile,
        on_delete=models.CASCADE,
        related_name="experience",
    )
    company_name = models.CharField(max_length=200)
    job_title = models.CharField(max_length=150)
    location = models.CharField(max_length=150, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.job_title} - {self.company_name}"