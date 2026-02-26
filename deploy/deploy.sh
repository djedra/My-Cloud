#!/bin/bash

# ========================================
# My Cloud - Автоматический скрипт развёртывания
# ========================================

set -e  # Остановить выполнение при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функции для цветного вывода
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Проверка прав суперпользователя
if [ "$EUID" -ne 0 ]; then 
    print_error "Этот скрипт должен запускаться с правами root (sudo)"
    exit 1
fi

print_info "========================================"
print_info "My Cloud - Автоматическое развёртывание"
print_info "========================================"
echo ""

# ========================================
# Шаг 1: Проверка и установка зависимостей
# ========================================
print_info "Шаг 1: Проверка и установка зависимостей..."

# Обновление системы
apt update > /dev/null 2>&1
apt upgrade -y > /dev/null 2>&1

# Установка необходимых пакетов
packages=("git" "curl" "wget" "unzip" "ufw" "python3" "python3-pip")
for package in "${packages[@]}"; do
    if ! dpkg -l | grep -q "$package"; then
        print_info "Установка $package..."
        apt install -y $package > /dev/null 2>&1
    fi
done

print_success "Зависимости установлены"

# ========================================
# Шаг 2: Установка Docker и Docker Compose
# ========================================
print_info "Шаг 2: Установка Docker и Docker Compose..."

if ! command -v docker &> /dev/null; then
    print_info "Установка Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh > /dev/null 2>&1
    rm get-docker.sh
    usermod -aG docker $SUDO_USER
    print_success "Docker установлен"
else
    print_success "Docker уже установлен"
fi

if ! command -v docker-compose &> /dev/null; then
    print_info "Установка Docker Compose..."
    curl -SL https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose установлен"
else
    print_success "Docker Compose уже установлен"
fi

# ========================================
# Шаг 3: Настройка брандмауэра
# ========================================
print_info "Шаг 3: Настройка брандмауэра..."

ufw allow OpenSSH > /dev/null 2>&1
ufw allow 80/tcp > /dev/null 2>&1
ufw allow 443/tcp > /dev/null 2>&1
ufw --force enable > /dev/null 2>&1
print_success "Брандмауэр настроен"

# ========================================
# Шаг 4: Создание структуры проекта
# ========================================
print_info "Шаг 4: Создание структуры проекта..."

PROJECT_DIR="/var/www/mycloud"
mkdir -p $PROJECT_DIR

# Копирование файлов из текущей директории (если запускается локально)
if [ -d "/root/mycloud" ]; then
    cp -r /root/mycloud/* $PROJECT_DIR/
else
    print_warning "Локальные файлы не найдены. Клонируем из GitHub..."
    read -p "Введите URL репозитория GitHub: " REPO_URL
    git clone $REPO_URL $PROJECT_DIR
fi

cd $PROJECT_DIR

print_success "Структура проекта создана"

# ========================================
# Шаг 5: Настройка переменных окружения
# ========================================
print_info "Шаг 5: Настройка переменных окружения..."

# Бэкенд .env
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    print_warning "Файл backend/.env создан из примера. ЗАПОЛНИТЕ ЕГО РЕАЛЬНЫМИ ЗНАЧЕНИЯМИ!"
    print_info "Откройте файл: nano backend/.env"
fi

# Фронтенд .env
if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    print_warning "Файл frontend/.env создан из примера. ЗАПОЛНИТЕ ЕГО РЕАЛЬНЫМИ ЗНАЧЕНИЯМИ!"
    print_info "Откройте файл: nano frontend/.env"
fi

print_success "Переменные окружения настроены"

# ========================================
# Шаг 6: Копирование конфигурационных файлов
# ========================================
print_info "Шаг 6: Копирование конфигурационных файлов..."

cp deploy/backend.Dockerfile backend/Dockerfile
cp deploy/frontend.Dockerfile frontend/Dockerfile
cp deploy/docker-compose.yml .
cp deploy/nginx.conf .

print_success "Конфигурационные файлы скопированы"

# ========================================
# Шаг 7: Запуск контейнеров
# ========================================
print_info "Шаг 7: Запуск контейнеров..."

docker-compose up -d --build

print_success "Контейнеры запущены"

# ========================================
# Шаг 8: Применение миграций
# ========================================
print_info "Шаг 8: Применение миграций базы данных..."

docker-compose exec -T backend python manage.py migrate

print_success "Миграции применены"

# ========================================
# Шаг 9: Создание суперпользователя
# ========================================
print_info "Шаг 9: Создание суперпользователя..."

print_warning "Создайте суперпользователя для доступа к админке Django"
docker-compose exec backend python manage.py createsuperuser

print_success "Суперпользователь создан"

# ========================================
# Шаг 10: Сбор статических файлов
# ========================================
print_info "Шаг 10: Сбор статических файлов..."

docker-compose exec -T backend python manage.py collectstatic --noinput

print_success "Статические файлы собраны"

# ========================================
# Шаг 11: Проверка работоспособности
# ========================================
print_info "Шаг 11: Проверка работоспособности..."

sleep 5  # Ждём, пока контейнеры полностью запустятся

if curl -s http://localhost > /dev/null 2>&1; then
    print_success "✅ Проект успешно развёрнут!"
    echo ""
    print_info "========================================"
    print_info "ВАЖНАЯ ИНФОРМАЦИЯ"
    print_info "========================================"
    echo ""
    print_info "1. Откройте в браузере:"
    print_info "   http://ваш_ip_адрес"
    echo ""
    print_info "2. Админка Django:"
    print_info "   http://ваш_ip_адрес/admin/"
    echo ""
    print_info "3. Для настройки HTTPS (SSL):"
    print_info "   sudo certbot --nginx -d ваш_домен.com"
    echo ""
    print_info "4. Логи проекта:"
    print_info "   docker-compose logs -f"
    echo ""
    print_info "5. Остановка проекта:"
    print_info "   docker-compose down"
    echo ""
    print_info "6. Перезапуск проекта:"
    print_info "   docker-compose restart"
    echo ""
else
    print_error "✗ Проект не запустился. Проверьте логи:"
    print_info "   docker-compose logs"
    exit 1
fi

# ========================================
# Финальное сообщение
# ========================================
echo ""
print_info "========================================"
print_success "РАЗВЁРТЫВАНИЕ ЗАВЕРШЕНО!"
print_info "========================================"
echo ""
print_info "Дальнейшие действия:"
print_info "1. Настройте доменное имя в файле nginx.conf"
print_info "2. Получите SSL сертификат через Let's Encrypt"
print_info "3. Настройте резервное копирование базы данных"
print_info "4. Ознакомьтесь с полной документацией в README.md"
echo ""
print_success "Спасибо за использование My Cloud! 🚀"