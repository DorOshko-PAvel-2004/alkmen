# СТАРТЛАБ Backend

Backend API для конкурса инновационных проектов СТАРТЛАБ, построенный на FastAPI.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
pip install -r requirements.txt
```

### 2. Настройка базы данных
```bash
# Настройка PostgreSQL
python scripts/setup_postgres.py

# Создание таблиц
python -m app.database.create_tables

# Заполнение тестовыми данными (опционально)
python -m app.database.seed_data
```

### 3. Запуск сервера
```bash
python main.py
```

Приложение будет доступно по адресу: http://localhost:8000

## 📚 API Endpoints

### Аутентификация
- `POST /auth/token` - Получение токена
- `POST /auth/register` - Регистрация пользователя
- `GET /auth/users/me` - Информация о текущем пользователе

### FAQ
- `GET /faqs/` - Список всех FAQ
- `GET /faqs/{faq_id}` - FAQ по ID

### Контакты
- `GET /contacts/` - Список всех контактов
- `GET /contacts/{contact_id}` - Контакт по ID

### Партнеры
- `GET /partners/` - Список всех партнеров
- `GET /partners/{partner_id}` - Партнер по ID
- `GET /partners/requests/` - Заявки на партнерство
- `GET /partners/requests/{request_id}` - Заявка по ID

### Команды
- `GET /teams/` - Список всех команд
- `GET /teams/{team_id}` - Команда по ID

### Проекты
- `GET /projects/stages/` - Этапы проекта
- `GET /projects/stages/{stage_id}` - Этап по ID
- `GET /projects/team-projects/` - Проекты команд
- `GET /projects/team-projects/{project_id}` - Проект по ID

## 🛠️ Технологии

- **FastAPI** - Веб-фреймворк
- **PostgreSQL** - База данных
- **psycopg2** - Драйвер PostgreSQL
- **Pydantic** - Валидация данных
- **uvicorn** - ASGI сервер

## 📁 Структура проекта

```
bsuir_startlab/
├── app/                          # Основное приложение
│   ├── config/                  # Конфигурация
│   ├── models/                  # Enum классы для типизации
│   ├── schemas/                 # Pydantic схемы
│   ├── crud/                    # CRUD операции
│   ├── api/                     # API endpoints
│   ├── database/                # База данных
│   └── utils/                   # Утилиты
├── scripts/                      # Скрипты для настройки
├── main.py                      # Точка входа
├── requirements.txt              # Зависимости Python
├── env_example.txt              # Пример конфигурации
├── README.md                     # Документация
└── frontend/                     # Фронтенд (React)
```

## 🔧 Разработка

### Добавление нового API endpoint

1. Создайте новый файл в папке `app/api/`
2. Определите роутер с нужными endpoints
3. Импортируйте роутер в `app/main.py`
4. Добавьте `app.include_router()` для нового роутера

### Добавление новой модели

1. Добавьте Enum класс в `app/models/models.py` если нужен
2. Добавьте схему в `app/schemas/schemas.py`
3. Создайте CRUD функции в `app/crud/crud.py`
4. Добавьте API endpoints в соответствующий файл в `app/api/`
5. Добавьте SQL для создания таблицы в `app/database/create_tables.py`

## 📊 База данных

Проект использует PostgreSQL с прямыми SQL запросами через psycopg2. Основные таблицы:

- `users` - Пользователи системы
- `faqs` - Часто задаваемые вопросы
- `project_stages` - Этапы проекта
- `contacts` - Контактная информация
- `partners` - Партнеры
- `partnership_requests` - Заявки на партнерство
- `teams` - Команды участников
- `team_projects` - Проекты команд

## 🚀 Деплой

### Локальный запуск
```bash
python main.py
```

### Продакшен
Для продакшена рекомендуется:
1. Использовать переменные окружения для конфигурации
2. Настроить reverse proxy (nginx)
3. Использовать systemd для управления процессом
4. Настроить логирование

## 📝 Лицензия

MIT License
test

docker-compose exec admin bash -c "cd /app/django_admin && python seed_partners_command.py - запуск скрипта для заполнения таблиц партнёров в докере