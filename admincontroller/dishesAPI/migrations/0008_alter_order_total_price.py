# Generated by Django 5.1.6 on 2025-03-31 00:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dishesAPI', '0007_remove_dish_embebedar_alter_dish_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='total_price',
            field=models.FloatField(),
        ),
    ]
