# -*- coding:utf-8 -*-
from umap.settings.base import *  # pylint: disable=W0614,W0401
import os

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-+q304+%(8^1#r49+0dbj584!k2n#wuc-a5^yx()jlf)quv+chu')
INTERNAL_IPS = ("127.0.0.1",)
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '127.0.0.1,localhost').split(",")   
CSRF_TRUSTED_ORIGINS = os.environ.get('CSRF_TRUSTED_ORIGINS', 'http://127.0.0.1').split(",")

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG='True'
DEBUG=os.getenv('DEBUG', 'False').lower() == 'true'

ADMINS = (("arbekos", "antonio@geoid.mx"),)
MANAGERS = ADMINS

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": os.environ.get('UMAP_DB_NAME', 'umap'),
        "USER": os.environ.get('UMAP_DB_USER', 'usermap'),
        "PASSWORD": os.environ.get('UMAP_DB_PASSWORD', '123456'),
        "HOST": os.environ.get('UMAP_DB_HOST', 'db'),
        "PORT": os.environ.get('UMAP_DB_PORT', '5432'),
    }
}

LANGUAGE_CODE = "es"

# Set to False if login into django account should not be possible. You can
# administer accounts in the admin interface.
ENABLE_ACCOUNT_LOGIN = True

AUTHENTICATION_BACKENDS = (
    "social_core.backends.openstreetmap.OpenStreetMapOAuth",
    "django.contrib.auth.backends.ModelBackend",
)

SOCIAL_AUTH_OPENSTREETMAP_OAUTH2_KEY = "xxx"
SOCIAL_AUTH_OPENSTREETMAP_OAUTH2_SECRET = "xxx"

MIDDLEWARE += ("social_django.middleware.SocialAuthExceptionMiddleware",)
SOCIAL_AUTH_REDIRECT_IS_HTTPS = True
SOCIAL_AUTH_RAISE_EXCEPTIONS = False
SOCIAL_AUTH_BACKEND_ERROR_URL = "/"

# If you want to add a playgroud map, add its primary key
# UMAP_DEMO_PK = 204
# If you want to add a showcase map on the home page, add its primary key
# UMAP_SHOWCASE_PK = 1156
# Add a baner to warn people this instance is not production ready.
UMAP_DEMO_SITE = False

# Whether to allow non authenticated people to create maps.
UMAP_ALLOW_ANONYMOUS = False

# This setting will exclude empty maps (in fact, it will exclude all maps where
# the default center has not been updated)
UMAP_EXCLUDE_DEFAULT_MAPS = False

# How many maps should be showcased on the main page resp. on the user page
UMAP_MAPS_PER_PAGE = 5
# How many maps should be looked for when performing a (sub)search
UMAP_MAPS_PER_SEARCH = 15
# How many maps should be showcased on the user page, if owner
UMAP_MAPS_PER_PAGE_OWNER = 10

SITE_URL = os.environ.get('UMAP_SITE_URL', "http://127.0.0.1:8000")

# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.filebased.FileBasedCache',
#         'LOCATION': '/var/tmp/django_cache',
#     }
# }

# POSTGIS_VERSION = (2, 1, 0)
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Put the site in readonly mode (useful for migration or any maintenance)
UMAP_READONLY = False


# For static deployment
STATIC_ROOT = os.environ.get('STATIC_ROOT', '/srv/umap/static')
# For users' statics (geojson mainly)
MEDIA_ROOT = os.environ.get('MEDIA_ROOT', '/srv/umap/data')
# Default map location for new maps
LEAFLET_LONGITUDE = 2
LEAFLET_LATITUDE = 51
LEAFLET_ZOOM = 6

# Number of old version to keep per datalayer.
UMAP_KEEP_VERSIONS = 10

### uMap settings

# Customization
UMAP_CUSTOM_TEMPLATES=os.environ.get('UMAP_CUSTOM_TEMPLATES', '/srv/umap/custom/templates')
UMAP_CUSTOM_STATICS=os.environ.get('UMAP_CUSTOM_STATICS', '/srv/umap/custom/static')

ENABLE_ACCOUNT_LOGIN_PROVIDERS = False

UMAP_HOST_INFOS = {
    "name": "Co.Mapper",
    "email": "hola@comapper.org",
    "url": "https://site.comapper.org/",
}

