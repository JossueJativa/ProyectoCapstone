from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from ..authAPI.models import User
from .models import Desk, Allergens, Ingredient, Dish, Order

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
        self.order = Order.objects.create(desk=self.desk, date="2023-01-01", time="12:00:00", total_price=10, status="Pending")
        self.order.dish.add(self.dish)

    def test_order_creation(self):
        self.assertEqual(self.order.desk, self.desk)
        self.assertEqual(self.order.date, "2023-01-01")
        self.assertEqual(self.order.time, "12:00:00")
        self.assertEqual(self.order.total_price, 10)
        self.assertEqual(self.order.status, "Pending")
        self.assertIn(self.dish, self.order.dish.all())

class DeskViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.refresh = RefreshToken.for_user(self.user)
        self.invalid_token = 'invalidtoken'
        self.desk_data = {'desk_number': 1, 'capacity': 4, 'user_token': str(self.refresh)}
        self.desk = Desk.objects.create(desk_number=2, capacity=6)
        self.desk_url = f'/api/desk/{self.desk.id}/'

    def test_create_desk(self):
        response = self.client.post('/api/desk/', self.desk_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_desk(self):
        response = self.client.get(self.desk_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_desk(self):
        updated_data = {'desk_number': 2, 'capacity': 8}
        response = self.client.put(self.desk_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_desk(self):
        response = self.client.delete(self.desk_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_partial_update_desk(self):
        response = self.client.patch(self.desk_url, {'capacity': 10}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_create_desk_invalid_token(self):
        self.desk_data['user_token'] = self.invalid_token
        response = self.client.post('/api/desk/', self.desk_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_desk_expired_token(self):
        self.refresh.set_exp(lifetime=-1)
        self.desk_data['user_token'] = str(self.refresh)
        response = self.client.post('/api/desk/', self.desk_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class AllergensViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.refresh = RefreshToken.for_user(self.user)
        self.invalid_token = 'invalidtoken'
        self.allergen_data = {'allergen_name': "Peanuts", 'user_token': str(self.refresh)}
        self.allergen = Allergens.objects.create(allergen_name="Gluten")
        self.allergen_url = f'/api/allergens/{self.allergen.id}/'

    def test_create_allergen(self):
        response = self.client.post('/api/allergens/', self.allergen_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_allergen(self):
        response = self.client.get(self.allergen_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_allergen(self):
        updated_data = {'allergen_name': "Soy"}
        response = self.client.put(self.allergen_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_allergen(self):
        response = self.client.delete(self.allergen_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_partial_update_allergen(self):
        response = self.client.patch(self.allergen_url, {'allergen_name': "Dairy"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_create_allergen_invalid_token(self):
        self.allergen_data['user_token'] = self.invalid_token
        response = self.client.post('/api/allergens/', self.allergen_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_allergen_expired_token(self):
        self.refresh.set_exp(lifetime=-1)
        self.allergen_data['user_token'] = str(self.refresh)
        response = self.client.post('/api/allergens/', self.allergen_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class IngredientViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.refresh = RefreshToken.for_user(self.user)
        self.invalid_token = 'invalidtoken'
        self.allergen = Allergens.objects.create(allergen_name="Peanuts")
        self.ingredient_data = {'ingredient_name': "Flour", 'quantity': 2, 'allergen': [self.allergen.id], 'user_token': str(self.refresh)}
        self.ingredient = Ingredient.objects.create(ingredient_name="Sugar", quantity=5)
        self.ingredient.allergen.add(self.allergen)
        self.ingredient_url = f'/api/ingredient/{self.ingredient.id}/'

    def test_create_ingredient(self):
        response = self.client.post('/api/ingredient/', self.ingredient_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_ingredient(self):
        response = self.client.get(self.ingredient_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_ingredient(self):
        updated_data = {'ingredient_name': "Salt", 'quantity': 3, 'allergen': [self.allergen.id]}
        response = self.client.put(self.ingredient_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_ingredient(self):
        response = self.client.delete(self.ingredient_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_partial_update_ingredient(self):
        response = self.client.patch(self.ingredient_url, {'quantity': 10}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_create_ingredient_invalid_token(self):
        self.ingredient_data['user_token'] = self.invalid_token
        response = self.client.post('/api/ingredient/', self.ingredient_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_ingredient_expired_token(self):
        self.refresh.set_exp(lifetime=-1)
        self.ingredient_data['user_token'] = str(self.refresh)
        response = self.client.post('/api/ingredient/', self.ingredient_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class DishViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.refresh = RefreshToken.for_user(self.user)
        self.invalid_token = 'invalidtoken'
        self.ingredient = Ingredient.objects.create(ingredient_name="Flour", quantity=2)
        self.dish_data = {'dish_name': "Pizza", 'description': "Delicious pizza", 'time_elaboration': "00:30:00", 'price': 10, 'ingredient': [self.ingredient.id], 'link_ar': "http://example.com", 'user_token': str(self.refresh)}
        self.dish = Dish.objects.create(dish_name="Burger", description="Tasty burger", time_elaboration="00:15:00", price=8, link_ar="http://example.com")
        self.dish.ingredient.add(self.ingredient)
        self.dish_url = f'/api/dish/{self.dish.id}/'

    def test_create_dish(self):
        response = self.client.post('/api/dish/', self.dish_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_dish(self):
        response = self.client.get(self.dish_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_dish(self):
        updated_data = {'dish_name': "Pasta", 'description': "Delicious pasta", 'time_elaboration': "00:20:00", 'price': 12, 'ingredient': [self.ingredient.id], 'link_ar': "http://example.com"}
        response = self.client.put(self.dish_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_dish(self):
        response = self.client.delete(self.dish_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_partial_update_dish(self):
        response = self.client.patch(self.dish_url, {'price': 15}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_create_dish_invalid_token(self):
        self.dish_data['user_token'] = self.invalid_token
        response = self.client.post('/api/dish/', self.dish_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_dish_expired_token(self):
        self.refresh.set_exp(lifetime=-1)
        self.dish_data['user_token'] = str(self.refresh)
        response = self.client.post('/api/dish/', self.dish_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class OrderViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.refresh = RefreshToken.for_user(self.user)
        self.invalid_token = 'invalidtoken'
        self.desk = Desk.objects.create(desk_number=1, capacity=4)
        self.dish = Dish.objects.create(dish_name="Pizza", description="Delicious pizza", time_elaboration="00:30:00", price=10, link_ar="http://example.com")
        self.order_data = {'desk': self.desk.id, 'date': "2023-01-01", 'time': "12:00:00", 'total_price': 10, 'status': "Pending", 'dish': [self.dish.id], 'user_token': str(self.refresh)}
        self.order = Order.objects.create(desk=self.desk, date="2023-01-02", time="13:00:00", total_price=20, status="Completed")
        self.order.dish.add(self.dish)
        self.order_url = f'/api/order/{self.order.id}/'

    def test_create_order(self):
        response = self.client.post('/api/order/', self.order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_order(self):
        response = self.client.get(self.order_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_order(self):
        updated_data = {'desk': self.desk.id, 'date': "2023-01-03", 'time': "14:00:00", 'total_price': 30, 'status': "Pending", 'dish': [self.dish.id]}
        response = self.client.put(self.order_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_order(self):
        response = self.client.delete(self.order_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_partial_update_order(self):
        response = self.client.patch(self.order_url, {'status': "Cancelled"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_create_order_invalid_token(self):
        self.order_data['user_token'] = self.invalid_token
        response = self.client.post('/api/order/', self.order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_order_expired_token(self):
        self.refresh.set_exp(lifetime=-1)
        self.order_data['user_token'] = str(self.refresh)
        response = self.client.post('/api/order/', self.order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
