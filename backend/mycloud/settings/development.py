from .base import *

DEBUG = True

# Добавляем debug_toolbar только для разработки
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')

INTERNAL_IPS = ['127.0.0.1', 'localhost']

# Более подробное логирование для разработки
LOGGING['loggers']['django.db.backends']['level'] = 'DEBUG'
LOGGING['loggers']['mycloud']['level'] = 'DEBUG'