from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from ..authAPI.models import User
from .models import (
    Desk,
    Allergens,
    Ingredient,
    Dish,
    Order
)
from .serializer import (
    DeskSerializer,
    AllergensSerializer,
    IngredientSerializer,
    DishSerializer,
    OrderSerializer
)

class DeskViewSet(viewsets.ModelViewSet):
    queryset = Desk.objects.all()
    serializer_class = DeskSerializer

    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'capacity': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        capacity = request.data.get('capacity')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        desk = Desk.objects.create(name=name, capacity=capacity)
        desk.save()
        return Response({'success': 'Desk created'}, status=201)
    
    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'capacity': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def update(self, request, *args, **kwargs):
        name = request.data.get('name')
        capacity = request.data.get('capacity')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        desk = Desk.objects.get(name=name)
        desk.capacity = capacity
        desk.save()
        return Response({'success': 'Desk updated'}, status=200)
    
    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def delete(self, request, *args, **kwargs):
        desk_id = request.data.get('id')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        desk = Desk.objects.get(id=desk_id)
        desk.delete()
        return Response({'success': 'Desk deleted'}, status=200)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Method not allowed'}, status=405)

class AllergensViewSet(viewsets.ModelViewSet):
    queryset = Allergens.objects.all()
    serializer_class = AllergensSerializer

    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        allergen = Allergens.objects.create(name=name)
        allergen.save()
        return Response({'success': 'Allergen created'}, status=201)
    
    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def update(self, request, *args, **kwargs):
        name = request.data.get('name')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        allergen = Allergens.objects.get(name=name)
        allergen.save()
        return Response({'success': 'Allergen updated'}, status=200)
    
    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def delete(self, request, *args, **kwargs):
        allergen_id = request.data.get('id')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        allergen = Allergens.objects.get(id=allergen_id)
        allergen.delete()
        return Response({'success': 'Allergen deleted'}, status=200)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Method not allowed'}, status=405)

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'quantity': openapi.Schema(type=openapi.TYPE_INTEGER),
            'allergen': openapi.Schema(type=openapi.TYPE_ARRAY),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        quantity = request.data.get('quantity')
        allergen = request.data.get('allergen')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        ingredient = Ingredient.objects.create(name=name, quantity=quantity)
        ingredient.allergen.set(allergen)
        ingredient.save()
        return Response({'success': 'Ingredient created'}, status=201)
    
    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'quantity': openapi.Schema(type=openapi.TYPE_INTEGER),
            'allergen': openapi.Schema(type=openapi.TYPE_ARRAY),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def update(self, request, *args, **kwargs):
        name = request.data.get('name')
        quantity = request.data.get('quantity')
        allergen = request.data.get('allergen')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        ingredient = Ingredient.objects.get(name=name)
        ingredient.quantity = quantity
        ingredient.allergen.set(allergen)
        ingredient.save()
        return Response({'success': 'Ingredient updated'}, status=200)
    
    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def delete(self, request, *args, **kwargs):
        ingredient_id = request.data.get('id')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        ingredient = Ingredient.objects.get(id=ingredient_id)
        ingredient.delete()
        return Response({'success': 'Ingredient deleted'}, status=200)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Method not allowed'}, status=405)

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer

    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING),
            'time_elaboration': openapi.Schema(type=openapi.TYPE_STRING),
            'price': openapi.Schema(type=openapi.TYPE_INTEGER),
            'ingredient': openapi.Schema(type=openapi.TYPE_ARRAY),
            'link_ar': openapi.Schema(type=openapi.TYPE_STRING),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        description = request.data.get('description')
        time_elaboration = request.data.get('time_elaboration')
        price = request.data.get('price')
        ingredient = request.data.get('ingredient')
        link_ar = request.data.get('link_ar')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        dish = Dish.objects.create(name=name, description=description, time_elaboration=time_elaboration, price=price, link_ar=link_ar)
        dish.ingredient.set(ingredient)
        dish.save()
        return Response({'success': 'Dish created'}, status=201)
    
    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING),
            'time_elaboration': openapi.Schema(type=openapi.TYPE_STRING),
            'price': openapi.Schema(type=openapi.TYPE_INTEGER),
            'ingredient': openapi.Schema(type=openapi.TYPE_ARRAY),
            'link_ar': openapi.Schema(type=openapi.TYPE_STRING),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def update(self, request, *args, **kwargs):
        name = request.data.get('name')
        description = request.data.get('description')
        time_elaboration = request.data.get('time_elaboration')
        price = request.data.get('price')
        ingredient = request.data.get('ingredient')
        link_ar = request.data.get('link_ar')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        dish = Dish.objects.get(name=name)
        dish.description = description
        dish.time_elaboration = time_elaboration
        dish.price = price
        dish.link_ar = link_ar
        dish.ingredient.set(ingredient)
        dish.save()
        return Response({'success': 'Dish updated'}, status=200)
    
    @swagger_auto_schema(method='post', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    @action(detail=False, methods=['post'])
    def delete(self, request, *args, **kwargs):
        dish_id = request.data.get('id')
        user_token = request.data.get('user_token')
        
        # Check if token is expired
        if refresh.access_token.is_expired:
            return Response({'error': 'Token expired'}, status=401)
        
        # Validate refresh token
        refresh = RefreshToken(user_token)
        user_id = refresh['user_id']
        user = User.objects.get(id=user_id)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)

        dish = Dish.objects.get(id=dish_id)
        dish.delete()
        return Response({'success': 'Dish deleted'}, status=200)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Method not allowed'}, status=405)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer