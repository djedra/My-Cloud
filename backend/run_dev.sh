#!/bin/bash

# Активация виртуального окружения
source venv/bin/activate

# Загрузка переменных окружения
export DJANGO_ENV=development

# Применение миграций
python manage.py migrate

# Создание суперпользователя (если еще не существует)
python manage.py createsuperuser --noinput --username admin --email admin@mycloud.local || true

# Запуск сервера разработки
python manage.py runserver 0.0.0.0:8000