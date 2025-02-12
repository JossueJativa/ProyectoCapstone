from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from datetime import datetime, timezone

from authAPI.models import User
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

def validate_token(user_token):
    try:
        refresh = RefreshToken(user_token)

        exp_timestamp = refresh.payload.get("exp")
        exp_datetime = datetime.fromtimestamp(exp_timestamp, timezone.utc)
        now = datetime.now(timezone.utc)

        if now > exp_datetime:
            raise AuthenticationFailed('Token expired')
        
        user_id = refresh["user_id"]
        user = User.objects.get(pk=user_id)
        
        return user

    except InvalidToken:
        raise AuthenticationFailed('Invalid token')
    except AuthenticationFailed:
        raise AuthenticationFailed('Authentication failed')
    except Exception as e:
        raise AuthenticationFailed('An error occurred')

class DeskViewSet(viewsets.ModelViewSet):
    queryset = Desk.objects.all()
    serializer_class = DeskSerializer

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'desk_number': openapi.Schema(type=openapi.TYPE_INTEGER),
            'capacity': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def create(self, request, *args, **kwargs):
        desk_number = request.data.get('desk_number')
        capacity = request.data.get('capacity')
        user_token = request.data.get('user_token')

        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        if not desk_number or not capacity:
            return Response({'error': 'Invalid data'}, status=400)

        desk = Desk.objects.create(desk_number=desk_number, capacity=capacity)
        desk.save()
        return Response({'success': 'Desk created'}, status=201)
    
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'desk_number': openapi.Schema(type=openapi.TYPE_INTEGER),
            'capacity': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def update(self, request, *args, **kwargs):
        desk_number = request.data.get('desk_number')
        capacity = request.data.get('capacity')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        if not desk_number or not capacity:
            return Response({'error': 'Invalid data'}, status=400)

        desk = Desk.objects.get(desk_number=desk_number)
        desk.capacity = capacity
        desk.save()
        return Response({'success': 'Desk updated'}, status=200)
    
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def delete(self, request, *args, **kwargs):
        desk_id = request.data.get('id')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        desk = Desk.objects.get(id=desk_id)
        desk.delete()
        return Response({'success': 'Desk deleted'}, status=200)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Method not allowed'}, status=405)

