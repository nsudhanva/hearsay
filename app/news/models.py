from django.db import models

# Create your models here.
class NewsArticle(models.Model):
    link = models.URLField()
    headline = models.CharField(max_length=1000)
    category = models.CharField(max_length=50)
    short_description = models.TextField()
    authors = models.CharField(max_length=100)
    date = models.DateTimeField()