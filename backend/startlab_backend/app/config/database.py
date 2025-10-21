#!/usr/bin/env python3
"""
Конфигурация базы данных для СТАРТЛАБ Backend
Использует psycopg2 для прямого подключения к PostgreSQL
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Получаем настройки базы данных из переменных окружения
# Поддерживаем два варианта именования: POSTGRES_* (предпочтительно) и DB_* (обратная совместимость)

PG_HOST = os.getenv("POSTGRES_HOST")
PG_PORT = os.getenv("POSTGRES_PORT")
PG_DB = os.getenv("POSTGRES_DB")
PG_USER = os.getenv("POSTGRES_USER")
PG_PASSWORD = os.getenv("POSTGRES_PASSWORD")

DB_HOST_FALLBACK = os.getenv("DB_HOST")
DB_PORT_FALLBACK = os.getenv("DB_PORT")
DB_NAME_FALLBACK = os.getenv("DB_NAME")
DB_USER_FALLBACK = os.getenv("DB_USER")
DB_PASSWORD_FALLBACK = os.getenv("DB_PASSWORD")

if all([PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD]):
    DB_HOST = PG_HOST
    DB_PORT = int(PG_PORT)
    DB_NAME = PG_DB
    DB_USER = PG_USER
    DB_PASSWORD = PG_PASSWORD
elif all([DB_HOST_FALLBACK, DB_PORT_FALLBACK, DB_NAME_FALLBACK, DB_USER_FALLBACK, DB_PASSWORD_FALLBACK]):
    DB_HOST = DB_HOST_FALLBACK
    DB_PORT = int(DB_PORT_FALLBACK)
    DB_NAME = DB_NAME_FALLBACK
    DB_USER = DB_USER_FALLBACK
    DB_PASSWORD = DB_PASSWORD_FALLBACK
else:
    missing = []
    for key, val in {
        "POSTGRES_HOST": PG_HOST,
        "POSTGRES_PORT": PG_PORT,
        "POSTGRES_DB": PG_DB,
        "POSTGRES_USER": PG_USER,
        "POSTGRES_PASSWORD": PG_PASSWORD,
    }.items():
        if not val:
            missing.append(key)
    # Если не все POSTGRES_* заданы, проверим DB_* и укажем, что нужен один из наборов
    raise ValueError(
        "Отсутствуют переменные для подключения к БД. Задайте полный набор POSTGRES_* или DB_*: "
        f"POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD. Отсутствуют: {', '.join(missing)}"
    )

# Настройки пула соединений
DB_POOL_SIZE = os.getenv("DB_POOL_SIZE")
if not DB_POOL_SIZE:
    raise ValueError("DB_POOL_SIZE не установлен в .env файле")
DB_POOL_SIZE = int(DB_POOL_SIZE)

DB_MAX_OVERFLOW = os.getenv("DB_MAX_OVERFLOW")
if not DB_MAX_OVERFLOW:
    raise ValueError("DB_MAX_OVERFLOW не установлен в .env файле")
DB_MAX_OVERFLOW = int(DB_MAX_OVERFLOW)

DB_POOL_TIMEOUT = os.getenv("DB_POOL_TIMEOUT")
if not DB_POOL_TIMEOUT:
    raise ValueError("DB_POOL_TIMEOUT не установлен в .env файле")
DB_POOL_TIMEOUT = int(DB_POOL_TIMEOUT)

DB_POOL_RECYCLE = os.getenv("DB_POOL_RECYCLE")
if not DB_POOL_RECYCLE:
    raise ValueError("DB_POOL_RECYCLE не установлен в .env файле")
DB_POOL_RECYCLE = int(DB_POOL_RECYCLE)

def get_connection():
    """Создает подключение к базе данных"""
    try:
        # Используем отдельные переменные вместо DATABASE_URL
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            # Добавляем параметры кодировки
            options='-c client_encoding=utf8',
            client_encoding='utf8'
        )
        return connection
    except Exception as e:
        print(f"❌ Ошибка подключения к базе данных: {e}")
        print(f"Проверьте настройки в .env файле:")
        print(f"  DB_HOST: {DB_HOST}")
        print(f"  DB_PORT: {DB_PORT}")
        print(f"  DB_NAME: {DB_NAME}")
        print(f"  DB_USER: {DB_USER}")
        raise

@contextmanager
def get_db():
    """Контекстный менеджер для работы с базой данных"""
    connection = None
    try:
        connection = get_connection()
        yield connection
    except Exception as e:
        if connection:
            connection.rollback()
        raise
    finally:
        if connection:
            connection.close()

def execute_query(query, params=None, fetch=True):
    """Выполняет SQL запрос с параметрами"""
    try:
        with get_db() as connection:
            with connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, params)
                if fetch:
                    result = cursor.fetchall()
                    print(f"🔍 execute_query: получен результат: {result}")
                    print(f"🔍 execute_query: тип результата: {type(result)}")
                    if result and len(result) > 0:
                        print(f"🔍 execute_query: первая строка: {result[0]}")
                        print(f"🔍 execute_query: тип первой строки: {type(result[0])}")
                    return result
                else:
                    connection.commit()
                    return cursor.rowcount
    except Exception as e:
        print(f"❌ Ошибка в execute_query: {e}")
        import traceback
        print(f"🔍 Traceback: {traceback.format_exc()}")
        if fetch:
            return []
        else:
            return 0

def execute_single_query(query, params=None):
    """Выполняет SQL запрос и возвращает одну запись"""
    with get_db() as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params)
            result = cursor.fetchone()
            # Коммитим только для INSERT/UPDATE/DELETE операций
            query_upper = query.strip().upper()
            if any(query_upper.startswith(cmd) for cmd in ['INSERT', 'UPDATE', 'DELETE']):
                connection.commit()
            return result

def create_tables():
    """Создает все таблицы используя SQL скрипты"""
    print("🔧 Создание таблиц базы данных...")
    print(f"База данных: {DB_NAME}")
    print(f"Хост: {DB_HOST}:{DB_PORT}")
    print(f"Пользователь: {DB_USER}")
    
    # Здесь будут SQL команды для создания таблиц
    # Пока что просто заглушка
    print("✅ Таблицы будут созданы через create_tables.py")
