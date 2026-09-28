from rest_framework.permissions import BasePermission


class IsJobSeeker(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "JOB_SEEKER"
        )


class IsRecruiter(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "RECRUITER"
        )


class IsRecruiterOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        return (
            request.user.is_authenticated
            and request.user.role == "RECRUITER"
        )


class IsCompanyRecruiter(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.recruiters.all()


class IsJobOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.posted_by == request.user