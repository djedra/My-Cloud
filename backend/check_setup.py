#!/usr/bin/env python
"""Проверка корректности настройки окружения"""

import sys
import django
from django.conf import settings


def check_python_version():
    """Проверка версии Python"""
    version = sys.version_info
    print(f"✓ Python version: {version.major}.{version.minor}.{version.micro}")

    if version.major < 3 or (version.major == 3 and version.minor < 10):
        print("✗ Требуется Python 3.10 или выше!")
        return False
    return True


def check_django_version():
    """Проверка версии Django"""
    print(f"✓ Django version: {django.get_version()}")
    return True


def check_database_connection():
    """Проверка подключения к базе данных"""
    try:
        from django.db import connection
        connection.ensure_connection()
        print(f"✓ Database connection: OK")
        print(f"  Database: {settings.DATABASES['default']['NAME']}")
        print(f"  Host: {settings.DATABASES['default']['HOST']}")
        return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False


def check_media_directory():
    """Проверка директории для медиа файлов"""
    import os
    media_path = settings.MEDIA_ROOT

    if not os.path.exists(media_path):
        os.makedirs(media_path)
        print(f"✓ Created media directory: {media_path}")
    else:
        print(f"✓ Media directory exists: {media_path}")

    # Проверка прав на запись
    if os.access(media_path, os.W_OK):
        print(f"✓ Media directory is writable")
        return True
    else:
        print(f"✗ Media directory is not writable")
        return False


def check_installed_apps():
    """Проверка установленных приложений"""
    required_apps = ['users', 'storage', 'rest_framework', 'corsheaders']

    for app in required_apps:
        if app in settings.INSTALLED_APPS or any(app in installed_app for installed_app in settings.INSTALLED_APPS):
            print(f"✓ App '{app}' is installed")
        else:
            print(f"✗ App '{app}' is NOT installed")
            return False

    return True


def main():
    print("=" * 60)
    print("Проверка настройки окружения My Cloud")
    print("=" * 60)

    checks = [
        ("Python version", check_python_version),
        ("Django version", check_django_version),
        ("Database connection", check_database_connection),
        ("Media directory", check_media_directory),
        ("Installed apps", check_installed_apps),
    ]

    all_passed = True
    for name, check_func in checks:
        try:
            if not check_func():
                all_passed = False
        except Exception as e:
            print(f"✗ {name} check failed with error: {e}")
            all_passed = False

    print("=" * 60)
    if all_passed:
        print("✓ Все проверки пройдены успешно!")
        print("\nВы можете запустить сервер командой:")
        print("  python manage.py runserver")
    else:
        print("✗ Некоторые проверки не пройдены!")
        print("  Пожалуйста, исправьте ошибки перед запуском сервера.")

    print("=" * 60)
    return 0 if all_passed else 1


if __name__ == "__main__":
    # Настройка Django
    import os

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mycloud.settings.development')
    django.setup()

    sys.exit(main())