-- Создание пользователя и базы данных для разработки
CREATE USER mycloud_user WITH PASSWORD 'mycloud_password';
CREATE DATABASE mycloud_dev OWNER mycloud_user ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8' TEMPLATE template0;

-- Предоставление прав
GRANT ALL PRIVILEGES ON DATABASE mycloud_dev TO mycloud_user;

-- Подключение к базе данных
\c mycloud_dev

-- Предоставление прав на схему public
GRANT ALL ON SCHEMA public TO mycloud_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO mycloud_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO mycloud_user;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO mycloud_user;

-- Настройка прав по умолчанию для будущих объектов
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO mycloud_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO mycloud_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO mycloud_user;

-- Создание расширения для UUID (требуется для моделей)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";