import os
import sys
import django
import psycopg2


def main():
    # Ensure project root is on PYTHONPATH (same as manage.py)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    sys.path.insert(0, parent_dir)

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_admin.settings')
    django.setup()

    from django.core.management import call_command
    from django.contrib.auth import get_user_model

    # Migrate and collect static files
    call_command('migrate', interactive=False)
    call_command('collectstatic', interactive=False, verbosity=0, clear=True)

    # Ensure unmanaged tables exist (submissions, forms, submission_questions, form_questions, form_answers)
    def get_db_env(name: str) -> str:
        return os.getenv(name) or os.getenv({
            'POSTGRES_HOST': 'DB_HOST',
            'POSTGRES_PORT': 'DB_PORT',
            'POSTGRES_DB': 'DB_NAME',
            'POSTGRES_USER': 'DB_USER',
            'POSTGRES_PASSWORD': 'DB_PASSWORD',
        }[name])

    try:
        host = get_db_env('POSTGRES_HOST')
        port = int(get_db_env('POSTGRES_PORT'))
        dbname = get_db_env('POSTGRES_DB')
        user = get_db_env('POSTGRES_USER')
        password = get_db_env('POSTGRES_PASSWORD')

        conn = psycopg2.connect(host=host, port=port, dbname=dbname, user=user, password=password)
        cur = conn.cursor()

        # Core content tables used by API/admin
        cur.execute("""
        CREATE TABLE IF NOT EXISTS faqs (
            id SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            "order" INTEGER NOT NULL DEFAULT 0,
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            image VARCHAR(255),
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)

        cur.execute("""
        CREATE TABLE IF NOT EXISTS news (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            image VARCHAR(255),
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)

        cur.execute("""
        CREATE TABLE IF NOT EXISTS partners (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            title VARCHAR(200),
            logo VARCHAR(255),
            description TEXT,
            website VARCHAR(255),
            is_active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)

        # Recreate forms-related tables with Django-compatible FK columns
        cur.execute("""
        DROP TABLE IF EXISTS form_answers CASCADE;
        DROP TABLE IF EXISTS form_questions CASCADE;
        DROP TABLE IF EXISTS submission_questions CASCADE;
        DROP TABLE IF EXISTS forms CASCADE;
        DROP TABLE IF EXISTS submissions CASCADE;
        """)

        cur.execute("""
        CREATE TABLE submissions (
            id SERIAL PRIMARY KEY,
            title VARCHAR(300) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)

        cur.execute("""
        CREATE TABLE forms (
            id SERIAL PRIMARY KEY,
            submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
            name VARCHAR(300) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)

        cur.execute("""
        CREATE TABLE submission_questions (
            id SERIAL PRIMARY KEY,
            submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
            question_text TEXT NOT NULL,
            question_order INTEGER NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)

        cur.execute("""
        CREATE TABLE form_questions (
            id SERIAL PRIMARY KEY,
            form_id INTEGER NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
            submission_question_id INTEGER NOT NULL REFERENCES submission_questions(id) ON DELETE CASCADE,
            question_text TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)

        cur.execute("""
        CREATE TABLE form_answers (
            id SERIAL PRIMARY KEY,
            form_question_id INTEGER NOT NULL REFERENCES form_questions(id) ON DELETE CASCADE,
            answer_text TEXT,
            sha256_hash VARCHAR(64) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """)

        conn.commit()
        cur.close()
        conn.close()
        print("✅ Tables ensured: faqs, news, partners, submissions, forms, submission_questions, form_questions, form_answers")
    except Exception as e:
        print(f"⚠️ Could not ensure unmanaged tables: {e}")

    # Create superuser if env vars provided
    username = os.getenv('DJANGO_SUPERUSER_USERNAME')
    email = os.getenv('DJANGO_SUPERUSER_EMAIL')
    password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

    if username and email and password:
        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created:
            user.set_password(password)
            user.save()
            print(f"✅ Superuser created: {username}")
        else:
            # Ensure flags and password are up to date
            updated = False
            if not user.is_staff:
                user.is_staff = True
                updated = True
            if not user.is_superuser:
                user.is_superuser = True
                updated = True
            if updated:
                user.save()
            user.set_password(password)
            user.save()
            print(f"✅ Superuser ensured/updated: {username}")
    else:
        print("ℹ️ Superuser env vars not fully set; skipping auto-creation.")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Скрипт для настройки Django админки
"""

import os
import sys
import django

# Настраиваем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from django.contrib.auth.models import User
from django.core.management import execute_from_command_line

def setup_django_admin():
    """Настройка Django админки"""
    print("🚀 Настройка Django админки...")
    
    try:
        # Создаем миграции для auth приложений
        print("1️⃣ Создаем миграции...")
        execute_from_command_line(['manage.py', 'makemigrations'])
        
        # Применяем миграции
        print("2️⃣ Применяем миграции...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        # Создаем суперпользователя
        print("3️⃣ Создаем суперпользователя...")
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123'
            )
            print("   ✅ Суперпользователь создан: admin / admin123")
        else:
            print("   ⚠️ Суперпользователь уже существует")
        
        print("\n✅ Django админка настроена!")
        print("🌐 Запустите сервер: python manage.py runserver")
        print("🔑 Войдите в админку: http://localhost:8000/admin/")
        print("   Логин: admin")
        print("   Пароль: admin123")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("🔧 НАСТРОЙКА DJANGO АДМИНКИ")
    print("=" * 60)
    
    success = setup_django_admin()
    
    if success:
        print("\n🎉 Настройка завершена успешно!")
    else:
        print("\n💥 Настройка завершилась с ошибками")
        sys.exit(1)