class AllergensViewSet(viewsets.ModelViewSet):
    queryset = Allergens.objects.all()
    serializer_class = AllergensSerializer

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'allergen_name': openapi.Schema(type=openapi.TYPE_STRING),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def create(self, request, *args, **kwargs):
        allergen_name = request.data.get('allergen_name')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        if not allergen_name:
            return Response({'error': 'Invalid data'}, status=400)

        allergen = Allergens.objects.create(allergen_name=allergen_name)
        allergen.save()
        return Response({'success': 'Allergen created'}, status=201)
    
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'allergen_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'allergen_name': openapi.Schema(type=openapi.TYPE_STRING),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def update(self, request, *args, **kwargs):
        allergen_id = request.data.get('allergen_id')
        allergen_name = request.data.get('allergen_name')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        if not allergen_name:
            return Response({'error': 'Invalid data'}, status=400)

        allergen = Allergens.objects.get(id=allergen_id)
        allergen.allergen_name = allergen_name
        allergen.save()
        return Response({'success': 'Allergen updated'}, status=200)
    
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def delete(self, request, *args, **kwargs):
        allergen_id = request.data.get('id')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        allergen = Allergens.objects.get(id=allergen_id)
        allergen.delete()
        return Response({'success': 'Allergen deleted'}, status=200)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Method not allowed'}, status=405)

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'ingredient_name': openapi.Schema(type=openapi.TYPE_STRING),
            'quantity': openapi.Schema(type=openapi.TYPE_INTEGER),
            'allergen': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER)
            ),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def create(self, request, *args, **kwargs):
        ingredient_name = request.data.get('ingredient_name')
        quantity = request.data.get('quantity')
        allergen = request.data.get('allergen')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        if not ingredient_name or not quantity or not allergen:
            return Response({'error': 'Invalid data'}, status=400)

        ingredient = Ingredient.objects.create(ingredient_name=ingredient_name, quantity=quantity)
        ingredient.allergen.set(allergen)
        ingredient.save()
        return Response({'success': 'Ingredient created'}, status=201)
    
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'ingredient_name': openapi.Schema(type=openapi.TYPE_STRING),
            'quantity': openapi.Schema(type=openapi.TYPE_INTEGER),
            'allergen': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER)
            ),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def update(self, request, *args, **kwargs):
        ingredient_name = request.data.get('ingredient_name')
        quantity = request.data.get('quantity')
        allergen = request.data.get('allergen')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        if not ingredient_name or not quantity or not allergen:
            return Response({'error': 'Invalid data'}, status=400)

        ingredient = Ingredient.objects.get(ingredient_name=ingredient_name)
        ingredient.quantity = quantity
        ingredient.allergen.set(allergen)
        ingredient.save()
        return Response({'success': 'Ingredient updated'}, status=200)
    
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def delete(self, request, *args, **kwargs):
        ingredient_id = request.data.get('id')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        ingredient = Ingredient.objects.get(id=ingredient_id)
        ingredient.delete()
        return Response({'success': 'Ingredient deleted'}, status=200)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Method not allowed'}, status=405)

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'dish_name': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING),
            'time_elaboration': openapi.Schema(type=openapi.TYPE_STRING),
            'price': openapi.Schema(type=openapi.TYPE_INTEGER),
            'ingredient': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER)
            ),
            'link_ar': openapi.Schema(type=openapi.TYPE_STRING),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def create(self, request, *args, **kwargs):
        dish_name = request.data.get('dish_name')
        description = request.data.get('description')
        time_elaboration = request.data.get('time_elaboration')
        price = request.data.get('price')
        ingredient = request.data.get('ingredient')
        link_ar = request.data.get('link_ar')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        if not dish_name or not description or not time_elaboration or not price or not ingredient or not link_ar:
            return Response({'error': 'Invalid data'}, status=400)

        dish = Dish.objects.create(dish_name=dish_name, description=description, time_elaboration=time_elaboration, price=price, link_ar=link_ar)
        dish.ingredient.set(ingredient)
        dish.save()
        return Response({'success': 'Dish created'}, status=201)
    
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'dish_name': openapi.Schema(type=openapi.TYPE_STRING),
            'description': openapi.Schema(type=openapi.TYPE_STRING),
            'time_elaboration': openapi.Schema(type=openapi.TYPE_STRING),
            'price': openapi.Schema(type=openapi.TYPE_INTEGER),
            'ingredient': openapi.Schema(
                type=openapi.TYPE_ARRAY,
                items=openapi.Items(type=openapi.TYPE_INTEGER)
            ),
            'link_ar': openapi.Schema(type=openapi.TYPE_STRING),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def update(self, request, *args, **kwargs):
        dish_name = request.data.get('dish_name')
        description = request.data.get('description')
        time_elaboration = request.data.get('time_elaboration')
        price = request.data.get('price')
        ingredient = request.data.get('ingredient')
        link_ar = request.data.get('link_ar')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        if not dish_name or not description or not time_elaboration or not price or not ingredient or not link_ar:
            return Response({'error': 'Invalid data'}, status=400)

        dish = Dish.objects.get(dish_name=dish_name)
        dish.description = description
        dish.time_elaboration = time_elaboration
        dish.price = price
        dish.link_ar = link_ar
        dish.ingredient.set(ingredient)
        dish.save()
        return Response({'success': 'Dish updated'}, status=200)
    
    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'id': openapi.Schema(type=openapi.TYPE_INTEGER),
            'user_token': openapi.Schema(type=openapi.TYPE_STRING),
        }
    ))
    def delete(self, request, *args, **kwargs):
        dish_id = request.data.get('id')
        user_token = request.data.get('user_token')
        
        try:
            user = validate_token(user_token)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=401)

        dish = Dish.objects.get(id=dish_id)
        dish.delete()
        return Response({'success': 'Dish deleted'}, status=200)
    
    def partial_update(self, request, *args, **kwargs):
        return Response({'error': 'Method not allowed'}, status=405)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer