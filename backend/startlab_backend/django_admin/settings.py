import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    raise ValueError('DJANGO_SECRET_KEY must be set in .env')

DEBUG_ENV = os.getenv('DEBUG')
if DEBUG_ENV is None:
    raise ValueError('DEBUG must be set in .env (true/false)')
DEBUG = DEBUG_ENV.lower() == 'true'

ALLOWED_HOSTS_ENV = os.getenv('DJANGO_ALLOWED_HOSTS')
if not ALLOWED_HOSTS_ENV:
    raise ValueError('DJANGO_ALLOWED_HOSTS must be set in .env (comma-separated)')
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_ENV.split(',') if host.strip()]

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CSRF_TRUSTED_ORIGINS_ENV = os.getenv('CSRF_TRUSTED_ORIGINS')
if CSRF_TRUSTED_ORIGINS_ENV:
    CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in CSRF_TRUSTED_ORIGINS_ENV.split(',') if origin.strip()]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_summernote',
    'admin_panel',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
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
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_admin.wsgi.application'

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

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Minsk'
USE_I18N = True
USE_TZ = True

STATIC_URL = os.getenv('DJANGO_STATIC_URL') or 'static/'
STATIC_ROOT = os.getenv('DJANGO_STATIC_ROOT') or os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

MEDIA_URL = os.getenv('DJANGO_MEDIA_URL') or '/media/'
MEDIA_ROOT = os.getenv('DJANGO_MEDIA_ROOT') or os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

ADMIN_SITE_HEADER = "СТАРТЛАБ Админка"
ADMIN_SITE_TITLE = "Панель администратора"
ADMIN_INDEX_TITLE = "Добро пожаловать в админку СТАРТЛАБ"
