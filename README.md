# Дипломный проект по профессии «Fullstack-разработчик на Python»

# ☁️ My Cloud - Облачное хранилище

![Django](https://img.shields.io/badge/Django-6.0.2-092E20?logo=django)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?logo=docker)

Полноценное облачное хранилище с возможностью загрузки, скачивания и организации файлов. Проект разработан в рамках дипломной работы по профессии "Fullstack-разработчик на Python".

---

## 📋 Содержание

- [Функциональность](#функциональность)
- [Технологии](#технологии)
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
  - [Клонирование](#1-клонирование-репозитория)
  - [Настройка переменных окружения](#2-настройка-переменных-окружения)
  - [Запуск через Docker](#3-запуск-через-docker-рекомендуется)
  - [Ручной запуск](#4-ручной-запуск-без-docker)
- [Структура проекта](#структура-проекта)
- [API Документация](#api-документация)
- [Администрирование](#администрирование)
- [Развертывание на сервере](#развертывание-на-сервере)
- [Устранение неполадок](#устранение-неполадок)
- [Лицензия](#лицензия)

---

## ✨ Функциональность

### Для всех пользователей

- ✅ **Регистрация и вход** — с валидацией пароля (минимум 6 символов, заглавная буква, цифра, спецсимвол)
- ✅ **Загрузка файлов** — до 100 МБ, с возможностью добавления комментария
- ✅ **Скачивание файлов** — прямой доступ или через публичную ссылку
- ✅ **Управление файлами** — переименование, удаление, просмотр информации
- ✅ **Организация в папки** — создание и навигация по папкам
- ✅ **Публичные ссылки** — генерация ссылок для шеринга без авторизации
- ✅ **Темная/светлая тема** — переключение одним кликом

### Для администраторов

- ✅ **Управление пользователями** — просмотр, назначение/снятие прав админа, удаление
- ✅ **Просмотр файлов** — доступ к файлам любого пользователя
- ✅ **Админка Django** — полный доступ через `/admin/`

---

## 🛠️ Технологии

| Компонент          | Технология            | Версия |
| ------------------ | --------------------- | ------ |
| **Бэкенд**         | Django                | 6.0.2  |
|                    | Django REST Framework | 3.15.2 |
|                    | PostgreSQL            | 16     |
|                    | Gunicorn              | 22.0.0 |
|                    | JWT (SimpleJWT)       | 5.3.1  |
| **Фронтенд**       | React                 | 18.2.0 |
|                    | Redux Toolkit         | 2.2.1  |
|                    | React Router          | 6.21.1 |
|                    | Axios                 | 1.6.7  |
|                    | Webpack               | 5.90.1 |
| **Инфраструктура** | Docker                | 24.0+  |
|                    | Docker Compose        | 2.23+  |
|                    | Nginx                 | 1.24+  |

---

## 📋 Требования

- **Python** 3.12+
- **Node.js** 18+
- **PostgreSQL** 16+ (только при ручной установке)
- **Docker** 24.0+ и **Docker Compose** 2.23+ (рекомендуется)
- **Git** (для клонирования)

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/djedra/My-Cloud.git
cd My-Cloud

## Деплой

![Веб-страница](./motions/web-page.gif)

2. Настройка переменных окружения
Для бэкенда (backend/.env):
cp backend/.env.example backend/.env
# Отредактируйте файл под свои параметры

Минимальная конфигурация:
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=mycloud_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
MAX_UPLOAD_SIZE=104857600
MEDIA_ROOT=media
CORS_ALLOWED_ORIGINS=http://localhost:3000

Для фронтенда (frontend/.env):

cp frontend/.env.example frontend/.env

REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_STORAGE_URL=http://localhost:8000/media

3. Запуск через Docker (рекомендуется)

# Запуск всех контейнеров
docker compose up -d --build

# Применение миграций
docker compose exec backend python manage.py migrate

# Сбор статических файлов
docker compose exec backend python manage.py collectstatic --noinput

# Создание суперпользователя
docker compose exec backend python manage.py createsuperuser

После выполнения приложение будет доступно:

Фронтенд: http://localhost:3000

Админка: http://localhost:8000/admin/

API: http://localhost:8000/api/

4. Ручной запуск (без Docker)
Бэкенд

cd backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# Установка зависимостей
pip install -r requirements.txt

# Применение миграций
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver

Фронтенд

cd frontend

# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Запуск сервера разработки
npm start

📁 Структура проекта

My-Cloud/
├── backend/                    # Django бэкенд
│   ├── mycloud/               # Основные настройки
│   │   ├── settings/
│   │   │   ├── base.py        # Базовые настройки
│   │   │   ├── development.py # Настройки разработки
│   │   │   └── production.py  # Настройки продакшена
│   ├── users/                  # Приложение пользователей
│   ├── storage/                # Приложение файлового хранилища
│   ├── manage.py
│   └── requirements.txt
├── frontend/                   # React фронтенд
│   ├── public/
│   ├── src/
│   │   ├── components/        # React компоненты
│   │   ├── pages/             # Страницы
│   │   ├── store/             # Redux store
│   │   ├── services/          # API сервисы
│   │   └── styles/             # CSS стили
│   ├── package.json
│   └── webpack.config.js
├── docker-compose.yml          # Конфигурация Docker
├── nginx.conf                   # Конфигурация Nginx
└── README.md

📡 API Документация
Аутентификация
Регистрация

POST /api/users/register/
Content-Type: application/json

{
  "username": "john_doe",
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "password2": "SecurePass123!"
}

Вход
POST /api/users/login/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}

Ответ:

{
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "is_admin": false
  },
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Работа с файлами
Получение списка файлов

GET /api/storage/files/
Authorization: Bearer <access_token>

Загрузка файла

POST /api/storage/files/upload/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <файл>
comment: "Описание файла"
folder_id: 1  # опционально

Скачивание файла

GET /api/storage/files/<file_id>/download/
Authorization: Bearer <access_token>

Публичная ссылка

GET /api/storage/share/<share_token>/
# Не требует авторизации

👨‍💼 Администрирование
Доступ к админке Django
Перейдите на http://localhost:8000/admin/

Войдите под суперпользователем

Доступны разделы:

Пользователи — управление учетными записями

Файлы — просмотр всех файлов

Папки — управление структурой папок

Управление через фронтенд (для админов)
Войдите в систему под учетной записью администратора

В меню появится раздел "Админка"

Доступно:

Просмотр всех пользователей

Назначение/снятие прав администратора

Удаление пользователей

🌐 Развертывание на сервере
1. Подготовка сервера (Ubuntu 22.04+)

# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo apt install docker-compose -y

# Выход и повторный вход для применения прав
exit

2. Клонирование и настройка

git clone https://github.com/djedra/My-Cloud.git
cd My-Cloud

# Настройка переменных окружения
cp backend/.env.example backend/.env
nano backend/.env  # Отредактируйте под продакшен
Продакшен-конфигурация .env:
SECRET_KEY=your-very-long-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

DB_NAME=mycloud_prod
DB_USER=mycloud_user
DB_PASSWORD=strong-password-here
DB_HOST=db
DB_PORT=5432

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
MAX_UPLOAD_SIZE=104857600
MEDIA_ROOT=media
CORS_ALLOWED_ORIGINS=https://your-domain.com

3. Запуск
# Запуск контейнеров
docker compose up -d --build

# Применение миграций
docker compose exec backend python manage.py migrate

# Сбор статических файлов
docker compose exec backend python manage.py collectstatic --noinput

# Создание суперпользователя
docker compose exec backend python manage.py createsuperuser

4. Настройка SSL (HTTPS)

# Установка Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получение сертификата
sudo certbot --nginx -d your-domain.com

🔧 Устранение неполадок
1. Ошибка 502 Bad Gateway
Причина: Nginx не может связаться с контейнером фронтенда
Решение:
# Проверьте, что фронтенд слушает правильный порт
docker compose logs frontend

# В nginx.conf должен быть указан порт 3000
# upstream frontend { server frontend:3000; }

2. Ошибка подключения к БД
Причина: Неправильный DB_HOST в настройках
Решение:
# В контейнерах используйте имя сервиса
# DB_HOST=db, а не localhost!

3. Статические файлы не грузятся
Решение:
docker compose exec backend python manage.py collectstatic --noinput

4. Фронтенд отправляет запросы на localhost:8000
Причина: Переменные окружения не встроены в бандл
Решение:
# Пересоберите фронтенд с правильными переменными
docker compose build --no-cache frontend
5. Не получается войти в админку
Причина: Пользователь не имеет прав суперпользователя
Решение:

docker compose exec backend python manage.py shell -c "
from users.models import CustomUser
user = CustomUser.objects.get(username='admin')
user.is_superuser = True
user.is_staff = True
user.save()
"

📝 Полезные команды
Docker
# Просмотр логов
docker compose logs -f

# Остановка всех контейнеров
docker compose down

# Перезапуск
docker compose restart

# Полная пересборка
docker compose down -v --remove-orphans
docker compose up -d --build

Бэкенд
# Применение миграций
docker compose exec backend python manage.py migrate

# Создание миграций
docker compose exec backend python manage.py makemigrations

# Доступ к shell Django
docker compose exec backend python manage.py shell

Фронтенд
# Пересборка фронтенда
docker compose build --no-cache frontend

# Проверка файлов в контейнере
docker compose exec frontend ls -la /usr/share/nginx/html/

📄 Лицензия
Проект разработан в образовательных целях в рамках дипломной работы.

👨‍💻 Автор
Anton

GitHub: @djedra

Email: djedra@ya.ru

🙏 Благодарности
Команде разработчиков Django и React

Сообществу Docker за отличную документацию

Спасибо за использование My Cloud! ☁️✨
```
