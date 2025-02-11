# Generated by Django 5.1.6 on 2025-02-11 22:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Allergens',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('allergen_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Desk',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('desk_number', models.IntegerField()),
                ('capacity', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ingredient_name', models.CharField(max_length=100)),
                ('quantity', models.IntegerField()),
                ('allergen', models.ManyToManyField(to='dishesAPI.allergens')),
            ],
        ),
        migrations.CreateModel(
            name='Dish',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dish_name', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=1000)),
                ('time_elaboration', models.TimeField()),
                ('price', models.IntegerField()),
                ('link_ar', models.CharField(max_length=1000)),
                ('ingredient', models.ManyToManyField(to='dishesAPI.ingredient')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('total_price', models.IntegerField()),
                ('status', models.CharField(max_length=100)),
                ('desk', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dishesAPI.desk')),
                ('dish', models.ManyToManyField(to='dishesAPI.dish')),
            ],
        ),
    ]
