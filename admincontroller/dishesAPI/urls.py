from django.urls import path, include
from rest_framework import routers
from .views import DeskViewSet, AllergensViewSet, IngredientViewSet, DishViewSet, OrderViewSet

router = routers.DefaultRouter()
router.register(r'desk', DeskViewSet)
router.register(r'allergens', AllergensViewSet)
router.register(r'ingredient', IngredientViewSet)
router.register(r'dish', DishViewSet)
router.register(r'order', OrderViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]