from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet

urlpatterns = [
    path('user/', UserViewSet.as_view({'get': 'list'}), name='user-list'),
    path('user/login/', UserViewSet.as_view({'post': 'login'}), name='user-login'),
    path('user/register/', UserViewSet.as_view({'post': 'register'}), name='user-register'),
    path('user/logout/', UserViewSet.as_view({'post': 'logout'}), name='user-logout'),

    path('token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]
