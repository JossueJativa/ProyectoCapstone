from rest_framework.test import APITestCase
from ..models import Desk, Allergens, Ingredient, Dish, Order
from ..serializer import DeskSerializer, AllergensSerializer, IngredientSerializer, DishSerializer, OrderSerializer

class SerializerTestCase(APITestCase):

    def setUp(self):
        self.desk_data = {'desk_number': 1, 'capacity': 4}
        self.allergens_data = {'allergen_name': 'Peanuts'}
        self.ingredient_data = {'ingredient_name': 'Tomato', 'quantity': 2}
        self.dish_data = {
            'dish_name': 'Pasta',
            'description': 'Delicious pasta with tomato sauce',
            'time_elaboration': '00:30:00',
            'price': 10,
            'link_ar': 'http://example.com/ar'
        }
        self.order_data = {
            'date': '2023-10-10',
            'time': '12:00:00',
            'total_price': 20,
            'status': 'Pending'
        }

        # Create instances to use their IDs in the test data
        self.desk = Desk.objects.create(**self.desk_data)
        self.allergen = Allergens.objects.create(**self.allergens_data)
        self.ingredient = Ingredient.objects.create(**self.ingredient_data)
        self.ingredient.allergen.set([self.allergen])
        self.dish = Dish.objects.create(**self.dish_data)
        self.dish.ingredient.set([self.ingredient])
        self.order = Order.objects.create(desk=self.desk, **self.order_data)
        self.order.dish.set([self.dish])

        # Update test data with IDs
        self.ingredient_data['allergen'] = [self.allergen.id]
        self.dish_data['ingredient'] = [self.ingredient.id]
        self.order_data['desk'] = self.desk.id
        self.order_data['dish'] = [self.dish.id]

    def test_desk_serializer(self):
        serializer = DeskSerializer(data=self.desk_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, self.desk_data)

    def test_allergens_serializer(self):
        serializer = AllergensSerializer(data=self.allergens_data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data, self.allergens_data)

    def test_ingredient_serializer(self):
        serializer = IngredientSerializer(data=self.ingredient_data)
        self.assertTrue(serializer.is_valid())
        validated_data = serializer.validated_data
        validated_data['allergen'] = [allergen.id for allergen in validated_data['allergen']]
        self.assertEqual(validated_data, self.ingredient_data)

    def test_dish_serializer(self):
        serializer = DishSerializer(data=self.dish_data)
        self.assertTrue(serializer.is_valid())
        validated_data = serializer.validated_data
        validated_data['ingredient'] = [ingredient.id for ingredient in validated_data['ingredient']]
        validated_data['time_elaboration'] = validated_data['time_elaboration'].strftime('%H:%M:%S')
        self.assertEqual(validated_data, self.dish_data)

    def test_order_serializer(self):
        serializer = OrderSerializer(data=self.order_data)
        self.assertTrue(serializer.is_valid())
        validated_data = serializer.validated_data
        validated_data['dish'] = [dish.id for dish in validated_data['dish']]
        validated_data['desk'] = validated_data['desk'].id
        validated_data['date'] = validated_data['date'].strftime('%Y-%m-%d')
        validated_data['time'] = validated_data['time'].strftime('%H:%M:%S')
        self.assertEqual(validated_data, self.order_data)
