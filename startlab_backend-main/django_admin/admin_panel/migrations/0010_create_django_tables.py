# Generated manually for creating Django standard tables

from django.db import migrations
from django.contrib.contenttypes.management import create_contenttypes
from django.contrib.auth.management import create_permissions


def create_django_tables(apps, schema_editor):
    """Создаем стандартные таблицы Django"""
    # Создаем contenttypes
    create_contenttypes(apps.get_app_config('contenttypes'))
    
    # Создаем permissions
    create_permissions(apps.get_app_config('auth'))


def reverse_create_django_tables(apps, schema_editor):
    """Обратная операция - удаляем таблицы"""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('admin_panel', '0009_alter_team_options'),
    ]

    operations = [
        migrations.RunPython(
            create_django_tables,
            reverse_create_django_tables,
        ),
    ]

