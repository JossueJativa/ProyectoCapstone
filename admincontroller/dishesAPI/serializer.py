from rest_framework import serializers
from .models import (
    Desk,
    Allergens,
    Ingredient,
    Dish,
    Order
)

class DeskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Desk
        fields = '__all__'

class AllergensSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergens
        fields = '__all__'

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'