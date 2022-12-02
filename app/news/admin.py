from django.contrib import admin

# Register your models here.
from .models import NewsArticle

admin.site.register(NewsArticle)
