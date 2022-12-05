from django.db import models

class NewsArticle(models.Model):
    link = models.URLField()
    headline = models.CharField(max_length=1000)
    category = models.CharField(max_length=50)
    short_description = models.TextField()
    authors = models.CharField(max_length=100)
    date = models.DateTimeField()
    socialist = models.CharField(max_length=50, null=True)
    liberal = models.CharField(max_length=50, null=True)
    conservative = models.CharField(max_length=50, null=True)
    autocratic = models.CharField(max_length=50, null=True)
    ml = models.CharField(max_length=50, null=True)

class NewsLabel(models.Model):
    id = models.AutoField(primary_key=True)
    value = models.IntegerField()
    title = models.CharField(max_length=255)

class NewsArticleNewsLabel(models.Model):
    news_article = models.ForeignKey('NewsArticle', on_delete=models.CASCADE)
    news_label = models.ForeignKey('NewsLabel', on_delete=models.CASCADE)
    percentage = models.FloatField()

class NewsVote(models.Model):
    news_article = models.ForeignKey('NewsArticle', on_delete=models.CASCADE)
    news_label = models.ForeignKey('NewsLabel', on_delete=models.CASCADE)