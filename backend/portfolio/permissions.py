"""
Custom permissions for the XMP Portfolio backend.
"""
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit objects.
    Read-only access is allowed for any request (authenticated or not).
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to admin users.
        return request.user and request.user.is_staff

class AllowAnyCreateOrIsAuthenticated(permissions.BasePermission):
    """
    Custom permission to allow 'create' action for any user,
    but require authentication for all other actions.
    """

    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        return request.user and request.user.is_authenticated

class AllowAnyCreateOrIsAdmin(permissions.BasePermission):
    """
    Custom permission to allow 'create' action for any user,
    but require admin privileges for all other actions.
    """

    def has_permission(self, request, view):
        if view.action == 'create':
            return True
        return request.user and request.user.is_staff
