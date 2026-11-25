# Next.js TypeScript Web App

**Стек технологий:** TypeScript, Next.js (App Router), React, Tailwind CSS, PostgreSQL (в Docker).

---

## 📋 Описание проекта

Прототип веб-приложения (WebApp) с минималистичным деловым дизайном.

**Реализованный функционал:**

1. **Аутентификация пользователей** (NextAuth.js) с защитой маршрутов через Middleware.
2. **Drop-down меню** (профиль пользователя, выход из системы).
3. **Справочник клиентов**:
   - Таблица со списком клиентов.
   - Форма создания/редактирования, карточка клиента (id, name, code).
   - Поддержка поиска и фильтрации по `name` и `code`.
4. **Реестр сделок**:
   - Таблица сделок с привязкой к клиенту (id, date, number, amount, client_id, description).
   - Форма ввода/редактирования/удаления.
   - Жесткий серверный селектор по диапазону дат.
   - Поиск и фильтрация по `date`, `number`, `client_id`.
5. **Валидация форм** (Zod + React Hook Form) для всех полей, проверка обязательности и типов данных.

---

## 📂 Структура проекта (Feature-Sliced Design)

Проект организован по принципам Feature-Sliced Design (FSD), что обеспечивает масштабируемость:

```text
.
├── src/
│   ├── auth.ts              # Инициализация NextAuth
│   ├── auth.config.ts       # Конфигурация NextAuth (провайдеры, коллбэки)
│   ├── middleware.ts        # Защита маршрутов (редирект неавторизованных)
│   ├── app/                 # Next.js App Router (страницы и API)
│   │   ├── api/auth/        # API-роуты NextAuth
│   │   ├── clients/         # Страница справочника клиентов
│   │   ├── deals/           # Страница реестра сделок
│   │   └── login/           # Страница входа
│   ├── entities/            # Бизнес-логика и типы (Client, Deal, Login)
│   ├── features/            # UI-фичи (формы, фильтры, таблицы, меню)
│   ├── shared/              # Переиспользуемые компоненты (UI Kit) и общие утилиты
│   │   └── lib/             # Утилиты (подключение к БД, db.types.ts и т.д.)
│   └── widgets/             # Композиция страниц (сборка из фич и сущностей)
├── Dockerfile               # Сборка production-образа Next.js
├── docker-compose.yml       # Оркестрация Next.js + PostgreSQL + Nginx
└── package.json
```

## 🚀 Инструкция по локальному запуску

Для запуска проекта вам понадобятся Node.js (v20+) и Docker.

## Шаг 1: Клонирование репозитория

```bash
git clone <URL*ВАШЕГО*РЕПОЗИТОРИЯ>
cd <НАЗВАНИЕ_ПАПКИ>
```

## Шаг 2: Установка зависимостей

```bash
npm install
```

## Шаг 3: Настройка переменных окружения

Создайте в корне проекта файл **`.env.local`** и заполните его:

```bash
# Настройки для NextAuth
AUTH_SECRET=любая_случайная_строка_сгенерированная_через_openssl_rand_base64_32
AUTH_URL=http://localhost:3000

# Строка подключения к PostgreSQL
# (Здесь используется локальный порт 5432, база поднимается через Docker Compose)
DATABASE_URL=postgresql://appuser:StrongPassword123@localhost:5432/appdb
```

## Шаг 4: Поднятие базы данных

Предварительно установите [Docker](https://docs.docker.com/get-docker/) на ваш локальный компьютер и убедитесь, что он запущен.

Запустите контейнер с PostgreSQL в фоновом режиме:

```bash
docker compose up -d db
```

## Шаг 5: Инициализация БД (Создание таблиц)

Выполните SQL-скрипт для создания структуры таблиц:

```bash

# Если у вас есть файл schema.sql в папке db:

docker compose exec -T db psql -U appuser -d appdb < db/schema.sql

# Либо создайте таблицы вручную через консоль:

docker compose exec db psql -U appuser -d appdb -c "
CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL);
CREATE TABLE clients (id SERIAL PRIMARY KEY, name TEXT NOT NULL, code TEXT NOT NULL);
CREATE TABLE deals (id SERIAL PRIMARY KEY, date DATE NOT NULL, number TEXT NOT NULL, amount NUMERIC NOT NULL, client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL, description TEXT);
"
```

## Шаг 6: Создание тестового пользователя

Чтобы войти в систему, нужно добавить пользователя в БД.

Сгенерируйте bcrypt-хеш пароля password123:

```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('password123', 10));"
Скопируйте полученный хеш (начинается с $2b$) и вставьте его в базу (замените ВАШ_ХЕШ на скопированную строку):
```

```bash
docker compose exec db psql -U appuser -d appdb -c "INSERT INTO users (email, password*hash) VALUES ('test@example.com', 'ВАШ*ХЕШ');"
```

## Шаг 7: Запуск dev-сервера

```bash
npm run dev
```

**Откройте в браузере** http://localhost:3000.

**Для входа используйте:**

```
Email: test@example.com

Пароль: password123
```

**После успешного входа вы будете перенаправлены на страницу клиентов (/clients). Если вместо этого происходит редирект обратно на /login, проверьте:**

_Что пользователь действительно создан: docker compose exec db psql -U appuser -d appdb -c "SELECT id, email FROM users;"._

_Что AUTH_SECRET и AUTH_URL заданы в .env.local и совпадают с портом, на котором запущен dev-сервер._

_Логи в терминале, где выполнен npm run dev — там будут сообщения об ошибках аутентификации._
