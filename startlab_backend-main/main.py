#!/usr/bin/env python3
"""
Главный файл для запуска СТАРТЛАБ Backend
"""

import os
import uvicorn
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

if __name__ == "__main__":
    # Получаем настройки из .env
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
    
    RELOAD = os.getenv("RELOAD")
    if not RELOAD:
        raise ValueError("RELOAD не установлен в .env файле")
    RELOAD = RELOAD.lower() == "true"
    
    LOG_LEVEL = os.getenv("LOG_LEVEL")
    if not LOG_LEVEL:
        raise ValueError("LOG_LEVEL не установлен в .env файле")
    
    WORKERS = os.getenv("WORKERS")
    if not WORKERS:
        raise ValueError("WORKERS не установлен в .env файле")
    WORKERS = int(WORKERS)
    
    # Получаем название проекта
    PROJECT_NAME = os.getenv("PROJECT_NAME")
    if not PROJECT_NAME:
        raise ValueError("PROJECT_NAME не установлен в .env файле")
    
    print(f"🚀 Запуск {PROJECT_NAME}...")
    print(f"📡 API будет доступен по адресу: http://bsuir.stacklevel.group:{PORT}")
    print(f"📚 Документация API: http://bsuir.stacklevel.group:{PORT}/docs")
    print(f"🔧 Альтернативная документация: http://bsuir.stacklevel.group:{PORT}/redoc")
    print(f"⚙️  Конфигурация: http://bsuir.stacklevel.group:{PORT}/config")
    print("-" * 50)
    print(f"🔧 Настройки:")
    print(f"   Хост: {HOST}")
    print(f"   Порт: {PORT}")
    print(f"   Debug: {DEBUG}")
    print(f"   Reload: {RELOAD}")
    print(f"   Логи: {LOG_LEVEL}")
    print(f"   Воркеры: {WORKERS}")
    print("-" * 50)

    if RELOAD:
        # Для reload используем строку импорта
        uvicorn.run(
            "app.main:app",
            host=HOST,
            port=PORT,
            reload=True,
            log_level=LOG_LEVEL
        )
    else:
        # Для production без reload
        uvicorn.run(
            "app.main:app",
            host=HOST,
            port=PORT,
            reload=False,
            log_level=LOG_LEVEL,
            workers=WORKERS
        )
