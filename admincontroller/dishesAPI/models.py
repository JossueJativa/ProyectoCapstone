from django.db import models

# Create your models here.
class Desk(models.Model):
    desk_number = models.IntegerField()
    capacity = models.IntegerField()

class Allergens(models.Model):
    allergen_name = models.CharField(max_length=100)

class Ingredient(models.Model):
    ingredient_name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    allergen = models.ManyToManyField(Allergens)

class Dish(models.Model):
    dish_name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    time_elaboration = models.TimeField()
    price = models.IntegerField()
    ingredient = models.ManyToManyField(Ingredient)
    link_ar = models.CharField(max_length=1000)

class Order(models.Model):
    dish = models.ManyToManyField(Dish)
    desk = models.ForeignKey(Desk, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()
    total_price = models.IntegerField()
    status = models.CharField(max_length=100)