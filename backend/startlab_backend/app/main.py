"""
Основное FastAPI приложение СТАРТЛАБ
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Получаем настройки из .env
PROJECT_NAME = os.getenv("PROJECT_NAME")
if not PROJECT_NAME:
    raise ValueError("PROJECT_NAME не установлен в .env файле")

PROJECT_DESCRIPTION = os.getenv("PROJECT_DESCRIPTION")
if not PROJECT_DESCRIPTION:
    raise ValueError("PROJECT_DESCRIPTION не установлен в .env файле")

PROJECT_VERSION = os.getenv("PROJECT_VERSION")
if not PROJECT_VERSION:
    raise ValueError("PROJECT_VERSION не установлен в .env файле")

# Настройки CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")
if not ALLOWED_ORIGINS:
    raise ValueError("ALLOWED_ORIGINS не установлен в .env файле (comma-separated list)")
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS.split(",")]

# Настройки сервера
HOST = os.getenv("HOST")
if not HOST:
    raise ValueError("HOST не установлен в .env файле")

PORT = os.getenv("PORT")
if not PORT:
    raise ValueError("PORT не установлен в .env файле")
PORT = int(PORT)

DEBUG = os.getenv("DEBUG")
if not DEBUG:
    raise ValueError("DEBUG не установлен в .env файле")
DEBUG = DEBUG.lower() == "true"

# Импортируем роутеры
from .api.faqs import router as faqs_router
from .api.news import router as news_router
from .api.partners import router as partners_router
from .api.application import router as application_router
from .api.documents import router as documents_router

# Создаем экземпляр FastAPI
app = FastAPI(
    title=PROJECT_NAME,
    description=PROJECT_DESCRIPTION,
    version=PROJECT_VERSION,
    debug=DEBUG
)

# Добавляем middleware для правильной кодировки
@app.middleware("http")
async def add_charset_middleware(request, call_next):
    response = await call_next(request)
    
    # Не изменяем Content-Type для системных endpoints FastAPI
    if not request.url.path.startswith(('/docs', '/redoc', '/openapi.json')):
        # Проверяем, что это действительно JSON ответ
        if "application/json" in response.headers.get("content-type", ""):
            response.headers["Content-Type"] = "application/json; charset=utf-8"
    
    return response

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Подключаем роутеры (теги заданы внутри самих роутеров, чтобы избежать дублирования)
app.include_router(faqs_router)
app.include_router(news_router)
app.include_router(partners_router)
app.include_router(application_router, prefix="/api")
app.include_router(documents_router)

# Подключаем обслуживание медиа файлов из корневой папки проекта
media_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'media'))
print(f"🔍 Media path: {media_path}")
print(f"🔍 Media path exists: {os.path.exists(media_path)}")
if os.path.exists(media_path):
    app.mount("/media", StaticFiles(directory=media_path), name="media")
    print("✅ Media files mounted successfully")
else:
    print("❌ Media path does not exist")

@app.get("/")
async def root():
    """Корневой endpoint"""
    return {
        "message": f"Добро пожаловать в {PROJECT_NAME}!",
        "version": PROJECT_VERSION,
        "description": PROJECT_DESCRIPTION,
        "docs": "/docs",
        "redoc": "/redoc",
        "config": {
            "host": HOST,
            "port": PORT,
            "debug": DEBUG,
            "cors_origins": ALLOWED_ORIGINS
        }
    }

@app.get("/test-media")
async def test_media():
    """Тестовый endpoint для проверки медиа файлов"""
    import os
    media_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'media'))
    partners_path = os.path.join(media_path, 'partners')
    
    return {
        "media_path": media_path,
        "media_exists": os.path.exists(media_path),
        "partners_path": partners_path,
        "partners_exists": os.path.exists(partners_path),
        "files": os.listdir(partners_path) if os.path.exists(partners_path) else []
    }

# OPTIONS запросы обрабатываются CORS middleware автоматически

@app.get("/health")
async def health_check():
    """Проверка здоровья API"""
    ENVIRONMENT = os.getenv("ENVIRONMENT")
    if not ENVIRONMENT:
        raise ValueError("ENVIRONMENT не установлен в .env файле")
    
    return {
        "status": "healthy", 
        "message": "API работает нормально",
        "config": {
            "project_name": PROJECT_NAME,
            "version": PROJECT_VERSION,
            "environment": ENVIRONMENT
        }
    }

@app.get("/config")
async def get_config():
    """Показывает текущую конфигурацию (только для разработки)"""
    if not DEBUG:
        return {"message": "Конфигурация скрыта в продакшене"}
    
    return {
        "project": {
            "name": PROJECT_NAME,
            "description": PROJECT_DESCRIPTION,
            "version": PROJECT_VERSION
        },
        "server": {
            "host": HOST,
            "port": PORT,
            "debug": DEBUG
        },
        "cors": {
            "allowed_origins": ALLOWED_ORIGINS
        },
        "environment": os.getenv("ENVIRONMENT")
    }
