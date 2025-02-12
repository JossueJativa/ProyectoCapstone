from django.test import TestCase
from ..models import Desk, Allergens, Ingredient, Dish, Order

class DeskModelTest(TestCase):
    def setUp(self):
        self.desk = Desk.objects.create(desk_number=1, capacity=4)

    def test_desk_creation(self):
        self.assertEqual(self.desk.desk_number, 1)
        self.assertEqual(self.desk.capacity, 4)

class AllergensModelTest(TestCase):
    def setUp(self):
        self.allergen = Allergens.objects.create(allergen_name="Peanuts")

    def test_allergen_creation(self):
        self.assertEqual(self.allergen.allergen_name, "Peanuts")

class IngredientModelTest(TestCase):
    def setUp(self):
        self.allergen = Allergens.objects.create(allergen_name="Peanuts")
        self.ingredient = Ingredient.objects.create(ingredient_name="Flour", quantity=2)
        self.ingredient.allergen.add(self.allergen)

    def test_ingredient_creation(self):
        self.assertEqual(self.ingredient.ingredient_name, "Flour")
        self.assertEqual(self.ingredient.quantity, 2)
        self.assertIn(self.allergen, self.ingredient.allergen.all())

class DishModelTest(TestCase):
    def setUp(self):
        self.ingredient = Ingredient.objects.create(ingredient_name="Flour", quantity=2)
        self.dish = Dish.objects.create(dish_name="Pizza", description="Delicious pizza", time_elaboration="00:30:00", price=10, link_ar="http://example.com")
        self.dish.ingredient.add(self.ingredient)

    def test_dish_creation(self):
        self.assertEqual(self.dish.dish_name, "Pizza")
        self.assertEqual(self.dish.description, "Delicious pizza")
        self.assertEqual(self.dish.time_elaboration, "00:30:00")
        self.assertEqual(self.dish.price, 10)
        self.assertEqual(self.dish.link_ar, "http://example.com")
        self.assertIn(self.ingredient, self.dish.ingredient.all())

class OrderModelTest(TestCase):
    def setUp(self):
        self.desk = Desk.objects.create(desk_number=1, capacity=4)
        self.dish = Dish.objects.create(dish_name="Pizza", description="Delicious pizza", time_elaboration="00:30:00", price=10, link_ar="http://example.com")
        self.order = Order.objects.create(desk=self.desk, date="2023-10-10", time="12:00:00", total_price=10, status="Pending")
        self.order.dish.add(self.dish)

    def test_order_creation(self):
        self.assertEqual(self.order.desk, self.desk)
        self.assertEqual(self.order.date, "2023-10-10")
        self.assertEqual(self.order.time, "12:00:00")
        self.assertEqual(self.order.total_price, 10)
        self.assertEqual(self.order.status, "Pending")
        self.assertIn(self.dish, self.order.dish.all())