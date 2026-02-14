#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path


def main():
    """Run administrative tasks."""
    # Загрузка переменных окружения
    from dotenv import load_dotenv

    # Определяем окружение
    env = os.getenv('DJANGO_ENV', 'development')

    # Загружаем соответствующий .env файл
    env_path = Path(__file__).resolve().parent / f'.env.{env}'
    if env_path.exists():
        load_dotenv(env_path)
    else:
        load_dotenv()  # Загружаем .env по умолчанию

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'mycloud.settings.{env}')

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()