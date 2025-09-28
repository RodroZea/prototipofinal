from pathlib import Path

# Base directory del proyecto
BASE_DIR = Path(__file__).resolve().parent.parent
LOGIN_REDIRECT_URL = 'home' 
# Seguridad
SECRET_KEY = 'django-insecure-4b7=&d9fisu*7qp4irm$$!g@e*!lof8_-hcg24nf@%!ju3+78o'
DEBUG = True
ALLOWED_HOSTS = []
LOGIN_URL = '/login/'
# Aplicaciones instaladas
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'helcon',  # Tu app
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mi_proyecto.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # carpeta global de templates
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.static',
                'helcon.context_processors.doctor_context',
                'helcon.context_processors.navbar_context',# <-- Agregamos aquí tu context processor
            ],
        },
    },
]

WSGI_APPLICATION = 'mi_proyecto.wsgi.application'

# Base de datos (sqlite por defecto)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Validadores de contraseña
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internacionalización
LANGUAGE_CODE = 'es'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# Archivos estáticos (CSS, JS, imágenes que no cambian)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'helcon' / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'  # solo para producción

# Archivos media (archivos subidos por usuarios, como las fotos de perfil)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Campo id automático por defecto para modelos
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# settings.py
# settings.py
STRIPE_PUBLIC_KEY = "sk_test_51RcR2MP7KXldavwCAbVCWDvSQ1w8iLtG4DXgi3lMlVL1cd5ZaJwv0PfGN32vtknHNszOtqOvBKQkYxWvLofNc19V00D1ipbvJL"
STRIPE_SECRET_KEY = "sk_test_51RcR2MP7KXldavwCAbVCWDvSQ1w8iLtG4DXgi3lMlVL1cd5ZaJwv0PfGN32vtknHNszOtqOvBKQkYxWvLofNc19V00D1ipbvJL"

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'         # Ejemplo: smtp.gmail.com si usas Gmail
EMAIL_PORT = 587                           # Puerto TLS estándar
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'armadillomedico2025@gmail.com'  # Aquí el correo específico que usarás para enviar
EMAIL_HOST_PASSWORD = 'txfq sxkl ovvh zucp'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


