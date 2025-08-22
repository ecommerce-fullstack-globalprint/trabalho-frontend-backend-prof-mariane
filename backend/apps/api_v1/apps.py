from django.apps import AppConfig


class ApiV1Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    verbose_name = 'Global Print API V1'
    name = 'apps.api_v1'
