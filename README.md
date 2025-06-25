# Telegram WebApp FastAPI Project

Базовый FastAPI проект с поддержкой PostgreSQL и интеграцией с Telegram WebApp.

## Особенности

- ✅ Модель `User` с полями telegram_id, username, is_bot, language_code, дата регистрации
- ✅ Авторизация через Telegram WebApp (проверка подписи)
- ✅ POST `/auth/register` — регистрация пользователя по данным Telegram
- ✅ GET `/auth/me` — получить текущего пользователя по telegram_id
- ✅ Подключение к БД через SQLAlchemy (PostgreSQL)
- ✅ Модульная структура: main.py, models.py, routers/, utils/
- ✅ Конфигурация через .env файл
- ✅ Готовность к запуску в dev и prod (gunicorn)
- ✅ Docker поддержка
- ✅ PEP8 форматирование

## Структура проекта

```
fastapi-telegram-project/
├── main.py                 # Точка входа приложения
├── database.py             # Конфигурация базы данных
├── models.py               # SQLAlchemy модели
├── schemas.py              # Pydantic схемы
├── requirements.txt        # Зависимости Python
├── Dockerfile             # Docker конфигурация
├── docker-compose.yml     # Docker Compose для разработки
├── alembic.ini            # Конфигурация Alembic
├── .env                   # Переменные окружения
├── routers/               # API роутеры
│   ├── __init__.py
│   └── auth.py            # Роутер аутентификации
├── utils/                 # Утилиты
│   ├── __init__.py
│   └── telegram_auth.py   # Утилиты для Telegram аутентификации
└── alembic/               # Миграции базы данных
    ├── versions/
    ├── env.py
    └── script.py.mako
```

## Быстрый старт

### 1. Клонирование и установка зависимостей

```bash
cd fastapi-telegram-project
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Настройка переменных окружения

Отредактируйте файл `.env`:

```env
# Database configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=telegram_app
DB_PORT=5432

# Telegram Bot configuration
BOT_TOKEN=your_bot_token_here

# Application configuration
ENVIRONMENT=development
PORT=8000
```

### 3. Запуск PostgreSQL

Убедитесь, что PostgreSQL запущен и создайте базу данных:

```sql
CREATE DATABASE telegram_app;
```

### 4. Запуск миграций

```bash
alembic upgrade head
```

### 5. Запуск приложения

#### Для разработки:
```bash
python main.py
# или
uvicorn main:app --reload
```

#### Для продакшена:
```bash
gunicorn --bind 0.0.0.0:8000 --workers 4 --worker-class uvicorn.workers.UvicornWorker main:app
```

## Docker

### Запуск с Docker Compose

```bash
# Установите BOT_TOKEN в окружении
export BOT_TOKEN=your_bot_token_here

# Запуск
docker-compose up --build
```

### Сборка и запуск Docker контейнера

```bash
docker build -t telegram-app .
docker run -p 8000:8000 --env-file .env telegram-app
```

## API Документация

После запуска приложения документация будет доступна по адресу:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Основные эндпоинты

#### POST /auth/register
Регистрация пользователя через Telegram WebApp данные.

**Запрос:**
```json
{
  "user_data": "query_id=...&user=%7B%22id%22%3A123...&auth_date=1234567890",
  "hash": "abc123..."
}
```

**Ответ:**
```json
{
  "user": {
    "id": 1,
    "telegram_id": 123456789,
    "username": "user123",
    "first_name": "John",
    "last_name": "Doe",
    "is_bot": false,
    "language_code": "en",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": null
  },
  "message": "User registered successfully"
}
```

#### GET /auth/me?telegram_id=123456789
Получение информации о текущем пользователе.

**Ответ:**
```json
{
  "id": 1,
  "telegram_id": 123456789,
  "username": "user123",
  "first_name": "John",
  "last_name": "Doe",
  "is_bot": false,
  "language_code": "en",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": null
}
```

## Работа с миграциями

```bash
# Создание новой миграции
alembic revision --autogenerate -m "Description of changes"

# Применение миграций
alembic upgrade head

# Откат к предыдущей миграции
alembic downgrade -1

# Просмотр истории миграций
alembic history
```

## Безопасность

Проект включает проверку подписи Telegram WebApp для обеспечения безопасности. Убедитесь, что:

1. `BOT_TOKEN` установлен корректно
2. Данные от клиента передаются через HTTPS
3. В продакшене настройте правильные CORS origins

## Разработка

### Добавление новых эндпоинтов

1. Создайте новый роутер в `routers/`
2. Добавьте его в `main.py`
3. При необходимости создайте новые схемы в `schemas.py`

### Добавление новых моделей

1. Создайте модель в `models.py`
2. Создайте миграцию: `alembic revision --autogenerate -m "Add new model"`
3. Примените миграцию: `alembic upgrade head`

## Лицензия

MIT License
