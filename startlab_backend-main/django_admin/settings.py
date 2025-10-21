"""
Django settings for admin panel
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise ValueError('DJANGO_SECRET_KEY must be set in .env')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG_ENV = os.getenv('DEBUG')
if DEBUG_ENV is None:
    raise ValueError('DEBUG must be set in .env (true/false)')
DEBUG = DEBUG_ENV.lower() == 'true'

ALLOWED_HOSTS_ENV = os.getenv('DJANGO_ALLOWED_HOSTS')
if not ALLOWED_HOSTS_ENV:
    raise ValueError('DJANGO_ALLOWED_HOSTS must be set in .env (comma-separated)')
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_ENV.split(',') if host.strip()]

# Trust HTTPS from reverse proxy
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Optional: CSRF trusted origins from env (comma-separated list of full origins)
CSRF_TRUSTED_ORIGINS_ENV = os.getenv('CSRF_TRUSTED_ORIGINS')
if CSRF_TRUSTED_ORIGINS_ENV:
    CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in CSRF_TRUSTED_ORIGINS_ENV.split(',') if origin.strip()]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',  # Нужен для admin, но таблицы не создаем
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_summernote',
    'admin_panel',  # Перемещаем в конец
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Добавьте эту строку
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Нужен для admin
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'django_admin.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',  # Нужен для admin
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_admin.wsgi.application'

# Database
PG_DB = os.getenv('POSTGRES_DB') or os.getenv('DB_NAME')
PG_USER = os.getenv('POSTGRES_USER') or os.getenv('DB_USER')
PG_PASSWORD = os.getenv('POSTGRES_PASSWORD') or os.getenv('DB_PASSWORD')
PG_HOST = os.getenv('POSTGRES_HOST') or os.getenv('DB_HOST')
PG_PORT = os.getenv('POSTGRES_PORT') or os.getenv('DB_PORT')

missing_db_env = [
    name for name, value in [
        ('POSTGRES_DB/DB_NAME', PG_DB),
        ('POSTGRES_USER/DB_USER', PG_USER),
        ('POSTGRES_PASSWORD/DB_PASSWORD', PG_PASSWORD),
        ('POSTGRES_HOST/DB_HOST', PG_HOST),
        ('POSTGRES_PORT/DB_PORT', PG_PORT),
    ] if not value
]
if missing_db_env:
    raise ValueError(f"Database env vars missing: {', '.join(missing_db_env)}")

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': PG_DB,
        'USER': PG_USER,
        'PASSWORD': PG_PASSWORD,
        'HOST': PG_HOST,
        'PORT': PG_PORT,
    }
}

# Password validation removed (no authentication needed)

# Internationalization
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Minsk'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = os.getenv('DJANGO_STATIC_URL') or '/static/'
STATIC_ROOT = os.getenv('DJANGO_STATIC_ROOT') or os.path.join(BASE_DIR.parent, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'  # Добавьте эту строку

# Media files (user uploads)
MEDIA_URL = os.getenv('DJANGO_MEDIA_URL') or '/media/'
MEDIA_ROOT = os.getenv('DJANGO_MEDIA_ROOT') or os.path.join(BASE_DIR.parent, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Authentication removed (no user management needed)

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "https://bsuir.stacklevel.group",
    "http://bsuir.stacklevel.group",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Admin site customization
ADMIN_SITE_HEADER = "СТАРТЛАБ Админка"
ADMIN_SITE_TITLE = "Панель администратора"
ADMIN_INDEX_TITLE = "Добро пожаловать в админку СТАРТЛАБ"

SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG